// 导航注入层:让 shared 不直接依赖某一端的 router。
// 各端(web / h5 / 未来 uni-app)在自己的入口 main.ts 里 configureNavigation 注入实现,
// shared 内部需要跳转时只调 nav.xxx(),与具体路由实现解耦。
export interface NavHooks {
    toLogin: () => void;
    toHome: () => void;
    toForbidden: () => void; // 403
    toNotFound: () => void; // 404
    currentPath: () => string;
}

let navHooks: NavHooks | null = null;

export function configureNavigation(hooks: NavHooks): void {
    navHooks = hooks;
}

export const nav = {
    toLogin: (): void => navHooks?.toLogin(),
    toHome: (): void => navHooks?.toHome(),
    toForbidden: (): void => navHooks?.toForbidden(),
    toNotFound: (): void => navHooks?.toNotFound(),
    currentPath: (): string => navHooks?.currentPath() ?? '',
};
