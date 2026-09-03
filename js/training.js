// OpenMind — motor de treino: pergunta, corrige, explica, atualiza perfil.

document.addEventListener("DOMContentLoaded", () => {

    const subjectId = new URLSearchParams(location.search).get("materia");
    const modoRevisao = new URLSearchParams(location.search).get("revisao") === "1";

    let usuarioAtual = null;
    let perfilAtual = null;
    let exercicios = [];
    let indiceAtual = 0;
    let acertos = 0;
    let indiceCorretoAtual = 0;
    const inicioSessao = Date.now();
    let inicioQuestao = Date.now();

    OPENMIND_protegerPagina((usuario, perfil) => {
        usuarioAtual = usuario;
        perfilAtual = perfil;

        OPENMIND_garantirExerciciosSemeados()
            .then(() => modoRevisao
                ? OPENMIND_buscarLoteRevisao(usuario.uid, 10)
                : OPENMIND_buscarLoteExercicios(subjectId, 10, usuario.uid))
            .then(lote => {
                exercicios = lote;

                if (exercicios.length === 0) {
                    document.getElementById("viewSemExercicios").classList.remove("oculto-auth");
                    const lang = getLang();
                    if (modoRevisao) {
                        document.getElementById("contadorQuestao").textContent = lang === "en" ? "Nothing to review" : "Nada pra revisar";
                        document.querySelector("#viewSemExercicios h1").textContent = lang === "en"
                            ? "🎉 Nothing to review right now — keep training!"
                            : "🎉 Nada pra revisar agora — continue treinando!";
                    } else {
                        document.getElementById("contadorQuestao").textContent = lang === "en" ? "No exercises" : "Nenhum exercício";
                    }
                    return;
                }

                document.getElementById("viewQuestao").classList.remove("oculto-auth");
                document.getElementById("btnProxima").addEventListener("click", proximaQuestao);
                renderizarQuestao();
            });
    });

    function renderizarQuestao() {

        const exercicio = exercicios[indiceAtual];
        inicioQuestao = Date.now();
        const lang = getLang();

        const prefixo = modoRevisao ? (lang === "en" ? "Review · " : "Revisão · ") : "";
        document.getElementById("contadorQuestao").textContent = prefixo +
            (lang === "en" ? "Question " : "Questão ") + (indiceAtual + 1) + (lang === "en" ? " of " : " de ") + exercicios.length;

        document.getElementById("barraProgresso").style.width =
            Math.round((indiceAtual / exercicios.length) * 100) + "%";

        const rotulos = { basic: "🟢 Basic", intermediate: "🟡 Intermediate", advanced: "🔴 Advanced" };
        const pill = document.getElementById("pillDificuldade");
        pill.className = "pill-dificuldade pill-" + (exercicio.difficulty || "basic");
        pill.textContent = rotulos[exercicio.difficulty] || rotulos.basic;

        document.getElementById("textoQuestao").textContent = lang === "en" ? exercicio.questionEn : exercicio.questionPt;

        const opcoesOriginais = (lang === "en" ? exercicio.optionsEn : exercicio.optionsPt) || exercicio.optionsPt;

        // As opções nunca são mostradas na ordem salva — embaralhamos
        // aqui (guardando a posição nova da certa) pra resposta certa
        // nunca cair sempre na mesma posição.
        const embaralhadas = opcoesOriginais.map((texto, indiceOriginal) => ({ texto, indiceOriginal }));
        OPENMIND_embaralhar(embaralhadas);
        indiceCorretoAtual = embaralhadas.findIndex(item => item.indiceOriginal === exercicio.correct);

        const listaOpcoes = document.getElementById("listaOpcoes");
        listaOpcoes.innerHTML = "";

        embaralhadas.forEach((item, indice) => {
            const botao = document.createElement("button");
            botao.className = "opcao-treino";
            botao.textContent = item.texto;
            botao.addEventListener("click", () => responder(indice));
            listaOpcoes.appendChild(botao);
        });

        document.getElementById("painelCorrecao").classList.add("oculto-auth");
    }

    function responder(indiceEscolhido) {

        const exercicio = exercicios[indiceAtual];
        const lang = getLang();
        const correta = indiceEscolhido === indiceCorretoAtual;
        const tempoMs = Date.now() - inicioQuestao;

        if (correta) acertos++;

        document.querySelectorAll(".opcao-treino").forEach((botao, indice) => {
            botao.disabled = true;
            if (indice === indiceCorretoAtual) botao.classList.add("correta");
            else if (indice === indiceEscolhido) botao.classList.add("incorreta");
        });

        document.getElementById("resultadoCorrecao").textContent = correta
            ? (lang === "en" ? "✅ Correct!" : "✅ Correto!")
            : (lang === "en" ? "❌ Incorrect" : "❌ Incorreto");
        document.getElementById("resultadoCorrecao").style.color = correta ? "#166534" : "#991b1b";
        document.getElementById("explicacaoCorrecao").textContent = lang === "en" ? exercicio.explanationEn : exercicio.explanationPt;
        document.getElementById("painelCorrecao").classList.remove("oculto-auth");

        mostrarVocabularioRelacionado(exercicio.subjectId);

        OPENMIND_registrarResposta(usuarioAtual.uid, { exercicio, respostaIndice: indiceEscolhido, correta, tempoMs });
        OPENMIND_atualizarProgressoTopico(usuarioAtual.uid, {
            subjectId: exercicio.subjectId,
            topicId: exercicio.topicId,
            difficulty: exercicio.difficulty,
            correta: correta
        });
    }

    function mostrarVocabularioRelacionado(subjectId) {
        const bloco = document.getElementById("vocabRelacionado");
        if (!window.OPENMIND_VOCABULARY) { bloco.classList.add("oculto-auth"); return; }

        const candidatas = OPENMIND_VOCABULARY.filter(v => v.category === subjectId);
        if (candidatas.length === 0) { bloco.classList.add("oculto-auth"); return; }

        const palavra = candidatas[Math.floor(Math.random() * candidatas.length)];
        document.getElementById("vocabRelacionadoEn").textContent = palavra.english;
        document.getElementById("vocabRelacionadoPt").textContent = palavra.portuguese;
        bloco.classList.remove("oculto-auth");
    }

    function proximaQuestao() {
        indiceAtual++;
        if (indiceAtual < exercicios.length) {
            renderizarQuestao();
        } else {
            finalizarTreino();
        }
    }

    function finalizarTreino() {

        document.getElementById("viewQuestao").classList.add("oculto-auth");
        document.getElementById("barraProgresso").style.width = "100%";

        const total = exercicios.length;
        const xpGanho = acertos * 10;
        const duracaoMin = Math.max(1, Math.round((Date.now() - inicioSessao) / 60000));
        const lang = getLang();

        const novoXp = (perfilAtual.xp || 0) + xpGanho;
        const sequencia = OPENMIND_calcularNovaSequencia(perfilAtual);
        const conquistasAntes = OPENMIND_conquistasDesbloqueadas(perfilAtual);

        const perfilAtualizado = Object.assign({}, perfilAtual, {
            exercisesDone: (perfilAtual.exercisesDone || 0) + total,
            correctAnswers: (perfilAtual.correctAnswers || 0) + acertos,
            xp: novoXp,
            level: OPENMIND_calcularNivel(novoXp),
            totalStudyTime: (perfilAtual.totalStudyTime || 0) + duracaoMin,
            streak: sequencia.streak,
            lastStudyDate: sequencia.lastStudyDate
        });

        OPENMIND_salvarPerfil(usuarioAtual.uid, perfilAtualizado);

        const conquistasDepois = OPENMIND_conquistasDesbloqueadas(perfilAtualizado);
        const novasConquistas = conquistasDepois.filter(c => !conquistasAntes.some(a => a.id === c.id));

        let texto = lang === "en"
            ? `You got ${acertos} of ${total} questions right. +${xpGanho} XP`
            : `Você acertou ${acertos} de ${total} questões. +${xpGanho} XP`;

        if (novasConquistas.length > 0) {
            texto += " — " + novasConquistas.map(c => c.icone + " " + (lang === "en" ? c.nameEn : c.namePt)).join(" · ");
        }

        document.getElementById("resumoResultado").textContent = texto;
        document.getElementById("viewResultado").classList.remove("oculto-auth");
    }
});
