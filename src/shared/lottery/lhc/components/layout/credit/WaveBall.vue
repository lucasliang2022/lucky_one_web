<template>
  <item-default
      :method-current="methodCurrent"
      :ball-data="waveCodes"
      :use-format-prize="true"
      :calculate-hot-cold-fn="calculateHotCold"
      :calculate-omission-fn="calculateOmission"
      :sort="sort"
      :store="store"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { blueWave, greenWave, redWave } from '@shared/utils/common.ts';
import { computed } from "vue";
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

const waveCodes = computed(() => {
  return props.methodCurrent.layout.rows.number.map(item => {
    return {
      ...item,
      extraContent: item.extraContent.map(num => ({
        title: num,
        color: item.sign
      }))
    };
  });
});

function calculateHotCold(issueCount, hotColdData) {
  if (!issueHistory.value?.length) {
    hotColdData.value = { 0: 0, 1: 0, 2: 0 };
    return;
  }

  const positions = props.methodCurrent?.layout?.rows?.position || [7];
  const limitedData = issueHistory.value.slice(0, issueCount);
  const hotCold = { 0: 0, 1: 0, 2: 0 };

  limitedData.forEach(issue => {
    const waveExists = { 0: false, 1: false, 2: false };
    const number = issue.code.split(',')[positions[0] - 1];
    if (redWave.includes(number)) waveExists[0] = true;
    if (blueWave.includes(number)) waveExists[1] = true;
    if (greenWave.includes(number)) waveExists[2] = true;

    for (const key in waveExists) {
      if (waveExists[key]) hotCold[key] += 1;
    }
  });

  hotColdData.value = hotCold;
}

function calculateOmission(omissionData) {
  if ( !issueHistory.value?.length) {
    omissionData.value = { 0: 100, 1: 100, 2: 100 };
    return;
  }

  const positions = props.methodCurrent?.layout?.rows?.position || [7];
  const limitedData = issueHistory.value;
  const omission = { 0: 100, 1: 100, 2: 100 };

  for (let i = 0; i < limitedData.length; i++) {
    const issue = limitedData[i];
    const waveExists = { 0: false, 1: false, 2: false };
    const number = issue.code.split(',')[positions[0] - 1];
    if (redWave.includes(number)) waveExists[0] = true;
    if (blueWave.includes(number)) waveExists[1] = true;
    if (greenWave.includes(number)) waveExists[2] = true;

    for (const key in waveExists) {
      if (waveExists[key] && omission[key] === 100) {
        omission[key] = i;
      }
    }

    if (omission[0] !== 100 && omission[1] !== 100 && omission[2] !== 100) {
      break;
    }
  }

  omissionData.value = omission;
}
</script>