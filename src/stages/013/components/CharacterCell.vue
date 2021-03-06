<style scoped lang="scss">
.root {
  height: 52px;
  background-color: #ccc;
  box-sizing: border-box;
  &.focused {
    background-color: #75a2d2;
    border: 2px solid #2d69ab;
  }
}
.position {
  margin-left: 8px;
  flex-grow: 1;
}
</style>
<template>
  <div @click="$emit('click')" class="root" :class="{ 'focused': focused }">
    <img style="margin-left: 6px; margin-top: 6px; width:32px; height:32px;" :src="`/arpg-sample/images/stages/013/chara${character.type + 1}-icon.png`">
    <div class="position">
      x: {{ character.x.toFixed(0) }}<br>
      y: {{ character.y.toFixed(0) }}
    </div>
    <b-button @click.stop="$emit('delete')" style="margin-right: 4px; margin-top: 8px; height: 32px;">削除</b-button>
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
