<template xmlns="">
  <div class="nav-bar-container">
    <div class="nav-bar">
      <div class="nav-bar-left">
        <AutoScroll :speed="4" />
      </div>
      <NavBarNotLogin v-if="!userStore.isLoggedIn" />
      <NavBarLogin v-else />
    </div>
  </div>
</template>

<script setup>
  import { useUserStore } from '@/stores/userStore.ts';
  import AutoScroll from '@/components/tool/AutoScroll.vue';
  import NavBarNotLogin from "@/components/nav/NavBarNotLogin.vue";
  import NavBarLogin from "@/components/nav/NavBarLogin.vue";
  const userStore = useUserStore();
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
</style>