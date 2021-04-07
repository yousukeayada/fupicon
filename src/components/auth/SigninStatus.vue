<template>
        <!-- <v-btn color="info" disabled> -->
    <!-- <v-row align-content="center" v-model="signInStatus"> -->
        <div>
        {{ signInStatus }}
        </div>
    <!-- </v-row> -->
        <!-- </v-btn> -->
</template>

<script>
import firebase from "firebase"

export default {
    data() {
        return {
            signInStatus: "未ログイン",
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.signInStatus = "ログイン済"
            } else {
                this.signInStatus = "未ログイン"
            }
        });
    }
}
</script>
