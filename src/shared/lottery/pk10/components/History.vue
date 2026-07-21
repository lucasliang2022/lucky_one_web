<template>
  <div class="game-history">
    <Trend :store="store" :ball-names="BALLS" :values="VALUES" :big-min="BIG" />
  </div>
</template>

<script setup>
import Trend from '@lottery/base/components/Trend.vue';

const props = defineProps({ store: { type: Object, required: true } });
const store = props.store;

const BALLS = ['冠军','亚军','第三名','第四名','第五名','第六名','第七名','第八名','第九名','第十名'];
const VALUES = Array.from({ length: 10 }, (_, i) => i + 1);
const BIG = 6;
</script>

<style lang="scss" scoped>
.game-history { padding: 16px; background-color: #ffffff; }
</style>
