/* Vizesiz Rota service worker — build_pwa.py tarafından üretildi, elle düzenlemeyin. */
const VERSION = 'vizesiz-rota-25039eadf6cc';
const FONTS = 'vizesiz-rota-fonts';
const CORE = [
  "./",
  "./app.js",
  "./data/d1-avrupa-kafkasya.js",
  "./data/d2-asya-okyanusya.js",
  "./data/d3-ortadogu-afrika.js",
  "./data/d4-amerika.js",
  "./data/meta.js",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon.svg",
  "./icons/maskable-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./vendor/d3.min.js",
  "./vendor/flags.js",
  "./vendor/topojson-client.min.js",
  "./vendor/world-110m.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('vizesiz-rota-') && k !== VERSION && k !== FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate') {
      // Sayfa: önce ağ (güncel sürüm), bağlantı yoksa önbellekteki kopya
      event.respondWith(
        fetch(req)
          .then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put('./index.html', copy)); return res; })
          .catch(() => caches.match('./index.html'))
      );
      return;
    }
    // Diğer dosyalar: önce önbellek
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    // Yazı tipleri: önbellekten hemen ver, arka planda tazele
    event.respondWith(
      caches.open(FONTS).then((c) => c.match(req).then((hit) => {
        const net = fetch(req).then((res) => { c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
  }
});
