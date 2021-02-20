<style scoped lang="scss">
.root {
  position: relative;
}
.mapchip-image {
  pointer-events: none;
  image-rendering: pixelated;
  -webkit-user-drag: none;
  -webkit-user-select: none;
}
.focus {
  pointer-events: none;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 16px;
  height: 16px;
  border-width: 2px;
  border-color: #F0F;
  border-style: solid;
  box-sizing: border-box;
}
</style>
<template>
  <div class="root" @mouseup="onMouseUp" @mouseleave="onMouseUp" @mousemove="onMouseMove" @mousedown="onMouseDown">
    <img class="mapchip-image" :src="imagePath">
    <div ref="focus" class="focus"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as PIXI from "pixi.js"

export default Vue.extend({
  props: [
    'imagePath', 'gridSizeX', 'gridSizeY'
  ],
  data(): {
    selectedGrid: PIXI.Rectangle | null;
    dragStartGrid: PIXI.Point | null;
    dragEndGrid: PIXI.Point | null;
    focusElement: HTMLElement | null;
  } {
    return {
      selectedGrid: null,
      dragStartGrid: null,
      dragEndGrid: null,
      focusElement: null
    }
  },
  mounted() {
    this.focusElement = (this.$refs.focus as HTMLElement)
  },
  methods: {
    onMouseDown(event: MouseEvent) {
      this.selectedGrid = null
      this.dragStartGrid = new PIXI.Point(Math.floor(event.offsetX / this.gridSizeX), Math.floor(event.offsetY / this.gridSizeY))
      this.upddateSelectedGrid()
    },
    onMouseMove(event: MouseEvent) {
      if (this.dragStartGrid != null) {
        this.dragEndGrid = new PIXI.Point(Math.floor(event.offsetX / this.gridSizeX), Math.floor(event.offsetY / this.gridSizeY))
        this.upddateSelectedGrid()
      }
    },
    onMouseUp(event: MouseEvent) {
      if (this.dragStartGrid != null) {
        this.dragEndGrid = new PIXI.Point(Math.floor(event.offsetX / this.gridSizeX), Math.floor(event.offsetY / this.gridSizeY))
        this.upddateSelectedGrid()
        this.dragStartGrid = null
        this.dragEndGrid = null
      }
    },
    upddateSelectedGrid() {
      if (this.dragStartGrid != null) {
        let changed = false
        if (this.dragEndGrid != null) {
          const newSelectedGrid = new PIXI.Rectangle(
            Math.min(this.dragStartGrid.x, this.dragEndGrid.x),
            Math.min(this.dragStartGrid.y, this.dragEndGrid.y),
            Math.abs(this.dragStartGrid.x - this.dragEndGrid.x) + 1,
            Math.abs(this.dragStartGrid.y - this.dragEndGrid.y) + 1)
          if (
            this.selectedGrid!.left !== newSelectedGrid.left ||
            this.selectedGrid!.right !== newSelectedGrid.right ||
            this.selectedGrid!.top !== newSelectedGrid.top ||
            this.selectedGrid!.bottom !== newSelectedGrid.bottom) {
              this.selectedGrid = newSelectedGrid
              changed = true
          }
        } else {
          this.selectedGrid = new PIXI.Rectangle(this.dragStartGrid!.x, this.dragStartGrid!.y, 1, 1)
          changed = true
        }
        if (changed) {
          this.updateFocus()
        }
      }
    },
    updateFocus() {
      this.focusElement!.style.left = `${this.selectedGrid!.x * 16}px`
      this.focusElement!.style.top = `${this.selectedGrid!.y * 16}px`
      this.focusElement!.style.width = `${this.selectedGrid!.width * 16}px`
      this.focusElement!.style.height = `${this.selectedGrid!.height * 16}px`
    }
  },
  components: {
  }
});
</script>
