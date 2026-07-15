import { api } from '@shared/api';
import type { GameLaunchResult } from '@shared/types/game';

export const launchGame = (
    platformSign: string,
    accountSign: string,
): Promise<GameLaunchResult> =>
    api.get<GameLaunchResult>(`/game/lunch/${platformSign}/${accountSign}`);