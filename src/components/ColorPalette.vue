<script setup>
import { toRefs } from 'vue'

import ColorPicker from './ColorPicker.vue';

const props = defineProps({
	colors: Array
})
const { colors } = toRefs(props)
</script>

<template>
	<ColorPicker v-for="color, index in colors" :key="index" :color="color"/>
</template>