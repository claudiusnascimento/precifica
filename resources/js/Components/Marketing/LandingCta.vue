<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { Button } from '@/Components/ui/button';
</script>

<template>
    <section>
        <div class="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
            <h2 class="max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Comece a precificar com clareza hoje
            </h2>
            <p class="max-w-xl text-lg text-muted-foreground">
                Cadastre-se em minutos e descubra o preço certo para suas receitas —
                com margem de lucro que faz sentido para o seu negócio.
            </p>
            <Button
                as-child
                size="lg"
            >
                <RouterLink :to="{ name: 'register' }">
                    Criar conta grátis
                    <ArrowRight data-icon="inline-end" />
                </RouterLink>
            </Button>
        </div>
    </section>
</template>
