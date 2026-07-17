<script setup lang="ts">
import { reactive, watch } from 'vue';
import UnitSelect from '@/Components/Ingredients/UnitSelect.vue';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import type { IngredientPayload } from '@/types/ingredient';

const props = withDefaults(defineProps<{
    initial?: IngredientPayload;
    submitting?: boolean;
    fieldErrors?: Record<string, string[]>;
    submitLabel?: string;
}>(), {
    initial: () => ({
        name: '',
        unit: '',
        price: '',
    }),
    submitting: false,
    fieldErrors: () => ({}),
    submitLabel: 'Salvar',
});

const emit = defineEmits<{
    submit: [payload: IngredientPayload];
}>();

const form = reactive<IngredientPayload>({
    name: props.initial.name,
    unit: props.initial.unit,
    price: props.initial.price,
});

watch(
    () => props.initial,
    (value) => {
        form.name = value.name;
        form.unit = value.unit;
        form.price = value.price;
    },
    { deep: true },
);

function onSubmit(): void {
    emit('submit', {
        name: form.name.trim(),
        unit: form.unit,
        price: form.price,
    });
}

function fieldError(field: string): string | undefined {
    return props.fieldErrors[field]?.[0];
}
</script>

<template>
    <form
        class="flex flex-col gap-4"
        @submit.prevent="onSubmit"
    >
        <div class="flex flex-col gap-2">
            <Label for="ingredient-name">Nome</Label>
            <Input
                id="ingredient-name"
                v-model="form.name"
                type="text"
                maxlength="120"
                required
                :aria-invalid="Boolean(fieldError('name'))"
            />
            <p
                v-if="fieldError('name')"
                class="text-sm text-destructive"
            >
                {{ fieldError('name') }}
            </p>
        </div>

        <div class="flex flex-col gap-2">
            <Label for="ingredient-unit">Unidade</Label>
            <UnitSelect v-model="form.unit" />
            <p
                v-if="fieldError('unit')"
                class="text-sm text-destructive"
            >
                {{ fieldError('unit') }}
            </p>
        </div>

        <div class="flex flex-col gap-2">
            <Label for="ingredient-price">Preço por unidade</Label>
            <Input
                id="ingredient-price"
                v-model="form.price"
                type="number"
                min="0"
                step="0.0001"
                required
                :aria-invalid="Boolean(fieldError('price'))"
            />
            <p
                v-if="fieldError('price')"
                class="text-sm text-destructive"
            >
                {{ fieldError('price') }}
            </p>
        </div>

        <Button
            type="submit"
            :disabled="submitting"
        >
            {{ submitting ? 'Salvando...' : submitLabel }}
        </Button>
    </form>
</template>
