<template>
<div>
    <v-navigation-drawer app clipped v-model="drawer" class="indigo lighten-5">
        <div class=" text-grey">
        <h4 class="m-3">Menu</h4>
        <v-list nav id="menu">
            <v-list-item-group>

                <DiscordConnect></DiscordConnect>

                <LineConnect></LineConnect>

                <UserSettings></UserSettings>
    
            </v-list-item-group>
            <v-list-item>
                <SignoutButton></SignoutButton>
            </v-list-item>
        </v-list>
        </div>
    </v-navigation-drawer>

    <v-app-bar class="indigo lighten-1" app>
        <v-app-bar-nav-icon @click="drawer=!drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class=" "><h1 id="title">FuPicon</h1></v-toolbar-title>
        <v-spacer></v-spacer>

    </v-app-bar>
</div>
</template>

<script>
import firebase from "firebase"
import SignoutButton from '@/components/auth/SignoutButton'
import DiscordConnect from '@/components/main/DiscordConnect'
import LineConnect from '@/components/main/LineConnect'
import UserSettings from '@/components/main/UserSettings'

export default {
    components: {
        SignoutButton,
        DiscordConnect,
        LineConnect,
        UserSettings,
    },
    data() {
        return {
            drawer: false,
        }
    },
    created() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // console.log("login success: "+user.email);
                const menu = document.getElementById("menu");
                menu.style.display = "block";
            } else {
                const menu = document.getElementById("menu");
                menu.style.display = "none";
            }
        });
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cabin+Sketch&display=swap');
.h1, h1 {
    font-family: 'Cabin Sketch', cursive;
}

.h4, h4 {
    font-family: 'Cabin Sketch', cursive;
}
</style>
