<style scoped lang="scss">

</style>
<template>
  <div style="position: relative;">
    <h3 @click="$router.push('/stages/001')">キャラが8方向に歩くだけ</h3>
    <h3 @click="$router.push('/stages/002')">影をつけた</h3>
    <h3 @click="$router.push('/stages/003')">NPCも追加したし、追加された彼は最初から8方向に歩く</h3>
    <h3 @click="$router.push('/stages/004')">地形、スクロール追加</h3>
    <h3 @click="$router.push('/stages/005')">地形を多層レイヤー化</h3>
    <h3 @click="$router.push('/stages/006')">キャラ同士の衝突判定</h3>
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