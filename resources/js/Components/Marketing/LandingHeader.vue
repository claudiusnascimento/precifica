<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { Button } from '@/Components/ui/button';
import { useAuthStore } from '@/Stores/auth';
</script>

<template>
    <header class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <RouterLink
                to="/"
                class="text-lg font-semibold tracking-tight text-foreground"
            >
                Precifica
            </RouterLink>

            <div class="flex items-center gap-2">
                <template v-if="useAuthStore().isAuthenticated">
                    <Button
                        as-child
                        size="sm"
                    >
                        <RouterLink :to="{ name: 'dashboard' }">
                            Ir para o Dashboard
                        </RouterLink>
                    </Button>
                </template>
                <template v-else>
                    <Button
                        as-child
                        variant="outline"
                        size="sm"
                    >
                        <RouterLink :to="{ name: 'login' }">
                            Entrar
                        </RouterLink>
                    </Button>
                    <Button
                        as-child
                        size="sm"
                    >
                        <RouterLink :to="{ name: 'register' }">
                            Cadastrar
                        </RouterLink>
                    </Button>
                </template>
            </div>
        </div>
    </header>
</template>
