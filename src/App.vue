<script setup>
import { ref } from 'vue'
import ColorPicker from './components/ColorPicker.vue'
import ColorSwatch from './components/ColorSwatch.vue'

const color = ref('')
</script>

<template>
  <ColorSwatch :color="color"/>
  <ColorPicker @color="(value) => color = value" />
</template>

<style scoped>
</style>
