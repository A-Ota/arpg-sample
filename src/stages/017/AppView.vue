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
    <GameArea />
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
import MessageWindow, { MessageInfo } from './MessageWindow.vue'
import GameArea from './GameArea.vue'

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
    const state = reactive<StateType>({
      messageInfos: null
    })
    onMounted(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000))
      state.messageInfos = [
        { text: 'これはメッセージウィンドウのサンプルです。\nクリックして次のメッセージに進みます。' },
        { text: 'Vue.jsのComposition APIを使って実装しています。\nスタイルも少し変更しました。' },
        { text: 'ゲーム画面の下部に表示されるようになっています。\nこれでメッセージウィンドウの完成です！' }
      ]
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>