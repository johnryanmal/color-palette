<script setup>
import { toRefs } from 'vue'

const props = defineProps({
	func: { type: Function, required: false, default: (x) => x },
	steps: { type: Number, required: false, default: 100 },
	xmin: { type: Number, required: false, default: 0 },
	xmax: { type: Number, required: false, default: 10 },
	ymin: { type: Number, required: false, default: 0 },
	ymax: { type: Number, required: false, default: 10 },
	width: { type: Number, required: false, default: 300 },
	height: { type: Number, required: false, default: 300 },
	lineColor: { type: String, required: false, default: 'black' },
	lineWidth: { type: Number, required: false, default: 2 }
})

import Canvas from './Canvas.vue'

const { func, steps, xmin, xmax, ymin, ymax, width, height, lineColor, lineWidth } = toRefs(props)

function drawPath(ctx, points) {
	if (points.length >= 2) {
		const [sx, sy] = points[0]
		ctx.beginPath()
		ctx.moveTo(sx, sy)
		for (const [x, y] of points.slice(1)) {
			ctx.lineTo(x, y)
		}
		ctx.stroke()
	}
}

function percentage(min, max, x) {
  return (x-min)/(max-min) || 0
}

function lerp(start, end, delta) {
	return start + (end - start) * delta
}

function render(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	ctx.strokeStyle = lineColor.value
	ctx.lineWidth = lineWidth.value
	const path = []
	for (let step = 1; step <= steps.value; step++) {
		const sx = percentage(1, steps.value, step)

		const x = lerp(xmin.value, xmax.value, sx)
		const y = func.value(x)

		const sy = percentage(ymin.value, ymax.value, y)

		const px = lerp(0, ctx.canvas.width, sx)
		const py = lerp(ctx.canvas.height, 0, sy)

		path.push([px, py])
	}
	drawPath(ctx, path)
}
</script>

<template>
	<Canvas @draw="render" v-bind="{ width, height }"/>
</template>