<template>
    <v-btn @click="deleteItem" class="red accent-2">削除</v-btn>
</template>

<script>
import firebase from 'firebase'

export default {
    props: {
        item: {
            type: Object,
            required: true
        },
    },
    methods: {
        deleteItem() {
            let database = firebase.database();
            let user = firebase.auth().currentUser;
            // firebase.auth().onAuthStateChanged((user) => {
                database.ref("/users/"+user.uid+"/todo_list/"+this.item.id).remove();
                console.log("delete: "+this.item.text);
            // });
        }
    }
}
</script>
