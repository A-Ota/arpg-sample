<style scoped lang="scss">
.button {
  margin: 4px;
}
.root {
  display: flex;
  flex-direction: row;
}
.left-pane {
  width: 200px;
}
</style>
<template>
  <div class="root">
    <div class="left-pane">
      <template v-for="(character, index) in characters">
        <div :key="index">
          <CharacterCell :character="character" :focused="isFocusedCharacter(character)" />
        </div>
      </template>
    </div>
    <div style="position: relative;">
      <div style="width: 640px; height: 480px;" ref="pixi_area">
      </div>
      <div v-if="true" style="position: absolute; left: 4px; top: 4px; color: #fff;">{{ (1000 / fpsCounter.averageMs).toFixed(2) }} fps</div>
      <!--
      <b-button
        style="margin: 8px;"
        @click="onClickToggleDebugMode"
      >{{ isDebugMode ? 'デバッグ非表示' : 'デバッグ表示' }}</b-button>
      -->
    </div>
  </div>
</template>

<script lang="ts">
// 高速歩きで壁にぶつかった場合、移動しないのではなくx, yについて移動できるところまで戻してあげる。
import Vue from "vue"
import * as PIXI from "pixi.js"
import { Character, PlayerRoutine, UroUroRoutine } from '@/stages/013/Character'
import { Field } from '@/stages/013/Field'
import CharacterCell from '@/stages/013/components/CharacterCell.vue'

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
    field: Field | null;
    pressedKeyCodeSet: Set<number>;
    fpsCounter: FpsCounter;
    characters: Array<Character>;
    isDebugMode: boolean;
    } {
    return {
      pixiApp: null,
      field: null,
      pressedKeyCodeSet: new Set(),
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
        const renderTexture = PIXI.RenderTexture.create({ width: 1024, height: 1024 })
        const renderSprite = PIXI.Sprite.from(renderTexture)

        // mapchipを描き込む
        const spriteMapChip = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/mapchip.png"].texture)
        this.pixiApp!.renderer.render(spriteMapChip, renderTexture, false)
        // chara01を書き込む
        const sprite01 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/009/chara01.png"].texture)
        sprite01.position.set(256, 0)
        this.pixiApp!.renderer.render(sprite01, renderTexture, false)
        // chara02を書き込む
        const sprite02 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/009/chara02.png"].texture)
        sprite02.position.set(256 + 192, 0)
        this.pixiApp!.renderer.render(sprite02, renderTexture, false)


        // フィールド
        this.field = new Field(
          renderTexture,
          PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/mapchip.json"].data,
          PIXI.Loader.shared.resources["/arpg-sample/images/stages/013/map01.json"].data)
        this.pixiApp!.stage.addChild(this.field)

        // プレイヤー
        /*
        const chara1 = new Character(renderTexture, new PIXI.Point(256, 0), new PlayerRoutine(this.pressedKeyCodeSet))
        chara1.x = 200
        chara1.y = 520
        this.field.addCharacter(chara1, true)
        */

        // NPC
        for (let i = 0; i < 1; ++i) {
          // const character = new Character(renderTexture, new PIXI.Point(256 + 192, 0), new UroUroRoutine())
          const character = new Character(renderTexture, new PIXI.Point(256 + 192, 0), new PlayerRoutine(this.pressedKeyCodeSet))
          character.currentDirection = 4
          const isTarget = (i === 0)
          character.x = 100
          character.y = 100
          character.update()
          this.field.addCharacter(character, isTarget)
          this.characters.push(character)
          for(;;) {
            // character.x = 32 + 16 * Math.floor(Math.random() * (this.field!.horizontalGridNum - 4))
            character.x = 580
            // character.y = 32 + 16 * Math.floor(Math.random() * (this.field!.verticalGridNum - 4))
            character.y = 480
            character.update()
            const [hit, x, y] = this.field.hitWall(character, 0, 0)
            if (!hit) {
              break;
            } else {
              console.log(hit)
            }
          }
        }
      })

    // メインループ
    this.pixiApp.ticker.add(this.update)
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      this.pressedKeyCodeSet.add(event.keyCode)
    },
    onKeyUp(event: any) {
      this.pressedKeyCodeSet.delete(event.keyCode)
    },
    update(delta: number) {
      this.fpsCounter.checkPoint()
      if (this.field != null) {
        this.field.update()
      }
    },
    onClickToggleDebugMode() {
      this.isDebugMode = !this.isDebugMode
      this.field!.setDebugMode(this.isDebugMode)
    },
    isFocusedCharacter(character: Character) {
      return this.field!.targetCharacter === character
    }
  },
  beforeDestroy() {
    // this.pixiApp!.ticker.remove(this.update)
    this.pixiApp!.destroy(true)
  },
  components: {
    CharacterCell
  },
  computed: {},
  props: []
})
</script>