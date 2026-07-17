<script setup lang="ts">
import { ArrowRight, Sparkles } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
</script>

<template>
    <section class="border-b border-border">
        <div class="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 md:py-28">
            <Badge
                variant="secondary"
                class="w-fit"
            >
                <Sparkles data-icon="inline-start" />
                Precificação para quem produz comida
            </Badge>

            <div class="flex max-w-3xl flex-col gap-6">
                <h1 class="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                    Descubra quanto você realmente ganha por hora
                </h1>
                <p class="text-lg text-muted-foreground md:text-xl">
                    Cadastre ingredientes, monte suas receitas e veja na hora o custo por unidade,
                    o preço ideal e quanto você pode faturar no mês — com margens de 20%, 40% e 60%.
                </p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row">
                <Button
                    as-child
                    size="lg"
                >
                    <RouterLink :to="{ name: 'register' }">
                        Cadastrar grátis
                        <ArrowRight data-icon="inline-end" />
                    </RouterLink>
                </Button>
                <Button
                    as-child
                    variant="outline"
                    size="lg"
                >
                    <a href="#como-funciona">
                        Ver como funciona
                    </a>
                </Button>
            </div>
        </div>
    </section>
</template>
