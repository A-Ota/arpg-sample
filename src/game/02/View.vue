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
import useInputManager, { InputManager } from './useInputManager'
import { Game } from './Game'
import { Actor } from './actor/Actor'
import { SimpleAppearance } from './appearance/SimpleAppearance'
import { PlayerRoutine } from './routine/PlayerRoutine'
import { EmptyRoutine } from './routine/EmptyRoutine'
// import TitleScene from './TitleScene'
// import StageScene from './StageScene'

export default defineComponent({
  props: {
  },
  components: {
  },
  setup (props: any, context: any) {
    let gamePads: any = null
    const canvasRef = ref()
    const inputManager = useInputManager()
    let game: Game | null = null
    const update = (delta: number) => {
      if (game == null) {
        return
      }
      inputManager.enterUpdate()
      game.update(delta)
      inputManager.leaveUpdate()
      /*
      const debugGamePad = gamePads![0]!
      debugGamePad.buttons.forEach((button: any) => {
        buttonStatus += `${button.pressed ? 1 : 0} `
      })
      console.log(buttonStatus)
      */
      // console.log(navigator.getGamepads()![0]!.buttons[0])
    }
    onMounted(() => {
      gamePads = navigator.getGamepads()
      const app = new PIXI.Application({
        width: 640,
        height: 480,
        view: canvasRef.value,
        // transparent: true,
        autoStart: true,
        preserveDrawingBuffer: true,
        backgroundColor: 0x004400
      })
      app.ticker.maxFPS = 60
      app.ticker.minFPS = 60

      // pixi-layer周り
      app.stage = new PIXI.display.Stage()
      game = new Game()
      game.stage = app.stage
      const player = new Actor(new SimpleAppearance('/images/game/02/fighter_a.png'), new PlayerRoutine(inputManager), game)
      player.position.set(320, 400)
      game.addActor(player, 'player')
      const enemy = new Actor(new SimpleAppearance('https://pixijs.io/examples/examples/assets/bunny.png'), new EmptyRoutine(), game)
      enemy.position.set(320, 100)
      game.addActor(enemy, 'enemy')
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
