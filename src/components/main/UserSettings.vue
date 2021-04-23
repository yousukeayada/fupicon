<template>
<div>
    <v-list-item @click.stop="openDialog">
        <v-list-item-title>ユーザ設定</v-list-item-title>
    </v-list-item>

    <v-dialog v-model="dialog">
        <v-card class="p-3">
            <v-card-title>ユーザ設定</v-card-title>
            <v-text-field type="text" label="名前" v-model="username" prepend-icon="mdi-rename-box" />
            <v-text-field type="email" label="メールアドレス" v-model="mailaddress" prepend-icon="mdi-email" />
            <v-card-actions>
                <v-btn @click="updateUser">変更</v-btn>
            </v-card-actions>

            <v-divider></v-divider>

            <v-card-text>アカウントを削除する</v-card-text>
            <v-card-actions>
                <v-btn @click.stop="openDeleteDialog">削除</v-btn>
            </v-card-actions>

            <v-divider></v-divider>

            <v-card-actions>
                <v-btn text color="primary" @click.stop="dialog=false">閉じる</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog">
        <v-card class="p-3">
            <v-card-title>アカウントを削除しますか？</v-card-title>
            <v-text-field v-bind:type="showPassword?'text':'password'" label="パスワード" v-model="password"
                            prepend-icon="mdi-lock" v-bind:append-icon="showPassword?'mdi-eye':'mdi-eye-off'" 
                            @click:append="showPassword=!showPassword" />
            <v-card-actions>
                <v-btn @click.stop="deleteDialog=false">キャンセル</v-btn>
                <v-btn @click="deleteUser" class="red accent-2" :loading="loading">削除</v-btn>
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
            deleteDialog: false,
            username: "",
            currentUsername: "",
            mailaddress: "",
            currentMailaddress: "",
            password: "",
            showPassword: false,
            loader: null,
            loading: false,
        }
    },
    methods: {
        openDialog() {
            let self = this;
            let user = firebase.auth().currentUser;
            // firebase.auth().onAuthStateChanged((user) => {
            //     if(user) {
                    let database = firebase.database();
                    database.ref("/users/"+user.uid+"/username").once("value", function(data) {
                        self.username = data.val();
                        self.currentUsername = self.username;
                    });
                    self.mailaddress = user.email;
                    self.currentMailaddress = self.mailaddress;
                    // self.password = user.providerData[0].providerId;
                    this.dialog = true;
                // } else {
                    // alert("サインインしてください");
                // }
            // });
        },
        updateUser() {
            let self = this;
            let user = firebase.auth().currentUser;
            // firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    // ユーザ名
                    if(self.username !== self.currentUsername) {
                        let database = firebase.database();
                        database.ref("/users/"+user.uid+"/").update({
                            username: self.username
                        });
                    }
                    // メールアドレス
                    if(self.mailaddress !== self.currentMailaddress) {
                        user.updateEmail(self.mailaddress).then(function() {
        
                        }).catch(function(error) {
                            alert(error);
                        });
                    }
                    alert("アカウント情報を変更しました："+this.username);
                } else {
                    console.log("UserSettings: サインインしてください");
                }
            // });
        },
        openDeleteDialog() {
            this.deleteDialog = true;
        },
        deleteUser() {
            let self = this;
            if(self.password === "") {
                alert("パスワードを入力してください");
                return;
            }
            self.loader = "loading";
            let user = firebase.auth().currentUser;
            // firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    const credential = firebase.auth.EmailAuthProvider.credential(
                        user.email,
                        self.password
                    );
                    user.reauthenticateWithCredential(credential).then(() => {
                        let database = firebase.database();
                        database.ref("/users/"+user.uid+"/").remove();
                        user.delete().then(function() {
                            console.log("アカウントを削除しました");
                            alert("アカウントを削除しました");
                            self.password = "";
                            self.loader = "loading";
                            self.$router.push('/signin');
                        }).catch(function(error) {
                            alert(error);
                        });
                    }).catch((error) => {
                        alert(error);
                    });
                } else {
                    console.log("UserSettings: サインインしてください");
                }
                self.loader = "loading";
            // });
        },
    },
    watch: {
        loader() {
            const l = this.loader;
            this[l] = !this[l];
            this.loader = null;
        }
    }
}
</script>
