<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import RecipeForm from '@/Components/Recipes/RecipeForm.vue';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
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
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
                <h2 class="text-2xl font-semibold tracking-tight text-foreground">
                    {{ isEditing ? 'Editar receita' : 'Nova receita' }}
                </h2>
                <p class="text-sm text-muted-foreground">
                    Informe o rendimento e, se quiser, os ingredientes da receita.
                </p>
            </div>

            <RouterLink
                :to="{ name: 'recipes.index' }"
                class="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
                Voltar
            </RouterLink>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>{{ isEditing ? 'Atualizar dados' : 'Dados da receita' }}</CardTitle>
                <CardDescription>
                    A unidade de cada ingrediente vem do cadastro do próprio insumo.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p
                    v-if="recipeStore.error && Object.keys(recipeStore.fieldErrors).length === 0"
                    class="mb-4 text-sm text-destructive"
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
            </CardContent>
        </Card>
    </div>
</template>
