<template>
  <div class="multiple">
    <label class="multiple__label">倍数：</label>
    <div>
      <span class="icon-sd icon-sd-minus" @click="handleMinus"></span>
      <input
          type="text"
          class="multiple-input"
          v-model="inputTime"
          placeholder="1"
          @change="onInputChange"
          @keyup.enter="onInputChange"
      />
      <span class="icon-sd icon-sd-plus1" @click="handlePlus"></span>
      <span
          v-for="(opt, idx) in timesOptions"
          :key="idx"
          class="quickMul"
          :class="{ first: idx===0 }"
          @click="setQuickTime(opt.value)"
      >
        {{ opt.value }}倍
      </span>

      <span class="quickMulSet" @click="showDialog = true">
        快捷
        <span class="icon-sd icon-sd-edit"></span>
      </span>
    </div>
    <!-- 弹窗 -->
    <el-dialog v-model="showDialog" title="设置快捷倍数" width="460px">
      <div class="dialog-content">
        <div class="times-items">
          <div v-for="(opt, index) in modifyOptions" :key="index" class="option-item">
            <input type="number" v-model.number="modifyOptions[index].value" class="option-input" />
          </div>
        </div>
        <div class="times-reset-btn"><el-button @click="resetOption">恢复默认</el-button></div>
      </div>
      <template #footer>
        <div style="text-align:center">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="saveOptions">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useCommonStore } from "@/stores/commonStore.js";

const props = defineProps({
  times: {
    type: Number,
    default: 1,
  },
});
const emit = defineEmits(["update:times"]);

const commonStore = useCommonStore();
const timesOptions = computed(() => commonStore.timesOptions);
const modifyOptions = ref([...timesOptions.value]);

const inputTime = ref(props.times);
const showDialog = ref(false);

watch(() => props.times, (newVal) => {
  inputTime.value = newVal;
});

function handleMinus() {
  let val = parseInt(inputTime.value, 10) || 1;
  if (val > 1) {
    val -= 1;
  }
  updateTimes(val);
}

function handlePlus() {
  let val = parseInt(inputTime.value, 10) || 1;
  val += 1;
  updateTimes(val);
}

function setQuickTime(val) {
  updateTimes(val);
}

function onInputChange() {
  let val = parseInt(inputTime.value, 10);
  if (isNaN(val) || val < 1) {
    val = 1;
  }
  updateTimes(val);
}

function updateTimes(val) {
  inputTime.value = val;
  emit("update:times", val);
}

function resetOption() {
  modifyOptions.value =commonStore.timesDefaultOptions;
  commonStore.setTimesOptions(commonStore.timesDefaultOptions);
}

function saveOptions() {
  const tmpOptions = modifyOptions.value.filter(opt => opt.value > 0);
  commonStore.setTimesOptions(tmpOptions);
  showDialog.value = false;
}
</script>

<style lang="scss" scoped>
.multiple {
  display: flex;
  margin-left: 5px;
  align-items: center;
  line-height: 1;
}

.multiple__label {
  font-size: 14px;
  color: #535d76;
  margin-right: 5px;
}

.multiple > div {
  height: 35px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid rgba(201,202,228,.57);
  overflow: hidden;
  font-size: 12px;
  color: #333;
  display: flex;
  align-items: center;
}

.multiple div .icon-sd {
  font-size: 10px;
  color: #535d76;
  padding: 2px 5px;
  cursor: pointer;
}

.multiple div .icon-sd:hover {
  color: #1c9eff;
}

.multiple div .quickMul {
  border-left: 1px solid #d4d5e7;
  color: #3d4864;
  padding: 0 8px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  line-height: 35px;
}

.multiple div .quickMul.first {
  border-left: 1px solid #d4d5e7;
}

.multiple div .quickMulSet {
  color: #3d4864;
  padding: 0 8px;
  border-left: 1px solid #d4d5e7;
  cursor: pointer;
}

.multiple-input {
  width: 50px;
  height: 17px;
  line-height: 14px;
  border: 1px solid #d4d5e7;
  border-top: none;
  border-bottom: none;
  background-color: transparent;
  vertical-align: middle;
  text-align: center;
  font-weight: 500;
  color: #3d4864;
  margin-top: -2px;
  margin-left: 4px;
  margin-right: 4px;
}

.dialog-content {
  .times-items {
    display: flex;
    justify-content: center;
    gap: 10px;
    .option-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .option-input {
      width: 100px;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .option-delete {
      font-size: 14px;
      color: red;
      cursor: pointer;
    }
  }
  .times-reset-btn {
    margin: 15px 0;
  }
}

</style>
