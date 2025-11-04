<style scoped lang="scss">
.message-window-root {
  border: 2px solid white;
  box-sizing: content-box;
  // 青系の斜めグラデーション背景で半透明
  background: linear-gradient(135deg, rgba(0, 0, 128, 0.8), rgba(0, 0, 255, 0.8));
  padding: 12px;
  border-radius: 16px;
  width: 480px;
  height: 24px * 3;
  display: flex;
  >.message {
    width: 100%;
    color: white;
    white-space: pre-wrap;
    font-size: 22px;
    line-height: 24px;
    &.fade-out {
      animation: fadeOut 0.2s forwards;
    }
  }
}
// フェードアウトアニメーション
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
<template>
  <transition name="fade">
    <div v-if="show" class="message-window-root">
      <div class="message" :class="{ 'fade-out': windowState === 'fade-out' }">{{ innerText }}</div>
    </div>
  </transition>
</template>
<script lang="ts">
import * as PIXI from "pixi.js"
import { defineComponent, onMounted, onUnmounted, reactive, ref, toRefs } from '@vue/composition-api'
import InputManager from '../014/InputManager';

type WindowState = 'play' | 'fast-forward' | 'wait' | 'fade-out'

interface StateType {
  show: boolean;
  innerText: string;
  windowState: WindowState;
}

export interface MessageInfo {
  text: string;
}

export default defineComponent({
  props: {
    messageInfos: {
      type: Array as () => MessageInfo[],
      required: true
    }
  },
  components: {
  },
  setup (props: any, context: any) {
    const inputManager = (window as any).inputManager as InputManager
    const state = reactive<StateType>({
      show: false,
      innerText: '',
      windowState: 'play'
    })
    let currentPage = 0
    const playNextMessageSub = () => {
      if (state.innerText.length < props.messageInfos[currentPage].text.length) {
        state.innerText += props.messageInfos[currentPage].text.charAt(state.innerText.length)
        setTimeout(playNextMessageSub, state.windowState === 'fast-forward' ? 16.667 : 16.667 * 3)
      } else {
        state.windowState = 'wait'
      }
    }
    const playNextMessage = () => {
      state.innerText = ''
      playNextMessageSub()
    }
    // ウィンドウクリックで次のメッセージに行く
    const onClickWindow = async () => {
      switch (state.windowState) {
        case 'play':
          state.windowState = 'fast-forward'
          break
        case 'fast-forward':
          break
        case 'wait':
          state.windowState = 'fade-out'
          currentPage++
          if (currentPage < props.messageInfos.length) {
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 240)
            })
            state.windowState = 'play'
            playNextMessage()
          } else {
            state.show = false
            await new Promise((resolve) => {
              setTimeout(() => {
                resolve(true)
              }, 200)
            })
            context.emit('complete')
          }
          break
      }
    }
    const update = () => {
      // GameAreaのupdateで先にinputManager.endTurn()しているのでここでキー入力が取れない。
      console.log('MessageWindow update')
      if (inputManager.isPressed(90)) {
        debugger
        onClickWindow()
      }
    }
    onMounted(async () => {
      addEventListener('update', update)
      state.show = true
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 200)
      })
      playNextMessage()
    })
    onUnmounted(() => {
      removeEventListener('update', update)
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
