<template>
	<div>
		<v-menu
			offset-y nudge-right="30" min-width="0"
			:close-on-content-click="false"
			v-model="dateMenu"
		>
			<template v-slot:activator="{ on }">
				<v-text-field
					label="締切"
					readonly
					:value="date"
					v-on="on"
					prepend-icon="mdi-calendar"
					append-icon="mdi-close-circle" 
					@click:append="clearText"
				></v-text-field>
			</template>
			<v-date-picker
				no-title
				locale="ja-jp"
				:day-format="d => new Date(d).getDate()"
				v-model="date"
				@input="dateMenu = false"
				@change="onDateChange"
			></v-date-picker>
		</v-menu>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		value: {
			type: String,
			default: "",
		}
	},
	data () {
		// const d = new Date();
		return {
			// date: `${d.getFullYear()}-${('00' + (d.getMonth() + 1)).slice(-2)}-${('00' + d.getDate()).slice(-2)}`,
			date: null,
			dateMenu: false,
		}
	},
	methods: {
		onDateChange () {
			console.log("date change: "+this.date);
			// this.$emit("calender-click", this.date);
			this.$emit("input", this.date);
		},
		clearText() {
			this.date = null;
			this.onDateChange();
		}
	},
	// 参考
	// https://blog.capilano-fw.com/?p=7622
	watch: {
		value: {
			immediate: true,
			handler(value) {
				this.date = value
			}
		}
	}
})
</script>
