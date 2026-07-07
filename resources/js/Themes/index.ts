import type { ThemePreset } from '@/types/theme';
import { customOrangeTheme } from '@/Themes/custom-orange';
import { defaultTheme } from '@/Themes/default';
import { zincTheme } from '@/Themes/zinc';

export const themePresets: Record<string, ThemePreset> = {
    [defaultTheme.id]: defaultTheme,
    [zincTheme.id]: zincTheme,
    [customOrangeTheme.id]: customOrangeTheme,
};

export const themePresetList: ThemePreset[] = Object.values(themePresets);

export const defaultThemePresetId = defaultTheme.id;

export { customOrangeTheme, defaultTheme, zincTheme };
