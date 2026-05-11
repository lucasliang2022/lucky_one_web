<template>
  <ul class="ball-show-area">
    <li class="ball-row head">
      <div class="row-title"><span>头数</span></div>
      <div class="row-ball-list">
        <div
            class="ball-item ball-rectangle"
            v-for="(ball) in headBalls"
            :key="ball.value"
            :class="{ selected: ball.selected, animated: ball.animating, 'zoomIn': ball.animating }"
            @click="toggleBall(ball)"
        >
          <div class="content-wrapper">
            <div class="show-number">
              <b>{{ ball.title }}</b>
            </div>
            <div class="show-price" v-if="ball.prize">
              <span>{{ ball.prize }}</span>
            </div>
          </div>
          <div class="show-tips" v-if="ball.tips">
            <el-tooltip
                class="box-item"
                effect="dark"
                :content="ball.tips"
                placement="top-start"
            >
              <span class="icon-sd icon-sd-help"></span>
            </el-tooltip>
          </div>
          <div class="show-chm" v-if="showColdHot || showOmission">
            <span class="ball-ch chm" v-if="showColdHot && hotColdData[ball.value] !== null">
              <span :class="getHotColdClass(hotColdData[ball.value])">{{ hotColdData[ball.value] ?? 0 }}</span>
            </span>
            <span class="ball-m chm" v-if="showOmission && omissionData[ball.value] !== null">
              <span :class="getOmissionClass(omissionData[ball.value])">{{ omissionData[ball.value] ?? 0 }}</span>
            </span>
          </div>
        </div>
      </div>
    </li>
    <li class="ball-row tail">
      <div class="row-title"><span>尾数</span></div>
      <div class="row-ball-list">
        <div
            class="ball-item ball-rectangle"
            v-for="(ball) in tailBalls"
            :key="ball.value"
            :class="{ selected: ball.selected, animated: ball.animating, 'zoomIn': ball.animating }"
            @click="toggleBall(ball)"
        >
          <div class="content-wrapper">
            <div class="show-number">
              <b>{{ ball.title }}</b>
            </div>
            <div class="show-price" v-if="ball.prize">
              <span>{{ ball.prize }}</span>
            </div>
          </div>
          <div class="show-tips" v-if="ball.tips">
            <el-tooltip
                class="box-item"
                effect="dark"
                :content="ball.tips"
                placement="top-start"
            >
              <span class="icon-sd icon-sd-help"></span>
            </el-tooltip>
          </div>
          <div class="show-chm" v-if="showColdHot || showOmission">
            <span class="ball-ch chm" v-if="showColdHot && hotColdData[ball.value] !== null">
              <span :class="getHotColdClass(hotColdData[ball.value])">{{ hotColdData[ball.value] ?? 0 }}</span>
            </span>
            <span class="ball-m chm" v-if="showOmission && omissionData[ball.value] !== null">
              <span :class="getOmissionClass(omissionData[ball.value])">{{ omissionData[ball.value] ?? 0 }}</span>
            </span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { computed } from "vue";
import { officialLogic } from '@/lottery/logic/officialLogic.js';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const getHeadTailFromCode = (codeValue) => {
  const num = parseInt(codeValue);
  if (isNaN(num) || num < 1 || num > 49) return { head: null, tail: null };
  const tailDigit = num % 10;
  const headDigit = Math.floor(num / 10);
  return { head: headDigit, tail: tailDigit };
};

const mapHeadTailToValue = (head, tail) => {
  const headMap = { 0:0, 1:1, 2:2, 3:3, 4:4 };
  const tailMap = { 0:5, 1:6, 2:7, 3:8, 4:9, 5:10, 6:11, 7:12, 8:13, 9:14 };
  return {
    headValue: headMap[head] ?? null,
    tailValue: tailMap[tail] ?? null
  };
};

function calculateSpecificHotCold(range, history, ballsData, positions) {
  const results = {};
  ballsData.forEach(ball => results[ball.value] = 0);
  if (!history || history.length === 0 || !positions || positions.length === 0) {
    return results;
  }
  const recentIssues = history.slice(0, range);
  recentIssues.forEach(issue => {
    const codes = issue.code.split(',');
    const targetCode = codes[positions[0] - 1];
    if (targetCode) {
      const { head, tail } = getHeadTailFromCode(targetCode);
      const { headValue, tailValue } = mapHeadTailToValue(head, tail);
      if (headValue !== null && results[headValue] !== undefined) {
        results[headValue]++;
      }
      if (tailValue !== null && results[tailValue] !== undefined) {
        results[tailValue]++;
      }
    }
  });
  return results;
}

function calculateSpecificOmission(history, ballsData, positions) {
  const results = {};
  ballsData.forEach(ball => results[ball.value] = 0);
  if (!history || history.length === 0 || !positions || positions.length === 0) {
    return results;
  }

  const found = {};
  ballsData.forEach(ball => found[ball.value] = false);

  for (let i = 0; i < history.length; i++) {
    const issue = history[i];
    const codes = issue.code.split(',');
    const targetCode = codes[positions[0] - 1];

    if(targetCode) {
      const { head, tail } = getHeadTailFromCode(targetCode);
      const { headValue, tailValue } = mapHeadTailToValue(head, tail);

      if (headValue !== null && !found[headValue]) {
        results[headValue] = i;
        found[headValue] = true;
      }
      if (tailValue !== null && !found[tailValue]) {
        results[tailValue] = i;
        found[tailValue] = true;
      }
    }

    ballsData.forEach(ball => {
      if (!found[ball.value]) {
        results[ball.value] = i + 1;
      }
    });

    if (Object.values(found).every(f => f)) break;
  }

  ballsData.forEach(ball => {
    if (!found[ball.value]) {
      results[ball.value] = history.length;
    }
  });

  return results;
}

const {
  balls,
  hotColdData,
  omissionData,
  toggleBall,
  randomOneBet,
  getHotColdClass,
  getOmissionClass,
  showColdHot,
  showOmission
} = officialLogic(props.store, {
  calculateHotColdFn: calculateSpecificHotCold,
  calculateOmissionFn: calculateSpecificOmission
});

const headBalls = computed(() => balls.value.filter(ball => ball.row === 1));
const tailBalls = computed(() => balls.value.filter(ball => ball.row === 2));

defineExpose({ randomOneBet });
</script>

<style lang="scss" scoped>
.ball-show-area {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ball-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.row-title {
  width: 60px;
  padding-top: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
  margin-right: 15px;
}

.row-ball-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 15px;
  justify-content: flex-start;
}

.ball-item {
  cursor: pointer;
  position: relative;
  width: 145px;
  height: 65px;
  background: #fff;
  border: 1px solid #e1e6ea;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .show-number {
    margin-bottom: 4px;
  }

  .show-tips {
    position: absolute;
    right: 5px;
    top: 3px;
    background: none;
    color: #050505;

    .icon-sd {
      font-size: 13px;
      color: #1c9eff;
    }
  }

  b {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>