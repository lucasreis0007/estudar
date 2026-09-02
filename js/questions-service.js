// OpenMind — exercícios como dado real no Firestore. Mesmo padrão de
// subjects-service.js: a UI nunca lê js/data/openmind-questions.js
// diretamente — só chama estas funções.

const OPENMIND_COLECAO_EXERCICIOS = "questions";
const OPENMIND_COLECAO_RESPOSTAS = "answers";

function OPENMIND_garantirExerciciosSemeados() {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_EXERCICIOS).limit(1).get().then(function (snap) {
        if (!snap.empty) return;

        const lote = OPENMIND_DB.batch();
        OPENMIND_QUESTIONS.forEach(function (exercicio) {
            const ref = OPENMIND_DB.collection(OPENMIND_COLECAO_EXERCICIOS).doc(exercicio.id);
            lote.set(ref, exercicio);
        });
        return lote.commit();
    });
}

// Busca um lote de exercícios para uma sessão de treino (de uma matéria
// específica, ou de todas se subjectId for null).
function OPENMIND_buscarLoteExercicios(subjectId, quantidade) {
    const colecao = OPENMIND_DB.collection(OPENMIND_COLECAO_EXERCICIOS);
    const consulta = subjectId ? colecao.where("subjectId", "==", subjectId) : colecao;

    return consulta.get().then(function (snap) {
        const todos = snap.docs.map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); });
        OPENMIND_embaralhar(todos);
        return todos.slice(0, quantidade || 10);
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

function OPENMIND_embaralhar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = lista[i]; lista[i] = lista[j]; lista[j] = tmp;
    }
}
