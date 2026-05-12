import { ref, onMounted } from 'vue';
import { launchGame } from '@/api/gameService';
import type { GameLaunchConfig } from '@/types/game';

export function useGameLaunch(platformSign: string, accountSign: string) {
    const launchUrl  = ref<string | null>(null);
    const gameConfig = ref<GameLaunchConfig | null>(null);
    const loading    = ref(true);
    const error      = ref<string | null>(null);

    const launch = async () => {
        loading.value   = true;
        error.value     = null;
        launchUrl.value = null;

        try {
            const res = await launchGame(platformSign, accountSign);
            gameConfig.value = res.config;

            if (res.config.launch_mode === 'redirect' || res.config.launch_mode === 'new_tab') {
                window.open(res.url, '_blank');
                loading.value = false;
                return;
            }

            launchUrl.value = res.url;
        } catch (e: any) {
            error.value = e?.message ?? '游戏启动失败，请稍后重试';
        } finally {
            loading.value = false;
        }
    };

    onMounted(launch);
    return { launchUrl, gameConfig, loading, error, relaunch: launch };
}