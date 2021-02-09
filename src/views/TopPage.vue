<style scoped lang="scss">

</style>
<template>
  <div style="position: relative;">
    <div style="position: absolute; width: 320px; height: 240px;" ref="pixi_area" >
    </div>
    <div style="position: absolute; left: 10px; top: 10px; background-color: #0000ff66; color: #fff;">矢印キーで移動</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as PIXI from 'pixi.js';

class Character extends PIXI.Sprite {
  private animationFrame = 0
  private _currentDirection = 2
  set currentDirection(value: number) {
    this._currentDirection = value
    this.syncTexture()
  }
  get currentDirection() {
    return this._currentDirection
  }
  private animationStep = 0
  constructor(private sheet: PIXI.Spritesheet) {
    super(sheet.textures[`character-2-0`])
    this.anchor.set(0.5, 0.5)
  }
  private syncTexture() {
    this.texture = this.sheet.textures[`character-${this.currentDirection}-${this.animationStep === 3 ? 1 : this.animationStep}`]
  }
  public update() {
    ++this.animationFrame
    if (this.animationFrame > 30) {
      this.animationFrame = 0
      this.animationStep = (this.animationStep + 1) % 4
      this.syncTexture()
    }
  }
}

const KEY_CODE_LEFT = 37
const KEY_CODE_UP = 38
const KEY_CODE_RIGHT = 39
const KEY_CODE_DOWN = 40

export default Vue.extend({
  data(): { chara: Character | null; pressedKeyCodeSet: Set<number> } {
    return {
      chara: null,
      pressedKeyCodeSet: new Set()
    }
  },
  mounted() {
    PIXI.settings.RESOLUTION = window.devicePixelRatio;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    window.onkeydown = this.onKeyDown
    window.onkeyup = this.onKeyUp

    const size = {width: 320, height: 240}
    const pixiApp: PIXI.Application = new PIXI.Application(size)

    const container = this.$refs['pixi_area'] as any
    container.appendChild(pixiApp.view);

    // 背景色
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE)
    bg.width = 320
    bg.height = 240
    bg.tint = 0xcccccc
    pixiApp.stage.addChild(bg)

    PIXI.Loader.shared
      .add('/arpg-sample/images/chara01.json')
      .load(() => {
        const sheet = PIXI.Loader.shared.resources["/arpg-sample/images/chara01.json"].spritesheet;
        this.chara = new Character(PIXI.Loader.shared.resources["/arpg-sample/images/chara01.json"].spritesheet!)
        this.chara.position.set(160, 120)
        pixiApp.stage.addChild(this.chara)
      })

    // アニメーション開始
    pixiApp.ticker.add((delta) => {
      this.updateCharaState()
      this.chara?.update()
    })
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      console.log(event.keyCode)
      this.pressedKeyCodeSet.add(event.keyCode)
    },
    onKeyUp(event: any) {
      this.pressedKeyCodeSet.delete(event.keyCode)
    },
    updateCharaState() {
      const speed = 1
      const slantSpeed = 0.7
      let moveX = 0
      let moveY = 0
      // 向き
      if (this.pressedKeyCodeSet.has(KEY_CODE_LEFT)) {
        if (this.pressedKeyCodeSet.has(KEY_CODE_DOWN)) {
          this.chara!.currentDirection = 1
          moveX = -slantSpeed
          moveY = slantSpeed
        } else if (this.pressedKeyCodeSet.has(KEY_CODE_UP)) {
          this.chara!.currentDirection = 7
          moveX = -slantSpeed
          moveY = -slantSpeed
        } else {
          this.chara!.currentDirection = 4
          moveX = -speed
        }
      }
      else if (this.pressedKeyCodeSet.has(KEY_CODE_RIGHT)) {
        if (this.pressedKeyCodeSet.has(KEY_CODE_DOWN)) {
          this.chara!.currentDirection = 3
          moveX = slantSpeed
          moveY = slantSpeed
        } else if (this.pressedKeyCodeSet.has(KEY_CODE_UP)) {
          this.chara!.currentDirection = 9
          moveX = slantSpeed
          moveY = -slantSpeed
        } else {
          this.chara!.currentDirection = 6
          moveX = +speed
        }
      }
      else if (this.pressedKeyCodeSet.has(KEY_CODE_UP)) {
        this.chara!.currentDirection = 8
        moveY = -speed
      }
      else if (this.pressedKeyCodeSet.has(KEY_CODE_DOWN)) {
        this.chara!.currentDirection = 2
        moveY = speed
      }
      // 移動
      if (moveX != 0) {
        this.chara!.position.x += moveX
      }
      if (moveY != 0) {
        this.chara!.position.y += moveY
      }
    }
  },
  components: {
  },
  computed: {
  },
  props: []
})
</script>