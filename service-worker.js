const CACHE_NAME = "safety-shaper-v5";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css?v=5",
  "./script.js?v=5",
  "./manifest.json",
  "./preview.html",
  "./assets/logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE).catch(() => Promise.resolve()))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => key === CACHE_NAME ? undefined : caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
