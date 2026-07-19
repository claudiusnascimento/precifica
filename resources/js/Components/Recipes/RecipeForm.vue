<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue';
import { Plus } from 'lucide-vue-next';
import UnitSelect from '@/Components/Ingredients/UnitSelect.vue';
import RecipeIngredientRow from '@/Components/Recipes/RecipeIngredientRow.vue';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useIngredientStore } from '@/Stores/ingredient';
import type { RecipeIngredientPayload, RecipePayload } from '@/types/recipe';

const props = withDefaults(defineProps<{
    initial?: {
        name: string;
        yield_quantity: number | string;
        yield_unit: RecipePayload['yield_unit'];
        ingredients: RecipeIngredientPayload[];
    };
    submitting?: boolean;
    fieldErrors?: Record<string, string[]>;
    submitLabel?: string;
}>(), {
    initial: () => ({
        name: '',
        yield_quantity: '',
        yield_unit: '',
        ingredients: [],
    }),
    submitting: false,
    fieldErrors: () => ({}),
    submitLabel: 'Salvar',
});

const emit = defineEmits<{
    submit: [payload: RecipePayload];
}>();

const ingredientStore = useIngredientStore();

const form = reactive({
    name: props.initial.name,
    yield_quantity: props.initial.yield_quantity,
    yield_unit: props.initial.yield_unit,
    ingredients: [...props.initial.ingredients] as RecipeIngredientPayload[],
});

watch(
    () => props.initial,
    (value) => {
        form.name = value.name;
        form.yield_quantity = value.yield_quantity;
        form.yield_unit = value.yield_unit;
        form.ingredients = value.ingredients.map((item) => ({ ...item }));
    },
    { deep: true },
);

onMounted(async () => {
    await ingredientStore.fetch({ per_page: 100 });
    await ingredientStore.fetchUnits();
});

function addIngredientRow(): void {
    form.ingredients.push({
        id: null,
        quantity: '',
        unit: '',
    });
}

function removeIngredientRow(index: number): void {
    form.ingredients.splice(index, 1);
}

function updateIngredientRow(index: number, value: RecipeIngredientPayload): void {
    form.ingredients[index] = value;
}

function fieldError(field: string): string | undefined {
    return props.fieldErrors?.[field]?.[0];
}

function onSubmit(): void {
    const ingredients = form.ingredients
        .filter((item): item is RecipeIngredientPayload & { id: number } => item.id !== null)
        .map((item) => ({
            id: item.id,
            quantity: item.quantity,
        }));

    emit('submit', {
        name: form.name.trim(),
        yield_quantity: form.yield_quantity,
        yield_unit: form.yield_unit,
        ingredients,
    });
}
</script>

<template>
    <form
        class="flex flex-col gap-6"
        @submit.prevent="onSubmit"
    >
        <Card>
            <CardHeader class="pb-2">
                <CardTitle class="text-base font-semibold">
                    Informações da Receita
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,0.8fr)_minmax(0,1fr)]">
                    <div class="flex flex-col gap-2">
                        <Label for="recipe-name">Nome da receita</Label>
                        <Input
                            id="recipe-name"
                            v-model="form.name"
                            type="text"
                            maxlength="120"
                            placeholder="Ex: Macarrão Caseiro"
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
                        <Label for="recipe-yield-quantity">Rendimento</Label>
                        <Input
                            id="recipe-yield-quantity"
                            v-model="form.yield_quantity"
                            type="number"
                            min="0.0001"
                            step="0.0001"
                            placeholder="Ex: 1,2"
                            required
                            :aria-invalid="Boolean(fieldError('yield_quantity'))"
                        />
                        <p
                            v-if="fieldError('yield_quantity')"
                            class="text-sm text-destructive"
                        >
                            {{ fieldError('yield_quantity') }}
                        </p>
                    </div>

                    <div class="flex flex-col gap-2">
                        <Label for="recipe-yield-unit">Unidade</Label>
                        <UnitSelect v-model="form.yield_unit" />
                        <p
                            v-if="fieldError('yield_unit')"
                            class="text-sm text-destructive"
                        >
                            {{ fieldError('yield_unit') }}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader class="flex flex-row items-center justify-between gap-4 pb-2">
                <CardTitle class="text-base font-semibold">
                    Ingredientes
                </CardTitle>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    class="bg-card shadow-xs"
                    @click="addIngredientRow"
                >
                    <Plus data-icon="inline-start" />
                    Adicionar
                </Button>
            </CardHeader>
            <CardContent class="flex flex-col gap-3">
                <p
                    v-if="form.ingredients.length === 0"
                    class="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground"
                >
                    Nenhum ingrediente adicionado. Clique em Adicionar ou salve a receita assim mesmo.
                </p>

                <RecipeIngredientRow
                    v-for="(row, index) in form.ingredients"
                    :key="index"
                    :model-value="row"
                    :ingredients="ingredientStore.items"
                    :index="index"
                    :field-errors="props.fieldErrors"
                    @update:model-value="(value: RecipeIngredientPayload) => updateIngredientRow(index, value)"
                    @remove="removeIngredientRow(index)"
                />
            </CardContent>
        </Card>

        <div class="flex justify-end">
            <Button
                type="submit"
                :disabled="submitting"
            >
                {{ submitting ? 'Salvando...' : submitLabel }}
            </Button>
        </div>
    </form>
</template>
