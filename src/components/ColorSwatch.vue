<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  color: { type: String, required: false, default: 'transparent' }
})
const { color } = toRefs(props)

</script>

<template>
  <div class="swatch">
    <slot></slot>
  </div>
</template>

<style scoped>
.swatch {
  display: inline-block;
  vertical-align: bottom;
  width: 3rem;
  height: 3rem;
  background-color: v-bind(color);
}

.swatch:hover, .swatch:focus-within {
  z-index: 1;
  transform: scale(1.1);
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 10%);
}
</style>