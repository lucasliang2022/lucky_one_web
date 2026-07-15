// 提示注入层:让 shared 不直接依赖某一端的提示组件(web 用 element-plus ElMessage、h5 用 Vant Toast/Notify)。
// 各端在自己的入口 main.ts 里 configureNotify 注入实现,
// shared 内部需要弹提示时只调 notify.xxx(),与具体 UI 实现解耦。
export interface NotifyHooks {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info?: (msg: string) => void;
}

let notifyHooks: NotifyHooks | null = null;

export function configureNotify(hooks: NotifyHooks): void {
    notifyHooks = hooks;
}

export const notify = {
    success: (m: string): void => notifyHooks?.success(m),
    error: (m: string): void => notifyHooks?.error(m),
    warning: (m: string): void => notifyHooks?.warning(m),
    info: (m: string): void => (notifyHooks?.info ?? notifyHooks?.success)?.(m),
};
