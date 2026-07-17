<script setup lang="ts">
import { onMounted } from 'vue';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { useIngredientStore } from '@/Stores/ingredient';
import type { IngredientUnitValue } from '@/types/ingredient';

const model = defineModel<IngredientUnitValue | ''>({ default: '' });

const ingredientStore = useIngredientStore();

onMounted(async () => {
    await ingredientStore.fetchUnits();
});
</script>

<template>
    <Select
        :model-value="model || undefined"
        @update:model-value="(value) => (model = (value as IngredientUnitValue) ?? '')"
    >
        <SelectTrigger class="w-full">
            <SelectValue placeholder="Selecione a unidade" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectItem
                    v-for="unit in ingredientStore.units"
                    :key="unit.value"
                    :value="unit.value"
                >
                    {{ unit.label }}
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>
