<style scoped lang="scss">
.root {
  background-color: green;
}
</style>
<template>
  <div class="root">
    <canvas class="canvas" width="1280" height="720" ref="canvasRef"></canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { Easing, ease } from 'pixi-ease'
import * as PIXI from 'pixi.js'
import Stage from './Stage'

export default defineComponent({
  props: {
  },
  components: {
  },
  setup (props, context) {
    const canvasRef = ref()
    onMounted(() => {
      const app = new PIXI.Application({
        width: 1280,
        height: 720,
        view: canvasRef.value,
        transparent: true,
        autoStart: true
      })
      // pixi-layer周り
      app.stage = new PIXI.display.Stage()
      app.stage.sortableChildren = true
      const stage = new Stage()
      app.stage.addChild(stage)
    })
    return {
      canvasRef
    }
  }
})
</script>
