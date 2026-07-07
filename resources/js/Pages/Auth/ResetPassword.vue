<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const token = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

onMounted(() => {
    email.value = typeof route.query.email === 'string' ? route.query.email : '';
    token.value = typeof route.query.token === 'string' ? route.query.token : '';
});

async function handleSubmit(): Promise<void> {
    successMessage.value = '';
    errorMessage.value = '';
    isSubmitting.value = true;

    try {
        successMessage.value = await authStore.resetPassword({
            email: email.value,
            token: token.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
        });

        await router.push({ name: 'login' });
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;

        errorMessage.value = axiosError.response?.data?.errors?.email?.[0]
            ?? axiosError.response?.data?.message
            ?? 'Não foi possível redefinir a senha.';
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <GuestLayout>
        <Card class="w-full text-left">
            <CardHeader>
                <CardTitle>Redefinir senha</CardTitle>
                <CardDescription>
                    Defina uma nova senha para sua conta.
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
                        <Label for="password">Nova senha</Label>
                        <Input
                            id="password"
                            v-model="password"
                            type="password"
                            autocomplete="new-password"
                            required
                        />
                    </div>

                    <div class="space-y-2">
                        <Label for="password-confirmation">Confirmar senha</Label>
                        <Input
                            id="password-confirmation"
                            v-model="passwordConfirmation"
                            type="password"
                            autocomplete="new-password"
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
                        {{ isSubmitting ? 'Salvando...' : 'Redefinir senha' }}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </GuestLayout>
</template>
