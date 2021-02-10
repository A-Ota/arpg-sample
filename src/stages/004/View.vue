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
import { Character, PlayerRoutine, UroUroRoutine } from '@/stages/004/Character'

export default Vue.extend({
  data(): { characters: Array<Character>; pressedKeyCodeSet: Set<number> } {
    return {
      characters: [],
      pressedKeyCodeSet: new Set()
    }
  },
  mounted() {
    PIXI.settings.RESOLUTION = window.devicePixelRatio
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

    window.onkeydown = this.onKeyDown
    window.onkeyup = this.onKeyUp

    const size = { width: 320, height: 240 }
    const pixiApp: PIXI.Application = new PIXI.Application(size)

    const container = this.$refs["pixi_area"] as any
    container.appendChild(pixiApp.view)
    pixiApp.stage.sortableChildren = true

    // 背景色
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE)
    bg.width = 320
    bg.height = 240
    bg.tint = 0xcccccc
    pixiApp.stage.addChild(bg)

    PIXI.Loader.shared
      .reset()
      .add("/arpg-sample/images/chara01.json")
      .add("/arpg-sample/images/chara02.json")
      .load(() => {
        // プレイヤー
        const chara1 = new Character(
          PIXI.Loader.shared.resources["/arpg-sample/images/chara01.json"].spritesheet!,
          new PlayerRoutine(this.pressedKeyCodeSet)
        )
        chara1.position.set(180, 110)
        pixiApp.stage.addChild(chara1)
        this.characters.push(chara1)
        // NPC
        const chara2 = new Character(
          PIXI.Loader.shared.resources["/arpg-sample/images/chara02.json"].spritesheet!,
          new UroUroRoutine()
        )
        chara2.position.set(140, 90)
        pixiApp.stage.addChild(chara2)
        this.characters.push(chara2)
      })

    // アニメーション開始
    pixiApp.ticker.add(delta => {
      this.characters.forEach(chara => chara.update())
    })
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      this.pressedKeyCodeSet.add(event.keyCode)
    },
    onKeyUp(event: any) {
      this.pressedKeyCodeSet.delete(event.keyCode)
    }
  },
  components: {},
  computed: {},
  props: []
})
</script>