import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from "./router"
import firebase from 'firebase'


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA901Vb-xVvBY-DzKcR8g4ViL2_FUjcyww",
  authDomain: "fupicon-b2ceb.firebaseapp.com",
  databaseURL: "https://fupicon-b2ceb-default-rtdb.firebaseio.com",
  projectId: "fupicon-b2ceb",
  storageBucket: "fupicon-b2ceb.appspot.com",
  messagingSenderId: "621070327333",
  appId: "1:621070327333:web:63bb55318e33e6ae5ba9cc",
  measurementId: "G-0Q2W38R9T2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
firebase.analytics();

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
