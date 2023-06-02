<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits('update:modelValue')
const props = defineProps({
	modelValue: Array
})

import Graph from './Graph.vue'

import { createInterpolatorWithFallback } from 'commons-math-interpolation'

function drawPoint(ctx, x, y) {
	ctx.beginPath()
	ctx.arc(x, ctx.canvas.height-y, 5, 0, 2*Math.PI)
	ctx.stroke()
}

function onDraw(ctx) {
	for (const [x, y] of points.value) {
		drawPoint(ctx, x, y)
	}
}

const points = ref(props.modelValue)
const xs = computed(() => points.value.map(([x, y]) => x))
const ys = computed(() => points.value.map(([x, y]) => y))
const func = computed(() => createInterpolatorWithFallback('akima', xs.value, ys.value))
const xmin = computed(() => Math.min(...xs.value))
const xmax = computed(() => Math.max(...xs.value))
const ymin = computed(() => Math.min(...ys.value))
const ymax = computed(() => Math.max(...ys.value))
</script>

<template>
	<Graph @draw="onDraw" v-bind="{ func, xmin, xmax, ymin, ymax }"/>
</template>