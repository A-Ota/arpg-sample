<style scoped lang="scss">
</style>
<template>
  <div style="position: relative;">
    <div style="position: absolute; width: 320px; height: 240px;" ref="pixi_area">
      <div
        style="position: absolute; left: 8px; top: 8px; background-color: #0000ff66; color: #fff;"
      >矢印キーで移動</div>
      <b-button
        style="position: absolute; bottom: 8px; right: 8px;"
        @click="onClickToggleDebugMode"
      >{{ isDebugMode ? 'デバッグ非表示' : 'デバッグ表示' }}</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import * as PIXI from "pixi.js"
import { Character, PlayerRoutine, UroUroRoutine } from '@/stages/009/Character'
import { Field } from '@/stages/009/Field'

export default Vue.extend({
  data(): {
    pixiApp: PIXI.Application | null;
    field: Field | null;
    pressedKeyCodeSet: Set<number>;
    isDebugMode: boolean;
    } {
    return {
      pixiApp: null,
      field: null,
      pressedKeyCodeSet: new Set(),
      isDebugMode: false
    }
  },
  mounted() {
    PIXI.settings.RESOLUTION = window.devicePixelRatio
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

    window.onkeydown = this.onKeyDown
    window.onkeyup = this.onKeyUp

    const size = { width: 320, height: 240 }
    this.pixiApp = new PIXI.Application(size)

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
        chara1.y = 160
        this.field.addCharacter(chara1, true)
        // NPC
        const chara2 = new Character(renderTexture, new PIXI.Point(192, 128), new UroUroRoutine())
        chara2.x = 240
        chara2.y = 180
        this.field.addCharacter(chara2)

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
      // console.log(delta)
      if (this.field != null) {
        this.field.update()
      }
    },
    onClickToggleDebugMode() {
      this.isDebugMode = !this.isDebugMode
      this.field!.setDebugMode(this.isDebugMode)
    }
  },
  beforeDestroy() {
    // this.pixiApp!.ticker.remove(this.update)
    console.log('bdd')
    this.pixiApp!.destroy(true)
  },
  components: {},
  computed: {},
  props: []
})
</script>