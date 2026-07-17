import api from '@/lib/api';
import type {
    IngredientListParams,
    IngredientListResponse,
    IngredientPayload,
    IngredientResponse,
    IngredientUnitsResponse,
} from '@/types/ingredient';

export const ingredientService = {
    async list(params: IngredientListParams = {}): Promise<IngredientListResponse> {
        const { data } = await api.get<IngredientListResponse>('/ingredients', { params });

        return data;
    },

    async get(id: number): Promise<IngredientResponse> {
        const { data } = await api.get<IngredientResponse>(`/ingredients/${id}`);

        return data;
    },

    async create(payload: IngredientPayload): Promise<IngredientResponse> {
        const { data } = await api.post<IngredientResponse>('/ingredients', payload);

        return data;
    },

    async update(id: number, payload: IngredientPayload): Promise<IngredientResponse> {
        const { data } = await api.put<IngredientResponse>(`/ingredients/${id}`, payload);

        return data;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/ingredients/${id}`);
    },

    async getUnits(): Promise<IngredientUnitsResponse> {
        const { data } = await api.get<IngredientUnitsResponse>('/ingredient-units');

        return data;
    },
};
