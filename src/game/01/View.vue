<style scoped lang="scss">
.button {
  margin: 4px;
}
</style>
<template>
  <div style="position: relative;">
    <div style="width: 640px; height: 480px;" ref="pixi_area">
    </div>
  </div>
</template>
<script lang="ts">
// 高速歩きで壁にぶつかった場合、移動しないのではなくx, yについて移動できるところまで戻してあげる。
import Vue from "vue"
import * as PIXI from "pixi.js"
import InputManager from '@/stages/014/InputManager'

class FpsCounter {
  private ms = 0
  private counter = 0
  public averageMs = 0
  constructor(private oldNow = performance.now()) {}
  public checkPoint() {
    const now = performance.now()
    this.ms += (now - this.oldNow)
    this.oldNow = now
    ++this.counter
    if (this.counter >= 60) {
      this.averageMs = this.ms / this.counter
      this.counter = 0
      this.ms = 0
    }
  }
}

class Field extends PIXI.Container {
  
}

type ColorType = 'r' | 'g' | 'b' | 'y' | 'lb' | 'p' | 'w' | 'bl'
const KEY_CODE_RED = 90
const KEY_CODE_GREEN = 88
const KEY_CODE_BLUE = 67
const KEY_CODE_JUMP1 = 38
const KEY_CODE_JUMP2 = 32
class Sakana extends PIXI.Sprite {
  private color: ColorType = 'bl'
  constructor(private inputManger: InputManager) {
    super(PIXI.Loader.shared.resources["/arpg-sample/images/game/01/sakana-bl.png"].texture)
  }
  update() {
    this.refreshColor()
  }
  refreshColor() {
    const oldColor = this.color
    const newColor = this.colorFromInput()
    if (oldColor != newColor) {
      this.color = newColor
      this.texture = PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/sakana-${this.color}.png`].texture
    }
  }
  colorFromInput(): ColorType {
    if (this.inputManger.isPressing(KEY_CODE_RED)) {
      if (this.inputManger.isPressing(KEY_CODE_GREEN)) {
        if (this.inputManger.isPressing(KEY_CODE_BLUE)) {
          return 'w'
        } else {
         return 'y'
        }
      } else if (this.inputManger.isPressing(KEY_CODE_BLUE)) {
        return 'p'
      } else {
        return 'r'
      }
    } else if (this.inputManger.isPressing(KEY_CODE_GREEN)) {
      if (this.inputManger.isPressing(KEY_CODE_BLUE)) {
        return 'lb'
      } else {
        return 'g'
      }
    } else if (this.inputManger.isPressing(KEY_CODE_BLUE)) {
      return 'b'
    } else {
      return 'bl'
    }
  }
}

export default Vue.extend({
  data(): {
    pixiApp: PIXI.Application | null;
    inputManager: InputManager;
    fpsCounter: FpsCounter;
    sakana: Sakana | null;
    } {
    return {
      pixiApp: null,
      inputManager: new InputManager(),
      fpsCounter: new FpsCounter(),
      sakana: null
    }
  },
  mounted() {
    PIXI.settings.RESOLUTION = window.devicePixelRatio
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    // PIXI.settings.TARGET_FPMS = 1

    window.onkeydown = this.onKeyDown
    window.onkeyup = this.onKeyUp

    const size = { width: 640, height: 480 }
    this.pixiApp = new PIXI.Application(size)
    this.pixiApp.ticker.maxFPS = 60
    this.pixiApp.ticker.minFPS = 60

    const container = this.$refs["pixi_area"] as any
    container.appendChild(this.pixiApp.view)

    // 背景色
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE)
    bg.width = 640
    bg.height = 480
    bg.tint = 0x2f85c8
    this.pixiApp.stage.addChild(bg)

    PIXI.utils.clearTextureCache()
    PIXI.Loader.shared
      .reset()
      .add("/arpg-sample/images/game/01/sakana-r.png")
      .add("/arpg-sample/images/game/01/sakana-g.png")
      .add("/arpg-sample/images/game/01/sakana-b.png")
      .add("/arpg-sample/images/game/01/sakana-y.png")
      .add("/arpg-sample/images/game/01/sakana-lb.png")
      .add("/arpg-sample/images/game/01/sakana-p.png")
      .add("/arpg-sample/images/game/01/sakana-w.png")
      .add("/arpg-sample/images/game/01/sakana-bl.png")
      .load(() => {
        this.sakana = new Sakana(this.inputManager)
        this.pixiApp!.stage.addChild(this.sakana!)
      })

    // メインループ
    this.pixiApp.ticker.add(this.update)
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      this.inputManager.onKeyDown(event.keyCode)
    },
    onKeyUp(event: any) {
      this.inputManager.onKeyUp(event.keyCode)
    },
    update(delta: number) {
      this.fpsCounter.checkPoint()
      this.sakana?.update()
      this.inputManager.endTurn()
    },
  },
  beforeDestroy() {
    // this.pixiApp!.ticker.remove(this.update)
    this.pixiApp!.destroy(true)
  },
  components: {},
  computed: {},
  props: []
})
</script>