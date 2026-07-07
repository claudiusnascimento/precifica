<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-background p-6">
        <div class="w-full max-w-md space-y-4 text-center">
            <slot />
            <p class="text-sm text-muted-foreground">
                <RouterLink
                    to="/"
                    class="underline underline-offset-4 hover:text-foreground"
                >
                    Voltar para a Home
                </RouterLink>
            </p>
        </div>
    </div>
</template>
