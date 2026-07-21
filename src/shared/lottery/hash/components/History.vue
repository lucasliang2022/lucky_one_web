<template>
  <div class="game-history">
    <Trend :store="store" :ball-names="BALLS" :values="VALUES" :big-min="BIG" />
  </div>
</template>

<script setup>
import Trend from '@lottery/base/components/Trend.vue';

const props = defineProps({ store: { type: Object, required: true } });
const store = props.store;

const BALLS = ['第一球','第二球','第三球','第四球','第五球'];
const VALUES = Array.from({ length: 10 }, (_, i) => i);
const BIG = 5;
</script>

<style lang="scss" scoped>
.game-history { padding: 16px; background-color: #ffffff; }
</style>
