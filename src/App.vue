<template>
<div class="container">
    <router-view />
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
   computed: mapState(['user']),
    created() {
        this.$store.watch((newValue, oldValue) => {
            console.log(newValue)
            if ( newValue.user != null){
                this.$router.push({ name: 'Dashboard' })
            }
            else {
                this.$router.push({ name: 'Home' })
            }
        })
    },
}
</script>

<style >
body {
    /* background-color:#2E3440; */
    background-image: url("./assets/chat_2.png");
    background-repeat:cover;
}
</style>