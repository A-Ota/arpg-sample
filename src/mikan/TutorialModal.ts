
export class TutorialModal extends PIXI.Container {
  constructor () {
    super()
    const sprite1 = PIXI.Sprite.from('/arpg-sample/images/mikan/tutorial1.png')
    this.addChild(sprite1)
    sprite1.interactive = true
    sprite1.on('touchend', this.step2.bind(this))
    sprite1.on('mouseup', this.step2.bind(this))
  }
  step2 () {
    this.removeChildren()
    const sprite2 = PIXI.Sprite.from('/arpg-sample/images/mikan/tutorial2.png')
    this.addChild(sprite2)
    sprite2.interactive = true
    sprite2.on('touchend', () => this.parent.removeChild(this))
    sprite2.on('mouseup', () => this.parent.removeChild(this))
  }
}