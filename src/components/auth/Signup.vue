<template>
	<div class="signup mt-10">
		<v-card width="400px" class="mx-auto">
			<v-card-title>
				<h1 class="display-1">サインアップ</h1>
			</v-card-title>
			<v-card-text>
				<v-form>
					<v-text-field type="text" label="ユーザ名" v-model="username" />
					<v-text-field type="email" label="メールアドレス" v-model="mailaddress" prepend-icon="mdi-account-circle" />
					<v-text-field v-bind:type="showPassword?'text':'password'" label="パスワード" v-model="password"
								prepend-icon="mdi-lock" v-bind:append-icon="showPassword?'mdi-eye':'mdi-eye-off'" 
								@click:append="showPassword=!showPassword" />
					<v-card-actions>
						<v-btn @click="signUp" class="info" :loading="loading">登録</v-btn>
					</v-card-actions>
				</v-form>
				<p>既にアカウントを持っている方：
					<router-link to="/signin">サインイン</router-link>
				</p>
			</v-card-text>
          
		</v-card>
	</div>
</template>

<script>
import firebase from 'firebase'

export default {
	name: 'Signup',
	data () {
		return {
			username: "",
			mailaddress: '',
			password: '',
			showPassword: false,
			loader: null,
			loading: false,
		}
	},
	methods: {
		signUp() {
			let self = this;
			if(!self.username) {
				alert("ユーザ名を入力してください");
				return;
			}
			if(self.password.length < 6) {
				alert("パスワードは6文字以上入力してください");
				return;
			}
			self.loader = "loading";
			let database = firebase.database();
			firebase.auth().createUserWithEmailAndPassword(this.mailaddress, this.password)
				.then(result => {
					// console.log(result.user);
					database.ref("/users/").update({
						[result.user.uid]: {
							username: this.username,
						}
					});
					alert('アカウントを作成しました: ', self.username);
					this.$router.push('/');
				})
				.catch(error => {
					this.loader = "loading";
					alert(error.code+": "+error.message);
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
