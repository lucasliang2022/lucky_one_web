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
import {getZjhType} from "@lottery/utils/common.js";

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
  if (!chmPosition || !Array.isArray(chmPosition) || chmPosition.length < 3) return null;
  const positions = chmPosition;
  const codeArray = issue.code.split(',');

  const nums = [
    parseInt(codeArray[positions[0] - 1], 10),
    parseInt(codeArray[positions[1] - 1], 10),
    parseInt(codeArray[positions[2] - 1], 10)
  ];
  if (nums.some(num => isNaN(num))) return null;
  return getZjhType(nums)
}
</script>