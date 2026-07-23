import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import RecipeList from '@/Components/Recipes/RecipeList.vue';
import type { Recipe } from '@/types/recipe';

const stubRouterLink = {
    name: 'RouterLink',
    template: '<a><slot /></a>',
};

const recipe: Recipe = {
    id: 1,
    name: 'Bolo',
    yield_quantity: '1.0000',
    yield_unit: 'unit',
    yield_unit_label: 'Unidade',
    ingredients_count: 3,
    created_at: null,
    updated_at: null,
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

    it('emits delete when the confirmation dialog is accepted', async () => {
        const wrapper = mount(RecipeList, {
            attachTo: document.body,
            props: { items: [recipe], loading: false },
            global: { stubs: { RouterLink: stubRouterLink } },
        });

        const rowDeleteButton = wrapper
            .findAll('button')
            .find((button) => button.text().trim() === 'Excluir');

        expect(rowDeleteButton).toBeTruthy();
        await rowDeleteButton?.trigger('click');
        await nextTick();

        const confirmButton = Array.from(
            document.body.querySelectorAll('[role="alertdialog"] button'),
        ).find((button) => button.textContent?.trim() === 'Excluir');

        expect(confirmButton).toBeTruthy();

        confirmButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        await nextTick();

        expect(wrapper.emitted('delete')).toBeTruthy();
        expect(wrapper.emitted('delete')?.[0]).toEqual([recipe]);

        wrapper.unmount();
    });
});
