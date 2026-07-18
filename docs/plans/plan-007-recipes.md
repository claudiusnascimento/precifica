# Plan 007: Módulo de Receitas

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) ou superpowers:executing-plans para implementar este plan tarefa por tarefa.

**Goal:** Entregar o CRUD completo de Receitas (API + frontend), com relação N:N com Ingredient (via pivot com `quantity`), Actions, soft delete, seeders/factories e testes completos (Pest, Vitest, Playwright).

**Architecture:** Backend segue `Route → RecipeController → {Create,Update,Delete}RecipeAction → RecipeResource` para escrita; leitura (`index`/`show`) direto no Controller, scoped por `auth()->id()`, com eager loading de `ingredients`. Sem Inertia — API pura, consumida pelo SPA Vue hoje e futuramente pelo app React Native.

**Tech Stack:** Laravel 13, Sanctum, Pest PHP, Vue 3, Pinia, Vue Router, shadcn-vue, Tailwind v4, lucide-vue-next

**Spec:** [spec-007-recipes.md](../specs/spec-007-recipes.md)

---

## 📋 Checklist de Execução

### 🖥️ PARTE 1: BACKEND — Models, Migrations

#### Passo 1: Migrations e Models
- [x] Criar migration `create_recipes_table`: `id`, `user_id` (foreignId cascade), `name`, `yield_quantity` (decimal 10,4), `yield_unit`, `deleted_at`, timestamps
- [x] Criar migration `create_ingredient_recipe_table` (pivot): `id`, `recipe_id` (foreignId cascade), `ingredient_id` (foreignId cascade), `quantity` (decimal 10,4), timestamps
- [x] Criar `app/Models/Recipe.php` com trait `SoftDeletes`, `casts` (`yield_unit` → `IngredientUnit`, `yield_quantity` → `decimal:4`), relação `belongsTo(User::class)` e `belongsToMany(Ingredient::class)->using(RecipeIngredient::class)->withPivot('quantity')->withTimestamps()`
- [x] Criar `app/Models/RecipeIngredient.php` (extends `Pivot`)
- [x] Adicionar em `app/Models/Ingredient.php` a relação inversa `belongsToMany(Recipe::class)->using(RecipeIngredient::class)->withPivot('quantity')->withTimestamps()`

#### Passo 2: Factory e Seeder
- [x] Criar `database/factories/RecipeFactory.php` (nome fake, `yield_quantity` decimal realista, `yield_unit` aleatório do enum)
- [x] Adicionar state/callback na factory (ou no seeder) para anexar alguns ingredientes existentes do mesmo usuário com `quantity` aleatória
- [x] Criar `database/seeders/RecipeSeeder.php` (algumas receitas por usuário de teste, com e sem ingredientes)
- [x] Registrar seeder em `DatabaseSeeder.php` (depois do `IngredientSeeder`)

---

### ⚙️ PARTE 2: BACKEND — Actions, Policy, Validação

#### Passo 3: Actions
- [x] Criar `app/Actions/Recipe/CreateRecipeAction.php` (cria a receita e sincroniza ingredientes em transação)
- [x] Criar `app/Actions/Recipe/UpdateRecipeAction.php` (atualiza dados e sincroniza ingredientes — attach/detach/update — em transação)
- [x] Criar `app/Actions/Recipe/DeleteRecipeAction.php` (soft delete, preservando linhas do pivot)

#### Passo 4: Policy e Form Requests
- [x] Criar `app/Policies/RecipePolicy.php` (`viewAny`, `view`, `create`, `update`, `delete` — checando `user_id`)
- [x] Registrar policy em `AuthServiceProvider` (auto-discovery Laravel 13)
- [x] Criar `app/Http/Requests/Recipe/StoreRecipeRequest.php` (`name`, `yield_quantity`, `yield_unit`, `ingredients.*.id` pertencente ao user, `ingredients.*.quantity`)
- [x] Criar `app/Http/Requests/Recipe/UpdateRecipeRequest.php`

#### Passo 5: Resource, Controller e rotas
- [x] Criar `app/Http/Resources/RecipeResource.php` (incluindo `ingredients` com nome, unit e quantity)
- [x] Criar `app/Http/Controllers/Api/RecipeController.php` (`index`, `store`, `show`, `update`, `destroy`)
  - `index`/`show`: query direta com eager loading de `ingredients`, sem Action
  - `store`/`update`/`destroy`: delegam para as Actions do Passo 3
- [x] Registrar rotas em `routes/api.php`: `apiResource('recipes', ...)`, dentro do grupo `auth:sanctum`

---

### 🧪 PARTE 3: BACKEND — Testes Pest

#### Passo 6: Testes de feature e unit
- [x] Criar `tests/Feature/Recipe/RecipeCrudTest.php`
- [x] Criar `tests/Feature/Recipe/RecipeValidationTest.php` (inclui caso de `ingredient_id` de outro usuário)
- [x] Criar `tests/Feature/Recipe/RecipeAuthorizationTest.php`
- [x] Criar `tests/Feature/Recipe/RecipeWithoutIngredientsTest.php`
- [x] Criar `tests/Unit/Actions/Recipe/*Test.php`
- [x] Rodar suíte Pest e garantir verde

---

### 🎨 PARTE 4: FRONTEND — Tipos, Service e Store

#### Passo 7: Tipos e service
- [x] Adicionar tipos em `resources/js/types/recipe.ts` (incluindo tipo de item de ingrediente da receita)
- [x] Criar `resources/js/Services/recipeService.ts`

#### Passo 8: Store
- [x] Criar `resources/js/Stores/recipe.ts`

---

### 🎨 PARTE 5: FRONTEND — Páginas, componentes e menu

#### Passo 9: Componentes
- [x] Criar `RecipeIngredientRow.vue` (select de Ingredient existente + input de `quantity` + botão remover)
- [x] Criar `RecipeForm.vue` (nome, yield_quantity, yield_unit via `UnitSelect.vue` reaproveitado, lista dinâmica de `RecipeIngredientRow`)
- [x] Criar `RecipeList.vue`

#### Passo 10: Páginas e rotas
- [x] Criar `Pages/Recipes/Index.vue` e `Form.vue`
- [x] Rotas `/receitas`, `/receitas/novo`, `/receitas/:id/editar`

#### Passo 11: Menu
- [x] Item **Receitas** em `AppLayout.vue`

---

### 🧪 PARTE 6: FRONTEND — Testes Vitest e Playwright

#### Passo 12: Vitest
- [x] Testes de `RecipeForm` (adicionar/remover linha de ingrediente, validação), `RecipeList`, `recipeService` e `recipe` store

#### Passo 13: Playwright
- [x] Fluxos e2e de criar (com e sem ingredientes)/editar/excluir/duplicado/ingredient de outro usuário bloqueado

---

### 📚 PARTE 7: Documentação

#### Passo 14: Atualizar DOCUMENTATION.md
- [x] Documentar model Recipe, pivot RecipeIngredient, Actions, endpoints e menu

---

## 🧪 Critérios de Aceite

- [x] CRUD de Receitas funcionando fim a fim (API + UI)
- [x] Escrita via Actions (`app/Actions/Recipe/*`), leitura direto no Controller
- [x] Relação N:N com Ingredient via pivot `ingredient_recipe` com `quantity`
- [x] Soft delete funcionando (pivot preservado)
- [x] Isolamento por usuário garantido (receita e ingredientes vinculados)
- [x] Salvar receita sem ingredientes funciona
- [x] Item de menu "Receitas" visível e funcional
- [x] Todos os testes Pest passam
- [x] Todos os testes Vitest passam
- [x] Todos os testes Playwright passam
- [x] `npx vue-tsc --noEmit` sem erros
- [x] `DOCUMENTATION.md` atualizado
