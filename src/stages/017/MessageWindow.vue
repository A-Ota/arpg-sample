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

interface StateType {
  innerText: string;
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
      innerText: ''
    })
    let currentPage = 0
    onMounted(() => {
      const interval = setInterval(() => {
        if (state.innerText.length < props.messageInfos[currentPage].text.length) {
          state.innerText += props.messageInfos[currentPage].text.charAt(state.innerText.length)
        } else {
          if ((currentPage + 1) >= props.messageInfos.length) {
            // 最終ページ到達
            clearInterval(interval)
            return
          } else {
            // 次のページがある
            state.innerText = ''
            currentPage++
          }
        }
      }, 16.667 * 3)
    })
    // ウィンドウクリックで次のメッセージに行く
    const onClickWindow = () => {
      // TODO
    }
    return {
      ...toRefs(state),
      onClickWindow
    }
  }
})
</script>
