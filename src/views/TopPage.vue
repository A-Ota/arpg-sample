<style scoped lang="scss">

</style>
<template>
  <div style="position: relative;">
    <div style="position: absolute; width: 400px; height: 400px;" ref="pixi_area" >
    </div>
    <div>ほげほげ</div>
    <div style="position: absolute; left: 10px; top: 10px; background-color: #0000ff66; color: #fff;">あいう</div>
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
    // this.animationFrame = 0
    this.syncTexture()
  }
  get currentDirection() {
    return this._currentDirection
  }
  private animationStep = 0
  constructor(private sheet: PIXI.Spritesheet) {
    super(sheet.textures[`character-2-0`])
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
    window.onkeydown = this.onKeyDown
    window.onkeyup = this.onKeyUp

    const size = {width: 340, height: 240}
    const pixiApp: PIXI.Application = new PIXI.Application(size)

    const container = this.$refs['pixi_area'] as any
    container.appendChild(pixiApp.view);

    // テキストオブジェクトを作る
    const textobj: PIXI.Text = new PIXI.Text("Hello World!", {font:'bold 60pt Arial', fill:'white'});
    textobj.position.x = size.width / 2;
    textobj.position.y = size.height / 2;

    // テキストオブジェクトをステージに乗せる
    pixiApp.stage.addChild(textobj);

    PIXI.Loader.shared
      .add('/game/images/chara01.json')
      .load(() => {
        const sheet = PIXI.Loader.shared.resources["/game/images/chara01.json"].spritesheet;
        this.chara = new Character(PIXI.Loader.shared.resources["/game/images/chara01.json"].spritesheet!)
        this.chara.position.set(100, 100)
        pixiApp.stage.addChild(this.chara)
      })
    // this.chara = PIXI.Sprite.from('/game/images/chara01.png')
    // pixiApp.stage.addChild(this.chara)

    // アニメーション開始
    pixiApp.ticker.add((delta) => {
      textobj.rotation += 0.01;
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