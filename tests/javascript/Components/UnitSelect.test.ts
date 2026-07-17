import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UnitSelect from '@/Components/Ingredients/UnitSelect.vue';
import { useIngredientStore } from '@/Stores/ingredient';

vi.mock('@/Services/ingredientService', () => ({
    ingredientService: {
        getUnits: vi.fn().mockResolvedValue({
            data: [
                { value: 'gram', label: 'Grama' },
                { value: 'unit', label: 'Unidade' },
            ],
        }),
    },
}));

describe('UnitSelect', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('loads unit options into the store', async () => {
        mount(UnitSelect, {
            props: {
                modelValue: '',
            },
            global: {
                stubs: {
                    Select: true,
                    SelectTrigger: true,
                    SelectValue: true,
                    SelectContent: true,
                    SelectGroup: true,
                    SelectItem: true,
                },
            },
        });

        await flushPromises();

        const store = useIngredientStore();

        expect(store.units).toEqual([
            { value: 'gram', label: 'Grama' },
            { value: 'unit', label: 'Unidade' },
        ]);
    });
});
