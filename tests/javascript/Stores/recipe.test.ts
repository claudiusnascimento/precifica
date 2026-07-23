import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recipeService } from '@/Services/recipeService';
import { useRecipeStore } from '@/Stores/recipe';

vi.mock('@/Services/recipeService', () => ({
    recipeService: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        get: vi.fn(),
    },
}));

describe('useRecipeStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('fetches recipes into state', async () => {
        vi.mocked(recipeService.list).mockResolvedValue({
            data: [
                {
                    id: 1,
                    name: 'Bolo',
                    yield_quantity: '1.0000',
                    yield_unit: 'unit',
                    yield_unit_label: 'Unidade',
                    ingredients_count: 0,
                    created_at: null,
                    updated_at: null,
                },
            ],
            meta: {
                current_page: 1,
                last_page: 1,
                per_page: 15,
                total: 1,
            },
        });

        const store = useRecipeStore();
        await store.fetch();

        expect(store.items).toHaveLength(1);
        expect(store.items[0]?.name).toBe('Bolo');
        expect(store.loading).toBe(false);
    });

    it('captures validation errors on create', async () => {
        vi.mocked(recipeService.create).mockRejectedValue({
            response: {
                data: {
                    message: 'The given data was invalid.',
                    errors: {
                        name: ['O nome já está em uso.'],
                    },
                },
            },
        });

        const store = useRecipeStore();
        const result = await store.create({
            name: 'Bolo',
            yield_quantity: 1,
            yield_unit: 'unit',
            ingredients: [],
        });

        expect(result).toBeNull();
        expect(store.fieldErrors.name?.[0]).toBe('O nome já está em uso.');
    });
});
