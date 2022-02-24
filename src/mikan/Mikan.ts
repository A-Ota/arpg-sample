import { Easing, ease } from 'pixi-ease'

const SHOW_HIT_AREA = false
export default class Mikan extends PIXI.Container {
  private sprite!: PIXI.Sprite
  private dragStartCursorPoint: PIXI.Point | null = null
  private dragStartPoint: PIXI.Point | null = null
  constructor (
    group: PIXI.display.Group,
    h: number,
    s: number,
    b: number,
    private movedCallback: (mikan: Mikan) => void,
    private droppedCallback: (mikan: Mikan) => void
  ) {
    super()
    this.sprite = PIXI.Sprite.from('/images/mikan/mikan.png')
    this.sprite.anchor.set(0.5, 0.65)
    this.sprite.parentGroup = group
    this.addChild(this.sprite)

    // 影
    const shadow = new PIXI.Graphics()
    shadow.parentGroup = group
    shadow.beginFill(0x000000)
    shadow.alpha = 0.5
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
      const [left, top, width, height] = [-80, -85, 160, 120]
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
    const endAnimation = ease.add(this.sprite, { scale: 1, alpha: 1 }, { duration: 80, ease: 'easeOutQuad' })
    endAnimation.once('complete', () => this.droppedCallback(this))
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
      this.movedCallback(this)
    }
  }

  updateZOrder () {
    this.sprite.zOrder = this.zIndex = this.y
  }
}
