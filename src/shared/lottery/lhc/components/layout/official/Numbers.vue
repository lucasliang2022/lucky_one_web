<template>
  <div class="ball-show-area">
    <div class="row-container">
      <div class="ball-grid-container">
        <div v-for="(rowBalls, rowNum) in groupedBalls" :key="rowNum" class="ball-row">
          <div class="ball" v-for="(ball) in rowBalls" :key="ball.value">
            <div
                class="ball-item ball-circle ball-large"
                :class="[
                  ball.colorClass,
                  { 'selected': ball.selected, 'animated': ball.animating, 'zoomIn': ball.animating }
                ]"
                @click="toggleBall(ball)"
            >
              <div class="number-ball-wrap">
                <b>{{ ball.title }}</b>
              </div>
              <div class="ball-chm show-chm" v-if="showColdHot || showOmission">
                <span v-if="showColdHot && hotColdData[ball.value] !== null" class="hot-cold" :class="getHotColdClass(hotColdData[ball.value])">
                  {{ hotColdData[ball.value] ?? 0 }}
                </span>
                <span v-if="showOmission && omissionData[ball.value] !== null" class="omission" :class="getOmissionClass(omissionData[ball.value])">
                  {{ omissionData[ball.value] ?? '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-btns">
        <div class="btn-row" style="margin-bottom: 20px;">
          <span @click="handleQuick('all')" class="all">全</span>
          <span @click="handleQuick('big')" class="big">大</span>
          <span @click="handleQuick('small')" class="small">小</span>
          <span @click="handleQuick('odd')" class="odd">奇</span>
          <span @click="handleQuick('even')" class="even">偶</span>
          <span @click="handleQuick('clear')" class="clear">清</span>
        </div>
        <div class="btn-row" style="margin-bottom: 15px"></div>
        <div class="btn-row">
          <span @click="handleQuick('1')">鼠</span>
          <span @click="handleQuick('2')">牛</span>
          <span @click="handleQuick('3')">虎</span>
          <span @click="handleQuick('4')">兔</span>
          <span @click="handleQuick('5')">龙</span>
          <span @click="handleQuick('6')">蛇</span>
        </div>
        <div class="btn-row" style="margin-bottom: 10px">
          <span @click="handleQuick('7')">马</span>
          <span @click="handleQuick('8')">羊</span>
          <span @click="handleQuick('9')">猴</span>
          <span @click="handleQuick('10')">鸡</span>
          <span @click="handleQuick('11')">狗</span>
          <span @click="handleQuick('12')">猪</span>
        </div>
        <div class="btn-row" style="margin-bottom: 15px"></div>
        <div class="btn-row">
          <span @click="handleQuick('red')" class="hong">红波</span>
          <span @click="handleQuick('blue')" class="lan">蓝波</span>
          <span @click="handleQuick('green')" class="lv">绿波</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { redWave, greenWave, blueWave } from "@shared/utils/common.ts";
import { officialLogic } from '@lottery/base/logic/officialLogic';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const { zodiacMap } = storeToRefs(props.store);

function calculateSpecificHotCold(range, history, ballsData, positions) {
  const results = {};
  ballsData.forEach(ball => results[ball.value] = 0);
  if (!history || history.length === 0 || !positions || positions.length === 0) return results;
  const recentIssues = history.slice(0, range);
  ballsData.forEach(ball => {
    results[ball.value] = recentIssues.reduce((count, issue) => {
      const codes = issue.code.split(',');
      const formattedValue = ball.title;
      const found = positions.some(pos => pos > 0 && pos <= codes.length && codes[pos - 1] === formattedValue);
      return count + (found ? 1 : 0);
    }, 0);
  });
  return results;
}

function calculateSpecificOmission(history, ballsData, positions) {
  const results = {};
  ballsData.forEach(ball => results[ball.value] = 0);
  if (!history || history.length === 0 || !positions || positions.length === 0) return results;
  ballsData.forEach(ball => {
    let omission = 0;
    let found = false;
    for (let i = 0; i < history.length; i++) {
      const codes = history[i].code.split(',');
      const formattedValue = ball.title;
      if (positions.some(pos => pos > 0 && pos <= codes.length && codes[pos - 1] === formattedValue)) {
        results[ball.value] = omission;
        found = true;
        break;
      }
      omission++;
    }
    if (!found) {
      results[ball.value] = omission;
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
  showOmission,
  updateSelectedBalls,
  getLayoutConfig
} = officialLogic(props.store, {
  calculateHotColdFn: calculateSpecificHotCold,
  calculateOmissionFn: calculateSpecificOmission
});

const groupedBalls = computed(() => {
  return balls.value.reduce((acc, ball) => {
    const row = ball.row || 1;
    if (!acc[row]) {
      acc[row] = [];
    }
    acc[row].push(ball);
    return acc;
  }, {});
});

function handleQuick(type) {
  const maxSelected = getLayoutConfig('rows.max_selected', 12);

  const selectByCondition = (condition) => {
    balls.value.forEach(ball => ball.selected = false);
    let count = 0;
    balls.value.forEach(ball => {
      if (condition(ball.value) && count < maxSelected) {
        ball.selected = true;
        count++;
      }
    });
  };

  const selectByZodiac = (zodiacNumbers) => {
    balls.value.forEach(ball => ball.selected = false);
    let count = 0;
    const zodiacValues = zodiacNumbers.map(num => String(num).padStart(2, '0'));
    balls.value.forEach(ball => {
      if (zodiacValues.includes(ball.title) && count < maxSelected) {
        ball.selected = true;
        count++;
      }
    });
  };

  const selectByWave = (waveList) => {
    balls.value.forEach(ball => ball.selected = false);
    let count = 0;
    const waveValues = waveList.map(item => String(item).padStart(2, '0'));
    balls.value.forEach(ball => {
      if (waveValues.includes(ball.title) && count < maxSelected) {
        ball.selected = true;
        count++;
      }
    });
  };

  switch (type) {
    case 'all':
      selectByCondition(() => true);
      break;
    case 'big':
      selectByCondition(val => parseInt(val) >= 25);
      break;
    case 'small':
      selectByCondition(val => parseInt(val) < 25);
      break;
    case 'odd':
      selectByCondition(val => parseInt(val) % 2 === 1);
      break;
    case 'even':
      selectByCondition(val => parseInt(val) % 2 === 0);
      break;
    case 'clear':
      selectByCondition(() => false);
      break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '10':
    case '11':
    case '12':
      const zodiacIndex = parseInt(type) - 1;
      selectByZodiac(zodiacMap.value[zodiacIndex]?.numbers || []);
      break;
    case 'red':
      selectByWave(redWave);
      break;
    case 'blue':
      selectByWave(blueWave);
      break;
    case 'green':
      selectByWave(greenWave);
      break;
  }
  updateSelectedBalls();
}

defineExpose({ randomOneBet });
</script>

<style scoped>

:deep(.ball-item) {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

:deep(.ball-item.selected) {
  transform: scale(1.05);
}

.ball-show-area {
  display: flex;
  flex-direction: column;
  margin: 5px 10px;
}

.row-container {
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  gap: 20px;
}

.ball-grid-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
}

.ball-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  min-width: 0;
  gap: 10px 15px;
}

.ball {
  width: 38px;
  height: auto;
  position: relative;
  flex: 0 0 38px;
  margin-bottom: 18px;
}

.number-ball-wrap b {
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
}

.ball-chm span {
  display: inline-block;
}

.row-btns {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 260px;
  gap: 10px;
}

.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 6px;
}

.btn-row[style*="margin-bottom"] {
  margin-bottom: 6px !important;
}

.btn-row span {
  padding: 5px 7px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  text-align: center;
  flex-grow: 1;
  min-width: 30px;
}

.btn-row span:hover {
  background-color: #e9e9e9;
  border-color: #bbb;
}

.btn-row span.hong {
  background-color: #ffebee;
  border-color: #ef9a9a;
  color: #c62828;
}
.btn-row span.lan {
  background-color: #e3f2fd;
  border-color: #90caf9;
  color: #1565c0;
}
.btn-row span.lv {
  background-color: #e8f5e9;
  border-color: #a5d6a7;
  color: #2e7d32;
}

.btn-row span.hong:hover {
  background-color: #ffcdd2;
}
.btn-row span.lan:hover {
  background-color: #bbdefb;
}
.btn-row span.lv:hover {
  background-color: #c8e6c9;
}
</style>