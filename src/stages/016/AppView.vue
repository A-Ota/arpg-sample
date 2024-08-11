<style lang="scss">
.root {
  position: relative;
  width: 400px;
  height: 400px;
  >.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
<template>
  <div class="root">
    <router-view/>
    <Overlay class="overlay" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import Overlay from './Overlay.vue';

export default defineComponent({
  props: {
  },
  components: {
    Overlay
  },
  setup (props: any, context: any) {
    onMounted(() => {
    })
    return {
    }
  }
})
</script>