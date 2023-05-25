<script setup>
import { ref } from 'vue'
import ColorSwatch from './ColorSwatch.vue';

const input = ref(null)
function focus() {
	input.value?.focus()
}

defineExpose({ focus })
</script>

<template>
	<ColorSwatch class="outlined">
		<slot></slot>
	</ColorSwatch>
</template>