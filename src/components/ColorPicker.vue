<script setup>
import { ref } from 'vue'
const emit = defineEmits(['color'])

const color = ref('#000000')
emit('color', color.value)

function onInput(event) {
	color.value = event.target.value
	emit('color', color.value)
}
</script>

<template>
	<input type="color" :value="color" @input="onInput"/>
</template>