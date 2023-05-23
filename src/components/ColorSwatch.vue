<script setup>
import { toRefs, computed } from 'vue'

const props = defineProps({
  color: { type: String, required: false, default: 'transparent' }
})
const { color } = toRefs(props)

function hexToRGB(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

//https://www.w3.org/TR/WCAG20/#relativeluminancedef
function luminance(r, g, b) {
  const sr = r/255
  const sg = g/255
  const sb = b/255
  const R = (sr <= 0.03928) ? sr/12.92 : ((sr+0.055)/1.055) ** 2.4
  const G = (sg <= 0.03928) ? sg/12.92 : ((sg+0.055)/1.055) ** 2.4
  const B = (sb <= 0.03928) ? sb/12.92 : ((sb+0.055)/1.055) ** 2.4
  return 0.2126*R + 0.7152*G + 0.0722*B
}

//https://www.w3.org/TR/WCAG20/#contrast-ratiodef
function _contrast(l1, l2) {
  return (l1 + 0.05) / (l2 + 0.05)
}
function contrast(lA, lB) {
  return lA > lB ? _contrast(lA, lB) : _contrast(lB, lA)
}

const lineColor = computed(() => {
  const rgb = hexToRGB(color.value)
  if (rgb) {
    const { r, g, b } = rgb
    const l = luminance(r, g, b)
    if (contrast(l, 1) > contrast(l, 0)) {
      return '#ffffff'
    } else {
      return '#000000'
    }
  }
  return '#000000'
})

</script>

<template>
  <div class="swatch">
    <slot></slot>
  </div>
</template>

<style scoped>
.swatch {
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  width: 3rem;
  height: 3rem;
  background-color: v-bind(color);
  color: v-bind(lineColor);
}

.swatch:focus-within {
  z-index: 1;
  transform: scale(1.1);
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 10%);
}
</style>