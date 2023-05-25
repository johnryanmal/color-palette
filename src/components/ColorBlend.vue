<script setup>
import { ref } from 'vue'
import ColorBand from './ColorBand.vue'
import ColorSlot from './ColorSlot.vue'
import chroma from 'chroma-js'

const begin = ref(null)
const end = ref(null)
</script>

<template>
  <div>
    <ColorBand
      v-if="begin && end"
      v-bind="
        chroma.valid(begin.color) && chroma.valid(end.color)
          ? { func: chroma.scale([begin.color, end.color]) }
          : {}
      "
    />
    <div class="full-row">
      <ColorSlot ref="begin"/>
      <ColorSlot ref="end"/>
    </div>
  </div>
</template>

<style scoped>
.full-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
}
</style>

