// ── STCMETRO Service Worker — v3 (Supabase) ──
// Incrementar CACHE_VERSION a cada deploy para forçar atualização
const CACHE_VERSION = 'stcmetro-v4';

const STATIC_ASSETS = [
  './',
  './index.html',
  './mapa.html',
  './anomalias.html',
  './pendencias.html',
  './dashboard.html',
  './mbx.html',
  './circuitos.html',
];

// ── install: pré-cacheia assets estáticos ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()) // ativa imediatamente sem esperar aba fechar
  );
});

// ── activate: remove caches antigos ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => {
            console.log('[SW] Removendo cache antigo:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim()) // assume controle imediato de todas as abas
  );
});

// ── fetch: estratégia Network First para HTML, Cache First para assets estáticos ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Nunca intercepta chamadas para Supabase, Cloudinary, CDNs externos
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('cloudinary.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('jsdelivr.net') ||
    url.hostname.includes('cdnjs.cloudflare.com') ||
    url.hostname.includes('nominatim.openstreetmap.org') ||
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('unpkg.com') ||
    !url.hostname.includes(self.location.hostname)
  ) {
    return; // deixa o browser tratar normalmente
  }

  // Para páginas HTML: Network First (sempre busca versão mais recente)
  if (event.request.mode === 'navigate' || event.request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // atualiza o cache com a versão mais recente
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request)) // fallback para cache se offline
    );
    return;
  }

  // Para outros assets: Cache First (fonts, ícones, etc.)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
