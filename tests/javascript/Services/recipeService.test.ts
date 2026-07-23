import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '@/lib/api';
import { recipeService } from '@/Services/recipeService';

vi.mock('@/lib/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('recipeService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('lists recipes', async () => {
        vi.mocked(api.get).mockResolvedValue({
            data: { data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 } },
        });

        await recipeService.list({ name: 'Bolo' });

        expect(api.get).toHaveBeenCalledWith('/recipes', { params: { name: 'Bolo' } });
    });

    it('creates recipe', async () => {
        vi.mocked(api.post).mockResolvedValue({
            data: { data: { id: 1, name: 'Bolo' } },
        });

        await recipeService.create({
            name: 'Bolo',
            yield_quantity: 1,
            yield_unit: 'unit',
            ingredients: [],
        });

        expect(api.post).toHaveBeenCalledWith('/recipes', {
            name: 'Bolo',
            yield_quantity: 1,
            yield_unit: 'unit',
            ingredients: [],
        });
    });
});
