import { Actor } from "../actor/Actor"
import { RoutineBase } from "./RoutineBase"

export class LaserRoutine extends RoutineBase {
  constructor (private parent: Actor) {
    super()
  }
  *generateUpdate () {
    while (true) {
      this.actor.position.set(this.parent.x, this.parent.y)
      yield
    }
  }
}