// OpenMind — vocabulário técnico como dado real no Firestore, com uma
// repetição espaçada simples: acertou → intervalo até a próxima revisão
// aumenta; errou → volta pra "revisar amanhã".

const OPENMIND_COLECAO_VOCABULARIO = "vocabulary";
const OPENMIND_COLECAO_VOCAB_PROGRESSO = "vocabularyProgress";
const OPENMIND_INTERVALOS_DIAS = [1, 3, 7, 14, 30];

function OPENMIND_garantirVocabularioSemeado() {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_VOCABULARIO).doc(OPENMIND_VOCABULARY[0].id).get().then(function (doc) {
        if (doc.exists && typeof doc.data().english === "string") return;

        const lote = OPENMIND_DB.batch();
        OPENMIND_VOCABULARY.forEach(function (palavra) {
            const ref = OPENMIND_DB.collection(OPENMIND_COLECAO_VOCABULARIO).doc(palavra.id);
            lote.set(ref, palavra);
        });
        return lote.commit();
    });
}

function OPENMIND_adicionarPalavraVocabulario(dados) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_VOCABULARIO).add(dados);
}

function OPENMIND_listarVocabulario() {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_VOCABULARIO).get().then(function (snap) {
        return snap.docs
            .map(function (d) { return Object.assign({ id: d.id }, d.data()); })
            .filter(function (p) { return typeof p.english === "string"; });
    });
}

function OPENMIND_idProgressoVocab(uid, vocabularyId) {
    return uid + "_" + vocabularyId;
}

function OPENMIND_obterProgressoVocabulario(uid) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_VOCAB_PROGRESSO)
        .where("userId", "==", uid)
        .get()
        .then(function (snap) {
            const porPalavra = {};
            snap.docs.forEach(function (d) { porPalavra[d.data().vocabularyId] = d.data(); });
            return porPalavra;
        });
}

// Registra se o usuário sabia (true) ou não (false) a palavra, e
// recalcula domínio + próxima revisão.
function OPENMIND_registrarRespostaVocabulario(uid, vocabularyId, sabia) {
    const ref = OPENMIND_DB.collection(OPENMIND_COLECAO_VOCAB_PROGRESSO).doc(OPENMIND_idProgressoVocab(uid, vocabularyId));

    return ref.get().then(function (doc) {
        const atual = doc.exists ? doc.data() : { correct: 0, incorrect: 0, sequenciaAcertos: 0 };

        const sequenciaAcertos = sabia ? (atual.sequenciaAcertos || 0) + 1 : 0;
        const indiceIntervalo = Math.min(sequenciaAcertos, OPENMIND_INTERVALOS_DIAS.length - 1);
        const diasAteRevisao = sabia ? OPENMIND_INTERVALOS_DIAS[indiceIntervalo] : 1;

        const proximaRevisao = new Date();
        proximaRevisao.setDate(proximaRevisao.getDate() + diasAteRevisao);

        const mastery = sequenciaAcertos >= 3 ? "mastered" : sequenciaAcertos >= 1 ? "learning" : "review";

        return ref.set({
            userId: uid,
            vocabularyId: vocabularyId,
            correct: (atual.correct || 0) + (sabia ? 1 : 0),
            incorrect: (atual.incorrect || 0) + (sabia ? 0 : 1),
            sequenciaAcertos: sequenciaAcertos,
            mastery: mastery,
            nextReview: proximaRevisao.toISOString()
        });
    });
}

// Palavras "para revisar agora": nunca praticadas OU com nextReview já
// vencido. Usado pra montar a fila de prática e o contador do Dashboard.
function OPENMIND_vocabularioParaRevisar(vocabulario, progressoPorPalavra) {
    const agora = new Date();
    return vocabulario.filter(function (palavra) {
        const progresso = progressoPorPalavra[palavra.id];
        if (!progresso) return true;
        return new Date(progresso.nextReview) <= agora;
    });
}
