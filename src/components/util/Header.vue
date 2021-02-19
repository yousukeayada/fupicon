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
        <v-toolbar-title>FuPicon</v-toolbar-title>
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
