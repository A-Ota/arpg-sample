import { Character } from '@/stages/010/Character'
import { SortableParticleContainer } from '@/stages/005/SortableParticleContainer'
import * as PIXI from "pixi.js"
import * as pixi_tilemap from '@/pixi-tilemap/index'

export class Field extends PIXI.Container {
  private bgLayerContainer!: PIXI.Container
  private debugLayerContainer!: PIXI.Container
  private horizontalGridNum = 80
  private verticalGridNum = 200
  private step = 0
  private tilemap!: pixi_tilemap.CompositeRectTileLayer
  constructor(private texture: PIXI.Texture) {
    super()
    this.sortableChildren = true
    pixi_tilemap.Constant.maxTextures = 1
    this.tilemap = new pixi_tilemap.CompositeRectTileLayer(0, [texture])
    // [points[5], points[17]] = [points[17], points[5]]とかで表示順は変更できる
    /*
    const fieldTexture1 = texture.clone()
    fieldTexture1.frame = new PIXI.Rectangle(0, 0, 32, 16)
    tilemap.addFrame(fieldTexture1, 32, 32)
    const fieldTexture2 = texture.clone()
    fieldTexture2.frame = new PIXI.Rectangle(0, 16, 32, 32)
    tilemap.addFrame(fieldTexture2, 48, 32)
    */
    // 地面
    for (let y = 0; y < this.verticalGridNum; ++y) {
      for (let x = 0; x < this.horizontalGridNum; ++x) {
        const fieldTexture = texture.clone()
        fieldTexture.frame = new PIXI.Rectangle(16 , 0, 16, 16)
        // fieldTexture.frame = new PIXI.Rectangle(16 * Math.floor(Math.random() * 16), 16 * Math.floor(Math.random() * 8), 16, 16)
        this.tilemap.addFrame(fieldTexture, x * 16, y * 16)
      }
    }
    this.addChild(this.tilemap)
    // アニメ
    const testTexture = texture.clone()
    testTexture.frame = new PIXI.Rectangle(0, 0, 16, 16)
    this.tilemap.addFrame(testTexture, 32, 32).tileAnimX(16, 100)

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
    return
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