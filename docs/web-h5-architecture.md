# Web / H5 双端架构设计（一套仓库 · 内核共享 · 双入口）

> 目标：PC(web) 与 手机(h5) 两套 UI，共享同一份业务内核（API / 状态 / 彩票引擎 / i18n），
> 避免"纯响应式塞条件分支"与"两个仓库双份维护"两个极端。方案 = **B · 双入口**。
>
> **端划分（已定）**：
> - **web**（PC）+ **h5**（手机浏览器，UI 用 **Vant**）→ 本仓库 lucky_one_web 双入口，共享 `src/shared`。
> - **原生 App**（iOS/Android）→ 用 **uni-app** 单独项目，**不在本仓库**；后续通过共享内核包（`lottery` 引擎 / api 契约 / i18n 文案 / types）复用，避免规则漂移。为此本仓库的 `src/shared` 要尽量写成与 DOM 无关的纯逻辑，将来抽包给 uni-app 复用很轻。

---

## 1. 现状 & 结论

现状（lucky_one_web）：Vue3.5 + vue-router4 + pinia + vue-i18n + Vite7 的纯 SPA；
`Header/LeftSide/Footer` 桌面布局，几乎没有响应式（全局仅 2 个 @media），h5 未成型。
但 `api/ stores/ lottery/ locales/ composables/ utils/` 已经是与 UI 无关的共享内核——**这正是双入口的地基**。

结论：**不推倒重来**。把现有 UI 归入 `web/`，新增 `h5/`，两者共享 `shared/`，Vite 多入口构建，Nginx 按 UA 分发。

---

## 2. 目标目录结构

```
src/
├── shared/                # ← 与 UI 无关的内核，web 和 h5 都 import;禁止反向依赖 web/h5
│   ├── api/               # 现 src/api  —— 接口层
│   ├── stores/            # 现 src/stores —— pinia(用户/钱包/公共)
│   ├── lottery/           # 现 src/lottery —— 彩票引擎(玩法/开奖/校验)
│   ├── locales/           # 现 src/locales —— i18n 文案(键与端无关)
│   ├── composables/       # 与端无关的组合式函数(useGameLaunch 等)
│   ├── utils/             # 工具
│   ├── types/             # 类型
│   └── i18n.ts            # i18n 实例工厂(两端各自 createI18n,或共享实例)
│
├── web/                   # ← PC 表现层(由现有 pages/components 迁入)
│   ├── App.vue
│   ├── main.ts            # web 入口:createApp + router + pinia + i18n
│   ├── router/            # web 路由表
│   ├── layouts/           # Header/LeftSide/Footer 桌面布局
│   ├── pages/             # 现 src/pages(auth/account/game/lottery…)
│   ├── components/        # 仅 PC 用的组件
│   └── styles/
│
├── h5/                    # ← 手机表现层(新建)
│   ├── App.vue
│   ├── main.ts            # h5 入口
│   ├── router/            # h5 路由表(可与 web 路径一致,组件不同)
│   ├── layouts/           # 顶栏 + 底部 TabBar 的移动布局
│   ├── pages/             # 手机版页面(单列、触控优化、投注面板重做)
│   ├── components/        # 仅移动端用的组件
│   └── styles/            # rem/vw 适配(见 §7)
│
web.html                   # web 入口 HTML(<script src=/src/web/main.ts>)
h5.html                    # h5 入口 HTML(<script src=/src/h5/main.ts>)
```

**依赖方向铁律**：`web/` `h5/` → 可依赖 `shared/`；`shared/` **不得** import `web/` 或 `h5/`（用 ESLint `no-restricted-imports` 兜底）。

---

## 3. Vite 多入口构建

`vite.config.ts`：

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@web': resolve(__dirname, 'src/web'),
      '@h5': resolve(__dirname, 'src/h5'),
      '@': resolve(__dirname, 'src'), // 兼容期保留
    },
  },
  build: {
    rollupOptions: {
      input: {
        web: resolve(__dirname, 'web.html'),
        h5: resolve(__dirname, 'h5.html'),
      },
    },
  },
})
```

产物：`dist/web.html` + `dist/h5.html`，各自独立 JS/CSS 包（共享内核经 Rollup 去重进公共 chunk）。
**手机只加载 h5 包**（不含 PC 组件），首屏更小。

开发期：`vite` 起一个 dev server，`/web.html` 与 `/h5.html` 分别访问；或配 `server.open`。
可加两个 npm script：`"dev:web"`, `"dev:h5"`（用 `--open /web.html`）。

---

## 4. 入口文件（每端一份）

`src/web/main.ts`（h5 同构）：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from '@shared/i18n'

createApp(App).use(createPinia()).use(router).use(i18n).mount('#app')
```

`web.html`：

```html
<div id="app"></div>
<script type="module" src="/src/web/main.ts"></script>
```

两端各自 App.vue / router / 布局，互不干扰；stores/api/lottery/i18n 全部来自 `@shared`。

---

## 5. 共享内核约定（关键，决定成败）

| 层 | 归属 | 说明 |
|---|---|---|
| API 请求 | `shared/api` | 与端无关;鉴权、baseURL、拦截器统一 |
| 状态 pinia | `shared/stores` | 用户/钱包/公共配置;两端复用同一份 store 定义 |
| 彩票引擎 | `shared/lottery` | 玩法定义、号码校验、注单构造、开奖——**只算不画** |
| i18n 文案 | `shared/locales` | 文案键与端无关;端内只放"这端独有"的极少文案 |
| composables | `shared/composables` | 纯逻辑(如 useGameLaunch);**含 DOM/样式的留在端内** |
| 类型/工具 | `shared/types` `shared/utils` | |

**判断某文件放 shared 还是端内**：问"换个端还成立吗？"——
纯数据/逻辑/请求 → shared；含具体布局/交互/样式 → 端内。

---

## 6. 路由

两端**路由表分开**（组件不同），但路径尽量一致（利于分享链接、埋点统一）：
- `web/router` → 桌面页面；`h5/router` → 移动页面。
- 路由 **meta** 里放端无关的东西（auth 要求、标题 key）；守卫逻辑（登录校验）可抽到 `shared`，两端 router 各自 `beforeEach` 调用。

---

## 7. 移动端适配（h5 内）

- 视口：`h5.html` 的 viewport 保持 `width=device-width, initial-scale=1`。
- 尺寸方案二选一：
  - **vw**（推荐，简单）：直接用 `vw`/`%`/flex，配 `postcss` 的 `postcss-px-to-viewport`（仅对 `src/h5` 生效，web 不动）。
  - **rem + flexible**：`amfe-flexible` + `postcss-pxtorem`。
- 组件库（已定）：**h5 用 Vant**（移动组件，按需引入 `@vant/auto-import-resolver`），web 维持现有/自定义；两端组件库互不污染（各自 entry 引入，不进对方包）。

---

## 8. UA 分发（Nginx）

同域名，按 User-Agent 决定回哪个 `index`：

```nginx
map $http_user_agent $is_mobile {
    default 0;
    ~*(android|iphone|ipod|ipad|mobile|blackberry|windows\ phone) 1;
}

server {
    root /var/www/lucky_one_web/dist;

    # 落地页:/ 直接给根 index.html,由其内联脚本按「分辨率」在客户端分流到 web.html / h5.html
    # （分辨率只有客户端可见,服务端看不到,所以主分流放客户端;见根 index.html)。
    location = / { try_files /index.html =404; }

    # SPA history 深链接回退:服务端只能按 UA(看不到分辨率)兜底到对应入口。
    location / {
        try_files $uri $uri/ @spa;
    }
    location @spa {
        if ($is_mobile) { rewrite ^ /h5.html last; }
        rewrite ^ /web.html last;
    }

    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
}
```

> 也可给用户"切换到电脑版/手机版"入口：显式 `? v=web`/`?v=h5` 覆盖 UA 判断（存 cookie），满足平板/临时切换需求。

---

## 9. 迁移路径（增量、可回退）

分 3 步，每步都能独立跑通、不影响线上（离上线还早，可大胆）：

1. **抽内核**：`src/{api,stores,lottery,locales,composables,utils,types}` → `src/shared/`；
   改别名 `@shared`，全局替换 import。此步**不改任何 UI**,web 照常跑。
2. **归位 web**：`src/{App.vue,router,pages,components}` → `src/web/`；
   新增 `web.html` + `src/web/main.ts`；Vite 加 web 入口。跑通 = 现状平移完成。
3. **搭 h5**：新建 `src/h5/`（App/main/router/layouts/pages），`h5.html` + Vite h5 入口；
   先做登录/首页/彩票大厅/投注 4 个核心页打样，逐页补齐。共享内核直接复用。

每步 commit 一次，坏了能回退。

---

## 10. 注意事项 / 取舍

- **SEO/SSR**：博彩站一般不吃 SEO，纯 CSR 双入口足够；若要 SSR 再上 Nuxt（成本大，暂不建议）。
- **共享 UI 组件**：若某展示组件两端都能用（如金额格式化、倒计时纯逻辑），逻辑放 `shared/composables`，各端各画各的壳。别把"带样式的组件"塞 shared。
- **i18n 实例**：两端可共用一个 `createI18n` 实例（文案同源）；只有当两端文案差异大才拆 namespace。
- **埋点/风控**：放 `shared`，两端统一。
- **别退化成"一套组件 + 满屏 v-if isMobile"**——那就变回被否掉的方案 A 了。端内组件各写各的，逻辑靠 shared 收口。

---

## 附：为什么不是另外两种

- **纯响应式(A)**：PC/手机投注交互差异大，共享组件会被 `isMobile` 条件撑爆，越改越脆。
- **两个仓库(C)**：api/stores/彩票规则/i18n 全要复制，双份维护必然漂移；对"同后端同规则同 i18n"不划算。
