// sw.js - Pyahu App con ACTUALIZACIÓN AUTOMÁTICA
const VERSION = 'v1.2';
const CACHE_NAME = `pyahu-${VERSION}`;

const ARCHIVOS = [
  '/py/',
  '/py/index.html',
  '/py/manifest.json',
  'printer-page-imagem/logo-imagen-01.png',
  'printer-page-imagem/imagen-extra-01.png',
  'printer-page-imagem/body-fondo-imagen-01.png',
  'printer-page-imagem/titulo-pagina-imagen-01.png',
  'printer-page-imagem/footer-imagen-01.png',
  'printer-page-imagem/footer-imagen-02.png',
  'printer-page-imagem/audio-01.mp3',
  // ===== NUEVAS IMÁGENES DEL SLIDER =====
  'slides-imagens/titulo-pagina-imagen-01.png',
  'slides-imagens/titulo-pagina-imagen-02.png',
  'slides-imagens/titulo-pagina-imagen-03.png',
  'slides-imagens/titulo-pagina-imagen-04.png'
];

self.addEventListener('install', event => {
  console.log(`📦 Instalando Pyahu ${VERSION}...`);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log(`🚀 Pyahu ${VERSION} Activado`);
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🗑️ Limpiando:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});