<template xmlns="">
  <item-default
      :method-current="methodCurrent"
      :calculate-chm="calculateChm"
      :sort="sort"
      :store="store"
  />
</template>

<script setup>
import ItemDefault from "./items/ItemDefault.vue";

const props = defineProps({
  methodCurrent: {
    type: Object,
    required: true
  },
  store: {
    type: Object,
    required: true
  },
  sort: {
    type: Number,
    default: 1,
  }
});

// 形态盘一期会同时命中多个码(如数字 8 = 大+双+合),故按玩法类型返回「命中的码数组」;
// ItemDefault 已支持数组累加冷热/遗漏。扎金花/梭哈/斗牛等复杂牌型不适用,返回 null。
function calculateChm(issue) {
  const method = props.methodCurrent;
  const sign = String(method?.sign || '');
  const positions = method?.layout?.rows?.[0]?.position || [];
  const codes = String(issue?.code || '').split(',').map((s) => parseInt(s, 10));
  const nums = positions.map((p) => codes[p - 1]).filter((n) => !Number.isNaN(n));
  if (!nums.length) return null;

  // 单个数字 → 命中 大/小 + 单/双 + 质/合 三个码
  const bsOePs = (d) => [
    d >= 5 ? 'b' : 's',
    d % 2 ? 'o' : 'e',
    [1, 2, 3, 5, 7].includes(d) ? 'z' : 'h',
  ];

  if (sign.includes('_BsOePs')) return bsOePs(nums[0]);                       // 单号 大小单双质合

  if (sign.includes('LongHu')) {                                             // 龙虎
    if (nums.length < 2) return null;
    return nums[0] > nums[1] ? 'd' : (nums[0] < nums[1] ? 't' : 'h');
  }

  if (sign.includes('KuaDu')) return String(Math.max(...nums) - Math.min(...nums)); // 跨度

  const sum = nums.reduce((a, b) => a + b, 0);

  if (sign.endsWith('ZongHe_ZongHe')) {                                       // 总和 大小单双(+组合)
    const bs = sum >= 23 ? 'b' : 's';
    const oe = sum % 2 ? 'o' : 'e';
    return [bs, oe, bs + oe];
  }

  if (sign.endsWith('ZongHeWei')) return bsOePs(sum % 10);                    // 总和尾数 大小单双质合

  if (sign.includes('HeShuo')) return String(sum);                           // 位置和(和值)

  return null;                                                               // 扎金花/梭哈/斗牛等形态
}
</script>
