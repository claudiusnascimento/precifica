import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '@/lib/api';
import { ingredientService } from '@/Services/ingredientService';

vi.mock('@/lib/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('ingredientService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('lists ingredients', async () => {
        vi.mocked(api.get).mockResolvedValue({
            data: { data: [], meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 } },
        });

        await ingredientService.list({ name: 'ovo' });

        expect(api.get).toHaveBeenCalledWith('/ingredients', {
            params: { name: 'ovo' },
        });
    });

    it('creates an ingredient', async () => {
        vi.mocked(api.post).mockResolvedValue({
            data: {
                data: {
                    id: 1,
                    name: 'Ovo',
                    unit: 'unit',
                    unit_label: 'Unidade',
                    price: '0.1000',
                    created_at: null,
                    updated_at: null,
                },
            },
        });

        const result = await ingredientService.create({
            name: 'Ovo',
            unit: 'unit',
            price: 0.1,
        });

        expect(api.post).toHaveBeenCalledWith('/ingredients', {
            name: 'Ovo',
            unit: 'unit',
            price: 0.1,
        });
        expect(result.data.name).toBe('Ovo');
    });
});
