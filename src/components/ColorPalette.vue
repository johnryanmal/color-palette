<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  colors: { type: Array, required: false, default: [] }
})

import ColorPicker from './ColorPicker.vue';

let _id = 0
function uid() {
  return _id++
}

const swatchmap = ref(new Map())
const swatches = ref([])
const colors = computed(() => swatches.value.map((swatch) => swatch.color))

for (const color of props.colors) {
  add(color)
}

function add(color) {
  const id = uid()
  swatchmap.value.set(id, color)
  return id
}

function remove(id) {
  return swatchmap.value.delete(id)
}

function onKeyDown(id, event) {
  if (event.code == 'Backspace') {
    const index = swatches.value.findIndex((swatch) => swatch?.$el == event.currentTarget)
    const last = swatches.value.length-1
    const focusIndex = index < last ? index+1 : index-1
    swatches.value[focusIndex]?.focus()

    remove(id)
  }
}

defineExpose({ colors, add })
</script>

<template>
  <ColorPicker ref="swatches" v-for="[id, color] in swatchmap" :key="id"
    :color="color"
    @keydown="onKeyDown(id, $event)"
  />
</template>