<script setup lang="ts">
import { ChevronDown, Moon, Palette, Sun } from 'lucide-vue-next';
import {
    activePresetLabel,
    currentMode,
    currentPreset,
    onModeChange,
    onPresetChange,
    presets,
} from '@/Composables/useThemeSelector';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button
                variant="outline"
                size="sm"
                class="gap-2"
            >
                <Palette class="size-4" />
                <span>{{ activePresetLabel }}</span>
                <ChevronDown class="size-4 opacity-60" />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            align="end"
            class="w-56"
        >
            <DropdownMenuLabel>Tema</DropdownMenuLabel>
            <DropdownMenuRadioGroup
                :model-value="currentPreset"
                @update:model-value="onPresetChange"
            >
                <DropdownMenuRadioItem
                    v-for="preset in presets"
                    :key="preset.id"
                    :value="preset.id"
                >
                    {{ preset.label }}
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Modo</DropdownMenuLabel>
            <DropdownMenuRadioGroup
                :model-value="currentMode"
                @update:model-value="onModeChange"
            >
                <DropdownMenuRadioItem value="light">
                    <Sun class="size-4" />
                    Claro
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                    <Moon class="size-4" />
                    Escuro
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
