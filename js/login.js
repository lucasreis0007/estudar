// OpenMind — lógica da tela de login/cadastro (duas abas separadas).

document.addEventListener("DOMContentLoaded", () => {

    // Se já tiver alguém logado, pula direto pro dashboard.
    OPENMIND_AUTH.onAuthStateChanged(usuario => {
        if (usuario) window.location.href = "../index.html";
    });

    const formLogin = document.getElementById("formLogin");
    const formCadastro = document.getElementById("formCadastro");
    const tabLogin = document.getElementById("tabLogin");
    const tabCadastro = document.getElementById("tabCadastro");
    const modoSubtitulo = document.getElementById("modoSubtitulo");

    function mostrarLogin() {
        tabLogin.classList.add("ativo");
        tabCadastro.classList.remove("ativo");
        formLogin.classList.remove("oculto-auth");
        formCadastro.classList.add("oculto-auth");
        const dict = OPENMIND_I18N[getLang()] || OPENMIND_I18N["pt-BR"];
        modoSubtitulo.textContent = dict.loginSubtitle;
    }

    function mostrarCadastro() {
        tabCadastro.classList.add("ativo");
        tabLogin.classList.remove("ativo");
        formCadastro.classList.remove("oculto-auth");
        formLogin.classList.add("oculto-auth");
        const dict = OPENMIND_I18N[getLang()] || OPENMIND_I18N["pt-BR"];
        modoSubtitulo.textContent = dict.registerSubtitle;
    }

    tabLogin.addEventListener("click", mostrarLogin);
    tabCadastro.addEventListener("click", mostrarCadastro);

    // Reaplica o subtítulo do modo atual quando o idioma muda.
    window.OPENMIND_onLanguageChange = () => {
        if (tabCadastro.classList.contains("ativo")) mostrarCadastro();
        else mostrarLogin();
    };

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
