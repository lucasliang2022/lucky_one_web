<template>
  <div class="security-page">
    <h3 class="sec-title">安全中心</h3>

    <el-tabs v-model="active" class="sec-tabs">
      <!-- 1. 修改登录密码(已接后端 /user/passLoginModify) -->
      <el-tab-pane label="修改登录密码" name="login">
        <el-form
            ref="loginFormRef"
            :model="loginPwd"
            :rules="loginRules"
            label-width="120px"
            class="sec-form"
        >
          <el-form-item label="新登录密码" prop="password">
            <el-input v-model="loginPwd.password" type="password" show-password placeholder="请输入新登录密码" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="password_confirmation">
            <el-input v-model="loginPwd.password_confirmation" type="password" show-password placeholder="请再次输入新密码" />
          </el-form-item>
          <el-form-item label="资金密码" prop="password_sec">
            <el-input v-model="loginPwd.password_sec" type="password" show-password placeholder="输入资金密码以确认身份" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="onSubmitLogin">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 2. 设置/修改资金密码(安全密码),接后端 /user/passSecModify -->
      <el-tab-pane label="修改资金密码" name="fund">
        <el-form
            ref="secFormRef"
            :model="secPwd"
            :rules="secRules"
            label-width="120px"
            class="sec-form"
        >
          <el-form-item label="新资金密码" prop="password_sec">
            <el-input v-model="secPwd.password_sec" type="password" show-password placeholder="请输入新资金密码" />
          </el-form-item>
          <el-form-item label="确认资金密码" prop="password_sec_confirmation">
            <el-input v-model="secPwd.password_sec_confirmation" type="password" show-password placeholder="请再次输入新资金密码" />
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="secPwd.password" type="password" show-password placeholder="输入登录密码以确认身份" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submittingSec" @click="onSubmitSec">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 3~4:后端玩家侧接口暂缺,先占位 -->
      <el-tab-pane label="绑定手机号" name="phone">
        <el-empty description="绑定手机号功能开发中" />
      </el-tab-pane>
      <el-tab-pane label="密保设定" name="secure">
        <el-empty description="密保设定功能开发中" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import * as userService from '@shared/api/userService';

const active = ref('login');
const submitting = ref(false);
const submittingSec = ref(false);
const loginFormRef = ref<FormInstance>();
const secFormRef = ref<FormInstance>();

const loginPwd = reactive({
  password: '',
  password_confirmation: '',
  password_sec: '',
});

const secPwd = reactive({
  password_sec: '',
  password_sec_confirmation: '',
  password: '',
});

const loginRules: FormRules = {
  password: [
    { required: true, message: '请输入新登录密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码长度 6-32 位', trigger: 'blur' },
    {
      // 登录密码不能与资金密码(安全密码)相同
      validator: (_r, v, cb) =>
          v && loginPwd.password_sec && v === loginPwd.password_sec
              ? cb(new Error('登录密码不能与资金密码相同'))
              : cb(),
      trigger: 'blur',
    },
  ],
  password_confirmation: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_r, v, cb) => (v === loginPwd.password ? cb() : cb(new Error('两次输入的密码不一致'))),
      trigger: 'blur',
    },
  ],
  password_sec: [{ required: true, message: '请输入资金密码', trigger: 'blur' }],
};

const secRules: FormRules = {
  password_sec: [
    { required: true, message: '请输入新资金密码', trigger: 'blur' },
    { min: 6, max: 32, message: '资金密码长度 6-32 位', trigger: 'blur' },
    {
      // 资金密码不能与登录密码相同
      validator: (_r, v, cb) =>
          v && secPwd.password && v === secPwd.password
              ? cb(new Error('资金密码不能与登录密码相同'))
              : cb(),
      trigger: 'blur',
    },
  ],
  password_sec_confirmation: [
    { required: true, message: '请确认新资金密码', trigger: 'blur' },
    {
      validator: (_r, v, cb) => (v === secPwd.password_sec ? cb() : cb(new Error('两次输入的资金密码不一致'))),
      trigger: 'blur',
    },
  ],
  password: [{ required: true, message: '请输入登录密码以确认身份', trigger: 'blur' }],
};

async function onSubmitLogin(): Promise<void> {
  const form = loginFormRef.value;
  if (!form) return;
  await form.validate(async (valid) => {
    if (!valid) return;
    submitting.value = true;
    try {
      await userService.modifyLoginPassword({ ...loginPwd });
      ElMessage.success('登录密码修改成功');
      form.resetFields();
    } catch {
      /* 错误提示由 api 拦截器统一处理 */
    } finally {
      submitting.value = false;
    }
  });
}

async function onSubmitSec(): Promise<void> {
  const form = secFormRef.value;
  if (!form) return;
  await form.validate(async (valid) => {
    if (!valid) return;
    submittingSec.value = true;
    try {
      await userService.modifySecPassword({ ...secPwd });
      ElMessage.success('资金密码设置成功');
      form.resetFields();
    } catch {
      /* 错误提示由 api 拦截器统一处理 */
    } finally {
      submittingSec.value = false;
    }
  });
}
</script>

<style lang="scss" scoped>
.security-page {
  padding: 20px 24px;
}

.sec-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: var(--sd-color-txt-primary, #2c3e50);
}

.sec-form {
  max-width: 460px;
  margin-top: 12px;
}
</style>
