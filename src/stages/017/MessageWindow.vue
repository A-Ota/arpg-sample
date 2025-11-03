<style scoped lang="scss">
.message-window-root {
  border: 2px solid black;
  background-color: white;
  padding: 8px;
  width: 400px;
  height: 100px;
}
</style>
<template>
  <div class="message-window-root" @click="onClickWindow">
    <div>{{ innerText }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from '@vue/composition-api'

type WindowState = 'play' | 'fast-forward' | 'wait'

interface StateType {
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
    const state = reactive<StateType>({
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
      state.windowState = 'play'
      playNextMessageSub()
    }
    onMounted(() => {
      playNextMessage()
    })
    // ウィンドウクリックで次のメッセージに行く
    const onClickWindow = () => {
      switch (state.windowState) {
        case 'play':
          state.windowState = 'fast-forward'
          break
        case 'fast-forward':
          break
        case 'wait':
          currentPage++
          if (currentPage < props.messageInfos.length) {
            playNextMessage()
          }
          break
      }
    }
    return {
      ...toRefs(state),
      onClickWindow
    }
  }
})
</script>
