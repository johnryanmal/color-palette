<script setup>
import { ref } from 'vue'

const color = ref('#000000')
function onInput(event) {
	const value = event.target.value
	color.value = value
}
</script>

<template>
	<p>{{ color }}</p>
	<input type="color" :value="color" @input="onInput"/>
</template>