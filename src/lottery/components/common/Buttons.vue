<template>
  <div :class="['btn-row', { 'long-row': longRow }]">
    <span @click="handleQuick('all')" class="all">{{ t('lottery.layouts.buttons.all') }}</span>
    <span @click="handleQuick('big')" class="big">{{ t('lottery.layouts.buttons.big') }}</span>
    <span @click="handleQuick('small')" class="small">{{ t('lottery.layouts.buttons.small') }}</span>
    <span @click="handleQuick('odd')" class="odd">{{ t('lottery.layouts.buttons.odd') }}</span>
    <span @click="handleQuick('even')" class="even">{{ t('lottery.layouts.buttons.even') }}</span>
    <span @click="handleQuick('clear')" class="clear">{{ t('lottery.layouts.buttons.clear') }}</span>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const props = defineProps({
  rowIndex: {
    type: Number,
    default: 1,
  },
  longRow: {
    type: Boolean,
    default: false,
  }
});
const emit = defineEmits(['click:handleQuick']);
const { t } = useI18n()

function handleQuick(type) {
  emit('click:handleQuick', type, props.rowIndex);
}
</script>
<style lang="scss" scoped>
.btn-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  margin-left: 20px;
}

.long-row {
  margin-top: 5px !important;
}

.btn-row span {
  padding: 4px 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-row span:hover {
  background-color: #e3f2fd;
}
</style>
