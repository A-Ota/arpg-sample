<style lang="scss">
body {
  margin: 0px;
}
</style>
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'app',
  components: {
  },
  computed: {
  },
  watch: {
    '$route' (to: any, from: any) {
    }
  },
  methods: {
  }
})
</script>