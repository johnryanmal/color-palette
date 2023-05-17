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

defineExpose({ color })
</script>

<template>
  <ColorSwatch :color="color">
    <input type="color" :value="color" class="hidden" @input="onInput"/>
  </ColorSwatch>
</template>

<style>
  .hidden {
    opacity: 0;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    margin: 0;
  }
</style>