<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { Plus } from 'lucide-vue-next';
import RecipeList from '@/Components/Recipes/RecipeList.vue';
import { Button } from '@/Components/ui/button';
import { useRecipeStore } from '@/Stores/recipe';
import type { Recipe } from '@/types/recipe';

const recipeStore = useRecipeStore();

onMounted(async () => {
    await recipeStore.fetch();
});

async function handleDelete(recipe: Recipe): Promise<void> {
    await recipeStore.remove(recipe.id);
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
                <h2 class="text-2xl font-semibold tracking-tight text-foreground">
                    Receitas
                </h2>
                <p class="text-sm text-muted-foreground">
                    Monte receitas com rendimento e ingredientes para precificar depois.
                </p>
            </div>

            <Button as-child>
                <RouterLink :to="{ name: 'recipes.create' }">
                    <Plus data-icon="inline-start" />
                    Nova receita
                </RouterLink>
            </Button>
        </div>

        <p
            v-if="recipeStore.error"
            class="text-sm text-destructive"
        >
            {{ recipeStore.error }}
        </p>

        <RecipeList
            :items="recipeStore.items"
            :loading="recipeStore.loading"
            @delete="handleDelete"
        />
    </div>
</template>
