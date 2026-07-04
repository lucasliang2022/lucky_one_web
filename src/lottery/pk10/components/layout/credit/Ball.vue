<template xmlns="">
  <item-default
      :method-current="methodCurrent"
      :ball-data="methodCurrent.layout.rows[0].number"
      :calculate-hot-cold-fn="calculateHotCold"
      :calculate-omission-fn="calculateOmission"
      :sort="sort"
      :use-circle="true"
      :store="store"
  />
</template>
<script lang="ts" setup>
import ItemDefault from "./items/ItemDefault.vue";
import { storeToRefs } from "pinia";
import { Ref, type PropType } from 'vue';
import type { LotteryStore } from '@lottery/base/stores/storeTypes';
import {HotCold, Omission, IssueItem} from "@/types";

const props = defineProps({
  store: {
    type: Object as PropType<LotteryStore>,
    required: true
  },
  methodCurrent: {
    type: Object,
    required: true
  },
  sort: {
    type: Number,
    default: 1,
  }
});

const {
  issueHistory,
} = storeToRefs(props.store);

interface Stat {
  b: boolean;
  s: boolean;
  o: boolean;
  e: boolean;
}

function calculateHotCold(issueCount: number, hotColdData: Ref<HotCold>): void {
  if (!issueHistory.value?.length) {
    hotColdData.value = {};
    return;
  }
  const recentIssues = issueHistory.value.slice(0, issueCount) as IssueItem[];
  const hotCold: HotCold = {};

  (props.methodCurrent.layout?.rows?.[0]?.number as any[] || []).forEach(ball => {
    hotCold[ball] = 0;
  });

  recentIssues.forEach(issue => {
    const stat = getNumber(issue);
    if (!stat) return;

    const matchForms: Record<string, boolean | undefined> = {
      '1': stat.b,
      '2': stat.s,
      '3': stat.o,
      '4': stat.e
    };

    for (const key in matchForms) {
      if (matchForms[key]) {
        hotCold[key] = (hotCold[key] || 0) + 1;
      }
    }
  });

  hotColdData.value = hotCold;
}

function calculateOmission(omissionData: Ref<Omission>): void {
  if (!issueHistory.value?.length) {
    omissionData.value = {};
    return;
  }

  const omission: Omission = {};
  (props.methodCurrent.layout?.rows?.[0]?.number as any[] || []).forEach(ball => {
    omission[ball] = -1;
  });

  for (let index = 0; index < (issueHistory.value as IssueItem[]).length; index++) {
    const issue = (issueHistory.value as IssueItem[])[index];
    const stat = getNumber(issue);
    if (!stat) continue;

    const matchForms: Record<string, boolean | undefined> = {
      '1': stat.b,
      '2': stat.s,
      '3': stat.o,
      '4': stat.e
    };

    for (const key in matchForms) {
      if (matchForms[key] && omission[key] === -1) {
        omission[key] = index;
      }
    }

    if (!Object.values(omission).includes(-1)) {
      break;
    }
  }

  for (const key in omission) {
    if (omission[key] === -1) {
      omission[key] = (issueHistory.value as IssueItem[]).length;
    }
  }

  omissionData.value = omission;
}

function getNumber(issue: IssueItem): Stat | null {
  const chmPosition = props.methodCurrent?.layout?.rows?.[0]?.position;
  if (!chmPosition) return null;
  const positions = Array.isArray(chmPosition) ? chmPosition : [chmPosition];
  if (!issue.open_code) {
    return { b: false, s: false, o: false, e: false }
  }

  const codeArray = issue.open_code.split(',');
  const numStr = codeArray[positions[0] - 1];
  const number = parseInt(numStr, 10);

  if (isNaN(number) || number === 49) {
    return { b: false, s: false, o: false, e: false };
  }

  return {
    b: number >= 25,
    s: number <= 24,
    o: number % 2 !== 0,
    e: number % 2 === 0
  };
}
</script>