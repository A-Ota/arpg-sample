import * as PIXI from "pixi.js"
import { ISortable } from '@/stages/005/SortableParticleContainer'

// キャラクター
export class Character extends PIXI.Sprite implements ISortable {
  private animationFrame = 0
  private _currentDirection = 2
  public zOrder = 0
  public shadowSprite!: PIXI.Sprite
  set currentDirection(value: number) {
    this._currentDirection = value
    this.syncTexture()
  }
  get currentDirection() {
    return this._currentDirection
  }
  private animationStep = 0
  constructor(public texture: PIXI.Texture, private textureOffset: PIXI.Point, private routine: BaseRoutine) {
    super()

    this.texture = new PIXI.Texture(this.texture.baseTexture, new PIXI.Rectangle(textureOffset.x, textureOffset.y, 32, 64))
    routine.character = this
    this.anchor.set(0.5, 0.5)

    const shadowTexture = new PIXI.Texture(this.texture.baseTexture, new PIXI.Rectangle(0, 224, 32, 32))
    this.shadowSprite = PIXI.Sprite.from(shadowTexture)
    this.shadowSprite.alpha = 0.5
    this.shadowSprite.anchor.set(0.5, 0.5)
  }
  private syncTexture() {
    let offsetX = 0
    let offsetY = 0
    offsetX += (this.animationStep === 3 ? 1 : this.animationStep) * 32
    const frame = new PIXI.Rectangle(
      this.textureOffset.x + offsetX,
      this.textureOffset.y + offsetY,
      32,
      64
    )
    this.texture.frame = frame
  }
  public update() {
    this.routine.update()
    this.shadowSprite.x = this.x
    this.shadowSprite.y = this.y + 28
    this.zOrder = this.position.y
    ++this.animationFrame
    if (this.animationFrame > 30) {
      this.animationFrame = 0
      this.animationStep = (this.animationStep + 1) % 4
      this.syncTexture()
    }
  }
}

// ルーチン
abstract class BaseRoutine {
  public character!: Character
  abstract update(): void
}

const KEY_CODE_LEFT = 37
const KEY_CODE_UP = 38
const KEY_CODE_RIGHT = 39
const KEY_CODE_DOWN = 40

// 方向とスピードからx,yの移動速度算出
const calcMoveXY = function(direction: number, speed: number): [number, number] {
  const slantSpeed = speed * 0.7
  switch (direction) {
    case 1:
      return [-slantSpeed, slantSpeed]
    case 2:
      return [0, speed]
    case 3:
      return [slantSpeed, slantSpeed]
    case 4:
      return [-speed, 0]
    case 6:
      return [speed, 0]
    case 7:
      return [-slantSpeed, -slantSpeed]
    case 8:
      return [0, -speed]
    case 9:
      return [slantSpeed, -slantSpeed]
  }
  return [0, 0]
}

// プレイヤー操作用ルーチン
export class PlayerRoutine extends BaseRoutine {
  constructor(private pressedKeyCodeSet: Set<number>) {
    super()
  }

  public update() {
    let direction: number | null = null 
    // 向き取得
    if (this.pressedKeyCodeSet.has(KEY_CODE_LEFT)) {
      if (this.pressedKeyCodeSet.has(KEY_CODE_DOWN)) {
        direction = 1
      } else if (this.pressedKeyCodeSet.has(KEY_CODE_UP)) {
        direction = 7
      } else {
        direction = 4
      }
    } else if (this.pressedKeyCodeSet.has(KEY_CODE_RIGHT)) {
      if (this.pressedKeyCodeSet.has(KEY_CODE_DOWN)) {
        direction = 3
      } else if (this.pressedKeyCodeSet.has(KEY_CODE_UP)) {
        direction = 9
      } else {
        direction = 6
      }
    } else if (this.pressedKeyCodeSet.has(KEY_CODE_UP)) {
      direction = 8
    } else if (this.pressedKeyCodeSet.has(KEY_CODE_DOWN)) {
      direction = 2
    }
    // 向かせたり歩かせたり
    if (direction != null) {
      this.character.currentDirection = direction
      const [moveX, moveY] = calcMoveXY(this.character.currentDirection, 1)
      this.character.position.x += moveX
      this.character.position.y += moveY
    }
  }
}

// うろうろルーチン
export class UroUroRoutine extends BaseRoutine {
  constructor(
    private isMoving = false,
    private frameCountToWait: number = 0,
    private frameCountToMove: number = 60) {
    super()
  }
  update() {
    return
    // 移動中
    if (this.isMoving) {
      const [moveX, moveY] = calcMoveXY(this.character.currentDirection, 0.6)
      this.character.position.x += moveX
      this.character.position.y += moveY
      --this.frameCountToWait
      if (this.frameCountToWait <= 0) {
        this.frameCountToWait = 0
        this.frameCountToMove = 60 + 30 * Math.floor(Math.random() * 3)
        this.isMoving = false
      }
    }
    // 待機中
    else {
      --this.frameCountToMove
      if (this.frameCountToMove <= 0) {
        this.frameCountToMove = 0
        this.frameCountToWait = 60
        this.character.currentDirection = [1, 2, 3, 4, 6, 7, 8, 9][Math.floor(Math.random() * 8)]
        this.isMoving = true
      }
    }
  }
}
