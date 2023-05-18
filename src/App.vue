<script setup>
import { ref } from 'vue'
import ColorInput from './components/ColorInput.vue'
import ColorPalette from './components/ColorPalette.vue';

const picker = ref(null)
const palette = ref(null)
</script>

<template>
  <p>{{ palette?.colors }}</p>
  <ColorInput ref="picker"/>
  <button @click="() => palette.add(picker.color)">Add to palette</button>
  <hr/>
  <ColorPalette ref="palette" :colors="['#ff0000', '#00ff00', '#0000ff']"/>
</template>

<style scoped>
</style>
