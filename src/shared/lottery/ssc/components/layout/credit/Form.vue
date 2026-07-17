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

defineProps({
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

// 形态盘(大小单双质合)一个开奖号码会同时命中多个码(如 8 = 大+双+合),
// 单值 chm 无法表达多命中,冷热/遗漏对形态不适用 → 返回 null(不参与冷热统计)。
function calculateChm() {
  return null;
}
</script>
