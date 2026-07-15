<template>
  <div class="game-history">
    <div class="history-search">
      <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
      />
      <el-input v-model="searchIssue" placeholder="输入期数" />
      <el-button type="primary" @click="refreshData">刷新数据</el-button>
    </div>
    <div class="history-data">
      <table class="history-table">
        <thead>
        <tr>
          <th>时间</th>
          <th>期数</th>
          <th>号码</th>
          <th>总和</th>
          <th>龙虎</th>
          <th>前三</th>
          <th>中三</th>
          <th>后三</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="issue in filteredHistory" :key="issue.issue_no">
          <td>{{ formatDate(issue.time) }}</td>
          <td>{{ issue.issue_no }}</td>
          <td>
            <div class="lottery-num">
              <span v-for="(num, idx) in issue.code" :key="idx" class="result-ssc">{{ num }}</span>
            </div>
          </td>
          <td>
            <div class="total-column">
              <span class="total-number"><b>{{ calculateTotal(issue.code) }}</b></span>
              <span :class="calculateTotal(issue.code) % 2 === 0 ? 'even' : 'odd'">
                  {{ calculateTotal(issue.code) % 2 === 0 ? '双' : '单' }}
                </span>
              <span :class="calculateTotal(issue.code) >= 23 ? 'bigger' : 'smaller'">
                  {{ calculateTotal(issue.code) >= 23 ? '大' : '小' }}
                </span>
            </div>
          </td>
          <td>
            <div class="shape-column">
              <span :class="getDragonTiger(issue.code)">{{ getDragonTigerLabel(issue.code) }}</span>
            </div>
          </td>
          <td>
            <div class="shape-column">
              <span :class="getShape(issue.code.slice(0, 3))">{{ getShapeLabel(issue.code.slice(0, 3)) }}</span>
            </div>
          </td>
          <td>
            <div class="shape-column">
              <span :class="getShape(issue.code.slice(1, 4))">{{ getShapeLabel(issue.code.slice(1, 4)) }}</span>
            </div>
          </td>
          <td>
            <div class="shape-column">
              <span :class="getShape(issue.code.slice(2))">{{ getShapeLabel(issue.code.slice(2)) }}</span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { ElDatePicker, ElInput, ElButton } from 'element-plus';

interface Store {
  issueHistory: Ref<any[]>;
  fetchIssueHistory: () => void;
}

const props = defineProps<{
  store: Store;
}>();

const { issueHistory } = storeToRefs(props.store);
const { fetchIssueHistory } = props.store;

const dateRange = ref<Date[]>([]);
const searchIssue = ref<string>('');

const filteredHistory = computed(() => {
  return issueHistory.value
      .map(issue => ({
        ...issue,
        code: typeof issue.code === 'string'
            ? issue.code.split(',').map(num => num.trim())
            : issue.code
      }))
      .filter(issue => !searchIssue.value || issue.issue_no.includes(searchIssue.value))
      .filter(issue => {
        if (!dateRange.value.length) return true;
        const issueDate = new Date(issue.time * 1000);
        return issueDate >= new Date(dateRange.value[0]) && issueDate <= new Date(dateRange.value[1]);
      });
});

const refreshData = () => {
  fetchIssueHistory();
};

const calculateTotal = (numbers: string[]): number => {
  if (!Array.isArray(numbers)) {
    console.error('calculateTotal expects an array, got:', numbers);
    return 0;
  }
  return numbers.reduce((sum, num) => sum + parseInt(num), 0);
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().slice(0, 19).replace("T", " ");
};

const getDragonTiger = (numbers: string[]): string => {
  const first = parseInt(numbers[0]);
  const last = parseInt(numbers[4]);
  if (first > last) return 'dragon';
  if (first < last) return 'tiger';
  return 'equal';
};

const getDragonTigerLabel = (numbers: string[]): string => {
  const first = parseInt(numbers[0]);
  const last = parseInt(numbers[4]);
  if (first > last) return '龙';
  if (first < last) return '虎';
  return '和';
};

const getShape = (numbers: string[]): string => {
  const nums = numbers.map(num => parseInt(num)).sort((a, b) => a - b);
  if (nums.length < 3) return 'misc_six';
  if (nums[0] === nums[1] && nums[1] === nums[2]) return 'leopard';
  if ((nums[1] === nums[0] + 1 && nums[2] === nums[1] + 1) ||
      (nums[0] === 0 && nums[1] === 1 && nums[2] === 9) ||
      (nums[0] === 0 && nums[1] === 8 && nums[2] === 9)) return 'straight';
  if ((nums[0] === nums[1] && nums[1] !== nums[2]) || (nums[1] === nums[2] && nums[0] !== nums[1])) return 'pair';
  if ((nums[1] === nums[0] + 1 && nums[2] !== nums[1] + 1) || (nums[2] === nums[1] + 1 && nums[1] !== nums[0] + 1)) return 'half_straight';
  return 'misc_six';
};

const getShapeLabel = (numbers: string[]): string => {
  const nums = numbers.map(num => parseInt(num)).sort((a, b) => a - b);
  if (nums.length < 3) return '杂六';
  if (nums[0] === nums[1] && nums[1] === nums[2]) return '豹子';
  if ((nums[1] === nums[0] + 1 && nums[2] === nums[1] + 1) ||
      (nums[0] === 0 && nums[1] === 1 && nums[2] === 9) ||
      (nums[0] === 0 && nums[1] === 8 && nums[2] === 9)) return '顺子';
  if ((nums[0] === nums[1] && nums[1] !== nums[2]) || (nums[1] === nums[2] && nums[0] !== nums[1])) return '对子';
  if ((nums[1] === nums[0] + 1 && nums[2] !== nums[1] + 1) || (nums[2] === nums[1] + 1 && nums[1] !== nums[0] + 1)) return '半顺';
  return '杂六';
};
</script>

<style lang="scss" scoped>
.game-history {
  padding: 16px;
  background-color: #FFFFFF;
  .history-search {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
    margin-bottom: 16px;
  }
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.lottery-num {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.result-ssc {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.total-column,
.shape-column {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.total-number {
  min-width: 30px;
}

.odd {
  color: red;
}

.even {
  color: blue;
}

.bigger {
  font-weight: bold;
}

.smaller {
  opacity: 0.7;
}

.dragon {
  color: #ff4500;
}

.tiger {
  color: #4682b4;
}

.equal {
  color: #32cd32;
}

.leopard {
  color: #ff00ff;
}

.straight {
  color: #00ced1;
}

.pair {
  color: #ffa500;
}

.half_straight {
  color: #9acd32;
}

.misc_six {
  color: #808080;
}
</style>