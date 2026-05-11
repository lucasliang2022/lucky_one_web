<template>
  <div class="error-page">
    <h1>403 - Forbidden</h1>
    <p>You do not have permission to access this resource.</p>
    <el-button type="primary" @click="goHome">Go Home</el-button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const goHome = () => {
      router.push('/');
    };

    return { goHome };
  },
};
</script>
