export interface GameLaunchConfig {
    launch_mode: 'iframe' | 'redirect' | 'new_tab';
    full_screen: boolean;
    support_mobile: boolean;
    support_pc: boolean;
    logo: string | null;
    theme_color: string | null;
    iframe_scrolling: boolean;
}

export interface GameLaunchResult {
    url: string;
    config: GameLaunchConfig;
}