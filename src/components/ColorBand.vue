<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  func: { type: Function, required: false, default: (x) => `hsl(0 0% ${x*100}%)` },
  steps: { type: Number, required: false, default: 1000 }
})
const { func, steps } = toRefs(props)

function percentage(min, max, x) {
  return (x-min)/(max-min) || 0
}
</script>

<template>
  <div class="band">
    <span class="strip" v-for="step in steps"
      :style="{
        'background-color': func(percentage(1, steps, step))
      }">
    </span>
  </div>
</template>

<style scoped>
.band {
  display: flex;
  width: 100%;
  height: 1.5rem;
}

.strip {
  flex-grow: 1;
}
</style>