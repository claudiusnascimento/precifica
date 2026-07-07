<script setup lang="ts">
import { ref } from 'vue';
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
const successMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

async function handleSubmit(): Promise<void> {
    successMessage.value = '';
    errorMessage.value = '';
    isSubmitting.value = true;

    try {
        successMessage.value = await authStore.forgotPassword({
            email: email.value,
        });
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;

        errorMessage.value = axiosError.response?.data?.errors?.email?.[0]
            ?? axiosError.response?.data?.message
            ?? 'Não foi possível enviar o link de recuperação.';
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <GuestLayout>
        <Card class="w-full text-left">
            <CardHeader>
                <CardTitle>Recuperar senha</CardTitle>
                <CardDescription>
                    Informe seu e-mail para receber o link de redefinição.
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

                    <p
                        v-if="successMessage"
                        class="text-sm text-primary"
                    >
                        {{ successMessage }}
                    </p>

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
                        {{ isSubmitting ? 'Enviando...' : 'Enviar link' }}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </GuestLayout>
</template>
