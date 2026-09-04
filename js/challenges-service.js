// OpenMind — desafios práticos. Sem banco de fábrica (challenges só
// nascem por IA ou cadastro manual futuro) — só leitura/escrita.

const OPENMIND_COLECAO_DESAFIOS = "challenges";

function OPENMIND_listarDesafios(subjectId) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_DESAFIOS)
        .where("subjectId", "==", subjectId)
        .get()
        .then(function (snap) {
            return snap.docs.map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); });
        });
}

function OPENMIND_adicionarDesafio(subjectId, dados) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_DESAFIOS).add({
        subjectId: subjectId,
        titlePt: dados.titlePt,
        titleEn: dados.titleEn,
        descriptionPt: dados.descriptionPt,
        descriptionEn: dados.descriptionEn,
        difficulty: dados.difficulty || "intermediate",
        expectedKnowledge: dados.expectedKnowledge || ""
    });
}
