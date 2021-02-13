import { Character } from '@/stages/008/Character'
import { SortableParticleContainer } from '@/stages/005/SortableParticleContainer'
import * as PIXI from "pixi.js"
import PixiFps from "pixi-fps";

export class Field extends PIXI.Container {
  private bgLayerContainer!: PIXI.ParticleContainer
  private layerContainer!: SortableParticleContainer
  private debugLayerContainer!: PIXI.Container
  private fpsCounter!: PixiFps 
  private horizontalGridNum = 30
  private verticalGridNum = 30
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
    // FPSカウンタ
    this.fpsCounter = new PixiFps()
    this.fpsCounter.position.set(4, 220)
    this.fpsCounter.style = {
      fontSize: 16,
      fill: '#FFF'
    } as PIXI.TextStyle
    this.fpsCounter.visible = false

    const fieldTexture = texture.clone()
    fieldTexture.frame = new PIXI.Rectangle(16, 0, 16, 16)
    // 地面
    for (let y = 0; y < this.verticalGridNum; ++y) {
      for (let x = 0; x < this.horizontalGridNum; ++x) {
        const fieldSprite = PIXI.Sprite.from(fieldTexture)
        fieldSprite.position = new PIXI.Point(x * 16, y * 16)
        this.bgLayerContainer.addChild(fieldSprite)
      }
    }
    // 柵
    {
      const sakuLeftTexture = texture.clone()
      sakuLeftTexture.frame = new PIXI.Rectangle(96, 64, 16, 16)
      const sakuRightTexture = texture.clone()
      sakuRightTexture.frame = new PIXI.Rectangle(112, 64, 16, 16)
      for (let y = 1; y < this.verticalGridNum - 1; ++y) {
        const sakuLeftSprite = PIXI.Sprite.from(sakuLeftTexture)
        sakuLeftSprite.position = new PIXI.Point(0, y * 16)
        this.bgLayerContainer.addChild(sakuLeftSprite)
        const sakuRightSprite = PIXI.Sprite.from(sakuRightTexture)
        sakuRightSprite.position = new PIXI.Point(this.horizontalGridNum * 16 - 16, y * 16)
        this.bgLayerContainer.addChild(sakuRightSprite)
      }
      const sakuTopTexture = texture.clone()
      sakuTopTexture.frame = new PIXI.Rectangle(96, 96, 16, 16)
      const sakuBottomTexture = texture.clone()
      sakuBottomTexture.frame = new PIXI.Rectangle(112, 96, 16, 16)
      for (let x = 1; x < this.horizontalGridNum - 1; ++x) {
        const sakuTopSprite = PIXI.Sprite.from(sakuTopTexture)
        sakuTopSprite.position = new PIXI.Point(x * 16, 0)
        this.bgLayerContainer.addChild(sakuTopSprite)
        const sakuBottomSprite = PIXI.Sprite.from(sakuBottomTexture)
        sakuBottomSprite.position = new PIXI.Point(x * 16, this.verticalGridNum * 16 - 16)
        this.bgLayerContainer.addChild(sakuBottomSprite)
      }
      const sakueLeftTopTexture = texture.clone()
      sakueLeftTopTexture.frame = new PIXI.Rectangle(96, 48, 16, 16)
      const sakueLeftTopSprite = PIXI.Sprite.from(sakueLeftTopTexture)
      sakueLeftTopSprite.position = new PIXI.Point(0, 0)
      this.bgLayerContainer.addChild(sakueLeftTopSprite)
      const sakueRightTopTexture = texture.clone()
      sakueRightTopTexture.frame = new PIXI.Rectangle(112, 48, 16, 16)
      const sakueRightTopSprite = PIXI.Sprite.from(sakueRightTopTexture)
      sakueRightTopSprite.position = new PIXI.Point(this.horizontalGridNum * 16 - 16, 0)
      this.bgLayerContainer.addChild(sakueRightTopSprite)
      const sakueLeftBottomTexture = texture.clone()
      sakueLeftBottomTexture.frame = new PIXI.Rectangle(96, 80, 16, 16)
      const sakueLeftBottomSprite = PIXI.Sprite.from(sakueLeftBottomTexture)
      sakueLeftBottomSprite.position = new PIXI.Point(0, this.verticalGridNum * 16 - 16)
      this.bgLayerContainer.addChild(sakueLeftBottomSprite)
      const sakueRightBottomTexture = texture.clone()
      sakueRightBottomTexture.frame = new PIXI.Rectangle(112, 80, 16, 16)
      const sakueRightBottomSprite = PIXI.Sprite.from(sakueRightBottomTexture)
      sakueRightBottomSprite.position = new PIXI.Point(this.horizontalGridNum * 16 - 16, this.verticalGridNum * 16 - 16)
      this.bgLayerContainer.addChild(sakueRightBottomSprite)
    }
    // 木(下)
    {
      const treeTexture = texture.clone()
      treeTexture.frame = new PIXI.Rectangle(32, 64, 64, 16)
      const treeSprite = PIXI.Sprite.from(treeTexture)
      treeSprite.position = new PIXI.Point((this.horizontalGridNum * 16) / 2 - 32, (this.verticalGridNum * 18 / 2))
      this.bgLayerContainer.addChild(treeSprite)
    }
    // 木(上)
    {
      const treeTexture = texture.clone()
      treeTexture.frame = new PIXI.Rectangle(32, 0, 64, 64)
      const treeSprite = new PIXI.Sprite(treeTexture)
      treeSprite.position = new PIXI.Point((this.horizontalGridNum * 16) / 2 - 32, (this.verticalGridNum * 18 / 2) - 64)
      ;(treeSprite as any).zOrder = treeSprite.position.y + 68
      this.layerContainer.addChild(treeSprite)
    }
    // 木(下)
    {
      const treeTexture = texture.clone()
      treeTexture.frame = new PIXI.Rectangle(32, 64, 64, 16)
      const treeSprite = PIXI.Sprite.from(treeTexture)
      treeSprite.position = new PIXI.Point((this.horizontalGridNum * 14) / 2 - 32, (this.verticalGridNum * 15 / 2))
      this.bgLayerContainer.addChild(treeSprite)
    }
    // 木(上)
    {
      const treeTexture = texture.clone()
      treeTexture.frame = new PIXI.Rectangle(32, 0, 64, 64)
      const treeSprite = new PIXI.Sprite(treeTexture)
      treeSprite.position = new PIXI.Point((this.horizontalGridNum * 14) / 2 - 32, (this.verticalGridNum * 15 / 2) - 64)
      ;(treeSprite as any).zOrder = treeSprite.position.y + 68
      this.layerContainer.addChild(treeSprite)
    }
    // みかん
    /*
    {
      const mikanTexture = texture.clone()
      mikanTexture.frame = new PIXI.Rectangle(128, 0, 32, 32)
      const mikanSprite = new PIXI.Sprite(mikanTexture)
      mikanSprite.anchor.set(0.5, 0.5)
      // mikanSprite.position = new PIXI.Point((this.horizontalGridNum * 10) / 2 - 32, (this.verticalGridNum * 10 / 2) - 64)
      mikanSprite.position.set(150, 60)
      ;(mikanSprite as any).zOrder = mikanSprite.position.y + 14
      this.layerContainer.addChild(mikanSprite)
    }
    */
    // 障害物設定
    {
      const rect = new PIXI.Rectangle(32, 96, 32, 128)
      this.walls.push(rect)
      const wallGraphic = new PIXI.Graphics()
      wallGraphic.lineStyle(2, 0x5555FF, 1)
      wallGraphic.drawRect(rect.x + 1, rect.y + 1, rect.width - 2, rect.height - 2)
      this.debugLayerContainer.addChild(wallGraphic)
    }
    this.on('added', () => {
      this.parent.addChild(this.fpsCounter)
    })
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
            if (!this.hitWall(chara, moveX, moveY)) {
              chara.x += moveX
              chara.y += moveY
            }
            else if (!this.hitWall(chara, 0, moveY)) {
              chara.y += moveY
            }
            else if (!this.hitWall(chara, moveX, 0)) {
              chara.x += moveX
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
  private hitWall(targetCharacter: Character, offsetX: number, offsetY: number) {
    const targetRect = targetCharacter.hitRect.clone()
    targetRect.x += offsetX
    targetRect.y += offsetY
    return this.walls.some(wall => {
      const hHit = targetRect.left <= wall.right && targetRect.right >= wall.left
      const vHit = targetRect.top <= wall.bottom && targetRect.bottom >= wall.top
      return hHit && vHit
    })
  }
  public setDebugMode(flag: boolean) {
    this.debugLayerContainer.visible = flag
    this.fpsCounter.visible = flag
  }
}