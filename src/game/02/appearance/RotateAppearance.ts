import { Actor } from "../actor/Actor"
import { AppearanceBase } from "./ApppearanceBase"

export class RotateAppearance extends AppearanceBase {
  private sprite!: PIXI.Sprite
  constructor (private imagePath: string, private rotateSpeed: number) {
    super()
  }
  setup (actor: Actor) {
    this.sprite = PIXI.Sprite.from(this.imagePath)
    this.sprite.anchor.set(0.5, 0.5)
    actor.addChild(this.sprite)
  }
  *generateUpdate (): Generator {
    while (true) {
      const rad = this.rotateSpeed * Math.PI / 180
      this.sprite.rotation += rad
      yield
    }
  }
}
