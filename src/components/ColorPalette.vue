<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  colors: { type: Array, required: false, default: [] }
})

import ColorInput from './ColorInput.vue';
import NewSwatch from './NewSwatch.vue';

let _id = 0
function uid() {
  return _id++
}

const swatchmap = ref(new Map())
const swatches = ref([])
const newswatch = ref(null)
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
  const selectable = [...swatches.value, newswatch.value]
  const index = selectable.findIndex((swatch) => swatch?.$el === event.currentTarget)
  const last = selectable.length-1

  let prevleft = -Infinity
  let columns = 0
  for (const swatch of selectable) {
    const left = swatch.$el.getBoundingClientRect().left
    if (prevleft < left) {
      columns += 1
      prevleft = left
    } else {
      break
    }
  }

  switch (event.code) {
    case 'Backspace': {
      if (index !== last) {
        const focusIndex = index < last-1 ? index+1 : index-1
        selectable[focusIndex]?.focus()
        remove(id)
      }
      break
    }
    case 'ArrowLeft': {
      const focusIndex = index > 0 ? index-1 : index
      selectable[focusIndex]?.focus()
      break
    }
    case 'ArrowRight': {
      const focusIndex = index < last ? index+1 : index
      selectable[focusIndex]?.focus()
      break
    }
    case 'ArrowUp': {
      const focusIndex = index >= columns ? index-columns : index
      selectable[focusIndex]?.focus()
      break
    }
    case 'ArrowDown': {
      const focusIndex = index <= last-columns ? index+columns : index
      selectable[focusIndex]?.focus()
      break
    }
  }
}

defineExpose({ colors, add })
</script>

<template>
  <ColorInput ref="swatches" v-for="[id, color] in swatchmap" :key="id"
    :color="color"
    @keydown="onKeyDown(id, $event)"
  />
  <NewSwatch ref="newswatch"
    @click="add('#ffffff')"
    @keydown="onKeyDown(id, $event)"
  />
</template>