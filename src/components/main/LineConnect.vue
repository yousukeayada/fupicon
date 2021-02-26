<template>
<div>
    <v-list-item @click.stop="dialog=true">
    <v-list-item-title>LINE と連携</v-list-item-title>
    </v-list-item>

    <v-dialog v-model="dialog">
        <v-card class="p-3" dark>
            Coming Soon
        </v-card>
    </v-dialog>
</div>
</template>

<script>
// import firebase from 'firebase'

export default {
    props: {
        
    },
    data() {
        return {
            dialog: false,
        }
    },
    methods: {
        
    }
}
</script>
