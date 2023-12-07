import { Game } from "../Game"
import { AppearanceBase } from "../appearance/ApppearanceBase"
import { RoutineBase } from "../routine/RoutineBase"

export class Actor extends PIXI.Container {
  private routineUpdater: Generator | null = null
  constructor (private appearance: AppearanceBase, private routine: RoutineBase, public game: Game) {
    super()
    appearance.setup(this)
    this.routine.actor = this
    this.routineUpdater = this.routine.generateUpdate()
  }
  update (delta: number) {
    if (this.routineUpdater != null) {
      this.routineUpdater.next()
    }
  }
}