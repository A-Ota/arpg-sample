<style scoped lang="scss">
.button {
  margin: 4px;
}
</style>
<template>
  <div style="position: relative;">
    <div style="width: 640px; height: 480px;" ref="pixi_area">
    </div>
    <div style="position: absolute; left: 4px; top: 4px; color: #fff;">{{ (1000 / fpsCounter.averageMs).toFixed(2) }} fps</div>
    <b-button
      style="margin: 8px;"
      @click="onClickNormalContainer"
    >Container</b-button>
    <b-button
      style="margin: 8px;"
      @click="onClickParticleContainer"
    >ParticleContainer</b-button>
    <b-button
      style="margin: 8px;"
      @click="onClickPixiTilemap"
    >PixiTilemap</b-button>
    <b-form-input id="object-count" type="number" v-model="objectCount"></b-form-input>
  </div>
</template>

<script lang="ts">
// 高速歩きで壁にぶつかった場合、移動しないのではなくx, yについて移動できるところまで戻してあげる。
import Vue from "vue"
import * as PIXI from "pixi.js"
import * as PIXITilemap from '@/pixi-tilemap/index'

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
    pressedKeyCodeSet: Set<number>;
    fpsCounter: FpsCounter;
    isDebugMode: boolean;
    container: PIXI.Container | null;
    normalContainer: PIXI.Container | null;
    particleContainer: PIXI.ParticleContainer | null;
    tilemapContainer: PIXITilemap.CompositeRectTileLayer | null;
    texture: PIXI.Texture | null;
    objectCount: number;
    step: number;
    } {
    return {
      pixiApp: null,
      pressedKeyCodeSet: new Set(),
      fpsCounter: new FpsCounter(),
      isDebugMode: false,
      container: null,
      normalContainer: null,
      particleContainer: null,
      tilemapContainer: null,
      texture: null,
      objectCount: 1000,
      step: 0
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
    // this.pixiApp.ticker.maxFPS = 60
    // this.pixiApp.ticker.minFPS = 60

    const container = this.$refs["pixi_area"] as any
    container.appendChild(this.pixiApp.view)
    PIXI.utils.clearTextureCache()
    PIXI.Loader.shared
      .reset()
      .add("/arpg-sample/images/stages/997/happa.png")
      .load(() => {
        this.texture = PIXI.Loader.shared.resources["/arpg-sample/images/stages/997/happa.png"].texture
      })

    // ルートコンテナ
    this.container = new PIXI.Container()
    this.pixiApp!.stage.addChild(this.container)

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
      switch(this.step) {
        case 0:
          this.container!.x -= 1
          if (this.container!.x <= -640) {
            this.step = 1
          }
        break;
        case 1:
          this.container!.y -= 1
          if (this.container!.y <= -480) {
            this.step = 2
          }
        break;
        case 2:
          this.container!.x += 1
          if (this.container!.x >= 0) {
            this.step = 3
          }
        break;
        case 3:
          this.container!.y += 1
          if (this.container!.y >= 0) {
            this.step = 0
          }
        break;
      }
    },
    onClickNormalContainer() {
      this.clearContainers()
      this.normalContainer = new PIXI.Container()
      this.container!.addChild(this.normalContainer)
      for (let i = 0; i < this.objectCount; ++i) {
        const happaSprite = PIXI.Sprite.from(this.texture!)
        happaSprite.x = Math.random() * 640 * 2
        happaSprite.y = Math.random() * 480 * 2
        this.normalContainer!.addChild(happaSprite)
      }
    },
    onClickParticleContainer() {
      this.clearContainers()
      // this.particleContainer = new PIXI.ParticleContainer(10000, { uvs: false, vertices: false, tint: false })
      this.particleContainer = new PIXI.ParticleContainer(20000)
      this.container!.addChild(this.particleContainer)
      for (let i = 0; i < this.objectCount; ++i) {
        const happaSprite = PIXI.Sprite.from(this.texture!)
        happaSprite.x = Math.random() * 640 * 2
        happaSprite.y = Math.random() * 480 * 2
        this.particleContainer!.addChild(happaSprite)
      }
    },
    onClickPixiTilemap() {
      this.clearContainers()
      this.tilemapContainer = new PIXITilemap.CompositeRectTileLayer(0, [this.texture!])
      this.container!.addChild(this.tilemapContainer)
      for (let i = 0; i < this.objectCount; ++i) {
        this.tilemapContainer.addFrame(this.texture!, Math.random() * 640 * 2, Math.random() * 480 * 2)
      }
    },
    clearContainers() {
      if (this.normalContainer != null) {
        this.normalContainer.parent.removeChild(this.normalContainer)
        this.normalContainer.destroy()
        this.normalContainer = null
      }
      if (this.particleContainer != null) {
        this.particleContainer.parent.removeChild(this.particleContainer)
        this.particleContainer.destroy()
        this.particleContainer = null
      }
      if (this.tilemapContainer != null) {
        this.tilemapContainer.parent.removeChild(this.tilemapContainer)
        this.tilemapContainer.destroy()
        this.tilemapContainer = null
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