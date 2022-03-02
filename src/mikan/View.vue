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
      // pixi-layer周り
      app.stage = new PIXI.display.Stage()
      const scene = new TitleScene()
      // const scene = new StageScene()
      // stage.addReflectionFilter()
      // stage.addCrtFilter()
      // stage.addBlurFilter()
      // stage.addNoiseFilter()
      /*
      stage.start({
        mikanNum: 6,
        // startB: 0.5,
        // endB: 1,
        // startS: -1,
        // endS: -1,
        startH: 0,
        endH: 30
      })
      */
      app.stage.addChild(scene)
      // stage.startOpening()
      // app.stage.addChild(ui)
    })
    return {
      canvasRef
    }
  }
})
</script>
