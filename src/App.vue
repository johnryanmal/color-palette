<script setup>
import { ref } from 'vue'
import ColorInput from './components/ColorInput.vue'
import ColorPalette from './components/ColorPalette.vue'
import ColorBand from './components/ColorBand.vue'
import ColorSlot from './components/ColorSlot.vue'

import chroma from 'chroma-js'

const picker = ref(null)
const palette = ref(null)
</script>

<template>
  <p>{{ palette?.colors }}</p>
  <ColorInput ref="picker"/>
  <button @click="() => palette.add(picker.color)">Add to palette</button>
  <hr/>
  <ColorBand v-if="palette" :func="
    palette.colors.length === 0 && (() => '#000000') ||
    palette.colors.length === 1 && (() => palette.colors[0]) ||
    chroma.bezier(palette.colors)
  "/>
  <hr/>
  <ColorPalette ref="palette" :colors="['#ff0000', '#00ff00', '#0000ff']"/>
  <hr/>
  <ColorSlot/>
</template>