<script setup lang="ts">
import { Badge } from '@/Components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';

const costTotal = 40;
const yieldUnits = 50;
const costPerUnit = costTotal / yieldUnits;
const monthlySales = 500;

const margins = [
    { label: '20%', markup: 0.2 },
    { label: '40%', markup: 0.4 },
    { label: '60%', markup: 0.6 },
];

function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function priceWithMargin(markup: number): number {
    return costPerUnit * (1 + markup);
}

function monthlyProfit(markup: number): number {
    return (priceWithMargin(markup) - costPerUnit) * monthlySales;
}
</script>

<template>
    <section class="border-b border-border bg-muted/30">
        <div class="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20">
            <div class="flex max-w-2xl flex-col gap-4">
                <Badge
                    variant="outline"
                    class="w-fit"
                >
                    Exemplo prático
                </Badge>
                <h2 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Quanto dá para ganhar vendendo pastel?
                </h2>
                <p class="text-lg text-muted-foreground">
                    Uma receita com {{ formatCurrency(costTotal) }} em ingredientes rende
                    {{ yieldUnits }} pastéis — custo de {{ formatCurrency(costPerUnit) }} por unidade.
                    Vendendo {{ monthlySales }} unidades por mês:
                </p>
            </div>

            <div class="grid gap-6 md:grid-cols-3">
                <Card
                    v-for="margin in margins"
                    :key="margin.label"
                >
                    <CardHeader>
                        <CardTitle>Margem de {{ margin.label }}</CardTitle>
                        <CardDescription>
                            Preço sugerido por unidade
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="flex flex-col gap-4">
                        <p class="text-3xl font-bold text-foreground">
                            {{ formatCurrency(priceWithMargin(margin.markup)) }}
                        </p>
                        <Separator />
                        <div class="flex flex-col gap-1">
                            <span class="text-sm text-muted-foreground">Lucro mensal estimado</span>
                            <span class="text-xl font-semibold text-primary">
                                {{ formatCurrency(monthlyProfit(margin.markup)) }}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>
</template>
