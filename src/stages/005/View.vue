<style scoped lang="scss">
</style>
<template>
  <div style="position: relative;">
    <div style="position: absolute; width: 320px; height: 240px;" ref="pixi_area"></div>
    <div
      style="position: absolute; left: 10px; top: 10px; background-color: #0000ff66; color: #fff;"
    >矢印キーで移動</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import * as PIXI from "pixi.js"
import { Character, PlayerRoutine, UroUroRoutine } from '@/stages/005/Character'
import { Field } from '@/stages/005/Field'
import PixiFps from "pixi-fps";

export default Vue.extend({
  data(): {
    pixiApp: PIXI.Application | null;
    field: Field | null;
    pressedKeyCodeSet: Set<number>;
    id: number;
    } {
    return {
      pixiApp: null,
      field: null,
      pressedKeyCodeSet: new Set(),
      id: 0
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
      .add("/arpg-sample/images/stages/005/all.png")
      .load(() => {
        // 影テクスチャ
        /*
        let shadowSprite: PIXI.Sprite | null = null
        {
          const renderTexture = PIXI.RenderTexture.create({ width: 32, height: 20 })

          const shadowGraphic = new PIXI.Graphics()
          shadowGraphic.lineStyle(0)
          shadowGraphic.beginFill(0x000000, 1)
          shadowGraphic.drawEllipse(16, 10, 16, 10)
          shadowGraphic.endFill()
          shadowGraphic.alpha = 0.5
          this.pixiApp!.renderer.render(shadowGraphic, renderTexture, true);

          PIXI.utils.TextureCache['shadow'] = renderTexture
          shadowSprite = new PIXI.Sprite(renderTexture)
          shadowSprite.position = new PIXI.Point(100, 100)
        }
        */

        // フィールド
        const allTexture = PIXI.Loader.shared.resources["/arpg-sample/images/stages/005/all.png"].texture
        this.field = new Field(allTexture)
        this.pixiApp!.stage.addChild(this.field)
        // this.pixiApp!.stage.addChild(shadowSprite)

        // プレイヤー
        const chara1 = new Character(allTexture, new PIXI.Point(0, 256), new PlayerRoutine(this.pressedKeyCodeSet))
        chara1.position.set(180, 110)
        this.field.addCharacter(chara1, true)
        chara1.zOrder = 2
        // NPC
        const chara2 = new Character(allTexture, new PIXI.Point(192, 256), new UroUroRoutine())
        chara2.position.set(140, 90)
        this.field.addCharacter(chara2)
        chara2.zOrder = 1
        // FPSカウンタ
        const fpsCounter = new PixiFps()
        fpsCounter.position.x = 4
        fpsCounter.position.y = 220
        fpsCounter. style = {
          fontSize: 16,
          fill: '#FFF'
        } as PIXI.TextStyle
        this.pixiApp!.stage.addChild(fpsCounter)
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