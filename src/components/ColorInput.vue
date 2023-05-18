<script setup>
import { ref } from 'vue'

const props = defineProps({
  color: { type: String, required: false, default: '#000000'}
})

import ColorSwatch from './ColorSwatch.vue'

const color = ref(props.color)
function onInput(event) {
  color.value = event.target.value
}

function onKeyDown(event) {
  if (event.ctrlKey || event.metaKey) {
    switch(event.code) {
      case 'KeyC':
        navigator.clipboard.writeText(color.value)
        break
      case 'KeyV':
        navigator.clipboard.readText().then((text) => {
          const hex = /^#[0-9a-f]{6}$/i
          if (hex.test(text)) {
            color.value = text
          }
        })
        break
    }
  }
}

const input = ref(null)
function focus() {
  input.value?.focus()
}
function edit() {
  input.value?.click()
}

defineExpose({ color, focus, edit })
</script>

<template>
  <ColorSwatch :color="color"
    @click="focus"
    @contextmenu.prevent="edit"
    draggable="true"
    @dragstart="$event.dataTransfer.setData('text', color)"
  >
    <input ref="input" type="color" :value="color" class="hidden" @input="onInput" @keydown="onKeyDown"/>
  </ColorSwatch>
</template>