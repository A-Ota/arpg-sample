import { Actor } from "../actor/Actor"
import { AppearanceBase } from "./ApppearanceBase"

export class LaserAppearance extends AppearanceBase {
  private actor!: Actor
  private root!: PIXI.Container
  private sprite1!: PIXI.Sprite
  private sprite2!: PIXI.Sprite
  constructor (private player: Actor) {
    super()
  }
  setup (actor: Actor) {
    this.root = new PIXI.Container(),
    this.sprite1 = PIXI.Sprite.from('/images/game/02/laser_red_1.png'),
    this.sprite2 = PIXI.Sprite.from('/images/game/02/laser_red_2.png')
    this.actor = actor
    this.root.y = -10
    this.root.alpha = 0
    actor.addChild(this.root)
    this.sprite1.anchor.set(0.5, 1)
    this.root.addChild(this.sprite1)
    this.sprite2.anchor.set(0.5, 1)
    this.sprite2.scale.y = 20
    this.sprite2.y = -this.sprite1.height
    this.root.addChild(this.sprite2)
  }
  *generateUpdate (): Generator {
    while (true) {
      if (this.root.alpha < 0.8) {
        this.root.alpha += 0.1
      }
      yield
    }
  }
}
