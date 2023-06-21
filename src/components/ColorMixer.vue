<script setup>
import { ref } from 'vue'

const props = defineProps({
	steps: { type: Number, required: false, default: 10 }
})

import chroma from 'chroma-js'

const steps = ref(props.steps)

import GraphEditor from './GraphEditor.vue'
import ColorSwatch from './ColorSwatch.vue'
import ColorBand from './ColorBand.vue'

function graphConfig(config={}) {
	return {
		steps: steps.value,
		...config
	}
}
const graphHue = ref(null)
const graphSat = ref(null)
const graphVal = ref(null)
</script>

<template>
	<p>Colors: <input type="number" v-model="steps"/></p>
	<div class="graph-wrapper">
		<h2>Hue</h2>
		<GraphEditor ref="graphHue" v-bind="graphConfig({ ymax: 360, mode: 'modulo' })" />
	</div>
	<div class="graph-wrapper">
		<h2>Saturation</h2>
		<GraphEditor ref="graphSat" v-bind="graphConfig()" />
	</div>
	<div class="graph-wrapper">
		<h2>Value</h2>
		<GraphEditor ref="graphVal" v-bind="graphConfig()" />
	</div>
	<hr/>
	<template v-if="graphHue && graphSat && graphVal">
		<ColorBand :func="(x) => chroma.hsv(graphHue.func(x), graphSat.func(x), graphVal.func(x)).hex()" />
		<hr/>
		<span v-if="steps > 0">
			<ColorSwatch v-for="_, index in steps"
				:color="chroma.hsv(graphHue.values[index], graphSat.values[index], graphVal.values[index]).hex()"	
			/>
		</span>
	</template>
</template>

<style scoped>
.graph-wrapper {
	display: inline-block;
	margin-right: 3rem;
}
</style>