<template>
  <div class="header">
    <nav-top />
    <nav-menu />
  </div>

</template>

<script setup>
  import NavTop from '@/components/nav/NavTop.vue'
  import NavMenu from '@/components/nav/NavMenu.vue'
</script>

<style lang="scss" scoped>
.header{
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
  font-size: 12px;
}
</style>
