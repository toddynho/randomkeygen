// Service Worker for RandomKeygen - Offline Support & Performance
// Version: 2026-04-06-0708

const CACHE_NAME = 'randomkeygen-v1';
const STATIC_CACHE = 'randomkeygen-static-v1';
const DYNAMIC_CACHE = 'randomkeygen-dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/password',
  '/jwt-secret',
  '/uuid',
  '/api-key',
  '/encryption-key',
  // Core offline functionality - generators can work without network
  '/offline.html'
];

// Critical scripts that should be cached
const CRITICAL_SCRIPTS = [
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js'
];

self.addEventListener('install', event => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('SW: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) return;

  // Skip external requests except fonts and critical resources
  if (url.origin !== location.origin) {
    if (url.hostname.includes('fonts.googleapis.com') || 
        url.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(handleFontRequest(request));
    }
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle static assets
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'image') {
    event.respondWith(handleStaticAssets(request));
    return;
  }

  // Default: network first for API calls and dynamic content
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

async function handleNavigationRequest(request) {
  try {
    // Try network first for fresh content
    const networkResponse = await fetch(request);
    
    // Cache successful page responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, serving from cache');
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback - offline page
    return caches.match('/offline.html') || 
           new Response('Offline - RandomKeygen generators work without internet!', {
             status: 200,
             headers: { 'Content-Type': 'text/html' }
           });
  }
}

async function handleStaticAssets(request) {
  // Cache first for static assets to improve performance
  const cached = await caches.match(request);
  if (cached) {
    // Refresh in background for next time
    fetch(request).then(response => {
      if (response.status === 200) {
        caches.open(STATIC_CACHE).then(cache => cache.put(request, response));
      }
    }).catch(() => {});
    
    return cached;
  }
  
  // Not in cache, fetch and cache
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return a fallback for critical assets
    if (request.destination === 'image') {
      return new Response('', { status: 404 });
    }
    throw error;
  }
}

async function handleFontRequest(request) {
  // Cache fonts aggressively - they rarely change
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('SW: Font loading failed', request.url);
    throw error;
  }
}

// Background sync for form submissions (if generators add this feature)
self.addEventListener('sync', event => {
  if (event.tag === 'generator-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Placeholder for offline analytics sync
  console.log('SW: Syncing analytics data...');
}

// Push notifications placeholder (for future features)
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: data.data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});