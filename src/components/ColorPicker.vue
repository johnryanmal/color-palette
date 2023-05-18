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
  <ColorSwatch :color="color" @mousedown.prevent="focus" @contextmenu.prevent="edit">
    <input ref="input" type="color" :value="color" class="hidden" @input="onInput" @keydown="onKeyDown"/>
  </ColorSwatch>
</template>

<style scoped>
  .hidden {
    pointer-events: none;
    opacity: 0;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    margin: 0;
  }
</style>