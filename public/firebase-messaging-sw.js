// This file must be in the public folder.

importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmsBIjLGpCofUcV5M5aIiWBMqrqu6w2rg",
  authDomain: "studio-227719239-efe98.firebaseapp.com",
  projectId: "studio-227719239-efe98",
  storageBucket: "studio-227719239-efe98.appspot.com",
  messagingSenderId: "630277961426",
  appId: "1:630277961426:web:bb3c1083c72518abf4df0b",
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
