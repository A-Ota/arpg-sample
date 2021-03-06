import * as PIXI from "pixi.js"

import { SortableSprite } from '@/stages/005/SortableSprite'

// 次フレームで行動したい内容
class PreUpdateInfo {
  constructor(
    public moveX: number,
    public moveY: number,
    public nextDirection: number
    ) {}
}

// キャラクター
export class Character {
  public x: number = 0
  public y: number = 0
  public hitCircle: PIXI.Circle = new PIXI.Circle(0, 0, 12)
  public hitRect: PIXI.Rectangle = new PIXI.Rectangle(-12, -12, 24, 24)
  private animationFrame = 0
  private _currentDirection = 2
  public preUpdateInfo: PreUpdateInfo | null = null
  public bodySprite!: SortableSprite
  public shadowSprite!: SortableSprite
  public debugCircle!: PIXI.Graphics
  public debugRect!: PIXI.Graphics
  set currentDirection(value: number) {
    this._currentDirection = value
    this.syncTexture()
  }
  get currentDirection() {
    return this._currentDirection
  }
  private animationStep = 0
  constructor(texture: PIXI.Texture, private textureOffset: PIXI.Point, public routine: BaseRoutine) {
    // 体
    this.bodySprite = new SortableSprite()
    this.bodySprite.texture = new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(textureOffset.x, textureOffset.y, 32, 64))
    routine.character = this
    this.bodySprite.anchor.set(0.5, 1)

    // 影
    const shadowTexture = new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(224, 0, 32, 32))
    this.shadowSprite = new SortableSprite()
    this.shadowSprite.texture = shadowTexture
    this.shadowSprite.alpha = 0.5
    this.shadowSprite.anchor.set(0.5, 0.5)

    // 当たり判定
    this.debugCircle = new PIXI.Graphics()
    this.debugCircle.lineStyle(2, 0xFF5555, 1)
    this.debugCircle.alpha = 0.7
    this.debugCircle.drawCircle(0, 0, 11)
    this.debugRect = new PIXI.Graphics()
    this.debugRect.lineStyle(2, 0x5555FF, 1)
    this.debugRect.alpha = 0.7
    this.debugRect.drawRect(this.hitRect.x, this.hitRect.y, this.hitRect.width, this.hitRect.height)
  }
  private syncTexture() {
    let offsetX = 0
    let offsetY = 0
    switch(this.currentDirection) {
      case 1:
        offsetX = 96
        break;
      case 2:
        break;
      case 3:
        offsetX = 96
        offsetY = 64
        break;
      case 4:
        offsetY = 64
        break;
      case 6:
        offsetY = 128
        break;
      case 7:
        offsetX = 96
        offsetY = 128
        break;
      case 8:
        offsetY = 192
        break;
      case 9:
        offsetX = 96
        offsetY = 192
        break;
    }

    offsetX += (this.animationStep === 3 ? 1 : this.animationStep) * 32
    const frame = new PIXI.Rectangle(
      this.textureOffset.x + offsetX,
      this.textureOffset.y + offsetY,
      32,
      64
    )
    this.bodySprite.texture.frame = frame
  }
  public preUpdate() {
    this.routine.preUpdate()
  }
  public update() {
    ;[this.bodySprite.x, this.bodySprite.y] = [this.x, this.y + 8]
    ;[this.shadowSprite.x, this.shadowSprite.y] = [this.x, this.y]
    ;[this.hitCircle.x, this.hitCircle.y] = [this.x, this.y]
    ;[this.debugCircle.x, this.debugCircle.y] = [this.x, this.y]
    ;[this.hitRect.x, this.hitRect.y] = [this.x - 12, this.y - 12]
    ;[this.debugRect.x, this.debugRect.y] = [this.x, this.y]
    this.bodySprite.zOrder = this.shadowSprite.zOrder = this.bodySprite.position.y
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
  abstract preUpdate(): void
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

  public preUpdate() {
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
      const [moveX, moveY] = calcMoveXY(direction, 3)
      this.character.preUpdateInfo = new PreUpdateInfo(moveX, moveY, direction)
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
  preUpdate() {
    // 移動中
    if (this.isMoving) {
      const [moveX, moveY] = calcMoveXY(this.character.currentDirection, 1)
      this.character.preUpdateInfo = new PreUpdateInfo(moveX, moveY, this.character.currentDirection)
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
        const direction = [1, 2, 3, 4, 6, 7, 8, 9][Math.floor(Math.random() * 8)]
        this.character.preUpdateInfo = new PreUpdateInfo(0, 0, direction)
        this.isMoving = true
      }
    }
  }
}