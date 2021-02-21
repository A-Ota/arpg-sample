<style scoped lang="scss">
</style>
<template>
  <div class="root" @mouseup="onMouseUp" @mouseleave="onMouseUp" @mousemove="onMouseMove" @mousedown="onMouseDown">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as PIXI from "pixi.js"

export default Vue.extend({
  props: [
    'imagePath'
  ],
  data(): {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    image: HTMLImageElement | null;
  } {
    return {
      canvas: null,
      ctx: null,
      image: null
    }
  },
  mounted() {
    this.canvas = this.$refs.canvas as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d')
    this.image = new Image()
    this.image.src = this.imagePath
  },
  methods: {
    onMouseDown(event: MouseEvent) {
      this.ctx!.drawImage(this.image!, 0, 0)
    },
    onMouseMove(event: MouseEvent) {
    },
    onMouseUp(event: MouseEvent) {
    },
    upddateSelectedGrid() {
    },
    updateFocus() {
    }
  },
  components: {
  }
});
</script>
