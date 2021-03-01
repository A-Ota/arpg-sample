<style scoped lang="scss">
.button {
  margin: 4px;
}
</style>
<template>
  <div style="position: relative;">
    <div style="width: 640px; height: 480px;" ref="pixi_area">
    </div>
    <div v-if="true" style="position: absolute; left: 4px; top: 4px; color: #fff;">{{ (1000 / fpsCounter.averageMs).toFixed(2) }} fps</div>
    <b-button @click="onHide">キャラクター非表示</b-button>
    <b-button @click="onShow">キャラクター表示</b-button>
    <!--
    <b-button
      style="margin: 8px;"
      @click="onClickToggleDebugMode"
    >{{ isDebugMode ? 'デバッグ非表示' : 'デバッグ表示' }}</b-button>
    -->
  </div>
</template>

<script lang="ts">
// 高速歩きで壁にぶつかった場合、移動しないのではなくx, yについて移動できるところまで戻してあげる。
import Vue from "vue"
import * as PIXI from "pixi.js"
import { Character, PlayerRoutine, UroUroRoutine } from '@/stages/012/Character'
import { Field } from '@/stages/012/Field'

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
    npc: Character | null;
    isDebugMode: boolean;
    } {
    return {
      pixiApp: null,
      field: null,
      pressedKeyCodeSet: new Set(),
      fpsCounter: new FpsCounter(),
      npc: null,
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
      .add("/arpg-sample/images/stages/012/mapchip.png")
      .add("/arpg-sample/images/stages/012/mapchip.json")
      .add("/arpg-sample/images/stages/012/map01.json")
      .load(() => {

        // RenderTextureに必要な画像すべてを描き込む
        const renderTexture = PIXI.RenderTexture.create({ width: 1024, height: 1024 })
        const renderSprite = PIXI.Sprite.from(renderTexture)

        // mapchipを描き込む
        const spriteMapChip = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/012/mapchip.png"].texture)
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
          PIXI.Loader.shared.resources["/arpg-sample/images/stages/012/mapchip.json"].data,
          PIXI.Loader.shared.resources["/arpg-sample/images/stages/012/map01.json"].data)
        this.pixiApp!.stage.addChild(this.field)

        // プレイヤー
        const chara1 = new Character(renderTexture, new PIXI.Point(256, 0), new PlayerRoutine(this.pressedKeyCodeSet))
        chara1.x = 200
        chara1.y = 120
        this.field.addCharacter(chara1, true)

        /*
        const npc = new Character(renderTexture, new PIXI.Point(256 + 192, 0), new UroUroRoutine())
        npc.x = 300
        npc.y = 200
        npc.currentDirection = 4
        this.field.addCharacter(npc)
        */
        // NPC
        for (let i = 0; i < 1000; ++i) {
          const npc = new Character(renderTexture, new PIXI.Point(256 + 192, 0), new UroUroRoutine())
          npc.x = 32 + 16 * Math.floor(Math.random() * (this.field!.horizontalGridNum - 4));
          npc.y = 32 + 16 * Math.floor(Math.random() * (this.field!.verticalGridNum - 4));
          npc.currentDirection = 4
          this.field.addCharacter(npc)
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
    onShow() {
      this.field!.showCharacter()
    },
    onHide() {
      this.field!.hideCharacter()
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