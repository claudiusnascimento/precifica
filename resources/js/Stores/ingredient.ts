import { defineStore } from 'pinia';
import { ingredientService } from '@/Services/ingredientService';
import type {
    Ingredient,
    IngredientListMeta,
    IngredientListParams,
    IngredientPayload,
    IngredientUnitOption,
} from '@/types/ingredient';

interface IngredientState {
    items: Ingredient[];
    current: Ingredient | null;
    units: IngredientUnitOption[];
    meta: IngredientListMeta | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    fieldErrors: Record<string, string[]>;
}

export const useIngredientStore = defineStore('ingredient', {
    state: (): IngredientState => ({
        items: [],
        current: null,
        units: [],
        meta: null,
        loading: false,
        saving: false,
        error: null,
        fieldErrors: {},
    }),

    actions: {
        async fetch(params: IngredientListParams = {}): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                const response = await ingredientService.list(params);
                this.items = response.data;
                this.meta = response.meta;
            } catch {
                this.error = 'Não foi possível carregar os ingredientes.';
                this.items = [];
                this.meta = null;
            } finally {
                this.loading = false;
            }
        },

        async fetchOne(id: number): Promise<Ingredient | null> {
            this.loading = true;
            this.error = null;

            try {
                const response = await ingredientService.get(id);
                this.current = response.data;

                return response.data;
            } catch {
                this.error = 'Ingrediente não encontrado.';
                this.current = null;

                return null;
            } finally {
                this.loading = false;
            }
        },

        async fetchUnits(): Promise<void> {
            if (this.units.length > 0) {
                return;
            }

            try {
                const response = await ingredientService.getUnits();
                this.units = response.data;
            } catch {
                this.units = [];
            }
        },

        async create(payload: IngredientPayload): Promise<Ingredient | null> {
            this.saving = true;
            this.error = null;
            this.fieldErrors = {};

            try {
                const response = await ingredientService.create(payload);

                return response.data;
            } catch (error: unknown) {
                this.captureErrors(error, 'Não foi possível criar o ingrediente.');

                return null;
            } finally {
                this.saving = false;
            }
        },

        async update(id: number, payload: IngredientPayload): Promise<Ingredient | null> {
            this.saving = true;
            this.error = null;
            this.fieldErrors = {};

            try {
                const response = await ingredientService.update(id, payload);

                return response.data;
            } catch (error: unknown) {
                this.captureErrors(error, 'Não foi possível atualizar o ingrediente.');

                return null;
            } finally {
                this.saving = false;
            }
        },

        async remove(id: number): Promise<boolean> {
            this.saving = true;
            this.error = null;

            try {
                await ingredientService.remove(id);
                this.items = this.items.filter((item) => item.id !== id);

                return true;
            } catch {
                this.error = 'Não foi possível remover o ingrediente.';

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
