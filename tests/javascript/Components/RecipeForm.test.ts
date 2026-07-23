import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RecipeForm from '@/Components/Recipes/RecipeForm.vue';
import { useIngredientStore } from '@/Stores/ingredient';

vi.mock('@/Components/Ingredients/UnitSelect.vue', () => ({
    default: {
        name: 'UnitSelect',
        props: ['modelValue'],
        emits: ['update:modelValue'],
        template: '<select data-testid="unit-select" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option value="unit">Unidade</option><option value="gram">Grama</option></select>',
    },
}));

vi.mock('@/Components/ui/select', () => ({
    Select: {
        name: 'Select',
        props: ['modelValue'],
        emits: ['update:modelValue'],
        template: '<div><slot /></div>',
    },
    SelectContent: { name: 'SelectContent', template: '<div><slot /></div>' },
    SelectGroup: { name: 'SelectGroup', template: '<div><slot /></div>' },
    SelectItem: {
        name: 'SelectItem',
        props: ['value'],
        template: '<option :value="value"><slot /></option>',
    },
    SelectTrigger: { name: 'SelectTrigger', template: '<div><slot /></div>' },
    SelectValue: { name: 'SelectValue', template: '<span />' },
}));

describe('RecipeForm', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        const ingredientStore = useIngredientStore();
        ingredientStore.items = [
            {
                id: 1,
                name: 'Farinha',
                unit: 'gram',
                unit_label: 'Grama',
                price: '0.0080',
                created_at: null,
                updated_at: null,
            },
        ];
        ingredientStore.fetch = vi.fn().mockResolvedValue(undefined);
        ingredientStore.fetchUnits = vi.fn().mockResolvedValue(undefined);
    });

    it('adds and removes ingredient rows', async () => {
        const wrapper = mount(RecipeForm);

        expect(wrapper.findAll('.recipe-ingredient-row')).toHaveLength(0);

        const addButton = wrapper.findAll('button').find((button) => button.text().includes('Adicionar'));
        expect(addButton).toBeTruthy();
        await addButton!.trigger('click');
        expect(wrapper.findAll('.recipe-ingredient-row')).toHaveLength(1);

        await wrapper.get('[aria-label="Remover ingrediente"]').trigger('click');
        expect(wrapper.findAll('.recipe-ingredient-row')).toHaveLength(0);
    });

    it('emits submit payload without unit on ingredients', async () => {
        const wrapper = mount(RecipeForm, {
            props: {
                initial: {
                    name: 'Bolo',
                    yield_quantity: '1',
                    yield_unit: 'unit',
                    ingredients: [
                        { id: 1, quantity: '500', unit: 'gram' },
                    ],
                },
            },
        });

        await wrapper.get('form').trigger('submit.prevent');

        expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
            name: 'Bolo',
            yield_quantity: '1',
            yield_unit: 'unit',
            ingredients: [
                { id: 1, quantity: '500' },
            ],
        });
    });

    it('shows field errors from API', () => {
        const wrapper = mount(RecipeForm, {
            props: {
                fieldErrors: {
                    name: ['O nome já está em uso.'],
                },
            },
        });

        expect(wrapper.text()).toContain('O nome já está em uso.');
    });
});
