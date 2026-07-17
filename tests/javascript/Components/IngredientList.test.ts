import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import IngredientList from '@/Components/Ingredients/IngredientList.vue';
import type { Ingredient } from '@/types/ingredient';

const items: Ingredient[] = [
    {
        id: 1,
        name: 'Ovo',
        unit: 'unit',
        unit_label: 'Unidade',
        price: '0.1000',
        created_at: null,
        updated_at: null,
    },
];

describe('IngredientList', () => {
    it('renders loading state', () => {
        const wrapper = mount(IngredientList, {
            props: {
                items: [],
                loading: true,
            },
            global: {
                stubs: {
                    RouterLink: true,
                },
            },
        });

        expect(wrapper.text()).toContain('Carregando ingredientes...');
    });

    it('renders empty state', () => {
        const wrapper = mount(IngredientList, {
            props: {
                items: [],
                loading: false,
            },
            global: {
                stubs: {
                    RouterLink: true,
                },
            },
        });

        expect(wrapper.text()).toContain('Nenhum ingrediente cadastrado ainda.');
    });

    it('formats price in BRL', () => {
        const wrapper = mount(IngredientList, {
            props: {
                items,
                loading: false,
            },
            global: {
                stubs: {
                    RouterLink: {
                        template: '<a><slot /></a>',
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('Ovo');
        expect(wrapper.text()).toContain('Unidade');
        expect(wrapper.text()).toMatch(/R\$\s*0,10/);
    });
});
