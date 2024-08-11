import * as PIXI from 'pixi.js'

const BG_IMAGE_PATH = '/arpg-sample/images/stages/016/transition_bg.png'

export const preloadAsync = (): Promise<void> => {
  const loader = PIXI.Loader.shared
  loader.add(BG_IMAGE_PATH)
  return new Promise((resolve) => {
    loader.load(() => resolve())
  })
}

// スクロールする背景
class ScrollingTilingSprite extends PIXI.TilingSprite {
  private offset = 0
  constructor (texture: PIXI.Texture, _width: number, _height: number) {
    super(texture, _width + texture.width, _height + texture.height)
  }

  update () {
    this.x = -this.offset
    this.y = this.offset - this.texture.height
    this.offset += 0.5
    if (this.offset >= this.texture.width) {
      this.offset = 0
    }
  }
}

export type TransitionMode = 'spotlight' | 'pataPata'

// アニメーションするマスク
class AnimationMask extends PIXI.Sprite {
  public _graphics = new PIXI.Graphics()
  private _strategy!: AnimationMaskStrategy
  set forward (forward: boolean) {
    this._strategy.forward = forward
  }

  get finished (): boolean {
    return this._strategy.finished
  }

  set transitionMode (mode: TransitionMode) {
    switch (mode) {
      case 'spotlight':
        this._strategy = new AnimationMaskStrategySpotlight(this)
        break
      case 'pataPata':
        this._strategy = new AnimationMaskStrategyPataPata(this)
        break
    }
  }

  constructor (public _renderer: PIXI.Renderer, public _w: number, public _h: number) {
    super(PIXI.RenderTexture.create({ width: _w, height: _h }))
  }

  update () {
    this._strategy.update()
  }
}

// アニメーションマスクの実処理を委譲する際のインターフェース
abstract class AnimationMaskStrategy {
  constructor (protected _parent: AnimationMask) {}
  abstract update (): void
  abstract set forward (forward: boolean)
  abstract get finished (): boolean
}

// スポットライト風マスク
class AnimationMaskStrategySpotlight extends AnimationMaskStrategy {
  private _forward = true
  set forward (forward: boolean) {
    if (forward) {
      this._circleScale = 2.0
      this._forward = true
    } else {
      this._circleScale = 0
      this._forward = false
    }
  }

  get finished (): boolean {
    if (this._forward) {
      return this._circleScale <= 0
    } else {
      return this._circleScale >= 2.0
    }
  }

  private _circleScale = 2.0
  constructor (parent: AnimationMask) {
    super(parent)
  }

  update (): void {
    if (this._forward) {
      this._circleScale -= 0.05
      if (this._circleScale <= 0) {
        this._circleScale = 0
      }
    } else {
      this._circleScale += 0.05
      if (this._circleScale >= 2.0) {
        this._circleScale = 2.0
      }
    }
    this.reflesh()
  }

  reflesh () {
    this._parent._graphics.clear()
    // 白がマスクされない領域
    this._parent._graphics.beginFill(0xFFFFFF)
    this._parent._graphics.drawRect(0, 0, this._parent._w, this._parent._h)
    this._parent._graphics.endFill()
    // 黒がマスクされる(裏側の画像が見える)領域
    this._parent._graphics.beginFill(0x000000)
    this._parent._graphics.drawCircle(this._parent._w / 2, this._parent._h / 2, this._parent._w * this._circleScale)
    this._parent._graphics.endFill()
    this._parent._renderer.render(this._parent._graphics, (this._parent.texture as PIXI.RenderTexture))
  }
}

// パタパタマスク
class AnimationMaskStrategyPataPata extends AnimationMaskStrategy {
  private _forward = true
  private _step = 0

  set forward (forward: boolean) {
    this._step = 0
    this._forward = forward
  }

  get finished (): boolean {
    return this._step >= 7
  }

  constructor (parent: AnimationMask) {
    super(parent)
  }

  update (): void {
    this._step += 0.2
    this.reflesh()
  }

  reflesh () {
    this._parent._graphics.clear()
    // 黒がマスクされない領域
    this._parent._graphics.beginFill(this._forward ? 0x000000 : 0xFFFFFF)
    this._parent._graphics.drawRect(0, 0, this._parent._w, this._parent._h)
    this._parent._graphics.endFill()
    // 白がマスクされる(裏側の画像が見える)領域
    this._parent._graphics.beginFill(this._forward ? 0xFFFFFF : 0x000000)
    if (this._step >= 1) {
      this._parent._graphics.drawRect(320, 0, 320, 240)
    }
    if (this._step >= 2) {
      this._parent._graphics.drawRect(0, 0, 320, 240)
      this._parent._graphics.drawRect(320, 240, 320, 240)
    }
    if (this._step >= 3) {
      this._parent._graphics.drawRect(0, 240, 320, 240)
      this._parent._graphics.drawRect(320, 240 * 2, 320, 240)
    }
    if (this._step >= 4) {
      this._parent._graphics.drawRect(0, 240 * 2, 320, 240)
      this._parent._graphics.drawRect(320, 240 * 3, 320, 240)
    }
    if (this._step >= 5) {
      this._parent._graphics.drawRect(0, 240 * 3, 320 * 3, 240)
      this._parent._graphics.drawRect(320, 240 * 4, 320, 240)
    }
    if (this._step >= 6) {
      this._parent._graphics.drawRect(0, 240 * 4, 320 * 3, 240)
      this._parent._graphics.drawRect(320, 240 * 5, 320, 240)
    }
    if (this._step >= 7) {
      this._parent._graphics.drawRect(0, 240 * 5, 320 * 3, 240)
      this._parent._graphics.drawRect(320, 240 * 6, 320, 240)
    }
    this._parent._graphics.endFill()
    this._parent._renderer.render(this._parent._graphics, (this._parent.texture as PIXI.RenderTexture))
  }
}

type TransitionStep = 'waiting' | 'starting' | 'started' | 'finishing' | 'finished'

export class TransitionObject extends PIXI.Container {
  private step: TransitionStep = 'waiting'
  private finished = false
  private tilingSprite!: ScrollingTilingSprite
  private _animationMask!: AnimationMask
  private finishCallback: () => void = () => {}
  constructor (private renderer: PIXI.Renderer, private w: number, private h: number) {
    super()
    const texture = PIXI.Texture.from(BG_IMAGE_PATH)
    // 自動スクロールするタイリングされた背景
    this.tilingSprite = new ScrollingTilingSprite(texture, w, h)
    this.addChild(this.tilingSprite)
    this.mask = this._animationMask = new AnimationMask(renderer, w, h)
  }

  public start (): void {
    this.finished = false
    this.step = 'starting'
    const rand = Math.floor(Math.random() * 2)
    this._animationMask.transitionMode = (rand === 0 ? 'spotlight' : 'pataPata')
    this._animationMask.forward = true
  }

  public finish (callback: () => void): void {
    this.finished = true
    this.finishCallback = callback
  }

  update (): void {
    if (this.step === 'starting') {
      if (this._animationMask.finished) {
        this.step = 'started'
      }
    } else if (this.step === 'started') {
      if (this.finished) {
        this.step = 'finishing'
        this._animationMask.forward = false
      }
    } else if (this.step === 'finishing') {
      if (this._animationMask.finished) {
        this.step = 'finished'
      }
    } else if (this.step === 'finished') {
      // 完了
      this.finishCallback()
      this.step = 'waiting'
    }
    // マスクをアニメーション
    this._animationMask.update()
    // 背景画像を動かす
    this.tilingSprite.update()
  }
}
