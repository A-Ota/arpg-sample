<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: row;
}
.map-area {
  width: 320px;
  height: 320px;
  overflow: scroll;
}
.layer-area {
  display: flex;
  flex-direction: column;
  > .item {
    height: 32px;
    &.active {
      background-color: #ccc;
    }
  }
}
</style>
<template>
  <div class="root">
    <div class="map-area" @mouseup="onMouseUp" @mouseleave="onMouseUp" @mousemove="onMouseMove" @mousedown="onMouseDown">
      <canvas
        :width="horizontalGridNum * gridSizeX"
        :height="verticalGridNum * gridSizeY"
        ref="canvas"></canvas>
    </div>
    <div class="layer-area">
      <div 
        class="item"
        :class="{ 'active' : selectedLayerIndex === 0 }"
        @click="selectedLayerIndex = 0">
        <b-check :checked="layerVisibles[0]" style="display: inline;"></b-check>背景レイヤー
      </div>
      <div
        class="item"
        :class="{ 'active' : selectedLayerIndex === 1 }"
        @click="selectedLayerIndex = 1">
        <b-check :checked="layerVisibles[1]" style="display: inline;"></b-check>上空レイヤー
      </div>
    </div>
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
    'imagePath', 'gridSizeX', 'gridSizeY', 'horizontalGridNum', 'verticalGridNum', 'chipSelectedInfo', 'mapData'
  ],
  data(): {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    image: HTMLImageElement | null;
    selectedLayerIndex: number;
    layerVisibles: Array<boolean>;
  } {
    return {
      canvas: null,
      ctx: null,
      image: null,
      selectedLayerIndex: 0,
      layerVisibles: [true, true]
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
      if (this.chipSelectedInfo != null) {
        const targetGrid = new PIXI.Point(Math.floor(event.offsetX / this.gridSizeX), Math.floor(event.offsetY / this.gridSizeY))
        // 描画範囲のグリッドをいったんクリア
        this.ctx!.clearRect(targetGrid.x * this.gridSizeX,
          targetGrid.y * this.gridSizeY,
          this.chipSelectedInfo.gridRect.width * this.gridSizeX,
          this.chipSelectedInfo.gridRect.height * this.gridSizeY)
        // 描画範囲のグリッドを描画
        this.ctx!.drawImage(
          this.image!,
          this.chipSelectedInfo.gridRect.x * this.gridSizeX,
          this.chipSelectedInfo.gridRect.y * this.gridSizeY,
          this.chipSelectedInfo.gridRect.width * this.gridSizeX,
          this.chipSelectedInfo.gridRect.height * this.gridSizeY,
          targetGrid.x * this.gridSizeX,
          targetGrid.y * this.gridSizeY,
          this.chipSelectedInfo.gridRect.width * this.gridSizeX,
          this.chipSelectedInfo.gridRect.height * this.gridSizeY)
        // 配置データを更新
        let index = 0
        for (let gridY = targetGrid.y; gridY < targetGrid.y + this.chipSelectedInfo.gridRect.height; ++gridY) {
          for (let gridX = targetGrid.x; gridX < targetGrid.x + this.chipSelectedInfo.gridRect.width; ++gridX) {
            this.mapData.bgLayerChips[gridY * this.horizontalGridNum + gridX] = this.chipSelectedInfo.chipIndexList[index]
            ++index
          }
        }
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
