import { defineStore } from 'pinia';
import {
    defaultThemePresetId,
    themePresets,
    themePresetList,
} from '@/Themes';
import type { ThemeMode } from '@/types/theme';
import { THEME_CSS_VARIABLES } from '@/types/theme';

const STORAGE_KEY = 'precifica-theme';

interface ThemeState {
    currentMode: ThemeMode;
    currentPreset: string;
}

interface PersistedThemeState {
    currentMode: ThemeMode;
    currentPreset: string;
}

function loadPersistedState(): ThemeState {
    if (typeof window === 'undefined') {
        return {
            currentMode: 'light',
            currentPreset: defaultThemePresetId,
        };
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return {
                currentMode: 'light',
                currentPreset: defaultThemePresetId,
            };
        }

        const parsed = JSON.parse(raw) as PersistedThemeState;

        return {
            currentMode: parsed.currentMode === 'dark' ? 'dark' : 'light',
            currentPreset: themePresets[parsed.currentPreset]
                ? parsed.currentPreset
                : defaultThemePresetId,
        };
    } catch {
        return {
            currentMode: 'light',
            currentPreset: defaultThemePresetId,
        };
    }
}

function persistState(state: ThemeState): void {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            currentMode: state.currentMode,
            currentPreset: state.currentPreset,
        } satisfies PersistedThemeState),
    );
}

export const useThemeStore = defineStore('theme', {
    state: (): ThemeState => loadPersistedState(),

    getters: {
        presets: () => themePresetList,

        activePreset: (state) => themePresets[state.currentPreset] ?? themePresets[defaultThemePresetId],
    },

    actions: {
        applyTheme(): void {
            if (typeof document === 'undefined') {
                return;
            }

            const root = document.documentElement;
            const preset = this.activePreset;
            const variables = preset.variables[this.currentMode];

            root.classList.toggle('dark', this.currentMode === 'dark');

            for (const variable of THEME_CSS_VARIABLES) {
                const key = `--${variable}`;
                const value = variables[key];

                if (value) {
                    root.style.setProperty(key, value);
                } else {
                    root.style.removeProperty(key);
                }
            }

            persistState({
                currentMode: this.currentMode,
                currentPreset: this.currentPreset,
            });
        },

        setMode(mode: ThemeMode): void {
            this.currentMode = mode;
            this.applyTheme();
        },

        toggleMode(): void {
            this.setMode(this.currentMode === 'light' ? 'dark' : 'light');
        },

        setPreset(presetId: string): void {
            if (!themePresets[presetId]) {
                return;
            }

            this.currentPreset = presetId;
            this.applyTheme();
        },

        initialize(): void {
            this.applyTheme();
        },
    },
});
