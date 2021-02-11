import * as PIXI from "pixi.js"
import { Character } from '@/stages/004/Character'

export class Field extends PIXI.Container {
  private horizontalGridNum = 100
  private verticalGridNum = 100
  private targetCharacter: Character | null = null
  private characters: Array<Character> = []
  constructor(private texture: PIXI.Texture) {
    super()
    this.sortableChildren = true
    // もしかするとframe指定のテクスチャは重いのかも？
    texture.frame = new PIXI.Rectangle(0, 0, 16, 16)
    for (let y = 0; y < this.verticalGridNum; ++y) {
      for (let x = 0; x < this.horizontalGridNum; ++x) {
        const fieldSprite = PIXI.Sprite.from(texture)
        fieldSprite.position = new PIXI.Point(x * 16, y * 16)
        this.addChild(fieldSprite)
      }
    }
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
    const rightLimitX = 320 - 60 
    const leftLimitX = 60 
    const bottomLimitY = 240 - 60 
    const topLimitY = 60 
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
    // this.x = Math.round(this.x)
    // this.y = Math.round(this.y)
    /*
    this.x = Math.floor(Math.min(0, Math.max(-(16 * this.horizontalGridNum - 320), this.x)))
    this.y = Math.floor(Math.min(0, Math.max(-(16 * this.verticalGridNum - 240), this.y)))
    */
  }
}