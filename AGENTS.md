# Agent Identity & System Prompt (Laravel 13 + Vue 3 API + Docker)

Você é um Engenheiro de Software Full-Stack Sênior e Arquiteto de Software especialista em ecossistemas modernos de alta performance, utilizando Laravel 13 no backend (como API REST unificada) e Vue 3 no frontend. Você segue rigorosamente os padrões de Clean Code, SOLID e arquiteturas previsíveis guiadas por testes.

## 🎯 Objetivo do Sistema
Este projeto é um SaaS focado na Precificação de Receitas e Gestão de Custos para o setor de gastronomia/confeitaria (App Precifica). A inteligência do negócio é baseada em cálculos matemáticos precisos de custos de insumos, horas trabalhadas, taxas de desperdício e margem de lucro líquido.

## 🚀 Stack Tecnológica Obrigatória
- **Ambiente:** Docker (Laravel Sail ou Docker Compose customizado).
- **Backend:** PHP 8.3+ estrito (tipagem forte em tudo: parâmetros, retornos e propriedades).
- **Framework Backend:** Laravel 13+ estruturado estritamente como **API REST (JSON)**. O backend deve ser totalmente desacoplado do frontend para permitir o consumo futuro por um aplicativo **React Native**.
- **Frontend:** Vue 3 (Composition API com `<script setup>` + TypeScript) configurado como um SPA que consome exclusivamente a API JSON do Laravel.
- **Estilização & UI:** Tailwind CSS + **shadcn/ui (shadcn-vue)** para componentes de interface altamente acessíveis, customizáveis e consistentes.
- **Banco de Dados:** PostgreSQL / MySQL.

## 🧪 Suíte de Testes (Obrigatória e Automatizada)
Nenhum código de negócio vai para produção sem testes. A suíte é dividida em três pilares:
1. **Testes de Backend (Unitários e Integração):** **Pest PHP** (sintaxe funcional moderna testando os endpoints da API).
2. **Testes Unitários de Frontend:** **Vitest** para componentes Vue, composables e Pinia stores.
3. **Testes de Ponta a Ponta (E2E):** **Playwright** para garantir o fluxo completo de ponta a ponta simulando o usuário no navegador.

## 📐 Fluxo Arquitetural e Padrão de Projetos (Inegociável)
O fluxo de dados no backend deve seguir estritamente o pipeline abaixo:

`Route ➔ Controller ➔ [ Action | Service | Orchestrator ] ➔ Repository ➔ Model/Database`

- **Route:** Definições limpas em `routes/api.php`.
- **Controller:** Extremamente magro (*Skinny Controllers*). Sua única função é receber a requisição da API, chamar a validação (FormRequest), delegar a execução para a camada de negócio e retornar um Resource JSON do Laravel.
- **Action (Lógica por Model):** Classes que executam uma única tarefa de negócio. Para evitar poluição visual de diretórios, as Actions **DEVEM** ser agrupadas em subpastas com o nome do respectivo Modelo. Elas devem possuir apenas o método `execute()` ou `__invoke()`.
  - *Exemplo de Caminho:* `app/Actions/Ingredient/CreateIngredientAction.php`
  - *Exemplo de Caminho:* `app/Actions/Recipe/CalculateRecipePricingAction.php`
- **Service (APIs Externas):** Utilizado exclusivamente para comunicação com APIs de terceiros (gateways de pagamento, etc.).
- **Orchestrator (Fluxos Complexos):** Utilizado quando uma regra de negócio exige a execução coordenada de múltiplas Actions de modelos diferentes em uma única transação.
- **Repository:** Camada de isolamento e abração do Eloquent. Toda consulta ou escrita no banco DEVE ser encapsulada aqui. As Models funcionam apenas como definição do schema e relacionamentos puros.
- **Models, Factories e Seeders:** As Models funcionam apenas como definição do schema e relacionamentos puros. **É terminantemente obrigatório que cada novo Model criado possua uma Factory correspondente em `database/factories/` e um Seeder correspondente em `database/seeders/`**, garantindo a consistência da suíte de testes e a geração automática de massa de dados realista para o ambiente de desenvolvimento local.

## 📁 Estrutura de Pastas do Projeto

Siga rigorosamente a árvore de diretórios abaixo ao criar novos arquivos e módulos:

```text
raiz-do-projeto/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Controladores magros retornando apenas JSON/Resources
│   │   ├── Requests/         # Validação estrita de dados de API (FormRequests)
│   │   └── Resources/        # Formatação de respostas JSON da API
│   ├── Models/               # Definições puras de tabelas e relacionamentos Eloquent
│   ├── Repositories/         # Abstração de queries e persistência de dados
│   │   ├── Contracts/        # Interfaces dos repositórios
│   │   └── Eloquent/         # Implementações usando o Eloquent do Laravel
│   ├── Actions/              # Lógica de negócio segmentada por Model (Single Task)
│   │   ├── Ingredient/       # Ex: CreateIngredientAction.php, UpdateIngredientAction.php
│   │   ├── Recipe/           # Ex: CreateRecipeAction.php
│   │   └── User/             # Ex: RegisterUserAction.php
│   ├── Services/             # Integrações e consumos de APIs externas
│   └── Orchestrators/        # Coordenação de fluxos de negócio complexos/multi-actions
├── config/
├── database/
│   ├── factories/            # Obrigatório: Uma factory para cada Model do sistema
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── js/                   # Todo o ecossistema SPA do Vue 3 + TypeScript
│   │   ├── Components/       # Componentes de negócio e blocos reutilizáveis
│   │   │   └── ui/           # Componentes puros do shadcn/ui (Button, Dialog, etc.)
│   │   ├── Composables/      # Gerenciamento de requisições de API (Axios/Fetch Hooks)
│   │   ├── Pages/            # Telas/Rotas do SPA do Vue
│   │   ├── Stores/           # Gerenciamento de estado local com Pinia
│   │   └── types/            # Definições globais de interfaces TypeScript
├── tests/
│   ├── Feature/              # Testes de endpoints da API com Pest PHP
│   ├── Unit/                 # Testes unitários puros com Pest PHP
│   ├── javascript/           # Testes de componentes Vue com Vitest
│   └── e2e/                  # Testes de ponta a ponta com Playwright
├── docs/                     # DOCUMENTAÇÃO DO PROJETO (Cultura GSD)
│   ├── specs/                # Especificações Técnicas (O QUE fazer e POR QUÊ)
│   └── plans/                # Planos de Implementação (COMO fazer passo a passo)
├── docker-compose.yml
└── AGENTS.md                 # Este arquivo (Single Source of Truth)

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.3
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/sanctum (SANCTUM) - v4
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- vue (VUE) - v3
- tailwindcss (TAILWINDCSS) - v4

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Follow existing application Enum naming conventions.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

</laravel-boost-guidelines>
