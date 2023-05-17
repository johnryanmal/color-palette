<script setup>
import { ref } from 'vue'
import ColorPicker from './components/ColorPicker.vue'
import ColorPalette from './components/ColorPalette.vue';

const picker = ref(null)
const palette = ref(null)
</script>

<template>
  <p>{{ palette?.colors }}</p>
  <ColorPicker ref="picker"/>
  <button @click="() => palette.add(picker.color)">Add to palette</button>
  <hr/>
  <ColorPalette ref="palette"/>
</template>

<style scoped>
</style>
