// OpenMind — matérias e assuntos, agora como dado real no Firestore
// (não mais um array fixo no código). Nenhuma outra parte do app deve
// falar com a coleção "subjects"/"topics" diretamente — sempre por
// estas funções, pra "+ Adicionar matéria" e o conteúdo de fábrica
// caírem no mesmo lugar.

const OPENMIND_COLECAO_MATERIAS = "subjects";
const OPENMIND_COLECAO_TOPICOS = "topics";

// Roda uma vez: se a coleção "subjects" do Firestore ainda está vazia,
// semeia com o conteúdo inicial (js/openmind-data.js). Depois disso o
// Firestore é a única fonte da verdade.
function OPENMIND_garantirMateriasSemeadas() {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_MATERIAS).limit(1).get().then(function (snap) {
        if (!snap.empty) return;

        const lote = OPENMIND_DB.batch();

        OPENMIND_SUBJECTS.forEach(function (materia) {
            const refMateria = OPENMIND_DB.collection(OPENMIND_COLECAO_MATERIAS).doc(materia.id);
            lote.set(refMateria, {
                namePt: materia.namePt,
                nameEn: materia.nameEn,
                descriptionPt: "",
                descriptionEn: "",
                active: true
            });

            (materia.topics || []).forEach(function (topico) {
                const refTopico = OPENMIND_DB.collection(OPENMIND_COLECAO_TOPICOS).doc(topico.id);
                lote.set(refTopico, {
                    subjectId: materia.id,
                    namePt: topico.namePt,
                    nameEn: topico.nameEn,
                    descriptionPt: "",
                    difficulty: "basic"
                });
            });
        });

        return lote.commit();
    });
}

function OPENMIND_listarMaterias() {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_MATERIAS).get().then(function (snap) {
        return snap.docs
            .map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); })
            .filter(function (materia) { return materia.active !== false; });
    });
}

function OPENMIND_buscarMateria(subjectId) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_MATERIAS).doc(subjectId).get().then(function (doc) {
        return doc.exists ? Object.assign({ id: doc.id }, doc.data()) : null;
    });
}

function OPENMIND_listarTopicos(subjectId) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_TOPICOS)
        .where("subjectId", "==", subjectId)
        .get()
        .then(function (snap) {
            return snap.docs.map(function (doc) { return Object.assign({ id: doc.id }, doc.data()); });
        });
}

function OPENMIND_gerarSlug(texto) {
    const base = (texto || "materia")
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return base + "-" + Date.now().toString(36).slice(-4);
}

function OPENMIND_adicionarMateria(dados) {
    const id = OPENMIND_gerarSlug(dados.namePt || dados.nameEn);
    return OPENMIND_DB.collection(OPENMIND_COLECAO_MATERIAS).doc(id).set({
        namePt: dados.namePt || dados.nameEn,
        nameEn: dados.nameEn || dados.namePt,
        descriptionPt: dados.descriptionPt || "",
        descriptionEn: dados.descriptionEn || "",
        active: true
    }).then(function () { return id; });
}

function OPENMIND_adicionarTopico(subjectId, dados) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_TOPICOS).add({
        subjectId: subjectId,
        namePt: dados.namePt || dados.nameEn,
        nameEn: dados.nameEn || dados.namePt,
        descriptionPt: dados.descriptionPt || "",
        difficulty: dados.difficulty || "basic"
    });
}
