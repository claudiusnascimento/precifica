<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import RecipeForm from '@/Components/Recipes/RecipeForm.vue';
import { Button } from '@/Components/ui/button';
import { useRecipeStore } from '@/Stores/recipe';
import type { RecipeIngredientPayload, RecipePayload } from '@/types/recipe';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();

const recipeId = computed(() => {
    const id = route.params.id;

    return typeof id === 'string' ? Number(id) : null;
});

const isEditing = computed(() => recipeId.value !== null && !Number.isNaN(recipeId.value));

const initial = ref<{
    name: string;
    yield_quantity: number | string;
    yield_unit: RecipePayload['yield_unit'];
    ingredients: RecipeIngredientPayload[];
}>({
    name: '',
    yield_quantity: '',
    yield_unit: '',
    ingredients: [],
});

onMounted(async () => {
    recipeStore.clearErrors();

    if (!isEditing.value || recipeId.value === null) {
        return;
    }

    const recipe = await recipeStore.fetchOne(recipeId.value);

    if (!recipe) {
        await router.push({ name: 'recipes.index' });

        return;
    }

    initial.value = {
        name: recipe.name,
        yield_quantity: recipe.yield_quantity,
        yield_unit: recipe.yield_unit,
        ingredients: (recipe.ingredients ?? []).map((item) => ({
            id: item.id,
            quantity: item.quantity,
            unit: item.unit,
        })),
    };
});

async function handleSubmit(payload: RecipePayload): Promise<void> {
    const result = isEditing.value && recipeId.value !== null
        ? await recipeStore.update(recipeId.value, payload)
        : await recipeStore.create(payload);

    if (result) {
        await router.push({ name: 'recipes.index' });
    }
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div class="flex items-start justify-between gap-4">
            <div class="flex flex-col gap-1">
                <h2 class="font-serif text-3xl font-semibold tracking-tight text-foreground">
                    {{ isEditing ? 'Editar receita' : 'Nova Receita' }}
                </h2>
                <p class="text-sm text-muted-foreground">
                    Configure os ingredientes e custos
                </p>
            </div>

            <Button
                as-child
                variant="outline"
                size="sm"
                class="bg-card shadow-xs"
            >
                <RouterLink :to="{ name: 'recipes.index' }">
                    <ArrowLeft data-icon="inline-start" />
                    Voltar
                </RouterLink>
            </Button>
        </div>

        <p
            v-if="recipeStore.error && Object.keys(recipeStore.fieldErrors).length === 0"
            class="text-sm text-destructive"
        >
            {{ recipeStore.error }}
        </p>

        <RecipeForm
            :initial="initial"
            :submitting="recipeStore.saving"
            :field-errors="recipeStore.fieldErrors"
            :submit-label="isEditing ? 'Atualizar' : 'Criar'"
            @submit="handleSubmit"
        />
    </div>
</template>
