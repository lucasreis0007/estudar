// OpenMind — modal de geração de conteúdo com IA.
// Fluxo: configurar → gerar (Cloud Function) → revisar/editar/selecionar
// → salvar só o que foi selecionado. Nada é gravado no Firestore antes
// da revisão do usuário.

document.addEventListener("DOMContentLoaded", () => {

    const subjectId = new URLSearchParams(location.search).get("id");
    if (!subjectId) return;

    const overlay = document.getElementById("overlayIA");
    const btnAbrir = document.getElementById("btnAbrirModalIA");
    const btnFechar = document.getElementById("btnFecharModalIA");
    const btnFecharRevisao = document.getElementById("btnFecharModalIARevisao");
    const btnGerar = document.getElementById("btnGerarConteudo");
    const btnSalvar = document.getElementById("btnSalvarSelecionados");

    const telaConfig = document.getElementById("iaTelaConfig");
    const telaCarregando = document.getElementById("iaTelaCarregando");
    const telaRevisao = document.getElementById("iaTelaRevisao");

    let materiaAtual = null;
    let conteudoGerado = null; // { topics, questions, challenges, vocabulary }
    let selecionados = null;   // mesmos índices, valor boolean

    // ---------------- ABRIR / FECHAR ----------------

    btnAbrir.addEventListener("click", () => {
        overlay.classList.remove("oculto-auth");
        mostrarTela(telaConfig);
        document.getElementById("erroIA").textContent = "";

        if (!materiaAtual) {
            OPENMIND_buscarMateria(subjectId).then(m => { materiaAtual = m; });
        }
    });

    function fecharModal() {
        overlay.classList.add("oculto-auth");
    }

    btnFechar.addEventListener("click", fecharModal);
    btnFecharRevisao.addEventListener("click", fecharModal);
    overlay.addEventListener("click", evento => { if (evento.target === overlay) fecharModal(); });

    function mostrarTela(tela) {
        [telaConfig, telaCarregando, telaRevisao].forEach(t => t.classList.add("oculto-auth"));
        tela.classList.remove("oculto-auth");
    }

    // ---------------- SELETORES DE PILL (quantidade/dificuldade/idioma) ----------------

    function ligarPills(containerId) {
        const container = document.getElementById(containerId);
        container.querySelectorAll(".pill-opcao").forEach(botao => {
            botao.addEventListener("click", () => {
                container.querySelectorAll(".pill-opcao").forEach(b => b.classList.remove("ativo"));
                botao.classList.add("ativo");
            });
        });
    }
    ligarPills("opcoesQuantidade");
    ligarPills("opcoesDificuldade");
    ligarPills("opcoesIdioma");

    function valorAtivo(containerId) {
        return document.querySelector(`#${containerId} .pill-opcao.ativo`).dataset.valor;
    }

    // ---------------- GERAR ----------------

    const MENSAGENS_CARREGANDO = {
        "pt-BR": ["Analisando a matéria...", "Criando assuntos...", "Criando exercícios...", "Criando vocabulário...", "Finalizando..."],
        en: ["Analyzing the subject...", "Creating topics...", "Creating exercises...", "Creating vocabulary...", "Finishing up..."]
    };

    btnGerar.addEventListener("click", () => {

        const tipos = Array.from(document.querySelectorAll(".checkbox-ia input:checked")).map(c => c.value);
        const erroEl = document.getElementById("erroIA");
        erroEl.textContent = "";

        if (tipos.length === 0) {
            const lang = getLang();
            erroEl.textContent = lang === "en" ? "Choose at least one type of content." : "Escolha pelo menos um tipo de conteúdo.";
            return;
        }

        mostrarTela(telaCarregando);
        const lang = getLang();
        const mensagens = MENSAGENS_CARREGANDO[lang] || MENSAGENS_CARREGANDO["pt-BR"];
        let indiceMsg = 0;
        document.getElementById("iaPassoAtual").textContent = mensagens[0];
        const intervaloMsg = setInterval(() => {
            indiceMsg = (indiceMsg + 1) % mensagens.length;
            document.getElementById("iaPassoAtual").textContent = mensagens[indiceMsg];
        }, 2200);

        OPENMIND_gerarConteudoIA({
            subjectNamePt: materiaAtual ? materiaAtual.namePt : "",
            subjectNameEn: materiaAtual ? materiaAtual.nameEn : "",
            tipos: tipos,
            quantidade: parseInt(valorAtivo("opcoesQuantidade"), 10),
            dificuldade: valorAtivo("opcoesDificuldade"),
            idioma: valorAtivo("opcoesIdioma")
        }).then(conteudo => {
            clearInterval(intervaloMsg);
            conteudoGerado = conteudo;
            selecionados = {
                topics: conteudo.topics.map(() => true),
                questions: conteudo.questions.map(() => true),
                challenges: conteudo.challenges.map(() => true),
                vocabulary: conteudo.vocabulary.map(() => true)
            };
            renderizarRevisao();
            mostrarTela(telaRevisao);
        }).catch(erro => {
            clearInterval(intervaloMsg);
            console.error("Erro ao gerar conteúdo:", erro);
            mostrarTela(telaConfig);
            erroEl.textContent = OPENMIND_traduzirErroIA(erro);
        });
    });

    // ---------------- REVISÃO (editar / excluir / selecionar) ----------------

    function renderizarRevisao() {

        const lang = getLang();
        const secoes = [];

        if (conteudoGerado.topics.length > 0) {
            secoes.push(secaoRevisao("topics", lang === "en" ? "Topics" : "Assuntos", conteudoGerado.topics,
                (item) => item.namePt));
        }
        if (conteudoGerado.questions.length > 0) {
            secoes.push(secaoRevisao("questions", lang === "en" ? "Exercises" : "Exercícios", conteudoGerado.questions,
                (item) => item.questionPt));
        }
        if (conteudoGerado.challenges.length > 0) {
            secoes.push(secaoRevisao("challenges", lang === "en" ? "Challenges" : "Desafios", conteudoGerado.challenges,
                (item) => item.titlePt));
        }
        if (conteudoGerado.vocabulary.length > 0) {
            secoes.push(secaoRevisao("vocabulary", lang === "en" ? "Vocabulary" : "Vocabulário", conteudoGerado.vocabulary,
                (item) => item.english + " / " + item.portuguese));
        }

        document.getElementById("iaRevisaoConteudo").innerHTML = secoes.join("");

        // Liga os eventos depois de inserir no DOM.
        ["topics", "questions", "challenges", "vocabulary"].forEach(tipo => {
            (conteudoGerado[tipo] || []).forEach((item, indice) => {
                const checkbox = document.getElementById(`sel-${tipo}-${indice}`);
                if (checkbox) checkbox.addEventListener("change", () => { selecionados[tipo][indice] = checkbox.checked; });

                const btnExcluir = document.getElementById(`del-${tipo}-${indice}`);
                if (btnExcluir) btnExcluir.addEventListener("click", () => {
                    conteudoGerado[tipo].splice(indice, 1);
                    selecionados[tipo].splice(indice, 1);
                    renderizarRevisao();
                });
            });
        });
    }

    function secaoRevisao(tipo, titulo, itens, obterTexto) {
        const linhas = itens.map((item, indice) => `
            <div class="ia-item-revisao">
                <label class="checkbox-ia">
                    <input type="checkbox" id="sel-${tipo}-${indice}" ${selecionados[tipo][indice] ? "checked" : ""}>
                </label>
                <span class="ia-item-texto">${escaparHtml(obterTexto(item))}</span>
                <button type="button" class="ia-item-excluir" id="del-${tipo}-${indice}">🗑️</button>
            </div>
        `).join("");

        return `<div class="ia-secao-revisao"><h3>${titulo} <small>(${itens.length})</small></h3>${linhas}</div>`;
    }

    function escaparHtml(texto) {
        const div = document.createElement("div");
        div.textContent = texto || "";
        return div.innerHTML;
    }

    // ---------------- SALVAR SELECIONADOS ----------------

    btnSalvar.addEventListener("click", () => {

        btnSalvar.disabled = true;

        // Salva tópicos primeiro (pra ter os IDs reais do Firestore),
        // depois usa esses IDs pra ligar as questões corretamente —
        // exatamente a mesma coleção/estrutura usada por conteúdo
        // criado manualmente (nenhum sistema separado pra IA).
        const topicosSelecionados = conteudoGerado.topics
            .map((t, i) => ({ topico: t, selecionado: selecionados.topics[i], indiceOriginal: i }))
            .filter(x => x.selecionado);

        const promessasTopicos = topicosSelecionados.map(x =>
            OPENMIND_adicionarTopico(subjectId, {
                namePt: x.topico.namePt,
                nameEn: x.topico.nameEn,
                descriptionPt: x.topico.descriptionPt,
                difficulty: x.topico.difficulty
            }).then(ref => ({ indiceOriginal: x.indiceOriginal, topicId: ref.id }))
        );

        Promise.all(promessasTopicos).then(mapeamentoTopicos => {

            const topicIdPorIndiceOriginal = {};
            mapeamentoTopicos.forEach(m => { topicIdPorIndiceOriginal[m.indiceOriginal] = m.topicId; });

            const tarefas = [];

            conteudoGerado.questions.forEach((q, i) => {
                if (!selecionados.questions[i]) return;
                const topicId = topicIdPorIndiceOriginal[q.topicIndex];
                if (!topicId) return; // tópico correspondente não foi selecionado
                tarefas.push(OPENMIND_adicionarExercicio({
                    subjectId: subjectId,
                    topicId: topicId,
                    difficulty: q.difficulty,
                    questionPt: q.questionPt,
                    questionEn: q.questionEn,
                    optionsPt: q.optionsPt,
                    optionsEn: q.optionsEn,
                    correct: q.correct,
                    explanationPt: q.explanationPt,
                    explanationEn: q.explanationEn
                }));
            });

            conteudoGerado.challenges.forEach((c, i) => {
                if (!selecionados.challenges[i]) return;
                tarefas.push(OPENMIND_adicionarDesafio(subjectId, c));
            });

            conteudoGerado.vocabulary.forEach((v, i) => {
                if (!selecionados.vocabulary[i]) return;
                tarefas.push(OPENMIND_adicionarPalavraVocabulario({
                    english: v.english,
                    portuguese: v.portuguese,
                    category: subjectId,
                    exampleEn: v.exampleEn,
                    examplePt: v.examplePt,
                    difficulty: v.difficulty
                }));
            });

            return Promise.all(tarefas);

        }).then(() => {
            fecharModal();
            btnSalvar.disabled = false;
            window.location.reload();
        }).catch(erro => {
            console.error("Erro ao salvar conteúdo gerado:", erro);
            btnSalvar.disabled = false;
            const lang = getLang();
            alert(lang === "en" ? "Couldn't save. Please try again." : "Não foi possível salvar. Tente novamente.");
        });
    });
});
