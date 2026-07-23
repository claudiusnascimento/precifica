# Precifica — Documentação Técnica

## Visão geral

SaaS de precificação de receitas para gastronomia/confeitaria. Backend Laravel 13 (API REST JSON) + frontend Vue 3 SPA. Autenticação via Laravel Sanctum (cookies stateful).

## Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/login` | Login |
| POST | `/api/register` | Cadastro |
| POST | `/api/logout` | Logout |
| GET | `/api/user` | Perfil autenticado |
| POST | `/api/forgot-password` | Solicitar reset |
| POST | `/api/reset-password` | Redefinir senha |

Actions: `LoginUserAction`, `RegisterUserAction`, `SendResetLinkAction`, `ResetPasswordAction`.

## Módulo de Ingredientes (Spec 006)

Primeiro bloco do fluxo de precificação: cadastro de insumos com preço por unidade de medida.

### Model `Ingredient`

| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint PK | auto-increment |
| user_id | FK → users | cascade on delete |
| name | string(120) | único por usuário (ignorando soft-deleted) |
| unit | string | enum `IngredientUnit` |
| price | decimal(10,4) | preço por 1 unidade do campo `unit` |
| deleted_at | timestamp | soft delete |

### Enum `IngredientUnit`

Arquivo: `app/Enums/IngredientUnit.php`

| Value | Label |
|---|---|
| `gram` | Grama |
| `kilogram` | Quilograma |
| `milliliter` | Mililitro |
| `liter` | Litro |
| `unit` | Unidade |

Métodos: `label()`, `options()`.

### Actions

- `app/Actions/Ingredient/CreateIngredientAction.php`
- `app/Actions/Ingredient/UpdateIngredientAction.php`
- `app/Actions/Ingredient/DeleteIngredientAction.php` (soft delete)

### Endpoints (auth:sanctum)

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/ingredients` | Listar (paginado; filtros `name`, `unit`) |
| POST | `/api/ingredients` | Criar |
| GET | `/api/ingredients/{id}` | Detalhar |
| PUT | `/api/ingredients/{id}` | Atualizar |
| DELETE | `/api/ingredients/{id}` | Soft delete |
| GET | `/api/ingredient-units` | Opções do enum |

### Frontend

- Menu: item **Ingredientes** em `AppLayout.vue` (sidebar)
- Rotas: `/ingredientes`, `/ingredientes/novo`, `/ingredientes/:id/editar`
- Páginas: `Pages/Ingredients/Index.vue`, `Pages/Ingredients/Form.vue`
- Componentes: `UnitSelect`, `IngredientForm`, `IngredientList`
- Store: `Stores/ingredient.ts`
- Service: `Services/ingredientService.ts`

### Factory / Seeder

- `database/factories/IngredientFactory.php`
- `database/seeders/IngredientSeeder.php` (registrado em `DatabaseSeeder`)

### Policy

`IngredientPolicy` — acesso restrito ao dono (`user_id`).

## Módulo de Receitas (Spec 007)

Segundo bloco do fluxo de precificação: cadastro de receitas com rendimento e relação N:N com ingredientes.

### Model `Recipe`

| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint PK | auto-increment |
| user_id | FK → users | cascade on delete |
| name | string(120) | único por usuário (ignorando soft-deleted) |
| yield_quantity | decimal(10,4) | rendimento da receita |
| yield_unit | string | enum `IngredientUnit` (reaproveitado) |
| deleted_at | timestamp | soft delete |

### Pivot `ingredient_recipe` (`RecipeIngredient`)

| Coluna | Tipo | Notas |
|---|---|---|
| id | bigint PK | auto-increment |
| recipe_id | FK → recipes | cascade on delete |
| ingredient_id | FK → ingredients | cascade on delete |
| quantity | decimal(10,4) | na unidade do próprio Ingredient |
| timestamps | | |

Modelo: `app/Models/RecipeIngredient.php` (extends `Pivot`). Soft delete da receita preserva as linhas do pivot.

### Actions

- `app/Actions/Recipe/CreateRecipeAction.php` (transação + sync)
- `app/Actions/Recipe/UpdateRecipeAction.php` (transação + sync)
- `app/Actions/Recipe/DeleteRecipeAction.php` (soft delete)

### Endpoints (auth:sanctum)

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/recipes` | Listar (paginado; filtro `name`) |
| POST | `/api/recipes` | Criar (com `ingredients` opcional) |
| GET | `/api/recipes/{id}` | Detalhar (com ingredients) |
| PUT | `/api/recipes/{id}` | Atualizar |
| DELETE | `/api/recipes/{id}` | Soft delete |

Payload de ingredientes: `{ ingredients: [{ id, quantity }] }` — sem unidade no pivot.

### Frontend

- Menu: item **Receitas** em `AppLayout.vue` (sidebar)
- Rotas: `/receitas`, `/receitas/novo`, `/receitas/:id/editar`
- Páginas: `Pages/Recipes/Index.vue`, `Pages/Recipes/Form.vue`
- Componentes: `RecipeForm`, `RecipeList`, `RecipeIngredientRow` (botão Adicionar + select/quantidade/unidade/excluir)
- Store: `Stores/recipe.ts`
- Service: `Services/recipeService.ts`

### Factory / Seeder

- `database/factories/RecipeFactory.php` (state `withIngredients`)
- `database/seeders/RecipeSeeder.php` (registrado em `DatabaseSeeder` após `IngredientSeeder`)

### Policy

`RecipePolicy` — acesso restrito ao dono (`user_id`); ingredientes vinculados devem pertencer ao mesmo usuário.

## Menu do Dashboard

- Dashboard → `/dashboard`
- Ingredientes → `/ingredientes`
- Receitas → `/receitas`

## Testes

- Pest: `docker compose run --rm --entrypoint "" test php artisan test`
- Vitest: `npm run test:js`
- Playwright: `npm run test:e2e` (requer app em `http://localhost:8080`)
