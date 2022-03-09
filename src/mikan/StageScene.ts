import * as PIXI from 'pixi.js'
import Sara from './Sara'
import { CRTFilter } from './filter/CRTFilter'
import { ReflectionFilter } from './filter/ReflectionFilter'
import Mikan from './Mikan'
import TitleScene from './TitleScene'
import { ease } from 'pixi-ease'
import { generateStageOptions } from './Util'
import { sound } from '@pixi/sound'

const MAX_FRAME_COUNT =  60 * 60
type FilterType = 'crt' | 'noise' | 'blur' | 'refrection'

export type StageOptions = {
  mikanNum: number;
  startH?: number;
  endH?: number;
  startS?: number;
  endS?: number;
  startB?: number;
  endB?: number;
  filterTypes?: Array<FilterType>;
}

class Gauge extends PIXI.Container {
  private gaugeAngle_ = 360
  set gaugeAngle(value: number) {
    this.gaugeAngle_ = value
    this.refresh()
  }
  public lv = 1
  private gaugeMask!: PIXI.Graphics
  constructor () {
    super()
    this.addChild(PIXI.Sprite.from('/images/mikan/gauge_bg.png'))
    const container = new PIXI.Container()
    container.addChild(PIXI.Sprite.from('/images/mikan/gauge.png'))
    this.addChild(container)
    this.addChild(PIXI.Sprite.from('/images/mikan/gauge_fg.png'))

    // マスク
    this.gaugeMask = new PIXI.Graphics()
    container.addChild(this.gaugeMask)
    container.mask = this.gaugeMask

    const lvTitle = new PIXI.Text('LV', { fontSize: 30, fill : 0x444444, align : 'center'})
    lvTitle.anchor.set(0.5, 0.5)
    lvTitle.x = 90
    lvTitle.y = 54
    this.addChild(lvTitle)
    const lvNum = new PIXI.Text(this.lv.toString(), { fontSize: 60, fill : 0x444444, align : 'center'})
    lvNum.anchor.set(0.5, 0.5)
    lvNum.x = 90
    lvNum.y = 100
    this.addChild(lvNum)
  }
  private refresh() {
    this.gaugeMask.clear()
    this.gaugeMask
      .beginFill(0xff0000)
      .moveTo(90, 90)
      .arc(90, 90, 100, Math.PI / 180 * -90, Math.PI / 180 * (this.gaugeAngle_ - 90), false)
      .endFill()
  }
}

class UiLayer extends PIXI.Container {
  private gauge!: Gauge
  constructor (
    private clearAnimationCompleteCallback: () => void)
  {
    super()
    this.gauge = new Gauge()
    this.gauge.position.set(1080, 20)
    this.addChild(this.gauge)
  }
  set restTimeRate (value: number) {
    this.gauge.gaugeAngle = 360 * value
  }
  showClearAnimation () {
    const seikai = 
    PIXI.Sprite.from('/images/mikan/clear.png')
    seikai.anchor.set(0.5, 0.5)
    seikai.position.set(1280 / 2, 300 - 4)
    seikai.scale.set(0)
    ease.add(seikai, { scale: 1 }, { duration: 120, ease: 'easeOutQuad'})
    const animation = ease.add(seikai, { y: 300 + 4 }, { wait: 120, repeat: 2, reverse: true, duration: 800, ease: 'easeInOutQuad' })
    animation.once('complete', () => {
      seikai.parent.removeChild(seikai)
      this.clearAnimationCompleteCallback()
    })
    this.addChild(seikai)
  }
}

class StageLayer extends PIXI.Container {
  private frameCount = 0
  private saraList: Array<Sara>  = []
  private mikanList: Array<Mikan> = []
  private group!:  PIXI.display.Group
  private bg!: PIXI.Sprite
  constructor (
    private clearCallback: () => void
  ) {
    super()
  }
  // 吸着する皿で一番近いものを返す
  getNearestSara (mikan: Mikan): Sara | null {
    for (let i = 0; i < this.saraList.length; ++i) {
      const distance = Math.sqrt(Math.pow(this.saraList[i].x - mikan.x, 2) + Math.pow(this.saraList[i].y - mikan.y, 2))
      if (distance < 100) {
        const sara = this.saraList[i]
        if (sara.mikan === null) {
          return sara
        }
      }
    }
    return null
  }

  // 吸着する皿にアウトラインを表示する
  mikanMoved (mikan: Mikan): void {
    const nearestSara = this.getNearestSara(mikan)
    this.saraList.forEach(sara => {
      if (nearestSara !== sara) {
        sara.showOutline = false
      }
      // 移動中のみかんは一旦皿に乗っている扱いからは外す
      if (sara.mikan === mikan) {
        sara.mikan = null
      }
    })
    if (nearestSara != null && !nearestSara.showOutline) {
      nearestSara.showOutline = true
    }
  }

  // 吸着する皿に吸着させる
  mikanDropped (mikan: Mikan): void {
    const nearestSara = this.getNearestSara(mikan)
    if (nearestSara != null) {
      mikan.x = nearestSara.x
      mikan.y = nearestSara.y
      nearestSara.mikan = mikan
      sound.play('set')
    }
    this.saraList.forEach(sara => sara.showOutline = false)
    this.checkClear()
  }

  initialize () {
    this.sortableChildren = true
    this.group = new PIXI.display.Group(0, true)
    const layer = new PIXI.display.Layer(this.group)
    this.addChild(layer)

    // 背景
    this.bg = PIXI.Sprite.from('/images/mikan/dohyou.png')
    this.bg.y = -520
    this.bg.parentGroup = this.group
    this.bg.zIndex = 0
    this.addChild(this.bg)
  }

  public nextStage(options: StageOptions) {
    this.saraList.forEach(sara => this.removeChild(sara))
    this.saraList.length = 0
    this.mikanList.forEach(mikan => this.removeChild(mikan))
    this.mikanList.length = 0
    this.filters = []
    const saraStartX = (1280 / 2) - ((options.mikanNum - 1) * 160) / 2

    for (let i = 0; i < options.mikanNum; ++i) {
      let h = 0
      if (options.startH != null && options.endH != null) {
        h = options.startH + (options.endH - options.startH) * (i / (options.mikanNum - 1))
      }
      let s = 0
      if (options.startS != null && options.endS != null) {
        s = options.startS + (options.endS - options.startS) * (i / (options.mikanNum - 1))
      }
      let b = 1
      if (options.startB != null && options.endB != null) {
        b = options.startB + (options.endB - options.startB) * (i / (options.mikanNum - 1))
      }
      const mikan = new Mikan(this.group, i, h, s, b, this.mikanMoved.bind(this), this.mikanDropped.bind(this))
      mikan.x = 240 + Math.random() * 800
      mikan.y = 100 + Math.random() * 400
      mikan.updateZOrder()
      this.addChild(mikan)
      this.mikanList.push(mikan)
      const sara = new Sara(this.group)
      sara.x = saraStartX + (160 * i)
      sara.y = 560
      this.addChild(sara)
      this.saraList.push(sara)
    }
    if (options.filterTypes != null) {
      options.filterTypes.forEach(filterType => {
        switch (filterType) {
          case 'crt':
            this.addCrtFilter()
            break;
          case 'blur':
            this.addBlurFilter()
            break;
          case 'noise':
            this.addNoiseFilter()
            break;
          case 'refrection':
            this.addReflectionFilter()
            break;
        }
      })
    }
  }

  public addReflectionFilter () {
    const reflectionFilter = new ReflectionFilter({
      mirror: false,
      boundary: 0
    })
    this.addFilter(reflectionFilter)
  }

  public addCrtFilter () {
    const crtFilter = new CRTFilter({
      lineWidth: 3,
      noise: 0.3,
      noiseSize: 1.2
    })
    this.addFilter(crtFilter)
  }

  public addBlurFilter () {
    this.addFilter(new PIXI.filters.BlurFilter(4, 2))
  }

  public addNoiseFilter () {
    this.addFilter(new PIXI.filters.NoiseFilter(1.5))
  }

  private addFilter (filter: PIXI.Filter) {
    if (this.filters == null) {
      this.filters = []
    }
    this.filters.push(filter)
  }

  private checkClear () {
    // 全ての皿にみかんが乗っている必要がある
    if (!this.saraList.every(sara => sara.mikan != null)) {
      return
    }
    // 昇順か降順で並んでいる必要がある
    let ascOrderCheck = true
    let dscOrderCheck = true
    for (let i = 0, j = this.saraList.length - 1; i < this.saraList.length; ++i, --j) {
      if (this.saraList[i].mikan!.index !== i) {
        ascOrderCheck = false
      }
      if (this.saraList[i].mikan!.index !== j) {
        dscOrderCheck = false
      }
    }
    if (ascOrderCheck || dscOrderCheck) {
      this.clearCallback()
    }
  }

  public update () {
    if (this.filters != null) {
      this.filters.forEach(filter => {
        if (filter instanceof ReflectionFilter) {
          (filter as any).time += 0.1
        } else if (filter instanceof CRTFilter) {
          (filter as any).seed = Math.random()
          ;(filter as any).time += 0.5
        } else if (filter instanceof PIXI.filters.NoiseFilter) {
          (filter as any).seed = Math.random()
        } else if (filter instanceof PIXI.filters.BlurFilter) {
          if (this.frameCount % 240 < 120) {
            (filter as any).blurXFilter.strength += 0.06
            ;(filter as any).blurYFilter.strength += 0.06
          } else {
            (filter as any).blurXFilter.strength -= 0.06
            ;(filter as any).blurYFilter.strength -= 0.06
          }
        }
      })
    }
    ++this.frameCount
  }
}

export default class Scene extends PIXI.Container {
  private stageNum = 0
  private stageLayer!: StageLayer
  private uiLayer!: UiLayer
  private restFrameCount = MAX_FRAME_COUNT
  private stopTimer = false
  constructor () {
    super()
    this.stageLayer = new StageLayer(this.onClear.bind(this))
    this.addChild(this.stageLayer)
    this.stageLayer.initialize()
    // stageLayer.addCrtFilter()
    this.uiLayer = new UiLayer(this.onClearAnimationComplete.bind(this))
    this.addChild(this.uiLayer)
    const stageOptions = generateStageOptions(this.stageNum)
    this.stageLayer.nextStage(stageOptions)
    PIXI.Ticker.shared.add(this.update, this)
    sound.add('clear', '/sounds/quiz1.wav')
    sound.add('set', '/sounds/cursor_01.wav')
    // sound.add('set', '/sounds/pi73.wav')
  }
  update (delta: number) {
    this.stageLayer.update()
    if (!this.stopTimer) {
      this.restFrameCount -= delta
    }
    this.uiLayer.restTimeRate = (this.restFrameCount / MAX_FRAME_COUNT)
    if (this.restFrameCount <= 0) {
      PIXI.Ticker.shared.remove(this.update, this)
      ;(window as any).app.stage.removeChildren()
      ;(window as any).app.stage.addChild(new TitleScene())
    }
  }
  onClear() {
    this.uiLayer.showClearAnimation()
    this.stopTimer = true
    // タイマー回復
    this.restFrameCount = Math.min(this.restFrameCount + 60 * 5, MAX_FRAME_COUNT)
    sound.play('clear')
  }
  onClearAnimationComplete() {
    ++this.stageNum
    const stageOptions = generateStageOptions(this.stageNum)
    this.stageLayer.nextStage(stageOptions)
    this.stopTimer = false
  }
}