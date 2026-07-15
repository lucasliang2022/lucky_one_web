// 彩票「期号自动滚期」共享 composable —— web / h5 共用。
//
// 纯逻辑、零 UI 库依赖(不 import element-plus / vant),只用 vue 的 ref/computed/
// onMounted/onUnmounted + 共享 store。把 web `Issue.vue` 里内嵌的
// 计时 / 封盘 / 轮询拉下一期 逻辑抽出来,渲染留给各端自己。
//
// 节奏(与 Issue.vue 对齐):
//   1) 每 tick(默认 500ms)刷新 now,由 sale_end_time(秒级 epoch)算当前期剩余毫秒。
//   2) 剩余为 0 且存在 sale_end_time 视为「封盘」(isClosed):
//        - 把当前期镜像存为 issueLast(setIssueLast);
//        - 立即 fetchIssueCurrent(false) 拉一次,之后按 pollInterval(默认 2s)
//          轮询,直到 issue_no 变化且新期 sale_end_time 在未来 → 视为已滚到下一期;
//        - 新期到达后 countdownMs 自动 > 0,isClosed 归 false,倒计时重置。
//   3) onUnmounted 清理定时器;同一 store 的多个实例共享一个 controller
//      (共享 tick / poll 定时器 + ref 计数),避免多实例重复轮询。
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { useSscStore } from '@shared/lottery/ssc/store';
import type { IssueItem } from '@lottery/base/types/issue';

/**
 * 滚期引擎实际用到的 store 最小形状(各彩种共享 store 均满足)。
 * 用于内部访问约束;调用方直接传共享 store 实例即可(见 IssueRolloverStore 类型别名)。
 */
export interface IssueRolloverStoreShape {
    issueCurrent: IssueItem;
    fetchIssueCurrent: (initBetHistory: boolean) => Promise<void>;
    setIssueLast: (issue: IssueItem) => void;
}

/**
 * 调用方传入的 store 类型:直接用时时彩共享 store 的实例类型,
 * 各彩种共享 store 结构一致,web Issue.vue(JS)传其它彩种 store 亦可。
 */
export type IssueRolloverStore = ReturnType<typeof useSscStore>;

export interface IssueRolloverOptions {
    /** 封盘后轮询拉下一期的间隔(毫秒),默认 2000。 */
    pollInterval?: number;
    /** 倒计时刷新间隔(毫秒),默认 500。 */
    tickInterval?: number;
}

export interface IssueRollover {
    /** 当前期剩余毫秒(响应式,封盘后为 0)。 */
    countdownMs: ComputedRef<number>;
    /** 是否已封盘(存在 sale_end_time 且已到点)。 */
    isClosed: ComputedRef<boolean>;
    /** 是否正在等待滚到下一期(与 isClosed 同义,便于 UI 语义化)。 */
    isWaiting: ComputedRef<boolean>;
    /** 当前期号。 */
    issueNo: ComputedRef<string>;
    /** 当前期封盘时间(秒级 epoch),无则 undefined。 */
    saleEndTime: ComputedRef<number | undefined>;
    /** 手动启动倒计时(默认在 onMounted 自动启动)。 */
    start: () => void;
    /** 手动停止并清理定时器。 */
    stop: () => void;
}

/** 同一 store 共享的滚期控制器:单一 tick / poll 定时器 + 实例计数,避免重复轮询。 */
interface RolloverController {
    refs: number;
    tickId: number | null;
    pollId: number | null;
    /** 共享的 now(毫秒),单一 tick 定时器驱动,供所有实例的 countdownMs 计算。 */
    nowMs: Ref<number>;
    /** 封盘那一刻记录的期号,用于判断是否已滚到「新」的一期。 */
    closedIssueNo: string;
    /** 本轮封盘是否已把当前期镜像存为 issueLast,避免多实例重复写。 */
    recordedLast: boolean;
}

const controllers = new WeakMap<object, RolloverController>();

export function useIssueRollover(
    store?: IssueRolloverStore,
    options: IssueRolloverOptions = {},
): IssueRollover {
    // 未显式传 store 时默认用时时彩共享 store(与 h5 bet.vue / web Ssc 一致)。
    const s: IssueRolloverStore = store ?? useSscStore();
    const pollInterval = options.pollInterval ?? 2000;
    const tickInterval = options.tickInterval ?? 500;

    let controller = controllers.get(s);
    if (!controller) {
        controller = {
            refs: 0,
            tickId: null,
            pollId: null,
            nowMs: ref(Date.now()),
            closedIssueNo: '',
            recordedLast: false,
        };
        controllers.set(s, controller);
    }
    const ctrl = controller;

    const saleEndTime = computed<number | undefined>(() => {
        const t = (s.issueCurrent as IssueItem | undefined)?.sale_end_time;
        return typeof t === 'number' ? t : undefined;
    });

    const issueNo = computed<string>(() => (s.issueCurrent as IssueItem | undefined)?.issue_no ?? '');

    const countdownMs = computed<number>(() => {
        const end = saleEndTime.value;
        if (!end) return 0;
        return Math.max(0, end * 1000 - ctrl.nowMs.value);
    });

    // 存在封盘时间且已到点 → 封盘。天然响应式、跨实例一致(共享 nowMs / issueCurrent)。
    const isClosed = computed<boolean>(() => !!saleEndTime.value && countdownMs.value === 0);
    const isWaiting = isClosed;

    function tick(): void {
        ctrl.nowMs.value = Date.now();
    }

    function startTick(): void {
        if (ctrl.tickId != null) return;
        tick();
        ctrl.tickId = window.setInterval(tick, tickInterval);
    }

    function stopTick(): void {
        if (ctrl.tickId != null) {
            clearInterval(ctrl.tickId);
            ctrl.tickId = null;
        }
    }

    function clearPoll(): void {
        if (ctrl.pollId != null) {
            clearTimeout(ctrl.pollId);
            ctrl.pollId = null;
        }
    }

    // 共享单一 poll 定时器:多实例同时调用只会「最后一个生效」,不会叠加网络请求。
    function scheduleNextIssuePoll(delay: number): void {
        clearPoll();
        ctrl.pollId = window.setTimeout(pullNextIssue, delay);
    }

    async function pullNextIssue(): Promise<void> {
        ctrl.pollId = null;
        try {
            await s.fetchIssueCurrent(false);
        } catch {
            // 拉取失败按节奏重试(与 Issue.vue 一致),不弹提示以免封盘期间刷屏。
        }
        tick();
        const cur = s.issueCurrent as IssueItem | undefined;
        const rolled =
            !!cur?.issue_no &&
            cur.issue_no !== ctrl.closedIssueNo &&
            typeof cur.sale_end_time === 'number' &&
            cur.sale_end_time * 1000 > Date.now();
        if (rolled) {
            // 新期已到:countdownMs 自动 > 0,isClosed 归 false,倒计时重置。
            ctrl.recordedLast = false;
        } else if (ctrl.pollId == null) {
            scheduleNextIssuePoll(pollInterval);
        }
    }

    // isClosed 翻转驱动滚期:多实例各自 watch,但 poll/last 写入都做了去重。
    const stopWatch = watch(
        isClosed,
        (closed) => {
            if (closed) {
                if (!ctrl.recordedLast) {
                    ctrl.closedIssueNo = issueNo.value;
                    s.setIssueLast({ ...(s.issueCurrent as IssueItem) });
                    ctrl.recordedLast = true;
                }
                scheduleNextIssuePoll(0);
            } else {
                clearPoll();
                ctrl.recordedLast = false;
            }
        },
        { immediate: true },
    );

    function start(): void {
        startTick();
    }

    function stop(): void {
        stopTick();
        clearPoll();
    }

    onMounted(() => {
        ctrl.refs += 1;
        startTick();
    });

    onUnmounted(() => {
        stopWatch();
        ctrl.refs -= 1;
        if (ctrl.refs <= 0) {
            stop();
            controllers.delete(s);
        }
    });

    return {
        countdownMs,
        isClosed,
        isWaiting,
        issueNo,
        saleEndTime,
        start,
        stop,
    };
}
