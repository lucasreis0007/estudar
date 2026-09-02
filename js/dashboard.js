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
