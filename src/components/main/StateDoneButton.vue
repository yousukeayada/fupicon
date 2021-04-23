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
            let database = firebase.database();
            let self = this;
            let user = firebase.auth().currentUser;
            // firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    if(!self.item.deadline) self.item.deadline = "";
                    self.item.state = 1;
                    database.ref("/users/"+user.uid+"/todo_list").update({
                        [self.item.id]: {
                            text: self.item.text,
                            deadline: self.item.deadline,
                            state: self.item.state,
                        }
                    });
                    console.log("state change done: "+self.item.text);
                } else {
                    // console.log("StateDoneButton[done]: not user");
                }
            // });
        }
    }
}
</script>
