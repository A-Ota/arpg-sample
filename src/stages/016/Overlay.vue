
<style lang="scss">
.transition-canvas-root {
  pointer-events: none;
}
</style>
<template>
  <canvas class="transition-canvas-root" ref="canvasRef" style="width: 100%; height: 100%;" />
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from '@vue/composition-api'
import * as PIXI from 'pixi.js'
import { TransitionObject, preloadAsync } from '@/stages/016/Overlay'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { STAGE_016_TRANSITION_STATE } from '@/store/stages/mutation-types'
const { useGetters: useStagesGetters } = createNamespacedHelpers('stages')

export default defineComponent({
  props: {
  },
  setup (props, context) {
    const { stage016TransitionState } = useStagesGetters([STAGE_016_TRANSITION_STATE])
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    let app: PIXI.Application | null = null
    let transition: TransitionObject | null = null
    let tmpDelta = 0
    const update = (delta: number) => {
      if (transition == null) {
        return
      }
      tmpDelta += delta
      if (tmpDelta >= 1) {
        tmpDelta = (tmpDelta - 1) % 1
        transition.update()
      }
    }
    onMounted(async () => {
      await preloadAsync()
      const canvas = canvasRef.value
      if (canvas == null || canvas.parentElement == null) {
        return
      }
      const rect = canvas.parentElement.getBoundingClientRect()
      app = new PIXI.Application({
        width: rect.width,
        height: rect.height,
        view: canvas,
        transparent: true
      })
      transition = new TransitionObject(app.renderer, rect.width, rect.height)
    })
    onUnmounted(() => {
      const ticker = PIXI.Ticker.shared
      if (update != null) {
        ticker.remove(update, this)
      }
      if (app != null) {
        app.renderer.gl.getExtension('WEBGL_lose_context')?.loseContext()
        app.destroy(true, {
          children: true
        })
      }
    })
    watch(() => [stage016TransitionState.value],
      ([newTransitionState]: Array<any>, [oldTransitionState]: Array<any>) => {
        console.log(newTransitionState)
        if (app == null || transition == null) {
          return
        }
        if (!oldTransitionState.state && newTransitionState.state) {
          app.stage.addChild(transition)
          PIXI.Ticker.shared.add(update)
          transition.start(newTransitionState.resolve)
        } else if (oldTransitionState.state && !newTransitionState.state) {
          transition.finish(() => {
            if (app == null || transition == null) {
              return
            }
            app.stage.removeChild(transition)
            PIXI.Ticker.shared.remove(update)
          })
        }
      }
    )
    return {
      canvasRef
    }
  }
})
</script>
