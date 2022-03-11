<style scoped lang="scss">
.root {
}
</style>
<template>
  <div class="root">
    <canvas class="canvas" width="1280" height="720" ref="canvasRef"></canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { Easing, ease } from 'pixi-ease'
import * as PIXI from 'pixi.js'
import TitleScene from './TitleScene'
import StageScene from './StageScene'

export default defineComponent({
  props: {
  },
  components: {
  },
  setup (props, context) {
    const canvasRef = ref()
    onMounted(() => {
      const app = new PIXI.Application({
        width: 1280,
        height: 720,
        view: canvasRef.value,
        transparent: true,
        autoStart: true
      })
      app.ticker.maxFPS = 60
      app.ticker.minFPS = 60

      // pixi-layer周り
      app.stage = new PIXI.display.Stage()
      const scene = new TitleScene()
      app.stage.addChild(scene)
      ;(window as any).app = app
    })
    return {
      canvasRef
    }
  }
})
</script>
