<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <h2 class="auth-title">{{ t('pages.login.register') }}</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item :label="t('pages.login.username')" prop="username">
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('pages.login.password')" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('pages.login.confirmPassword')" prop="password_confirm">
          <el-input type="password" v-model="form.password_confirm" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submit">
            {{ t('pages.login.register') }}
          </el-button>
          <el-button link @click="goToLogin">{{ t('pages.login.title') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import { ApiError } from '@/types/api';
import type { FormInstance, FormRules } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n();

const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
  password_confirm: '',
});

const rules: FormRules = {
  username: [{ required: true, trigger: 'blur' }],
  password: [{ required: true, trigger: 'blur' }],
  password_confirm: [
    { required: true, trigger: 'blur' },
    {
      validator: (_r, value, cb) =>
          value !== form.password ? cb(new Error(t('pages.login.passwordMismatch'))) : cb(),
      trigger: 'blur',
    },
  ],
};

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    loading.value = true;
    try {
      await userStore.register({
        username: form.username.trim(),
        password: form.password,
        password_confirm: form.password_confirm,
      });
    } catch (e) {
      if (!(e instanceof ApiError)) console.error('Register failed:', e);
    } finally {
      loading.value = false;
    }
  });
};

const goToLogin = () => router.push('/login');
</script>

<style scoped>
.auth-container { display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5f5; }
.auth-card { width: 400px; padding: 20px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); }
.auth-title { text-align: center; margin-bottom: 20px; font-size: 24px; }
</style>