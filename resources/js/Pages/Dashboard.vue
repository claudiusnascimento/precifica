<script setup lang="ts">
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
</script>

<template>
    <div class="space-y-6">
        <div>
            <h2 class="text-2xl font-semibold tracking-tight text-foreground">
                Dashboard
            </h2>
            <p class="text-sm text-muted-foreground">
                Visão geral da sua operação de precificação.
            </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Receitas</CardTitle>
                    <CardDescription>
                        Gerencie fichas técnicas e margens de lucro.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button>Nova receita</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Insumos</CardTitle>
                    <CardDescription>
                        Controle custos de ingredientes e desperdício.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline">
                        Ver insumos
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Relatórios</CardTitle>
                    <CardDescription>
                        Acompanhe indicadores de rentabilidade.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="secondary">
                        Em breve
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
