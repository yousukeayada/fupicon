<template>
<div class="m-3">
    <v-row class="m-3" align="center">
        <SigninStatus></SigninStatus>
        : {{ username }}
        <v-spacer></v-spacer>
        前回ログイン: {{ lastLoginAt }}
        <SignoutButton class="m-2"></SignoutButton>
    </v-row>

    <v-card class="p-3">
        <AddMessageForm></AddMessageForm>
    </v-card>

    <v-divider></v-divider>
    
    <v-card class="p-3">
        <MessageList></MessageList>
    </v-card>
</div>
</template>

<script>
import firebase from 'firebase'
import SigninStatus from '@/components/auth/SigninStatus'
import SignoutButton from '@/components/auth/SignoutButton'
import MessageList from './MessageList'
import AddMessageForm from './AddMessageForm'

export default {
    components: {
        SigninStatus,
        SignoutButton,
        MessageList,
        AddMessageForm,
    },
    data() {
        return {
            username: "",
            lastLoginAt: null,
        }
    },
    beforeCreate() {
        console.log("beforeCreate MainView");
    },
    created() {
        console.log("created MainView");
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                // 前回ログイン日時とユーザ名取得
                let lastSignInTime = user.metadata.lastSignInTime;
                this.lastLoginAt = new Date(lastSignInTime).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
                let self = this;
                let database = firebase.database();  
                database.ref("/users/"+user.uid+"/username").once("value", function(data) {
                    self.username = data.val();
                });
            } else {
                console.log("MainView: サインインしてください");
                // this.$router.push('/signin');
            }
        })
    },
    beforeMount() {
        console.log("beforeMount MainView");
    },
    mounted() {
        console.log("mounted MainView");
    }
}
</script>
