<template>
  <div v-if="positionsConfig" :class="$style.positionsWrapper">
    <span :class="$style.positionsTitle">选择位置</span>
    <el-checkbox-group
        v-model="selectedPositions"
    >
      <el-checkbox
          v-for="(label, value) in positionsConfig.options"
          :key="value"
          :value="value"
          @change="togglePosition(value)"
      >
        {{ label }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
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
import {ElInput, ElButton, ElUpload, ElCheckbox, ElCheckboxGroup} from 'element-plus';
import { OfficialLogicInput } from '@lottery/base/logic/OfficialLogicInput';
import styles from '@/assets/scss/lottery/lottery.module.scss';
import {storeToRefs} from "pinia";
const $style = styles;
const props = defineProps({
  store: {
    type: Object,
    required: true
  }
});


const {
  inputText,
  uploadRef,
  handleInput,
  handleBlur,
  handleDrop,
  handleFileUpload,
  clearInput,
  randomOneBet
} = OfficialLogicInput(props.store);

const { officialMethodCurrent, selectedPositions  } = storeToRefs(props.store);

const positionsConfig = officialMethodCurrent.value?.layout?.positions || null;

const maxImportCount = computed(() => {
  return props.store.officialMethodCurrent.value?.layout?.code_total_count?.max ?? '100000';
});

defineExpose({
  randomOneBet
});
</script>

<style module>
.ballShowArea {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 15px;
}

.inputWrapper {
  position: relative;
  width: 100%;
}

.ticketInput :deep(.el-textarea__inner) {
  font-size: 14px;
  border-radius: 4px;
  padding: 10px;
  caret-color: #409eff;
  line-height: 1.6;
  min-height: 150px;
  font-family: monospace;
}

.customPlaceholder {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #a0a0a0;
  font-size: 13px;
  line-height: 1.6;
  pointer-events: none;
  padding: 5px;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
}

.customPlaceholder h1 {
  font-size: 13px;
  font-weight: bold;
  color: #777;
  margin: 8px 0 4px;
}

.customPlaceholder .highlight {
  color: #409eff;
  font-weight: bold;
}

.buttonGroup {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

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