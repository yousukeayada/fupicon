<template>
    <v-btn @click="stateTodo">戻す</v-btn>
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
        stateTodo() {
            let database = firebase.database();
            let user = firebase.auth().currentUser;
            // firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    this.item.state = 0;
                    database.ref("/users/"+user.uid+"/todo_list").update({
                        [this.item.id]: {
                            text: this.item.text,
                            deadline: this.item.deadline,
                            state: this.item.state,
                        }
                    });
                    console.log("state change todo: "+this.item.text);
                } else {
                    console.log("StateTodoButton[stateTodo]: not user");
                }
            // });
        }
    }
}
</script>
