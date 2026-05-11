<template>
  <div class="lottery-page">
    <!-- 页面标题 -->
    <header class="page-header">
      <h1>{{ config.name }}</h1>
    </header>

    <!-- 奖期信息 -->
    <section class="period-info">
      <h3>当前奖期：</h3>
      <p v-if="period">期号：{{ period.issue }}，截止时间：{{ period.endTime }}</p>
      <p v-else>加载中...</p>
    </section>

    <!-- 投注号码选择 -->
    <section class="betting-section">
      <h2>请选择号码</h2>
      <div class="numbers">
        <button
            v-for="number in numbers"
            :key="number"
            :class="{ selected: selectedNumbers.includes(number) }"
            @click="toggleNumber(number)"
        >
          {{ number }}
        </button>
      </div>
    </section>

    <!-- 投注详情 -->
    <section class="bet-details">
      <h3>已选择的号码：</h3>
      <p v-if="selectedNumbers.length === 0">未选择号码</p>
      <p v-else>{{ selectedNumbers.join(', ') }}</p>

      <div class="bet-amount">
        <label for="amount">请输入投注金额：</label>
        <input
            id="amount"
            type="number"
            v-model="betAmount"
            placeholder="输入金额"
        />
      </div>

      <button class="submit-button" @click="submitBet" :disabled="!canSubmit">
        提交投注
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/index.ts';

const route = useRoute(); // 获取路由对象
const id = route.params.id; // 从路由参数中获取 ID

const config = ref({ name: '加载中...' }); // 配置信息
const period = ref(null); // 奖期信息
const numbers = Array.from({ length: 49 }, (_, i) => i + 1); // 投注号码
const selectedNumbers = ref([]);
const betAmount = ref('');

// 切换号码选择状态
const toggleNumber = (number) => {
  if (selectedNumbers.value.includes(number)) {
    selectedNumbers.value = selectedNumbers.value.filter((n) => n !== number);
  } else {
    selectedNumbers.value.push(number);
  }
};

// 提交投注
const submitBet = () => {
  if (canSubmit.value) {
    alert(`投注成功！号码：${selectedNumbers.value.join(', ')} 金额：¥${betAmount.value}`);
    selectedNumbers.value = [];
    betAmount.value = '';
  }
};

// 验证是否可以提交
const canSubmit = ref(false);

watchEffect(() => {
  canSubmit.value = selectedNumbers.value.length > 0 && betAmount.value > 0;
});

// 获取配置和奖期信息
const fetchConfigAndPeriod = async () => {
  try {
    const configData = await api.get(`/lottery/config/${id}`);
    const periodData = await api.get(`/lottery/period/${id}`);
    config.value = configData;
    period.value = periodData;
  } catch (error) {
    console.error('加载配置或奖期信息失败:', error);
  }
};

onMounted(() => {
  fetchConfigAndPeriod();
});
</script>

<style scoped>
.lottery-page {
  padding: 20px;
  max-width: 800px;
  margin: auto;
  font-family: Arial, sans-serif;
}

.page-header h1 {
  text-align: center;
  color: #333;
}

.period-info {
  margin-top: 20px;
}

.betting-section {
  margin-top: 20px;
}

.numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.numbers button {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 50%;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  transition: 0.3s;
}

.numbers button.selected {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.numbers button:hover {
  background-color: #f0f0f0;
}

.bet-details {
  margin-top: 20px;
}

.bet-amount {
  margin: 10px 0;
}

.bet-amount input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.3s;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  background-color: #307ac5;
}
</style>
