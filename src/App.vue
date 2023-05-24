<script setup>
import { ref } from 'vue'
import ColorInput from './components/ColorInput.vue'
import ColorPalette from './components/ColorPalette.vue'
import ColorBand from './components/ColorBand.vue'

import chroma from 'chroma-js'

const picker = ref(null)
const palette = ref(null)
</script>

<template>
  <p :set="console.log(palette?.colors)">{{ palette?.colors }}</p>
  <ColorInput ref="picker"/>
  <button @click="() => palette.add(picker.color)">Add to palette</button>
  <hr/>
  <ColorBand v-if="palette" :func="chroma.bezier(palette.colors)"/>
  <hr/>
  <ColorPalette ref="palette" :colors="['#ff0000', '#00ff00', '#0000ff']"/>
</template>