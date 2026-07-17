import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import IngredientForm from '@/Components/Ingredients/IngredientForm.vue';

vi.mock('@/Components/Ingredients/UnitSelect.vue', () => ({
    default: {
        name: 'UnitSelect',
        props: ['modelValue'],
        emits: ['update:modelValue'],
        template: '<select data-testid="unit-select" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option value="gram">Grama</option></select>',
    },
}));

describe('IngredientForm', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('emits submit with form payload', async () => {
        const wrapper = mount(IngredientForm, {
            props: {
                initial: {
                    name: '',
                    unit: '',
                    price: '',
                },
            },
        });

        await wrapper.get('#ingredient-name').setValue('Farinha');
        await wrapper.get('[data-testid="unit-select"]').setValue('gram');
        await wrapper.get('#ingredient-price').setValue('0.008');
        await wrapper.get('form').trigger('submit.prevent');

        expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
            name: 'Farinha',
            unit: 'gram',
            price: 0.008,
        });
    });

    it('shows field errors from API', () => {
        const wrapper = mount(IngredientForm, {
            props: {
                fieldErrors: {
                    name: ['O nome já está em uso.'],
                },
            },
        });

        expect(wrapper.text()).toContain('O nome já está em uso.');
    });
});
