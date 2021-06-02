import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

require('dotenv').config()

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

firebase.initializeApp(firebaseConfig)

createApp(App).use(router).mount('#app')

