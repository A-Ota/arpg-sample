<style scoped lang="scss">
</style>
<template>
  <MessageWindow
    :messageInfos="[
      { text: 'This is Stage 017 View.vueですわよ' },
      { text: 'This is the second message.' },
      { text: 'This is the third message.' }
    ]"
  />
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import MessageWindow from './MessageWindow.vue';

export default defineComponent({
  props: {
  },
  components: {
    MessageWindow
  },
  setup (props: any, context: any) {
    return {
    }
  }
})
</script>
