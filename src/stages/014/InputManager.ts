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
}