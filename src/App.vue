<template>
<div class="container">
    <router-view />
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
   computed: mapState(['user']),
    mounted() {
        this.$store.watch((newValue, oldValue) => {
            if ( newValue.user !== null){
                this.$router.push({ name: 'Dashboard' })
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