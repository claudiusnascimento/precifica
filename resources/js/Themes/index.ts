import type { ThemePreset } from '@/types/theme';
import { defaultTheme } from '@/Themes/default';
import { preciFacilTheme } from '@/Themes/preci-facil';

export const themePresets: Record<string, ThemePreset> = {
    [preciFacilTheme.id]: preciFacilTheme,
    [defaultTheme.id]: defaultTheme,
};

export const themePresetList: ThemePreset[] = Object.values(themePresets);

export const defaultThemePresetId = preciFacilTheme.id;

export { defaultTheme, preciFacilTheme };
