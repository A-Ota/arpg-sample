import { Actor } from "../actor/Actor"
import { AppearanceBase } from "./ApppearanceBase"

export class SimpleAppearance extends AppearanceBase {
  constructor (private imagePath: string) {
    super()
  }
  setup (actor: Actor) {
    const sprite = PIXI.Sprite.from(this.imagePath)
    sprite.anchor.set(0.5, 0.5)
    actor.addChild(sprite)
  }
}
