importScripts(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCPRWpUI98Ggr4rrlC5yqXsaaAJIkCNp-0",
  authDomain: "ahle-sunnat-islamic-qa.firebaseapp.com",
  projectId: "ahle-sunnat-islamic-qa",
  storageBucket: "ahle-sunnat-islamic-qa.firebasestorage.app",
  messagingSenderId: "58263470817",
  appId: "1:58263470817:web:31e14a98ebbd00f9c26da0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const notificationTitle =
    payload.notification?.title || "আহলে সুন্নাত";

  const notificationOptions = {
    body:
      payload.notification?.body ||
      "নতুন একটি বার্তা এসেছে।",
    icon: "./icon-192.png"
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
