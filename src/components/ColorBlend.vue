<script setup>
import { ref, computed } from 'vue'
import ColorBand from './ColorBand.vue'
import ColorSlot from './ColorSlot.vue'
import ColorSwatch from './ColorSwatch.vue'
import chroma from 'chroma-js'

const begin = ref(null)
const end = ref(null)
const blend = computed(() =>
  chroma.valid(begin.value?.color) && chroma.valid(end.value?.color)
    ? chroma.scale([begin.value.color, end.value.color])
    : (x) => `hsl(0 0% ${x*100}%)`
)
const steps = ref(10)

function percentage(min, max, x) {
  return (x-min)/(max-min) || 0
}
</script>

<template>
  <div>
    <div class="full-row">
      <ColorSlot ref="begin"/>
      <p>Colors: <input type="number" v-model="steps"/></p>
      <ColorSlot ref="end"/>
    </div>
    <ColorBand :func="blend"/>
    <hr/>
    <span>
      <ColorSwatch v-if="steps > 0" v-for="step in steps"
        :color="blend(percentage(1, steps, step))"
      />
    </span>
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

