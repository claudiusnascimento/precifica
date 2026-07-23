import type { IngredientUnitValue } from '@/types/ingredient';

export interface RecipeIngredientItem {
    id: number;
    name: string;
    unit: IngredientUnitValue;
    unit_label: string;
    quantity: string;
}

export interface Recipe {
    id: number;
    name: string;
    yield_quantity: string;
    yield_unit: IngredientUnitValue;
    yield_unit_label: string;
    ingredients_count?: number;
    ingredients?: RecipeIngredientItem[];
    created_at: string | null;
    updated_at: string | null;
}

export interface RecipeIngredientPayload {
    id: number | null;
    quantity: number | string;
    unit: IngredientUnitValue | '';
}

export interface RecipePayload {
    name: string;
    yield_quantity: number | string;
    yield_unit: IngredientUnitValue | '';
    ingredients: Array<{
        id: number;
        quantity: number | string;
    }>;
}

export interface RecipeListMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface RecipeListResponse {
    data: Recipe[];
    meta: RecipeListMeta;
}

export interface RecipeResponse {
    data: Recipe;
}

export interface RecipeListParams {
    name?: string;
    page?: number;
    per_page?: number;
}
