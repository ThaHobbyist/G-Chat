<template>
<div class="container">
    <router-view v-if="!si" @login="loginGoogle" />
    <Dashboard v-if="si" :user="user" @logout="logout"/>
</div>
</template>

<script>
import firebase from 'firebase'
import Dashboard from './components/Dashboard.vue'

export default {
    data() {
        return {
            user: [],
            users: Boolean,
            si: false,
            db: firebase.firestore()
        }
    },
    components: {
        Dashboard
    },
    mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            this.user = user
            user? this.si = true: this.si = false
        })
    },
    methods: {
        loginGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider)
                .catch(console.log).then(
                    () => {
                    let user = firebase.auth().currentUser
                    this.db.collection('users').where("email", "==", user.email).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            this.users = doc.data() == null ? true : false
                        })
                    
                    }).then(() => {
                        if (this.users) {
                            this.updateUser()
                        }
                    })
                    // this.$router.replace('dashboard')

                    },
                    (error) => {
                        console.log(error.code)
                        console.log(error.message)
                    
                })
        },
        logout() {
            firebase.auth().signOut().then(
                () => {
					console.log("works")
                }).catch((error) => {
                    console.log(error.message)
					console.log("error")
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
    }
}
</script>

<style >
body {
    background-image: url('assets/chat_2.jpg');
    background-size: 1920px, 1080px;
    
}
</style>