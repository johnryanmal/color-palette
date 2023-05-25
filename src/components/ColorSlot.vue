<script setup>
import { ref, nextTick } from 'vue'

import ColorInput from './ColorInput.vue'
import ColorEmpty from './ColorEmpty.vue'

const hex = /^#[a-f\d]{6}$/i
const color = ref('')

const swatch = ref(null)
const input = ref(null)

function setColor(text) {
  if (hex.test(text)) {
    color.value = text
  }
}

function onKeyDown(event) {
  if (event.ctrlKey || event.metaKey) {
    switch(event.code) {
      case 'KeyV':
        navigator.clipboard.readText().then((text) => {
          setColor(text)
          nextTick(() => { swatch.value.focus() })
        })
        break
    }
  } else {
    switch(event.code) {
      case 'Backspace':
        color.value = ''
        nextTick(() => { input.value.focus() })
        break
    }
  }
}
</script>

<template>
  <ColorInput ref="swatch" v-if="hex.test(color)" :color="color" @keydown="onKeyDown"/>
  <ColorEmpty ref="empty" v-else
    @click="input.focus()"
    @dragenter.prevent
    @dragover.prevent
    @drop="setColor($event.dataTransfer.getData('color'))"
    @keydown="onKeyDown"
  >
    <input ref="input" type="button" class="hidden"/>
  </ColorEmpty>
</template>

<style scoped>
</style>