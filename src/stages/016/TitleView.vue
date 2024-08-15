<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
<template>
  <div class="root">タイトル<button @click="onClickStart">スタート</button></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import router from '@/router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { SET_STAGE_016_TRANSITION_STATE } from '@/store/stages/mutation-types';
const { useActions: useStagesActions } = createNamespacedHelpers('stages')


export default defineComponent({
  props: {
  },
  components: {
  },
  setup (props: any, context: any) {
    const { setStage016TransitionState } = useStagesActions([SET_STAGE_016_TRANSITION_STATE])
    onMounted(() => {
      setStage016TransitionState(0)
    })
    const onClickStart = async () => {
      await setStage016TransitionState(1)
      router.push('/stages/016/home')
    }
    return {
      onClickStart
    }
  }
})
</script>