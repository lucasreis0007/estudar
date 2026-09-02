// OpenMind — sistema adaptativo. Depois de cada resposta, atualizamos
// o progresso do usuário naquele TÓPICO, separado por dificuldade
// (basic/intermediate/advanced). É esse histórico que decide, da
// próxima vez, se o treino puxa questões mais fáceis (reforço) ou mais
// difíceis (o usuário já dominou aquele nível).

const OPENMIND_COLECAO_PROGRESSO = "topicProgress";

function OPENMIND_idProgresso(uid, topicId) {
    return uid + "_" + topicId;
}

function OPENMIND_atualizarProgressoTopico(uid, dados) {
    const ref = OPENMIND_DB.collection(OPENMIND_COLECAO_PROGRESSO).doc(OPENMIND_idProgresso(uid, dados.topicId));

    return ref.get().then(function (doc) {
        const atual = doc.exists ? doc.data() : {};
        const campoTotal = dados.difficulty + "Total";
        const campoCorreto = dados.difficulty + "Correct";

        const atualizacao = Object.assign({}, atual, {
            userId: uid,
            subjectId: dados.subjectId,
            topicId: dados.topicId
        });
        atualizacao[campoTotal] = (atual[campoTotal] || 0) + 1;
        atualizacao[campoCorreto] = (atual[campoCorreto] || 0) + (dados.correta ? 1 : 0);

        return ref.set(atualizacao, { merge: true });
    }).catch(function (erro) { console.error("Erro ao atualizar progresso adaptativo:", erro); });
}

function OPENMIND_obterProgressoMateria(uid, subjectId) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_PROGRESSO)
        .where("userId", "==", uid)
        .where("subjectId", "==", subjectId)
        .get()
        .then(function (snap) { return snap.docs.map(function (d) { return d.data(); }); });
}

function OPENMIND_obterProgressoTodasMaterias(uid) {
    return OPENMIND_DB.collection(OPENMIND_COLECAO_PROGRESSO)
        .where("userId", "==", uid)
        .get()
        .then(function (snap) {
            const porMateria = {};
            snap.docs.forEach(function (d) {
                const dado = d.data();
                if (!porMateria[dado.subjectId]) porMateria[dado.subjectId] = [];
                porMateria[dado.subjectId].push(dado);
            });
            return porMateria;
        });
}

// Dado o progresso de UM tópico, recomenda a próxima dificuldade: domina
// o básico → sobe; domina o intermediário → sobe; erra muito no nível
// atual → reforça esse nível.
function OPENMIND_nivelRecomendado(progressoTopico) {
    const p = progressoTopico || {};
    const taxa = function (certos, total) { return total > 0 ? certos / total : null; };

    const taxaBasic = taxa(p.basicCorrect || 0, p.basicTotal || 0);
    const taxaIntermediate = taxa(p.intermediateCorrect || 0, p.intermediateTotal || 0);
    const taxaAdvanced = taxa(p.advancedCorrect || 0, p.advancedTotal || 0);

    if (taxaBasic === null) return "basic";
    if (taxaAdvanced !== null && taxaAdvanced >= 0.7) return "advanced";
    if (taxaBasic >= 0.85 && (taxaIntermediate === null || taxaIntermediate >= 0.7)) return "advanced";
    if (taxaBasic >= 0.7) return "intermediate";
    return "basic";
}

// Status de uma matéria inteira, a partir do progresso de todos os seus
// tópicos. Retorna uma CHAVE (não texto pronto) — quem chama traduz.
function OPENMIND_statusMateria(progressoTopicos) {

    if (!progressoTopicos || progressoTopicos.length === 0) {
        return { chave: "notStarted", percentual: 0, cor: "neutro" };
    }

    let totalCertas = 0;
    let totalRespondidas = 0;

    progressoTopicos.forEach(function (topico) {
        ["basic", "intermediate", "advanced"].forEach(function (nivel) {
            totalRespondidas += topico[nivel + "Total"] || 0;
            totalCertas += topico[nivel + "Correct"] || 0;
        });
    });

    if (totalRespondidas === 0) return { chave: "notStarted", percentual: 0, cor: "neutro" };

    const percentual = Math.round((totalCertas / totalRespondidas) * 100);

    if (percentual >= 85) return { chave: "statusMastered", percentual: percentual, cor: "verde" };
    if (percentual >= 60) return { chave: "statusDeveloping", percentual: percentual, cor: "amarelo" };
    return { chave: "statusNeedsReview", percentual: percentual, cor: "vermelho" };
}

function OPENMIND_traduzirStatus(chave) {
    const dict = OPENMIND_I18N[getLang()] || OPENMIND_I18N["pt-BR"];
    return dict[chave] || chave;
}
