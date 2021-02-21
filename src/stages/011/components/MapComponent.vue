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
      <div style="position: relative;">
        <canvas
          v-show="layerVisibles[0]"
          style="position:absolute;"
          :width="mapData.horizontalGridNum * mapData.gridSizeX"
          :height="mapData.verticalGridNum * mapData.gridSizeY"
          ref="canvas0"></canvas>
        <canvas
          v-show="layerVisibles[1]"
          style="position:absolute;"
          :width="mapData.horizontalGridNum * mapData.gridSizeX"
          :height="mapData.verticalGridNum * mapData.gridSizeY"
          ref="canvas1"></canvas>
        <canvas
          v-show="layerVisibles[2]"
          style="position:absolute;"
          :width="mapData.horizontalGridNum * mapData.gridSizeX"
          :height="mapData.verticalGridNum * mapData.gridSizeY"
          ref="canvas2"></canvas>
      </div>
    </div>
    <div class="layer-area">
      <div 
        class="item"
        :class="{ 'active' : selectedLayerIndex === 0 }">
        <b-check v-model="layerVisibles[0]" style="display: inline;"></b-check><span @click="selectedLayerIndex = 0">下層地形レイヤー</span>
      </div>
      <div
        class="item"
        :class="{ 'active' : selectedLayerIndex === 1 }">
        <b-check v-model="layerVisibles[1]" style="display: inline;"></b-check><span @click="selectedLayerIndex = 1">上層地形レイヤー</span>
      </div>
      <div
        class="item"
        :class="{ 'active' : selectedLayerIndex === 2 }">
        <b-check v-model="layerVisibles[2]" style="display: inline;"></b-check><span @click="selectedLayerIndex = 2">上空レイヤー</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as PIXI from "pixi.js"

export default Vue.extend({
  props: [
    'imagePath', 'chipSelectedInfo', 'mapData'
  ],
  data(): {
    ctxList: Array<CanvasRenderingContext2D>;
    image: HTMLImageElement | null;
    selectedLayerIndex: number;
    layerVisibles: Array<boolean>;
  } {
    return {
      ctxList: [],
      image: null,
      selectedLayerIndex: 0,
      layerVisibles: [true, true, true]
    }
  },
  mounted() {
    const canvasList = [this.$refs.canvas0 as HTMLCanvasElement, this.$refs.canvas1 as HTMLCanvasElement, this.$refs.canvas2 as HTMLCanvasElement]
    this.ctxList = canvasList.map(canvas => canvas.getContext('2d')!)
    this.image = new Image()
    this.image.src = this.imagePath
  },
  methods: {
    onMouseDown(event: MouseEvent) {
      if (this.chipSelectedInfo != null) {
        const ctx = this.ctxList[this.selectedLayerIndex]
        const targetGrid = new PIXI.Point(Math.floor(event.offsetX / this.mapData.gridSizeX), Math.floor(event.offsetY / this.mapData.gridSizeY))
        // 描画範囲のグリッドをいったんクリア
        ctx!.clearRect(targetGrid.x * this.mapData.gridSizeX,
          targetGrid.y * this.mapData.gridSizeY,
          this.chipSelectedInfo.gridRect.width * this.mapData.gridSizeX,
          this.chipSelectedInfo.gridRect.height * this.mapData.gridSizeY)
        // 描画範囲のグリッドを描画
        ctx!.drawImage(
          this.image!,
          this.chipSelectedInfo.gridRect.x * this.mapData.gridSizeX,
          this.chipSelectedInfo.gridRect.y * this.mapData.gridSizeY,
          this.chipSelectedInfo.gridRect.width * this.mapData.gridSizeX,
          this.chipSelectedInfo.gridRect.height * this.mapData.gridSizeY,
          targetGrid.x * this.mapData.gridSizeX,
          targetGrid.y * this.mapData.gridSizeY,
          this.chipSelectedInfo.gridRect.width * this.mapData.gridSizeX,
          this.chipSelectedInfo.gridRect.height * this.mapData.gridSizeY)
        // 配置データを更新
        let index = 0
        const targetLayerChips = this.mapData.layerChipsList[this.selectedLayerIndex]
        for (let gridY = targetGrid.y; gridY < targetGrid.y + this.chipSelectedInfo.gridRect.height; ++gridY) {
          for (let gridX = targetGrid.x; gridX < targetGrid.x + this.chipSelectedInfo.gridRect.width; ++gridX) {
            targetLayerChips[gridY * this.mapData.horizontalGridNum + gridX] = this.chipSelectedInfo.chipIndexList[index]
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
