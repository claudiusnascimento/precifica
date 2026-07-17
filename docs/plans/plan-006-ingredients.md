# Plan 006: Módulo de Ingredientes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Entregar o CRUD completo de Ingredientes (API + frontend), com Actions, soft delete, seeders/factories e testes completos (Pest, Vitest, Playwright).

**Architecture:** Backend segue `Route → IngredientController → {Create,Update,Delete}IngredientAction → IngredientResource` para escrita; leitura (`index`/`show`) direto no Controller, scoped por `auth()->id()`. Sem Inertia — API pura, consumida pelo SPA Vue hoje e futuramente pelo app React Native.

**Tech Stack:** Laravel 13, Sanctum, Pest PHP, Vue 3, Pinia, Vue Router, shadcn-vue, Tailwind v4, lucide-vue-next

**Spec:** [spec-006-ingredients.md](../specs/spec-006-ingredients.md)

---

## 📋 Checklist de Execução

### 🖥️ PARTE 1: BACKEND — Model, Enum, Migration

#### Passo 1: Model, migration, enum
- [x] Criar `app/Enums/IngredientUnit.php` (backed enum: `gram`, `kilogram`, `milliliter`, `liter`, `unit`) com `label(): string` e `options(): array`
- [x] Criar migration `create_ingredients_table`: `id` (bigint auto-increment), `user_id` (foreignId cascade), `name`, `unit`, `price` (decimal 10,4), `deleted_at`, timestamps
- [x] Criar `app/Models/Ingredient.php` com trait `SoftDeletes`, `casts` (`unit` → `IngredientUnit`, `price` → `decimal:4`), relação `belongsTo(User::class)`

#### Passo 2: Factory e Seeder
- [x] Criar `database/factories/IngredientFactory.php` (nome fake, `unit` aleatório do enum, `price` decimal realista)
- [x] Criar `database/seeders/IngredientSeeder.php` (alguns ingredientes por usuário de teste)
- [x] Registrar seeder em `DatabaseSeeder.php`

---

### ⚙️ PARTE 2: BACKEND — Actions, Policy, Validação

#### Passo 3: Actions
- [x] Criar `app/Actions/Ingredient/CreateIngredientAction.php`
- [x] Criar `app/Actions/Ingredient/UpdateIngredientAction.php`
- [x] Criar `app/Actions/Ingredient/DeleteIngredientAction.php` (soft delete)

#### Passo 4: Policy e Form Requests
- [x] Criar `app/Policies/IngredientPolicy.php` (`viewAny`, `view`, `create`, `update`, `delete` — checando `user_id`)
- [x] Registrar policy em `AuthServiceProvider` (auto-discovery Laravel 13)
- [x] Criar `app/Http/Requests/Ingredient/StoreIngredientRequest.php` (`name`, `unit`, `price`, unique por `user_id` ignorando soft-deleted)
- [x] Criar `app/Http/Requests/Ingredient/UpdateIngredientRequest.php`

#### Passo 5: Resource, Controller e rotas
- [x] Criar `app/Http/Resources/IngredientResource.php`
- [x] Criar `app/Http/Controllers/Api/IngredientController.php` (`index`, `store`, `show`, `update`, `destroy`)
  - `index`/`show`: query direta, sem Action
  - `store`/`update`/`destroy`: delegam para as Actions do Passo 3
- [x] Criar `app/Http/Controllers/Api/IngredientUnitController.php` (`index` → `IngredientUnit::options()`)
- [x] Registrar rotas em `routes/api.php`: `apiResource('ingredients', ...)` + `GET /ingredient-units`, dentro do grupo `auth:sanctum`

---

### 🧪 PARTE 3: BACKEND — Testes Pest

#### Passo 6: Testes de feature e unit
- [x] Criar `tests/Feature/Ingredient/IngredientCrudTest.php`
- [x] Criar `tests/Feature/Ingredient/IngredientValidationTest.php`
- [x] Criar `tests/Feature/Ingredient/IngredientAuthorizationTest.php`
- [x] Criar `tests/Unit/Enums/IngredientUnitTest.php`
- [x] Criar `tests/Unit/Actions/Ingredient/*Test.php`
- [x] Rodar suíte Pest e garantir verde

---

### 🎨 PARTE 4: FRONTEND — Tipos, Service e Store

#### Passo 7: Tipos e service
- [x] Adicionar tipos em `resources/js/types/ingredient.ts`
- [x] Criar `resources/js/Services/ingredientService.ts`

#### Passo 8: Store
- [x] Criar `resources/js/Stores/ingredient.ts`

---

### 🎨 PARTE 5: FRONTEND — Páginas, componentes e menu

#### Passo 9: Componentes
- [x] Instalar shadcn-vue: `table`, `select`, `dialog`, `alert-dialog`
- [x] Criar `UnitSelect.vue`, `IngredientForm.vue`, `IngredientList.vue`

#### Passo 10: Páginas e rotas
- [x] Criar `Pages/Ingredients/Index.vue` e `Form.vue`
- [x] Rotas `/ingredientes`, `/ingredientes/novo`, `/ingredientes/:id/editar`

#### Passo 11: Menu
- [x] Item **Ingredientes** em `AppLayout.vue`

---

### 🧪 PARTE 6: FRONTEND — Testes Vitest e Playwright

#### Passo 12: Vitest
- [x] Testes de form, list, UnitSelect, service e store (`npm run test:js` — 10 passed)

#### Passo 13: Playwright
- [x] Fluxos e2e de criar/editar/excluir/duplicado/URL bloqueada (`npm run test:e2e` — 5 passed)

---

### 📚 PARTE 7: Documentação

#### Passo 14: Atualizar DOCUMENTATION.md
- [x] Documentar model, enum, Actions, endpoints e menu

---

## 🧪 Critérios de Aceite

- [x] CRUD de Ingredientes funcionando fim a fim (API + UI)
- [x] Escrita via Actions (`app/Actions/Ingredient/*`), leitura direto no Controller
- [x] Soft delete funcionando
- [x] Isolamento por usuário garantido
- [x] Item de menu "Ingredientes" visível e funcional
- [x] Todos os testes Pest passam
- [x] Todos os testes Vitest passam
- [x] Todos os testes Playwright passam
- [x] `npx vue-tsc --noEmit` sem erros
- [x] `DOCUMENTATION.md` atualizado
