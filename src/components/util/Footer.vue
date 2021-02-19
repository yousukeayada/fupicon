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
      </v-col>
    </v-row>
  </v-footer>
</template>    

<script>
export default {
    data: () => ({
    
    }),
}
</script>
