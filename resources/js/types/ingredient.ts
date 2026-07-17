export type IngredientUnitValue =
    | 'gram'
    | 'kilogram'
    | 'milliliter'
    | 'liter'
    | 'unit';

export interface IngredientUnitOption {
    value: IngredientUnitValue;
    label: string;
}

export interface Ingredient {
    id: number;
    name: string;
    unit: IngredientUnitValue;
    unit_label: string;
    price: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface IngredientPayload {
    name: string;
    unit: IngredientUnitValue | '';
    price: number | string;
}

export interface IngredientListMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface IngredientListResponse {
    data: Ingredient[];
    meta: IngredientListMeta;
}

export interface IngredientResponse {
    data: Ingredient;
}

export interface IngredientUnitsResponse {
    data: IngredientUnitOption[];
}

export interface IngredientListParams {
    name?: string;
    unit?: IngredientUnitValue | '';
    page?: number;
    per_page?: number;
}
