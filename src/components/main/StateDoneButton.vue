<template>
    <v-btn @click="done" class="green accent-2">完了</v-btn>
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
        done() {
            let user = firebase.auth().currentUser;
            let database = firebase.database();

            this.item.state = 1
            database.ref("/users/"+user.uid+"/todo_list").update({
                [this.item.id]: {
                    text: this.item.text,
                    deadline: this.item.deadline,
                    state: this.item.state,
                }
            });

            console.log("state done: "+this.item.text)
        }
    }
}
</script>
