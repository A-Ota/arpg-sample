<style lang="scss">
.app-root {
  position: relative;
  width: 640px;
  height: 480px;
  >.message-window {
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
    margin: auto;
  }
}
</style>
<template>
  <div class="app-root">
    <GameArea @onEvent="handleEvent" />
    <MessageWindow
      class="message-window"
      v-if="messageInfos != null"
      :messageInfos="messageInfos"
      @complete="messageInfos = null"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from '@vue/composition-api'
import * as PIXI from "pixi.js"
import MessageWindow, { MessageInfo } from './MessageWindow.vue'
import GameArea from './GameArea.vue'
import { Event } from './Util'
import InputManager from '../014/InputManager';

interface StateType {
  messageInfos: MessageInfo[] | null;
} 

export default defineComponent({
  props: {
  },
  components: {
    GameArea,
    MessageWindow
  },
  setup (props: any, context: any) {
    PIXI.Ticker.shared.maxFPS = 60
    PIXI.Ticker.shared.minFPS = 60
    // キー入力管理
    const inputManager = (window as any).inputManager = new InputManager()
    const onKeyDown = (event: KeyboardEvent) => {
      inputManager.onKeyDown(event.keyCode)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      inputManager.onKeyUp(event.keyCode)
    }
    window.onkeydown = onKeyDown
    window.onkeyup = onKeyUp
    // state
    const state = reactive<StateType>({
      messageInfos: null
    })
    onMounted(() => {
      const updateEvent = new CustomEvent('update')
      PIXI.Ticker.shared.add(() => {
        dispatchEvent(updateEvent)
        inputManager.endTurn()
      })
    })
    const handleEvent = (event: Event) => {
      if (event.type === 'message') {
        state.messageInfos = event.messages.map((text: string) => ({ text }))
      }
    }
    return {
      ...toRefs(state),
      handleEvent
    }
  }
})
</script>