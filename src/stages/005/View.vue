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
        // フィールド
        const allTexture = PIXI.Loader.shared.resources["/arpg-sample/images/stages/005/all.png"].texture
        this.field = new Field(allTexture)
        this.pixiApp!.stage.addChild(this.field)
        // this.pixiApp!.stage.addChild(shadowSprite)

        // プレイヤー
        const chara1 = new Character(allTexture, new PIXI.Point(0, 256), new PlayerRoutine(this.pressedKeyCodeSet))
        chara1.x = 180
        chara1.y = 110
        this.field.addCharacter(chara1, true)
        // NPC
        const chara2 = new Character(allTexture, new PIXI.Point(192, 256), new UroUroRoutine())
        chara2.x = 140
        chara2.y = 90
        this.field.addCharacter(chara2)
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