<template>
  <item-default
      :method-current="methodCurrent"
      :ball-data="methodCurrent.layout.rows.number"
      :use-circle="true"
      :use-format-prize="true"
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

  Object.keys(props.methodCurrent.layout.rows.number).forEach((value) => {
    hotCold[value] = 0;
  });

  const chmPosition = props.methodCurrent?.layout?.rows?.position || {};
  const positions = Array.isArray(chmPosition) ? chmPosition : [chmPosition];

  recentIssues.forEach((issue) => {
    const codeArray = issue.code.split(",").map((num) => parseInt(num.trim(), 10));
    const countedNumbers = new Set(); // 用于跟踪当前期数中已计数的数字

    positions.forEach((pos) => {
      const number = codeArray[pos - 1];
      if (number && hotCold[number] !== undefined && !countedNumbers.has(number)) {
        hotCold[number] += 1;
        countedNumbers.add(number); // 将已计数数字添加到集合中
      }
    });
  });

  hotColdData.value = hotCold;
}

function calculateOmission(omissionData) {
  if (!issueHistory.value?.length) {
    omissionData.value = {};
    return;
  }

  const omission = {};
  Object.keys(props.methodCurrent.layout.rows.number).forEach((value) => {
    omission[value] = -1;
  });

  const chmPosition = props.methodCurrent?.layout?.rows?.position || {};
  const positions = Array.isArray(chmPosition) ? chmPosition : [chmPosition];

  for (let index = 0; index < issueHistory.value.length; index++) {
    const issue = issueHistory.value[index];
    const codeArray = issue.code.split(",").map((num) => parseInt(num.trim(), 10));
    const countedNumbers = new Set();

    positions.forEach((pos) => {
      const number = codeArray[pos - 1];
      if (number && omission[number] === -1 && !countedNumbers.has(number)) {
        omission[number] = index;
        countedNumbers.add(number);
      }
    });

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
</script>