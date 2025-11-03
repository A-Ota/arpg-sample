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
      :messageInfos="[
        { text: 'This is Stage 017 View.vueですわよ' },
        { text: 'This is the second message.\nほげほげ\nふがふが' },
        { text: 'This is the third message.' }
      ]"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import MessageWindow from './MessageWindow.vue'
import GameArea from './GameArea.vue'

export default defineComponent({
  props: {
  },
  components: {
    GameArea,
    MessageWindow
  },
  setup (props: any, context: any) {
  }
})
</script>