<template>
  <item-default
      :method-current="methodCurrent"
      :ball-data="methodCurrent.layout.rows.number"
      :calculate-hot-cold-fn="calculateHotCold"
      :calculate-omission-fn="calculateOmission"
      :sort="sort"
      :store="store"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import ItemDefault from "./items/ItemDefault.vue";
import { computeHotCold, computeOmission } from "@lottery/base/logic/hotColdOmission";

const props = defineProps({
  methodCurrent: {
    type: Object,
    required: true
  },
  store: {
    type: Object,
    required: true,
  },
  sort: {
    type: Number,
    default: 1,
  }
});

const {
  issueHistory,
} = storeToRefs(props.store);

function ballKeys() {
  return props.methodCurrent.layout.rows.number.map(ball => ball.value);
}

function matchFn(issue) {
  const stat = getNumber(issue);
  if (!stat) return null;
  return Object.keys(stat).filter(key => stat[key]);
}

function calculateHotCold(issueCount, hotColdData) {
  if (!issueHistory.value?.length) {
    hotColdData.value = {};
    return;
  }
  hotColdData.value = computeHotCold(issueHistory.value, issueCount, ballKeys(), matchFn);
}

function calculateOmission(omissionData) {
  if (!issueHistory.value?.length) {
    omissionData.value = {};
    return;
  }
  omissionData.value = computeOmission(issueHistory.value, ballKeys(), matchFn);
}

function getNumber(issue) {
  const chmPosition = props.methodCurrent?.layout?.rows?.position || {};
  if (!chmPosition) return null;
  const positions = Array.isArray(chmPosition) ? chmPosition : [chmPosition];
  const codeArray = issue.code.split(',');

  const numStr = codeArray[positions[0] - 1];
  const number = parseInt(numStr, 10);

  if (isNaN(number) || number === 49) return { 0: false, 1: false };

  const tens = Math.floor(number / 10);
  const ones = number % 10;
  const sum = tens + ones;

  return {
    0: sum >= 7,
    1: sum <= 6
  };
}
</script>