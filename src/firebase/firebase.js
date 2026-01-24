import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  projectId: "localized-arkansas",
  appId: "1:313205684265:web:e78cdfb2bd58ae571fc438",
  storageBucket: "localized-arkansas.firebasestorage.app",
  apiKey: "AIzaSyDceIrXchoI-ikUmB3OM34Ve7xwmETinQg",
  authDomain: "localized-arkansas.firebaseapp.com",
  messagingSenderId: "313205684265",
  projectNumber: "313205684265",
  version: "2"
};

//initialize firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth};