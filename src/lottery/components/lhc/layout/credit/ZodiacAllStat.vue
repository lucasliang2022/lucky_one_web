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
    required: true,
  },
  store: {
    type: Object,
    required: true,
  },
  sort: {
    type: Number,
    default: 1,
  },
});

const { issueHistory, numberToZodiac } = storeToRefs(props.store);

function calculateHotCold(issueCount, hotColdData) {
  if (!issueHistory.value?.length) {
    hotColdData.value = {};
    return;
  }
  const recentIssues = issueHistory.value.slice(0, issueCount);
  const hotCold = {};

  props.methodCurrent.layout.rows.number.forEach((ball) => {
    hotCold[ball.value] = 0;
  });

  recentIssues.forEach((issue) => {
    const zodiacCount = getNumber(issue);
    if (zodiacCount !== null && hotCold[zodiacCount] !== undefined) {
      hotCold[zodiacCount] += 1;
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
  props.methodCurrent.layout.rows.number.forEach((ball) => {
    omission[ball.value] = -1;
  });

  for (let index = 0; index < issueHistory.value.length; index++) {
    const issue = issueHistory.value[index];
    const zodiacCount = getNumber(issue);
    if (zodiacCount !== null && omission[zodiacCount] === -1) {
      omission[zodiacCount] = index;
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

function getNumber(issue) {
  const codeArray = issue.code.split(",");
  const zodiacs = new Set();

  codeArray.forEach((numStr) => {
    const zodiacData = numberToZodiac.value[numStr];
    if (zodiacData && zodiacData.no !== undefined) {
      zodiacs.add(zodiacData.no);
    }
  });

  return zodiacs.size % 2;
}
</script>