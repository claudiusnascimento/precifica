# Spec 006: Módulo de Ingredientes

## 1. Objetivo

Implementar o CRUD de **Ingredientes**, primeiro bloco de dados do fluxo de precificação do Precifica. Cada usuário cadastra seus próprios ingredientes com preço por unidade de medida — base para o custo das receitas (feature futura).

## 2. Contexto de Negócio

O Precifica segue o pipeline: **Ingrediente → Receita → Custo por unidade → Margem/Projeção**. Este módulo entrega a primeira etapa: cadastro de ingredientes com nome, unidade de medida e preço por unidade.

Exemplo:
- Ovo, `unit` = `unit`, `price` = 0.10 → cada ovo custa R$ 0,10
- Farinha, `unit` = `gram`, `price` = 0.008 → cada grama custa R$ 0,008

## 3. Decisões de Produto (validadas)

| Decisão | Escolha |
|---|---|
| Arquitetura | API pura (sem Inertia) — mesma API será reaproveitada pelo app React Native futuramente |
| Padrão de escrita | `Actions` (não `Services`) — segue `app/Actions/{Domínio}/{Verbo}{Entidade}Action.php` |
| Leitura (index/show) | Direto no Controller, sem Action — não há regra de negócio na leitura |
| Exclusão | Soft delete (`SoftDeletes`) — nunca apagar fisicamente |
| Seeder e Factory | Obrigatórios |
| Escopo por usuário | Todo ingrediente pertence a um único `user_id`, nunca visível/editável por outro usuário |

## 4. Modelo de Dados (`Ingredient`)

| Coluna | Tipo | Regras |
|---|---|---|
| id | bigint unsigned (PK) | auto-increment (`$table->id()`) |
| user_id | bigint unsigned (FK → users.id) | obrigatório, `foreignId` com `onDelete: cascade` |
| name | string(120) | obrigatório, único por `user_id` entre registros **não deletados** |
| unit | string (enum `IngredientUnit`) | obrigatório |
| price | decimal(10,4) | obrigatório, `>= 0` — preço por 1 unidade do campo `unit` |
| deleted_at | timestamp nullable | soft delete (`SoftDeletes`) |
| created_at / updated_at | timestamps | padrão Laravel |

Índice único composto: `(user_id, name)` — considerar que a unicidade deve ignorar linhas com `deleted_at` preenchido (validar via `Rule::unique('ingredients')->where('user_id', ...)->whereNull('deleted_at')`, já que índice de banco único simples não soft-delete-aware).

## 5. Enum `IngredientUnit`

PHP Backed Enum em `app/Enums/IngredientUnit.php`:

| Valor (`value`) | Label pt-BR |
|---|---|
| `gram` | Grama |
| `kilogram` | Quilograma |
| `milliliter` | Mililitro |
| `liter` | Litro |
| `unit` | Unidade |

Deve expor um método `label(): string` e um método estático `options(): array` (`[{value, label}]`) para alimentar o `<select>` do front sem duplicar a lista lá.

## 6. Regras de Negócio / Validação

- `name`: required, string, max:120, único por `user_id` (ignorando soft-deleted)
- `unit`: required, `Rule::enum(IngredientUnit::class)`
- `price`: required, numeric, min:0, max:999999.9999
- Toda leitura/escrita restrita ao dono (`user_id === auth()->id()`) via `IngredientPolicy`
- Delete é sempre soft delete — não expor `forceDelete` nem `restore` nesta versão

## 7. Arquitetura Backend (pipeline)

Segue `AGENTS.md`:

**Escrita (mutations):**
`Route → IngredientController → {Create,Update,Delete}IngredientAction → IngredientResource`

- `app/Actions/Ingredient/CreateIngredientAction.php`
- `app/Actions/Ingredient/UpdateIngredientAction.php`
- `app/Actions/Ingredient/DeleteIngredientAction.php` (executa soft delete)

**Leitura (index/show):**
`Route → IngredientController` — query direta, scoped por `auth()->id()`, sem Action (sem regra de negócio a orquestrar).

**Autorização:** `IngredientPolicy` (`viewAny`, `view`, `create`, `update`, `delete`), registrada e usada via `authorizeResource` no Controller.

**Validação:** `StoreIngredientRequest`, `UpdateIngredientRequest` (Form Requests).

**Serialização:** `IngredientResource`.

## 8. Endpoints da API

| Método | Rota | Ação |
|---|---|---|
| GET | `/api/ingredients` | listar (paginado, busca por `name`, filtro por `unit`) |
| POST | `/api/ingredients` | criar |
| GET | `/api/ingredients/{ingredient}` | detalhar |
| PUT | `/api/ingredients/{ingredient}` | atualizar |
| DELETE | `/api/ingredients/{ingredient}` | soft delete |
| GET | `/api/ingredient-units` | listar opções do enum `IngredientUnit` (value + label) |

> `/api/ingredient-units` fica fora do `apiResource` de propósito, para não colidir com `/api/ingredients/{ingredient}`.

Todas dentro do grupo `auth:sanctum`.

## 9. Frontend

- Novo item de menu **"Ingredientes"** no Dashboard existente
- Rotas: `/ingredientes` (lista), `/ingredientes/novo`, `/ingredientes/:id/editar`
- Páginas: `Pages/Ingredients/Index.vue`, `Pages/Ingredients/Form.vue` (reuso criar/editar)
- Componente `UnitSelect.vue` — consome `/api/ingredient-units`, exibe labels pt-BR
- `IngredientService` (chamadas HTTP no padrão já usado no projeto)
- `useIngredientStore` (Pinia) — lista, loading, erros, CRUD
- Listagem: nome, unidade (label), preço formatado em BRL, ações editar/excluir
- Confirmação antes de excluir (soft delete, mas UX trata como remoção)
- Estados de loading, vazio e erro de validação por campo

## 10. Testes exigidos

**Pest**
- Feature: CRUD completo (create/list/show/update/delete) — casos de sucesso
- Feature: validação (nome duplicado por usuário, unit inválida, price negativo)
- Feature: isolamento por usuário (403/404 ao acessar ingrediente de outro usuário)
- Feature: autenticação obrigatória (401 sem sessão)
- Feature: soft delete (registro não aparece mais na listagem, mas continua no banco)
- Unit: `IngredientUnit` (labels, `options()`)
- Unit: cada Action isoladamente (`CreateIngredientAction`, `UpdateIngredientAction`, `DeleteIngredientAction`)

**Vitest**
- `IngredientForm.vue`: validação, emissão de evento, exibição de erros da API
- `IngredientList.vue` (ou `Index.vue`): renderização, estado vazio, loading, formatação de preço
- `UnitSelect.vue`: opções carregadas corretamente, valor selecionado
- `IngredientService` e `useIngredientStore`: chamadas e estado (sucesso/erro)

**Playwright**
- Login → menu "Ingredientes" → criar → ver na lista
- Editar ingrediente existente → mudança refletida
- Excluir ingrediente → some da lista
- Nome duplicado → mensagem de erro visível
- Acesso a ingrediente de outro usuário via URL direta → bloqueado

## 11. Documentação

- Atualizar `DOCUMENTATION.md`: novo model, Actions, endpoints, enum, item de menu

## 12. Fora de escopo

- Restore / force delete
- Conversão entre unidades
- Histórico de variação de preço
- Importação em massa (CSV)
- i18n

## 13. Critérios de aceite

- [x] `Ingredient` criado com migration, model, factory, seeder e soft deletes
- [x] `IngredientUnit` enum criado e exposto via `/api/ingredient-units`
- [x] CRUD completo via API, restrito ao dono via `IngredientPolicy`
- [x] Actions (`Create`, `Update`, `Delete`) seguindo o padrão `app/Actions/{Domínio}`
- [x] Item de menu "Ingredientes" visível no Dashboard
- [x] Páginas de listagem e formulário funcionando (criar/editar/excluir)
- [x] Testes Pest cobrindo CRUD, validação, isolamento por usuário e soft delete
- [x] Testes Vitest cobrindo componentes e store
- [x] Testes Playwright cobrindo o fluxo e2e completo
- [x] `DOCUMENTATION.md` atualizado
- [x] Suíte completa passa sem regressões
