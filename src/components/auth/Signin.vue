<template>
  <div class="signin mt-10">
      <v-card width="400px" class="mx-auto">
          <v-card-title>
              <h1 class="display-1">サインイン</h1>
          </v-card-title>
          <v-card-text>
              <v-form>
                  <v-text-field type="email" label="メールアドレス" v-model="mailaddress" prepend-icon="mdi-email"
                                 />
                  <v-text-field v-bind:type="showPassword?'text':'password'" label="パスワード" v-model="password"
                                prepend-icon="mdi-lock" v-bind:append-icon="showPassword?'mdi-eye':'mdi-eye-off'" 
                                @click:append="showPassword=!showPassword" v-on:keyup.enter="signIn" />
                  <v-card-actions>
                      <v-btn @click="signIn" class="info" :loading="loading">サインイン</v-btn>
                  </v-card-actions>
              </v-form>
              <p>新しいアカウントを作成しますか？
                <router-link to="/signup">新規登録</router-link>
              </p>
              
              <v-btn text color="primary" @click.stop="dialog=true">パスワードを再設定する</v-btn>
          </v-card-text>
      </v-card>

      <v-dialog v-model="dialog">
          <v-card class="p-3">
                <v-card-title>パスワードを再設定する</v-card-title>
                <v-card-text>再設定メールを送るアドレスを入力してください</v-card-text>
                <v-text-field type="email" label="メールアドレス" v-model="mailaddress" prepend-icon="mdi-email" />
                <v-card-actions>
                    <v-btn @click.stop="dialog=false">閉じる</v-btn>
                    <v-btn @click="sendPasswordResetEmail" color="primary">送信</v-btn>
                </v-card-actions>
          </v-card>
      </v-dialog>
  </div>
</template>

<script>
import firebase from "firebase"

export default {
    data() {
        return {
            mailaddress: "",
            password: "",
            showPassword: false,
            dialog: false,
            loader: null,
            loading: false,
        }
    },
    methods: {
        signIn() {
            this.loader = "loading";
            firebase.auth().signInWithEmailAndPassword(this.mailaddress, this.password)
            .then(
                user => { // eslint-disable-line no-unused-vars
                    // console.log(user)
                    // alert('サインインに成功しました')
                    this.$router.push('/')
                },
                err => {
                    this.loader = "loading";
                    alert(err.message)
                }
            )
        },
        sendPasswordResetEmail() {
            let auth = firebase.auth();
            auth.sendPasswordResetEmail(this.mailaddress).then(function() {
                alert("メールを送信しました")
            }).catch(function(error) {
                alert(error)
            });
        }
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
