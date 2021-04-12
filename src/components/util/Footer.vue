<template>
	<v-footer
		color="secondary lighten-3"
		padless
	>

		<v-row
			justify="center"
			no-gutters
		>
		
			<v-col
				class="py-4 text-center white--text"
				cols="12"
			>
				{{ new Date().getFullYear() }} — <strong>FuPicon</strong>
				<v-btn id="github" icon color="github" :href="github" target="_blank">
					<v-icon>mdi-github</v-icon>
				</v-btn>
			</v-col>
		</v-row>
		
	</v-footer>
</template>    

<script>
export default {
	data() {
		return {
			github: "https://github.com/yousukeayada/fupicon/",
		}
	},
}
</script>

<style scoped>
#github {
	text-decoration: none;
}
</style>
