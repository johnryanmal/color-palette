<script setup>
import { toRefs, ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
	modelValue: { type: Array, required: true },
	steps: { type: Number, required: false, default: 10 },
	xmin: { type: Number, required: false, default: 0 },
	xmax: { type: Number, required: false, default: 1 },
	ymin: { type: Number, required: false, default: 0 },
	ymax: { type: Number, required: false, default: 1 },
	width: { type: Number, required: false, default: 300 },
	height: { type: Number, required: false, default: 300 }
})

const { steps, xmin, xmax, ymin, ymax, width, height } = toRefs(props)

import Graph from './Graph.vue'

import { createInterpolatorWithFallback } from 'commons-math-interpolation'

function percentage(min, max, x) {
  return (x-min)/(max-min) || 0
}

function lerp(start, end, delta) {
	return start + (end - start) * delta
}

function scale(x, min, max, min2, max2) {
	return lerp(min2, max2, percentage(min, max, x))
}

function drawCircle(ctx, x, y, r, fill=false) {
	ctx.beginPath()
	ctx.arc(x, ctx.canvas.height-y, r, 0, 2*Math.PI)
	ctx.stroke()
	if (fill) {
		ctx.fill()
	}
}

function drawLine(ctx, x, y, x2, y2) {
	ctx.beginPath()
	ctx.moveTo(x, ctx.canvas.height-y)
	ctx.lineTo(x2, ctx.canvas.height-y2)
	ctx.stroke()
}

function drawVertical(ctx, x) {
	drawLine(ctx, x, 0, x, ctx.canvas.height)
}

function clamp(x, min, max) {
	if (x < min) {
		return min
	} else if (x > max) {
		return max
	} else {
		return x
	}
}

const points = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('update:modelValue', value.toSorted(([x1, y1], [x2, y2]) => x1 - x2)) // sorted by x (ascending)
	}
})
const verticals = computed(() => {
	// edge case: one or more points with the same x value
	const repeats = {}
	for (const [x, y] of points.value) {
		repeats[x] ??= 0
		repeats[x]++
	}
	const array = []
	for (const [x, count] of Object.entries(repeats)) {
		if (count > 1) {
			array.push(x)
		}
	}
	return array
})
const vertical = computed(() => verticals.value.length > 0)
const interpolator = computed(() => {
	if (vertical.value) {
		return () => undefined
	}
	const xs = []
	const ys = []

	for (const [x, y] of points.value) {
		xs.push(x)
		ys.push(y)
	}

	return createInterpolatorWithFallback('akima', xs, ys)
})
const func = computed(() => (x) => clamp(interpolator.value(x), ymin.value, ymax.value))
const pointSize = ref(5)

function sq(x) {
	return x*x
}

function sqDist(x, y, x2, y2) {
	const dx = Math.abs(x2 - x)
	const dy = Math.abs(y2 - y)
	return sq(dx) + sq(dy)
}

function nearestNeighbor(x, y, points) {
	let minDist = Infinity
	let nearest = null
	for (const point of points) {
		const [px, py] = point
		const dist = sqDist(x, y, px, py)
		if (dist < minDist) {
			minDist = dist
			nearest = point
		}
	}
	return nearest
}

function getBounds(element) {
	const bounds = element.getBoundingClientRect()
	const left = bounds.left
	const right = bounds.left + bounds.width
	const top = bounds.top
	const bottom = bounds.top + bounds.height

	return { left, right, top, bottom }
}

function findPoint(mx, my) {
	const { left, right, top, bottom } = getBounds(graph.value.$el)

	const x = scale(mx, left, right, xmin.value, xmax.value)
	const y = scale(my, bottom, top, ymin.value, ymax.value)

	const nearest = nearestNeighbor(x, y, points.value)

	if (nearest) {
		const [px, py] = nearest
		
		const cx = scale(px, xmin.value, xmax.value, left, right)
		const cy = scale(py, ymin.value, ymax.value, bottom, top)
		const cr =
			(nearest === hoverPoint.value)
				? pointSize.value + 2
				: pointSize.value

		if (sqDist(mx, my, cx, cy) <= sq(cr)) {
			return nearest
		}
	}
}

function toPoint(mx, my) {
	const { left, right, top, bottom } = getBounds(graph.value.$el)

	const px = clamp(mx, left, right)
	const py = clamp(my, top, bottom)
	const x = scale(px, left, right, xmin.value, xmax.value)
	const y = scale(py, bottom, top, ymin.value, ymax.value)

	return [x, y]
}

const currPoint = ref(null)
const hoverPoint = ref(null)
const graph = ref(null)

function onMouseHover(event) {
	hoverPoint.value = findPoint(event.clientX, event.clientY)
}

function onMouseMove(event) {
	if (currPoint.value) {
		const newPoint = toPoint(event.clientX, event.clientY)

		points.value = points.value.map((point) => {
			if (point === currPoint.value) {
				return newPoint
			} else if (point) {
				return point
			}
		})

		currPoint.value = newPoint
	}
}

function onMouseDown() {
	currPoint.value = hoverPoint.value
}

function onMouseUp() {
	currPoint.value = null
}

function onRightClick(event) {
	points.value = points.value.filter((point) => point !== hoverPoint.value)
	nextTick(() => {
		hoverPoint.value = findPoint(event.clientX, event.clientY)
	})
}

function onDoubleClick(event) {
	const newPoint = toPoint(event.clientX, event.clientY)
	points.value = [...points.value, newPoint]
	hoverPoint.value = newPoint
}

const stepPoints = computed(() => {
	const array = []
	for (let step = 1; step <= steps.value; step++) {
		const x = scale(step, 1, steps.value, xmin.value, xmax.value)
		const y = func.value(x)
		array.push([x, y])
	}
	return array
})
const values = computed(() => stepPoints.value.map(([x, y]) => y))

function onFit() {
	points.value = stepPoints.value.filter(([x, y]) => ![undefined, null, NaN].includes(y))
}

function drawBackground(ctx) {
	ctx.strokeStyle = 'rgba(0,0,0,20%)'
	ctx.lineWidth = 1
	ctx.fillStyle = 'rgba(0,0,0,20%)'
	for (const [x, y] of stepPoints.value) {
		const cx = scale(x, xmin.value, xmax.value, 0, ctx.canvas.width)
		const cy = scale(y, ymin.value, ymax.value, 0, ctx.canvas.height)

		drawVertical(ctx, cx)
		if (!vertical.value) {
			drawLine(ctx, cx, 0, cx, cy)
			drawCircle(ctx, cx, cy, pointSize.value-1, true)
		}
	}
}

function drawForeground(ctx) {
	ctx.strokeStyle = '#ff0000'
	for (const x of verticals.value) {
		const vx = scale(x, xmin.value, xmax.value, 0, ctx.canvas.width)
		drawVertical(ctx, vx)
	}

	ctx.strokeStyle = '#000000'
	for (const point of points.value) {
		const [x, y] = point
		const cx = scale(x, xmin.value, xmax.value, 0, ctx.canvas.width)
		const cy = scale(y, ymin.value, ymax.value, 0, ctx.canvas.height)
		switch (point) {
			case currPoint.value:
				drawCircle(ctx, cx, cy, pointSize.value+2)
				break
			case hoverPoint.value:
				drawCircle(ctx, cx, cy, pointSize.value+1)
				break
			default:
				drawCircle(ctx, cx, cy, pointSize.value)
		}
	}
}

defineExpose({ values })

onMounted(() => {
	document.addEventListener('mouseup', onMouseUp)
	document.addEventListener('mousemove', onMouseMove)
})
onBeforeUnmount(() => {
	document.removeEventListener('mouseup', onMouseUp)
	document.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
	<Graph
		ref="graph"
		@draw-bg="drawBackground"
		@draw-fg="drawForeground"
		v-bind="{ func, xmin, xmax, ymin, ymax, width, height }"
		@mousedown.prevent="onMouseDown"
		@mousemove="onMouseHover"
		@contextmenu.prevent="onRightClick"
		@dblclick="onDoubleClick"
	/>
  <button @click="onFit" :disabled="vertical">Fit to Grid</button>
</template>