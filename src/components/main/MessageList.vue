<template>
<div>
    <h3 class="p-2 text-white indigo lighten-3 rounded">TODO</h3>
    <v-data-table
        :headers="todoHeaders"
        :items="todoList"
        item-key="todo"
        :items-per-page="10"
        :mobile-breakpoint="0"
        class="elevation-1 my-5 pt-5"
    >

        <template v-slot:item="{ item }">
            <tr>
                <td class="todo-cell" @click.stop="openDialog(item)">
                    {{ item.text }}
                </td>
                <td v-if="item.deadline" class="todo-deadline" @click.stop="openDialog(item)">
                    {{ item.deadline }}
                </td>
                <td v-else class="todo-deadline" @click.stop="openDialog(item)">
                    no deadline
                </td>
                <!-- 編集以外のボタン押した時はダイアログ出さない -->
                <td class="todo-ops">
                  <StateDoneButton :item="item" class="m-2"></StateDoneButton>
                  <v-btn @click.stop="openDialog(item)" class="m-2 blue accent-2">編集</v-btn>
                  <DeleteButton :item="item" class="m-2"></DeleteButton>
                </td>
            </tr>
        </template>
    </v-data-table>

    

    <h3 class="p-2 text-white indigo lighten-3 rounded">DONE</h3>
    <v-data-table
        :headers="doneHeaders"
        :items="doneList"
        item-key="done"
        :items-per-page="10"
        :mobile-breakpoint="0"
        class="elevation-1 my-5 pt-5"
    >

        <template v-slot:item="{ item }">
            <tr>
                <td class="todo-cell" @click.stop="openDialog(item)">
                    {{ item.text }}
                </td>
                <td v-if="item.deadline" class="todo-deadline" @click.stop="openDialog(item)">
                    {{ item.deadline }}
                </td>
                <td v-else class="todo-deadline" @click.stop="openDialog(item)">
                    no deadline
                </td>
                <!-- 編集以外のボタン押した時はダイアログ出さない -->
                <td class="todo-ops">
                  <StateTodoButton :item="item" class="m-2"></StateTodoButton>
                  <v-btn @click.stop="openDialog(item)" class="m-2 blue accent-2">編集</v-btn>
                  <DeleteButton :item="item" class="m-2"></DeleteButton>
                </td>
            </tr>
        </template>
    </v-data-table>

    <!-- 編集時のダイアログ -->
    <v-dialog v-model="dialog">
      <v-card class="p-3">
        <v-text-field type="text" label="テキストを入力してください" v-model="todo.text" prepend-icon="mdi-text" />
        <DatePicker v-model="todo.deadline"></DatePicker>
        <v-btn class="m-3" @click="closeDialog">閉じる</v-btn>
        <UpdateButton class="m-3" :item="todo" @dialog-close="dialog=$event"></UpdateButton>
      </v-card>
    </v-dialog>
</div>
</template>

<script>
import firebase from 'firebase'
import StateDoneButton from './StateDoneButton'
import StateTodoButton from './StateTodoButton'
import DeleteButton from './DeleteButton'
import DatePicker from './DatePicker'
import UpdateButton from './UpdateButton'

export default {
    components: {
        StateDoneButton,
        StateTodoButton,
        DeleteButton,
        DatePicker,
        UpdateButton,
    },
    data() {
        return {
            messages: [],
            todoList: [],
            doneList: [],
            todoHeaders: [
                { text: 'TODO', value: 'todo', align: 'left' },
                { text: '締切', value: 'deadline', align: 'left' },
                { text: '操作', value: 'ops', align: 'left' },
            ],
            doneHeaders: [
                { text: 'DONE', value: 'done', align: 'left' },
                { text: '締切', value: 'deadline', align: 'left' },
                { text: '操作', value: 'ops', align: 'left' },
            ],
            dialog: false,
            todo: null,
            todoPrev: null,
        }
    },
    created() {
        this.fetchTodoList()
    },
    methods: {
		test(item) {
			alert("test: "+item.text)
		},
		test2() {
			console.log("test2: "+this.todo.deadline+","+this.todo.text)
		},
		fetchTodoList() {
			firebase.auth().onAuthStateChanged((user) => {
				let database = firebase.database()
				let self = this
				database.ref("/users/"+user.uid+"/todo_list").on("value", function(data) {
				let todos = [], dones = []
				const key = data.key
				const val = data.val()

				for(let v in val) {
					console.log(v+", "+val[v].text)
					const item = { id: v, text: val[v].text, deadline: val[v].deadline, state: val[v].state }
					self.todo = item
				
					if(val[v].state === 0) todos.push(item)
					else if(val[v].state === 1) dones.push(item)
				}

				self.todoList = todos
				self.doneList = dones
				})
			});
		},
		openDialog(item) {
			this.todo = item
			this.todoPrev = item
			console.log("dialog open: "+this.todo.text+","+this.todo.deadline)
			this.dialog = true
		},
		closeDialog() {
			console.log("dialog close: "+this.todoPrev.text+","+this.todoPrev.deadline)
			this.todo = this.todoPrev
			this.dialog = false
		}
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cabin+Sketch&display=swap');
.h3, h3 {
	font-family: 'Cabin Sketch', cursive;
}

.v-data-table {
	/* 改行しない */
	white-space : nowrap;
}

/* .v-data-table-header {
  white-space: nowrap;
}
.todo-cell {
  word-break: break-all;
}

.todo-deadline {
  white-space: nowrap;
}

.todo-ops {
  white-space: nowrap;
} */

</style>
