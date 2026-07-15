<template>
  <div class="page-h5-recharge">
    <van-nav-bar :title="t('h5.page.recharge.title')" />
    <van-empty :description="t('h5.page.recharge.placeholder')" />
  </div>
</template>

<script lang="ts" setup>
// 充值(占位):后续接支付渠道。
import { t } from '@shared/i18n';
</script>
