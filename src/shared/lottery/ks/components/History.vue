<template>
  <div class="game-history">
    <Trend :store="store" :ball-names="BALLS" :values="VALUES" :big-min="BIG" />
  </div>
</template>

<script setup>
import Trend from '@lottery/base/components/Trend.vue';

const props = defineProps({ store: { type: Object, required: true } });
const store = props.store;

const BALLS = ['第一颗','第二颗','第三颗'];
const VALUES = [1, 2, 3, 4, 5, 6];
const BIG = 4;
</script>

<style lang="scss" scoped>
.game-history { padding: 16px; background-color: #ffffff; }
</style>
