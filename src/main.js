import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'
import firebase from 'firebase'

require('dotenv').config()

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.VUE_APP_apiKey,
    authDomain: process.env.VUE_APP_authDomain,
    projectId: process.env.VUE_APP_projectId,
    storageBucket: process.env.VUE_APP_storageBucket,
    messagingSenderId: process.env.VUE_APP_messagingSenderId,
    appId: process.env.VUE_APP_appId,
    measurementId: process.env.VUE_APP_measurementId
};

firebase.initializeApp(firebaseConfig)

createApp(App).use(store).use(router).mount('#app')

