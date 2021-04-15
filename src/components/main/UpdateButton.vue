<template>
    <v-btn @click="update(item)" class="blue accent-2">更新</v-btn>
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
        update() {
            let database = firebase.database();
            firebase.auth().onAuthStateChanged((user) => {
                if(user) {
                    database.ref("/users/"+user.uid+"/todo_list").update({
                        [this.item.id]: {
                            text: this.item.text,
                            deadline: this.item.deadline,
                            state: this.item.state,
                        }
                    });
                    console.log("updated item: "+this.item.text+","+this.item.deadline);
                    this.$emit("dialog-close", false);
                } else {
                    console.log("UpdateButton[update]: not user");
                }
            });
        }
    }
}
</script>
