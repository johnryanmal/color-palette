<script setup>
import { ref } from 'vue'
import ColorPicker from './components/ColorPicker.vue'

const color = ref('')
</script>

<template>
  <p>{{ color }}</p>
  <ColorPicker @color="(value) => color = value" />
</template>

<style scoped>
</style>
