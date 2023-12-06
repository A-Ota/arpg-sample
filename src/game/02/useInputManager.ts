import { onMounted, onUnmounted } from '@vue/composition-api'

export type InputManager = {
  enterUpdate: () => void;
  leaveUpdate: () => void;
  isPressing: (keyCode: number) => boolean;
  isPressingGamepad: (buttonIndex: number) => boolean;
  isPressed: (keyCode: number) => boolean;
  isPressedGamepad: (buttonIndex: number) => boolean;
  isReleased: (keyCode: number) => boolean;
  isReleasedGamepad: (buttonIndex: number) => boolean;
  reset: () => void;
}

export default (): InputManager => {
  let gamepads: (Gamepad | null)[] = []
  let lastPressedKeyCodeSet: Set<number> = new Set()
  let lastPressedGamepadButtonSet: Set<number> = new Set()
  const nowPressedKeyCodeSet: Set<number> = new Set()
  const nowPressedGamepadButtonSet: Set<number> = new Set()
  const onKeyDown = (e: KeyboardEvent) => {
    nowPressedKeyCodeSet.add(e.keyCode)
  }
  const onKeyUp = (e: KeyboardEvent) => {
    nowPressedKeyCodeSet.delete(e.keyCode)
  }
  const onGamepadConnected = (e: GamepadEvent) => {
    gamepads = navigator.getGamepads()
  }
  onMounted(() => {
    gamepads = navigator.getGamepads()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener("gamepadconnected", onGamepadConnected)
  });
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener("gamepadconnected", onGamepadConnected)
  })
  return {
    enterUpdate: () => {
      // ゲームパッドの状態を更新
      const gamepad = navigator.getGamepads()[0]
      if (gamepad == null) {
        return
      }
      for (let i = 0; i < gamepad.buttons.length; i++) {
        if (gamepad.buttons[i].pressed) {
          nowPressedGamepadButtonSet.add(i)
        } else {
          nowPressedGamepadButtonSet.delete(i)
        }
      }
    },
    leaveUpdate: () => {
      lastPressedKeyCodeSet = new Set(Array.from(nowPressedKeyCodeSet))
      lastPressedGamepadButtonSet = new Set(Array.from(nowPressedGamepadButtonSet))
    },
    isPressing: (keyCode: number) => {
      return nowPressedKeyCodeSet.has(keyCode)
    },
    isPressingGamepad: (buttonIndex: number) => {
      return nowPressedGamepadButtonSet.has(buttonIndex)
    },
    isPressed: (keyCode: number) => {
      return nowPressedKeyCodeSet.has(keyCode) && !lastPressedKeyCodeSet.has(keyCode)
    },
    isPressedGamepad: (buttonIndex: number) => {
      return nowPressedGamepadButtonSet.has(buttonIndex) && !lastPressedGamepadButtonSet.has(buttonIndex)
    },
    isReleased: (keyCode: number) => {
      return !nowPressedKeyCodeSet.has(keyCode) && lastPressedKeyCodeSet.has(keyCode)
    },
    isReleasedGamepad: (buttonIndex: number) => {
      return !nowPressedGamepadButtonSet.has(buttonIndex) && lastPressedGamepadButtonSet.has(buttonIndex)
    },
    reset: () => {
      lastPressedKeyCodeSet.clear()
      nowPressedKeyCodeSet.clear()
      nowPressedGamepadButtonSet.clear()
    }
  }
}
