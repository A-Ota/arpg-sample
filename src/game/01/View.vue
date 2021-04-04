<style scoped lang="scss">
.button {
  margin: 4px;
}
.icon-button {
  box-sizing: border-box;
  &.focused {
    border-color: orange;
    border-width: 2px;
    border-style: solid;
  }
}
</style>
<template>
  <div style="position: relative;">
    <div @click="onClickCanvas" style="width: 640px; height: 480px;" ref="pixi_area">
    </div>
    <template v-if="field != null">
      <b-button @click="onClickToggleEditing">{{ editing ? '再生' : 'エディット' }}</b-button>
      <div>
        <input id="fieldLength" v-model.number="field.maxLength" type="number" step="1"><label for="fieldLength">ステージの長さ</label>
      </div>
      <div>
        <input style="width: 400px;" id="fieldX" v-model.number="field.x" type="range" value="0" max="0" :min="-field.maxLength" @input="onFieldXChanged"><label for="fieldX">{{ field.x }}</label>
      </div>
      <div>
        <img @click="onColorSelected('r')" class="icon-button" :class="{ 'focused': editingInfo.selectedColor === 'r' }" src="/arpg-sample/images/game/01/bubble-r.png">
        <img @click="onColorSelected('g')" class="icon-button" :class="{ 'focused': editingInfo.selectedColor === 'g' }" src="/arpg-sample/images/game/01/bubble-g.png">
        <img @click="onColorSelected('b')" class="icon-button" :class="{ 'focused': editingInfo.selectedColor === 'b' }" src="/arpg-sample/images/game/01/bubble-b.png">
        <img @click="onColorSelected('y')" class="icon-button" :class="{ 'focused': editingInfo.selectedColor === 'y' }" src="/arpg-sample/images/game/01/bubble-y.png">
        <img @click="onColorSelected('lb')" class="icon-button" :class="{ 'focused': editingInfo.selectedColor === 'lb' }" src="/arpg-sample/images/game/01/bubble-lb.png">
        <img @click="onColorSelected('p')" class="icon-button" :class="{ 'focused': editingInfo.selectedColor === 'p' }" src="/arpg-sample/images/game/01/bubble-p.png">
        <img @click="onColorSelected('w')" class="icon-button" :class="{ 'focused': editingInfo.selectedColor === 'w' }" src="/arpg-sample/images/game/01/bubble-w.png">
        <img @click="onColorSelected('bl')" class="icon-button" :class="{ 'focused': editingInfo.selectedColor === 'bl' }" src="/arpg-sample/images/game/01/bubble-bl.png">
        <img @click="onColorSelected(null)" class="icon-button" :class="{ 'focused': editingInfo.selectedColor === null }" src="/arpg-sample/images/game/01/trash.png">
      </div>
    </template>
  </div>
</template>
<script lang="ts">
const SCALE = 2.0

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
  public maxLength = 640 * 10
  private speed = -1
  private oldX = 0
  private bubblePlaces: Array<[PIXI.Point, ColorType]> = []
  private bubbles: Array<PIXI.Sprite> = []
  constructor() {
    super() 
  }
  update() {
    this.oldX = this.x
    this.x += this.speed
    this.createBubble()
  }
  createBubble() {
    const createBubbldePlaces = this.bubblePlaces.filter(bubblePlace => {
      return bubblePlace[0].x >= -this.oldX + 320 && bubblePlace[0].x < -this.x + 320
    })
    createBubbldePlaces.forEach(bubblePlace => {
      const bubble = PIXI.Sprite.from(PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/bubble-${bubblePlace[1]}.png`].texture)
      bubble.position = bubblePlace[0]
      bubble.anchor.set(0.5, 0.5)
      this.addChild(bubble)
      this.bubbles.push(bubble)
    })
  }
  addBubble(color: ColorType, position: PIXI.Point) {
    this.bubblePlaces.push([position, color])
    this.reload()
  }
  removeBubble(position: PIXI.Point) {
    this.bubblePlaces = this.bubblePlaces.filter(bubblePlace => {
      const distance = Math.sqrt(Math.pow(bubblePlace[0].x - position.x, 2) + Math.pow(bubblePlace[0].y - position.y, 2))
      return distance > 12
    })
    this.reload()
  }
  reload() {
    // 現在の視界付近の泡を生成
    this.bubbles.forEach(bubble => {
      bubble.parent.removeChild(bubble)
    })
    this.bubbles = []
    this.bubblePlaces.forEach(bubblePlace => {
      const position = bubblePlace[0]
      if (position.x >= - this.x && position.x <= - this.x + 320) {
        const bubble = PIXI.Sprite.from(PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/bubble-${bubblePlace[1]}.png`].texture)
        bubble.position = position
        bubble.anchor.set(0.5, 0.5)
        this.addChild(bubble)
        this.bubbles.push(bubble)
      }
    })
  }
}

type ColorType = 'r' | 'g' | 'b' | 'y' | 'lb' | 'p' | 'w' | 'bl'
const KEY_CODE_RED = 90
const KEY_CODE_GREEN = 88
const KEY_CODE_BLUE = 67
const KEY_CODE_JUMP1 = 38
const KEY_CODE_JUMP2 = 32
const MIN_Y_SPEED = -1.6
const MAX_Y_SPEED = 1.6
class Sakana extends PIXI.Sprite {
  private color: ColorType = 'bl'
  private ySpeed = 0;
  constructor(private inputManger: InputManager) {
    super(PIXI.Loader.shared.resources["/arpg-sample/images/game/01/sakana-bl.png"].texture)
    this.position.x = 50
    this.anchor.set(0.5, 0.5)
  }
  update() {
    this.refreshColor()
    this.checkJump()
    this.ySpeed += 0.1
    this.ySpeed = Math.min(MAX_Y_SPEED, Math.max(this.ySpeed, MIN_Y_SPEED))
    this.position.y += this.ySpeed
    this.rotation = (this.ySpeed * 0.1)
  }
  checkJump() {
    if (this.inputManger.isPressing(KEY_CODE_JUMP1) || this.inputManger.isPressing(KEY_CODE_JUMP2)) {
      this.ySpeed = MIN_Y_SPEED
    }
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

class EditingInfo {
  public selectedColor: ColorType | null = null
}

export default Vue.extend({
  data(): {
    pixiApp: PIXI.Application | null;
    inputManager: InputManager;
    fpsCounter: FpsCounter;
    field: Field | null;
    sakana: Sakana | null;
    editingInfo: EditingInfo;
    editing: boolean;
    } {
    return {
      pixiApp: null,
      inputManager: new InputManager(),
      fpsCounter: new FpsCounter(),
      sakana: null,
      field: null,
      editingInfo: new EditingInfo(),
      editing: true
    }
  },
  mounted() {
    PIXI.settings.RESOLUTION = window.devicePixelRatio
    // PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR
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
    bg.width = 320
    bg.height = 240
    bg.tint = 0x2f85c8
    this.pixiApp.stage.addChild(bg)
    this.pixiApp.stage.scale.x = SCALE
    this.pixiApp.stage.scale.y = SCALE

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
      .add("/arpg-sample/images/game/01/bubble-r.png")
      .add("/arpg-sample/images/game/01/bubble-g.png")
      .add("/arpg-sample/images/game/01/bubble-b.png")
      .add("/arpg-sample/images/game/01/bubble-y.png")
      .add("/arpg-sample/images/game/01/bubble-lb.png")
      .add("/arpg-sample/images/game/01/bubble-p.png")
      .add("/arpg-sample/images/game/01/bubble-w.png")
      .add("/arpg-sample/images/game/01/bubble-bl.png")
      .load(() => {
        this.sakana = new Sakana(this.inputManager)
        this.pixiApp!.stage.addChild(this.sakana!)
        this.field = new Field()
        this.pixiApp!.stage.addChild(this.field)

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
      if (!this.editing) {
        this.field?.update()
        this.sakana?.update()
      }
      this.inputManager.endTurn()
    },
    onColorSelected(color: ColorType | null) {
      this.editingInfo.selectedColor = color
    },
    onClickCanvas(event: MouseEvent) {
      const point = new PIXI.Point(event.clientX / SCALE - this.field!.position.x, event.clientY / SCALE)
      if (this.editingInfo.selectedColor != null) {
        this.field!.addBubble(this.editingInfo.selectedColor, point)
      } else {
        this.field!.removeBubble(point)
      }
    },
    onClickToggleEditing() {
      this.editing = !this.editing
    },
    onFieldXChanged() {
      this.field!.reload()
    }
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