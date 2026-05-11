<template>
  <div :class="$style.ballShowArea">
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
        2、每注号码之间请用<span :class="$style.highlight">换行、逗号、空格或分号</span>等符号隔开。<br>
        <h1>导入注单操作</h1>
        1、导入的注单文件，必须是txt格式文件。<br>
        2、可点击导入按钮或者将文件拖拽到文本框进行上传。<br>
        3、最高可导入 <span :class="$style.highlight">{{ maxImportCount }}</span> 注，若文件较大会导致导入时间过长，请耐心等待。<br>
      </div>
    </div>
    <div :class="$style.buttonGroup">
      <el-upload
          ref="uploadRef"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          accept=".txt"
          :on-change="handleFileUpload"
      >
        <el-button size="large" type="primary">
          上传文件
        </el-button>
      </el-upload>
      <el-button size="large" @click="clearInput">
        取消
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineExpose } from 'vue';
import { ElInput, ElButton, ElUpload } from 'element-plus';
import { OfficialLogicInput } from '@lottery/logic/OfficialLogicInput';
import styles from '@/assets/scss/lottery/lottery.module.scss';

const $style = styles;

// Accept the store (or necessary refs) as a prop
const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});

// Use the composable
const {
  inputText,
  uploadRef, // Pass the ref for el-upload
  handleInput,
  handleBlur,
  handleDrop,
  handleFileUpload,
  clearInput,
  randomOneBet // Get the random function
} = OfficialLogicInput(props.store);

// Compute max count for placeholder
const maxImportCount = computed(() => {
  return props.store.officialMethodCurrent.value?.layout?.code_total_count?.max ?? '100000';
});

// Expose the randomOneBet function so the parent can call it
defineExpose({
  randomOneBet
});
</script>

<style module>
/* Styles are imported from the SCSS module */
/* Add any component-specific layout adjustments here if needed */
.ballShowArea {
  display: flex;
  flex-direction: column;
  padding: 10px; /* Add some padding */
  gap: 15px; /* Add gap between input and buttons */
}

.inputWrapper {
  position: relative;
  width: 100%;
}

.ticketInput :deep(.el-textarea__inner) { /* Style element-plus component */
  font-size: 14px; /* Adjust font size */
  border-radius: 4px;
  padding: 10px;
  caret-color: #409eff;
  line-height: 1.6;
  min-height: 150px; /* Ensure a minimum height */
  font-family: monospace; /* Good for code */
}

.customPlaceholder {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #a0a0a0; /* Lighter placeholder text */
  font-size: 13px;
  line-height: 1.6;
  pointer-events: none;
  padding: 5px;
  /* background: rgba(255, 255, 255, 0.8); remove background */
  border-radius: 4px;
  z-index: 1;
  text-align: left;
}

.customPlaceholder h1 {
  font-size: 13px;
  font-weight: bold;
  color: #777; /* Subdued heading */
  margin: 8px 0 4px;
}

.customPlaceholder .highlight {
  color: #409eff;
  font-weight: bold;
}

.buttonGroup {
  display: flex;
  justify-content: flex-start; /* Align buttons left */
  gap: 10px;
  /* margin-top: 15px; /* Gap handles spacing */
}

/* Scoped styles will not apply inside el-button/el-upload easily */
/* Use global styles or :deep selector for icons if needed */
/* Example: */
:global(.icon-sd) {
  margin-right: 4px;
}
:global(.el-button span[class*="icon-sd-upload3"]) {
  color: #fff;
}
:global(.el-button span[class*="icon-sd-back_3"]) {
  color: var(--el-color-primary);
}

</style>