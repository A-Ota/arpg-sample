<style scoped lang="scss">
.root {
  width: 320px;
  height: 320px;
}
</style>
<template>
  <div class="root" @mouseup="onMouseUp" @mouseleave="onMouseUp" @mousemove="onMouseMove" @mousedown="onMouseDown">
    <canvas
      :width="horizontalGridNum * gridSizeX"
      :height="verticalGridNum * gridSizeY"
      ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as PIXI from "pixi.js"

export class MapData {
  bgLayerChips: Array<number | null> = []
  airLayerChips: Array<number | null> = []
}

export default Vue.extend({
  props: [
    'imagePath', 'gridSizeX', 'gridSizeY', 'horizontalGridNum', 'verticalGridNum', 'selectedMapChipGrid', 'mapData'
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
      if (this.selectedMapChipGrid != null) {
        const grid = new PIXI.Point(Math.floor(event.offsetX / this.gridSizeX), Math.floor(event.offsetY / this.gridSizeY))
        this.ctx!.clearRect(grid.x * this.gridSizeX,
          grid.y * this.gridSizeY,
          this.selectedMapChipGrid.width * this.gridSizeX,
          this.selectedMapChipGrid.height * this.gridSizeY)
        this.ctx!.drawImage(
          this.image!,
          this.selectedMapChipGrid.x * this.gridSizeX,
          this.selectedMapChipGrid.y * this.gridSizeY,
          this.selectedMapChipGrid.width * this.gridSizeX,
          this.selectedMapChipGrid.height * this.gridSizeY,
          grid.x * this.gridSizeX,
          grid.y * this.gridSizeY,
          this.selectedMapChipGrid.width * this.gridSizeX,
          this.selectedMapChipGrid.height * this.gridSizeY)
      }
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
