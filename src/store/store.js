import { createApp } from 'vue'
import { createStore } from 'vuex'
import firebase from 'firebase'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import 'es6-promise/auto'


export default createStore({
    state: {
        user: null
    },//data
    mutations: {
        getUser() {
            this.state.user = firebase.auth().currentUser
        }
    },//methods (omly sync)
    actions:{
        login() {
            const provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
                firebase.auth().signInWithPopup(provider)
                    .then(
                        () => {
                        var insert
                        let user = firebase.auth().currentUser
                        const db = firebase.firestore()
                        db.collection('users').where("email", "==", user.email).get().then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                insert = doc.data() == null ? true : false
                            })
                        }).then(() => {
                            if (insert) {
                                this.dispatch('updateUser')
                            }
                        })
                        
                        this.commit("getUser")
                        console.log("logged in")
                    }).catch(error => {
                        console.log(error.message)
                    })
            })
        },
        logout() {
            firebase.auth().signOut().then(
                () => {
					console.log("works")
                    this.commit("getUser")
                    
                }).catch((error) => {
                    console.log(error.message)
                })
        },
        async updateUser() {
            let user = firebase.auth().currentUser
            await this.db.collection('users').add({
                'userUID': user.uid,
                'displayName': user.displayName,
                'photoURL': user.photoURL,
                'email': user.email
            }).then(console.log("entry done"))
        },
    },//async methods
    plugins: [
        createPersistedState({
            getState: (key) => Cookies.getJSON(key),
            setState: (key, state) => Cookies.set(key, state, {expires: 3, secure: true})
        })
    ]
})