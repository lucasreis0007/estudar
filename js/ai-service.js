// OpenMind — chamada da function segura de geração de conteúdo.
// Este arquivo NUNCA vê a API key da IA — ele só chama a Cloud Function
// (js/firebase-init.js expõe window.OPENMIND_FUNCTIONS), que roda no
// servidor do Firebase e é quem realmente fala com a OpenAI.

function OPENMIND_gerarConteudoIA(parametros) {

    if (!navigator.onLine) {
        return Promise.reject({ code: "offline" });
    }

    const chamar = OPENMIND_FUNCTIONS.httpsCallable("generateContent");

    return chamar({
        subjectNamePt: parametros.subjectNamePt,
        subjectNameEn: parametros.subjectNameEn,
        tipos: parametros.tipos,
        quantidade: parametros.quantidade,
        dificuldade: parametros.dificuldade,
        idioma: parametros.idioma
    }).then(function (resultado) {
        return resultado.data;
    });
}

// Traduz os erros mais comuns pra uma mensagem que faz sentido pro
// usuário final (nunca mostra erro técnico cru).
function OPENMIND_traduzirErroIA(erro) {
    const lang = (typeof getLang === "function") ? getLang() : "pt-BR";

    const mensagens = {
        "pt-BR": {
            offline: "A geração de conteúdo precisa de conexão com a internet.",
            "unauthenticated": "Sua sessão expirou. Faça login novamente.",
            "resource-exhausted": "Muitas solicitações agora. Aguarde um instante e tente de novo.",
            "invalid-argument": "Revise os campos e tente de novo.",
            default: "Não foi possível gerar o conteúdo agora. Tente novamente."
        },
        en: {
            offline: "Content generation needs an internet connection.",
            "unauthenticated": "Your session expired. Please sign in again.",
            "resource-exhausted": "Too many requests right now. Wait a moment and try again.",
            "invalid-argument": "Check the fields and try again.",
            default: "Couldn't generate content right now. Please try again."
        }
    };

    const dicionario = mensagens[lang] || mensagens["pt-BR"];
    return dicionario[erro && erro.code] || dicionario.default;
}
