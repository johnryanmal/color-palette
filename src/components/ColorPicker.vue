<script setup>
import { ref } from 'vue'
const emit = defineEmits(['color'])

import ColorSwatch from './ColorSwatch.vue'

const color = ref('#000000')
emit('color', color.value)

function onInput(event) {
	color.value = event.target.value
	emit('color', color.value)
}

const input = ref(null)
function onClick() {
	input.value.click()
}
</script>

<template>
	<ColorSwatch :color="color" @click="onClick"/>
	<input ref="input" type="color" :value="color" class="hidden" @input="onInput"/>
</template>

<style>
	.hidden {
		visibility: hidden;
		width: 0px;
		height: 0px;
		padding: 0;
		margin: 0;
	}
</style>