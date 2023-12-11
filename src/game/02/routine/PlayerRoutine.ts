import { KEY_CODE_LEFT, KEY_CODE_DOWN, KEY_CODE_RIGHT, KEY_CODE_L_SHOT, KEY_CODE_R_SHOT, KEY_CODE_UP, GAME_PAD_DOWN, GAME_PAD_LEFT, GAME_PAD_RIGHT, GAME_PAD_L_SHOT, GAME_PAD_R_SHOT, GAME_PAD_UP } from "../Game"
import { Actor } from "../actor/Actor"
import { SimpleAppearance } from "../appearance/SimpleAppearance"
import { InputManager } from "../useInputManager"
import { BulletRoutine } from "./BulletRoutine"
import { RoutineBase } from "./RoutineBase"

export class PlayerRoutine extends RoutineBase {
  constructor (private inputManager: InputManager) {
    super()
  }
  *generateLFire () {
    let nextFireFrame = 0
    while (true) {
      if (nextFireFrame === 0) {
        const bullet = new Actor(new SimpleAppearance('/images/game/02/shot_red.png'), new BulletRoutine(), this.actor.game)
        bullet.position.set(this.actor.x, this.actor.y)
        this.actor.game.addActor(bullet, 'playerShot')
        nextFireFrame = 4
      } else {
        nextFireFrame--
      }
      yield
    }
  }
  *generateRFire () {
    let nextFireFrame = 0
    while (true) {
      if (nextFireFrame === 0) {
        const bullet = new Actor(new SimpleAppearance('/images/game/02/shot_green.png'), new BulletRoutine(4, -25 + Math.random() * 50), this.actor.game)
        bullet.position.set(this.actor.x, this.actor.y)
        this.actor.game.addActor(bullet, 'playerShot')
        nextFireFrame = 4
      } else {
        nextFireFrame--
      }
      yield
    }
  }
  *generateUpdate () {
    const lFire = this.generateLFire()
    const rFire = this.generateRFire()
    while (true) {
      if (this.inputManager.isPressing(KEY_CODE_LEFT) || this.inputManager.isPressingGamepad(GAME_PAD_LEFT)) {
        this.actor.x -= 2
      }
      if (this.inputManager.isPressing(KEY_CODE_RIGHT) || this.inputManager.isPressingGamepad(GAME_PAD_RIGHT)) {
        this.actor.x += 2
      }
      if (this.inputManager.isPressing(KEY_CODE_UP) || this.inputManager.isPressingGamepad(GAME_PAD_UP)) {
        this.actor.y -= 2
      }
      if (this.inputManager.isPressing(KEY_CODE_DOWN) || this.inputManager.isPressingGamepad(GAME_PAD_DOWN)) {
        this.actor.y += 2
      }
      if (this.inputManager.isPressing(KEY_CODE_L_SHOT) || this.inputManager.isPressingGamepad(GAME_PAD_L_SHOT)) {
        lFire.next()
      }
      else if (this.inputManager.isPressing(KEY_CODE_R_SHOT) || this.inputManager.isPressingGamepad(GAME_PAD_R_SHOT)) {
        rFire.next()
      }
      yield
    }
  }
}
