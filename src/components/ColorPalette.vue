<script setup>
import { ref, computed, onBeforeUpdate } from 'vue'
const props = defineProps({
  colors: { type: Array, required: false, default: [] }
})

import ColorInput from './ColorInput.vue'
import ColorNew from './ColorNew.vue'

import draggable from 'vuedraggable'

let _id = 0
function uid() {
  return _id++
}

const swatchlist = ref([])
const swatchmap = ref({})
const swatchrefs = ref({})
const swatches = computed(() => swatchlist.value.map((data) => swatchrefs.value[data.id] ?? swatchmap.value[data.id]))
const newswatch = ref(null)
const colors = computed(() => swatches.value.map((swatch) => swatch.color))

onBeforeUpdate(() => {
  swatchrefs.value = {}
})

for (const color of props.colors) {
  add(color)
}

function add(color) {
  const hex = /^#[a-f\d]{6}$/i
  if (hex.test(color)) {
    const id = uid()
    const data = { id, color }
    swatchlist.value.push(data)
    swatchmap.value[id] = data
    return id
  }
}

function remove(id) {
  const data = swatchmap.value[id]
  const index = swatchlist.value.indexOf(data)
  if (index !== -1) {
    swatchlist.value.splice(index, 1)
    delete swatchmap.value[id]
  }
}

function onKeyDown(id, event) {
  const selectable = [...swatches.value, newswatch.value]
  const index = selectable.findIndex((swatch) => swatch?.$el === event.currentTarget)
  const last = selectable.length-1

  let prevleft = -Infinity
  let columns = 0
  for (const swatch of selectable) {
    const left = swatch?.$el.getBoundingClientRect().left
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
  <draggable
    v-model="swatchlist"
    item-key="id"
    tag="span"
    ghost-class="ghost"
  >
    <template #item="{ element }">
      <ColorInput :ref="(el) => swatchrefs[element.id] = el"
        :color="element.color"
        @keydown="onKeyDown(element.id, $event)"
      ></ColorInput>
    </template>
  </draggable>
  <ColorNew ref="newswatch"
    @click="add('#ffffff')"
    @keydown="onKeyDown(id, $event)"
    @drop="add($event.dataTransfer.getData('color'))"
  />
</template>

<style scoped>
.ghost {
  opacity: 0.2;
}
</style>