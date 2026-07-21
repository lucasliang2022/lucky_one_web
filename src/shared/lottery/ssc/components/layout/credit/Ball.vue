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
  const chmPosition = props.methodCurrent?.layout?.rows[0]?.position;
  const positions = Array.isArray(chmPosition) ? chmPosition : (chmPosition != null ? [chmPosition] : []);
  const codeArray = String(issue?.code || '').split(',');

  // 单码(无固定位置,一~五中):统计每个号在所有位置的出现(一期内去重,按出现期数计冷热)。
  if (!positions.length) {
    const set = new Set();
    codeArray.forEach((s) => {
      const n = parseInt(s, 10);
      if (!isNaN(n) && n >= 0 && n <= 9) set.add(n);
    });
    return [...set];
  }

  // 定位号码:取该位置的开奖数字。
  const number = parseInt(codeArray[positions[0] - 1], 10);
  if (isNaN(number) || number < 0 || number > 9) return null;
  return number;
}
</script>