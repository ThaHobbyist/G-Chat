<template>
<div class="box">
    <h1 class="heading">G-CHAT</h1>
    <div class="items">
        <ul class="navbar-nav">
            <li class="nav-item">
                <router-link to="/about">ABOUT</router-link>
            </li>
            <li v-if="user" class="nav-item">
                <a @click="logout" >LOGOUT</a>
            </li>
            <li v-else class="nav-item">
                <a @click="$emit('login')">LOGIN</a>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import firebase from 'firebase'



export default {
    name: 'App',
    data() {
        return {
          user: firebase.auth().currentUser? true : false,
          db: firebase.firestore(),
          users: Boolean,
        }
    },
    emits: ['login'],
    methods: {
        logout() {
            firebase.auth().signOut().then(
                () => {
                    
                    this.$router.replace('/')
                    
                }).catch((error) => {
                    let errorResponse = JSON.parse(error.message)
                    console.log(errorResponse)
                })
        },
        loginGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider)
                .catch(console.log).then(
                    () => {    
                    
                    
                    let user = firebase.auth().currentUser
                    localStorage.setItem("user", user)
                    this.db.collection('users').where("email", "==", user.email).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            this.users = doc.data() == null ? true : false
                        })
                    
                    }).then(() => {
                        if (this.users) {
                            this.updateUser()
                        }
                    })
                    this.$router.replace('dashboard')

                    },
                    (error) => {
                        console.log(error.code)
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
        }
        
    },
    
}
</script>

<style scoped >

.box {
    width: 40vw;
    height: 45vh;
    margin: auto;
    margin-top: 20vh;
    border: 5px solid black;
    border-radius: 20px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.4);
}

.nav-item {
    text-decoration: none;
    list-style: none;
    font-size: 30px;
    margin-bottom: 20px;
    cursor: pointer;
    
}

a{
    text-decoration: none;
    color: black;
}

a:hover{
    font-size: 35px;
    color: grey;
}

.heading{
    text-align: center;
    font-family: Luckiest Guy, cursive;
    font-size: 60px;
}

ul {
    text-align: center;
    padding: 0;
    font-family: Rowdies, cursive;
    margin-top: 80px;
}

@media screen and (max-width: 540px) {
.box {
    margin: auto;
    width: 70vw;
    margin-top: 20vh;
}
}

</style>

