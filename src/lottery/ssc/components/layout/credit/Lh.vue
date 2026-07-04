<template xmlns="">
  <item-default
      :method-current="methodCurrent"
      :calculate-chm="calculateChm"
      :sort="sort"
      :store="store"
  />
</template>

<script setup>
import ItemDefault from "./items/ItemDefault.vue";

const props = defineProps({
  methodCurrent: {
    type: Object,
    required: true
  },
  store: {
    type: Object,
    required: true
  },
  sort: {
    type: Number,
    default: 1,
  }
});

function calculateChm(issue) {
  const chmPosition = props.methodCurrent?.layout?.rows[0]?.position || {};
  if (!chmPosition || !Array.isArray(chmPosition) || chmPosition.length < 2) return null;
  const positions = chmPosition;
  const codeArray = issue.code.split(',');

  const num1Str = codeArray[positions[0] - 1];
  const num2Str = codeArray[positions[1] - 1];
  const num1 = parseInt(num1Str, 10);
  const num2 = parseInt(num2Str, 10);

  if (isNaN(num1) || isNaN(num2)) return null;

  return num1 > num2 ? 0 : (num1 < num2 ? 1 : 2)
}
</script>