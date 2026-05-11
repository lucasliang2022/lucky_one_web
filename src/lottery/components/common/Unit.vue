<template>
  <div class="unit-wrapper">
    <div class="unit-title">每注：</div>
    <div class="unit-selector">
      <span
          v-for="(opt, idx) in unitOptions"
          :key="idx"
          :class="{ active: price === opt.value  }"
          @click="onSelectUnit(opt.value)"
      >
        {{ opt.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useCommonStore } from '@/stores/commonStore.js';

const props = defineProps({
  price: {
    type: Number,
    default: 1,
  }
});
const emit = defineEmits(['update:price']);
const commonStore = useCommonStore();
const unitOptions = computed(() => commonStore.unitOptions);

onMounted(() => {
  if (unitOptions.value.length > 0 && !unitOptions.value.some(opt => opt.value === props.unit)) {
    emit("update:price", unitOptions.value[0].value);
  }
});

function onSelectUnit(val) {
  emit("update:price", val);
}
</script>

<style lang="scss" scoped>
.unit-wrapper {
  display: flex;
  align-items: center;
  min-height: 40px;
  .unit-title {
    font-size: 13px;
    color: #535d76;
    margin-right: 1px;
  }
  .unit-selector {
    display: flex;
    width: 260px;
    min-width: 160px;
    height: 35px;
    border: 1px solid rgba(201, 202, 228, .57);
    border-radius: 4px;
    background: #fff;
    overflow: hidden;
    span {
      position: relative;
      display: inline-block;
      flex: 1;
      font-size: 12px;
      color: #535d76;
      text-align: center;
      vertical-align: top;
      cursor: pointer;
      white-space: nowrap;
      line-height: 35px;
      &:after {
        position: absolute;
        right: -1px;
        top: 8px;
        content: "";
        display: inline-block;
        width: 1px;
        height: 17px;
        background-color: #d4d5e7;
      }
      &.active {
        background: #1c9eff;
        color: #fff;
      }
    }
  }
}
</style>
