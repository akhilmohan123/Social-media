// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// ✅ Initialize Firebase with corrected storageBucket
firebase.initializeApp({
  apiKey: "AIzaSyB2tSMifKx8yjY46c-emBf9aWcCcbt-yVk",
  authDomain: "social-media-a5994.firebaseapp.com",
  projectId: "social-media-a5994",
  storageBucket: "social-media-a5994.appspot.com", // ✅ fixed here
  messagingSenderId: "650068737905",
  appId: "1:650068737905:web:c9e3bbfdf0f032b14540d0",
  measurementId: "G-NZLN3P8X5K"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.image || '/logo192.png',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
