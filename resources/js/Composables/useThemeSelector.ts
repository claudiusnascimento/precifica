import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import type { AcceptableValue } from 'reka-ui';
import { useThemeStore } from '@/Stores/theme';
import type { ThemeMode } from '@/types/theme';

const themeStore = useThemeStore();
const { currentMode, currentPreset, presets } = storeToRefs(themeStore);

const activePresetLabel = computed(
    () => presets.value.find((preset) => preset.id === currentPreset.value)?.label ?? 'Tema',
);

function onPresetChange(value: AcceptableValue): void {
    if (typeof value !== 'string') {
        return;
    }

    themeStore.setPreset(value);
}

function onModeChange(value: AcceptableValue): void {
    if (value !== 'light' && value !== 'dark') {
        return;
    }

    themeStore.setMode(value as ThemeMode);
}

export {
    activePresetLabel,
    currentMode,
    currentPreset,
    onModeChange,
    onPresetChange,
    presets,
};
