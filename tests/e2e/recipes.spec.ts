import { expect, test } from '@playwright/test';

async function registerAndGoToRecipes(page: import('@playwright/test').Page): Promise<void> {
    const email = `receitas-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@precifica.test`;
    const password = 'password';

    await page.goto('/register');
    await page.getByLabel('Nome').fill('Teste Receitas');
    await page.getByLabel('E-mail').fill(email);
    await page.getByLabel('Senha', { exact: true }).fill(password);
    await page.getByLabel('Confirmar senha').fill(password);
    await page.getByRole('button', { name: 'Cadastrar' }).click();
    await page.waitForURL(/\/dashboard$/);
    await page.getByRole('link', { name: 'Receitas' }).click();
    await page.waitForURL(/\/receitas$/);
}

async function selectComboboxOption(
    page: import('@playwright/test').Page,
    trigger: import('@playwright/test').Locator,
    label: string,
): Promise<void> {
    await trigger.click();
    await page.getByRole('option', { name: label, exact: true }).click();
}

async function createIngredientViaUi(
    page: import('@playwright/test').Page,
    name: string,
    unitLabel: string,
    price: string,
): Promise<void> {
    await page.getByRole('link', { name: 'Ingredientes' }).click();
    await page.waitForURL(/\/ingredientes$/);
    await page.getByRole('link', { name: 'Novo ingrediente' }).click();
    await page.getByLabel('Nome').fill(name);
    await selectComboboxOption(page, page.getByRole('combobox'), unitLabel);
    await page.getByLabel('Preço por unidade').fill(price);
    await page.getByRole('button', { name: 'Criar' }).click();
    await page.waitForURL(/\/ingredientes$/);
    await page.getByRole('link', { name: 'Receitas' }).click();
    await page.waitForURL(/\/receitas$/);
}

test.describe('Recipes E2E', () => {
    test('create recipe with ingredients → appears in list', async ({ page }) => {
        await registerAndGoToRecipes(page);
        await createIngredientViaUi(page, 'Farinha Receita', 'Grama', '0.008');

        await page.getByRole('link', { name: 'Nova receita' }).click();
        await page.waitForURL(/\/receitas\/novo$/);
        await page.getByLabel('Nome').fill('Bolo E2E');
        await page.getByLabel('Rendimento').fill('1');
        await selectComboboxOption(page, page.getByRole('combobox').first(), 'Unidade');

        await page.getByRole('button', { name: 'Adicionar' }).click();
        await selectComboboxOption(
            page,
            page.locator('.recipe-ingredient-row').getByRole('combobox').first(),
            'Farinha Receita',
        );
        await page.getByLabel('Quantidade').fill('500');
        await page.getByRole('button', { name: 'Criar' }).click();
        await page.waitForURL(/\/receitas$/);

        await expect(page.getByRole('cell', { name: 'Bolo E2E' })).toBeVisible();
    });

    test('create recipe without ingredients → appears in list', async ({ page }) => {
        await registerAndGoToRecipes(page);

        await page.getByRole('link', { name: 'Nova receita' }).click();
        await page.getByLabel('Nome').fill('Rascunho E2E');
        await page.getByLabel('Rendimento').fill('2');
        await selectComboboxOption(page, page.getByRole('combobox').first(), 'Quilograma');
        await page.getByRole('button', { name: 'Criar' }).click();
        await page.waitForURL(/\/receitas$/);

        await expect(page.getByRole('cell', { name: 'Rascunho E2E' })).toBeVisible();
    });

    test('edit recipe reflects change', async ({ page }) => {
        await registerAndGoToRecipes(page);

        await page.getByRole('link', { name: 'Nova receita' }).click();
        await page.getByLabel('Nome').fill('Editar E2E');
        await page.getByLabel('Rendimento').fill('1');
        await selectComboboxOption(page, page.getByRole('combobox').first(), 'Unidade');
        await page.getByRole('button', { name: 'Criar' }).click();
        await page.waitForURL(/\/receitas$/);

        await page.getByRole('link', { name: 'Editar' }).first().click();
        await page.waitForURL(/\/receitas\/\d+\/editar$/);
        await expect(page.getByLabel('Nome')).toHaveValue('Editar E2E');
        await page.getByLabel('Nome').fill('Editada E2E');
        await page.getByRole('button', { name: 'Atualizar' }).click();
        await page.waitForURL(/\/receitas$/);

        await expect(page.getByRole('cell', { name: 'Editada E2E' })).toBeVisible();
    });

    test('delete recipe removes from list', async ({ page }) => {
        await registerAndGoToRecipes(page);

        await page.getByRole('link', { name: 'Nova receita' }).click();
        await page.getByLabel('Nome').fill('Excluir E2E');
        await page.getByLabel('Rendimento').fill('1');
        await selectComboboxOption(page, page.getByRole('combobox').first(), 'Unidade');
        await page.getByRole('button', { name: 'Criar' }).click();
        await page.waitForURL(/\/receitas$/);

        await page.getByRole('button', { name: 'Excluir' }).first().click();
        await page.getByRole('alertdialog').getByRole('button', { name: 'Excluir' }).click();

        await expect(page.getByRole('cell', { name: 'Excluir E2E' })).toHaveCount(0);
    });

    test('duplicate name shows validation error', async ({ page }) => {
        await registerAndGoToRecipes(page);

        await page.getByRole('link', { name: 'Nova receita' }).click();
        await page.getByLabel('Nome').fill('Duplicada E2E');
        await page.getByLabel('Rendimento').fill('1');
        await selectComboboxOption(page, page.getByRole('combobox').first(), 'Unidade');
        await page.getByRole('button', { name: 'Criar' }).click();
        await page.waitForURL(/\/receitas$/);

        await page.getByRole('link', { name: 'Nova receita' }).click();
        await page.getByLabel('Nome').fill('Duplicada E2E');
        await page.getByLabel('Rendimento').fill('1');
        await selectComboboxOption(page, page.getByRole('combobox').first(), 'Unidade');
        await page.getByRole('button', { name: 'Criar' }).click();

        await expect(page.getByText(/já|unique|em uso|taken/i)).toBeVisible();
    });

    test('direct edit URL of another user recipe is blocked', async ({ page }) => {
        await registerAndGoToRecipes(page);
        await page.goto('/receitas/999999/editar');
        await page.waitForURL(/\/receitas$/);
        await expect(page.getByRole('heading', { name: 'Receitas' })).toBeVisible();
    });
});
