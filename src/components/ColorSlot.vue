<script setup>
import { ref, computed, nextTick } from 'vue'

import ColorInput from './ColorInput.vue'
import ColorEmpty from './ColorEmpty.vue'

const hex = /^#[a-f\d]{6}$/i
const _color = ref(null)

const swatch = ref(null)
const input = ref(null)

const color = computed(() => swatch.value?.color)

function setColor(text) {
  if (hex.test(text)) {
    _color.value = text
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
        _color.value = null
        nextTick(() => { input.value.focus() })
        break
    }
  }
}

defineExpose({ color })
</script>

<template>
  <ColorInput ref="swatch" class="bordered" v-if="hex.test(_color)"
    :color="_color"
    @contextmenu.prevent="_color = null"
    @keydown="onKeyDown"
    @dragenter.prevent
    @dragover.prevent
    @drop="swatch.setColor($event.dataTransfer.getData('color'))"
  />
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