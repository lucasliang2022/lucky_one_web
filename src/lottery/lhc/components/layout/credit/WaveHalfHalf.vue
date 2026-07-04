<template>
  <item-default
      :method-current="methodCurrent"
      :ball-data="methodCurrent.layout.rows.number"
      :use-format-prize="true"
      :calculate-hot-cold-fn="calculateHotCold"
      :calculate-omission-fn="calculateOmission"
      :sort="sort"
      :store="store"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { blueWave, greenWave, redWave } from '@/utils/common.ts';
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
    hotColdData.value = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 };
    return;
  }

  const positions = props.methodCurrent?.layout?.rows?.position || [7];
  const limitedData = issueHistory.value.slice(0, issueCount);
  const hotCold = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 };

  limitedData.forEach(issue => {
    const number = parseInt(issue.code.split(',')[positions[0] - 1], 10);
    if (isNaN(number) || number === 49) return;

    const isBig = number >= 25;
    const isOdd = number % 2 === 1;
    const numStr = String(number).padStart(2, '0');
    const isRed = redWave.includes(numStr);
    const isBlue = blueWave.includes(numStr);
    const isGreen = greenWave.includes(numStr);

    if (isRed && isBig && isOdd) hotCold[0] += 1;
    if (isBlue && isBig && isOdd) hotCold[1] += 1;
    if (isGreen && isBig && isOdd) hotCold[2] += 1;
    if (isRed && isBig && !isOdd) hotCold[3] += 1;
    if (isBlue && isBig && !isOdd) hotCold[4] += 1;
    if (isGreen && isBig && !isOdd) hotCold[5] += 1;
    if (isRed && !isBig && isOdd) hotCold[6] += 1;
    if (isBlue && !isBig && isOdd) hotCold[7] += 1;
    if (isGreen && !isBig && isOdd) hotCold[8] += 1;
    if (isRed && !isBig && !isOdd) hotCold[9] += 1;
    if (isBlue && !isBig && !isOdd) hotCold[10] += 1;
    if (isGreen && !isBig && !isOdd) hotCold[11] += 1;
  });

  hotColdData.value = hotCold;
}

function calculateOmission(omissionData) {
  if (!issueHistory.value?.length) {
    omissionData.value = { 0: 100, 1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100, 7: 100, 8: 100, 9: 100, 10: 100, 11: 100 };
    return;
  }

  const positions = props.methodCurrent?.layout?.rows?.position || [7];
  const limitedData = issueHistory.value;
  const omission = { 0: 100, 1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100, 7: 100, 8: 100, 9: 100, 10: 100, 11: 100 };

  for (let i = 0; i < limitedData.length; i++) {
    const issue = limitedData[i];
    const number = parseInt(issue.code.split(',')[positions[0] - 1], 10);
    if (isNaN(number) || number === 49) continue;

    const isBig = number >= 25;
    const isOdd = number % 2 === 1;
    const numStr = String(number).padStart(2, '0');
    const isRed = redWave.includes(numStr);
    const isBlue = blueWave.includes(numStr);
    const isGreen = greenWave.includes(numStr);

    if (isRed && isBig && isOdd && omission[0] === 100) omission[0] = i;
    if (isBlue && isBig && isOdd && omission[1] === 100) omission[1] = i;
    if (isGreen && isBig && isOdd && omission[2] === 100) omission[2] = i;
    if (isRed && isBig && !isOdd && omission[3] === 100) omission[3] = i;
    if (isBlue && isBig && !isOdd && omission[4] === 100) omission[4] = i;
    if (isGreen && isBig && !isOdd && omission[5] === 100) omission[5] = i;
    if (isRed && !isBig && isOdd && omission[6] === 100) omission[6] = i;
    if (isBlue && !isBig && isOdd && omission[7] === 100) omission[7] = i;
    if (isGreen && !isBig && isOdd && omission[8] === 100) omission[8] = i;
    if (isRed && !isBig && !isOdd && omission[9] === 100) omission[9] = i;
    if (isBlue && !isBig && !isOdd && omission[10] === 100) omission[10] = i;
    if (isGreen && !isBig && !isOdd && omission[11] === 100) omission[11] = i;

    if (Object.values(omission).every(val => val !== 100)) break;
  }

  for (let key in omission) {
    if (omission[key] === 100) omission[key] = limitedData.length;
  }

  omissionData.value = omission;
}
</script>