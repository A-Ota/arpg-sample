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
// import TitleScene from './TitleScene'
// import StageScene from './StageScene'
const KEY_CODE_LEFT = 37
const KEY_CODE_UP = 38
const KEY_CODE_RIGHT = 39
const KEY_CODE_DOWN = 40
const KEY_CODE_SHOT = 90
const GAME_PAD_SHOT = 0
const GAME_PAD_UP = 12
const GAME_PAD_RIGHT = 15
const GAME_PAD_DOWN = 13
const GAME_PAD_LEFT = 14

class Actor extends PIXI.Container {
  private iterator: Generator | null = null
  constructor (private imagePath: string, private routine: RoutineBase, public game: Game) {
    super()
    const sprite = PIXI.Sprite.from(imagePath)
    sprite.anchor.set(0.5, 0.5)
    this.addChild(sprite)
    this.routine.actor = this
    this.iterator = this.routine.update()
  }
  update (delta: number) {
    if (this.iterator != null) {
      this.iterator.next()
    }
  }
}

abstract class RoutineBase {
  public actor!: Actor
  abstract update (): Generator
}

class BulletRoutine extends RoutineBase {
  constructor () {
    super()
  }
  *update () {
    for (let i = 0; i < 30; ++i) {
      this.actor.y -= 6
      yield
    }
    this.actor.game.removeActor(this.actor, 'playerShot')
  }
}

class PlayerRoutine extends RoutineBase {
  constructor (private inputManager: InputManager) {
    super()
  }
  *update () {
    let nextFireFrame = 0
    while (true) {
      if (this.inputManager.isPressing(KEY_CODE_LEFT) || this.inputManager.isPressingGamepad(GAME_PAD_LEFT)) {
        this.actor.x -= 2
      }
      if (this.inputManager.isPressing(KEY_CODE_RIGHT) || this.inputManager.isPressingGamepad(GAME_PAD_RIGHT)) {
        this.actor.x += 2
      }
      if (this.inputManager.isPressing(KEY_CODE_UP) || this.inputManager.isPressingGamepad(GAME_PAD_UP)) {
        this.actor.y -= 2
      }
      if (this.inputManager.isPressing(KEY_CODE_DOWN) || this.inputManager.isPressingGamepad(GAME_PAD_DOWN)) {
        this.actor.y += 2
      }
      if (this.inputManager.isPressing(KEY_CODE_SHOT) || this.inputManager.isPressingGamepad(GAME_PAD_SHOT)) {
        if (nextFireFrame === 0) {
          const bullet = new Actor('/images/game/02/shot_red.png', new BulletRoutine(), this.actor.game)
          bullet.position.set(this.actor.x, this.actor.y)
          this.actor.game.addActor(bullet, 'playerShot')
          nextFireFrame = 4
        } else {
          nextFireFrame--
        }
      }
      yield
    }
  }
}

class EmptyRoutine extends RoutineBase {
  *update () {
    while (true) {
      yield
    }
  }
}

type ActorGroup = 'player' | 'playerShot' | 'enemy' | 'enemyShot' | 'effect'

class Game {
  public stage!: PIXI.Container
  public actorsMap: Map<ActorGroup, Actor[]> = new Map([
    ['player', []],
    ['playerShot', []],
    ['enemy', []],
    ['enemyShot', []],
    ['effect', []]
  ])
  constructor () {
  }
  public addActor (actor: Actor, actorGroup: ActorGroup) {
    const actors = this.actorsMap.get(actorGroup)
    if (actors != null) {
      actors.push(actor)
      this.stage.addChild(actor)
    }
  }
  public removeActor (actor: Actor, actorGroup: ActorGroup) {
    const actors = this.actorsMap.get(actorGroup)
    if (actors != null) {
      this.actorsMap.set(actorGroup, actors.filter(a => a !== actor))
      this.stage.removeChild(actor)
    }
  }
  update (delta: number) {
    this.actorsMap.forEach(actors => actors.forEach(actor => actor.update(delta)))
    // 衝突判定
    this.actorsMap.get('playerShot')!.forEach(playerShot => {
      this.actorsMap.get('enemy')!.forEach(enemy => {
        if (playerShot.getBounds().contains(enemy.x, enemy.y)) {
          this.removeActor(playerShot, 'playerShot')
          this.removeActor(enemy, 'enemy')
        }
      })
    })
  }
}

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
      const player = new Actor('/images/game/02/fighter_a.png', new PlayerRoutine(inputManager), game)
      player.position.set(320, 400)
      game.addActor(player, 'player')
      const enemy = new Actor('https://pixijs.io/examples/examples/assets/bunny.png', new EmptyRoutine(), game)
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
