import { Game } from "../Game"
import { AppearanceBase } from "../appearance/ApppearanceBase"
import { RoutineBase } from "../routine/RoutineBase"

export class Actor extends PIXI.Container {
  private routineUpdater: Generator | null = null
  private appearanceUpdater: Generator | null = null
  constructor (private appearance: AppearanceBase, private routine: RoutineBase, public game: Game) {
    super()
    appearance.setup(this)
    this.routine.actor = this
    this.routineUpdater = this.routine.generateUpdate()
    this.appearanceUpdater = this.appearance.generateUpdate()
  }
  update (delta: number) {
    if (this.routineUpdater != null) {
      this.routineUpdater.next()
    }
    if (this.appearanceUpdater != null) {
      this.appearanceUpdater.next()
    }
  }
}