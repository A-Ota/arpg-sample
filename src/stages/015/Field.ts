import { Character } from '@/stages/015/Character'
import { SortableParticleContainer } from '@/stages/005/SortableParticleContainer'
import * as PIXI from "pixi.js"
import * as PIXITilemap from '@/pixi-tilemap/index'

const AREA_DIVIDE_GRID_NUM = 3
const GAME_AREA_WIDTH = 640
const GAME_AREA_HEIGHT = 480
const SIGHT_MOVE_X = GAME_AREA_WIDTH / 3
const SIGHT_MOVE_Y = GAME_AREA_HEIGHT / 3

class Collosion {
  constructor(
    public type: number,
    public left: number,
    public top: number,
    public right: number,
    public bottom: number
  ) {}
}

class FieldCharacter {
  public isAdded: boolean = false
  constructor(
    public character: Character,
    public areaGridX: number,
    public areaGridY: number,
  ) {}
}

export class Field extends PIXI.Container {
  public bgLayerContainer!: PIXITilemap.CompositeRectTileLayer
  public airLayerContainer!: PIXITilemap.CompositeRectTileLayer
  public layerContainer!: SortableParticleContainer
  public debugLayerContainer!: PIXI.Container
  public horizontalGridNum = 200
  public verticalGridNum = 200
  public targetCharacter: Character | null = null
  private fieldCharacters: Array<FieldCharacter> = []
  private inSightArea: PIXI.Rectangle = new PIXI.Rectangle()
  private walls: Array<PIXI.Rectangle> = []
  private collisions: Array<Collosion> = []
  private collisionsByArea: Map<string, Array<Collosion>> = new Map()
  private fieldCharactersByArea: Map<string, Array<FieldCharacter>> = new Map()
  private textureMap: Map<string, PIXI.Texture> = new Map()
  private textureList: Array<PIXI.Texture> = []
  private frameCount = 0
  constructor(private texture: PIXI.Texture, private mapChipData: any, private mapData: any) {
    super()

    // 150,000チップ以上使えるようにする
    PIXITilemap.Constant.use32bitIndex = true;

    this.sortableChildren = true
    this.bgLayerContainer = new PIXITilemap.CompositeRectTileLayer(0, [texture])
    this.layerContainer = new SortableParticleContainer(20000, { uvs: true, vertices: true, tint: true, rotation: true })
    this.airLayerContainer = new PIXITilemap.CompositeRectTileLayer(0, [texture])
    this.debugLayerContainer = new PIXI.Container()
    this.debugLayerContainer.visible = false
    this.addChild(this.bgLayerContainer)
    this.addChild(this.layerContainer)
    this.addChild(this.airLayerContainer)
    this.addChild(this.debugLayerContainer)

    this.generateMap()
    this.inSightArea.width = Math.ceil(GAME_AREA_WIDTH / (AREA_DIVIDE_GRID_NUM * this.mapData.tilewidth)) + 4
    this.inSightArea.height = Math.ceil(GAME_AREA_HEIGHT / (AREA_DIVIDE_GRID_NUM * this.mapData.tileheight)) + 4
    this.updateInSightArea()
    this.on('added', () => {
      // 親に追加されたときになにかやるならここで
    })
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
            const areaGridString = this.gridToAreaGrid(gridX, gridY).toString()
            if (this.collisionsByArea.has(areaGridString)) {
              this.collisionsByArea.get(areaGridString)!.push(collision)
            } else {
              this.collisionsByArea.set(areaGridString, [collision])
            }
          }
        }
      }
      // console.log(`衝突判定のエリア分けの数:${this.collisionsByArea.size}`)
    }
  }
  public setTargetCharacter(character: Character) {
    this.targetCharacter = character
  }
  public addCharacter(character: Character, isTarget = false) {
    const [areaGridX, areaGridY] = this.positionToAreaGrid(character.x, character.y)
    const fieldCharacter = new FieldCharacter(character, areaGridX, areaGridY)
    this.fieldCharacters.push(fieldCharacter)
    this.addFieldCharacterToArea(fieldCharacter, areaGridX, areaGridY)
    if (isTarget) {
      this.setTargetCharacter(character)
    }
    character.update()
    // 追加時に視界内かを判定して処理
    if (this.isInSight(fieldCharacter)) {
      character.onAddToField()
      fieldCharacter.isAdded = true
    }
  }
  public removeCharacter(character: Character) {
    if (this.targetCharacter === character) {
      this.targetCharacter = null
    }
    character.onRemoveFromField()
    this.fieldCharacters = this.fieldCharacters.filter(fieldCharacter => {
      if (fieldCharacter.character === character) {
        this.removeFieldCharacterFromArea(fieldCharacter, fieldCharacter.areaGridX, fieldCharacter.areaGridY)
        return false
      }
      return true
    })
  }
  public update() {
    // const t1 = performance.now()
    const fieldCharacters = this.getInSightFieldCharacters()
    // preUpdate
    fieldCharacters.forEach(fieldCharacter => fieldCharacter.character.preUpdate())
    // 衝突判定など、ゲームの世界の都合でpreUpdateの内容に干渉しつつ、確定させる。
    fieldCharacters.forEach(fieldCharacter => {
      if (fieldCharacter.character.preUpdateInfo != null) {
        let [moveX, moveY] = [fieldCharacter.character.preUpdateInfo.moveX, fieldCharacter.character.preUpdateInfo.moveY]
        if ((moveX != 0 || moveY != 0)) {
          // キャラ
          // const t1 = performance.now()
          const [hitCharacter, hitDistanceRate] = this.hitOtherCaracter(fieldCharacter, moveX, moveY)
          // t1sum += (performance.now() - t1)
          if (hitCharacter) {
            // キャラにめり込んだ分を戻す
            moveX = (moveX - (moveX * hitDistanceRate))
            moveY = (moveY - (moveY * hitDistanceRate))
          }
          // 地形
          {
            // const t2 = performance.now()
            const [hit, excessX, excessY] = this.hitWall(fieldCharacter.character, moveX, moveY)
            // t2sum += (performance.now() - t2)
            // ぶつからなかった
            if (!hit) {
              fieldCharacter.character.x += moveX
              fieldCharacter.character.y += moveY
            }
            // ぶつかった 
            else {
              // 上下左右移動時は押し戻しに従う
              if (excessX === 0 || excessY === 0) {
                fieldCharacter.character.x += (moveX - excessX)
                fieldCharacter.character.y += (moveY - excessY)
              }
              // 斜め移動時は片方のみの移動を試みる
              else {
                if (!this.hitWall(fieldCharacter.character, 0, moveY)[0]) {
                  fieldCharacter.character.y += moveY
                  fieldCharacter.character.x += (moveX - excessX) // 移動しなかった方向についても押し戻しは適用
                }
                else if (!this.hitWall(fieldCharacter.character, moveX, 0)[0]) {
                  fieldCharacter.character.x += moveX
                  fieldCharacter.character.y += (moveY - excessY) // 移動しなかった方向についても押し戻しは適用
                }
              }
            }
          }
        }
        fieldCharacter.character.currentDirection = fieldCharacter.character.preUpdateInfo.nextDirection
        fieldCharacter.character.preUpdateInfo = null

        const [oldAreaGridX, oldAreaGridY] = [fieldCharacter.areaGridX, fieldCharacter.areaGridY]
        fieldCharacter.character.update()
        ;[fieldCharacter.areaGridX, fieldCharacter.areaGridY] = this.positionToAreaGrid(fieldCharacter.character.x, fieldCharacter.character.y)
        // キャラの所属AreaGridの変更検知
        if (fieldCharacter.areaGridX !== oldAreaGridX || fieldCharacter.areaGridY !== oldAreaGridY) {
          this.removeFieldCharacterFromArea(fieldCharacter, oldAreaGridX, oldAreaGridY)
          this.addFieldCharacterToArea(fieldCharacter,fieldCharacter.areaGridX, fieldCharacter.areaGridY)
          // 視界外になったら非表示
          if (!this.isInSight(fieldCharacter)) {
            fieldCharacter.character.onRemoveFromField()
            fieldCharacter.isAdded = false
          }
        }
        // console.log(`キャラの所属AreaGrid(${fieldCharacter.areaGridX}, ${fieldCharacter.areaGridY})`)
      } else {
        fieldCharacter.character.update()
      }
    })

    // 視点移動
    const rightLimitX = GAME_AREA_WIDTH - SIGHT_MOVE_X
    const leftLimitX = SIGHT_MOVE_X
    const bottomLimitY = GAME_AREA_HEIGHT - SIGHT_MOVE_Y
    const topLimitY = SIGHT_MOVE_Y
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
      const [oldInSightAreaX, oldInSightAreaY] = [this.inSightArea.x, this.inSightArea.y]
      this.updateInSightArea()
      // 視界外になった領域のキャラを非表示に、視界内になった領域のキャラを表示に
      const movedAreaX = this.inSightArea.x - oldInSightAreaX
      const movedAreaY = this.inSightArea.y - oldInSightAreaY
      this.updateCharacterVisibilityByMovedAreaOffset(movedAreaX, movedAreaY)
    }
    this.x = Math.floor(Math.min(0, Math.max(-(this.mapData.tilewidth * this.horizontalGridNum - GAME_AREA_WIDTH), this.x)))
    this.y = Math.floor(Math.min(0, Math.max(-(this.mapData.tileheight * this.verticalGridNum - GAME_AREA_HEIGHT), this.y)))
    // layerContainerについては自前でソートを行う
    this.layerContainer.sortChildren()

    // if (this.frameCount % 200 === 0) {
      // console.log(`${performance.now() - t1}`)
    // }
    ++ this.frameCount

  }
  // 他キャラとの衝突判定
  private hitOtherCaracter(targetFieldCharacter: FieldCharacter, offsetX: number, offsetY: number): [boolean, number] {
    const targetCircle = targetFieldCharacter.character.hitCircle.clone()
    targetCircle.x += offsetX
    targetCircle.y += offsetY
    let hitDistance = 0
    const otherFieldCharacters = this.getOtherFieldCharactersByAreaGrid(targetFieldCharacter)
    // const otherFieldCharacters = this.fieldCharacters.filter(fieldCharacter => targetFieldCharacter != fieldCharacter)
    // console.log(otherFieldCharacters.length)
    const hit = otherFieldCharacters.some(fieldCharacter => {
      const [x1, y1, x2, y2] = [targetCircle.x, targetCircle.y, fieldCharacter.character.hitCircle.x, fieldCharacter.character.hitCircle.y]
      // めり込んだ距離(の2乗)
      hitDistance = (targetCircle.radius + fieldCharacter.character.hitCircle.radius) - Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
      const hit = hitDistance >= 0
      return hit
    })
    return [hit, hit ? hitDistance / Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)) : 0]
  }
  public hitWall(targetCharacter: Character, offsetX: number, offsetY: number): [boolean, number, number] {
    const areaGrid = this.positionToAreaGrid(targetCharacter.x, targetCharacter.y)
    const collisions = this.getCollisionsByAreaGrid(areaGrid)
    // const collisions = this.collisions
    // console.log(collisions.length)

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
  private getOtherFieldCharactersByAreaGrid(fieldCharacter: FieldCharacter) {
    const otherFieldCharacters: Array<FieldCharacter> = []
    const areaGrid = [fieldCharacter.areaGridX, fieldCharacter.areaGridY]
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
      if (this.fieldCharactersByArea.has(areaGridString)) {
        Array.prototype.push.apply(otherFieldCharacters, this.fieldCharactersByArea.get(areaGridString)!)
      }
    })
    return otherFieldCharacters.filter(fieldCharacter2 => fieldCharacter2 !== fieldCharacter)
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
  private addFieldCharacterToArea(fieldCharacter: FieldCharacter, areaGridX: number, areaGridY: number) {
    const areaGridString = [areaGridX, areaGridY].toString()
    if (this.fieldCharactersByArea.has(areaGridString)) {
      this.fieldCharactersByArea.get(areaGridString)!.push(fieldCharacter)
    } else {
      this.fieldCharactersByArea.set(areaGridString, [fieldCharacter])
    }
  }
  private removeFieldCharacterFromArea(fieldCharacter: FieldCharacter, areaGridX: number, areaGridY: number) {
    const areaGridString = [areaGridX, areaGridY].toString()
    const fieldCharacters = this.fieldCharactersByArea.get(areaGridString)!
    this.fieldCharactersByArea.set(areaGridString, fieldCharacters.filter(fieldCharacter2 => fieldCharacter2 !== fieldCharacter))
  }
  private gridToAreaGrid(gridX: number, gridY: number) {
    return [Math.floor(gridX / AREA_DIVIDE_GRID_NUM), Math.floor(gridY / AREA_DIVIDE_GRID_NUM)]
  }
  private positionToAreaGrid(x: number, y: number) {
    return [Math.floor(x / (AREA_DIVIDE_GRID_NUM * this.mapData.tilewidth)), Math.floor(y / (AREA_DIVIDE_GRID_NUM * this.mapData.tileheight))]
  }
  public setDebugMode(flag: boolean) {
    this.debugLayerContainer.visible = flag
  }
  // 視界内のキャラクター一覧取得
  private getInSightFieldCharacters(): Array<FieldCharacter> {
    const fieldCharacters: Array<FieldCharacter> = []
    for (let areaGridY = this.inSightArea.top; areaGridY <= this.inSightArea.bottom; ++areaGridY) {
      for (let areaGridX = this.inSightArea.left; areaGridX <= this.inSightArea.right; ++areaGridX) {
        const areaGridString = [areaGridX, areaGridY].toString()
        if (this.fieldCharactersByArea.has(areaGridString)) {
          Array.prototype.push.apply(fieldCharacters, this.fieldCharactersByArea.get(areaGridString)!)
        }
      }
    }
    return fieldCharacters
  }
  private updateInSightArea() {
    this.inSightArea.x = Math.max(0, -Math.floor(this.x / (AREA_DIVIDE_GRID_NUM * this.mapData.tilewidth)) - 2)
    this.inSightArea.y = Math.max(0, -Math.floor(this.y / (AREA_DIVIDE_GRID_NUM * this.mapData.tileheight)) - 2)
  }
  private isInSight(fieldCharacter: FieldCharacter): boolean {
    return fieldCharacter.areaGridX >= this.inSightArea.left && fieldCharacter.areaGridX <= this.inSightArea.right && fieldCharacter.areaGridY >= this.inSightArea.top && fieldCharacter.areaGridY <= this.inSightArea.bottom 
  }
  private updateCharacterVisibilityByMovedAreaOffset(movedAreaX: number, movedAreaY: number) {
    if (movedAreaX !== 0) {
      // 横方向で視界内になったキャラを表示
      {
        let startX = movedAreaX > 0 ? (this.inSightArea.right - movedAreaX) + 1 : this.inSightArea.left
        let endX = movedAreaX > 0 ? this.inSightArea.right : (this.inSightArea.left - movedAreaX) - 1
        for (let areaX = startX; areaX <= endX; ++areaX) {
          for (let areaY = this.inSightArea.top; areaY <= this.inSightArea.bottom; ++areaY) {
            const areaGridString = [areaX, areaY].toString()
            if (this.fieldCharactersByArea.has(areaGridString)) {
              this.fieldCharactersByArea.get(areaGridString)!.forEach(fieldCharacter => {
                if (!fieldCharacter.isAdded) {
                  fieldCharacter.character.onAddToField()
                  fieldCharacter.isAdded = true
                }
              })
            }
          }
        }
      }
      // 横方向で視界外になったキャラを非表示
      {
        console.log(`movedAreaX = ${movedAreaX}`)
        let startX = movedAreaX > 0 ? (this.inSightArea.left - movedAreaX) : this.inSightArea.right + 1
        let endX = movedAreaX > 0 ? this.inSightArea.left - 1 : (this.inSightArea.right - movedAreaX)
        console.log(`startX: ${startX}, endX: ${endX}`)
        for (let areaX = startX; areaX <= endX; ++areaX) {
          for (let areaY = this.inSightArea.top; areaY <= this.inSightArea.bottom; ++areaY) {
            const areaGridString = [areaX, areaY].toString()
            console.log(areaGridString)
            if (this.fieldCharactersByArea.has(areaGridString)) {
              this.fieldCharactersByArea.get(areaGridString)!.forEach(fieldCharacter => {
                if (fieldCharacter.isAdded) {
                  fieldCharacter.character.onRemoveFromField()
                  fieldCharacter.isAdded = false
                }
              })
            }
          }
        }
      }
    }
    if (movedAreaY !== 0) {
      // 縦方向で視界内になったキャラを表示
      {
        let startY = movedAreaY > 0 ? (this.inSightArea.bottom - movedAreaY) + 1 : this.inSightArea.top
        let endY = movedAreaY > 0 ? this.inSightArea.bottom : (this.inSightArea.top - movedAreaY) - 1
        for (let areaY = startY; areaY <= endY; ++areaY) {
          for (let areaX = this.inSightArea.left; areaX <= this.inSightArea.right; ++areaX) {
            const areaGridString = [areaX, areaY].toString()
            if (this.fieldCharactersByArea.has(areaGridString)) {
              this.fieldCharactersByArea.get(areaGridString)!.forEach(fieldCharacter => {
                if (!fieldCharacter.isAdded) {
                  fieldCharacter.character.onAddToField()
                  fieldCharacter.isAdded = true
                }
              })
            }
          }
        }
      }
      // 縦方向で視界外になったキャラを非表示
      {
        let startY = movedAreaY > 0 ? (this.inSightArea.top - movedAreaY) : this.inSightArea.bottom + 1
        let endY = movedAreaY > 0 ? this.inSightArea.top - 1 : (this.inSightArea.bottom - movedAreaY)
        for (let areaY = startY; areaY <= endY; ++areaY) {
          for (let areaX = this.inSightArea.left; areaX <= this.inSightArea.right; ++areaX) {
            const areaGridString = [areaX, areaY].toString()
            if (this.fieldCharactersByArea.has(areaGridString)) {
              this.fieldCharactersByArea.get(areaGridString)!.forEach(fieldCharacter => {
                if (fieldCharacter.isAdded) {
                  fieldCharacter.character.onRemoveFromField()
                  fieldCharacter.isAdded = false
                }
              })
            }
          }
        }
      }
    }
  }
}