import { defineStore } from 'pinia';
import api, { ensureCsrfCookie } from '@/lib/api';
import type {
    AuthResponse,
    AuthUser,
    ForgotPasswordPayload,
    LoginPayload,
    MessageResponse,
    ResetPasswordPayload,
    UserResponse,
} from '@/types/auth';
import router from '@/router';

interface AuthState {
    user: AuthUser | null;
    initialized: boolean;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        initialized: false,
    }),

    getters: {
        isAuthenticated: (state): boolean => state.user !== null,
    },

    actions: {
        async initialize(): Promise<void> {
            if (this.initialized) {
                return;
            }

            try {
                const { data } = await api.get<UserResponse>('/user');
                this.user = data.user;
            } catch {
                this.user = null;
            } finally {
                this.initialized = true;
            }
        },

        async login(payload: LoginPayload): Promise<void> {
            await ensureCsrfCookie();

            const { data } = await api.post<AuthResponse>('/login', payload);
            this.user = data.user;
            this.initialized = true;

            await router.push({ name: 'dashboard' });
        },

        async logout(): Promise<void> {
            await ensureCsrfCookie();
            await api.post<MessageResponse>('/logout');

            this.user = null;
            await router.push({ name: 'login' });
        },

        async forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
            const { data } = await api.post<MessageResponse>('/forgot-password', payload);

            return data.message;
        },

        async resetPassword(payload: ResetPasswordPayload): Promise<string> {
            const { data } = await api.post<MessageResponse>('/reset-password', payload);

            return data.message;
        },
    },
});
