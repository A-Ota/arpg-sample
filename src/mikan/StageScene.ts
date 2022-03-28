// TODO:みかん落下音
import * as PIXI from 'pixi.js'
import Sara from './Sara'
import { CRTFilter } from './filter/CRTFilter'
import { ReflectionFilter } from './filter/ReflectionFilter'
import Mikan from './Mikan'
import TitleScene from './TitleScene'
import { ease, Easing } from 'pixi-ease'
import { generateStageOptions, sleep } from './Util'
import { sound } from '@pixi/sound'
import Button from './Button'

const MAX_FRAME_COUNT =  60 * 40
const RECOVER_FRAME_COUNT = 60 * 5
export type FilterType = 'crt' | 'noise' | 'blur' | 'refrection' | 'spotlight'
const SCREEN_WIDTH = 1280
const SCREEN_HEIGHT = 720

const calcRecoverFrameCount = (stageNum: number) => {
  if (stageNum > 12) {
    return RECOVER_FRAME_COUNT * 1.5
  }
  return RECOVER_FRAME_COUNT
}

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
    this.addChild(PIXI.Sprite.from('/arpg-sample/images/mikan/gauge_bg.png'))
    const container = new PIXI.Container()
    container.addChild(PIXI.Sprite.from('/arpg-sample/images/mikan/gauge.png'))
    const containerRecover = new PIXI.Container()
    containerRecover.addChild(PIXI.Sprite.from('/arpg-sample/images/mikan/gauge_recover.png'))
    this.addChild(containerRecover)
    this.addChild(container)
    this.addChild(PIXI.Sprite.from('/arpg-sample/images/mikan/gauge_fg.png'))

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
    private clearAnimationCompleteCallback: () => void,
    private timeupDialogFinishedCallback: () => void,
    private shareCallback: () => void
  )
  {
    super()
    this.gauge = new Gauge()
    this.gauge.position.set(1080, 20)
    this.addChild(this.gauge)
  }
  set restTimeRate (value: number) {
    if (!this.animationLock) {
      value = Math.max(0, value)
      this.gauge.gaugeAngle = 360 * value
      this.gauge.refresh()
    }
  }
  set lv (value: number) {
    this.gauge.lv = value
  }
  showTimeupDialog (stageNum: number) {
    sound.play('finish')
    const timeup = PIXI.Sprite.from('/arpg-sample/images/mikan/timeup.png')
    timeup.anchor.set(0.5, 0.5)
    timeup.position.set(SCREEN_WIDTH / 2, 300 - 4)
    timeup.scale.set(0)
    ease.add(timeup, { scale: 1 }, { duration: 120, ease: 'easeOutQuad'})
    ease.add(timeup, { y: 300 + 4 }, { wait: 120, repeat: -1, reverse: true, duration: 800, ease: 'easeInOutQuad' })
    this.addChild(timeup)
    const finishButton = new Button('/arpg-sample/images/mikan/btn_finish.png')
    finishButton.x = 1100
    finishButton.y = 640
    this.addChild(finishButton)
    finishButton.clicked = this.timeupDialogFinishedCallback
    const shareButton = new Button('/arpg-sample/images/mikan/btn_share.png')
    shareButton.x = 170
    shareButton.y = 640
    this.addChild(shareButton)
    shareButton.clicked = this.shareCallback
  }
  showClearAnimation (stageNum: number) {
    const seikai = PIXI.Sprite.from('/arpg-sample/images/mikan/clear.png')
    seikai.anchor.set(0.5, 0.5)
    seikai.position.set(SCREEN_WIDTH / 2, 300 - 4)
    seikai.scale.set(0)
    ease.add(seikai, { scale: 1 }, { duration: 120, ease: 'easeOutQuad'})
    const animation = ease.add(seikai, { y: 300 + 4 }, { wait: 120, repeat: 1, reverse: true, duration: 800, ease: 'easeInOutQuad' })
    let step = 0
    const addAngle = (360 * (calcRecoverFrameCount(stageNum) / MAX_FRAME_COUNT)) / 80
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
    this.gauge.gaugeRecoverAngle = this.gauge.gaugeAngle + (360 * (calcRecoverFrameCount(stageNum) / MAX_FRAME_COUNT))
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
  public paused = false
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
    this.container.sortableChildren = true
    this.group = new PIXI.display.Group(0, true)
    const layer = new PIXI.display.Layer(this.group)
    this.container.addChild(layer)

    // 背景
    this.bg = PIXI.Sprite.from('/arpg-sample/images/mikan/dohyou.png')
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
      mikan.y = 150 + Math.random() * 350
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
    const sprite = PIXI.Sprite.from('/arpg-sample/images/mikan/spotlight.png')
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
    if (this.paused) {
      return
    }
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
  private gameOver = false
  constructor () {
    super()
    this.stageLayer = new StageLayer(this.onClear.bind(this))
    this.addChild(this.stageLayer)
    this.stageLayer.initialize()
    // stageLayer.addCrtFilter()
    this.uiLayer = new UiLayer(
      this.onClearAnimationComplete.bind(this),
      this.onTimeupDialogFinished.bind(this),
      this.onShare.bind(this)
    )
    this.addChild(this.uiLayer)
    const stageOptions = generateStageOptions(this.stageNum)
    console.dir(stageOptions)
    this.stageLayer.nextStage(stageOptions)
    PIXI.Ticker.shared.add(this.update, this)
  }
  update (delta: number) {
    this.stageLayer.update()
    if (this.gameOver) {
      return
    }
    if (!this.stopTimer) {
      this.restFrameCount -= delta
    }
    this.uiLayer.restTimeRate = (this.restFrameCount / MAX_FRAME_COUNT)
    if (this.restFrameCount <= 0) {
      this.uiLayer.showTimeupDialog(this.stageNum)
      this.stopTimer = true
      this.gameOver = true
      this.stageLayer.paused = true
    }
  }
  onTimeupDialogFinished() {
    PIXI.Ticker.shared.remove(this.update, this)
    ;(window as any).app.stage.removeChildren()
    ;(window as any).app.stage.addChild(new TitleScene())
  }
  onClear() {
    this.stageLayer.paused = true
    this.uiLayer.showClearAnimation(this.stageNum)
    this.stopTimer = true
    sound.play('clear')
  }
  onClearAnimationComplete() {
    this.stageLayer.paused = false
    ++this.stageNum
    // タイマー回復
    this.restFrameCount = Math.min(this.restFrameCount + calcRecoverFrameCount(this.stageNum), MAX_FRAME_COUNT)
    this.uiLayer.lv = this.stageNum + 1
    const stageOptions = generateStageOptions(this.stageNum)
    console.dir(stageOptions)
    this.stageLayer.nextStage(stageOptions)
    this.stopTimer = false
  }
  async onShare() {
    const app = (window as any).app as PIXI.Application
    this.uiLayer.children.forEach(child => {
      if (!(child instanceof Gauge)) {
        child.visible = false
      }
    })
    await sleep(20)

    const resizedCanvas = document.createElement("canvas") as HTMLCanvasElement
    const resizedContext = resizedCanvas.getContext("2d") as CanvasRenderingContext2D
    resizedCanvas.width = SCREEN_WIDTH / 2
    resizedCanvas.height = SCREEN_HEIGHT / 2
    resizedContext.drawImage(app.renderer.view, 0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)
    const data = {
      'base64Image': resizedCanvas.toDataURL()
    }

    await sleep(20)
    this.uiLayer.children.forEach(child => {
      child.visible = true
    })
    // const response = await fetch('http://127.0.0.1:3000/mikan/upload', {
    const response = await fetch('http://puyo.weakflour.net/mikan/upload', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const result = await response.json()
    window.open(`https://twitter.com/intent/tweet?text=みかん奉行HDでLV${this.stageNum + 1}まで到達しました。&url=http://puyo.weakflour.net/mikan/share?t=${result.timestamp}`)
  }
}