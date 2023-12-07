import { Game } from "../Game"
import { AppearanceBase } from "../appearance/ApppearanceBase"
import { RoutineBase } from "../routine/RoutineBase"

export class Actor extends PIXI.Container {
  private iterator: Generator | null = null
  constructor (private appearance: AppearanceBase, private routine: RoutineBase, public game: Game) {
    super()
    appearance.setup(this)
    this.routine.actor = this
    this.iterator = this.routine.update()
  }
  update (delta: number) {
    if (this.iterator != null) {
      this.iterator.next()
    }
  }
}