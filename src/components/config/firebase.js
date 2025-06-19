import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDTZmf6bDlgvhW712YYpXcsuYmi0TvfHNk",
  authDomain: "yatranow-5b123.firebaseapp.com",
  projectId: "yatranow-5b123",
  storageBucket: "yatranow-5b123.appspot.com",
  messagingSenderId: "314508074395",
  appId: "1:314508074395:web:46e551b8b5bb1deb3d553e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ Correct way

export { auth };