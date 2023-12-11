import { RoutineBase } from "./RoutineBase"

export class BulletRoutine extends RoutineBase {
  constructor (private speed: number = 6, private degree: number = 0, private lifetime: number = 60) {
    super()
  }
  *generateUpdate () {
    // speed, degreeからvx, vyを計算(上向きが0度)
    this.actor.rotation = this.degree * Math.PI / 180
    const rad = this.degree * Math.PI / 180
    const vx = this.speed * Math.sin(rad)
    const vy = -this.speed * Math.cos(rad)
    for (let i = 0; i < this.lifetime; ++i) {
      this.actor.x += vx
      this.actor.y += vy
      yield
    }
    this.actor.game.removeActor(this.actor, 'playerShot')
  }
}