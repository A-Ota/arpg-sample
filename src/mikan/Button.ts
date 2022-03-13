export default class Button extends PIXI.Sprite {
  public clicked: null | (() => void) = null
  constructor (imagePath: string) {
    super(PIXI.Texture.from(imagePath))
    this.anchor.set(0.5, 0.5)
    this.interactive = true
    this
      .on('touchstart', this.onPress)
      .on('mousedown', this.onPress)
      .on('touchend', this.onClick)
      .on('mouseup', this.onClick)
      .on('touchcancel', this.onRelease)
      .on('touchendoutside', this.onRelease)
      .on('mouseout', this.onRelease)
  }
  onPress () {
    this.scale.set(1.1)
  }
  onRelease () {
    this.scale.set(1.0)
  }
  onClick () {
    this.scale.set(1.0)
    setTimeout(() => {
      if (this.clicked != null) {
        this.clicked()
      }
    }, 50)
  }
}