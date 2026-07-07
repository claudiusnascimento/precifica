<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useAuthStore } from '@/Stores/auth';
import type { AxiosError } from 'axios';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const remember = ref(false);
const errorMessage = ref('');
const isSubmitting = ref(false);

async function handleSubmit(): Promise<void> {
    errorMessage.value = '';
    isSubmitting.value = true;

    try {
        await authStore.login({
            email: email.value,
            password: password.value,
            remember: remember.value,
        });
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;

        errorMessage.value = axiosError.response?.data?.errors?.email?.[0]
            ?? axiosError.response?.data?.message
            ?? 'Não foi possível realizar o login.';
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <GuestLayout>
        <Card class="w-full text-left">
            <CardHeader>
                <CardTitle>Entrar</CardTitle>
                <CardDescription>
                    Acesse sua conta para gerenciar precificação e custos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    class="space-y-4"
                    @submit.prevent="handleSubmit"
                >
                    <div class="space-y-2">
                        <Label for="email">E-mail</Label>
                        <Input
                            id="email"
                            v-model="email"
                            type="email"
                            autocomplete="email"
                            required
                        />
                    </div>

                    <div class="space-y-2">
                        <Label for="password">Senha</Label>
                        <Input
                            id="password"
                            v-model="password"
                            type="password"
                            autocomplete="current-password"
                            required
                        />
                    </div>

                    <div class="flex items-center gap-2">
                        <input
                            id="remember"
                            v-model="remember"
                            type="checkbox"
                            class="size-4 rounded border border-input"
                        >
                        <Label for="remember">Lembrar-me</Label>
                    </div>

                    <p
                        v-if="errorMessage"
                        class="text-sm text-destructive"
                    >
                        {{ errorMessage }}
                    </p>

                    <Button
                        type="submit"
                        class="w-full"
                        :disabled="isSubmitting"
                    >
                        {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
                    </Button>

                    <p class="text-center text-sm text-muted-foreground">
                        <RouterLink
                            :to="{ name: 'forgot-password' }"
                            class="underline underline-offset-4 hover:text-foreground"
                        >
                            Esqueceu sua senha?
                        </RouterLink>
                    </p>
                </form>
            </CardContent>
        </Card>
    </GuestLayout>
</template>
