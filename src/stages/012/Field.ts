import { Character } from '@/stages/011/Character'
import { SortableParticleContainer } from '@/stages/005/SortableParticleContainer'
import * as PIXI from "pixi.js"
import * as PIXITilemap from '@/pixi-tilemap/index'

export class Field extends PIXI.Container {
  private bgLayerContainer!: PIXITilemap.CompositeRectTileLayer
  private airLayerContainer!: PIXITilemap.CompositeRectTileLayer
  private layerContainer!: SortableParticleContainer
  private debugLayerContainer!: PIXI.Container
  public horizontalGridNum = 200
  public verticalGridNum = 200
  private targetCharacter: Character | null = null
  private characters: Array<Character> = []
  private walls: Array<PIXI.Rectangle> = []
  private textureMap: Map<string, PIXI.Texture> = new Map()
  private textureList: Array<PIXI.Texture> = []
  constructor(private texture: PIXI.Texture, private mapData: any) {
    super()

    // 150,000チップ以上使えるようにする
    PIXITilemap.Constant.use32bitIndex = true;

    this.sortableChildren = true
    this.bgLayerContainer = new PIXITilemap.CompositeRectTileLayer(0, [texture])
    this.layerContainer = new SortableParticleContainer(20000, { uvs: true, vertices: true, tint: true })
    this.airLayerContainer = new PIXITilemap.CompositeRectTileLayer(0, [texture])
    this.debugLayerContainer = new PIXI.Container()
    this.debugLayerContainer.visible = false
    this.addChild(this.bgLayerContainer)
    this.addChild(this.layerContainer)
    this.addChild(this.airLayerContainer)
    this.addChild(this.debugLayerContainer)

    this.generateMap()
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
  public reloadMap(mapData: any) {
    this.mapData = mapData
    this.clearMap()
    this.generateMap()
  }
  public clearMap() {
    this.textureMap.forEach(value => value.destroy())
    this.textureMap.clear()
    this.bgLayerContainer.clear()
    this.airLayerContainer.clear()
    this.walls.length = 0
  }
  public generateMap() {
    // まずは全てのチップをテクスチャ化
    this.textureList.forEach(texture => texture.destroy())
    this.textureList.length = 0
    // TODO:
    /*
    for (let gridY = 0; gridY < this.mapChipData.verticalGridNum; ++gridY) {
      for (let gridX = 0; gridX < this.mapChipData.horizontalGridNum; ++gridX) {
        const texture = this.texture.clone()
        texture.frame = new PIXI.Rectangle(
          this.mapChipData.gridSizeX * gridX,
          this.mapChipData.gridSizeY * gridY,
          this.mapChipData.gridSizeX,
          this.mapChipData.gridSizeY)
        this.textureList.push(texture)
      }
    }
    // チップを配置
    for (let gridY = 0; gridY < this.mapData.verticalGridNum; ++gridY) {
      for (let gridX = 0; gridX < this.mapData.horizontalGridNum; ++gridX) {
        const mapChipIndex = gridX + gridY * this.mapData.horizontalGridNum
        // 下層地形
        {
          const textureIndex = this.mapData.layerChipsList[0][mapChipIndex]
          if (textureIndex != null) {
            this.bgLayerContainer.addFrame(this.textureList[textureIndex], gridX * 16, gridY * 16)
          }
        }
        // 上層地形
        {
          const textureIndex = this.mapData.layerChipsList[1][mapChipIndex]
          if (textureIndex != null) {
            this.bgLayerContainer.addFrame(this.textureList[textureIndex], gridX * 16, gridY * 16)
          }
        }
        // 上空
        {
          const textureIndex = this.mapData.layerChipsList[2][mapChipIndex]
          if (textureIndex != null) {
            this.airLayerContainer.addFrame(this.textureList[textureIndex], gridX * 16, gridY * 16)
          }
        }
      }
    }
    */
  }
  public addCharacter(character: Character, isTarget = false) {
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
    // update
    this.characters.forEach(chara => {
      if (chara.preUpdateInfo != null) {
        const [moveX, moveY] = [chara.preUpdateInfo.moveX, chara.preUpdateInfo.moveY]
        chara.x += moveX
        chara.y += moveY
        chara.currentDirection = chara.preUpdateInfo.nextDirection
        chara.preUpdateInfo = null
      }
      chara.update()
    })
    // 衝突判定など、ゲームの世界の都合でpreUpdateの内容に干渉しつつ、確定させる。
    this.characters.forEach(chara => {
      if (chara.preUpdateInfo != null) {
        let [moveX, moveY] = [chara.preUpdateInfo.moveX, chara.preUpdateInfo.moveY]
        if ((moveX != 0 || moveY != 0)) {
          // キャラ
          const [hitCharacter, hitDistanceRate] = this.hitOtherCaracter(chara, moveX, moveY)
          if (hitCharacter) {
            // キャラにめり込んだ分を戻す
            moveX = (moveX - (moveX * hitDistanceRate))
            moveY = (moveY - (moveY * hitDistanceRate))
          }
          // 地形
          {
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

    // 視点移動
    const rightLimitX = 320 - 96
    const leftLimitX = 96
    const bottomLimitY = 240 - 64 
    const topLimitY = 64
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
  private hitOtherCaracter(targetCharacter: Character, offsetX: number, offsetY: number): [boolean, number] {
    const targetCircle = targetCharacter.hitCircle.clone()
    targetCircle.x += offsetX
    targetCircle.y += offsetY
    let hitDistance = 0
    const hit = this.characters.some(character => {
      if (targetCharacter === character) {
        return false
      }
      const [x1, y1, x2, y2] = [targetCircle.x, targetCircle.y, character.hitCircle.x, character.hitCircle.y]
      // めり込んだ距離(の2乗)
      hitDistance = (targetCircle.radius + character.hitCircle.radius) - Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
      const hit = hitDistance >= 0
      return hit
    })
    return [hit, hit ? hitDistance / Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)) : 0]
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