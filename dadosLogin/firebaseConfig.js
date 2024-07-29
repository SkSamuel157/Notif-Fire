// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAuXbN2Qf9VVi2cxRhU6jcFgSmW-xj4Qk",
    authDomain: "dadoslogin-7b1f0.firebaseapp.com",
    projectId: "dadoslogin-7b1f0",
    storageBucket: "dadoslogin-7b1f0.appspot.com",
    messagingSenderId: "384667608638",
    appId: "1:384667608638:web:d3a979a4669cc7daf9136f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);


export { auth, firestore };