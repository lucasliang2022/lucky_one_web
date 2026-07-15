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

function calculateWaveScore(issue) {
  const numbers = issue.code.split(',').map(num => num.padStart(2, '0'));
  const regularCodes = numbers.slice(0, 6);
  const specialCode = numbers[6];

  let redScore = 0;
  let blueScore = 0;
  let greenScore = 0;

  regularCodes.forEach(num => {
    if (redWave.includes(num)) redScore += 1;
    if (blueWave.includes(num)) blueScore += 1;
    if (greenWave.includes(num)) greenScore += 1;
  });

  if (redWave.includes(specialCode)) redScore += 1.5;
  if (blueWave.includes(specialCode)) blueScore += 1.5;
  if (greenWave.includes(specialCode)) greenScore += 1.5;

  const redCount = regularCodes.filter(num => redWave.includes(num)).length;
  const blueCount = regularCodes.filter(num => blueWave.includes(num)).length;
  const greenCount = regularCodes.filter(num => greenWave.includes(num)).length;

  if (
      (blueCount === 3 && greenCount === 3 && redWave.includes(specialCode)) ||
      (blueCount === 3 && redCount === 3 && greenWave.includes(specialCode)) ||
      (greenCount === 3 && redCount === 3 && blueWave.includes(specialCode))
  ) {
    return 3;
  }

  const maxScore = Math.max(redScore, blueScore, greenScore);
  if (maxScore === redScore) return 0;
  if (maxScore === blueScore) return 2;
  return 1;
}

function calculateHotCold(issueCount, hotColdData) {
  if (!issueHistory.value?.length) {
    hotColdData.value = { 0: 0, 1: 0, 2: 0, 3: 0 };
    return;
  }

  const limitedData = issueHistory.value.slice(0, issueCount);
  const hotCold = { 0: 0, 1: 0, 2: 0, 3: 0 };

  limitedData.forEach(issue => {
    const result = calculateWaveScore(issue);
    hotCold[result] += 1;
  });

  hotColdData.value = hotCold;
}

function calculateOmission(omissionData) {
  if (!issueHistory.value?.length) {
    omissionData.value = { 0: 100, 1: 100, 2: 100, 3: 100 };
    return;
  }

  const limitedData = issueHistory.value;
  const omission = { 0: 100, 1: 100, 2: 100, 3: 100 };

  for (let i = 0; i < limitedData.length; i++) {
    const issue = limitedData[i];
    const result = calculateWaveScore(issue);
    if (omission[result] === 100) omission[result] = i;
    if (Object.values(omission).every(val => val !== 100)) break;
  }

  for (let key in omission) {
    if (omission[key] === 100) omission[key] = limitedData.length;
  }

  omissionData.value = omission;
}
</script>