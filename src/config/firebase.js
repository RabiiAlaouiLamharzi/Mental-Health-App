// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCGKVfb0XBnXVtiN9sELB0GOff4r0CfPMk",
  authDomain: "chatapp-76ee8.firebaseapp.com",
  projectId: "chatapp-76ee8",
  storageBucket: "chatapp-76ee8.appspot.com",
  messagingSenderId: "1086397894870",
  appId: "1:1086397894870:web:73efd69a204fdcdb037977",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const data = getDatabase(app);

export { auth, db, data };
