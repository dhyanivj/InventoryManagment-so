import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB-NDwq4wMqb49vxBhZ22UpLTGRuqMOYqY",
    authDomain: "stockmanagement-878af.firebaseapp.com",
    projectId: "stockmanagement-878af",
    storageBucket: "stockmanagement-878af.appspot.com",
    messagingSenderId: "910467405696",
    appId: "1:910467405696:web:7cc8a537865f0ee44c5365"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { db };
