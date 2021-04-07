<template>
<div>
    <v-list-item @click.stop="openDialog">
        <v-list-item-title>LINE と連携</v-list-item-title>
    </v-list-item>

    <v-dialog v-model="dialog">
        <v-card class="p-3" dark>
            <v-card-title>LINE と連携</v-card-title>
            <v-card-text>
                LINE に毎日12時に TODO を通知します。
            </v-card-text>

            <v-card-title>1. Bot を友だちに追加する</v-card-title>
            <v-card-text>
                以下の QR コードまたはボタンより Bot を友だちに追加してください。これは初めの1回のみ行えば良いです。
            </v-card-text>
            <v-img width="200" class="mx-auto" src="https://qr-official.line.me/sid/M/672ggxnx.png"></v-img>
            <v-card-actions>
                <a href="https://lin.ee/J1DSILb" target="_blank"><img src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png" alt="友だち追加" height="36" border="0"></a>
            </v-card-actions>

            <v-card-title>2. ユーザ ID を設定する</v-card-title>
            <v-card-text>
                Bot から送られてきたユーザ ID を設定してください。
            </v-card-text>
            <v-img width="200" class="mx-auto" src="https://yousukeayada.github.io/general/assets/img/fupicon/line2.png"></v-img>
            <v-text-field type="text" label="ユーザ ID" v-model="userId" prepend-icon="mdi-identifier" />
            <v-card-actions>
                <v-btn @click="setUserId">設定</v-btn>
            </v-card-actions>

            <v-card-title>3. メッセージを確認する</v-card-title>
            <v-card-text>
                Bot からメッセージが届くので、確認してください。以降は毎日12時に TODO が通知されます。
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn text color="primary" @click.stop="dialog=false">閉じる</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import firebase from 'firebase'

export default {
    props: {
        
    },
    data() {
        return {
            dialog: false,
            userId: "",
        }
    },
    methods: {
        openDialog() {
            let self = this
            // let user = firebase.auth().currentUser;
            firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    let database = firebase.database();
                    database.ref("/users/"+user.uid+"/line_user_id").once("value").then((snapshot) => {
                        self.userId = snapshot.val()
                    })
                    self.dialog = true
                } else {
                    alert("サインインしてください")
                }
            });
        },
        setUserId() {
            let self = this
            // let user = firebase.auth().currentUser;
            firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    let database = firebase.database();
                    database.ref("/users/"+user.uid+"/").update({
                        line_user_id: self.userId
                    });
                    alert("ユーザ ID を設定しました："+self.userId)
                } else {
                    alert("サインインしてください")
                }
            });
        }
    }
}
</script>
