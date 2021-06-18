<template>
<div class="box">
    <h1 class="heading">G-CHAT</h1>
    <div class="items">
        <ul class="navbar-nav">
            <li class="nav-item">
                <router-link to="about">ABOUT</router-link>
            </li>
            <li v-if="user" class="nav-item">
                <a @click=" $store.dispatch('logout') " >LOGOUT</a>
            </li>
            <li v-else class="nav-item">
                <a @click=" $store.dispatch('login') ">LOGIN</a>
            </li>
        </ul>
    </div>
</div>
</template>

<style scoped >

.box {
    width: 30%;
    height: auto;
    margin: auto;
    margin-top: 20vh;
    border: 3px solid #434C5E;
    border-radius: 20px;
    text-align: center;
    background-color: #3b4252c2;
    color: white;
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
    color: white;
}

a:hover{
    font-size: 35px;
    color: grey;
}

.heading{
    text-align: center;
    font-family: Luckiest Guy, cursive;
    font-size: 60px;
    font-weight: 300;
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

