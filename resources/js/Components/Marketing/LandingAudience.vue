<script setup lang="ts">
import { Check } from 'lucide-vue-next';

const audiences = [
    'MEIs e autônomos que vendem comida artesanal',
    'Confeiteiros e doceiras que trabalham sob encomenda',
    'Salgadeiros e produtores de pastel, coxinha e fritos',
    'Food trucks e pequenos negócios gastronômicos',
];
</script>

<template>
    <section class="border-b border-border">
        <div class="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 md:flex-row md:items-center">
            <div class="flex max-w-xl flex-col gap-4">
                <h2 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Para quem é o Precifica
                </h2>
                <p class="text-lg text-muted-foreground">
                    Se você produz comida e precisa saber se o preço cobre custo, tempo e lucro,
                    o Precifica foi feito para você.
                </p>
            </div>

            <ul class="flex flex-1 flex-col gap-4">
                <li
                    v-for="item in audiences"
                    :key="item"
                    class="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                >
                    <div class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check class="size-4" />
                    </div>
                    <span class="text-foreground">{{ item }}</span>
                </li>
            </ul>
        </div>
    </section>
</template>
