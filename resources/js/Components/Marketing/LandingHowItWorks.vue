<script setup lang="ts">
import { ChefHat, LineChart, ShoppingBasket } from 'lucide-vue-next';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';

const steps = [
    {
        icon: ShoppingBasket,
        title: 'Cadastre ingredientes e custos',
        description: 'Informe o preço de cada insumo e mantenha seus custos sempre atualizados.',
    },
    {
        icon: ChefHat,
        title: 'Monte a receita e o rendimento',
        description: 'Defina quantas unidades sua receita produz — pastéis, bolos, salgados ou doces.',
    },
    {
        icon: LineChart,
        title: 'Veja margens e ganho mensal',
        description: 'Compare cenários com 20%, 40% e 60% de margem e projete seu faturamento.',
    },
];
</script>

<template>
    <section
        id="como-funciona"
        class="border-b border-border bg-muted/30"
    >
        <div class="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20">
            <div class="flex max-w-2xl flex-col gap-4">
                <h2 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Como funciona
                </h2>
                <p class="text-lg text-muted-foreground">
                    Em três passos você sai do achismo e passa a precificar com números reais.
                </p>
            </div>

            <div class="grid gap-6 md:grid-cols-3">
                <Card
                    v-for="(step, index) in steps"
                    :key="step.title"
                >
                    <CardHeader>
                        <div class="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <component :is="step.icon" />
                        </div>
                        <CardTitle class="text-lg">
                            {{ index + 1 }}. {{ step.title }}
                        </CardTitle>
                        <CardDescription>
                            {{ step.description }}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    </section>
</template>
