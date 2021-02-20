<template>
<div>
    <v-navigation-drawer app clipped v-model="drawer" class="indigo lighten-1">
        <div class="text-center text-white">
        <h4 class="m-3">Navigation List</h4>
        <v-list>
    
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
import SignoutButton from '@/components/auth/SignoutButton'

export default {
    components: {
        SignoutButton,
    },
    data() {
        return {
            drawer: false,
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cabin+Sketch&display=swap');
/* @import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap'); */
.h1, h1 {
  font-family: 'Cabin Sketch', cursive;
  /* font-family: 'Chewy', cursive; */
}
</style>
