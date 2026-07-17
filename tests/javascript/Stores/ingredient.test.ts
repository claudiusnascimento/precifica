import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ingredientService } from '@/Services/ingredientService';
import { useIngredientStore } from '@/Stores/ingredient';

vi.mock('@/Services/ingredientService', () => ({
    ingredientService: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        get: vi.fn(),
        getUnits: vi.fn(),
    },
}));

describe('useIngredientStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it('fetches ingredients into state', async () => {
        vi.mocked(ingredientService.list).mockResolvedValue({
            data: [
                {
                    id: 1,
                    name: 'Farinha',
                    unit: 'gram',
                    unit_label: 'Grama',
                    price: '0.0080',
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

        const store = useIngredientStore();
        await store.fetch();

        expect(store.items).toHaveLength(1);
        expect(store.items[0]?.name).toBe('Farinha');
        expect(store.loading).toBe(false);
    });

    it('captures validation errors on create', async () => {
        vi.mocked(ingredientService.create).mockRejectedValue({
            response: {
                data: {
                    message: 'The given data was invalid.',
                    errors: {
                        name: ['O nome já está em uso.'],
                    },
                },
            },
        });

        const store = useIngredientStore();
        const result = await store.create({
            name: 'Farinha',
            unit: 'gram',
            price: 0.01,
        });

        expect(result).toBeNull();
        expect(store.fieldErrors.name?.[0]).toBe('O nome já está em uso.');
    });
});
