<style scoped lang="scss">
.root {
  background-color: #ccc;
  box-sizing: border-box;
  &.focused {
    border: 2px solid #0FF;
  }
}
</style>
<template>
  <div class="root" :class="{ 'focused': focused }">
    座標({{ character.x.toFixed(0) }}, {{ character.y.toFixed(0) }})
    <b-button @click="onShow">表示</b-button>
    <b-button @click="onHide">非表示</b-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as PIXI from "pixi.js"

export default Vue.extend({
  props: [
    'character', 'focused'
  ],
  methods: {
    onShow() {
      this.character.bodySprite.alpha = 1
    },
    onHide() {
      this.character.bodySprite.alpha = 0
    },
  }
});
</script>
