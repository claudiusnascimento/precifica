import { defineStore } from 'pinia';
import { recipeService } from '@/Services/recipeService';
import type {
    Recipe,
    RecipeListMeta,
    RecipeListParams,
    RecipePayload,
} from '@/types/recipe';

interface RecipeState {
    items: Recipe[];
    current: Recipe | null;
    meta: RecipeListMeta | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    fieldErrors: Record<string, string[]>;
}

export const useRecipeStore = defineStore('recipe', {
    state: (): RecipeState => ({
        items: [],
        current: null,
        meta: null,
        loading: false,
        saving: false,
        error: null,
        fieldErrors: {},
    }),

    actions: {
        async fetch(params: RecipeListParams = {}): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                const response = await recipeService.list(params);
                this.items = response.data;
                this.meta = response.meta;
            } catch {
                this.error = 'Não foi possível carregar as receitas.';
                this.items = [];
                this.meta = null;
            } finally {
                this.loading = false;
            }
        },

        async fetchOne(id: number): Promise<Recipe | null> {
            this.loading = true;
            this.error = null;

            try {
                const response = await recipeService.get(id);
                this.current = response.data;

                return response.data;
            } catch {
                this.error = 'Receita não encontrada.';
                this.current = null;

                return null;
            } finally {
                this.loading = false;
            }
        },

        async create(payload: RecipePayload): Promise<Recipe | null> {
            this.saving = true;
            this.error = null;
            this.fieldErrors = {};

            try {
                const response = await recipeService.create(payload);

                return response.data;
            } catch (error: unknown) {
                this.captureErrors(error, 'Não foi possível criar a receita.');

                return null;
            } finally {
                this.saving = false;
            }
        },

        async update(id: number, payload: RecipePayload): Promise<Recipe | null> {
            this.saving = true;
            this.error = null;
            this.fieldErrors = {};

            try {
                const response = await recipeService.update(id, payload);

                return response.data;
            } catch (error: unknown) {
                this.captureErrors(error, 'Não foi possível atualizar a receita.');

                return null;
            } finally {
                this.saving = false;
            }
        },

        async remove(id: number): Promise<boolean> {
            this.saving = true;
            this.error = null;

            try {
                await recipeService.remove(id);
                this.items = this.items.filter((item) => item.id !== id);

                return true;
            } catch {
                this.error = 'Não foi possível remover a receita.';

                return false;
            } finally {
                this.saving = false;
            }
        },

        clearErrors(): void {
            this.error = null;
            this.fieldErrors = {};
        },

        captureErrors(error: unknown, fallback: string): void {
            const axiosError = error as {
                response?: {
                    data?: {
                        message?: string;
                        errors?: Record<string, string[]>;
                    };
                };
            };

            this.fieldErrors = axiosError.response?.data?.errors ?? {};
            this.error = axiosError.response?.data?.message ?? fallback;
        },
    },
});
