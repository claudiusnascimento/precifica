import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
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

    it('emits delete when the confirmation dialog is accepted', async () => {
        const wrapper = mount(IngredientList, {
            attachTo: document.body,
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

        await wrapper.find('[aria-label="Excluir"]').trigger('click');
        await nextTick();

        const confirmButton = Array.from(
            document.body.querySelectorAll('[role="alertdialog"] button'),
        ).find((button) => button.textContent?.trim() === 'Excluir');

        expect(confirmButton).toBeTruthy();

        confirmButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        await nextTick();

        expect(wrapper.emitted('delete')).toBeTruthy();
        expect(wrapper.emitted('delete')?.[0]).toEqual([items[0]]);

        wrapper.unmount();
    });
});
