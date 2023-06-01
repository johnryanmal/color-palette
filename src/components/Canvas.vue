<script setup>
import { toRefs, ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['draw'])
const props = defineProps({
	width: { type: Number, required: false, default: 300 },
	height: { type: Number, required: false, default: 300 }
})

const { width, height } = toRefs(props)

const canvas = ref(null)
const ctx = ref()

function onFrame() {
	emit('draw', ctx.value)
}

const request = ref(null)
function onAnimate() {
	onFrame()
	request.value = window.requestAnimationFrame(onAnimate)
}

onMounted(() => {
	ctx.value = canvas.value.getContext('2d')
	onAnimate()
})

onBeforeUnmount(() => {
	window.cancelAnimationFrame(request.value)
})
</script>

<template>
	<canvas ref="canvas" :width="width" :height="height"></canvas>
</template>