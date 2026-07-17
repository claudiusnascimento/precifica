# Prompt 006: Módulo de Ingredientes

Cole este prompt no agente de código para iniciar a implementação.

---

```
Contexto: projeto Laravel + Vue, API pura (sem Inertia), pois a mesma API será
reaproveitada por um app React Native no futuro. Auth (Sanctum), login e Dashboard
já existem e funcionam. Siga o AGENTS.md do projeto para convenções de arquitetura.

Implemente o módulo de Ingredientes seguindo:
- Spec: spec-006-ingredients.md
- Plan: plan-006-ingredients.md

REQUIRED SUB-SKILL: use superpowers:subagent-driven-development (recomendado) ou
superpowers:executing-plans para executar o plan-006-ingredients.md passo a passo,
marcando cada checkbox conforme concluído.

CONVENÇÕES DO PROJETO (importante):
- Padrão de escrita é Actions, não Services. Services só quando há consumo de algo
  externo (API terceira, storage externo, etc). Para regra de negócio interna,
  sempre Action, seguindo o padrão já usado em app/Actions/User/RegisterUserAction.php.
  Para este módulo: app/Actions/Ingredient/CreateIngredientAction.php,
  UpdateIngredientAction.php, DeleteIngredientAction.php.
- Se em algum ponto a lógica ficar complexa demais para uma Action isolada (orquestra
  múltiplas Actions/regras), crie um Orchestrator em vez de inchar a Action ou criar
  uma Service — mas isso não deve ser necessário para o escopo deste módulo (CRUD
  simples).
- Leitura simples (index/show) não precisa de Action — fica direto no Controller,
  scoped por auth()->id().
- Sempre criar Factory e Seeder para os models novos.
- Sempre usar soft delete (SoftDeletes) para exclusão — nunca delete físico.
- Sempre gerar suíte de testes completa: Pest (backend), Vitest (componentes/store
  do frontend) e Playwright (e2e). Não considere a tarefa concluída sem os três.
- Ao final, atualize o DOCUMENTATION.md do projeto com o novo model, enum, Actions,
  endpoints e o item de menu adicionado.

Antes de começar a codar, confirme comigo:
- Se já existem componentes shadcn-vue de tabela/select/dialog instalados, ou se
  preciso instalar (`npx shadcn-vue@latest add ...`)
- Se o projeto já tem um padrão de paginação nas listagens existentes que eu deva seguir
- Onde fica o componente de menu/navegação do Dashboard para eu adicionar o item
  "Ingredientes"

Depois disso, implemente o plan-006-ingredients.md do início ao fim, rodando os
testes a cada etapa (docker compose run --rm test para o backend, e os comandos
equivalentes de Vitest/Playwright do projeto), e marque os checkboxes do plan
conforme for concluindo. Ao final, rode a suíte completa e me mostre o resultado.
```
