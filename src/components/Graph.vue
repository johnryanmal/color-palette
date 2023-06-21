<script setup>
import { toRefs } from 'vue'

const emit = defineEmits(['draw-bg', 'draw-fg'])
const props = defineProps({
	func: { type: Function, required: false, default: (x) => undefined },
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

const { func, xmin, xmax, ymin, ymax, width, height, lineColor, lineWidth } = toRefs(props)

function drawPath(ctx, points) {
	if (points.length >= 2) {
		const [bx, by] = points[0]
		ctx.beginPath()
		ctx.moveTo(bx, by)
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

function clear(ctx) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function render(ctx) {
	if (func.value) {
		ctx.strokeStyle = lineColor.value
		ctx.lineWidth = lineWidth.value
		let path = []
		let prev = null
		for (let pixel = 0; pixel < width.value; pixel++) {
			const sx = percentage(0, width.value-1, pixel)

			const x = lerp(xmin.value, xmax.value, sx)
			const y = func.value(x)

			if (prev) {
				const [xprev, yprev] = prev
				const xhalf = lerp(xprev, x, 0.5)
				const yhalf = func.value(xhalf)
				const ylower = Math.min(yprev, y)
				const yupper = Math.max(yprev, y)
				if (!(ylower <= yhalf && yhalf <= yupper)) {
					//discontinuous path
					drawPath(ctx, path)
					path = []
					prev = null
					continue
				}
			}
			prev = [x, y]

			const sy = percentage(ymin.value, ymax.value, y)

			const px = lerp(0, ctx.canvas.width, sx)
			const py = lerp(ctx.canvas.height, 0, sy)

			path.push([px, py])
		}
		drawPath(ctx, path)
	}
}

function onDraw(ctx) {
	clear(ctx)
	emit('draw-bg', ctx)
	render(ctx)
	emit('draw-fg', ctx)
}
</script>

<template>
	<Canvas @draw="onDraw" v-bind="{ width, height }"/>
</template>