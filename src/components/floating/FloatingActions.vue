<template>
  <div class="floating-actions" :class="{ collapsed: isCollapsed }">

    <!-- 顶部装饰：钱包 + 红点提醒（如果有未读消息）-->
    <div class="fab-deco" @click="goWallet">
      <span class="sd-icon icon-sd-wallet"></span>
      <span v-if="hasNotification" class="dot-badge">!</span>
    </div>

    <!-- 后端配置的按钮 -->
    <div class="fab-list" v-show="!isCollapsed">
      <button
          v-for="btn in visibleButtons"
          :key="btn.key"
          class="fab-btn"
          @click="btn.handler"
      >
        <span class="fab-icon sd-icon" :class="btn.icon"></span>
        <span class="fab-label">{{ t(btn.i18nKey) }}</span>
        <!-- 声音特殊处理：根据状态切换图标颜色 -->
        <span v-if="btn.key === 'sound' && !soundEnabled" class="off-mark">/</span>
      </button>

      <!-- Top：滚动距离 > 300 才显示 -->
      <button v-show="showTopBtn" class="fab-btn" @click="scrollToTop">
        <span class="fab-icon sd-icon icon-sd-arrow-up"></span>
        <span class="fab-label">Top</span>
      </button>
    </div>

    <!-- 收起/展开 切换 -->
    <button class="fab-btn fab-toggle" @click="isCollapsed = !isCollapsed">
      <span class="fab-icon sd-icon" :class="isCollapsed ? 'icon-sd-expand' : 'icon-sd-collapse'"></span>
      <span class="fab-label">{{ isCollapsed ? t('components.fab.expand') : t('components.fab.collapse') }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCommonStore } from '@/stores/commonStore';
import type { FabButtonKey } from '@/types/common';

interface FabActionDef {
  key:     FabButtonKey;
  icon:    string;          // icon class
  i18nKey: string;
  handler: () => void;
}

const { t }       = useI18n();
const router      = useRouter();
const commonStore = useCommonStore();

/* ---------- 状态 ---------- */
const isCollapsed   = ref(false);
const showTopBtn    = ref(false);
const hasNotification = ref(false);   // TODO: 接消息 store
const soundEnabled  = ref(localStorage.getItem('lc_sound_enabled') !== 'false');

/* ---------- 注册表 ---------- */
const REGISTRY: Record<FabButtonKey, Omit<FabActionDef, 'key'>> = {
  support: {
    icon:    'icon-sd-headset',
    i18nKey: 'components.fab.support',
    handler: () => openSupport(),
  },
  app: {
    icon:    'icon-sd-qrcode',
    i18nKey: 'components.fab.app',
    handler: () => router.push('/app'),
  },
  recharge: {
    icon:    'icon-sd-recharge',
    i18nKey: 'components.fab.recharge',
    handler: () => router.push('/account/recharge'),
  },
  account: {
    icon:    'icon-sd-user',
    i18nKey: 'components.fab.account',
    handler: () => router.push('/account'),
  },
  tutorial: {
    icon:    'icon-sd-help',
    i18nKey: 'components.fab.tutorial',
    handler: () => router.push('/tutorial'),
  },
  sound: {
    icon:    'icon-sd-sound',
    i18nKey: 'components.fab.sound',
    handler: () => toggleSound(),
  },
  promotion: {
    icon:    'icon-sd-gift',
    i18nKey: 'components.fab.promotion',
    handler: () => router.push('/promo'),
  },
  agent: {
    icon:    'icon-sd-agent',
    i18nKey: 'components.fab.agent',
    handler: () => router.push('/agent'),
  },
};

/* ---------- 可见按钮（按后端顺序）---------- */
const visibleButtons = computed<FabActionDef[]>(() => {
  const enabled = commonStore.partner?.fab_buttons ?? [];
  return enabled
      .filter((key): key is FabButtonKey => key in REGISTRY)
      .map(key => ({ key, ...REGISTRY[key] }));
});

/* ---------- handlers ---------- */
const goWallet = () => router.push('/account/wallet');

const openSupport = () => {
  const url = commonStore.partner?.support_url;
  if (url) window.open(url, '_blank');
  else console.warn('partner.support_url not configured');
};

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value;
  localStorage.setItem('lc_sound_enabled', String(soundEnabled.value));
  // TODO: 发全局事件给音频管理器
};

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

/* ---------- 监听滚动控制 Top 按钮 ---------- */
const onScroll = () => {
  showTopBtn.value = window.scrollY > 300;
};
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<style lang="scss" scoped>
.floating-actions {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;

  > * { pointer-events: auto; }

  &.collapsed .fab-deco { transform: scale(0.85); opacity: 0.7; }
}

/* —— 顶部装饰圆 —— */
.fab-deco {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #B197FC 0%, #7950F2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(121, 80, 242, 0.3);
  transition: transform 0.2s, opacity 0.2s;

  &:hover { transform: scale(1.05); }

  .sd-icon {
    font-size: 26px;
    color: #fff;
  }

  .dot-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: #FF4757;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(255, 71, 87, 0.4);
  }
}

/* —— 按钮列表 —— */
.fab-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fab-btn {
  width: 56px;
  height: 60px;
  padding: 6px 4px;
  background: #fff;
  border: none;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(121, 80, 242, 0.1);
  transition: all 0.15s;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(121, 80, 242, 0.2);

    .fab-icon, .fab-label { color: #7950F2; }
  }

  .fab-icon {
    font-size: 22px;
    color: #B197FC;
    transition: color 0.15s;
  }

  .fab-label {
    font-size: 11px;
    color: #666;
    transition: color 0.15s;
    line-height: 1;
  }

  /* 声音"关闭"的斜杠覆盖 */
  .off-mark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 28px;
    color: #FF4757;
    pointer-events: none;
    line-height: 1;
  }
}

.fab-toggle {
  opacity: 0.85;
  &:hover { opacity: 1; }
}

/* —— 移动端：缩小 —— */
@media (max-width: 768px) {
  .floating-actions { right: 8px; gap: 6px; }
  .fab-deco { width: 48px; height: 48px; .sd-icon { font-size: 22px; } }
  .fab-btn  { width: 48px; height: 52px; .fab-icon { font-size: 18px; } .fab-label { font-size: 10px; } }
}
</style>