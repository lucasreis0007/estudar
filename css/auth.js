// OpenMind — autenticação e perfil do usuário.
// Compartilhado por todas as páginas: cada página protegida chama
// OPENMIND_protegerPagina(function(usuario, perfil){ ... }) no início.
// Se não houver ninguém logado, redireciona sozinho pro login.

const OPENMIND_PERFIL_PADRAO = {
    name: "",
    xp: 0,
    level: 1,
    streak: 0,
    totalStudyTime: 0,
    exercisesDone: 0,
    correctAnswers: 0,
    language: "pt-BR",
    studyMode: null,
    onboardingCompleto: false
};

// Descobre o caminho certo pro login.html esteja a página na raiz
// (index.html) ou dentro de pages/.
function OPENMIND_caminhoLogin() {
    return window.location.pathname.includes("/pages/") ? "login.html" : "pages/login.html";
}

function OPENMIND_caminhoIndex() {
    return window.location.pathname.includes("/pages/") ? "../index.html" : "index.html";
}

// Chame isso no topo de qualquer página que exige login. `aoAutenticar`
// recebe (usuarioFirebase, perfilFirestore) só depois que os dois já
// estão prontos.
function OPENMIND_protegerPagina(aoAutenticar) {
    OPENMIND_AUTH.onAuthStateChanged(function (usuario) {
        if (!usuario) {
            window.location.href = OPENMIND_caminhoLogin();
            return;
        }
        OPENMIND_carregarPerfil(usuario.uid).then(function (perfil) {
            aoAutenticar(usuario, perfil);
        });
    });
}

function OPENMIND_carregarPerfil(uid) {
    return OPENMIND_DB.collection("users").doc(uid).get().then(function (doc) {
        return Object.assign({}, OPENMIND_PERFIL_PADRAO, doc.exists ? doc.data() : {});
    });
}

function OPENMIND_salvarPerfil(uid, dadosParciais) {
    return OPENMIND_DB.collection("users").doc(uid).set(dadosParciais, { merge: true })
        .catch(function (erro) { console.error("Erro ao salvar perfil:", erro); });
}

function OPENMIND_criarConta(email, senha) {
    return OPENMIND_AUTH.createUserWithEmailAndPassword(email, senha).then(function (credencial) {
        const idioma = (typeof getLang === "function") ? getLang() : "pt-BR";
        return OPENMIND_DB.collection("users").doc(credencial.user.uid).set(Object.assign(
            {},
            OPENMIND_PERFIL_PADRAO,
            { language: idioma, createdAt: new Date().toISOString() }
        )).then(function () { return credencial; });
    });
}

function OPENMIND_entrar(email, senha) {
    return OPENMIND_AUTH.signInWithEmailAndPassword(email, senha);
}

function OPENMIND_sair() {
    return OPENMIND_AUTH.signOut().then(function () {
        window.location.href = OPENMIND_caminhoIndex();
    });
}

function OPENMIND_traduzirErroAuth(erro) {
    const idioma = (typeof getLang === "function") ? getLang() : "pt-BR";
    const mensagens = {
        "pt-BR": {
            "auth/email-already-in-use": "Esse e-mail já está cadastrado.",
            "auth/invalid-email": "E-mail inválido.",
            "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
            "auth/user-not-found": "Usuário ou senha incorretos.",
            "auth/wrong-password": "Usuário ou senha incorretos.",
            "auth/invalid-credential": "Usuário ou senha incorretos.",
            "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente de novo.",
            default: "Não foi possível concluir. Tente novamente."
        },
        en: {
            "auth/email-already-in-use": "This email is already registered.",
            "auth/invalid-email": "Invalid email.",
            "auth/weak-password": "Password must be at least 6 characters.",
            "auth/user-not-found": "Incorrect email or password.",
            "auth/wrong-password": "Incorrect email or password.",
            "auth/invalid-credential": "Incorrect email or password.",
            "auth/too-many-requests": "Too many attempts. Please wait and try again.",
            default: "Couldn't complete that. Please try again."
        }
    };
    const dicionario = mensagens[idioma] || mensagens["pt-BR"];
    return dicionario[erro.code] || dicionario.default;
}
