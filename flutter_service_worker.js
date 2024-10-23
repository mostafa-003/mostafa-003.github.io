'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "37867da37378553b00fa86ee0a33acb4",
"assets/AssetManifest.bin.json": "9e209776b3a2ce8799ab30bbd3f18b68",
"assets/AssetManifest.json": "e33b2d8338db691b1830131ea64f2693",
"assets/assets/images/24.png": "ca21371dfa89bcbfbaea5115e1649f58",
"assets/assets/images/a1.png": "5c89fb8198f9485fb66364159c7bb4ca",
"assets/assets/images/ac.jpg": "2a3b08874bf7a0d44e45f5001cfbc267",
"assets/assets/images/ac2.jpg": "3230febc9718eb86d31cf8b13c026052",
"assets/assets/images/ac3.jpg": "3d34415aaf7afcce1c10ada13421fe20",
"assets/assets/images/ac_services/repair.png": "d56d67eb0e82d23058a63f9c309c0c52",
"assets/assets/images/ac_services/set-ac.png": "852d72d67c7089f28ae0c4db6379376f",
"assets/assets/images/ac_services/spray.png": "9fb216940b7527b0a8d9bbddaa00534e",
"assets/assets/images/fridge.jpg": "e0f283d7a4c8d564d605e51cd53b8776",
"assets/assets/images/main_services.jpg": "74e156e3bde03c97c03e28e5b7ab3cbe",
"assets/assets/images/main_services.svg": "3dee96e5dfa18f0604209f99f0d052ed",
"assets/assets/images/mechanic.png": "9856c37cd5499bd6e5df17c9744075a0",
"assets/assets/images/price-tag.png": "8181b26f20e5223af815ce8a314df164",
"assets/assets/images/quality.png": "fa5b9bcfaaffecc21910bd055b46e1c9",
"assets/assets/images/service.png": "163c253ee9f2e9b8140299c1f1b09807",
"assets/assets/images/service2.png": "280799d07699cf35a44c58f91d10ed24",
"assets/assets/images/trust.png": "4099e3e36b8bb8b4a62c9778331ac2f4",
"assets/assets/images/washer.jpg": "829a5de314e69d038fc76dde5d0d0abf",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "3fc93cadc670a587b150377994b742d0",
"assets/NOTICES": "681ff9c37024aea16525d7b799ec0da2",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "43bba0754c4cacadd3c2679abcd8c30a",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.ico": "e749daa2580ba44e63f2f0111252b729",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "6729b8c533d5a73a16999fdae67f1fcb",
"icons/Icon-192.png": "cb7907d05ea0d4a865a1264282e2491b",
"icons/Icon-512.png": "af05ac77a3477347fb013085de1bc4da",
"icons/Icon-maskable-192.png": "cb7907d05ea0d4a865a1264282e2491b",
"icons/Icon-maskable-512.png": "af05ac77a3477347fb013085de1bc4da",
"index.html": "8f8ff02c900e2cb02c98ccc54dc58032",
"/": "8f8ff02c900e2cb02c98ccc54dc58032",
"main.dart.js": "8e788fc96b61a5986aad2948e2459853",
"manifest.json": "ddded07329e00d7a31c7ef54817d12dd",
"version.json": "bc386d074bcb419527cf2c99aeb43cae"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
