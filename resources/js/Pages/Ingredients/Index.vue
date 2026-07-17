<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { Plus } from 'lucide-vue-next';
import IngredientList from '@/Components/Ingredients/IngredientList.vue';
import { Button } from '@/Components/ui/button';
import { useIngredientStore } from '@/Stores/ingredient';
import type { Ingredient } from '@/types/ingredient';

const ingredientStore = useIngredientStore();

onMounted(async () => {
    await ingredientStore.fetch();
});

async function handleDelete(ingredient: Ingredient): Promise<void> {
    await ingredientStore.remove(ingredient.id);
}
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
                <h2 class="text-2xl font-semibold tracking-tight text-foreground">
                    Ingredientes
                </h2>
                <p class="text-sm text-muted-foreground">
                    Cadastre insumos com preço por unidade para precificar suas receitas.
                </p>
            </div>

            <Button as-child>
                <RouterLink :to="{ name: 'ingredients.create' }">
                    <Plus data-icon="inline-start" />
                    Novo ingrediente
                </RouterLink>
            </Button>
        </div>

        <p
            v-if="ingredientStore.error"
            class="text-sm text-destructive"
        >
            {{ ingredientStore.error }}
        </p>

        <IngredientList
            :items="ingredientStore.items"
            :loading="ingredientStore.loading"
            @delete="handleDelete"
        />
    </div>
</template>
