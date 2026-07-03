declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// lunar-javascript 无类型声明,给一个最小 shim(内容为 any),消除 TS7016
declare module 'lunar-javascript';