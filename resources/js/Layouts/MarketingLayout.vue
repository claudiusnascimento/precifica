<script setup lang="ts">
import LandingHeader from '@/Components/Marketing/LandingHeader.vue';
</script>

<template>
    <div class="flex min-h-screen flex-col bg-background">
        <LandingHeader />

        <main class="flex-1">
            <slot />
        </main>

        <footer class="border-t border-border py-8">
            <div class="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
                © {{ new Date().getFullYear() }} Precifica. Todos os direitos reservados.
            </div>
        </footer>
    </div>
</template>
