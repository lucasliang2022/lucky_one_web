<template>
  <div class="auth-container">
    <div>
      <div class="auth-card">
        <div v-if="isLogin" class="form-group">
          <div class="input-wrapper">
            <i class="input-icon icon-sd-user"></i>
            <el-input
                v-model="loginForm.username"
                :placeholder="t('pages.login.enterUsername')"
                autocomplete="new-password"
                class="input-field"
            />
            <div class="input-suffix"></div>
          </div>
          <div class="input-spacer"></div>
          <div class="input-wrapper input-wrapper-password">
            <i class="input-icon icon-sd-security"></i>
            <el-input
                v-model="loginForm.password"
                type="password"
                :placeholder="t('pages.login.enterPassword')"
                autocomplete="new-password"
                class="input-field"
                @keyup.enter="submitLogin"
            />
            <div class="input-suffix"></div>
          </div>
          <div class="button-group">
            <div class="submit-button" :class="{ loading }" @click="submitLogin">
              <span class="button-text">{{ loading ? '...' : t('pages.login.submit') }}</span>
            </div>
          </div>
        </div>

        <div v-else class="form-group">
          <div class="input-wrapper">
            <i class="input-icon icon-sd-user"></i>
            <el-input
                v-model="registerForm.username"
                :placeholder="t('pages.login.enterUsername')"
                autocomplete="new-password"
                class="input-field"
            />
          </div>
          <div class="input-spacer"></div>
          <div class="input-wrapper input-wrapper-password">
            <i class="input-icon icon-sd-security"></i>
            <el-input
                v-model="registerForm.password"
                type="password"
                :placeholder="t('pages.login.enterPassword')"
                autocomplete="new-password"
                class="input-field"
            />
          </div>
          <div class="input-wrapper input-wrapper-password">
            <i class="input-icon icon-sd-security"></i>
            <el-input
                v-model="registerForm.password_confirm"
                type="password"
                :placeholder="t('pages.login.enterPasswordConfirm')"
                autocomplete="new-password"
                class="input-field"
            />
          </div>
          <div class="button-group">
            <div class="submit-button" :class="{ loading }" @click="submitRegister">
              <span class="button-text">{{ loading ? '...' : t('pages.login.register') }}</span>
            </div>
          </div>
        </div>

        <div class="footer-actions">
          <div class="action-item" @click="switchMode">
            <i class="action-icon icon-sd-register"></i>
            <div class="action-text">{{ isLogin ? t('pages.login.register') : t('pages.login.title') }}</div>
          </div>
          <div class="action-item" @click="contactSupport">
            <i class="action-icon icon-sd-customer"></i>
            <div class="action-text">{{ t('pages.login.support') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@shared/stores/userStore';
import { useI18n } from 'vue-i18n';
import { ApiError } from '@shared/types/api';

const { t } = useI18n();
const userStore = useUserStore();

const isLogin = ref(true);
const loading = ref(false);

// 仅开发环境预填测试账号,生产留空
const loginForm = reactive({
  username: import.meta.env.DEV ? 'test001' : '',
  password: import.meta.env.DEV ? '12345qwert' : '',
});

const registerForm = reactive({
  username: '',
  password: '',
  password_confirm: '',
});

const submitLogin = async () => {
  if (loading.value) return;
  if (!loginForm.username.trim() || !loginForm.password) {
    ElMessage.warning(t('pages.login.empty'));
    return;
  }
  loading.value = true;
  try {
    // ★ 关键：传对象，不是位置参数
    await userStore.login({
      username: loginForm.username.trim(),
      password: loginForm.password,
    });
  } catch (e) {
    if (!(e instanceof ApiError)) console.error('Login failed:', e);
  } finally {
    loading.value = false;
  }
};

const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9]{5,31}$/;

const submitRegister = async () => {
  if (loading.value) return;
  if (!registerForm.username.trim() || !registerForm.password) {
    ElMessage.warning(t('pages.login.empty'));
    return;
  }
  if (!USERNAME_RE.test(registerForm.username.trim())) {
    ElMessage.warning(t('pages.login.usernameRule'));
    return;
  }
  if (registerForm.password.length < 6 || registerForm.password.length > 32) {
    ElMessage.warning(t('pages.login.passwordRule'));
    return;
  }
  if (registerForm.password !== registerForm.password_confirm) {
    ElMessage.warning(t('pages.login.passwordMismatch'));
    return;
  }
  loading.value = true;
  try {
    await userStore.register({
      username: registerForm.username.trim(),
      password: registerForm.password,
      password_confirm: registerForm.password_confirm,
    });
  } catch (e) {
    if (!(e instanceof ApiError)) console.error('Register failed:', e);
  } finally {
    loading.value = false;
  }
};

const switchMode = () => {
  isLogin.value = !isLogin.value;
  if (isLogin.value) {
    registerForm.username = '';
    registerForm.password = '';
    registerForm.password_confirm = '';
  }
};

const contactSupport = () => {
  ElMessage.info(t('pages.login.supportPending'));
};
</script>

<style scoped>
.auth-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background-color: #f5f5f5; }
.auth-card { width: 400px; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1); }
.form-group { margin-bottom: 15px; transition: opacity 0.3s ease; opacity: 1; }
.input-wrapper { position: relative; display: flex; align-items: center; margin-bottom: 15px; }
.input-icon { width: 20px; height: 20px; margin-right: 10px; font-size: 20px; }
.input-field { width: 100%; padding-left: 35px; height: 40px; border-radius: 4px; }
.input-suffix { width: 0; height: 0; }
.input-spacer { height: 10px; }
.button-group { text-align: center; margin-top: 20px; }
.submit-button { display: inline-block; padding: 10px 20px; background: #409eff; color: #fff; border-radius: 4px; cursor: pointer; user-select: none; }
.submit-button:hover { background: #66b1ff; }
.submit-button.loading { opacity: 0.6; pointer-events: none; }
.footer-actions { display: flex; justify-content: space-around; margin-top: 20px; }
.action-item { display: flex; align-items: center; cursor: pointer; }
.action-icon { font-size: 24px; margin-right: 5px; }
.action-text { color: #666; }
</style>