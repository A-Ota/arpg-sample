import * as PIXI from 'pixi.js'
import { ease } from 'pixi-ease'
import StageScene from './StageScene'
import Button from './Button'
import { TutorialModal } from './TutorialModal'
import { sound } from '@pixi/sound'

let resourcePreloaded = false

export default class Scene extends PIXI.Container {
  private group!:  PIXI.display.Group
  private bg!: PIXI.Sprite
  private fg!: PIXI.Sprite
  constructor () {
    super()
    this.initialize()
  }

  initialize () {
    sound.add('clear', '/arpg-sample/sounds/quiz1.wav')
    sound.add('set', '/arpg-sample/sounds/cursor_01.wav')
    sound.add('drop', '/arpg-sample/sounds/drop3.mp3')
    sound.add('finish', '/arpg-sample/sounds/finish.mp3')
    this.sortableChildren = true
    this.group = new PIXI.display.Group(0, true)
    const layer = new PIXI.display.Layer(this.group)
    this.addChild(layer)

    // 背景
    this.bg = PIXI.Sprite.from('/arpg-sample/images/mikan/dohyou.png')
    this.bg.parentGroup = this.group
    this.bg.zIndex = 0
    this.addChild(this.bg)

    // 背景
    this.fg = PIXI.Sprite.from('/arpg-sample/images/mikan/yane.png')
    this.fg.anchor.x = 0.5
    this.fg.x = 1280 / 2
    this.fg.parentGroup = this.group
    this.fg.zIndex = 100
    this.addChild(this.fg)
    this.startOpening()

    // 読み込み
    if (!resourcePreloaded) {
      PIXI.Loader.shared
        .add('/arpg-sample/images/mikan/mikan.png')
        .add('/arpg-sample/images/mikan/tutorial1.png')
        .add('/arpg-sample/images/mikan/tutorial2.png')
        .add('/arpg-sample/images/mikan/spotlight.png')
        .load(() => resourcePreloaded = true)
    }
  }

  private startOpening() {
    ease.add(this.bg, { y: -(1280 - 720) }, { duration: 9000, ease: 'linear' })
    ease.add(this.fg, { y: -(1280 - 500) }, { duration: 9000, ease: 'linear' })
    const titleA = PIXI.Sprite.from('/arpg-sample/images/mikan/title_a.png')
    titleA.position.set(50, 50)
    const titleB = PIXI.Sprite.from('/arpg-sample/images/mikan/title_b.png')
    titleB.position.set(1000, 124)
    this.addChild(titleA)
    this.addChild(titleB)
    const startButton = new Button('/arpg-sample/images/mikan/btn_start.png')
    startButton.x = 1280 / 2
    startButton.y = 450
    this.addChild(startButton)
    startButton.clicked = this.onTouchStart.bind(this)
    const howtoButton = new Button('/arpg-sample/images/mikan/btn_howto.png')
    howtoButton.x = 1280 / 2
    howtoButton.y = 600
    howtoButton.clicked = this.onTouchHowto.bind(this)
    this.addChild(howtoButton)
  }

  private onTouchStart() {
    (window as any).app.stage.removeChildren()
    ;(window as any).app.stage.addChild(new StageScene())
  }

  private onTouchHowto() {
    const tutorialModal = new TutorialModal()
    this.addChild(tutorialModal)
  }
}