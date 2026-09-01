// OpenMind — inicialização do Firebase.
// Usa o SDK "compat" (não-modular) de propósito: o resto do projeto usa
// scripts simples (sem type="module"), então mantemos o mesmo padrão em
// vez de introduzir ES Modules só pra essa parte. As tags <script> do
// SDK do Firebase (compat) precisam vir ANTES deste arquivo em cada
// página — ver o <head>/<body> de index.html e das páginas internas.

if (!window.OPENMIND_FIREBASE_CONFIG) {
    console.error("OPENMIND_FIREBASE_CONFIG não encontrado — confira js/firebase-config.js");
} else {
    firebase.initializeApp(window.OPENMIND_FIREBASE_CONFIG);
    window.OPENMIND_AUTH = firebase.auth();
    window.OPENMIND_DB = firebase.firestore();
}
