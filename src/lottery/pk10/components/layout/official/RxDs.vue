<template>
  <div :class="$style.lotteryArea">
    <div :class="$style.positionsWrapper">
      <el-checkbox-group
          v-model="selectedPositions"
          :min="positionsConfig.min_checked"
          :max="positionsConfig.max_checked"
      >
        <el-checkbox
            v-for="(label, value) in positionsConfig.options"
            :key="value"
            :label="value"
        >
          {{ label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div :class="$style.inputWrapper">
      <el-input
          v-model="inputText"
          type="textarea"
          :rows="10"
          @input="handleInput"
          @blur="handleBlur"
          @drop="handleDrop"
          @dragover.prevent
          :class="$style.ticketInput"
      />
      <div v-if="!inputText" :class="$style.customPlaceholder">
        <h1>输入注单操作</h1>
        1、请将您要投注的号码输入或粘贴到输入框中。<br>
        2、每两注号码之间请用<span class="highlight">,;|</span>等符号隔开。<br>
        <h1>导入注单操作</h1>
        1、导入的注单文件，必须是txt格式文件。<br>
        2、可点击导入按钮或者将文件拖拽到文本框进行上传。<br>
        3、最高可以导入10万注，若文件较大会导致导入时间过长，请耐心等待。<br>
      </div>
    </div>
    <div :class="$style.buttonGroup">
      <el-upload
          ref="upload"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          accept=".txt"
          :on-change="handleFileUpload"
      >
        <el-button size="large" type="primary">
          <span class="icon-sd icon-sd-upload3" style="margin-right: 4px; color: #fff;"></span>上传文件
        </el-button>
      </el-upload>
      <el-button size="large" @click="clearInput">
        <span class="icon-sd icon-sd-back_3" style="margin-right: 4px; color: var(--el-color-primary);"></span>取消
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { ElInput, ElButton, ElUpload, ElMessageBox, ElCheckbox, ElCheckboxGroup } from 'element-plus';
import styles from '@/assets/scss/lottery/pk10.module.scss';

const $style = styles;

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const { officialMethodCurrent, reset, officialSelectedBalls, officialBetCount } = storeToRefs(props.store);

const inputText = ref('');
const upload = ref(null);
const selectedPositions = ref([]);

// 位置配置
const positionsConfig = officialMethodCurrent.value?.layout?.positions || {
  options: {},
  min_checked: 2,
  max_checked: 10
};

// 初始化位置选择
watch(
    () => officialMethodCurrent.value,
    (newConfig) => {
      if (newConfig) {
        inputText.value = '';
        selectedPositions.value = [];
        updateSelectedBalls();
      }
    },
    { immediate: true }
);

// 处理 reset
watch(
    () => reset.value,
    (newVal) => {
      if (newVal) {
        inputText.value = '';
        selectedPositions.value = [];
        updateSelectedBalls();
        reset.value = false;
      }
    }
);

// 输入处理
function handleInput() {
  updateSelectedBalls();
}

// 失焦处理
function handleBlur() {
  const rowSeparator = officialMethodCurrent.value?.layout?.rows?.row_separator || ',|， ；;';
  const { validTickets, invalidTickets } = validateTickets(inputText.value, rowSeparator);
  const formattedText = validTickets.map(ticket => ticket.value).join(rowSeparator[0]);

  if (inputText.value !== formattedText) {
    if (invalidTickets.length > 0) {
      const message = `已保留 ${validTickets.length} 个有效注单，已移除 ${invalidTickets.length} 个无效注单。`;
      ElMessageBox.alert(message, '注单校验结果', {
        confirmButtonText: '确定',
        callback: () => {
          inputText.value = formattedText;
          updateSelectedBalls();
        }
      });
    } else {
      inputText.value = formattedText;
      updateSelectedBalls();
    }
  }
}

// 验证注单
function validateTickets(text, rowSeparator) {
  if (!text || text.trim() === '') return { validTickets: [], invalidTickets: [] };

  const allowedNumbers = officialMethodCurrent.value?.layout?.rows?.allowed_numbers || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const rowLength = officialMethodCurrent.value?.layout?.rows?.length || 2;
  const maxTicketCount = officialMethodCurrent.value?.layout?.max_ticket_count || 100000;
  const rowRepeat = officialMethodCurrent.value?.layout?.rows?.row_repeat !== false;
  const unitRepeat = officialMethodCurrent.value?.layout?.rows?.unit_repeat !== false;
  const unitSeparator = officialMethodCurrent.value?.layout?.rows?.unit_separator || ' ';

  const rawTickets = text.split(new RegExp(`[${rowSeparator}]`)).map(t => t.trim()).filter(t => t.length > 0);
  const validTickets = [];
  const invalidTickets = [];
  const seenTickets = new Set();

  for (let ticket of rawTickets) {
    const ticketObj = { value: ticket };
    const ticketNumbers = ticket.split(unitSeparator).map(num => num.trim()).filter(num => num.length > 0);

    // 检查注单长度
    if (ticketNumbers.length !== rowLength) {
      invalidTickets.push(ticketObj);
      continue;
    }

    // 检查每个号码是否有效
    const numbers = ticketNumbers.map(num => {
      const n = parseInt(num, 10);
      return allowedNumbers.includes(n) ? n.toString().padStart(2, '0') : null;
    });

    if (numbers.some(n => n === null)) {
      invalidTickets.push(ticketObj);
      continue;
    }

    // 检查单注内号码是否重复
    if (!unitRepeat && new Set(numbers).size !== numbers.length) {
      invalidTickets.push(ticketObj);
      continue;
    }

    // 格式化注单
    const formattedTicket = numbers.join(unitSeparator);
    ticketObj.value = formattedTicket;

    // 检查注单是否重复
    if (!rowRepeat && seenTickets.has(formattedTicket)) {
      invalidTickets.push(ticketObj);
      continue;
    }

    seenTickets.add(formattedTicket);
    validTickets.push(ticketObj);

    if (validTickets.length >= maxTicketCount) {
      invalidTickets.push({ value: '剩余注单' });
      break;
    }
  }

  return { validTickets, invalidTickets };
}

// 处理拖放文件
function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.type === 'text/plain') {
    readFile(file);
  }
}

// 处理文件上传
function handleFileUpload(file) {
  if (file && file.raw.type === 'text/plain') {
    readFile(file.raw);
  }
}

// 读取文件
function readFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    inputText.value = e.target.result;
    updateSelectedBalls();
  };
  reader.readAsText(file);
}

// 清空输入
function clearInput() {
  inputText.value = '';
  updateSelectedBalls();
}

// 更新选中注单
function updateSelectedBalls() {
  const rowSeparator = officialMethodCurrent.value?.layout?.rows?.row_separator || ',|， ；;';
  const { validTickets } = validateTickets(inputText.value, rowSeparator);
  const tickets = validTickets.map(ticket => ({ value: ticket.value, title: ticket.value }));
  const count = calculateBetCount(tickets);
  officialSelectedBalls.value = tickets;
  officialBetCount.value = count;
}

// 计算注数
function calculateBetCount(tickets) {
  if (!tickets.length) return 0;

  const rowLength = officialMethodCurrent.value?.layout?.rows?.length || 2;
  if (tickets.some(t => {
    const numbers = t.value.split(officialMethodCurrent.value?.layout?.rows?.unit_separator || ' ').filter(num => num.length > 0);
    return numbers.length !== rowLength;
  })) return 0;

  // 检查是否至少选中 2 个位置
  if (selectedPositions.value.length < positionsConfig.min_checked) {
    return 0;
  }

  return tickets.length;
}

// 随机生成一注
function randomOneBet() {
  const rowLength = officialMethodCurrent.value?.layout?.rows?.length || 2;
  const allowedNumbers = officialMethodCurrent.value?.layout?.rows?.allowed_numbers || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const unitRepeat = officialMethodCurrent.value?.layout?.rows?.unit_repeat !== false;
  const unitSeparator = officialMethodCurrent.value?.layout?.rows?.unit_separator || ' ';

  // 随机选择 2 个位置（如果未选中，至少选 2 个）
  const positionsToSelect = selectedPositions.value.length >= positionsConfig.min_checked
      ? selectedPositions.value
      : Object.keys(positionsConfig.options).slice(0, positionsConfig.min_checked);
  selectedPositions.value = positionsToSelect;

  let selected = [];
  let available = [...allowedNumbers];
  for (let i = 0; i < rowLength; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    selected.push(available[randomIndex].toString().padStart(2, '0'));
    if (!unitRepeat) available.splice(randomIndex, 1);
  }
  const ticket = selected.join(unitSeparator);
  return [{ value: ticket, title: ticket }];
}

defineExpose({ randomOneBet });
</script>

<style lang="scss" scoped>
// 使用 pk10.module.scss 中的通用样式
.lotteryArea {
  display: flex;
  flex-direction: column;
  margin: 2px 5px;
}

.positionsWrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.inputWrapper {
  position: relative;
  width: 100%;
}

.ticketInput {
  width: 100%;
}

.customPlaceholder {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #535d76;
  font-size: 14px;
  line-height: 1.5;
  pointer-events: none;
  padding: 5px;
  background: rgba(255, 255, 255);
  border-radius: 4px;
  z-index: 1;
  text-align: left;

  h1 {
    font-size: 14px;
    font-weight: bold;
    color: #535d76;
    margin: 10px 0;
  }

  .highlight {
    color: #409eff;
    font-weight: bold;
  }
}

.buttonGroup {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

:deep(.el-textarea__inner) {
  font-size: 16px;
  border-radius: 3px;
  padding: 8px;
  caret-color: #409eff;
  line-height: 1.5;
}
</style>