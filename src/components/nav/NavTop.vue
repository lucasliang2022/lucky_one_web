<template xmlns="">
  <div class="nav-bar-container">
    <div class="nav-bar">
      <div class="nav-bar-left">
        <AutoScroll :speed="4" />
      </div>
      <!-- 右侧整块预留空间(登录态首帧即知,宽度确定),就绪后整体淡入,避免语言/币种/用户名逐个弹出 -->
      <div class="nav-bar-right-slot" :style="{ minWidth: userStore.isLoggedIn ? '640px' : '460px' }">
        <transition name="nav-fade">
          <NavBarNotLogin v-if="ready && !userStore.isLoggedIn" />
          <NavBarLogin v-else-if="ready" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useUserStore } from '@/stores/userStore.ts';
  import { useCommonStore } from '@/stores/commonStore';
  import AutoScroll from '@/components/tool/AutoScroll.vue';
  import NavBarNotLogin from "@/components/nav/NavBarNotLogin.vue";
  import NavBarLogin from "@/components/nav/NavBarLogin.vue";
  const userStore = useUserStore();
  const commonStore = useCommonStore();

  // 顶部右侧整体就绪:配置加载完 +(未登录 或 用户信息加载完)。
  // 一起淡入,不再一个一个冒出来。
  const ready = computed(() =>
    commonStore.isLoaded && (!userStore.isLoggedIn || userStore.isUserLoaded)
  );
</script>

<style lang="scss" scoped>
.nav-bar-container {
  position: relative;
  z-index: 999;
  background-color: var(--sd-color-bg-top, --ht-bg-opacity);
}

.nav-bar {
  font-size: 14px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  width: 100%;
  background-color: var(--sd-color-bg-top, --ht-bg-opacity);
  min-width: var(--width-small-container);
  max-width: var(--width-container);
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.nav-bar-left {
  padding-right: 20px;
  width: 40%;
}

/* 右侧插槽:预留宽度 + 右对齐,加载期间占位不塌陷 */
.nav-bar-right-slot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 30px;
}

/* 整块淡入(只做 enter,离开无需动画) */
.nav-fade-enter-active {
  transition: opacity 0.25s ease;
}
.nav-fade-enter-from {
  opacity: 0;
}
</style>
