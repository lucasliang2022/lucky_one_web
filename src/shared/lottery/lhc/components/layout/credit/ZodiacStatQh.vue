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

const qianXiao = [0, 1, 2, 3, 4, 5];
const houXiao = [6, 7, 8, 9, 10, 11];

function calculateHotCold(issueCount, hotColdData) {
  if (!issueHistory.value?.length) {
    hotColdData.value = {};
    return;
  }
  const recentIssues = issueHistory.value.slice(0, issueCount);
  const hotCold = {
    0: 0,
    1: 0,
  };

  recentIssues.forEach((issue) => {
    const stat = getNumber(issue);
    if (stat !== null) {
      hotCold[stat] += 1;
    }
  });

  hotColdData.value = hotCold;
}

function calculateOmission(omissionData) {
  if (!issueHistory.value?.length) {
    omissionData.value = {};
    return;
  }

  const omission = {
    0: -1,
    1: -1,
  };

  for (let index = 0; index < issueHistory.value.length; index++) {
    const issue = issueHistory.value[index];
    const stat = getNumber(issue);
    if (stat !== null && omission[stat] === -1) {
      omission[stat] = index;
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
  const codeArray = issue.code.split(",");

  const numStr = codeArray[positions[0] - 1];
  if (!numStr) return null;

  const zodiacData = numberToZodiac.value[numStr];
  if (!zodiacData || zodiacData.no === undefined) return null;

  const zodiacIndex = zodiacData.no;
  if (qianXiao.includes(zodiacIndex)) {
    return 0;
  } else if (houXiao.includes(zodiacIndex)) {
    return 1;
  }

  return null;
}
</script>