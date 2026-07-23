<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import IngredientForm from '@/Components/Ingredients/IngredientForm.vue';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { useIngredientStore } from '@/Stores/ingredient';
import type { IngredientPayload } from '@/types/ingredient';

const route = useRoute();
const router = useRouter();
const ingredientStore = useIngredientStore();

const ingredientId = computed(() => {
    const id = route.params.id;

    return typeof id === 'string' ? Number(id) : null;
});

const isEditing = computed(
    () => ingredientId.value !== null && !Number.isNaN(ingredientId.value),
);

const pageTitle = computed(() =>
    isEditing.value ? 'Editar ingrediente' : 'Novo ingrediente',
);

const cardTitle = computed(() =>
    isEditing.value ? 'Atualizar dados' : 'Dados do ingrediente',
);

const submitLabel = computed(() => (isEditing.value ? 'Atualizar' : 'Criar'));

const initial = ref<IngredientPayload>({
    name: '',
    unit: '',
    price: '',
});

onMounted(async () => {
    ingredientStore.clearErrors();

    if (!isEditing.value || ingredientId.value === null) {
        return;
    }

    const ingredient = await ingredientStore.fetchOne(ingredientId.value);

    if (!ingredient) {
        await router.push({ name: 'ingredients.index' });

        return;
    }

    initial.value = {
        name: ingredient.name,
        unit: ingredient.unit,
        price: ingredient.price,
    };
});

async function handleSubmit(payload: IngredientPayload): Promise<void> {
    const result = isEditing.value && ingredientId.value !== null
        ? await ingredientStore.update(ingredientId.value, payload)
        : await ingredientStore.create(payload);

    if (result) {
        await router.push({ name: 'ingredients.index' });
    }
}
</script>

<template>
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div class="flex items-start justify-between gap-4">
            <div class="flex flex-col gap-1">
                <h2 class="text-2xl font-semibold tracking-tight text-foreground">
                    {{ pageTitle }}
                </h2>
                <p class="text-sm text-muted-foreground">
                    Informe o nome, a unidade de medida e o preço por unidade.
                </p>
            </div>

            <Button
                as-child
                variant="outline"
                size="sm"
                class="bg-card shadow-xs"
            >
                <RouterLink :to="{ name: 'ingredients.index' }">
                    <ArrowLeft data-icon="inline-start" />
                    Voltar
                </RouterLink>
            </Button>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>{{ cardTitle }}</CardTitle>
                <CardDescription>
                    O preço deve corresponder a 1 unidade da medida escolhida.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p
                    v-if="ingredientStore.error && Object.keys(ingredientStore.fieldErrors).length === 0"
                    class="mb-4 text-sm text-destructive"
                >
                    {{ ingredientStore.error }}
                </p>

                <IngredientForm
                    :initial="initial"
                    :submitting="ingredientStore.saving"
                    :field-errors="ingredientStore.fieldErrors"
                    :submit-label="submitLabel"
                    @submit="handleSubmit"
                />
            </CardContent>
        </Card>
    </div>
</template>
