import * as PIXI from "pixi.js"
import { Character } from '@/stages/004/Character'

export class Field extends PIXI.Container {
  private fieldContainer!: PIXI.ParticleContainer
  private horizontalGridNum = 30
  private verticalGridNum = 30
  private targetCharacter: Character | null = null
  private characters: Array<Character> = []
  constructor(private texture: PIXI.Texture) {
    super()
    this.sortableChildren = true

    this.fieldContainer = new PIXI.ParticleContainer
    this.fieldContainer.zIndex = -1000
    const fieldTexture = texture.clone()
    fieldTexture.frame = new PIXI.Rectangle(0, 0, 16, 16)
    // 地面
    for (let y = 0; y < this.verticalGridNum; ++y) {
      for (let x = 0; x < this.horizontalGridNum; ++x) {
        const fieldSprite = PIXI.Sprite.from(fieldTexture)
        fieldSprite.position = new PIXI.Point(x * 16, y * 16)
        this.fieldContainer.addChild(fieldSprite)
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
        this.fieldContainer.addChild(sakuLeftSprite)
        const sakuRightSprite = PIXI.Sprite.from(sakuRightTexture)
        sakuRightSprite.position = new PIXI.Point(this.horizontalGridNum * 16 - 16, y * 16)
        this.fieldContainer.addChild(sakuRightSprite)
      }
      const sakuTopTexture = texture.clone()
      sakuTopTexture.frame = new PIXI.Rectangle(96, 96, 16, 16)
      const sakuBottomTexture = texture.clone()
      sakuBottomTexture.frame = new PIXI.Rectangle(112, 96, 16, 16)
      for (let x = 1; x < this.horizontalGridNum - 1; ++x) {
        const sakuTopSprite = PIXI.Sprite.from(sakuTopTexture)
        sakuTopSprite.position = new PIXI.Point(x * 16, 0)
        this.fieldContainer.addChild(sakuTopSprite)
        const sakuBottomSprite = PIXI.Sprite.from(sakuBottomTexture)
        sakuBottomSprite.position = new PIXI.Point(x * 16, this.verticalGridNum * 16 - 16)
        this.fieldContainer.addChild(sakuBottomSprite)
      }
      const sakueLeftTopTexture = texture.clone()
      sakueLeftTopTexture.frame = new PIXI.Rectangle(96, 48, 16, 16)
      const sakueLeftTopSprite = PIXI.Sprite.from(sakueLeftTopTexture)
      sakueLeftTopSprite.position = new PIXI.Point(0, 0)
      this.fieldContainer.addChild(sakueLeftTopSprite)
      const sakueRightTopTexture = texture.clone()
      sakueRightTopTexture.frame = new PIXI.Rectangle(112, 48, 16, 16)
      const sakueRightTopSprite = PIXI.Sprite.from(sakueRightTopTexture)
      sakueRightTopSprite.position = new PIXI.Point(this.horizontalGridNum * 16 - 16, 0)
      this.fieldContainer.addChild(sakueRightTopSprite)
      const sakueLeftBottomTexture = texture.clone()
      sakueLeftBottomTexture.frame = new PIXI.Rectangle(96, 80, 16, 16)
      const sakueLeftBottomSprite = PIXI.Sprite.from(sakueLeftBottomTexture)
      sakueLeftBottomSprite.position = new PIXI.Point(0, this.verticalGridNum * 16 - 16)
      this.fieldContainer.addChild(sakueLeftBottomSprite)
      const sakueRightBottomTexture = texture.clone()
      sakueRightBottomTexture.frame = new PIXI.Rectangle(112, 80, 16, 16)
      const sakueRightBottomSprite = PIXI.Sprite.from(sakueRightBottomTexture)
      sakueRightBottomSprite.position = new PIXI.Point(this.horizontalGridNum * 16 - 16, this.verticalGridNum * 16 - 16)
      this.fieldContainer.addChild(sakueRightBottomSprite)
    }
    // 木
    {
      const treeTexture = texture.clone()
      treeTexture.frame = new PIXI.Rectangle(32, 0, 64, 80)
      const treeSprite = PIXI.Sprite.from(treeTexture)
      treeSprite.position = new PIXI.Point((this.horizontalGridNum * 16) / 2 - 32, (this.verticalGridNum * 16 / 2) - 40)
      this.fieldContainer.addChild(treeSprite)
    }

    this.addChild(this.fieldContainer)
  }
  public addCharacter(character: Character, isTarget: boolean = false) {
    this.characters.push(character)
    if (isTarget) {
      this.targetCharacter = character
    }
    this.addChild(character)
  }
  public update() {
    this.characters.forEach(chara => chara.update())
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
  }
}