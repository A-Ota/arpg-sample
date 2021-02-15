<style scoped lang="scss">
.button {
  margin: 4px;
}
</style>
<template>
  <div style="position: relative;">
    <div style="width: 320px; height: 240px;" ref="pixi_area">
    </div>
    <b-button class="button" style="bottom: 8px; right: 8px;" @click="onClickRun">走る</b-button>
    <b-button class="button" style="bottom: 8px; right: 8px;" @click="onClickReset">リセット</b-button>
    <b-form-checkbox
      id="exactly-move"
      v-model="exactlyMove"
      @change="onChangeExactryMove"
    >高速で壁に衝突しても、隙間が空かない。</b-form-checkbox>
  </div>
</template>

<script lang="ts">
// 高速歩きで壁にぶつかった場合、移動しないのではなくx, yについて移動できるところまで戻してあげる。
import Vue from "vue"
import * as PIXI from "pixi.js"
import { Character, PlayerRoutine, DashRoutine } from '@/stages/009/Character'
import { Field } from '@/stages/009/Field'

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
    exactlyMove: boolean;
    } {
    return {
      pixiApp: null,
      field: null,
      pressedKeyCodeSet: new Set(),
      fpsCounter: new FpsCounter(),
      npc: null,
      exactlyMove: false
    }
  },
  mounted() {
    PIXI.settings.RESOLUTION = window.devicePixelRatio
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    // PIXI.settings.TARGET_FPMS = 1

    window.onkeydown = this.onKeyDown
    window.onkeyup = this.onKeyUp

    const size = { width: 320, height: 240 }
    this.pixiApp = new PIXI.Application(size)
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
      .add("/arpg-sample/images/stages/009/mapchip.png")
      .load(() => {

        // RenderTextureに必要な画像すべてを描き込む
        const renderTexture = PIXI.RenderTexture.create({ width: 512, height: 512 })
        const renderSprite = PIXI.Sprite.from(renderTexture)

        // mapchipを描き込む
        const spriteMapChip = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/009/mapchip.png"].texture)
        this.pixiApp!.renderer.render(spriteMapChip, renderTexture, false)
        // chara01を書き込む
        const sprite01 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/009/chara01.png"].texture)
        sprite01.position.set(0, 128)
        this.pixiApp!.renderer.render(sprite01, renderTexture, false)
        // chara02を書き込む
        const sprite02 = PIXI.Sprite.from(PIXI.Loader.shared.resources["/arpg-sample/images/stages/009/chara02.png"].texture)
        sprite02.position.set(192, 128)
        this.pixiApp!.renderer.render(sprite02, renderTexture, false)

        // フィールド
        this.field = new Field(renderTexture)
        this.pixiApp!.stage.addChild(this.field)

        // プレイヤー
        const chara1 = new Character(renderTexture, new PIXI.Point(0, 128), new PlayerRoutine(this.pressedKeyCodeSet))
        chara1.x = 200
        chara1.y = 120
        this.field.addCharacter(chara1, true)
        // NPC
        this.npc = new Character(renderTexture, new PIXI.Point(192, 128), new DashRoutine())
        this.npc.x = 272
        this.npc.y = 208
        this.npc.currentDirection = 4
        this.field.addCharacter(this.npc)

        this.field!.setDebugMode(true)
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
    onClickRun() {
      (this.npc!.routine as DashRoutine).dash()
    },
    onClickReset() {
      (this.npc!.routine as DashRoutine).stop()
      this.npc!.x = 272
      this.npc!.y = 208
      this.npc!.currentDirection = 4
    },
    onChangeExactryMove(flag: boolean) {
      this.field!.exactlyMove = flag
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