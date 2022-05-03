importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyBGVcJ6sidAkQggXgckVbQyKM_TkcERFP8",
  authDomain: "eess-agendas.firebaseapp.com",
  projectId: "eess-agendas",
  storageBucket: "eess-agendas.appspot.com",
  messagingSenderId: "622524642450",
  appId: "1:622524642450:web:30e5e865c7ccf7c020224b",
  measurementId: "G-MDW1XRJYB7",
  vapidKey:"BM9VPFTzn8cm0Q_mUm5d9VlIQt3HkhML41moKkcFguFFmTTUrtNtOwCx7RfhzdImdtWnltgRNl1XAinor6cu-PU"
});
const messaging = firebase.messaging();
