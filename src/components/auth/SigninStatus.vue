<template>
    <div>
        {{ signInStatus }}
    </div>
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
