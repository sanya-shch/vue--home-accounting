<template>
  <div class="grey darken-1 empty-layout">
     <router-view />
  </div>
</template>

<script>
  import messages from "../utils/messages";

  export default {
    name: "empty-layout",
    computed: {
      error() {
        return this.$store.getters.error
      }
    },
    watch: {
      error(firestoreError) {
        // console.log(firestoreError)
        this.$error(messages[firestoreError.code] || 'Что-то пошло не так')
      }
    }
  }
</script>
