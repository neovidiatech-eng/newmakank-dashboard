// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp( {
apiKey: "AIzaSyBWAVv5cUiOJ0tVTluRO83-T3nyViggv68",
  authDomain: "my-cool-project-e869d.firebaseapp.com",
  projectId: "my-cool-project-e869d",
  storageBucket: "my-cool-project-e869d.firebasestorage.app",
  messagingSenderId: "387597374746",
  appId: "1:387597374746:web:42335f6d908629f10d08a3",
  measurementId: "G-DQZTX77L24"

});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});



// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBWAVv5cUiOJ0tVTluRO83-T3nyViggv68",
//   authDomain: "my-cool-project-e869d.firebaseapp.com",
//   projectId: "my-cool-project-e869d",
//   storageBucket: "my-cool-project-e869d.firebasestorage.app",
//   messagingSenderId: "387597374746",
//   appId: "1:387597374746:web:42335f6d908629f10d08a3",
//   measurementId: "G-DQZTX77L24"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);