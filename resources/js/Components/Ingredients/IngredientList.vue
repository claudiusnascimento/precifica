<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Pencil, Trash2 } from 'lucide-vue-next';
import {
    AlertDialog,
    AlertDialogAction,
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
import type { Ingredient } from '@/types/ingredient';

defineProps<{
    items: Ingredient[];
    loading?: boolean;
}>();

const emit = defineEmits<{
    delete: [ingredient: Ingredient];
}>();

const pendingDelete = ref<Ingredient | null>(null);

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
            class="rounded-lg border border-border"
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead class="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow
                        v-for="item in items"
                        :key="item.id"
                    >
                        <TableCell class="font-medium">{{ item.name }}</TableCell>
                        <TableCell>{{ item.unit_label }}</TableCell>
                        <TableCell>{{ formatPrice(item.price) }}</TableCell>
                        <TableCell>
                            <div class="flex justify-end gap-2">
                                <Button
                                    as-child
                                    size="sm"
                                    variant="outline"
                                >
                                    <RouterLink :to="{ name: 'ingredients.edit', params: { id: item.id } }">
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
                    <AlertDialogAction as-child>
                        <Button
                            variant="destructive"
                            @click="handleConfirmDelete"
                        >
                            Excluir
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>
