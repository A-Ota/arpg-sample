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
.stage-select {
  margin: 4px;
  &.focused {
    border-color: orange;
    border-width: 2px;
    border-style: solid;
  }
}
.canvas {
  position: relative;
  width: 640px;
  height: 480px;
}
.tips {
  position: absolute;
  background-color: #00000033;
  width: 100%;
  height: 100%;
  >.message {
    font-size: 28px;
    background-color: white;
    border-radius: 16px;
    padding: 16px;
    margin-top: 32px;
    margin-left: 32px;
    margin-right: 32px;
    white-space: pre-wrap;
  }
}
</style>
<template>
  <div style="position: relative;">
    <div class="canvas" @click="onClickCanvas" ref="pixi_area">
      <div v-if="tipsText != null" class="tips">
        <div class="message">{{ tipsText }}</div>
      </div>
    </div>
    <template v-if="field != null">
      <b-button style="margin: 4px;" @click="onClickToggleEditing">{{ editing ? '再生' : 'エディット' }}</b-button>
      <b-button style="margin: 4px;" @click="onClickLoad">読み込み</b-button>
      <b-button style="margin: 4px;" @click="onClickSave">保存</b-button>
      <div style="margin-top: 8px; margin-bottom: 8px;">
        <span @click="onClickStage(index)" class="stage-select" :class="{ 'focused': index === editingInfo.selectedStageInfoIndex }" v-for="(info, index) in editingInfo.stageInfos" :key="index">ステージ{{ index }}</span>
      </div>
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
// TODO:画像非同期読み込みからのゲームスタートだとリプレイのフレーム数がずれるのでは？
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


class Tips {
  constructor(public message: string, public x: number) {}
}
class TipsManager {
  public tipsList: Array<Tips> = []
  constructor() {
    this.tipsList.push(new Tips('Spaceキーか↑キーで浮上、離すと潜水。', 0))
    this.tipsList.push(new Tips('黒い泡に触れて酸素を補給しよう。', 200))
    this.tipsList.push(new Tips('連続して泡に触れるとコンボカウントが上がるよ。', 400))
    this.tipsList.push(new Tips('赤い泡は赤くなってから触れよう。\nZキーを押している間は赤くなるぞ。', 600))
    this.tipsList.push(new Tips('Xキーを押すと緑になれるよ。', 1700))
  }
  checkTips(x: number): string | null {
    if (this.tipsList.length > 0 ) {
      if (this.tipsList[0].x <= -x) {
        return this.tipsList.shift()!.message
      }
    }
    return null
  }
}

class ComboArea extends PIXI.Container {
  private comboCount = 0
  private container!: PIXI.Container
  private num1!: PIXI.Sprite
  private num2!: PIXI.Sprite
  private num3!: PIXI.Sprite
  constructor(private field: Field) {
    super()
    this.container = new PIXI.Container()
    this.container.position.set(0, -26)
    this.addChild(this.container)
    const combo = PIXI.Sprite.from("/arpg-sample/images/game/01/combo.png")
    combo.anchor.set(0.5, 0.5)
    combo.position.set(0, 0)
    this.addChild(combo)
    // 1ケタ目
    this.num1 = PIXI.Sprite.from("/arpg-sample/images/game/01/num0.png")
    this.num1.anchor.set(0.5, 0.5)
    this.num1.position.set(0, 0)
    this.container.addChild(this.num1)
    // 2ケタ目
    this.num2 = PIXI.Sprite.from("/arpg-sample/images/game/01/num0.png")
    this.num2.anchor.set(0.5, 0.5)
    this.num2.position.set(-24, 0)
    this.num2.visible = false
    this.container.addChild(this.num2)
    // 3ケタ目
    this.num3 = PIXI.Sprite.from("/arpg-sample/images/game/01/num0.png")
    this.num3.anchor.set(0.5, 0.5)
    this.num3.position.set(-48, 0)
    this.num3.visible = false
    this.container.addChild(this.num3)
    this.visible = false
  }
  public update() {
    if (this.comboCount != this.field.comboCount) {
      this.comboCount = this.field.comboCount
      this.refreshNumber()
      if (this.comboCount >= 2) {
        this.visible = true
      }
    }
  }
  private refreshNumber() {
    const num1 = Math.floor(this.comboCount / 1) % 10
    const num2 = Math.floor(this.comboCount / 10) % 10
    const num3 = Math.floor(this.comboCount / 100) % 10
    this.num1.texture = PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/num${num1}.png`].texture
    this.num2.texture = PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/num${num2}.png`].texture
    this.num3.texture = PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/num${num3}.png`].texture
    if (this.comboCount < 10) {
      this.container.x = 0
      this.num1.visible = true
      this.num2.visible = false
      this.num3.visible = false
    }
    else if (this.comboCount < 100) {
      this.container.x = 12
      this.num1.visible = true
      this.num2.visible = true
      this.num3.visible = false
    }
    else if (this.comboCount < 1000) {
      this.container.x = 24
      this.num1.visible = true
      this.num2.visible = true
      this.num3.visible = true
    }
  }
}

type ActorStatus = 'active' | 'deleting' | 'deleted'
class Bubble extends PIXI.Sprite {
  public status: ActorStatus = 'active'
  private coroutine: Generator | null = null
  constructor(public color: ColorType) {
    super()
    this.anchor.set(0.5, 0.5)
    this.texture = PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/bubble-${color}.png`].texture
  }
  public break(scaleUp: boolean) {
    this.status = 'deleting'
    this.coroutine = this.breakCoroutine(scaleUp)
  }
  public update() {
    if (this.coroutine != null) {
      this.coroutine.next()
    }
  }
  public *breakCoroutine(scaleUp: boolean) {
    for (let i = 0; i < 5; ++i) {
      this.scale.x += scaleUp ? 0.1 : -0.1
      this.scale.y += scaleUp ? 0.1 : -0.1
      this.alpha -= 0.2
      yield
    }
    this.status = 'deleted'
  }
}
const UPPER_LIMIT_Y = 35
const LOWER_LIMIT_Y = 205
const SAKANA_X = 50

type ColorType = 'r' | 'g' | 'b' | 'y' | 'lb' | 'p' | 'w' | 'bl'
const KEY_CODE_RED = 90
const KEY_CODE_GREEN = 88
const KEY_CODE_BLUE = 67
const KEY_CODE_JUMP1 = 38
const KEY_CODE_JUMP2 = 32
const MIN_Y_SPEED = -1.6
const MAX_Y_SPEED = 1.6
class Sakana extends PIXI.Sprite {
  public color: ColorType = 'bl'
  private ySpeed = 0
  private coroutine: Generator | null = null
  constructor(private inputManger: InputManager) {
    super(PIXI.Loader.shared.resources["/arpg-sample/images/game/01/sakana-bl.png"].texture)
    this.position.x = SAKANA_X
    this.anchor.set(0.5, 0.5)
  }
  update() {
    if (this.coroutine != null) {
      if (this.coroutine.next().done) {
        this.coroutine = null
      }
    }
    this.refreshColor()
    const jumped = this.checkJump()
    if (!jumped && this.y === UPPER_LIMIT_Y) {
      this.ySpeed = 0
    }
    this.ySpeed += 0.08
    this.ySpeed = Math.min(MAX_Y_SPEED, Math.max(this.ySpeed, MIN_Y_SPEED))
    this.position.y += this.ySpeed
    this.rotation = (this.ySpeed * 0.1)
  }
  checkJump() {
    if (this.inputManger.isPressing(KEY_CODE_JUMP1) || this.inputManger.isPressing(KEY_CODE_JUMP2)) {
      this.ySpeed = MIN_Y_SPEED
      return true
    }
    return false
  }
  refreshColor() {
    const oldColor = this.color
    const newColor = this.colorFromInput()
    if (oldColor != newColor) {
      this.color = newColor
      this.texture = PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/sakana-${this.color}.png`].texture
    }
  }
  public damaged() {
    this.coroutine = this.damageCoroutine()
  }
  *damageCoroutine() {
    this.texture = PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/sakana-${this.color}-d.png`].texture
    for (let i = 0; i < 3; ++i) {
      yield; yield; yield; yield;
      this.visible = false
      yield; yield; yield; yield;
      this.visible = true
    }
    this.texture = PIXI.Loader.shared.resources[`/arpg-sample/images/game/01/sakana-${this.color}.png`].texture
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

class StageInfo {
  public length = 6400
  public layout: Array<any> = []
}

class EditingInfo {
  public selectedColor: ColorType | null = null
  public selectedStageInfoIndex = 0
  public stageInfos: Array<StageInfo> = [new StageInfo(), new StageInfo(), new StageInfo(), new StageInfo(), new StageInfo()]
}

class Field extends PIXI.Container {
  public maxLength = 640 * 10
  private speed = -0.9
  private oldX = 0
  private bubblePlaces: Array<[PIXI.Point, ColorType]> = []
  private bubbles: Array<Bubble> = []
  private walls: Array<PIXI.Sprite> = []
  private sakana: Sakana
  public comboCount = 0
  constructor(inputManager: InputManager) {
    super() 
    this.sortableChildren = true
    this.sakana = new Sakana(inputManager)
    this.sakana.y = 120
    this.sakana.zIndex = 1
    this.addChild(this.sakana!)
    this.createWallByX(0)
    this.createWallByX(128)
    this.createWallByX(256)
  }
  update() {
    this.oldX = this.x
    this.x += this.speed
    this.sakana.x -= this.speed
    this.sakana.update()
    this.sakana.y = Math.max(UPPER_LIMIT_Y, Math.min(LOWER_LIMIT_Y, this.sakana.y))
    this.bubbles.forEach(bubble => bubble.update())
    this.hitCheck()
    this.createBubble()
    this.updateWall()
    this.bubbles = this.bubbles.filter(bubble => {
      if (bubble.status == 'deleted') {
        bubble.parent.removeChild(bubble)
        return false
      }
      return true
    })
  }
  createBubble() {
    const createBubbldePlaces = this.bubblePlaces.filter(bubblePlace => {
      return bubblePlace[0].x >= -this.oldX + 320 && bubblePlace[0].x < -this.x + 320
    })
    createBubbldePlaces.forEach(bubblePlace => {
      const bubble = new Bubble(bubblePlace[1])
      bubble.position = bubblePlace[0]
      this.addChild(bubble)
      this.bubbles.push(bubble)
    })
  }
  createWallByX(x: number) {
      const wave = PIXI.Sprite.from('/arpg-sample/images/game/01/wave.png')
      wave.x = x
      const ground = PIXI.Sprite.from('/arpg-sample/images/game/01/ground.png')
      ground.anchor.set(0, 1)
      ground.y = 240
      ground.x = x
      this.addChild(wave)
      this.addChild(ground)
      this.walls.push(wave)
      this.walls.push(ground)
  }
  updateWall() {
    if (Math.floor(this.oldX / 128) != Math.floor(this.x / 128)) {
      this.createWallByX(-Math.floor(this.oldX / 128) * 128 + 320)
      const wave = PIXI.Sprite.from('/arpg-sample/images/game/01/wave.png')
      wave.x = -Math.floor(this.oldX / 128) * 128 + 320
      const ground = PIXI.Sprite.from('/arpg-sample/images/game/01/ground.png')
      ground.anchor.set(0, 1)
      ground.y = 240
      ground.x = -Math.floor(this.oldX / 128) * 128 + 320
      this.addChild(wave)
      this.addChild(ground)
      this.walls.push(wave)
      this.walls.push(ground)
      this.walls = this.walls.filter(wall => {
        if (wall.x < -this.x - 128) {
          wall.parent.removeChild(wall)
          return false
        }
        return true
      })
    }
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
  hitCheck() {
    this.bubbles.filter(bubble => bubble.status == 'active').forEach(bubble => {
      const distance = Math.sqrt(Math.pow(bubble.x - this.sakana.x, 2) + Math.pow(bubble.y - this.sakana.y, 2))
      // 当たった
      if (distance < 28) {
        // 同じ色なら得点
        if (this.sakana.color == (bubble as any).color) {
          bubble.break(false)
          ++this.comboCount
        }
        // 違う色なら減点
        else {
          this.sakana.damaged()
          bubble.break(true)
          this.comboCount = 0
        }
      }
    })
  }
  reload() {
    this.sakana.x = -this.x + SAKANA_X
    // 現在の視界付近の泡を生成
    this.bubbles.forEach(bubble => {
      bubble.parent.removeChild(bubble)
    })
    this.bubbles = []
    this.bubblePlaces.forEach(bubblePlace => {
      const position = bubblePlace[0]
      if (position.x >= - this.x && position.x <= - this.x + 320) {
        const bubble = new Bubble(bubblePlace[1])
        bubble.position = position
        this.addChild(bubble)
        this.bubbles.push(bubble)
      }
    })
  }
  import(stageInfo: StageInfo) {
    this.maxLength = stageInfo.length
    this.bubblePlaces = stageInfo.layout.map(value => [new PIXI.Point(value[0], value[1]), value[2]])
    this.x = 0
    this.reload()
  }
  export(): StageInfo {
    const stageInfo = new StageInfo()
    stageInfo.length = this.maxLength
    stageInfo.layout = this.bubblePlaces.map(bubblePlace => [bubblePlace[0].x, bubblePlace[0].y, bubblePlace[1]])
    return stageInfo
  }
}

export default Vue.extend({
  data(): {
    pixiApp: PIXI.Application | null;
    inputManager: InputManager;
    fpsCounter: FpsCounter;
    field: Field | null;
    editingInfo: EditingInfo;
    editing: boolean;
    comboArea: ComboArea | null;
    tipsManager: TipsManager;
    tipsText: string | null;
    } {
    return {
      pixiApp: null,
      inputManager: new InputManager(),
      fpsCounter: new FpsCounter(),
      field: null,
      editingInfo: new EditingInfo(),
      editing: true,
      comboArea: null,
      tipsManager: new TipsManager(),
      tipsText: null
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
      .add("/arpg-sample/images/game/01/sakana-r-d.png")
      .add("/arpg-sample/images/game/01/sakana-g-d.png")
      .add("/arpg-sample/images/game/01/sakana-b-d.png")
      .add("/arpg-sample/images/game/01/sakana-y-d.png")
      .add("/arpg-sample/images/game/01/sakana-lb-d.png")
      .add("/arpg-sample/images/game/01/sakana-p-d.png")
      .add("/arpg-sample/images/game/01/sakana-w-d.png")
      .add("/arpg-sample/images/game/01/sakana-bl-d.png")
      .add("/arpg-sample/images/game/01/bubble-r.png")
      .add("/arpg-sample/images/game/01/bubble-g.png")
      .add("/arpg-sample/images/game/01/bubble-b.png")
      .add("/arpg-sample/images/game/01/bubble-y.png")
      .add("/arpg-sample/images/game/01/bubble-lb.png")
      .add("/arpg-sample/images/game/01/bubble-p.png")
      .add("/arpg-sample/images/game/01/bubble-w.png")
      .add("/arpg-sample/images/game/01/bubble-bl.png")
      .add("/arpg-sample/images/game/01/combo.png")
      .add("/arpg-sample/images/game/01/num1.png")
      .add("/arpg-sample/images/game/01/num2.png")
      .add("/arpg-sample/images/game/01/num3.png")
      .add("/arpg-sample/images/game/01/num4.png")
      .add("/arpg-sample/images/game/01/num5.png")
      .add("/arpg-sample/images/game/01/num6.png")
      .add("/arpg-sample/images/game/01/num7.png")
      .add("/arpg-sample/images/game/01/num8.png")
      .add("/arpg-sample/images/game/01/num9.png")
      .add("/arpg-sample/images/game/01/num0.png")
      .add("/arpg-sample/images/game/01/wave.png")
      .add("/arpg-sample/images/game/01/ground.png")
      .load(() => {
        this.field = new Field(this.inputManager)
        this.pixiApp!.stage.addChild(this.field)
        this.comboArea = new ComboArea(this.field)
        this.comboArea.position.set(260, 48)
        this.pixiApp!.stage.addChild(this.comboArea)
        // メインループ
        this.pixiApp!.ticker.add(this.update)
      })

  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      if (this.tipsText != null) {
        return
      }
      this.inputManager.onKeyDown(event.keyCode)
    },
    onKeyUp(event: any) {
      if (this.tipsText != null) {
        this.tipsText = null
        return
      }
      this.inputManager.onKeyUp(event.keyCode)
    },
    update(delta: number) {
      // TIPS表示中や編集中は更新しない
      if (this.editing || this.tipsText != null) {
        return
      }

      this.fpsCounter.checkPoint()
      this.field!.update()
      this.comboArea!.update()
      this.inputManager.endTurn()

      // TIPS存在チェック
      const text = this.tipsManager.checkTips(this.field!.x)
      if (text != null) {
        this.tipsText = text
        this.inputManager.reset()
      }
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
    },
    onClickStage(index: number) {
      this.editingInfo.selectedStageInfoIndex = index
    },
    onClickLoad() {
      const json = localStorage.getItem('game/01/stageInfos')
      if (json != null) {
        this.editingInfo.stageInfos = JSON.parse(json)
        this.field!.import(this.editingInfo.stageInfos[this.editingInfo.selectedStageInfoIndex])
      }
    },
    onClickSave() {
      this.editingInfo.stageInfos[this.editingInfo.selectedStageInfoIndex] = this.field!.export()
      localStorage.setItem('game/01/stageInfos', JSON.stringify(this.editingInfo.stageInfos))
    },
    closeTips() {
      this.tipsText = null
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