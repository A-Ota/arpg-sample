import { Character } from '@/stages/012/Character'
import { SortableParticleContainer } from '@/stages/005/SortableParticleContainer'
import * as PIXI from "pixi.js"
import * as PIXITilemap from '@/pixi-tilemap/index'

const AREA_DIVIDE_GRID_NUM = 3

class Collosion {
  constructor(
    public type: number,
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) {}
}

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
  private collisions: Array<Collosion> = []
  private collisionsByArea: Map<string, Array<Collosion>> = new Map() 
  private textureMap: Map<string, PIXI.Texture> = new Map()
  private textureList: Array<PIXI.Texture> = []
  constructor(private texture: PIXI.Texture, private mapChipData: any, private mapData: any) {
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

    for (let gridY = 0, gridYCount = Math.floor(this.mapChipData.imageheight / this.mapChipData.tileheight); gridY < gridYCount; ++gridY) {
      for (let gridX = 0, gridXCount = Math.floor(this.mapChipData.imagewidth / this.mapChipData.tilewidth); gridX < gridXCount; ++gridX) {
        const texture = this.texture.clone()
        texture.frame = new PIXI.Rectangle(
          this.mapChipData.tilewidth * gridX,
          this.mapChipData.tileheight * gridY,
          this.mapChipData.tilewidth,
          this.mapChipData.tileheight)
        this.textureList.push(texture)
      }
    }
    // チップを配置
    {
      this.horizontalGridNum = this.mapData.width
      this.verticalGridNum = this.mapData.height
      for (let gridY = 0; gridY < this.verticalGridNum; ++gridY) {
        for (let gridX = 0; gridX < this.horizontalGridNum; ++gridX) {
          const mapChipIndex = gridX + gridY * this.horizontalGridNum
          // 下層、中層、上層地形
          for (let layerIndex = 0; layerIndex < 3; ++layerIndex) {
            const textureIndex = this.mapData.layers[layerIndex].data[mapChipIndex]
            if (textureIndex > 0) {
              this.bgLayerContainer.addFrame(this.textureList[textureIndex - 1], gridX * this.mapChipData.tilewidth, gridY * this.mapChipData.tileheight)
            }
          }
          // 上空
          {
            const textureIndex = this.mapData.layers[3].data[mapChipIndex]
            if (textureIndex > 0) {
              this.airLayerContainer.addFrame(this.textureList[textureIndex - 1], gridX * this.mapChipData.tilewidth, gridY * this.mapChipData.tileheight)
            }
          }
          // 衝突判定
          {
            // 衝突判定用チップの開始indexを取得しておく
            const firstIndex = this.mapData.tilesets.filter((v: any) => v.source === 'collosion.json')[0].firstgid
            const textureIndex = this.mapData.layers[4].data[mapChipIndex]
            if (textureIndex > 0) {
              this.collisions[gridY * this.horizontalGridNum + gridX] = new Collosion(
                textureIndex - firstIndex,
                gridX * this.mapData.tilewidth,
                gridY * this.mapData.tileheight,
                gridX * this.mapData.tilewidth + this.mapData.tilewidth,
                gridY * this.mapData.tileheight + this.mapData.tileheight
              )
            }
          }
        }
      }
      // 衝突判定を4x4グリッド毎にエリア分け
      for (let gridY = 0; gridY < this.verticalGridNum; ++gridY) {
        for (let gridX = 0; gridX < this.horizontalGridNum; ++gridX) {
          const collision = this.collisions[gridY * this.horizontalGridNum + gridX]
          if (collision != null) {
            const areaGridString = [Math.floor(gridX / AREA_DIVIDE_GRID_NUM), Math.floor(gridY / AREA_DIVIDE_GRID_NUM)].toString()
            if (this.collisionsByArea.has(areaGridString)) {
              this.collisionsByArea.get(areaGridString)!.push(collision)
            } else {
              this.collisionsByArea.set(areaGridString, [collision])
            }
          }
        }
      }
      console.log(this.collisionsByArea.size)
    }
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
    const rightLimitX = 649 - 160
    const leftLimitX = 160
    const bottomLimitY = 480 - 128
    const topLimitY = 128
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
    this.x = Math.floor(Math.min(0, Math.max(-(this.mapData.tilewidth * this.horizontalGridNum - 640), this.x)))
    this.y = Math.floor(Math.min(0, Math.max(-(this.mapData.tileheight * this.verticalGridNum - 480), this.y)))
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
  private hitWall(targetCharacter: Character, offsetX: number, offsetY: number): [boolean, number, number] {
    const [gridX, gridY] = [Math.floor(targetCharacter.x / this.mapData.tilewidth), Math.floor(targetCharacter.y / this.mapData.tileheight)]
    const areaGrid = [Math.floor(gridX / AREA_DIVIDE_GRID_NUM), Math.floor(gridY / AREA_DIVIDE_GRID_NUM)]
    const collisions = this.getCollisionsByAreaGrid(areaGrid)
    console.log(collisions.length)

    const targetRect = targetCharacter.hitRect.clone()
    targetRect.x += offsetX
    targetRect.y += offsetY
    let excessX = 0 // めり込んだ量X
    let excessY = 0 // めり込んだ量Y

    // そのキャラの周辺のcollisionを抽出
    const hit = collisions.some(collision => {
      const hHit = targetRect.left < collision.right && targetRect.right > collision.left
      const vHit = targetRect.top < collision.bottom && targetRect.bottom > collision.top
      const hit = hHit && vHit
      // 衝突した場合はめり込み量計算
      if (hit) {
        if (offsetX < 0) {
          excessX = targetRect.left - collision.right
        } else if (offsetX > 0) {
          excessX = targetRect.right - collision.left
        }
        if (offsetY < 0) {
          excessY = targetRect.top - collision.bottom
        } else if (offsetY > 0) {
          excessY = targetRect.bottom - collision.top
        }
      }
      return hit
    })
    return [hit, excessX, excessY]
  }
  private getCollisionsByAreaGrid(areaGrid: Array<number>): Array<Collosion> {
    const collisions: Array<Collosion> = []
    const areaGridStrings = [
      areaGrid.toString(),
      [areaGrid[0] - 1, areaGrid[1]].toString(),
      [areaGrid[0] - 1, areaGrid[1] - 1].toString(),
      [areaGrid[0], areaGrid[1] - 1].toString(),
      [areaGrid[0] + 1, areaGrid[1] - 1].toString(),
      [areaGrid[0] + 1, areaGrid[1]].toString(),
      [areaGrid[0] + 1, areaGrid[1] + 1].toString(),
      [areaGrid[0], areaGrid[1] + 1].toString(),
      [areaGrid[0] - 1, areaGrid[1] + 1].toString()
    ]
    areaGridStrings.forEach(areaGridString => {
      if (this.collisionsByArea.has(areaGridString)) {
        Array.prototype.push.apply(collisions, this.collisionsByArea.get(areaGridString)!)
      }
    })
    return collisions
  }
  public setDebugMode(flag: boolean) {
    this.debugLayerContainer.visible = flag
  }
}