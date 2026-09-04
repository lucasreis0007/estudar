// OpenMind — Cloud Function "generateContent".
//
// Esta é a ÚNICA parte do OpenMind que fala com a OpenAI. A API key
// nunca chega ao navegador do usuário — fica guardada como "secret" do
// Firebase (ver README-DEPLOY.md) e só existe aqui, rodando no servidor
// do Google. O frontend chama esta function pelo SDK do Firebase
// (httpsCallable), que já garante que só usuário autenticado consegue
// chamar (request.auth vem preenchido automaticamente).

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

admin.initializeApp();

const openaiApiKey = defineSecret("OPENAI_API_KEY");

const TIPOS_VALIDOS = ["topics", "questions", "challenges", "vocabulary"];
const DIFICULDADES_VALIDAS = ["basic", "intermediate", "advanced", "mixed"];
const IDIOMAS_VALIDOS = ["pt", "en", "mixed"];

exports.generateContent = onCall(
    { secrets: [openaiApiKey], timeoutSeconds: 120, memory: "512MiB", region: "us-central1" },
    async (request) => {

        // ---------------- 1. SEGURANÇA: só usuário logado ----------------
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "Você precisa estar logado para gerar conteúdo.");
        }

        const inicio = Date.now();
        const uid = request.auth.uid;

        // ---------------- 2. VALIDAÇÃO DOS DADOS DE ENTRADA ----------------
        const dados = request.data || {};
        const subjectNamePt = String(dados.subjectNamePt || "").trim();
        const subjectNameEn = String(dados.subjectNameEn || "").trim();
        const tipos = Array.isArray(dados.tipos) ? dados.tipos.filter((t) => TIPOS_VALIDOS.includes(t)) : [];
        const dificuldade = DIFICULDADES_VALIDAS.includes(dados.dificuldade) ? dados.dificuldade : "mixed";
        const idioma = IDIOMAS_VALIDOS.includes(dados.idioma) ? dados.idioma : "pt";

        // Limite máximo por solicitação — evita gasto descontrolado e
        // respostas gigantes demais pro modelo estruturar bem.
        const quantidade = Math.min(Math.max(parseInt(dados.quantidade, 10) || 10, 5), 50);

        if (!subjectNamePt || tipos.length === 0) {
            throw new HttpsError("invalid-argument", "Informe a matéria e pelo menos um tipo de conteúdo.");
        }

        logger.info("generateContent solicitado", { uid, subjectNamePt, tipos, quantidade, dificuldade, idioma });

        // ---------------- 3. MONTA O PROMPT ----------------
        const prompt = montarPrompt({ subjectNamePt, subjectNameEn, tipos, quantidade, dificuldade, idioma });

        // ---------------- 4. CHAMA A OPENAI ----------------
        let respostaBruta;
        try {
            const resposta = await fetchComTimeout("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openaiApiKey.value()}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: PROMPT_SISTEMA },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.6,
                    response_format: { type: "json_object" }
                })
            }, 100000);

            if (!resposta.ok) {
                const textoErro = await resposta.text();
                logger.error("Erro HTTP da OpenAI", { status: resposta.status, textoErro });
                throw new HttpsError(
                    resposta.status === 429 ? "resource-exhausted" : "internal",
                    "Não foi possível gerar o conteúdo agora. Tente novamente."
                );
            }

            respostaBruta = await resposta.json();

        } catch (erro) {
            if (erro instanceof HttpsError) throw erro;
            logger.error("Falha ao chamar a OpenAI", erro);
            throw new HttpsError("unavailable", "Não foi possível gerar o conteúdo agora. Tente novamente.");
        }

        const textoConteudo = respostaBruta?.choices?.[0]?.message?.content;
        if (!textoConteudo) {
            logger.error("Resposta da OpenAI sem conteúdo", respostaBruta);
            throw new HttpsError("internal", "A IA não retornou conteúdo. Tente novamente.");
        }

        // ---------------- 5. PARSE E VALIDAÇÃO DO JSON ----------------
        let conteudo;
        try {
            conteudo = JSON.parse(textoConteudo);
        } catch (erro) {
            logger.error("JSON inválido retornado pela IA", { textoConteudo });
            throw new HttpsError("internal", "A IA retornou um formato inválido. Tente novamente.");
        }

        const normalizado = normalizarConteudo(conteudo);
        const duracaoMs = Date.now() - inicio;
        logger.info("generateContent concluído", {
            uid,
            duracaoMs,
            topics: normalizado.topics.length,
            questions: normalizado.questions.length,
            challenges: normalizado.challenges.length,
            vocabulary: normalizado.vocabulary.length
        });

        return normalizado;
    }
);

// ---------------- HELPERS ----------------

const PROMPT_SISTEMA = `Você é um especialista sênior em Eletromecânica industrial (motores, elétrica, manutenção, usinagem, desenho técnico) criando conteúdo educacional técnico para uma plataforma de estudos chamada OpenMind.

Regras obrigatórias:
- Responda SOMENTE com um objeto JSON válido, sem markdown, sem texto fora do JSON, sem comentários.
- Nunca invente normas técnicas, valores numéricos específicos ou especificações de fabricante sem deixar claro que é um exemplo genérico.
- Questões de múltipla escolha devem ter exatamente 4 alternativas, com UMA única resposta correta e as outras plausíveis (nunca óbvias ou absurdas).
- Todo conteúdo deve ser tecnicamente correto e usar terminologia real da área.
- Textos em inglês devem ser inglês técnico natural, não tradução literal malfeita.`;

function montarPrompt({ subjectNamePt, subjectNameEn, tipos, quantidade, dificuldade, idioma }) {

    const partes = [];

    partes.push(`Matéria: "${subjectNamePt}"${subjectNameEn ? ` (English: "${subjectNameEn}")` : ""}.`);
    partes.push(`Gere aproximadamente ${quantidade} itens no total, distribuídos entre os tipos solicitados.`);
    partes.push(`Dificuldade: ${dificuldade === "mixed" ? "misture basic, intermediate e advanced" : dificuldade}.`);
    partes.push(`Idioma do conteúdo: ${idioma === "mixed" ? "gere TODOS os campos Pt e En preenchidos (bilíngue completo)" : idioma === "en" ? "foque em inglês técnico, mas ainda preencha os campos Pt com uma tradução técnica de qualidade" : "foque em português, mas ainda preencha os campos En com inglês técnico de qualidade"}.`);
    partes.push("");
    partes.push("Gere um objeto JSON com esta estrutura exata (inclua só as chaves dos tipos pedidos abaixo, mas sempre como array, mesmo vazio):");
    partes.push("");
    partes.push(`{
  "topics": [ { "namePt": "...", "nameEn": "...", "descriptionPt": "...", "descriptionEn": "...", "difficulty": "basic|intermediate|advanced" } ],
  "questions": [ { "topicIndex": 0, "difficulty": "basic|intermediate|advanced", "questionPt": "...", "questionEn": "...", "optionsPt": ["...","...","...","..."], "optionsEn": ["...","...","...","..."], "correct": 0, "explanationPt": "...", "explanationEn": "..." } ],
  "challenges": [ { "titlePt": "...", "titleEn": "...", "descriptionPt": "...", "descriptionEn": "...", "difficulty": "basic|intermediate|advanced", "expectedKnowledge": "..." } ],
  "vocabulary": [ { "english": "...", "portuguese": "...", "exampleEn": "...", "examplePt": "...", "difficulty": "basic|intermediate|advanced" } ]
}`);
    partes.push("");
    partes.push("Onde 'topicIndex' em cada questão é o índice (começando em 0) do array 'topics' ao qual ela pertence — só inclua 'topics' se for gerar 'questions' também, e sempre gere pelo menos 1 tópico nesse caso.");
    partes.push(`Tipos pedidos nesta solicitação: ${tipos.join(", ")}.`);
    partes.push("'correct' é o índice (0 a 3) da alternativa correta em optionsPt/optionsEn (mesma posição nos dois arrays).");
    partes.push("Não inclua nenhuma chave além das listadas acima.");

    return partes.join("\n");
}

function normalizarConteudo(bruto) {

    const paraArray = (valor) => Array.isArray(valor) ? valor : [];
    const paraTexto = (valor) => typeof valor === "string" ? valor.trim() : "";
    const paraDificuldade = (valor) => ["basic", "intermediate", "advanced"].includes(valor) ? valor : "basic";

    const topics = paraArray(bruto.topics).map((t) => ({
        namePt: paraTexto(t.namePt) || paraTexto(t.nameEn),
        nameEn: paraTexto(t.nameEn) || paraTexto(t.namePt),
        descriptionPt: paraTexto(t.descriptionPt),
        descriptionEn: paraTexto(t.descriptionEn),
        difficulty: paraDificuldade(t.difficulty)
    })).filter((t) => t.namePt);

    const questions = paraArray(bruto.questions).map((q) => {
        const optionsPt = paraArray(q.optionsPt).map(paraTexto).filter(Boolean);
        const optionsEn = paraArray(q.optionsEn).map(paraTexto).filter(Boolean);
        return {
            topicIndex: Number.isInteger(q.topicIndex) ? q.topicIndex : 0,
            difficulty: paraDificuldade(q.difficulty),
            questionPt: paraTexto(q.questionPt) || paraTexto(q.questionEn),
            questionEn: paraTexto(q.questionEn) || paraTexto(q.questionPt),
            optionsPt: optionsPt.length === 4 ? optionsPt : optionsPt.concat(Array(Math.max(0, 4 - optionsPt.length)).fill("")),
            optionsEn: optionsEn.length === 4 ? optionsEn : optionsEn.concat(Array(Math.max(0, 4 - optionsEn.length)).fill("")),
            correct: Number.isInteger(q.correct) && q.correct >= 0 && q.correct <= 3 ? q.correct : 0,
            explanationPt: paraTexto(q.explanationPt),
            explanationEn: paraTexto(q.explanationEn)
        };
    }).filter((q) => q.questionPt && q.optionsPt.every(Boolean));

    const challenges = paraArray(bruto.challenges).map((c) => ({
        titlePt: paraTexto(c.titlePt) || paraTexto(c.titleEn),
        titleEn: paraTexto(c.titleEn) || paraTexto(c.titlePt),
        descriptionPt: paraTexto(c.descriptionPt),
        descriptionEn: paraTexto(c.descriptionEn),
        difficulty: paraDificuldade(c.difficulty),
        expectedKnowledge: paraTexto(c.expectedKnowledge)
    })).filter((c) => c.titlePt);

    const vocabulary = paraArray(bruto.vocabulary).map((v) => ({
        english: paraTexto(v.english),
        portuguese: paraTexto(v.portuguese),
        exampleEn: paraTexto(v.exampleEn),
        examplePt: paraTexto(v.examplePt),
        difficulty: paraDificuldade(v.difficulty)
    })).filter((v) => v.english && v.portuguese);

    return { topics, questions, challenges, vocabulary };
}

function fetchComTimeout(url, opcoes, timeoutMs) {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), timeoutMs);
    return fetch(url, Object.assign({}, opcoes, { signal: controlador.signal }))
        .finally(() => clearTimeout(temporizador));
}
