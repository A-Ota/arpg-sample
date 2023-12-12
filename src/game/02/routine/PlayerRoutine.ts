import { KEY_CODE_LEFT, KEY_CODE_DOWN, KEY_CODE_RIGHT, KEY_CODE_L_SHOT, KEY_CODE_R_SHOT, KEY_CODE_UP, GAME_PAD_DOWN, GAME_PAD_LEFT, GAME_PAD_RIGHT, GAME_PAD_L_SHOT, GAME_PAD_R_SHOT, GAME_PAD_UP } from "../Game"
import { Actor } from "../actor/Actor"
import { LaserAppearance } from "../appearance/LaserAppearance"
import { RotateAppearance } from "../appearance/RotateAppearance"
import { SimpleAppearance } from "../appearance/SimpleAppearance"
import { InputManager } from "../useInputManager"
import { BulletRoutine } from "./BulletRoutine"
import { LaserRoutine } from "./LaserRoutine"
import { RoutineBase } from "./RoutineBase"

export class PlayerRoutine extends RoutineBase {
  constructor (private inputManager: InputManager) {
    super()
  }
  *generateNormalShot () {
    yield
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
  *generateWideShot () {
    yield
    let nextFireFrame = 0
    while (true) {
      if (nextFireFrame === 0) {
        const bullet = new Actor(new RotateAppearance('/images/game/02/shot_blue.png', 10), new BulletRoutine(), this.actor.game)
        bullet.position.set(this.actor.x + 10, this.actor.y)
        this.actor.game.addActor(bullet, 'playerShot')
        nextFireFrame = 4
      } else {
        nextFireFrame--
      }
      yield
    }
  }
  *generateLaser (): any {
    let bullet = null
    while (true) {
      const buttonState = yield
      if (buttonState === 'pressed') {
        if (bullet == null) {
          bullet = new Actor(new LaserAppearance(this.actor), new LaserRoutine(this.actor), this.actor.game)
          bullet.position.set(this.actor.x, this.actor.y)
          this.actor.game.addActor(bullet, 'playerShot')
        }
      } else if (buttonState === 'released') {
        if (bullet != null) {
          this.actor.game.removeActor(bullet, 'playerShot')
          bullet = null
        }
      }
    }
  }
  *generateUpdate () {
    const lFire = this.generateNormalShot()
    lFire.next()
    const rFire = this.generateLaser()
    rFire.next()
    // rFire.next()
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
      else if (this.inputManager.isPressed(KEY_CODE_R_SHOT) || this.inputManager.isPressed(GAME_PAD_R_SHOT)) {
        rFire.next('pressed')
      }
      else if (this.inputManager.isPressing(KEY_CODE_R_SHOT) || this.inputManager.isPressingGamepad(GAME_PAD_R_SHOT)) {
        rFire.next('pressing')
      }
      else if (this.inputManager.isReleased(KEY_CODE_R_SHOT) || this.inputManager.isReleased(GAME_PAD_R_SHOT)) {
        // ボタンが離されたときにレーザーを消す
        rFire.next('released')
      }
      yield
    }
  }
}
