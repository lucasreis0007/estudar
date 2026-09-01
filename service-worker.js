const CACHE = "openmind-v3";

const ASSETS = [
    "index.html",
    "manifest.json",
    "css/style.css",
    "js/openmind-config.js",
    "js/openmind-data.js",
    "js/subjects-service.js",
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
    "pages/profile.html"
];

self.addEventListener("install", e => e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
));

self.addEventListener("activate", e => e.waitUntil(
    caches.keys().then(chaves =>
        Promise.all(chaves.filter(chave => chave !== CACHE).map(chave => caches.delete(chave)))
    ).then(() => self.clients.claim())
));

self.addEventListener("fetch", e => e.respondWith(
    caches.match(e.request).then(r =>
        r || fetch(e.request).then(res => {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
            return res;
        }).catch(() => caches.match("index.html"))
    )
));
