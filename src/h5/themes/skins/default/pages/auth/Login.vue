<template>
  <div class="page-h5-login">
    <van-nav-bar :title="t('h5.login.title')" left-arrow @click-left="goBack" />

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          name="username"
          :label="t('h5.login.username')"
          :placeholder="t('h5.login.usernamePlaceholder')"
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          :label="t('h5.login.password')"
          :placeholder="t('h5.login.passwordPlaceholder')"
        />
      </van-cell-group>

      <div class="page-h5-login__submit">
        <van-button type="primary" block native-type="submit" :loading="loading">
          {{ t('h5.login.submit') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
// 共享内核:登录逻辑复用 @shared/stores/userStore.login()(内部调 @shared/api)
import { useUserStore } from '@shared/stores/userStore';
import { t } from '@shared/i18n';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const form = reactive({ username: '', password: '' });

async function onSubmit(): Promise<void> {
  if (!form.username.trim() || !form.password) {
    showToast(t('h5.login.empty'));
    return;
  }
  loading.value = true;
  try {
    await userStore.login({
      username: form.username.trim(),
      password: form.password,
    });
    showToast(t('h5.login.success'));
    // 证明 shared 的 store 登录成功后可通过端 router 跳转
    router.push('/');
  } catch {
    // 错误提示已由 @shared/api 拦截器统一处理
  } finally {
    loading.value = false;
  }
}

function goBack(): void {
  router.push('/');
}
</script>

<style lang="scss">
.page-h5-login__submit {
  padding: 16px;
}
</style>
