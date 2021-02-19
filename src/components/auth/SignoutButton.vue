<template>
    <v-btn @click="signOut" elevation="2">Sign out</v-btn>
</template>

<script>
import firebase from "firebase"

export default {
    methods: {
        signOut() {
            let user = firebase.auth().currentUser
            if(user) {
                firebase.auth().signOut().then(() => {
                    alert("サインアウトしました")
                    this.$router.push('/signin')
                })
            }
        },
    
    },
}
</script>
