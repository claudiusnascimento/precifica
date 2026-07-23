# Prompt 007: Módulo de Receitas

Cole este prompt no agente de código para iniciar a implementação.

---

```
Contexto: projeto Laravel + Vue, API pura (sem Inertia), pois a mesma API será
reaproveitada por um app React Native no futuro. Auth (Sanctum), login, Dashboard
e o módulo de Ingredients já existem e funcionam. Siga o AGENTS.md do projeto para
convenções de arquitetura.

Implemente o módulo de Receitas (Recipes) seguindo:
- Spec: spec-007-recipes.md
- Plan: plan-007-recipes.md

REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (recomendado) ou
superpowers:executing-plans para executar o plan-007-recipes.md passo a passo,
marcando cada checkbox conforme concluído.

CONVENÇÕES DO PROJETO (importante):
- Padrão de escrita é Actions, não Services. Services só quando há consumo de algo
  externo (API terceira, storage externo, etc). Para regra de negócio interna,
  sempre Action, seguindo o padrão já usado em app/Actions/Ingredient/*.
  Para este módulo: app/Actions/Recipe/CreateRecipeAction.php,
  UpdateRecipeAction.php, DeleteRecipeAction.php.
- Recipe tem relação N:N com Ingredient via tabela pivot `ingredient_recipe`
  (nome em ordem alfabética, convenção Laravel), com coluna extra `quantity`.
  Use um model de pivot dedicado `app/Models/RecipeIngredient.php` (extends Pivot)
  e `->using(RecipeIngredient::class)->withPivot('quantity')->withTimestamps()`
  na relação `belongsToMany`, tanto em Recipe quanto em Ingredient.
- CreateRecipeAction e UpdateRecipeAction precisam criar/atualizar a receita E
  sincronizar os ingredientes (com quantity) na mesma transação — usar
  DB::transaction() ou equivalente.
- Validação deve garantir que todo `ingredient_id` enviado no payload pertence ao
  usuário autenticado (rejeitar ingredient de outro usuário com 422/403).
- Deve ser possível salvar uma receita sem nenhum ingredient (lista vazia ou
  ausente no payload) — não torne `ingredients` obrigatório.
- yield_unit reaproveita o enum `IngredientUnit` já existente — não crie um enum
  novo, a menos que eu confirme que quero restringir as opções (ver seção
  "Decisão pendente" na spec-007-recipes.md — se estiver em dúvida, PARE e me
  pergunte antes de prosseguir com esse ponto específico).
- Se em algum ponto a lógica ficar complexa demais para uma Action isolada
  (orquestra múltiplas Actions/regras), crie um Orchestrator em vez de inchar a
  Action ou criar uma Service — mas isso não deve ser necessário para o escopo
  deste módulo (CRUD com sync de pivot).
- Leitura simples (index/show) não precisa de Action — fica direto no Controller,
  scoped por auth()->id(), com eager loading de ingredients.
- Sempre criar Factory e Seeder para os models novos, incluindo povoamento da
  tabela pivot.
- Sempre usar soft delete (SoftDeletes) para exclusão da receita — nunca delete
  físico. As linhas do pivot NÃO devem ser removidas ao soft-deletar a receita
  (preservar para histórico futuro de custo).
- Sempre gerar suíte de testes completa: Pest (backend), Vitest
  (componentes/store do frontend) e Playwright (e2e). Não considere a tarefa
  concluída sem os três.
- Ao final, atualize o DOCUMENTATION.md do projeto com o novo model, pivot,
  Actions, endpoints e o item de menu adicionado.

Antes de começar a codar, confirme comigo:
- A decisão pendente sobre yield_unit (reaproveitar IngredientUnit inteiro com
  5 opções, ou restringir a 4 unidades)
- Se o componente de seleção de ingredientes no form deve permitir buscar por
  nome (autocomplete) ou se um select simples com todos os ingredientes do
  usuário já resolve para este escopo
- Onde fica o componente de menu/navegação do Dashboard para eu adicionar o item
  "Receitas"

Depois disso, implemente o plan-007-recipes.md do início ao fim, rodando os
testes a cada etapa (docker compose run --rm test para o backend, e os comandos
equivalentes de Vitest/Playwright do projeto), e marque os checkboxes do plan
conforme for concluindo. Ao final, rode a suíte completa e me mostre o resultado.
```
