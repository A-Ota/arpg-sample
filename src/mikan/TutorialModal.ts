
export class TutorialModal extends PIXI.Container {
  constructor () {
    super()
    const sprite1 = PIXI.Sprite.from('/arpg-sample/images/mikan/tutorial1.png')
    this.addChild(sprite1)
    sprite1.interactive = true
    sprite1.on('click', () => {
      const sprite2 = PIXI.Sprite.from('/arpg-sample/images/mikan/tutorial2.png')
      this.addChild(sprite2)
      sprite2.interactive = true
      this.removeChild(sprite1)
      sprite2.on('click', () => {
        this.parent.removeChild(this)
      })
    })
  }
}