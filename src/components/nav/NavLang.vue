<template>
  <el-dropdown class="language-switcher" @command="switchLanguageHandler">
        <span class="el-dropdown-link">
          <span class="sd-icon icon-sd-earth" style="font-size: 12px"></span>{{ currentLangLabel }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="option in langOptions" :key="option.value" :command="option.value">
          {{ option.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommonStore } from '@/stores/commonStore.js';
import { switchLanguage } from '@/i18n.js';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const commonStore = useCommonStore();

const langOptions = commonStore.langOptions;

const currentLangLabel = computed(() => {
  const lang = langOptions.find(option => option.value === locale.value);
  return lang ? lang.label : commonStore.langOptions.find(opt => opt.value === commonStore.defaultLang)?.label || '简体中文';
});

const switchLanguageHandler = (lang) => {
  switchLanguage(lang, commonStore, locale);
};
</script>

<style lang="scss" scoped>
.nav-bar-item {
  .el-menu {
    margin-bottom: 0;
    line-height: 30px;
    height: 30px;
    border-bottom: none;
    background-color: var(--sd-color-bg-top);
  }
  .el-sub-menu__title:hover {
    background-color: var(--sd-color-bg-cover) !important;
  }
}
.language-switcher {
  line-height: 20px;
  cursor: pointer;
}

a {
  color: #666;
}

a:hover {
  color: #e4393c !important;
  text-decoration: underline;
}

.sd-icon {
  margin-right: 5px;
  font-size: 16px;
  color: #326BC7;
}
</style>