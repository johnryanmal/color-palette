<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  color: String
})
const { color } = toRefs(props)

</script>

<template>
  <div class="swatch"></div>
</template>

<style scoped>
  .swatch {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    background-color: v-bind(color);
  }
</style>