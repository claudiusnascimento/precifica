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

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

async function handleSubmit(): Promise<void> {
    errorMessage.value = '';
    isSubmitting.value = true;

    try {
        await authStore.register({
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
        });
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
        const errors = axiosError.response?.data?.errors;

        errorMessage.value = errors?.email?.[0]
            ?? errors?.password?.[0]
            ?? errors?.name?.[0]
            ?? axiosError.response?.data?.message
            ?? 'Não foi possível realizar o cadastro.';
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <GuestLayout>
        <Card class="w-full text-left">
            <CardHeader>
                <CardTitle>Criar conta</CardTitle>
                <CardDescription>
                    Cadastre-se para começar a precificar suas receitas com clareza.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    class="flex flex-col gap-4"
                    @submit.prevent="handleSubmit"
                >
                    <div class="flex flex-col gap-2">
                        <Label for="name">Nome</Label>
                        <Input
                            id="name"
                            v-model="name"
                            type="text"
                            autocomplete="name"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <Label for="email">E-mail</Label>
                        <Input
                            id="email"
                            v-model="email"
                            type="email"
                            autocomplete="email"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <Label for="password">Senha</Label>
                        <Input
                            id="password"
                            v-model="password"
                            type="password"
                            autocomplete="new-password"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <Label for="password_confirmation">Confirmar senha</Label>
                        <Input
                            id="password_confirmation"
                            v-model="passwordConfirmation"
                            type="password"
                            autocomplete="new-password"
                            required
                        />
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
                        {{ isSubmitting ? 'Cadastrando...' : 'Cadastrar' }}
                    </Button>

                    <p class="text-center text-sm text-muted-foreground">
                        Já tem conta?
                        <RouterLink
                            :to="{ name: 'login' }"
                            class="underline underline-offset-4 hover:text-foreground"
                        >
                            Entrar
                        </RouterLink>
                    </p>
                </form>
            </CardContent>
        </Card>
    </GuestLayout>
</template>
