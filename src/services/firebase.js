    // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: "wavelength-adde0",
    storageBucket: "wavelength-adde0.firebasestorage.app",
    messagingSenderId: "912354011753",
    appId: "1:912354011753:web:7af3427a59eec781c810f8"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
