// OpenMind — exercícios como dado real no Firestore. Mesmo padrão de
// subjects-service.js: a UI nunca lê js/data/openmind-questions.js
// diretamente — só chama estas funções.

const OPENMIND_COLECAO_EXERCICIOS = "questions";
const OPENMIND_COLECAO_RESPOSTAS = "answers";

// Verifica um documento conhecido (não só "a coleção está vazia") —
// isso corrige sozinho o caso de já existir dado de um formato antigo
// nessa mesma coleção (ex: de outro projeto usando o mesmo Firebase).
function OPENMIND_garantirExerciciosSemeados() {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_EXERCICIOS).doc(OPENMIND_QUESTIONS[0].id).get().then(function (doc) {
        if (doc.exists && typeof doc.data().correct === "number") return;

        const lote = OPENMIND_DB.batch();
        OPENMIND_QUESTIONS.forEach(function (exercicio) {
            const ref = OPENMIND_DB.collection(OPENMIND_COLECAO_EXERCICIOS).doc(exercicio.id);
            lote.set(ref, exercicio);
        });
        return lote.commit();
    });
}

// Busca um lote de exercícios para uma sessão de treino (de uma matéria
// específica, ou de todas se subjectId for null). Descarta qualquer
// documento que não tenha o formato esperado (proteção contra dado de
// outro schema acabar misturado na mesma coleção).
//
// Quando um uid é passado, a seleção é ADAPTATIVA: para cada tópico,
// perguntamos ao sistema adaptativo qual dificuldade o usuário deveria
// receber agora e priorizamos esses exercícios — sem excluir os outros
// níveis, pro lote nunca ficar vazio por falta de conteúdo.
function OPENMIND_buscarLoteExercicios(subjectId, quantidade, uid) {
    const colecao = OPENMIND_DB.collection(OPENMIND_COLECAO_EXERCICIOS);
    const consulta = subjectId ? colecao.where("subjectId", "==", subjectId) : colecao;

    return consulta.get().then(function (snap) {
        const todos = snap.docs
            .map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); })
            .filter(function (q) { return typeof q.correct === "number" && Array.isArray(q.optionsPt); });

        if (!uid) {
            OPENMIND_embaralhar(todos);
            return todos.slice(0, quantidade || 10);
        }

        const progressoPromessa = subjectId
            ? OPENMIND_obterProgressoMateria(uid, subjectId)
            : OPENMIND_obterProgressoTodasMaterias(uid).then(function (porMateria) {
                return Object.keys(porMateria).reduce(function (lista, chave) { return lista.concat(porMateria[chave]); }, []);
            });

        return progressoPromessa.then(function (registros) {
            const porTopico = {};
            registros.forEach(function (r) { porTopico[r.topicId] = r; });

            const pontuados = todos.map(function (exercicio) {
                const recomendado = OPENMIND_nivelRecomendado(porTopico[exercicio.topicId]);
                return { exercicio: exercicio, prioridade: exercicio.difficulty === recomendado ? 0 : 1, sorteio: Math.random() };
            });

            pontuados.sort(function (a, b) { return a.prioridade - b.prioridade || a.sorteio - b.sorteio; });

            return pontuados.slice(0, quantidade || 10).map(function (item) { return item.exercicio; });
        });
    });
}

function OPENMIND_registrarResposta(uid, dados) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_RESPOSTAS).add({
        userId: uid,
        questionId: dados.exercicio.id,
        subjectId: dados.exercicio.subjectId,
        topicId: dados.exercicio.topicId,
        difficulty: dados.exercicio.difficulty,
        respostaIndice: dados.respostaIndice,
        correta: dados.correta,
        tempoMs: dados.tempoMs,
        createdAt: new Date().toISOString()
    }).catch(function (erro) { console.error("Erro ao registrar resposta:", erro); });
}

function OPENMIND_adicionarExercicio(dados) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_EXERCICIOS).add(dados);
}

function OPENMIND_embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = lista[i]; lista[i] = lista[j]; lista[j] = tmp;
    }
}

// Monta um SIMULADO: mistura de dificuldades (aprox. 1/3 basic, 1/3
// intermediate, 1/3 advanced), de uma matéria específica ou de todas.
// Diferente do treino, o simulado não corrige questão a questão — só
// no final (ver pages/simulator.html).
function OPENMIND_buscarLoteSimulado(subjectId, quantidade) {
    const colecao = OPENMIND_DB.collection(OPENMIND_COLECAO_EXERCICIOS);
    const consulta = subjectId ? colecao.where("subjectId", "==", subjectId) : colecao;

    return consulta.get().then(function (snap) {
        const todos = snap.docs
            .map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); })
            .filter(function (q) { return typeof q.correct === "number" && Array.isArray(q.optionsPt); });

        const porNivel = { basic: [], intermediate: [], advanced: [] };
        todos.forEach(function (q) {
            if (porNivel[q.difficulty]) porNivel[q.difficulty].push(q);
        });
        OPENMIND_embaralhar(porNivel.basic);
        OPENMIND_embaralhar(porNivel.intermediate);
        OPENMIND_embaralhar(porNivel.advanced);

        const porParte = Math.ceil((quantidade || 10) / 3);
        let selecionadas = porNivel.basic.slice(0, porParte)
            .concat(porNivel.intermediate.slice(0, porParte))
            .concat(porNivel.advanced.slice(0, porParte));

        // Se algum nível não tiver questões suficientes, completa com o
        // que sobrar dos outros (pra não entregar um simulado menor que
        // o pedido, quando dá pra evitar).
        if (selecionadas.length < (quantidade || 10)) {
            const usadas = new Set(selecionadas.map(function (q) { return q.id; }));
            const resto = todos.filter(function (q) { return !usadas.has(q.id); });
            OPENMIND_embaralhar(resto);
            selecionadas = selecionadas.concat(resto.slice(0, (quantidade || 10) - selecionadas.length));
        }

        OPENMIND_embaralhar(selecionadas);
        return selecionadas.slice(0, quantidade || 10);
    });
}

// Monta um treino só com exercícios dos tópicos que o usuário está com
// desempenho fraco (< 60%) — usado pela "Revisão" do Dashboard/Treino.
// O Firestore só aceita até 10 valores num "in", então limitamos aos 10
// tópicos mais fracos.
function OPENMIND_buscarLoteRevisao(uid, quantidade) {
    return OPENMIND_topicosParaRevisar(uid).then(function (fracos) {
        if (fracos.length === 0) return [];

        const topicIds = fracos.slice(0, 10).map(function (f) { return f.topicId; });

        return OPENMIND_DB.collection(OPENMIND_COLECAO_EXERCICIOS)
            .where("topicId", "in", topicIds)
            .get()
            .then(function (snap) {
                const todos = snap.docs
                    .map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); })
                    .filter(function (q) { return typeof q.correct === "number" && Array.isArray(q.optionsPt); });
                OPENMIND_embaralhar(todos);
                return todos.slice(0, quantidade || 10);
            });
    });
}
