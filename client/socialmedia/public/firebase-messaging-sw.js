importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB2tSMifKx8yjY46c-emBf9aWcCcbt-yVk",
  authDomain: "social-media-a5994.firebaseapp.com",
  projectId: "social-media-a5994",
  storageBucket: "social-media-a5994.appspot.com",
  messagingSenderId: "650068737905",
  appId: "1:650068737905:web:c9e3bbfdf0f032b14540d0",
  measurementId: "G-NZLN3P8X5K"
});

const messaging = firebase.messaging();

// ✅ Background message handler
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.image || '/logo192.png',
    
    // ✅ Pass the data from payload to be accessed on click
    data: payload.data || {}, 
  };

  // ✅ This is where you include `data`
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ✅ Notification click handler (separate)
self.addEventListener('notificationclick', function(event) {
  const clickData = event.notification.data;
  console.log('User clicked notification with data:', clickData);

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }

      // Example: Navigate based on notification data
      if (clickData?.type === 'live-stream' && clickData.userId) {
        return clients.openWindow(`/live/${clickData.userId}`);
      } else {
        return clients.openWindow('/');
      }
    })
  );
});
