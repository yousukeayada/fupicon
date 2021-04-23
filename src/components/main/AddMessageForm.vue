<template>
<v-form>
    <v-text-field type="text" label="TODO" v-model="text" prepend-icon="mdi-text" />
  
    <DatePicker v-model="deadline"></DatePicker>
    <v-btn @click="addTodo" color="" class="my-2 blue accent-2">追加</v-btn>
</v-form>
</template>

<script>
import firebase from 'firebase'
import DatePicker from './DatePicker'

export default {
    components: {
        DatePicker
    },
    date() {
        return {
            text: "",
            deadline: "",
        }
    },
    beforeCreate() {
        console.log("beforeCreate AddMessageForm");
    },
    created() {
        console.log("created AddMessageForm");
        // if(!this.text) console.log("not text");
        // this.text = ""
        // this.deadline = ""
    },
    beforeMount() {
        console.log("beforeMount AddMessageForm");
    },
    mounted() {
        console.log("mounted AddMessageForm");
    },
    methods: {
        test() {
            console.log(this.deadline)
        },
        addTodo() {
            if(!this.text) {
                alert("TODO を入力してください");
            } else {
                let database = firebase.database();
                if(!this.deadline) this.deadline = "";
                let user = firebase.auth().currentUser;
                // firebase.auth().onAuthStateChanged((user) => {
                    if(user) {
                        database.ref("/users/"+user.uid+"/todo_list").push({
                            text: this.text,
                            deadline: this.deadline,
                            state: 0,
                        });
                    } else {
                        console.log("AddMessageForm: not user");
                    }
                // });
            }
        }
    }
}
</script>
