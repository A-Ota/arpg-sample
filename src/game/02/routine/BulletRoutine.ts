import { RoutineBase } from "./RoutineBase"

export class BulletRoutine extends RoutineBase {
  constructor () {
    super()
  }
  *update () {
    for (let i = 0; i < 30; ++i) {
      this.actor.y -= 6
      yield
    }
    this.actor.game.removeActor(this.actor, 'playerShot')
  }
}