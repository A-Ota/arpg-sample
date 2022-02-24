import * as PIXI from 'pixi.js'
import Sara from './Sara'
import { CRTFilter } from './filter/CRTFilter'
import { ReflectionFilter } from './filter/ReflectionFilter'
import Mikan from './Mikan'

export default class Stage extends PIXI.Container {
  private saraList: Array<Sara>  = []
  constructor () {
    super()
    this.initialize()
  }
  // 吸着する皿で一番近いものを返す
  getNearestSara (mikan: Mikan): Sara | null {
    for (let i = 0; i < this.saraList.length; ++i) {
      const distance = Math.sqrt(Math.pow(this.saraList[i].x - mikan.x, 2) + Math.pow(this.saraList[i].y - mikan.y, 2))
      if (distance < 100) {
        return this.saraList[i]
      }
    }
    return null
  }
  
  // 吸着する皿にアウトラインを表示する
  mikanMoved (mikan: Mikan): void {
    const nearestSara = this.getNearestSara(mikan)
    if (nearestSara != null && !nearestSara.showOutline) {
      nearestSara.showOutline = true
    }
    this.saraList.forEach(sara => {
      if (nearestSara !== sara) {
        sara.showOutline = false
      }
    })
  }

  // 吸着する皿に吸着させる
  mikanDropped (mikan: Mikan): void {
    const nearestSara = this.getNearestSara(mikan)
    if (nearestSara != null) {
      mikan.x = nearestSara.x
      mikan.y = nearestSara.y
    }
    this.saraList.forEach(sara => sara.showOutline = false)
  }

  initialize () {
    const group = new PIXI.display.Group(0, true)
    const layer = new PIXI.display.Layer(group)
    this.addChild(layer)

    // 背景
    const bg = PIXI.Sprite.from('/images/mikan/dohyou.png')
    bg.parentGroup = group
    bg.zIndex = 0
    this.addChild(bg)

    for (let i = 0; i < 1; ++i) {
      const mikan = new Mikan(group, Math.random() * 360, 0, 1, this.mikanMoved.bind(this), this.mikanDropped.bind(this))
      // mikan.x = Math.random() * 1280
      // mikan.y = Math.random() * 720
      mikan.x = 200
      mikan.y = 200
      mikan.updateZOrder()
      this.addChild(mikan)

      const sara = new Sara(group)
      sara.x = 200
      sara.y = 200
      this.addChild(sara)
      this.saraList.push(sara)
    }
    PIXI.Ticker.shared.add(this.update)

    /*
    const crtFilter = new CRTFilter({
      lineWidth: 3,
      noise: 0.3,
      noiseSize: 1.2
    })
    app.stage.filters = [crtFilter]
    app.ticker.add(() => {
      (crtFilter as any).seed = Math.random()
      ;(crtFilter as any).time += 0.5
    })
    */
    const reflectionFilter = new ReflectionFilter({
      mirror: false,
      boundary: 0
    })
    this.filters = [reflectionFilter]
    /*
    PIXI.Ticker.shared.add(() => {
      (reflectionFilter as any).time += 0.1
    })
    */
  }

  update () {
    if (this.filters != null) {
      this.filters.forEach(filter => {
        const b = filter instanceof ReflectionFilter
        console.log('a')
      })
    }
  }
}