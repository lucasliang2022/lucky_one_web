<template>
  <div class="page-h5-activity">
    <van-nav-bar :title="t('h5.page.activity.title')" />
    <van-empty :description="t('h5.page.activity.placeholder')" />
  </div>
</template>

<script lang="ts" setup>
// 活动(占位):后续接活动列表接口。
import { t } from '@shared/i18n';
</script>
