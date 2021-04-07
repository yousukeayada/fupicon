<template>
<v-form>
    <v-text-field type="text" label="TODO" v-model="text" prepend-icon="mdi-text" />
  
    <!-- <input type="date" v-model="deadline" /><br> -->
    <DatePicker v-model="deadline"></DatePicker>
    <!-- <p>{{ deadline }}</p> -->
    <!-- <v-btn @click="test">確認</v-btn> -->
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
    created() {
        this.text = ""
        this.deadline = ""
    },
    methods: {
        test() {
            console.log(this.deadline)
        },
        addTodo() {
            if(!this.text) {
                alert("TODO を入力してください");
            } else {
                // let user = firebase.auth().currentUser;
                let database = firebase.database();
                // if(!this.deadline) this.deadline = "no deadline"
                if(!this.deadline) this.deadline = ""
                firebase.auth().onAuthStateChanged((user) => {
                    database.ref("/users/"+user.uid+"/todo_list").push({
                        text: this.text,
                        deadline: this.deadline,
                        state: 0,
                    });
                });
                // this.text = "";
                // this.deadline = null;
            }
        }
    }
}
</script>
