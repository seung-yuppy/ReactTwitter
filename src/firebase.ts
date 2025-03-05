import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDBW141xMeh9lcflQLk8t5GAvoRJJrGKi8',
  authDomain: 'react-twitter-reload.firebaseapp.com',
  projectId: 'react-twitter-reload',
  storageBucket: 'react-twitter-reload.firebasestorage.app',
  messagingSenderId: '984942667893',
  appId: '1:984942667893:web:25ffa8fdddd1448016b03c'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
