<template>
  <div class="ball-show-area">
    <div class="input-wrapper">
      <el-input
          v-model="inputText"
          type="textarea"
          :rows="10"
          @input="handleInput"
          @blur="handleBlur"
          @drop="handleDrop"
          @dragover.prevent
          class="ticket-input"
      />
      <div v-if="!inputText" class="custom-placeholder">
        <h1>输入注单操作</h1>
        1、请将您要投注的号码输入或粘贴到输入框中。<br>
        2、每两注号码之间请用<span class="highlight">,;|</span>等符号隔开。<br>
        <h1>导入注单操作</h1>
        1、导入的注单文件，必须是txt格式文件。<br>
        2、可点击导入按钮或者将文件拖拽到文本框进行上传。<br>
        3、最高可以导入10万注，若文件较大会导致导入时间过长，请耐心等待。<br>
      </div>
    </div>
    <div class="button-group">
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
      <el-button size="large" @click="clearInput"><span class="icon-sd icon-sd-back_3" style="margin-right: 4px; color: var(--el-color-primary);"></span>取消</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { ElInput, ElButton, ElUpload, ElMessageBox } from 'element-plus';

const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

const {
  officialMethodCurrent,
  reset,
  officialSelectedBalls,
  officialBetCount,
} = storeToRefs(props.store);

const inputText = ref('');
const upload = ref(null);

watch(
    () => officialMethodCurrent.value,
    () => {
      inputText.value = '';
      updateSelectedBalls();
    },
    { immediate: true }
);

watch(
    () => reset.value,
    newReset => {
      if (newReset) {
        inputText.value = '';
        updateSelectedBalls();
        reset.value = false;
      }
    }
);

function handleInput() {
  updateSelectedBalls();
}

function handleBlur() {
  const rowSeparator = officialMethodCurrent.value?.layout?.row_separator || ',|， ；;';
  const { validTickets, invalidTickets } = validateTickets(inputText.value);
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

function validateTickets(text) {
  console.log(text);
  if (!text || text.trim() === '') return { validTickets: [], invalidTickets: [] };
  const layout = officialMethodCurrent.value?.layout ?? []
  const rowConfig = officialMethodCurrent.value?.layout?.rows[0] ?? []
  const allowedNumbers = rowConfig.allowed_numbers || [1,2,3,4,5,6,7,8,9,10];
  const rowLength = rowConfig.length || 5;
  const maxTicketCount = layout.code_total_count?.max || 100000;
  const unitRepeat = rowConfig.unit_repeat !== false;
  const unitSeparator = rowConfig.unit_separator;
  const rawTickets = text.split(new RegExp(`[${unitSeparator}]`)).map(t => t.trim()).filter(t => t.length > 0);
  const validTickets = [];
  const invalidTickets = [];
  const seenTickets = new Set();

  for (let ticket of rawTickets) {
    ticket = ticket.replace(/[^0-9]/g, '');
    const ticketObj = { value: ticket };

    if (ticket.length !== rowLength) {
      invalidTickets.push(ticketObj);
      continue;
    }

    const ticketNumbers = ticket.split('').map(num => parseInt(num));
    if (!ticketNumbers.every(num => allowedNumbers.includes(num))) {
      invalidTickets.push(ticketObj);
      continue;
    }

    if (!unitRepeat && seenTickets.has(ticket)) {
      invalidTickets.push(ticketObj);
      continue;
    }

    seenTickets.add(ticket);
    validTickets.push(ticketObj);

    if (validTickets.length >= maxTicketCount) {
      invalidTickets.push({ value: '剩余注单' });
      break;
    }
  }

  return { validTickets, invalidTickets };
}

function handleDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.type === 'text/plain') {
    readFile(file);
  }
}

function handleFileUpload(file) {
  if (file && file.raw.type === 'text/plain') {
    readFile(file.raw);
  }
}

function readFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    inputText.value = e.target.result;
    updateSelectedBalls();
  };
  reader.readAsText(file);
}

function clearInput() {
  inputText.value = '';
  updateSelectedBalls();
}

function updateSelectedBalls() {
  const separator = officialMethodCurrent.value?.layout?.rows?.separator || ',|';
  const { validTickets } = validateTickets(inputText.value, separator);
  const tickets = validTickets.map(ticket => ({ value: ticket.value, title: ticket.value }));
  const count = calculateBetCount(tickets);
  officialSelectedBalls.value = tickets;
  officialBetCount.value = count;
}

function calculateBetCount(tickets) {
  const rowLength = officialMethodCurrent.value?.layout?.rows?.length || 5;
  if (!tickets.length || tickets.some(t => t.value.length !== rowLength)) return 0;
  return tickets.length;
}

function randomOneBet() {
  const rowLength = officialMethodCurrent.value?.layout?.rows?.length || 5;
  const allowedNumbers = officialMethodCurrent.value?.layout?.rows?.allowed_numbers || [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const unitRepeat = officialMethodCurrent.value?.layout?.rows?.unit_repeat !== false;

  let selected = '';
  let available = [...allowedNumbers];
  for (let i = 0; i < rowLength; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    selected += available[randomIndex].toString();
    if (!unitRepeat) available.splice(randomIndex, 1);
  }
  return [{ value: selected, title: selected }];
}

defineExpose({ randomOneBet });
</script>

<style scoped>
.ball-show-area {
  display: flex;
  flex-direction: column;
  margin: 2px 5px;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.ticket-input {
  width: 100%;
}

.custom-placeholder {
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
}

.custom-placeholder h1 {
  font-size: 14px;
  font-weight: bold;
  color: #535d76;
  margin: 10px 0;
}

.custom-placeholder .highlight {
  color: #409eff;
  font-weight: bold;
}

.button-group {
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