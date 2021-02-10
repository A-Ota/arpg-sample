<style scoped lang="scss">

</style>
<template>
  <div style="position: relative;">
    <h3 @click="$router.push('/stages/001')">キャラが8方向に歩くだけ</h3>
    <h3 @click="$router.push('/stages/002')">影をつけた</h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
  components: {
  },
  computed: {
  },
  props: []
})
</script>