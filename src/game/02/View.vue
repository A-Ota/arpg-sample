<style scoped lang="scss">
.root {
  >.canvas {
    max-width: 100%;
    max-height: 100vh;
    vertical-align: bottom;
  }
}
</style>
<template>
  <div class="root">
    <canvas class="canvas" width="640" height="480" ref="canvasRef"></canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { Easing, ease } from 'pixi-ease'
import * as PIXI from 'pixi.js'
import useInputManager from './useInputManager'
// import TitleScene from './TitleScene'
// import StageScene from './StageScene'
const KEY_CODE_LEFT = 37
const KEY_CODE_UP = 38
const KEY_CODE_RIGHT = 39
const KEY_CODE_DOWN = 40

export default defineComponent({
  props: {
  },
  components: {
  },
  setup (props: any, context: any) {
    const canvasRef = ref()
    const inputManager = useInputManager()
    let player: PIXI.Sprite | null = null
    const update = (delta: number) => {
      // console.log(inputManager.isPressing(KEY_CODE_LEFT))
      if (inputManager.isPressing(KEY_CODE_LEFT)) {
        player!.x -= 1
      }
      if (inputManager.isPressing(KEY_CODE_RIGHT)) {
        player!.x += 1
      }
      if (inputManager.isPressing(KEY_CODE_UP)) {
        player!.y -= 1
      }
      if (inputManager.isPressing(KEY_CODE_DOWN)) {
        player!.y += 1
      }
      inputManager.endTurn()
    }
    onMounted(() => {
      const app = new PIXI.Application({
        width: 640,
        height: 480,
        view: canvasRef.value,
        transparent: true,
        autoStart: true,
        preserveDrawingBuffer: true
      })
      app.ticker.maxFPS = 60
      app.ticker.minFPS = 60

      // pixi-layer周り
      app.stage = new PIXI.display.Stage()
      player = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/bunny.png')
      player.x = 100
      player.y = 100
      app.stage.addChild(player)
      // const scene = new TitleScene()
      // app.stage.addChild(scene)
      ;(window as any).app = app
      // メインループ
      app.ticker.add(update)
    })
    return {
      canvasRef
    }
  }
})
</script>
