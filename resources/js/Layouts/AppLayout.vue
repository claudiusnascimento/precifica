<script setup lang="ts">
import { RouterLink } from 'vue-router';
import ThemeSelector from '@/Components/ThemeSelector.vue';
import { Button } from '@/Components/ui/button';
import { useAuthStore } from '@/Stores/auth';
</script>

<template>
    <div class="flex min-h-screen bg-background">
        <aside class="flex w-64 flex-col border-r border-border bg-card">
            <div class="flex h-16 items-center border-b border-border px-6">
                <span class="text-lg font-semibold tracking-tight text-foreground">
                    Precifica
                </span>
            </div>

            <nav class="flex flex-1 flex-col gap-1 p-4">
                <RouterLink
                    :to="{ name: 'dashboard' }"
                    class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    active-class="bg-accent text-accent-foreground"
                >
                    Dashboard
                </RouterLink>
                <RouterLink
                    :to="{ name: 'ingredients.index' }"
                    class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    active-class="bg-accent text-accent-foreground"
                >
                    Ingredientes
                </RouterLink>
            </nav>
        </aside>

        <div class="flex flex-1 flex-col">
            <header class="flex h-16 items-center justify-between gap-4 border-b border-border px-6">
                <h1 class="text-sm font-medium text-muted-foreground">
                    Gestão de precificação e custos
                </h1>
                <div class="flex items-center gap-2">
                    <ThemeSelector />
                    <Button
                        size="sm"
                        variant="outline"
                        @click="useAuthStore().logout()"
                    >
                        Sair
                    </Button>
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-6">
                <RouterView />
            </main>
        </div>
    </div>
</template>
