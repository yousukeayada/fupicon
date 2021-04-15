<template>
<div>
    <v-list-item @click.stop="openDialog">
        <v-list-item-title>Discord と連携</v-list-item-title>
    </v-list-item>

    <v-dialog v-model="dialog">
        <v-card class="p-3" dark>
            <v-card-title>Discord と連携</v-card-title>
            <v-card-text>
                指定した Discord チャンネルに毎日12時に TODO を通知します。
            </v-card-text>
            <v-img width="300" class="mx-auto" src="https://yousukeayada.github.io/general/assets/img/fupicon/discord.png"></v-img>
            <v-card-title>1. Bot を招待する</v-card-title>
            <v-card-text>
                以下のボタンより自分のサーバーに Bot を招待してください。これは初めの1回のみ行えば良いです。
            </v-card-text>
            <v-card-actions>
            <v-btn :href="inviteLink" target="_blank">Bot を招待</v-btn>
            </v-card-actions>
            <v-card-title>2. チャンネル ID を設定する</v-card-title>
            <v-card-text>
                Bot がメッセージを送るテキストチャンネルの ID を設定してください。
            </v-card-text>
            <v-img width="200" class="mx-auto" src="https://yousukeayada.github.io/general/assets/img/fupicon/discord2.png"></v-img>
            <v-text-field type="text" label="チャンネル ID" v-model="channelId" prepend-icon="mdi-identifier" />
            <v-card-actions>
                <v-btn @click="setChannelId">設定</v-btn>
            </v-card-actions>
            <v-card-title>3. メッセージを確認する</v-card-title>
            <v-card-text>
                Bot から指定したチャンネルにメッセージが届くので、確認してください。以降は毎日12時に TODO が通知されます。
            </v-card-text>
            <v-img width="300" class="mx-auto" src="https://yousukeayada.github.io/general/assets/img/fupicon/discord3.png"></v-img>

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
    data() {
        return {
            dialog: false,
            inviteLink: "https://discord.com/api/oauth2/authorize?client_id=813655319796383754&permissions=0&scope=bot",
            channelId: "",
        }
    },
    methods: {
        openDialog() {
            let self = this;
            let user = firebase.auth().currentUser;
            // firebase.auth().onAuthStateChanged((user) => {
                // if(user) {
                    let database = firebase.database();
                    database.ref("/users/"+user.uid+"/discord_channel_id").once("value").then((snapshot) => {
                        self.channelId = snapshot.val()
                    });
                    self.dialog = true;
            //     } else {
            //         console.log("DiscordConnect: サインインしてください");
            //     }
            // });
        },
        setChannelId() {
            let self = this;
            let user = firebase.auth().currentUser;
            // firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    let database = firebase.database();
                    database.ref("/users/"+user.uid+"/").update({
                        discord_channel_id: self.channelId
                    });
                    alert("チャンネル ID を設定しました："+self.channelId);
                } else {
                    console.log("DiscordConnect: サインインしてください");
                }
            // });
        }
    }
}
</script>
