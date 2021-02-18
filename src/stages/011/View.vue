<style scoped lang="scss">
.button {
  margin: 4px;
}
</style>
<template>
  <div style="position: relative;">
    <div style="width: 640px; height: 480px;" ref="pixi_area">
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
// 高速歩きで壁にぶつかった場合、移動しないのではなくx, yについて移動できるところまで戻してあげる。
import Vue from "vue"
import * as PIXI from "pixi.js"
import * as pixi_tilemap from '@/pixi-tilemap/index'

export default Vue.extend({
  data(): {
    pixiApp: PIXI.Application | null;
    tilemap: pixi_tilemap.CompositeRectTileLayer | null;
    frame: number;
    } {
    return {
      pixiApp: null,
      tilemap: null,
      frame: 0
    }
  },
  mounted() {
    PIXI.settings.RESOLUTION = window.devicePixelRatio
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
    // PIXI.settings.TARGET_FPMS = 1

    const size = { width: 640, height: 480 }
    this.pixiApp = new PIXI.Application(size)
    this.pixiApp.ticker.maxFPS = 240
    this.pixiApp.ticker.minFPS = 240
    const container = this.$refs["pixi_area"] as any
    container.appendChild(this.pixiApp.view)

    // 背景色
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE)
    bg.width = 640
    bg.height = 480
    bg.tint = 0xcccccc
    this.pixiApp.stage.addChild(bg)

    PIXI.utils.clearTextureCache()
    PIXI.Loader.shared
      .reset()
      .add('atlas', '/arpg-sample/images/stages/011/atlas.json')
      .add('button', '/arpg-sample/images/stages/011/button.png')
      .load(() => {
        this.tilemap = new pixi_tilemap.CompositeRectTileLayer();
        this.pixiApp!.stage.addChild(this.tilemap)
        this.buildTilemap()
        setInterval(this.animShader, 400);
      })

    // メインループ
    this.pixiApp.ticker.add(this.update)
  },
  methods: {
    animShader() {
      this.pixiApp!.renderer.plugins.tilemap.tileAnim[0] = this.frame;
      this.pixiApp!.renderer.plugins.tilemap.tileAnim[1] = this.frame;
      this.frame++;
    },
    update(delta: number) {
      this.frame++
    },
    buildTilemap() {
      //Clear everything, like a PIXI.Graphics
      this.tilemap!.clear();
      const resources = PIXI.Loader.shared.resources;

      const size = 32;
      // if you are too lazy, just specify filename and pixi will find it in cache
      for (let i = 0; i < 7; i++)
          for (let j = 0; j < 5; j++) {
              this.tilemap!.addFrame("grass.png", i * size, j * size);
              if (i % 2 == 1 && j % 2 == 1)
                  this.tilemap!.addFrame("tough.png", i * size, j * size);
          }

      // if you are lawful citizen, please use textures from
      const textures = resources.atlas.textures
      this.tilemap!.addFrame(textures!["brick.png"], 2 * size, 2 * size);
      this.tilemap!.addFrame(textures!["brick_wall.png"], 2 * size, 3 * size);

      //chest will be animated!
      //old way: animate on rebuild
      // tilemap.addFrame(textures[frame % 2 == 0 ? "chest.png" : "red_chest.png"], 4 * size, 4 * size);

      // new way: animate on shader: 2 frames , X offset is 32 , "red_chest" is exactly 34 pixels right in the atlas
      this.tilemap!.addFrame(textures!["chest.png"], 4 * size, 4 * size).tileAnimX(34, 2);

      // button does not appear in the atlas, but tilemap wont surrender, it will create second layer for special for buttons
      // buttons will appear above everything
      this.tilemap!.addFrame(resources.button.texture, 6 * size, 2 * size);
      // if you want rotations:
      // https://pixijs.io/examples-v4/#/textures/texture-rotate.js
      // textures should have frame, orig and trim to do that
      // canvas in pixi-tilemap does not work with rotate!!!!
      const origTex = textures!["chest.png"];
      for (let i = 0; i < 8; i++) {
          const frame = origTex.frame.clone();
          const orig = origTex.orig.clone();
          const trim = origTex.orig.clone();
          const rotate = i * 2;
          if (rotate % 4 == 2) {
              orig.width = frame.height;
              orig.height = frame.width;
          }
          const tmpTex = new PIXI.Texture(origTex.baseTexture, frame, orig, trim, rotate);
          // Swap W and H in orig if you rotate%4 is not 0
          this.tilemap!.addFrame(tmpTex, i % 4 * size, (i >> 2) * size + 5 * size);
          // rotate is also last parameter in addFrame
      }
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