import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDi_lSZaHSBdsbK1nFytRzI_uKjxfnclmc",
    authDomain: "sem-madryn.firebaseapp.com",
    projectId: "sem-madryn",
    storageBucket: "sem-madryn.appspot.com",
    messagingSenderId: "130518746495",
    appId: "1:130518746495:web:e6151b4d062ebada7fc64a",
    measurementId: "G-5MG9HP1KNL"
};

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};

/* // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi_lSZaHSBdsbK1nFytRzI_uKjxfnclmc",
  authDomain: "sem-madryn.firebaseapp.com",
  projectId: "sem-madryn",
  storageBucket: "sem-madryn.appspot.com",
  messagingSenderId: "130518746495",
  appId: "1:130518746495:web:e6151b4d062ebada7fc64a",
  measurementId: "G-5MG9HP1KNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); */