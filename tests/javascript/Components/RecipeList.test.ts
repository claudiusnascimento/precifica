import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RecipeList from '@/Components/Recipes/RecipeList.vue';

const stubRouterLink = {
    name: 'RouterLink',
    template: '<a><slot /></a>',
};

describe('RecipeList', () => {
    it('shows empty state', () => {
        const wrapper = mount(RecipeList, {
            props: { items: [], loading: false },
            global: { stubs: { RouterLink: stubRouterLink } },
        });

        expect(wrapper.text()).toContain('Nenhuma receita cadastrada ainda.');
    });

    it('shows loading state', () => {
        const wrapper = mount(RecipeList, {
            props: { items: [], loading: true },
            global: { stubs: { RouterLink: stubRouterLink } },
        });

        expect(wrapper.text()).toContain('Carregando receitas...');
    });

    it('formats yield and ingredients count', () => {
        const wrapper = mount(RecipeList, {
            props: {
                loading: false,
                items: [
                    {
                        id: 1,
                        name: 'Bolo',
                        yield_quantity: '1.0000',
                        yield_unit: 'unit',
                        yield_unit_label: 'Unidade',
                        ingredients_count: 3,
                        created_at: null,
                        updated_at: null,
                    },
                ],
            },
            global: { stubs: { RouterLink: stubRouterLink } },
        });

        expect(wrapper.text()).toContain('Bolo');
        expect(wrapper.text()).toContain('1 Unidade');
        expect(wrapper.text()).toContain('3');
    });
});
