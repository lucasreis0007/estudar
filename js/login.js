// OpenMind — lógica da tela de login/cadastro.

document.addEventListener("DOMContentLoaded", () => {

    // Se já tiver alguém logado, pula direto pro dashboard.
    OPENMIND_AUTH.onAuthStateChanged(usuario => {
        if (usuario) window.location.href = "../index.html";
    });

    const formLogin = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastro");
    const linkTrocar = document.getElementById("linkTrocar");
    const modoTitulo = document.getElementById("modoTitulo");
    const modoSubtitulo = document.getElementById("modoSubtitulo");
    const modoEyebrow = document.getElementById("modoEyebrow");

    let modoCadastro = false;

    function atualizarTextosModo() {
        const lang = getLang();
        const dict = OPENMIND_I18N[lang] || OPENMIND_I18N["pt-BR"];

        modoEyebrow.textContent = modoCadastro ? "SIGN UP" : "SIGN IN";
        modoTitulo.textContent = modoCadastro ? dict.registerTitle : dict.loginTitle;
        modoSubtitulo.textContent = modoCadastro ? dict.registerSubtitle : dict.loginSubtitle;
        linkTrocar.textContent = modoCadastro ? dict.switchToLogin : dict.switchToRegister;
    }

    // Reaplica os textos do modo atual quando o idioma muda (o botão de
    // idioma em language.js só sabe recarregar [data-i18n] fixos).
    window.OPENMIND_onLanguageChange = atualizarTextosModo;

    linkTrocar.addEventListener("click", evento => {
        evento.preventDefault();
        modoCadastro = !modoCadastro;
        formLogin.classList.toggle("oculto-auth", modoCadastro);
        formCadastro.classList.toggle("oculto-auth", !modoCadastro);
        document.getElementById("erroLogin").textContent = "";
        document.getElementById("erroCadastro").textContent = "";
        atualizarTextosModo();
    });

    formLogin.addEventListener("submit", evento => {
        evento.preventDefault();
        const erroEl = document.getElementById("erroLogin");
        erroEl.textContent = "";

        const email = document.getElementById("loginEmail").value.trim();
        const senha = document.getElementById("loginSenha").value;

        OPENMIND_entrar(email, senha)
            .then(() => { window.location.href = "../index.html"; })
            .catch(erro => { erroEl.textContent = OPENMIND_traduzirErroAuth(erro); });
    });

    formCadastro.addEventListener("submit", evento => {
        evento.preventDefault();
        const erroEl = document.getElementById("erroCadastro");
        erroEl.textContent = "";

        const email = document.getElementById("cadEmail").value.trim();
        const senha = document.getElementById("cadSenha").value;
        const confirmar = document.getElementById("cadConfirmar").value;

        if (senha !== confirmar) {
            const lang = getLang();
            erroEl.textContent = lang === "en" ? "Passwords don't match." : "As senhas não coincidem.";
            return;
        }

        OPENMIND_criarConta(email, senha)
            .then(() => { window.location.href = "../index.html"; })
            .catch(erro => { erroEl.textContent = OPENMIND_traduzirErroAuth(erro); });
    });
});
