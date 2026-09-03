// OpenMind — Simulado: diferente do Treino, não corrige questão a
// questão — só mostra a nota completa no final (nota, acertos, erros,
// tempo, desempenho por matéria).

document.addEventListener("DOMContentLoaded", () => {

    let usuarioAtual = null;
    let exercicios = [];
    let indiceAtual = 0;
    let respostas = []; // { exercicio, indiceEscolhido, correta }
    let indiceCorretoAtual = 0;
    const inicioSimulado = Date.now();

    OPENMIND_protegerPagina((usuario) => {
        usuarioAtual = usuario;

        OPENMIND_garantirMateriasSemeadas().then(OPENMIND_listarMaterias).then(materias => {
            const lang = getLang();
            const select = document.getElementById("selectMateria");
            materias.forEach(m => {
                const opcao = document.createElement("option");
                opcao.value = m.id;
                opcao.textContent = lang === "en" ? m.nameEn : m.namePt;
                select.appendChild(opcao);
            });
        });
    });

    document.getElementById("btnIniciarSimulado").addEventListener("click", () => {

        const subjectId = document.getElementById("selectMateria").value || null;
        const quantidade = parseInt(document.getElementById("selectQuantidade").value, 10);

        OPENMIND_garantirExerciciosSemeados()
            .then(() => OPENMIND_buscarLoteSimulado(subjectId, quantidade))
            .then(lote => {
                exercicios = lote;

                if (exercicios.length === 0) {
                    document.getElementById("viewConfig").classList.add("oculto-auth");
                    document.getElementById("viewSemExercicios").classList.remove("oculto-auth");
                    return;
                }

                document.getElementById("viewConfig").classList.add("oculto-auth");
                document.getElementById("viewQuestao").classList.remove("oculto-auth");
                document.getElementById("barraProgressoWrap").classList.remove("oculto-auth");
                document.getElementById("btnProxima").addEventListener("click", proximaQuestao);
                renderizarQuestao();
            });
    });

    function renderizarQuestao() {

        const exercicio = exercicios[indiceAtual];
        const lang = getLang();

        document.getElementById("barraProgresso").style.width = Math.round((indiceAtual / exercicios.length) * 100) + "%";

        const rotulos = { basic: "🟢 Basic", intermediate: "🟡 Intermediate", advanced: "🔴 Advanced" };
        const pill = document.getElementById("pillDificuldade");
        pill.className = "pill-dificuldade pill-" + (exercicio.difficulty || "basic");
        pill.textContent = rotulos[exercicio.difficulty] || rotulos.basic;

        document.getElementById("textoQuestao").textContent = lang === "en" ? exercicio.questionEn : exercicio.questionPt;

        const opcoesOriginais = (lang === "en" ? exercicio.optionsEn : exercicio.optionsPt) || exercicio.optionsPt;
        const embaralhadas = opcoesOriginais.map((texto, indiceOriginal) => ({ texto, indiceOriginal }));
        OPENMIND_embaralhar(embaralhadas);
        indiceCorretoAtual = embaralhadas.findIndex(item => item.indiceOriginal === exercicio.correct);

        const listaOpcoes = document.getElementById("listaOpcoes");
        listaOpcoes.innerHTML = "";
        document.getElementById("btnProxima").classList.add("oculto-auth");

        embaralhadas.forEach((item, indice) => {
            const botao = document.createElement("button");
            botao.className = "opcao-treino";
            botao.textContent = item.texto;
            botao.addEventListener("click", () => escolher(botao, indice));
            listaOpcoes.appendChild(botao);
        });
    }

    function escolher(botaoClicado, indiceEscolhido) {

        const exercicio = exercicios[indiceAtual];
        const correta = indiceEscolhido === indiceCorretoAtual;

        // Simulado não mostra se acertou ou errou agora — só marca
        // qual foi escolhida (visual neutro) e libera "Próxima".
        document.querySelectorAll(".opcao-treino").forEach(b => b.classList.remove("selecionada"));
        botaoClicado.classList.add("selecionada");

        respostas[indiceAtual] = { exercicio, indiceEscolhido, correta };
        document.getElementById("btnProxima").classList.remove("oculto-auth");
    }

    function proximaQuestao() {
        indiceAtual++;
        if (indiceAtual < exercicios.length) {
            renderizarQuestao();
        } else {
            finalizarSimulado();
        }
    }

    function finalizarSimulado() {

        document.getElementById("viewQuestao").classList.add("oculto-auth");
        document.getElementById("barraProgressoWrap").classList.add("oculto-auth");

        const lang = getLang();
        const total = exercicios.length;
        const acertos = respostas.filter(r => r && r.correta).length;
        const nota = Math.round((acertos / total) * 100);
        const duracaoMin = Math.max(1, Math.round((Date.now() - inicioSimulado) / 60000));

        // Desempenho por matéria
        const porMateria = {};
        respostas.forEach(r => {
            if (!r) return;
            const id = r.exercicio.subjectId;
            if (!porMateria[id]) porMateria[id] = { certas: 0, total: 0 };
            porMateria[id].total++;
            if (r.correta) porMateria[id].certas++;
        });

        document.getElementById("notaFinal").textContent = nota + "%";
        document.getElementById("resumoSimulado").textContent = lang === "en"
            ? `${acertos} of ${total} correct · ${duracaoMin} min`
            : `${acertos} de ${total} corretas · ${duracaoMin} min`;

        OPENMIND_listarMaterias().then(materias => {
            const materiasPorId = {};
            materias.forEach(m => { materiasPorId[m.id] = m; });

            document.getElementById("desempenhoPorMateria").innerHTML = Object.keys(porMateria).map(id => {
                const materia = materiasPorId[id];
                const nome = materia ? (lang === "en" ? materia.nameEn : materia.namePt) : id;
                const dados = porMateria[id];
                const percentual = Math.round((dados.certas / dados.total) * 100);
                return `
                <div class="subject-card">
                    <div><strong>${nome}</strong><small>${dados.certas}/${dados.total}</small></div>
                    <span>${percentual}%</span>
                </div>`;
            }).join("");

            document.getElementById("viewDesempenho").classList.remove("oculto-auth");
        });

        // Atualiza XP/exercícios/tempo no perfil, igual ao Treino.
        OPENMIND_carregarPerfil(usuarioAtual.uid).then(perfil => {
            OPENMIND_salvarPerfil(usuarioAtual.uid, {
                exercisesDone: (perfil.exercisesDone || 0) + total,
                correctAnswers: (perfil.correctAnswers || 0) + acertos,
                xp: (perfil.xp || 0) + acertos * 10,
                totalStudyTime: (perfil.totalStudyTime || 0) + duracaoMin
            });
        });

        // Registra cada resposta e o progresso adaptativo, igual ao Treino.
        respostas.forEach(r => {
            if (!r) return;
            OPENMIND_registrarResposta(usuarioAtual.uid, { exercicio: r.exercicio, respostaIndice: r.indiceEscolhido, correta: r.correta, tempoMs: 0 });
            if (typeof OPENMIND_atualizarProgressoTopico === "function") {
                OPENMIND_atualizarProgressoTopico(usuarioAtual.uid, {
                    subjectId: r.exercicio.subjectId,
                    topicId: r.exercicio.topicId,
                    difficulty: r.exercicio.difficulty,
                    correta: r.correta
                });
            }
        });

        document.getElementById("viewResultado").classList.remove("oculto-auth");
    }
});
