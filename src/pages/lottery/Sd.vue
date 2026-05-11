<template>
  <div class="lottery-page">
    暂未开发
  </div>
</template>

<script setup>

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
