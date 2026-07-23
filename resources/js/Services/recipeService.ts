import api from '@/lib/api';
import type {
    RecipeListParams,
    RecipeListResponse,
    RecipePayload,
    RecipeResponse,
} from '@/types/recipe';

export const recipeService = {
    async list(params: RecipeListParams = {}): Promise<RecipeListResponse> {
        const { data } = await api.get<RecipeListResponse>('/recipes', { params });

        return data;
    },

    async get(id: number): Promise<RecipeResponse> {
        const { data } = await api.get<RecipeResponse>(`/recipes/${id}`);

        return data;
    },

    async create(payload: RecipePayload): Promise<RecipeResponse> {
        const { data } = await api.post<RecipeResponse>('/recipes', payload);

        return data;
    },

    async update(id: number, payload: RecipePayload): Promise<RecipeResponse> {
        const { data } = await api.put<RecipeResponse>(`/recipes/${id}`, payload);

        return data;
    },

    async remove(id: number): Promise<void> {
        await api.delete(`/recipes/${id}`);
    },
};
