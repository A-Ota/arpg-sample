import { Actor } from "./actor/Actor"

type ActorGroup = 'player' | 'playerShot' | 'enemy' | 'enemyShot' | 'effect'

export const KEY_CODE_LEFT = 37
export const KEY_CODE_UP = 38
export const KEY_CODE_RIGHT = 39
export const KEY_CODE_DOWN = 40
export const KEY_CODE_L_SHOT = 90
export const KEY_CODE_R_SHOT = 88
export const GAME_PAD_L_SHOT = 0
export const GAME_PAD_R_SHOT = 1
export const GAME_PAD_UP = 12
export const GAME_PAD_RIGHT = 15
export const GAME_PAD_DOWN = 13
export const GAME_PAD_LEFT = 14

export class Game {
  public stage!: PIXI.Container
  public actorsMap: Map<ActorGroup, Actor[]> = new Map([
    ['player', []],
    ['playerShot', []],
    ['enemy', []],
    ['enemyShot', []],
    ['effect', []]
  ])
  constructor () {
  }
  public addActor (actor: Actor, actorGroup: ActorGroup) {
    const actors = this.actorsMap.get(actorGroup)
    if (actors != null) {
      actors.push(actor)
      this.stage.addChild(actor)
    }
  }
  public removeActor (actor: Actor, actorGroup: ActorGroup) {
    const actors = this.actorsMap.get(actorGroup)
    if (actors != null) {
      this.actorsMap.set(actorGroup, actors.filter(a => a !== actor))
      this.stage.removeChild(actor)
    }
  }
  update (delta: number) {
    this.actorsMap.forEach(actors => actors.forEach(actor => actor.update(delta)))
    // 衝突判定
    this.actorsMap.get('playerShot')!.forEach(playerShot => {
      this.actorsMap.get('enemy')!.forEach(enemy => {
        if (playerShot.getBounds().contains(enemy.x, enemy.y)) {
          this.removeActor(playerShot, 'playerShot')
          this.removeActor(enemy, 'enemy')
        }
      })
    })
  }
}