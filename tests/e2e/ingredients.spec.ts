import { expect, test } from '@playwright/test';

async function registerAndGoToIngredients(page: import('@playwright/test').Page): Promise<void> {
    const email = `ingredientes-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@precifica.test`;
    const password = 'password';

    await page.goto('/register');
    await page.getByLabel('Nome').fill('Teste Ingredientes');
    await page.getByLabel('E-mail').fill(email);
    await page.getByLabel('Senha', { exact: true }).fill(password);
    await page.getByLabel('Confirmar senha').fill(password);
    await page.getByRole('button', { name: 'Cadastrar' }).click();
    await page.waitForURL(/\/dashboard$/);
    await page.getByRole('link', { name: 'Ingredientes' }).click();
    await page.waitForURL(/\/ingredientes$/);
}

async function selectUnit(page: import('@playwright/test').Page, label: string): Promise<void> {
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: label, exact: true }).click();
}

async function createIngredient(
    page: import('@playwright/test').Page,
    name: string,
    unitLabel: string,
    price: string,
): Promise<void> {
    await page.getByRole('link', { name: 'Novo ingrediente' }).click();
    await page.waitForURL(/\/ingredientes\/novo$/);
    await page.getByLabel('Nome').fill(name);
    await selectUnit(page, unitLabel);
    await page.getByLabel('Preço por unidade').fill(price);
    await page.getByRole('button', { name: 'Criar' }).click();
    await page.waitForURL(/\/ingredientes$/);
}

test.describe('Ingredients E2E', () => {
    test('login via register → create ingredient → appears in list', async ({ page }) => {
        await registerAndGoToIngredients(page);
        await createIngredient(page, 'Farinha E2E', 'Grama', '0.008');
        await expect(page.getByText('Farinha E2E', { exact: true })).toBeVisible();
    });

    test('edit ingredient reflects change', async ({ page }) => {
        await registerAndGoToIngredients(page);
        await createIngredient(page, 'Ovo E2E', 'Unidade', '0.10');

        await page.getByRole('link', { name: 'Editar' }).first().click();
        await page.waitForURL(/\/ingredientes\/\d+\/editar$/);
        await expect(page.getByLabel('Nome')).toHaveValue('Ovo E2E');
        await page.getByLabel('Nome').fill('Ovo Caipira E2E');
        await page.getByRole('button', { name: 'Atualizar' }).click();
        await page.waitForURL(/\/ingredientes$/);

        await expect(page.getByText('Ovo Caipira E2E', { exact: true })).toBeVisible();
    });

    test('delete ingredient removes from list', async ({ page }) => {
        await registerAndGoToIngredients(page);
        await createIngredient(page, 'Açúcar E2E', 'Grama', '0.006');

        await page.getByRole('button', { name: 'Excluir' }).first().click();
        await page.getByRole('alertdialog').getByRole('button', { name: 'Excluir' }).click();

        await expect(page.getByText('Açúcar E2E', { exact: true })).toHaveCount(0);
    });

    test('duplicate name shows validation error', async ({ page }) => {
        await registerAndGoToIngredients(page);
        await createIngredient(page, 'Duplicado E2E', 'Unidade', '1');

        await page.getByRole('link', { name: 'Novo ingrediente' }).click();
        await page.getByLabel('Nome').fill('Duplicado E2E');
        await selectUnit(page, 'Unidade');
        await page.getByLabel('Preço por unidade').fill('1');
        await page.getByRole('button', { name: 'Criar' }).click();

        await expect(page.getByText(/já|unique|em uso|taken/i)).toBeVisible();
    });

    test('direct URL to another user ingredient is blocked', async ({ page }) => {
        await registerAndGoToIngredients(page);
        await page.goto('/ingredientes/999999/editar');
        await expect(page).toHaveURL(/\/ingredientes$/);
        await expect(page.getByRole('heading', { name: 'Ingredientes' })).toBeVisible();
    });
});
