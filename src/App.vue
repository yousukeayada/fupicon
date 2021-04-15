<template>
	<v-app :style="{ background: $vuetify.theme.themes.light.background }">
		<Header></Header>


		<v-main>
			<router-view></router-view>
		</v-main>


		<v-divider></v-divider>
		<Footer class="mt-10"></Footer>
	</v-app>
</template>

<script>
// import firebase from 'firebase'
import Header from './components/util/Header'
import Footer from './components/util/Footer'

export default {
	name: 'App',

	components: {
		Header,
		Footer,
	},

	data: () => ({
		//
	}),
	beforeCreate() {
		console.log("beforeCreate App");
	},
	created() {
		console.log("created App");
	},
	beforeMount() {
		console.log("beforeMount App");
	},
	mounted() {
		console.log("mounted App");
	}
};
</script>

<style scoped>

</style>
