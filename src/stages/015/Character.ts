import * as PIXI from "pixi.js"

import { SortableSprite } from '@/stages/005/SortableSprite'
import InputManager from '@/stages/014/InputManager'
import { Field } from '@/stages/015/Field'

// 次フレームで行動したい内容
class PreUpdateInfo {
  constructor(
    public moveX: number,
    public moveY: number,
    public nextDirection: number
    ) {}
}

export class TextureInfo {
  constructor(
    public texture: PIXI.Texture,
    public offset: PIXI.Point,
    public width: number,
    public height: number,
    public directionNum: number
  ) {}
}

export class Weapon {
  public character!: Character
  public field!: Field
  private sprite!: SortableSprite
  private frameCount = -1
  constructor(private textureInfo: TextureInfo) {
    this.sprite = new SortableSprite()
    this.sprite.texture = new PIXI.Texture(textureInfo.texture.baseTexture, new PIXI.Rectangle(textureInfo.offset.x, textureInfo.offset.y, textureInfo.width, textureInfo.height))
    this.sprite.anchor.set(0.5, 0.5)
  }
  public onAddToField() {
    this.frameCount = 0
    this.sprite.position.x = this.character.x
    this.sprite.position.y = this.character.y - 44
    this.sprite.texture.frame = new PIXI.Rectangle(this.textureInfo.offset.x, this.textureInfo.offset.y, this.textureInfo.width, this.textureInfo.height)
    this.field.layerContainer.addChild(this.sprite)
  }
  public onRemoveFromField() {
    this.field.layerContainer.removeChild(this.sprite)
  }
  public update() {
    // 攻撃してない
    if (this.frameCount < 0) {
      return
    }
    if (this.frameCount === 5) {
      this.sprite.texture.frame = new PIXI.Rectangle(this.textureInfo.offset.x + this.textureInfo.width, this.textureInfo.offset.y, this.textureInfo.width, this.textureInfo.height)
    }
    else if (this.frameCount === 10) {
      this.sprite.texture.frame = new PIXI.Rectangle(this.textureInfo.offset.x + this.textureInfo.width * 2, this.textureInfo.offset.y, this.textureInfo.width, this.textureInfo.height)
    }
    else if (this.frameCount === 15) {
      this.sprite.texture.frame = new PIXI.Rectangle(this.textureInfo.offset.x + this.textureInfo.width * 3, this.textureInfo.offset.y, this.textureInfo.width, this.textureInfo.height)
    }
    else if (this.frameCount === 20) {
      this.field.layerContainer.removeChild(this.sprite)
      this.frameCount = -1
      return
    }
    ++this.frameCount
  }
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
  private _routine!: BaseRoutine
  private _weapon: Weapon | null = null
  set weapon(value: Weapon) {
    this._weapon = value
    this._weapon.character = this
    this._weapon.field = this.field
  }
  set currentDirection(value: number) {
    this._currentDirection = value
    this.syncTexture()
  }
  get currentDirection() {
    return this._currentDirection
  }
  set routine(value: BaseRoutine) {
    this._routine = value
    this._routine.character = this
  }
  private animationStep = 0
  constructor(private textureInfo: TextureInfo, private field: Field) {
    // 体
    this.bodySprite = new SortableSprite()
    this.bodySprite.texture = new PIXI.Texture(textureInfo.texture.baseTexture, new PIXI.Rectangle(textureInfo.offset.x, textureInfo.offset.y, textureInfo.width, textureInfo.height))
    this.bodySprite.anchor.set(0.5, 1)

    // 影
    const shadowTexture = new PIXI.Texture(textureInfo.texture.baseTexture, new PIXI.Rectangle(224, 0, 32, 32))
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
  public onAddToField() {
    this.field.debugLayerContainer.addChild(this.debugCircle)
    this.field.debugLayerContainer.addChild(this.debugRect)
    this.field.layerContainer.addChild(this.shadowSprite)
    this.field.layerContainer.addChild(this.bodySprite)
  }
  public onRemoveFromField() {
    this.field.debugLayerContainer.removeChild(this.debugCircle)
    this.field.debugLayerContainer.removeChild(this.debugRect)
    this.field.layerContainer.removeChild(this.shadowSprite)
    this.field.layerContainer.removeChild(this.bodySprite)
  }
  private syncTexture() {
    let offsetX = 0
    let offsetY = 0
    if (this.textureInfo.directionNum === 8) {
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
    }
    offsetX += (this.animationStep === 3 ? 1 : this.animationStep) * this.textureInfo.width
    const frame = new PIXI.Rectangle(
      this.textureInfo.offset.x + offsetX,
      this.textureInfo.offset.y + offsetY,
      this.textureInfo.width,
      this.textureInfo.height
    )
    this.bodySprite.texture.frame = frame
  }
  public preUpdate() {
    this._routine.preUpdate()
  }
  public update() {
    this._weapon?.update()
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
  public attack() {
    if (this._weapon != null) {
      this._weapon.onAddToField()
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
  constructor(private inputManager: InputManager) {
    super()
  }

  public preUpdate() {
    // 移動
    {
      let direction: number | null = null 
      // 向き取得
      if (this.inputManager.isPressing(KEY_CODE_LEFT)) {
        if (this.inputManager.isPressing(KEY_CODE_DOWN)) {
          direction = 1
        } else if (this.inputManager.isPressing(KEY_CODE_UP)) {
          direction = 7
        } else {
          direction = 4
        }
      } else if (this.inputManager.isPressing(KEY_CODE_RIGHT)) {
        if (this.inputManager.isPressing(KEY_CODE_DOWN)) {
          direction = 3
        } else if (this.inputManager.isPressing(KEY_CODE_UP)) {
          direction = 9
        } else {
          direction = 6
        }
      } else if (this.inputManager.isPressing(KEY_CODE_UP)) {
        direction = 8
      } else if (this.inputManager.isPressing(KEY_CODE_DOWN)) {
        direction = 2
      }
      // 向かせたり歩かせたり
      if (direction != null) {
        const [moveX, moveY] = calcMoveXY(direction, 3)
        this.character.preUpdateInfo = new PreUpdateInfo(moveX, moveY, direction)
      }
    }
    // 攻撃
    {
      if (this.inputManager.isReleased(90)) {
        this.character.attack()
      }
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