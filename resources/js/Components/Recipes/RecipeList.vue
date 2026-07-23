<script setup lang="ts">
import { ref } from 'vue';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import type { Recipe } from '@/types/recipe';

defineProps<{
    items: Recipe[];
    loading?: boolean;
}>();

const emit = defineEmits<{
    delete: [recipe: Recipe];
}>();

const pendingDelete = ref<Recipe | null>(null);

function formatYield(recipe: Recipe): string {
    return `${Number(recipe.yield_quantity).toLocaleString('pt-BR', {
        maximumFractionDigits: 4,
    })} ${recipe.yield_unit_label}`;
}

function confirmDelete(recipe: Recipe): void {
    pendingDelete.value = recipe;
}

function handleConfirmDelete(): void {
    if (pendingDelete.value) {
        emit('delete', pendingDelete.value);
        pendingDelete.value = null;
    }
}

function onDeleteDialogOpenChange(open: boolean): void {
    if (!open) {
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
            Carregando receitas...
        </div>

        <div
            v-else-if="items.length === 0"
            class="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground"
        >
            Nenhuma receita cadastrada ainda.
        </div>

        <div
            v-else
            class="rounded-lg border border-border"
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Rendimento</TableHead>
                        <TableHead>Ingredientes</TableHead>
                        <TableHead class="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow
                        v-for="item in items"
                        :key="item.id"
                    >
                        <TableCell class="font-medium">{{ item.name }}</TableCell>
                        <TableCell>{{ formatYield(item) }}</TableCell>
                        <TableCell>{{ item.ingredients_count ?? 0 }}</TableCell>
                        <TableCell>
                            <div class="flex justify-end gap-2">
                                <Button
                                    as-child
                                    size="sm"
                                    variant="outline"
                                >
                                    <RouterLink :to="{ name: 'recipes.edit', params: { id: item.id } }">
                                        <Pencil data-icon="inline-start" />
                                        Editar
                                    </RouterLink>
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    @click="confirmDelete(item)"
                                >
                                    <Trash2 data-icon="inline-start" />
                                    Excluir
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <AlertDialog
            :open="pendingDelete !== null"
            @update:open="onDeleteDialogOpenChange"
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir receita?</AlertDialogTitle>
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
