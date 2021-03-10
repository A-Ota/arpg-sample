<style scoped lang="scss">
.button {
  margin: 4px;
}
.root {
  display: flex;
  flex-direction: row;
}
</style>
<template>
  <div style="position: relative;">
    <div style="width: 640px; height: 480px;" ref="pixi_area">
    </div>
    <div v-if="true" style="position: absolute; left: 4px; top: 4px; color: #fff;">{{ (1000 / fpsCounter.averageMs).toFixed(2) }} fps</div>
  </div>
</template>
<script lang="ts">
// 高速歩きで壁にぶつかった場合、移動しないのではなくx, yについて移動できるところまで戻してあげる。
import Vue from "vue"
import * as PIXI from "pixi.js"
import { Character, PlayerRoutine, UroUroRoutine, TextureInfo, Weapon } from '@/stages/015/Character'
import { Field } from '@/stages/015/Field'
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

export default Vue.extend({
  data(): {
    pixiApp: PIXI.Application | null;
    renderTexture: PIXI.RenderTexture | null;
    field: Field | null;
    inputManager: InputManager;
    fpsCounter: FpsCounter;
    characters: Array<Character>;
    isDebugMode: boolean;
    } {
    return {
      pixiApp: null,
      renderTexture: null,
      field: null,
      inputManager: new InputManager(),
      fpsCounter: new FpsCounter(),
      characters: [],
      isDebugMode: false
    }
  },
  mounted() {
    PIXI.settings.RESOLUTION = window.devicePixelRatio
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    // PIXI.settings.TARGET_FPMS = 1

    window.onkeydown = this.onKeyDown
    window.onkeyup = this.onKeyUp

    const opt = { 
      width: 640,
      height: 480,
      autoDensity: true
    }
    this.pixiApp = new PIXI.Application(opt)
    this.pixiApp.ticker.maxFPS = 60
    this.pixiApp.ticker.minFPS = 60

    const container = this.$refs["pixi_area"] as any
    container.appendChild(this.pixiApp.view)

    // 背景色
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE)
    bg.width = 320
    bg.height = 240
    bg.tint = 0xcccccc
    this.pixiApp.stage.addChild(bg)

    PIXI.utils.clearTextureCache()
    PIXI.Loader.shared
      .reset()
      .add("/arpg-sample/images/stages/014/chara01.png")
      .add("/arpg-sample/images/stages/014/chara02.png")
      .add("/arpg-sample/images/stages/014/slime-blue.png")
      .add("/arpg-sample/images/stages/014/slime-red.png")
      .add("/arpg-sample/images/stages/014/slime-yellow.png")
      .add("/arpg-sample/images/stages/015/sword.png")
      .add("/arpg-sample/images/stages/015/knife.png")
      .add("/arpg-sample/images/stages/013/mapchip.png")
      .add("/arpg-sample/images/stages/013/mapchip.json")
      .add("/arpg-sample/images/stages/013/map01.json")
      .load(() => {

        // RenderTextureに必要な画像すべてを描き込む
        this.renderTexture = PIXI.RenderTexture.create({ width: 1024, height: 1024 })
        const renderSprite = PIXI.Sprite.from(this.renderTexture)

        // mapchipを描き込む
        const spriteMapChip = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/mapchip.png"].texture)
        this.pixiApp!.renderer.render(spriteMapChip, this.renderTexture, false)
        // chara01を書き込む
        const sprite01 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/chara01.png"].texture)
        sprite01.position.set(256, 0)
        this.pixiApp!.renderer.render(sprite01, this.renderTexture, false)
        // chara02を書き込む
        const sprite02 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/chara02.png"].texture)
        sprite02.position.set(256 + 192, 0)
        this.pixiApp!.renderer.render(sprite02, this.renderTexture, false)
        // slimeを書き込む
        const sprite03 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/slime-blue.png"].texture)
        sprite03.position.set(256 + 192 * 2, 0)
        this.pixiApp!.renderer.render(sprite03, this.renderTexture, false)

        const sprite04 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/slime-red.png"].texture)
        sprite04.position.set(256 + 192 * 2, 32)
        this.pixiApp!.renderer.render(sprite04, this.renderTexture, false)

        const sprite05 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/014/slime-yellow.png"].texture)
        sprite05.position.set(256 + 192 * 2, 64)
        this.pixiApp!.renderer.render(sprite05, this.renderTexture, false)

        // Knifeを書き込む
        const spriteKnife = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/015/knife.png"].texture)
        spriteKnife.position.set(256 + 192 * 2, 96)
        this.pixiApp!.renderer.render(spriteKnife, this.renderTexture, false)

        const spriteSword = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/015/sword.png"].texture)
        spriteSword.position.set(256 + 192 * 2, 96 + 64)
        this.pixiApp!.renderer.render(spriteSword, this.renderTexture, false)

        // フィールド
        this.field = new Field(
          this.renderTexture,
          PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/mapchip.json"].data,
          PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/map01.json"].data)
        this.pixiApp!.stage.addChild(this.field)

        // NPC
        this.generateCharacter(0)
        this.generateCharacter(1)
        this.generateCharacter(2)
        this.generateCharacter(3)
        this.generateCharacter(4)
        this.field!.setTargetCharacter(this.characters[0])
        this.characters[0].weapon = new Weapon(new TextureInfo(this.renderTexture, new PIXI.Point(256 + 192 * 2, 96), 64, 64, 1))
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
      // Spaceキーでキャラ切り替え
      if (this.inputManager.isReleased(32)) {
        this.toggleCharacter()
      }
      // 1キーでデバッグ表示切り替え
      if (this.inputManager.isReleased(49)) {
        this.onClickToggleDebugMode()
      }
      // DELキーでキャラ削除
      if (this.inputManager.isReleased(46)) {
        this.characters = this.characters.filter(character => character !== this.field!.targetCharacter!)
        this.field!.removeCharacter(this.field!.targetCharacter!)
        if (this.characters.length > 0) {
          this.toggleCharacter()
        }
      }
      if (this.field != null) {
        this.field.update()
      }
      this.inputManager.endTurn()
    },
    onClickToggleDebugMode() {
      this.isDebugMode = !this.isDebugMode
      this.field!.setDebugMode(this.isDebugMode)
    },
    isFocusedCharacter(character: Character) {
      return this.field!.targetCharacter === character
    },
    onClickCharacterCell(character: Character) {
      this.field!.setTargetCharacter(character)
    },
    onClickDeleteCharacter(character: Character) {
      this.characters = this.characters.filter(v => v !== character)
      this.field!.removeCharacter(character)
    },
    generateCharacter(type: number) {
      let textureOffset: PIXI.Point | null = null
      let [width, height, directionNum] = [0, 0, 0]
      switch(type) {
        case 0:
        case 1:
          width = 32
          height = 64
          directionNum = 8
          break;
        case 2:
        case 3:
        case 4:
          width = 32
          height = 32
          directionNum = 1
          break;
      }
      switch(type) {
        case 0:
          textureOffset = new PIXI.Point(256, 0)
          break;
        case 1:
          textureOffset = new PIXI.Point(256 + 192, 0)
          break;
        case 2:
          textureOffset = new PIXI.Point(256 + 192 * 2, 0)
          break;
        case 3:
          textureOffset = new PIXI.Point(256 + 192 * 2, 32)
          break;
        case 4:
          textureOffset = new PIXI.Point(256 + 192 * 2, 64)
          break;
      }

      const character = new Character(new TextureInfo(this.renderTexture!, textureOffset!, width, height, directionNum), this.field!)
      character.routine = (type === 0) ? new PlayerRoutine(this.inputManager) : new UroUroRoutine()
      character.currentDirection = 4
      for(;;) {
        character.x = 32 + 16 * Math.floor(Math.random() * (this.field!.horizontalGridNum - 4))
        character.y = 32 + 16 * Math.floor(Math.random() * (this.field!.verticalGridNum - 4))
        this.field!.addCharacter(character, false)
        const [hit, x, y] = this.field!.hitWall(character, 0, 0)
        if (!hit) {
          break;
        } else {
          this.field!.removeCharacter(character)
          console.log(hit)
        }
      }
      this.characters.push(character)
      ;(character as any).type = type
    },
    toggleCharacter() {
        let index = 0
        this.characters.forEach((v, i) => {
          if (v === this.field!.targetCharacter) {
            index = i
          }
        })
        const nextIndex = (index + 1) % this.characters.length
        const oldCharacter = this.characters[index]
        const newCharacter = this.characters[nextIndex]
        oldCharacter.routine = new UroUroRoutine()
        newCharacter.routine = new PlayerRoutine(this.inputManager)
        this.field!.setTargetCharacter(newCharacter)
    }
  },
  beforeDestroy() {
    // this.pixiApp!.ticker.remove(this.update)
    this.pixiApp!.destroy(true)
  },
  components: {
  },
  computed: {},
  props: []
})
</script>