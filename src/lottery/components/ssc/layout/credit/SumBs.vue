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
  if (!chmPosition) return null;

  const positions = Array.isArray(chmPosition) ? chmPosition : [chmPosition];
  const codeArray = issue.code.split(',');

  let sum = 0;
  for (const pos of positions) {
    const numStr = codeArray[pos - 1];
    const number = parseInt(numStr, 10);
    if (isNaN(number)) return null;
    sum += number;
  }

  return sum >= 23 ? 0 : 1;
}
</script>