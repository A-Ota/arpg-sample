import { onMounted, onUnmounted } from '@vue/composition-api'

export type InputManager = {
  endTurn: () => void;
  isPressing: (keyCode: number) => boolean;
  isPressed: (keyCode: number) => boolean;
  isReleased: (keyCode: number) => boolean;
  reset: () => void;
}

export default (): InputManager => {
  let lastPressedKeyCodeSet: Set<number> = new Set()
  const nowPressedKeyCodeSet: Set<number> = new Set()
  const onKeyDown = (e: KeyboardEvent) => {
    nowPressedKeyCodeSet.add(e.keyCode)
  }
  const onKeyUp = (e: KeyboardEvent) => {
    nowPressedKeyCodeSet.delete(e.keyCode)
  }
  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  })
  return {
    endTurn: () => {
      lastPressedKeyCodeSet = new Set(Array.from(nowPressedKeyCodeSet))
    },
    isPressing: (keyCode: number) => {
      return nowPressedKeyCodeSet.has(keyCode)
    },
    isPressed: (keyCode: number) => {
      return nowPressedKeyCodeSet.has(keyCode) && !lastPressedKeyCodeSet.has(keyCode)
    },
    isReleased: (keyCode: number) => {
      return !nowPressedKeyCodeSet.has(keyCode) && lastPressedKeyCodeSet.has(keyCode)
    },
    reset: () => {
      lastPressedKeyCodeSet.clear()
      nowPressedKeyCodeSet.clear()
    }
  }
}

/*
export default class InputManager {
  private lastPressedKeyCodeSet: Set<number> = new Set()
  private nowPressedKeyCodeSet: Set<number> = new Set()
  public onKeyDown(keyCode: number) {
    this.nowPressedKeyCodeSet.add(keyCode)
  }
  public onKeyUp(keyCode: number) {
    this.nowPressedKeyCodeSet.delete(keyCode)
  }
  public endTurn() {
    this.lastPressedKeyCodeSet = new Set(Array.from(this.nowPressedKeyCodeSet))
  }
  public isPressing(keyCode: number) {
    return this.nowPressedKeyCodeSet.has(keyCode)
  }
  public isPressed(keyCode: number) {
    return this.nowPressedKeyCodeSet.has(keyCode) && !this.lastPressedKeyCodeSet.has(keyCode)
  }
  public isReleased(keyCode: number) {
    return !this.nowPressedKeyCodeSet.has(keyCode) && this.lastPressedKeyCodeSet.has(keyCode)
  }
  public reset() {
    this.lastPressedKeyCodeSet.clear()
    this.nowPressedKeyCodeSet.clear()
  }
}
*/