<template>
  <div class="about">
    <h1>G-Chat</h1>
    <p>v1.0</p>
    <h4>This is a realtime chat application made with Vue 3 framework</h4>
    <div class="links">
      <a class="github" href="https://github.com/ThaHobbyist/Realtime-Chat">Github Repo</a>
      <router-link class="home" to="/">Back to Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.about {
  width: 40vw;
  height: 45vh;
  margin: auto;
  margin-top: 20vh;
  border: 5px solid black;
  border-radius: 20px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.4);
}

h1{
  text-align: center;
  font-family: Luckiest Guy, cursive;
  font-size: 60px;
  margin-bottom: 0;
}

p{
  font-family: Slackey, cursive;
}

h4{
  font-family: 'Patrick Hand', cursive;
  font-size: 25px;
}

a{
  text-decoration: none;
  color: black;
  display: block;
  margin-bottom: 1em;
  font-size: 17px;
}

a:hover{
  font-size: 20px;
  color: grey;
}

.links {
  margin-top: 3em;
  font-family: Slackey, cursive;
}

@media screen and (max-width: 540px) {
.about {
    margin: auto;
    width: 70vw;
    margin-top: 20vh;
    height: auto;
}

h4{
  padding: 4px;
}
}
</style>
