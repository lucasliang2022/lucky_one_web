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
        :aria-label="`选择 ${dispTitle}`"
    >
      <div :class="$style.showNumber">
        <b>{{ dispTitle }}</b>
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
import { PropType, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { MethodRowNumber } from "@shared/types"
import styles from '@/assets/scss/lottery/lottery.module.scss';

const $style = styles;
const { t, te } = useI18n();

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

// 号码类格子 title 就是数字("8"/"9"),不是 i18n key;仅当确有翻译时才走 t(),否则原样显示,避免 [intlify] 找不到 key 的告警。
const dispTitle = computed(() => {
  const title = props.optionData?.title as unknown as string;
  if (!title) return props.optionData?.value;
  return te(title) ? t(title) : title;
});

const handleClick = () => {
  emit('select', props.optionData);
};
</script>