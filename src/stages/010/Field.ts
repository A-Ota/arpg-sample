import { Character } from '@/stages/010/Character'
import { SortableParticleContainer } from '@/stages/005/SortableParticleContainer'
import * as PIXI from "pixi.js"
import { pixi_tilemap } from '@/index'

export class Field extends PIXI.Container {
  private bgLayerContainer!: PIXI.Container
  private debugLayerContainer!: PIXI.Container
  private horizontalGridNum = 500
  private verticalGridNum = 500
  private step = 0
  constructor(private texture: PIXI.Texture) {
    super()
    this.sortableChildren = true
    console.log(pixi_tilemap)
    pixi_tilemap.Constant.maxTextures = 4;
    const fieldTexture = texture.clone()
    fieldTexture.frame = new PIXI.Rectangle(0, 0, 16, 16)
    var tilemap = new pixi_tilemap.CompositeRectTileLayer(0, [texture]);
    // tilemap.addChild(PIXI.Sprite.from(texture))
    // 地面
    for (let y = 0; y < this.verticalGridNum; ++y) {
      for (let x = 0; x < this.horizontalGridNum; ++x) {
        const fieldTexture = texture.clone()
        fieldTexture.frame = new PIXI.Rectangle(16 * Math.floor(Math.random() * 16), 16 * Math.floor(Math.random() * 8), 16, 16)
        tilemap.addFrame(fieldTexture, x * 16, y * 16)
      }
    }
    this.addChild(tilemap)

    /*
    this.bgLayerContainer = new PIXI.ParticleContainer(20000, { uvs: false })
    // this.bgLayerContainer = new PIXI.Container()
    this.debugLayerContainer = new PIXI.Container()
    this.debugLayerContainer.visible = false
    this.addChild(this.bgLayerContainer)
    this.addChild(this.debugLayerContainer)
    // 地面
    for (let y = 0; y < this.verticalGridNum; ++y) {
      for (let x = 0; x < this.horizontalGridNum; ++x) {
        const fieldTexture = texture.clone()
        fieldTexture.frame = new PIXI.Rectangle(16 * Math.floor(Math.random() * 16), 16 * Math.floor(Math.random() * 8), 16, 16)
        const fieldSprite = PIXI.Sprite.from(fieldTexture)
        fieldSprite.position = new PIXI.Point(x * 16, y * 16)
        this.bgLayerContainer.addChild(fieldSprite)
      }
    }
    */
    this.on('added', () => {
      // 親に追加されたときになにかやるならここで
    })
  }
  public update() {
    switch(this.step) {
      case 0:
        this.x -= 1
        if (this.x <= - (16 * this.horizontalGridNum - 640)) {
          this.step = 1
        }
        break;
      case 1:
        this.y -= 1
        if (this.y <= - (16 * this.verticalGridNum - 480)) {
          this.step = 2
        }
        break;
      case 2:
        this.x += 1
        if (this.x >= 0) {
          this.step = 3
        }
        break;
      case 3:
        this.y += 1
        if (this.y >= 0) {
          this.step = 0
        }
        break;
    }
  }
}