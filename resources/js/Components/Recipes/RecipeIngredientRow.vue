<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Trash2 } from 'lucide-vue-next';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { useIngredientStore } from '@/Stores/ingredient';
import type { Ingredient } from '@/types/ingredient';
import type { RecipeIngredientPayload } from '@/types/recipe';

const props = defineProps<{
    modelValue: RecipeIngredientPayload;
    ingredients: Ingredient[];
    index: number;
    fieldErrors?: Record<string, string[]>;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: RecipeIngredientPayload): void;
    (e: 'remove'): void;
}>();

const ingredientStore = useIngredientStore();

const selectedIngredientId = computed(() =>
    props.modelValue.id !== null ? String(props.modelValue.id) : undefined,
);

const selectedUnit = computed(() => props.modelValue.unit || undefined);

const idError = computed(
    () => props.fieldErrors?.[`ingredients.${props.index}.id`]?.[0],
);

const quantityError = computed(
    () => props.fieldErrors?.[`ingredients.${props.index}.quantity`]?.[0],
);

function onIngredientChange(value: string | number | boolean | Record<string, unknown> | null | undefined): void {
    if (value === null || value === undefined || typeof value === 'object') {
        emit('update:modelValue', {
            ...props.modelValue,
            id: null,
            unit: '',
        });

        return;
    }

    const id = Number(value);
    const ingredient = props.ingredients.find((item) => item.id === id);

    emit('update:modelValue', {
        ...props.modelValue,
        id: Number.isNaN(id) ? null : id,
        unit: ingredient?.unit ?? '',
    });
}

function onQuantityChange(value: string | number): void {
    emit('update:modelValue', {
        ...props.modelValue,
        quantity: value,
    });
}

function removeRow(): void {
    emit('remove');
}

onMounted(async () => {
    await ingredientStore.fetchUnits();
});
</script>

<template>
    <div class="recipe-ingredient-row flex flex-col gap-3 rounded-xl border border-border/80 bg-muted/40 p-4 sm:flex-row sm:items-end">
        <div class="flex min-w-0 flex-1 flex-col gap-2">
            <Label :for="`recipe-ingredient-${index}`">Ingrediente</Label>
            <Select
                :model-value="selectedIngredientId"
                @update:model-value="onIngredientChange"
            >
                <SelectTrigger
                    :id="`recipe-ingredient-${index}`"
                    class="w-full bg-card"
                    :aria-invalid="Boolean(idError)"
                >
                    <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem
                            v-for="ingredient in ingredients"
                            :key="ingredient.id"
                            :value="String(ingredient.id)"
                        >
                            {{ ingredient.name }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <p
                v-if="idError"
                class="text-sm text-destructive"
            >
                {{ idError }}
            </p>
        </div>

        <div class="flex w-full flex-col gap-2 sm:w-28">
            <Label :for="`recipe-quantity-${index}`">Quantidade</Label>
            <Input
                :id="`recipe-quantity-${index}`"
                class="bg-card"
                type="number"
                min="0.0001"
                step="0.0001"
                required
                :model-value="modelValue.quantity"
                :aria-invalid="Boolean(quantityError)"
                @update:model-value="onQuantityChange"
            />
            <p
                v-if="quantityError"
                class="text-sm text-destructive"
            >
                {{ quantityError }}
            </p>
        </div>

        <div class="flex w-full flex-col gap-2 sm:w-40">
            <Label :for="`recipe-unit-${index}`">Unidade</Label>
            <Select
                :model-value="selectedUnit"
                disabled
            >
                <SelectTrigger
                    :id="`recipe-unit-${index}`"
                    class="w-full bg-card"
                >
                    <SelectValue placeholder="Unidade" />
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
        </div>

        <div class="flex items-end pb-0.5">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                class="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remover ingrediente"
                @click="removeRow"
            >
                <Trash2 />
            </Button>
        </div>
    </div>
</template>
