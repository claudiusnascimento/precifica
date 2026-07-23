<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Pencil, Trash2 } from 'lucide-vue-next';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import type { Ingredient } from '@/types/ingredient';

const props = defineProps<{
    items: Ingredient[];
    loading?: boolean;
}>();

const emit = defineEmits<{
    delete: [ingredient: Ingredient];
}>();

const pendingDelete = ref<Ingredient | null>(null);

const sortedItems = computed(() =>
    [...props.items].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
);

function formatPrice(value: string): string {
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    });
}

function confirmDelete(ingredient: Ingredient): void {
    pendingDelete.value = ingredient;
}

function handleConfirmDelete(): void {
    if (pendingDelete.value) {
        emit('delete', pendingDelete.value);
        pendingDelete.value = null;
    }
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <div
            v-if="loading"
            class="rounded-lg border border-border p-8 text-center text-sm text-muted-foreground"
        >
            Carregando ingredientes...
        </div>

        <div
            v-else-if="items.length === 0"
            class="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground"
        >
            Nenhum ingrediente cadastrado ainda.
        </div>

        <div
            v-else
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
            <div
                v-for="item in sortedItems"
                :key="item.id"
                class="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4"
            >
                <div class="flex flex-col gap-1">
                    <span class="font-semibold text-card-foreground">{{ item.name }}</span>
                    <span class="text-sm text-muted-foreground">
                        {{ formatPrice(item.price) }} / {{ item.unit_label }}
                    </span>
                </div>

                <div class="flex shrink-0 items-center gap-1">
                    <Button
                        as-child
                        size="icon"
                        variant="ghost"
                        aria-label="Editar"
                    >
                        <RouterLink :to="{ name: 'ingredients.edit', params: { id: item.id } }">
                            <Pencil />
                        </RouterLink>
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        class="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Excluir"
                        @click="confirmDelete(item)"
                    >
                        <Trash2 />
                    </Button>
                </div>
            </div>
        </div>

        <AlertDialog
            :open="pendingDelete !== null"
            @update:open="(open) => { if (!open) pendingDelete = null }"
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir ingrediente?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir
                        <strong>{{ pendingDelete?.name }}</strong>?
                        Esta ação não pode ser desfeita nesta versão.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <Button
                        variant="destructive"
                        @click="handleConfirmDelete"
                    >
                        Excluir
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>
