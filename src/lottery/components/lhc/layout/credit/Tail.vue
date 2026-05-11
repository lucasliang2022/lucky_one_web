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

function calculateHotCold(issueCount, hotColdData) {
  if (!issueHistory.value?.length) {
    hotColdData.value = {};
    return;
  }
  const recentIssues = issueHistory.value.slice(0, issueCount);
  const hotCold = {};
  props.methodCurrent.layout.rows.number.forEach(ball => {
    hotCold[ball.value] = 0;
  });
  recentIssues.forEach(issue => {
    const tailNum = getTailNumber(issue);
    if (tailNum !== null && hotCold[tailNum] !== undefined) {
      hotCold[tailNum] += 1;
    }
  });
  hotColdData.value = hotCold;
}

function calculateOmission(omissionData) {
  if (!issueHistory.value?.length) {
    omissionData.value = {};
    return;
  }
  const omission = {};
  props.methodCurrent.layout.rows.number.forEach(ball => {
    omission[ball.value] = -1;
  });
  for (let index = 0; index < issueHistory.value.length; index++) {
    const issue = issueHistory.value[index];
    const tailNum = getTailNumber(issue);
    if (tailNum !== null && omission[tailNum] === -1) {
      omission[tailNum] = index;
    }
    if (!Object.values(omission).includes(-1)) {
      break;
    }
  }
  for (let key in omission) {
    if (omission[key] === -1) {
      omission[key] = issueHistory.value.length;
    }
  }
  omissionData.value = omission;
}

function getTailNumber(issue) {
  const chmPosition = props.methodCurrent?.layout?.rows?.position || {};
  if (!chmPosition) return null;
  const positions = Array.isArray(chmPosition) ? chmPosition : [chmPosition];
  const codeArray = issue.code.split(',');
  const numStr = codeArray[positions[0] - 1];
  const number = parseInt(numStr, 10);
  return number % 10;
}
</script>