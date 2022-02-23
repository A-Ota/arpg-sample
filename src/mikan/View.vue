<style scoped lang="scss">
.root {
  background-color: green;
}
</style>
<template>
  <div class="root">
    <canvas class="canvas" width="1280" height="720" ref="canvasRef"></canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { Easing, ease } from 'pixi-ease'
import * as PIXI from 'pixi.js'
window.PIXI = PIXI

const SHOW_HIT_AREA = false

class Mikan extends PIXI.Container {
  private sprite!: PIXI.Sprite
  private dragStartCursorPoint: PIXI.Point | null = null
  private dragStartPoint: PIXI.Point | null = null
  constructor (
    group: PIXI.display.Group,
    h: number,
    s: number,
    b: number
  ) {
    super()
    this.sprite = PIXI.Sprite.from('/images/mikan/mikan.png')
    this.sprite.anchor.set(0.5, 0.7)
    this.sprite.parentGroup = group
    this.addChild(this.sprite)

    // 影
    const shadow = new PIXI.Graphics()
    shadow.parentGroup = group
    shadow.beginFill(0x000000)
    shadow.alpha = 0.7
    shadow.drawEllipse(0, 8, 74, 40)
    shadow.endFill()
    shadow.zOrder = 0
    this.addChild(shadow)

    // HSB設定
    const hFilter = new PIXI.filters.ColorMatrixFilter()
    hFilter.hue(h, false)
    const sFilter = new PIXI.filters.ColorMatrixFilter()
    sFilter.saturate(s, false)
    const bFilter = new PIXI.filters.ColorMatrixFilter()
    bFilter.brightness(b, false)
    this.sprite.filters = [hFilter, sFilter, bFilter]
    this.updateZOrder()

    // タッチ判定
    {
      const [left, top, width, height] = [-80, -90, 160, 120]
      this.hitArea = new PIXI.Rectangle(left, top, width, height)
      if (SHOW_HIT_AREA) {
        const hitArea = new PIXI.Graphics()
        hitArea.beginFill(0xFF0000)
        hitArea.alpha = 0.5
        hitArea.drawRect(left, top, width, height)
        hitArea.endFill()
        this.addChild(hitArea)
      }
    }

    this.interactive = true
    this
      .on('touchstart', this.onTouchStart)
      .on('mousedown', this.onTouchStart)
      .on('touchend', this.onTouchEnd)
      .on('mouseup', this.onTouchEnd)
      .on('touchcancel', this.onTouchEnd)
      .on('touchendoutside', this.onTouchEnd)
      .on('mouseout', this.onTouchEnd)

    // 落下
    this.startDropMotion()
  }

  startDropMotion () {
    this.sprite.y = -800
    ease.add(this.sprite, { y: 0 }, { wait: Math.random() * 100, duration: 400 })
  }

  onTouchStart (event: PIXI.InteractionEvent) {
    console.log('onTouchStart')
    ease.removeEase(this.sprite)
    this.dragStartPoint = new PIXI.Point(this.x, this.y)
    this.dragStartCursorPoint = new PIXI.Point(event.data.global.x, event.data.global.y)
    ease.add(this.sprite, { scale: 1.1, alpha: 0.8 }, { duration: 80, ease: 'easeOutQuad' })
    this
      .on('touchmove', this.onTouchMove)
      .on('mousemove', this.onTouchMove)
    this.sprite.zOrder = this.zIndex = 10000
  }

  onTouchEnd () {
    console.log('onTouchEnd')
    this.dragStartCursorPoint = this.dragStartPoint = null
    ease.add(this.sprite, { scale: 1, alpha: 1 }, { duration: 80, ease: 'easeOutQuad' })
    this.removeListener('touchmove', this.onTouchMove, this)
    this.removeListener('mousemove', this.onTouchMove, this)
    this.zIndex = 0
    this.updateZOrder()
  }

  onTouchMove (event: PIXI.InteractionEvent) {
    console.log('onTouchMove')
    if (this.dragStartCursorPoint != null && this.dragStartPoint != null) {
      const diff = new PIXI.Point(
        event.data.global.x - this.dragStartCursorPoint.x,
        event.data.global.y - this.dragStartCursorPoint.y
      )
      this.x = this.dragStartPoint.x + diff.x
      this.y = this.dragStartPoint.y + diff.y
    }
  }

  updateZOrder () {
    this.sprite.zOrder = this.zIndex = this.y
  }
}

export default defineComponent({
  props: {
  },
  components: {
  },
  setup (props, context) {
    const canvasRef = ref()
    onMounted(() => {
      const app = new PIXI.Application({
        width: 1280,
        height: 720,
        view: canvasRef.value,
        transparent: true,
        autoStart: true
      })
      // pixi-layer周り
      app.stage = new PIXI.display.Stage()
      app.stage.sortableChildren = true
      const group = new PIXI.display.Group(0, true)
      const layer = new PIXI.display.Layer(group)
      app.stage.addChild(layer)

      // 背景
      const bg = PIXI.Sprite.from('/images/mikan/dohyou.png')
      bg.parentGroup = group
      bg.zIndex = 0
      app.stage.addChild(bg)

      for (let i = 0; i < 5; ++i) {
        const mikan = new Mikan(group, Math.random() * 360, 0, 1)
        mikan.x = Math.random() * 1280
        mikan.y = Math.random() * 720
        mikan.updateZOrder()
        app.stage.addChild(mikan)
      }
    })
    return {
      canvasRef
    }
  }
})
</script>
