<template>
  <div class="game-history">
    <Trend :store="store" :ball-names="BALLS" :values="VALUES" :big-min="BIG" />
  </div>
</template>

<script setup>
import Trend from '@lottery/base/components/Trend.vue';

const props = defineProps({ store: { type: Object, required: true } });
const store = props.store;

const BALLS = ['正码一','正码二','正码三','正码四','正码五','正码六','特码'];
const VALUES = Array.from({ length: 49 }, (_, i) => i + 1);
const BIG = 25;
</script>

<style lang="scss" scoped>
.game-history { padding: 16px; background-color: #ffffff; }
</style>
