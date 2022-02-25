import { OutlineFilter } from './filter/OutlineFilter'
import Mikan from './Mikan'

export default class Sara extends PIXI.Sprite {
  public mikan: Mikan | null = null
  constructor (group: PIXI.display.Group) {
    super(PIXI.Texture.from('/images/mikan/sara.png'))
    this.anchor.set(0.5, 0.5)
    this.parentGroup = group
  }
  set showOutline(value: boolean) {
    if (value) {
      this.filters = [new OutlineFilter(4, 0xF15A22, 1)]
    } else {
      this.filters = []
    }
  }
  get showOutline() {
    return this.filters != null && this.filters.length > 0
  }
}

