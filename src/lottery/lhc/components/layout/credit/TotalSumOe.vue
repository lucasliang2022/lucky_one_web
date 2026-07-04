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
  console.log('issue---, 单双，冷热')
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
    const stat = getNumber(issue);
    if (!stat) return;

    const matchForms = {
      1: stat[1],
      2: stat[2],
    };

    for (let key in matchForms) {
      if (matchForms[key]) {
        hotCold[key] += 1;
      }
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
    const stat = getNumber(issue);
    if (!stat) continue;

    const matchForms = {
      1: stat[1],
      2: stat[2],
    };

    for (let key in matchForms) {
      if (matchForms[key] && omission[key] === -1) {
        omission[key] = index;
      }
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
  const chmPosition = props.methodCurrent?.layout?.rows?.position || {};
  if (!chmPosition) return null;
  const positions = Array.isArray(chmPosition) ? chmPosition : [chmPosition];
  const codeArray = issue.code.split(',');

  let sum = 0;
  let hasInvalid = false;

  positions.forEach(pos => {
    const numStr = codeArray[pos - 1];
    const number = parseInt(numStr, 10);
    if (isNaN(number)) {
      hasInvalid = true;
      return;
    }
    sum += number;
  });

  if (hasInvalid) return { 1: false, 2: false };

  return {
    1: sum % 2 !== 0,
    2: sum % 2 === 0,
  };
}
</script>