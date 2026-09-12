// ======================================
// CampusOS
// Service Worker v3.0 - Production Cache
// ======================================

const CACHE_NAME = "campusos-v3.0";

// 1. Static Core Cache: Relative paths for GitHub Pages subfolder support
const CORE_ASSETS = [
    "./",
    "./dashboard.html",
    "./index.html",
    "./manifest.json",
    "./pages/assignments.html",
    "./pages/notes.html",
    "./pages/planner.html",
    "./pages/casestudy.html",
    "./pages/assistant.html",
    "./pages/internship.html",
    "./pages/placement.html",
    "./pages/mock-interview.html",
    "./pages/profile.html",
    "./pages/settings.html",
    "./assets/css/style.css",
    "./assets/css/responsive.css",
    "./assets/js/core/storage.js",
    "./assets/js/core/toast.js",
    "./assets/js/core/modal.js",
    "./assets/js/core/validator.js",
    "./assets/js/core/dateUtils.js",
    "./assets/js/core/theme.js",
    "./assets/js/services/aiService.js",
    "./assets/js/services/dashboardService.js",
    "./assets/js/services/notesService.js",
    "./assets/js/services/plannerService.js",
    "./assets/js/services/placementService.js",
    "./assets/js/services/profileService.js",
    "./assets/js/services/settingsService.js",
    "./assets/js/modules/mockInterview.js",
    "./assets/js/page/dashboard.js",
    "./assets/js/page/notes.js",
    "./assets/js/page/planner.js",
    "./assets/js/page/casestudy.js"
];

// Install Event: Cache app shell assets safely
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const asset of CORE_ASSETS) {
                try {
                    await cache.add(asset);
                } catch (err) {
                    console.warn(`Failed to cache asset: ${asset}`, err);
                }
            }
        })
    );
    self.skipWaiting();
});

// Activate Event: Clear outdated cache stores
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event: Dynamic Caching with AI Gateway Bypass
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    // Direct network pass-through for Cloudflare Worker proxy and Gemini
    if (
        event.request.url.includes("workers.dev") || 
        event.request.url.includes("generativelanguage.googleapis.com")
    ) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then(networkResponse => {
                if (networkResponse.status === 200 && networkResponse.type === "basic") {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                console.log("Offline resource fetch missed:", event.request.url);
            });
        })
    );
});