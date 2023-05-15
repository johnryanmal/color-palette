<script setup>
import { ref } from 'vue'
import ColorPicker from './components/ColorPicker.vue'
import ColorSwatch from './components/ColorSwatch.vue'
import ColorPalette from './components/ColorPalette.vue';

const color = ref('')
const colors = ref([])
</script>

<template>
  <p>{{ color }}</p>
  <ColorPicker @color="(value) => color = value" />
  <button @click="() => colors.push(color)">Add to palette</button>
  <hr/>
  <ColorPalette :colors="colors"/>
</template>

<style scoped>
</style>
