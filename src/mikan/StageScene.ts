import * as PIXI from 'pixi.js'
import Sara from './Sara'
import { CRTFilter } from './filter/CRTFilter'
import { ReflectionFilter } from './filter/ReflectionFilter'
import Mikan from './Mikan'
import TitleScene from './TitleScene'
import { ease, Easing } from 'pixi-ease'
import { generateStageOptions } from './Util'
import { sound } from '@pixi/sound'

const MAX_FRAME_COUNT =  60 * 60
const RECOVER_FRAME_COUNT = 60 * 10
type FilterType = 'crt' | 'noise' | 'blur' | 'refrection' | 'spotlight'
const SCREEN_WIDTH = 1280
const SCREEN_HEIGHT = 720

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
  public gaugeAngle = 360
  public gaugeRecoverAngle = 0
  public lv = 1
  private gaugeMask!: PIXI.Graphics
  private gaugeRecoverMask!: PIXI.Graphics
  private lvNumText!: PIXI.Text
  constructor () {
    super()
    this.addChild(PIXI.Sprite.from('/images/mikan/gauge_bg.png'))
    const container = new PIXI.Container()
    container.addChild(PIXI.Sprite.from('/images/mikan/gauge.png'))
    const containerRecover = new PIXI.Container()
    containerRecover.addChild(PIXI.Sprite.from('/images/mikan/gauge_recover.png'))
    this.addChild(containerRecover)
    this.addChild(container)
    this.addChild(PIXI.Sprite.from('/images/mikan/gauge_fg.png'))

    // マスク
    this.gaugeMask = new PIXI.Graphics()
    container.addChild(this.gaugeMask)
    container.mask = this.gaugeMask
    // 回復表示用マスク
    this.gaugeRecoverMask = new PIXI.Graphics()
    containerRecover.addChild(this.gaugeRecoverMask)
    containerRecover.mask = this.gaugeRecoverMask

    const lvTitle = new PIXI.Text('LV', { fontSize: 30, fill : 0x444444, align : 'center'})
    lvTitle.anchor.set(0.5, 0.5)
    lvTitle.x = 90
    lvTitle.y = 54
    this.addChild(lvTitle)
    this.lvNumText = new PIXI.Text(this.lv.toString(), { fontSize: 60, fill : 0x444444, align : 'center'})
    this.lvNumText.anchor.set(0.5, 0.5)
    this.lvNumText.x = 90
    this.lvNumText.y = 100
    this.addChild(this.lvNumText)
  }
  public refresh() {
    this.gaugeMask.clear()
    this.gaugeMask
      .beginFill(0xff0000)
      .moveTo(90, 90)
      .arc(90, 90, 100, Math.PI / 180 * -90, Math.PI / 180 * (this.gaugeAngle - 90), false)
      .endFill()
    this.gaugeRecoverMask.clear()
    this.gaugeRecoverMask
      .beginFill(0xff0000)
      .moveTo(90, 90)
      .arc(90, 90, 100, Math.PI / 180 * -90, Math.PI / 180 * (this.gaugeRecoverAngle - 90), false)
      .endFill()
    this.lvNumText.text = this.lv.toString()
  }
}

class UiLayer extends PIXI.Container {
  private gauge!: Gauge
  private animationLock = false
  constructor (
    private clearAnimationCompleteCallback: () => void)
  {
    super()
    this.gauge = new Gauge()
    this.gauge.position.set(1080, 20)
    this.addChild(this.gauge)
  }
  set restTimeRate (value: number) {
    if (!this.animationLock) {
      this.gauge.gaugeAngle = 360 * value
      this.gauge.refresh()
    }
  }
  set lv (value: number) {
    this.gauge.lv = value
  }
  showClearAnimation () {
    const seikai = 
    PIXI.Sprite.from('/images/mikan/clear.png')
    seikai.anchor.set(0.5, 0.5)
    seikai.position.set(SCREEN_WIDTH / 2, 300 - 4)
    seikai.scale.set(0)
    ease.add(seikai, { scale: 1 }, { duration: 120, ease: 'easeOutQuad'})
    const animation = ease.add(seikai, { y: 300 + 4 }, { wait: 120, repeat: 1, reverse: true, duration: 800, ease: 'easeInOutQuad' })
    let step = 0
    const addAngle = (360 * (RECOVER_FRAME_COUNT / MAX_FRAME_COUNT)) / 80
    this.animationLock = true
    animation.on('each', (easing: Easing) => {
      // ゲージの回復アニメーション
      if (step < 80) {
        this.gauge.gaugeAngle += addAngle
        this.gauge.refresh()
        step++
      }
    })
    animation.once('complete', () => {
      this.animationLock = false
      seikai.parent.removeChild(seikai)
      this.clearAnimationCompleteCallback()
      this.gauge.gaugeRecoverAngle = 0
    })
    this.addChild(seikai)
    this.gauge.gaugeRecoverAngle = this.gauge.gaugeAngle + (360 * (RECOVER_FRAME_COUNT / MAX_FRAME_COUNT))
  }
}

class StageLayer extends PIXI.Container {
  private container!: PIXI.Container
  private frameCount = 0
  private saraList: Array<Sara>  = []
  private mikanList: Array<Mikan> = []
  private group!:  PIXI.display.Group
  private bg!: PIXI.Sprite
  private spotlightContainer: PIXI.Container | null = null
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
    this.container = new PIXI.Container()
    this.addChild(this.container)
    this.sortableChildren = true
    this.group = new PIXI.display.Group(0, true)
    const layer = new PIXI.display.Layer(this.group)
    this.container.addChild(layer)

    // 背景
    this.bg = PIXI.Sprite.from('/images/mikan/dohyou.png')
    this.bg.y = -520
    this.bg.parentGroup = this.group
    this.bg.zIndex = 0
    this.container.addChild(this.bg)
  }

  public nextStage(options: StageOptions) {
    this.saraList.forEach(sara => this.container.removeChild(sara))
    this.saraList.length = 0
    this.mikanList.forEach(mikan => this.container.removeChild(mikan))
    this.mikanList.length = 0
    const saraStartX = (SCREEN_WIDTH / 2) - ((options.mikanNum - 1) * 160) / 2

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
      this.container.addChild(mikan)
      this.mikanList.push(mikan)
      const sara = new Sara(this.group)
      sara.x = saraStartX + (160 * i)
      sara.y = 560
      this.container.addChild(sara)
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
          case 'spotlight':
            this.addSpotlightFilter()
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

  private addSpotlightFilter () {
    this.spotlightContainer = new PIXI.Container()
    const black = new PIXI.Graphics()
    black
      .beginFill(0x000000)
      .drawRect(-256 - 900, -256 - 300, 900, 512 + 600)
      .drawRect(256, -256 - 300, 900, 512 + 600)
      .drawRect(-256, -256 - 300, 512, 300)
      .drawRect(-256, 256, 512, 300)
      .endFill()
    this.spotlightContainer.addChild(black)
    const sprite = PIXI.Sprite.from('/images/mikan/spotlight.png')
    sprite.anchor.set(0.5, 0.5)
    this.spotlightContainer.addChild(sprite)
    this.spotlightContainer.x = (SCREEN_WIDTH / 2) - 430
    this.spotlightContainer.y = (SCREEN_HEIGHT / 2) - 140
    ease.add(this.spotlightContainer, { x: (SCREEN_WIDTH / 2) + 430 }, { repeat: -1, reverse: true, duration: 4000, ease: 'linear' })
    ease.add(this.spotlightContainer, { y: (SCREEN_HEIGHT / 2) + 140 }, { repeat: -1, reverse: true, duration: 900, ease: 'linear' })
    this.addChild(this.spotlightContainer)
  }

  private addFilter (filter: PIXI.Filter) {
    if (this.container.filters == null) {
      this.container.filters = []
    }
    this.container.filters.push(filter)
  }

  private clearFilters() {
    if (this.spotlightContainer != null) {
      this.removeChild(this.spotlightContainer)
      this.spotlightContainer = null
    }
    this.container.filters = []
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
      this.clearFilters()
    }
  }

  public update () {
    if (this.container.filters != null) {
      this.container.filters.forEach(filter => {
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
    sound.play('clear')
  }
  onClearAnimationComplete() {
    ++this.stageNum
    // タイマー回復
    this.restFrameCount = Math.min(this.restFrameCount + RECOVER_FRAME_COUNT, MAX_FRAME_COUNT)
    this.uiLayer.lv = this.stageNum + 1
    const stageOptions = generateStageOptions(this.stageNum)
    this.stageLayer.nextStage(stageOptions)
    this.stopTimer = false
  }
}