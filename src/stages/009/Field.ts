import { Character } from '@/stages/009/Character'
import { SortableParticleContainer } from '@/stages/005/SortableParticleContainer'
import * as PIXI from "pixi.js"

export class Field extends PIXI.Container {
  private bgLayerContainer!: PIXI.ParticleContainer
  private layerContainer!: SortableParticleContainer
  private debugLayerContainer!: PIXI.Container
  private horizontalGridNum = 26
  private verticalGridNum = 22
  private targetCharacter: Character | null = null
  private characters: Array<Character> = []
  private walls: Array<PIXI.Rectangle> = []
  constructor(private texture: PIXI.Texture) {
    super()
    this.sortableChildren = true

    // XXX:uvsをtrueにするとtextureのframeの変更が即時反映される
    this.bgLayerContainer = new PIXI.ParticleContainer(20000, { uvs: false })
    this.layerContainer = new SortableParticleContainer(20000, { uvs: true, vertices: true, tint: true })
    this.debugLayerContainer = new PIXI.Container()
    this.debugLayerContainer.visible = false
    this.addChild(this.bgLayerContainer)
    this.addChild(this.layerContainer)
    this.addChild(this.debugLayerContainer)

    const fieldTexture = texture.clone()
    fieldTexture.frame = new PIXI.Rectangle(176, 0, 16, 16)
    // 地面
    for (let y = 0; y < this.verticalGridNum; ++y) {
      for (let x = 0; x < this.horizontalGridNum; ++x) {
        const fieldSprite = PIXI.Sprite.from(fieldTexture)
        fieldSprite.position = new PIXI.Point(x * 16, y * 16)
        this.bgLayerContainer.addChild(fieldSprite)
      }
    }
    // 壁
    {
      const upperWallTexture = texture.clone()
      upperWallTexture.frame = new PIXI.Rectangle(176, 48, 16, 48)
      const bottomWallTexture = texture.clone()
      bottomWallTexture.frame = new PIXI.Rectangle(176, 16, 16, 32)
      // 上下
      for (let x = 1; x < this.horizontalGridNum - 1; ++x) {
        const upperWallSprite = PIXI.Sprite.from(upperWallTexture)
        upperWallSprite.position.set(x * 16, 0)
        this.bgLayerContainer.addChild(upperWallSprite)
        const bottomWallSprite = PIXI.Sprite.from(bottomWallTexture)
        bottomWallSprite.position.set(x * 16, this.verticalGridNum * 16 - 32)
        this.layerContainer.addChildZ(bottomWallSprite, Number.MAX_VALUE)
      }
      const leftWallTexture = texture.clone()
      leftWallTexture.frame = new PIXI.Rectangle(192, 32, 16, 16)
      const rightWallTexture = texture.clone()
      rightWallTexture.frame = new PIXI.Rectangle(160, 32, 16, 32)
      // 左右
      for (let y = 1; y < this.verticalGridNum - 2; ++y) {
        const leftWallSprite = PIXI.Sprite.from(leftWallTexture)
        leftWallSprite.position.set(0, y * 16)
        this.layerContainer.addChildZ(leftWallSprite, Number.MAX_VALUE)
        const rightWallSprite = PIXI.Sprite.from(rightWallTexture)
        rightWallSprite.position.set(this.horizontalGridNum * 16 - 16, y * 16)
        this.layerContainer.addChildZ(rightWallSprite, Number.MAX_VALUE)
      }
      const blackTexture = texture.clone()
      blackTexture.frame = new PIXI.Rectangle(176, 32, 16, 16)
      // 左上
      const leftTopWallTexture = texture.clone()
      leftTopWallTexture.frame = new PIXI.Rectangle(192, 64, 16, 16)
      const leftTopWallSprite = PIXI.Sprite.from(leftTopWallTexture)
      this.layerContainer.addChildZ(leftTopWallSprite, Number.MAX_VALUE)
      // 右上
      const rightTopWallTexture = texture.clone()
      rightTopWallTexture.frame = new PIXI.Rectangle(208, 64, 16, 16)
      const rightTopWallSprite = PIXI.Sprite.from(rightTopWallTexture)
      rightTopWallSprite.position.set(this.horizontalGridNum * 16 - 16, 0)
      this.layerContainer.addChildZ(rightTopWallSprite, Number.MAX_VALUE)
      // 左下
      const leftBottomWallTexture = texture.clone()
      leftBottomWallTexture.frame = new PIXI.Rectangle(192, 80, 16, 16)
      const leftBottomWallSprite = PIXI.Sprite.from(leftBottomWallTexture)
      leftBottomWallSprite.position.set(0, this.verticalGridNum * 16 - 32)
      this.layerContainer.addChildZ(leftBottomWallSprite, Number.MAX_VALUE)
      const leftBottomBlackSprite = PIXI.Sprite.from(blackTexture)
      leftBottomBlackSprite.position.set(0, this.verticalGridNum * 16 - 16)
      this.layerContainer.addChildZ(leftBottomBlackSprite, Number.MAX_VALUE)
      // 右下
      const rightBottomWallTexture = texture.clone()
      rightBottomWallTexture.frame = new PIXI.Rectangle(208, 80, 16, 16)
      const rightBottomWallSprite = PIXI.Sprite.from(rightBottomWallTexture)
      rightBottomWallSprite.position.set(this.horizontalGridNum * 16 -16, this.verticalGridNum * 16 - 32)
      this.layerContainer.addChildZ(rightBottomWallSprite, Number.MAX_VALUE)
      const rightBottomBlackSprite = PIXI.Sprite.from(blackTexture)
      rightBottomBlackSprite.position.set(this.horizontalGridNum * 16 - 16, this.verticalGridNum * 16 - 16)
      this.layerContainer.addChildZ(rightBottomBlackSprite, Number.MAX_VALUE)
      // 木箱
      {
        const hakoTexture = texture.clone()
        hakoTexture.frame = new PIXI.Rectangle(128, 32, 32, 32)
        for (let x = 0; x < 3; ++x) {
          const hakoSprite = PIXI.Sprite.from(hakoTexture)
          hakoSprite.position.set(16 + (x * 32), 16 * 12)
          this.layerContainer.addChildZ(hakoSprite, hakoSprite.position.y)
        }
      }
      // 影
      const shadowTexture = texture.clone()
      shadowTexture.frame = new PIXI.Rectangle(224, 80, 16, 16)
      for (let x = 1; x < this.horizontalGridNum - 1; ++x) {
        const shadowSprite = PIXI.Sprite.from(shadowTexture)
        shadowSprite.alpha = 0.3
        shadowSprite.position.set(16 * x, 48)
        this.bgLayerContainer.addChild(shadowSprite)
      }
      for (let y = 4; y < this.verticalGridNum - 1; ++y) {
        const shadowSprite = PIXI.Sprite.from(shadowTexture)
        shadowSprite.alpha = 0.3
        shadowSprite.position.set(16, 16 * y)
        this.bgLayerContainer.addChild(shadowSprite)
      }
      const shadowSmallBottomTexture = texture.clone()
      shadowSmallBottomTexture.frame = new PIXI.Rectangle(240, 64, 16, 16)
      const shadowSmallRightTexture = texture.clone()
      shadowSmallRightTexture.frame = new PIXI.Rectangle(224, 48, 16, 16)
      const shadowSmallRightBottomTexture = texture.clone()
      shadowSmallRightBottomTexture.frame = new PIXI.Rectangle(240, 80, 16, 16)
      for (let x = 2; x < 7; ++x) {
        const shadowSprite = PIXI.Sprite.from(shadowSmallBottomTexture)
        shadowSprite.alpha = 0.3
        shadowSprite.position.set(16 * x, 224)
        this.bgLayerContainer.addChild(shadowSprite)
      }
      {
        const shadowSprite = PIXI.Sprite.from(shadowSmallRightBottomTexture)
        shadowSprite.alpha = 0.3
        shadowSprite.position.set(16 * 7, 224)
        this.bgLayerContainer.addChild(shadowSprite)
      }
      {
        const shadowSprite = PIXI.Sprite.from(shadowSmallRightTexture)
        shadowSprite.alpha = 0.3
        shadowSprite.position.set(16 * 7, 208)
        this.bgLayerContainer.addChild(shadowSprite)
      }
      {
        const shadowSmallCornerTexture = texture.clone()
        shadowSmallCornerTexture.frame = new PIXI.Rectangle(224, 64, 16, 16)
        const shadowSprite = PIXI.Sprite.from(shadowSmallCornerTexture)
        shadowSprite.alpha = 0.3
        shadowSprite.position.set(16 * 7, 192)
        this.bgLayerContainer.addChild(shadowSprite)
      }
    }
    // 障害物設定
    {
      this.addWall(new PIXI.Rectangle(0, 0, 16, this.verticalGridNum * 16))
      this.addWall(new PIXI.Rectangle(this.horizontalGridNum * 16 - 16, 0, 16, this.verticalGridNum * 16))
      this.addWall(new PIXI.Rectangle(16, 0, this.horizontalGridNum * 16 - 32, 48))
      this.addWall(new PIXI.Rectangle(16, this.verticalGridNum * 16, this.horizontalGridNum * 16 - 32, 16))
      this.addWall(new PIXI.Rectangle(16, 16 * 12, 96, 32))
    }
    this.on('added', () => {
      // 親に追加されたときになにかやるならここで
    })
  }
  private addWall(rect: PIXI.Rectangle) {
    this.walls.push(rect)
    const wallGraphic = new PIXI.Graphics()
    wallGraphic.lineStyle(2, 0x5555FF, 1)
    wallGraphic.drawRect(rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2)
    this.debugLayerContainer.addChild(wallGraphic)
  }
  public addCharacter(character: Character, isTarget: boolean = false) {
    this.characters.push(character)
    if (isTarget) {
      this.targetCharacter = character
    }
    this.layerContainer.addChildZ(character.bodySprite, 1)
    this.layerContainer.addChildZ(character.shadowSprite, 1)
    this.debugLayerContainer.addChild(character.debugCircle)
    this.debugLayerContainer.addChild(character.debugRect)
  }
  public update() {
    // preUpdate
    this.characters.forEach(chara => chara.preUpdate())
    // 衝突判定など、ゲームの世界の都合でpreUpdateの内容に干渉しつつ、確定させる。
    this.characters.forEach(chara => {
      if (chara.preUpdateInfo != null) {
        const [moveX, moveY] = [chara.preUpdateInfo.moveX, chara.preUpdateInfo.moveY]
        if ((moveX != 0 || moveY != 0)) {
          if (!this.hitOtherCaracter(chara, moveX, moveY)) {
            const [hit, excessX, excessY] = this.hitWall(chara, moveX, moveY)
            // ぶつからなかった
            if (!hit) {
              chara.x += moveX
              chara.y += moveY
            }
            // ぶつかった 
            else {
              // 上下左右移動時は押し戻しに従う
              if (excessX === 0 || excessY === 0) {
                chara.x += (moveX - excessX)
                chara.y += (moveY - excessY)
              }
              // 斜め移動時は片方のみの移動を試みる
              else {
                if (!this.hitWall(chara, 0, moveY)[0]) {
                  chara.y += moveY
                  chara.x += (moveX - excessX) // 移動しなかった方向についても押し戻しは適用
                }
                else if (!this.hitWall(chara, moveX, 0)[0]) {
                  chara.x += moveX
                  chara.y += (moveY - excessY) // 移動しなかった方向についても押し戻しは適用
                }
              }
            }
          }
        }
        chara.currentDirection = chara.preUpdateInfo.nextDirection
        chara.preUpdateInfo = null
        chara.update()
      } else {
        chara.update()
      }
    })

    const rightLimitX = 320 - 96
    const leftLimitX = 96
    const bottomLimitY = 240 - 96 
    const topLimitY = 96
    // 視点移動
    if (this.targetCharacter) {
      const offsetX = this.targetCharacter.x + this.x
      if (offsetX > rightLimitX) {
        this.x = -(this.targetCharacter.x - rightLimitX)
      }
      else if (offsetX < leftLimitX) {
        this.x = -(this.targetCharacter.x - leftLimitX)
      }
      const offsetY = this.targetCharacter.y + this.y
      if (offsetY > bottomLimitY) {
        this.y = -(this.targetCharacter.y - bottomLimitY)
      }
      else if (offsetY < topLimitY) {
        this.y = -(this.targetCharacter.y - topLimitY)
      }
    }
    this.x = Math.floor(Math.min(0, Math.max(-(16 * this.horizontalGridNum - 320), this.x)))
    this.y = Math.floor(Math.min(0, Math.max(-(16 * this.verticalGridNum - 240), this.y)))
    // layerContainerについては自前でソートを行う
    this.layerContainer.sortChildren()
  }
  // 他キャラとの衝突判定
  private hitOtherCaracter(targetCharacter: Character, offsetX: number, offsetY: number) {
    const targetCircle = targetCharacter.hitCircle.clone()
    targetCircle.x += offsetX
    targetCircle.y += offsetY
    return this.characters.some(character => {
      if (targetCharacter === character) {
        return false
      }
      const [x1, y1, x2, y2] = [targetCircle.x, targetCircle.y, character.hitCircle.x, character.hitCircle.y]
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) <= targetCircle.radius + character.hitCircle.radius
    })
  }
  // 壁との衝突判定
  private hitWall(targetCharacter: Character, offsetX: number, offsetY: number): [boolean, number, number] {
    const targetRect = targetCharacter.hitRect.clone()
    targetRect.x += offsetX
    targetRect.y += offsetY
    let excessX = 0 // めり込んだ量X
    let excessY = 0 // めり込んだ量Y
    const hit = this.walls.some(wall => {
      const hHit = targetRect.left < wall.right && targetRect.right > wall.left
      const vHit = targetRect.top < wall.bottom && targetRect.bottom > wall.top
      const hit = hHit && vHit
      // 衝突した場合はめり込み量計算
      if (hit) {
        if (offsetX < 0) {
          excessX = targetRect.left - wall.right
        } else if (offsetX > 0) {
          excessX = targetRect.right - wall.left
        }
        if (offsetY < 0) {
          excessY = targetRect.top - wall.bottom
        } else if (offsetY > 0) {
          excessY = targetRect.bottom - wall.top
        }
      }
      return hit
    })
    return [hit, excessX, excessY]
  }
  public setDebugMode(flag: boolean) {
    this.debugLayerContainer.visible = flag
  }
}