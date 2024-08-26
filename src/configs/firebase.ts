// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyAgAGJmzZGjMpHAkj1xJtceyvtxyZIbZ94',
    authDomain: 'chat-app-petfoster.firebaseapp.com',
    projectId: 'chat-app-petfoster',
    storageBucket: 'chat-app-petfoster.appspot.com',
    messagingSenderId: '651379250403',
    appId: '1:651379250403:web:9c95dac0505b3d8a8521d6',
};

// const firebaseConfig = {
//     apiKey: 'AIzaSyAKcWefCTKIE4svEazYT-VJaqmsT8w47Y4',
//     authDomain: 'petfoster-secondary.firebaseapp.com',
//     projectId: 'petfoster-secondary',
//     storageBucket: 'petfoster-secondary.appspot.com',
//     messagingSenderId: '302421399500',
//     appId: '1:302421399500:web:7dbb05e9d2c2536b2aaf69',
//     measurementId: 'G-F6ZL9KK285',
// };

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
