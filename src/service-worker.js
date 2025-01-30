/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

clientsClaim();

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache for Firestore data
const FIRESTORE_CACHE = 'firestore-cache-v1';
const OFFLINE_QUEUE = 'offline-queue-v1';

// Background sync plugin for offline mutations
const bgSyncPlugin = new BackgroundSyncPlugin('offlineQueue', {
  maxRetentionTime: 24 * 60, // Retry for 24 hours
  onSync: async ({ queue }) => {
    try {
      await queue.replayRequests();
      // Notify all clients about successful sync
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({ type: 'SYNC_COMPLETED' });
      });
    } catch (error) {
      console.error('Replay failed:', error);
    }
  }
});

// Cache Firestore data
registerRoute(
  ({ url }) => url.pathname.includes('firestore.googleapis.com'),
  new StaleWhileRevalidate({
    cacheName: FIRESTORE_CACHE,
    plugins: [
      bgSyncPlugin,
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 1 week
      })
    ]
  })
);

// Cache static assets
registerRoute(
  ({ request }) => request.destination === 'image' ||
                  request.destination === 'style' ||
                  request.destination === 'script',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Listen for offline mutations
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    const bgSyncLogic = async () => {
      try {
        const clone = event.request.clone();
        const requestData = {
          url: clone.url,
          method: clone.method,
          headers: Array.from(clone.headers.entries()),
          body: await clone.text(),
          timestamp: Date.now()
        };
        
        // Store failed request
        const offlineQueue = await self.caches.open(OFFLINE_QUEUE);
        await offlineQueue.put(requestData.url, new Response(JSON.stringify(requestData)));
        
        return new Response(JSON.stringify({ offline: true }));
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }));
      }
    };

    event.respondWith(
      fetch(event.request.clone()).catch(() => bgSyncLogic())
    );
  }
});