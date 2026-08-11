// ============================================================
// AHLE SUNNAT - SERVICE WORKER
// কাজ:
// 1. PWA-এর cache/offline support
// 2. Firebase Cloud Messaging-এর background notification
// ============================================================


// ============================================================
// PART 1 — PWA CACHE
// ============================================================

const CACHE_NAME = "ahlesunnat-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];


// ============================================================
// PART 2 — INSTALL
// কাজ:
// প্রয়োজনীয় PWA files cache করে রাখা
// কেন:
// Internet না থাকলেও app-এর basic অংশ চালানোর জন্য
// ============================================================

self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});


// ============================================================
// PART 3 — ACTIVATE
// কাজ:
// পুরোনো cache delete করা
// কেন:
// নতুন version-এর files ব্যবহার করার জন্য
// ============================================================

self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((cacheNames) => {

      return Promise.all(

        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))

      );

    })
  );

  self.clients.claim();
});


// ============================================================
// PART 4 — FETCH
// কাজ:
// আগে Internet থেকে file আনার চেষ্টা করবে
// Internet না থাকলে cache থেকে নেবে
// ============================================================

self.addEventListener("fetch", (event) => {

  event.respondWith(

    fetch(event.request).catch(() => {

      return caches.match(event.request);

    })

  );

});


// ============================================================
// PART 5 — FIREBASE CLOUD MESSAGING
// কাজ:
// App/browser background-এ থাকলেও Firebase notification গ্রহণ করা
// ============================================================


// Firebase-এর compatibility SDK load করা হচ্ছে
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);


// ============================================================
// PART 6 — FIREBASE CONFIG
// কাজ:
// এই Service Worker-কে তোমার Firebase Project-এর সাথে connect করা
// ============================================================

firebase.initializeApp({

  apiKey: "AIzaSyCPRWpUI98Ggr4rrlC5yqXsaaAJIkCNp-0",

  authDomain: "ahle-sunnat-islamic-qa.firebaseapp.com",

  projectId: "ahle-sunnat-islamic-qa",

  storageBucket: "ahle-sunnat-islamic-qa.firebasestorage.app",

  messagingSenderId: "58263470817",

  appId: "1:58263470817:web:31e14a98ebbd00f9c26da0"

});


// Firebase Messaging initialize
const messaging = firebase.messaging();


// ============================================================
// PART 7 — BACKGROUND NOTIFICATION
// কাজ:
// App background/বন্ধ থাকা অবস্থায় Firebase notification দেখানো
// ============================================================

messaging.onBackgroundMessage((payload) => {

  console.log(
    "[sw.js] Background message received:",
    payload
  );


  const notificationTitle =
    payload.notification?.title ||
    "Ahle Sunnat Islamic QA";


  const notificationOptions = {

    body:
      payload.notification?.body ||
      "আপনার জন্য নতুন একটি বার্তা এসেছে।",

    icon: "./icon-192.png",

    badge: "./icon-192.png",

    data: payload.data || {}

  };


  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );

});


// ============================================================
// PART 8 — NOTIFICATION CLICK
// কাজ:
// User notification-এ চাপলে তোমার app খুলবে
// ============================================================

self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  event.waitUntil(

    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {

      for (const client of clientList) {

        if ("focus" in client) {
          return client.focus();
        }

      }

      if (clients.openWindow) {
        return clients.openWindow("./");
      }

    })

  );

});
