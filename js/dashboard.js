// OpenMind — dashboard (index.html).
// Protegido: só renderiza depois que o Firebase confirma o login.

window.renderDashboard = function (perfil, uid) {

    const lang = getLang();

    const elGreeting = document.getElementById("greeting");
    if (elGreeting) {
        const hora = new Date().getHours();
        const saudacaoPt = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
        const saudacaoEn = hora < 12 ? "Good morning" : hora < 18 ? "Good afternoon" : "Good evening";
        const nome = perfil && perfil.name ? `, ${perfil.name}` : "";
        elGreeting.textContent = (lang === "en" ? saudacaoEn : saudacaoPt) + nome + "!";
    }

    if (perfil) {
        const streakEl = document.querySelector(".stats-grid .stat-card:nth-child(1) strong");
        const xpEl = document.querySelector(".stats-grid .stat-card:nth-child(2) strong");
        const acertosEl = document.querySelector(".stats-grid .stat-card:nth-child(3) strong");
        const tempoEl = document.querySelector(".stats-grid .stat-card:nth-child(4) strong");

        if (streakEl) streakEl.textContent = `${perfil.streak || 0} 🔥`;
        if (xpEl) xpEl.textContent = perfil.xp || 0;
        if (acertosEl) {
            const taxa = perfil.exercisesDone > 0
                ? Math.round((perfil.correctAnswers / perfil.exercisesDone) * 100)
                : 0;
            acertosEl.textContent = `${taxa}%`;
        }
        if (tempoEl) tempoEl.textContent = `${Math.round((perfil.totalStudyTime || 0) / 60)}h`;
    }

    const box = document.getElementById("subjectPreview");
    if (box && uid) {
        OPENMIND_garantirMateriasSemeadas()
            .then(() => Promise.all([OPENMIND_listarMaterias(), OPENMIND_obterProgressoTodasMaterias(uid)]))
            .then(([materias, progressoPorMateria]) => {
                box.innerHTML = materias.slice(0, 4).map(s => {
                    const status = OPENMIND_statusMateria(progressoPorMateria[s.id]);
                    return `
                    <a class="subject-card" href="pages/subjects.html">
                        <div>
                            <strong>${lang === "en" ? s.nameEn : s.namePt}</strong>
                            <small>${OPENMIND_traduzirStatus(status.chave)}</small>
                        </div>
                        <span class="arrow">›</span>
                    </a>
                `;
                }).join("");

                const materiasPorId = {};
                materias.forEach(m => { materiasPorId[m.id] = m; });

                OPENMIND_topicosParaRevisar(uid).then(fracos => {
                    if (fracos.length === 0) return;

                    const nomesMaterias = [...new Set(fracos.map(f => f.subjectId))]
                        .map(id => materiasPorId[id])
                        .filter(Boolean)
                        .map(m => lang === "en" ? m.nameEn : m.namePt);

                    document.getElementById("textoRevisao").textContent =
                        (lang === "en" ? "Weak spots in: " : "Pontos fracos em: ") + nomesMaterias.join(", ") + ".";
                    document.getElementById("cardRevisao").classList.remove("oculto-auth");
                });
            });
    }

    const vocabResumo = document.getElementById("vocabResumoDashboard");
    if (vocabResumo && uid) {
        OPENMIND_garantirVocabularioSemeado()
            .then(() => Promise.all([OPENMIND_listarVocabulario(), OPENMIND_obterProgressoVocabulario(uid)]))
            .then(([vocabulario, progresso]) => {
                const mastered = Object.values(progresso).filter(p => p.mastery === "mastered").length;
                const paraRevisar = OPENMIND_vocabularioParaRevisar(vocabulario, progresso).length;
                vocabResumo.textContent = lang === "en"
                    ? `${vocabulario.length} words · ${mastered} mastered · ${paraRevisar} to review`
                    : `${vocabulario.length} palavras · ${mastered} dominadas · ${paraRevisar} pra revisar`;
            });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    OPENMIND_protegerPagina((usuario, perfil) => {
        window.OPENMIND_USUARIO = usuario;
        window.OPENMIND_PERFIL = perfil;
        renderDashboard(perfil, usuario.uid);
    });
});
