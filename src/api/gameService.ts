import { api } from '@/api';
import type { GameLaunchResult } from '@/types/game';

export const launchGame = (
    platformSign: string,
    accountSign: string,
): Promise<GameLaunchResult> =>
    api.get<GameLaunchResult>(`/game/lunch/${platformSign}/${accountSign}`);