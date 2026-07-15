<template>
  <div
      :class="[
      $style.ballItem,
      shape === 'rectangle' ? $style.rectangle : $style.circle
    ]"
  >
    <div
        :class="[
        shape === 'rectangle' ? $style.ballRectangle : $style.ballCircle,
        {
          [$style.selected]: optionData.selected,
          [$style.animated]: optionData.animating
        },
        hotColdClass,
        omissionClass
      ]"
        @click="handleClick"
        role="button"
        tabindex="0"
        :aria-pressed="optionData.selected ? 'true' : 'false'"
        :aria-label="`选择 ${optionData.title ? t(optionData.title) : optionData.value}`"
    >
      <div :class="$style.showNumber">
        <b>{{ optionData.title ? t(optionData.title) : optionData.value }}</b>
      </div>
      <slot name="afterTitle"></slot>
      <div
          :class="$style.ballChm"
          v-if="showColdHot || showOmission"
      >
        <span
            :class="[$style.hotCold]"
            v-if="showColdHot && optionData.hot_cold !== null"
            aria-hidden="true"
        >
          {{ optionData.hot_cold }}
        </span>
        <span
            :class="[$style.omission]"
            v-if="showOmission && optionData.omission !== null"
            aria-hidden="true"
        >
          {{ optionData.omission }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { MethodRowNumber } from "@shared/types"
import styles from '@/assets/scss/lottery/lottery.module.scss';

const $style = styles;
const { t } = useI18n();

const props = defineProps({
  optionData: {
    type: Object as PropType<MethodRowNumber>,
    required: true
  },
  shape: {
    type: String,
    default: 'circle'
  },
  showColdHot: {
    type: Boolean,
    default: false
  },
  showOmission: {
    type: Boolean,
    default: false
  },
  hotColdClass: {
    type: String,
    default: ''
  },
  omissionClass: {
    type: String,
    default: ''
  }
});

const emit = defineEmits<{
  (e: 'select', value: MethodRowNumber): void
}>();

const handleClick = () => {
  emit('select', props.optionData);
};
</script>