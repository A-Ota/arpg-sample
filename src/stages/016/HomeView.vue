<style scoped lang="scss">
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.particle {
  position: absolute;
  animation: rotation linear infinite 10s;
}
@for $i from 1 through 3 {
  .particle#{$i} {
    position: absolute;
    animation: rotation linear infinite 10s;
  }
}
$random-x: (random(200) - 100) * 1px;

@keyframes rotation {
  0% {
    transform: translateX($random-x) translateY(0px) rotateZ(0deg);
    opacity: 1;
  }
  100% {
    transform: translateX($random-x) translateY(-100px) rotateZ(1turn);
    opacity: 0;
  }
}
</style>
<template>
  <div class="root">
    <img class="particle1" src="/arpg-sample/images/game/01/bubble-r.png">
    <img class="particle2" src="/arpg-sample/images/game/01/bubble-r.png">
    <img class="particle3" src="/arpg-sample/images/game/01/bubble-r.png">
    <button @click="onClickTitle">タイトル</button>
  </div>
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
    const onClickTitle = async () => {
      await setStage016TransitionState(1)
      router.push('/stages/016/title')
    }
    onMounted(() => {
      setTimeout(() => {
        setStage016TransitionState(0)
      }, 2000)
    })
    return {
      onClickTitle
    }
  }
})
</script>