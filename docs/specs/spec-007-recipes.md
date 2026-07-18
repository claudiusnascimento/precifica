# Spec 007: Módulo de Receitas (Recipes)

## 1. Objetivo

Implementar o CRUD de **Receitas**, segunda etapa do pipeline de precificação do Precifica. Cada receita agrega múltiplos ingredientes, cada um com uma quantidade utilizada, servindo de base para o cálculo futuro de custo total e custo por unidade da receita.

## 2. Contexto de Negócio

O Precifica segue o pipeline: **Ingrediente → Receita → Custo por unidade → Margem/Projeção**. Este módulo entrega a segunda etapa: cadastro de receitas com nome, rendimento (quantidade + unidade) e os ingredientes que a compõem.

Exemplo:
- Receita "Bolo de Cenoura", `yield_quantity` = 1, `yield_unit` = `unit` (rende 1 bolo inteiro)
- Ingredientes da receita: Farinha (500 g), Ovo (3 unidades), Óleo (200 ml)

## 3. Decisões de Produto (validadas)

| Decisão | Escolha |
|---|---|
| Arquitetura | segue o mesmo padrão do módulo Ingredients — API pura, Actions |
| Relação com Ingredient | N:N via tabela pivot `ingredient_recipe`, com coluna extra `quantity` |
| Unidade do rendimento | reaproveita o enum `IngredientUnit` já existente (`gram`, `kilogram`, `milliliter`, `liter`, `unit`) |
| Quantidade do ingrediente na receita | armazenada na mesma unidade já definida no cadastro do próprio Ingredient — o pivot não tem unidade própria |
| Exclusão | soft delete, igual Ingredient |
| Seeder/Factory | obrigatórios, incluindo povoamento da tabela pivot |
| Escopo por usuário | receita pertence a um `user_id`; só pode conter ingredientes que pertençam ao mesmo usuário |
| Salvar sem ingredientes | permitido — lista de ingredientes pode vir vazia ou ser omitida |

### Decisão confirmada — `yield_unit`

Reaproveitar o enum `IngredientUnit` inteiro (5 opções, incluindo `milliliter`). Sem enum novo.

## 4. Modelo de Dados

### Tabela `recipes`

| Coluna | Tipo | Regras |
|---|---|---|
| id | bigint unsigned (PK) | auto-increment (`$table->id()`) |
| user_id | bigint unsigned (FK → users.id) | obrigatório, `foreignId` com `onDelete: cascade` |
| name | string(120) | obrigatório, único por `user_id` entre registros **não deletados** |
| yield_quantity | decimal(10,4) | obrigatório, `> 0` |
| yield_unit | string (enum `IngredientUnit`) | obrigatório |
| deleted_at | timestamp nullable | soft delete (`SoftDeletes`) |
| created_at / updated_at | timestamps | padrão Laravel |

### Tabela pivot `ingredient_recipe`

| Coluna | Tipo | Regras |
|---|---|---|
| id | bigint unsigned (PK) | auto-increment |
| recipe_id | bigint unsigned (FK → recipes.id) | `onDelete: cascade` |
| ingredient_id | bigint unsigned (FK → ingredients.id) | `onDelete: cascade` |
| quantity | decimal(10,4) | obrigatório, `> 0` — quantidade na unidade própria do Ingredient |
| created_at / updated_at | timestamps | padrão Laravel |

> Nome da tabela pivot segue a convenção alfabética do Laravel (`ingredient_recipe`, não `recipe_ingredient`).

Modelo pivot dedicado `app/Models/RecipeIngredient.php` (`extends Illuminate\Database\Eloquent\Relations\Pivot`), usado via `->using(RecipeIngredient::class)->withPivot('quantity')->withTimestamps()` — necessário porque a tabela tem coluna extra além das chaves.

## 5. Regras de Negócio / Validação

- `name`: required, string, max:120, único por `user_id` (ignorando soft-deleted)
- `yield_quantity`: required, numeric, min:0.0001
- `yield_unit`: required, `Rule::enum(IngredientUnit::class)`
- `ingredients`: array **opcional** (pode ser vazio ou omitido no payload)
  - `ingredients.*.id`: deve existir na tabela `ingredients` **e** pertencer ao usuário autenticado (rejeitar ingredient de outro usuário)
  - `ingredients.*.quantity`: required se `ingredients.*.id` presente, numeric, min:0.0001
- Toda leitura/escrita restrita ao dono (`user_id === auth()->id()`) via `RecipePolicy`
- Delete é sempre soft delete — linhas do pivot são preservadas (histórico), não removidas

## 6. Arquitetura Backend (pipeline)

Segue `AGENTS.md`, mesmo padrão do módulo Ingredients.

**Escrita (mutations):**
`Route → RecipeController → {Create,Update,Delete}RecipeAction → RecipeResource`

- `app/Actions/Recipe/CreateRecipeAction.php` — cria a receita e sincroniza os ingredientes (com `quantity`) em uma transação
- `app/Actions/Recipe/UpdateRecipeAction.php` — atualiza os dados da receita e sincroniza (attach/detach/update) os ingredientes em uma transação
- `app/Actions/Recipe/DeleteRecipeAction.php` — soft delete da receita

**Leitura (index/show):**
`Route → RecipeController` — query direta, scoped por `auth()->id()`, com eager loading de `ingredients`.

**Autorização:** `RecipePolicy` (`viewAny`, `view`, `create`, `update`, `delete`), registrada e usada via `authorizeResource`.

**Validação:** `StoreRecipeRequest`, `UpdateRecipeRequest` — validam também que cada `ingredients.*.id` pertence ao usuário autenticado.

**Serialização:** `RecipeResource` (inclui a lista de ingredientes com nome, unit e quantity usada na receita).

## 7. Endpoints da API

| Método | Rota | Ação |
|---|---|---|
| GET | `/api/recipes` | listar (paginado, busca por `name`) |
| POST | `/api/recipes` | criar (com `ingredients` opcional) |
| GET | `/api/recipes/{recipe}` | detalhar (com ingredients) |
| PUT | `/api/recipes/{recipe}` | atualizar |
| DELETE | `/api/recipes/{recipe}` | soft delete |

Todas dentro do grupo `auth:sanctum`.

## 8. Frontend

- Novo item de menu **"Receitas"** no Dashboard existente
- Rotas: `/receitas` (lista), `/receitas/novo`, `/receitas/:id/editar`
- Páginas: `Pages/Recipes/Index.vue`, `Pages/Recipes/Form.vue` (reuso criar/editar)
- `Form.vue`: campos `name`, `yield_quantity`, `yield_unit` (reaproveita `UnitSelect.vue`) + seção de ingredientes com botão **Adicionar**
- Componente `RecipeIngredientRow.vue` por linha: select do Ingredient, input de `quantity`, select de `unit` (preenchido automaticamente com a unidade do Ingredient escolhido — não é persistido no pivot), botão excluir à direita
- `RecipeService` (chamadas HTTP no padrão já usado no projeto)
- `useRecipeStore` (Pinia) — lista, loading, erros, CRUD
- Listagem: nome, rendimento formatado (`yield_quantity` + label da unit), quantidade de ingredientes, ações editar/excluir
- Confirmação antes de excluir (soft delete, mas UX trata como remoção)
- Estados de loading, vazio e erro de validação por campo (incluindo erros por linha de ingrediente)

## 9. Testes Exigidos

**Pest**
- Feature: CRUD completo (create/list/show/update/delete) — casos de sucesso
- Feature: validação (nome duplicado por usuário, yield inválido, ingredient de outro usuário rejeitado)
- Feature: isolamento por usuário (403/404 ao acessar receita de outro usuário)
- Feature: autenticação obrigatória (401 sem sessão)
- Feature: soft delete (receita não aparece mais na listagem, mas continua no banco)
- Feature: salvar receita **sem** nenhum ingredient funciona
- Unit: cada Action isoladamente (`CreateRecipeAction`, `UpdateRecipeAction`, `DeleteRecipeAction`)

**Vitest**
- `RecipeForm.vue`: validação, adicionar/remover linha de ingrediente, emissão de evento, exibição de erros da API
- `RecipeList.vue` (ou `Index.vue`): renderização, estado vazio, loading, formatação do rendimento
- `RecipeService` e `useRecipeStore`: chamadas e estado (sucesso/erro)

**Playwright**
- Login → menu "Receitas" → criar receita com ingredientes → ver na lista
- Criar receita **sem** ingredientes → ver na lista
- Editar receita existente → mudança refletida
- Excluir receita → some da lista
- Nome duplicado → mensagem de erro visível
- Acesso a receita de outro usuário via URL direta → bloqueado

## 10. Documentação

- Atualizar `DOCUMENTATION.md`: novo model, pivot, Actions, endpoints, enum reaproveitado e item de menu

## 11. Fora de Escopo

- Cálculo de custo da receita (feature futura)
- Receita dentro de receita (sub-receitas)
- Histórico de alteração do rendimento
- Duplicar receita
- i18n

## 12. Critérios de Aceite

- [x] `Recipe` criado com migration, model, factory, seeder e soft deletes
- [x] Pivot `ingredient_recipe` criado com model `RecipeIngredient` e coluna `quantity`
- [x] CRUD completo via API, restrito ao dono via `RecipePolicy`
- [x] Actions (`Create`, `Update`, `Delete`) seguindo o padrão `app/Actions/{Domínio}`
- [x] Validação rejeita `ingredient_id` de outro usuário
- [x] Salvar receita sem nenhum ingredient funciona
- [x] Item de menu "Receitas" visível no Dashboard
- [x] Páginas de listagem e formulário funcionando (criar/editar/excluir, com e sem ingredientes)
- [x] Testes Pest cobrindo CRUD, validação, isolamento por usuário, soft delete e salvar sem ingredientes
- [x] Testes Vitest cobrindo componentes e store
- [x] Testes Playwright cobrindo o fluxo e2e completo
- [x] `DOCUMENTATION.md` atualizado
- [x] Suíte completa passa sem regressões
