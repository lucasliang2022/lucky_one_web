<template>
  <item-zodiac
      :method-current="methodCurrentWithUpdatedLevels"
      :ball-data="zodiacWithCodes"
      :calculate-hot-cold-fn="calculateHotCold"
      :calculate-omission-fn="calculateOmission"
      :sort="sort"
      :store="store"
  />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { getBallColor } from "@/utils/common.ts";
import ItemZodiac from "./items/ItemZodiac.vue";

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

const { zodiacMap, issueHistory, numberToZodiac } = storeToRefs(props.store);

const zodiacWithCodes = computed(() => {
  return props.methodCurrent.layout.rows.number.map(item => {
    const codes = zodiacMap.value[item.value.toString()]?.numbers || [];
    return {
      ...item,
      extraContent: codes.map(num => ({
        title: num,
        color: getBallColor(num)
      }))
    };
  });
});

const methodCurrentWithUpdatedLevels = computed(() => {
  const zodiacNumbers = zodiacMap.value;
  const updatedLevels = props.methodCurrent.levels.map(level => {
    if (level.codes[0] === 'other') {
      const fourNumberZodiacs = Object.entries(zodiacNumbers)
          .filter(([_, data]) => data.numbers.length === 4)
          .map(([value]) => parseInt(value));
      return { ...level, codes: fourNumberZodiacs };
    } else if (level.codes[0] === 'first') {
      const fiveNumberZodiacs = Object.entries(zodiacNumbers)
          .filter(([_, data]) => data.numbers.length === 5)
          .map(([value]) => parseInt(value));
      return { ...level, codes: fiveNumberZodiacs };
    }
    return level;
  });
  return { ...props.methodCurrent, levels: updatedLevels };
});

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
    const stat = getNumber(issue);
    if (!stat) return;

    const matchForms = {
      1: stat.b,
      2: stat.s,
      3: stat.o,
      4: stat.e
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
      1: stat.b,
      2: stat.s,
      3: stat.o,
      4: stat.e
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

  const numStr = codeArray[positions[0] - 1];
  if (!numStr) return { b: false, s: false, o: false, e: false };

  const zodiacData = numberToZodiac.value[numStr];
  if (!zodiacData) return { b: false, s: false, o: false, e: false };

  const number = parseInt(numStr, 10);
  return {
    b: number >= 25,
    s: number <= 24,
    o: number % 2 !== 0,
    e: number % 2 === 0
  };
}
</script>