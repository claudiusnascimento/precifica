<script setup lang="ts">
import { BadgeDollarSign, Clock, ShieldCheck, TrendingUp } from 'lucide-vue-next';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';

const benefits = [
    {
        icon: BadgeDollarSign,
        title: 'Custo real por unidade',
        description: 'Saiba exatamente quanto custa produzir cada pastel, bolo ou salgado — sem planilhas confusas.',
    },
    {
        icon: TrendingUp,
        title: 'Margem de lucro clara',
        description: 'Compare diferentes margens e escolha o preço que faz sentido para o seu negócio.',
    },
    {
        icon: ShieldCheck,
        title: 'Preço com confiança',
        description: 'Pare de chutar valores. Venda com a certeza de que está cobrindo custos e lucrando.',
    },
    {
        icon: Clock,
        title: 'Hora trabalhada visível',
        description: 'Entenda quanto você ganha pelo tempo investido na produção e na venda.',
    },
];
</script>

<template>
    <section class="border-b border-border">
        <div class="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20">
            <div class="flex max-w-2xl flex-col gap-4">
                <h2 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Por que usar o Precifica
                </h2>
                <p class="text-lg text-muted-foreground">
                    Ferramentas pensadas para quem vende comida e precisa de clareza financeira.
                </p>
            </div>

            <div class="grid gap-6 sm:grid-cols-2">
                <Card
                    v-for="benefit in benefits"
                    :key="benefit.title"
                >
                    <CardHeader>
                        <div class="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <component :is="benefit.icon" />
                        </div>
                        <CardTitle class="text-lg">
                            {{ benefit.title }}
                        </CardTitle>
                        <CardDescription>
                            {{ benefit.description }}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </div>
    </section>
</template>
