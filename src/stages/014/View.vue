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
import { Character, PlayerRoutine, UroUroRoutine, TextureInfo } from '@/stages/014/Character'
import { Field } from '@/stages/014/Field'
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
    lastPressedKeyCodeSet: Set<number>;
    nowPressedKeyCodeSet: Set<number>;
    fpsCounter: FpsCounter;
    characters: Array<Character>;
    isDebugMode: boolean;
    } {
    return {
      pixiApp: null,
      renderTexture: null,
      field: null,
      lastPressedKeyCodeSet: new Set(),
      nowPressedKeyCodeSet: new Set(),
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
      .add("/arpg-sample/images/stages/009/chara01.png")
      .add("/arpg-sample/images/stages/009/chara02.png")
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
        const sprite01 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/009/chara01.png"].texture)
        sprite01.position.set(256, 0)
        this.pixiApp!.renderer.render(sprite01, this.renderTexture, false)
        // chara02を書き込む
        const sprite02 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/009/chara02.png"].texture)
        sprite02.position.set(256 + 192, 0)
        this.pixiApp!.renderer.render(sprite02, this.renderTexture, false)


        // フィールド
        this.field = new Field(
          this.renderTexture,
          PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/mapchip.json"].data,
          PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/map01.json"].data)
        this.pixiApp!.stage.addChild(this.field)

        // NPC
        this.generateCharacter(0)
        this.generateCharacter(1)
        this.field!.setTargetCharacter(this.characters[0])
      })

    // メインループ
    this.pixiApp.ticker.add(this.update)
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      this.nowPressedKeyCodeSet.add(event.keyCode)
    },
    onKeyUp(event: any) {
      this.nowPressedKeyCodeSet.delete(event.keyCode)
    },
    update(delta: number) {
      this.fpsCounter.checkPoint()
      // Spaceキーでキャラ切り替え
      if (!this.nowPressedKeyCodeSet.has(32) && this.lastPressedKeyCodeSet.has(32)) {
        this.toggleCharacter()
      }
      if (this.field != null) {
        this.field.update()
      }
      this.lastPressedKeyCodeSet = new Set(Array.from(this.nowPressedKeyCodeSet))
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
      const textureOffset = (type === 0) ? new PIXI.Point(256, 0) : new PIXI.Point(256 + 192, 0)
      const character = new Character(new TextureInfo(this.renderTexture!, textureOffset, 8))
      character.routine = (type === 0) ? new PlayerRoutine(this.nowPressedKeyCodeSet) : new UroUroRoutine()
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
        newCharacter.routine = new PlayerRoutine(this.nowPressedKeyCodeSet)
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