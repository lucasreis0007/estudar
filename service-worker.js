const CACHE = "openmind-v15";

const ASSETS = [
    "index.html",
    "manifest.json",
    "css/style.css",
    "js/openmind-config.js",
    "js/openmind-data.js",
    "js/subjects-service.js",
    "js/adaptive-service.js",
    "js/gamification-service.js",
    "js/data/openmind-questions.js",
    "js/data/openmind-vocabulary.js",
    "js/questions-service.js",
    "js/vocabulary-service.js",
    "js/training.js",
    "js/simulator.js",
    "js/language.js",
    "js/dashboard.js",
    "js/pwa.js",
    "js/firebase-config.js",
    "js/firebase-init.js",
    "js/auth.js",
    "js/auth-guard.js",
    "js/login.js",
    "pages/login.html",
    "pages/subjects.html",
    "pages/subject.html",
    "pages/training.html",
    "pages/progress.html",
    "pages/profile.html",
    "pages/vocabulary.html",
    "pages/simulator.html"
];

self.addEventListener("install", e => e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
));

self.addEventListener("activate", e => e.waitUntil(
    caches.keys().then(chaves =>
        Promise.all(chaves.filter(chave => chave !== CACHE).map(chave => caches.delete(chave)))
    ).then(() => self.clients.claim())
));

// Páginas HTML: sempre tenta a internet primeiro (assim uma atualização
// publicada aparece na hora), só usa o cache se estiver offline. Isso
// evita o problema de o app "travar" numa versão antiga do login.
// Arquivos estáticos (css/js/img): cache primeiro, é seguro porque o
// nome do CACHE muda a cada versão nova.
self.addEventListener("fetch", e => {

    const requisicao = e.request;
    const ehPaginaHtml = requisicao.mode === "navigate" ||
        (requisicao.headers.get("accept") || "").includes("text/html");

    if (ehPaginaHtml) {
        e.respondWith(
            fetch(requisicao)
                .then(res => {
                    const copia = res.clone();
                    caches.open(CACHE).then(c => c.put(requisicao, copia));
                    return res;
                })
                .catch(() => caches.match(requisicao).then(r => r || caches.match("index.html")))
        );
        return;
    }

    e.respondWith(
        caches.match(requisicao).then(r =>
            r || fetch(requisicao).then(res => {
                const copia = res.clone();
                caches.open(CACHE).then(c => c.put(requisicao, copia));
                return res;
            })
        )
    );
});
