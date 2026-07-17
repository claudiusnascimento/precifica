# Plan 005: Landing Page e Cadastro de Usuário

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Entregar landing page completa em `/` com `MarketingLayout` + seções modulares, e fluxo de cadastro (`/register` + `POST /api/register`).

**Architecture:** Backend segue `Route → AuthController → RegisterUserAction → JSON`. Frontend usa `MarketingLayout` com componentes `Landing*` por seção; cadastro espelha o padrão do login existente.

**Tech Stack:** Laravel 13, Sanctum, Pest PHP, Vue 3, Pinia, Vue Router, shadcn-vue, Tailwind v4, lucide-vue-next

**Spec:** [spec-005-landing-page-and-register.md](../specs/spec-005-landing-page-and-register.md)

---

## 📋 Checklist de Execução

### 🖥️ PARTE 1: BACKEND — Cadastro

#### Passo 1: Action e validação
- [x] Criar `app/Http/Requests/Auth/RegisterRequest.php` com regras: `name`, `email` (unique), `password` (confirmed)
- [x] Criar `app/Actions/User/RegisterUserAction.php`:
  - Recebe `name`, `email`, `password`
  - Cria `User` com `UserRole::USER`
  - Chama `Auth::login($user)` + `session()->regenerate()`
  - Retorna `User`

#### Passo 2: Controller e rota
- [x] Adicionar método `register(RegisterRequest, RegisterUserAction)` em `AuthController`
- [x] Retornar JSON `{ message, user: UserResource }` (mesmo formato do login)
- [x] Registrar `POST /api/register` em `routes/api.php` (rota pública, fora do grupo `auth:sanctum`)

#### Passo 3: Testes Pest
- [x] Criar `tests/Feature/Auth/RegistrationTest.php`:
  - `user can register with valid data` → 200, usuário criado, `assertAuthenticated`
  - `user cannot register with duplicate email` → 422
  - `user cannot register with password mismatch` → 422
- [x] Rodar `docker compose run --rm test` e garantir suíte verde

---

### 🎨 PARTE 2: FRONTEND — shadcn e tipos

#### Passo 4: Componentes shadcn
- [x] Instalar: `npx shadcn-vue@latest add badge separator accordion`
- [x] Verificar imports e aliases (`@/Components/ui`)

#### Passo 5: Tipos e store
- [x] Adicionar `RegisterPayload` em `resources/js/types/auth.ts`
- [x] Adicionar action `register(payload)` em `resources/js/Stores/auth.ts` (CSRF → POST `/register` → set user → push dashboard)

---

### 🎨 PARTE 3: FRONTEND — Cadastro e rotas

#### Passo 6: Página de cadastro
- [x] Criar `resources/js/Pages/Auth/Register.vue` (espelhar `Login.vue`):
  - Campos: nome, e-mail, senha, confirmar senha
  - Submit chama `authStore.register()`
  - Link "Já tem conta? Entrar" → `/login`
- [x] Adicionar rota `/register` em `router/index.ts` com `meta.guest: true`
- [x] Atualizar guard `beforeEach`: redirect `/dashboard` se autenticado e destino for `login` **ou** `register`

---

### 🎨 PARTE 4: FRONTEND — Landing page

#### Passo 7: Layout e header
- [x] Criar `resources/js/Layouts/MarketingLayout.vue` (min-h-screen, flex col, header + main + footer)
- [x] Criar `resources/js/Components/Marketing/LandingHeader.vue`:
  - Logo "Precifica" → `/`
  - Visitante: `Entrar` + `Cadastrar`
  - Autenticado: `Ir para o Dashboard`
  - Header sticky com `border-b border-border bg-background/95 backdrop-blur`

#### Passo 8: Seções da landing
- [x] `LandingHero.vue` — título, subtítulo, CTAs (Cadastrar + âncora #como-funciona)
- [x] `LandingHowItWorks.vue` — 3 passos com ícones (`id="como-funciona"`)
- [x] `LandingBenefits.vue` — 4 Cards (custo real, margem clara, preço com confiança, hora trabalhada)
- [x] `LandingExample.vue` — tabela/cards do exemplo pastel (R$ 40 → 50 un → margens 20/40/60% → 500 vendas/mês)
- [x] `LandingAudience.vue` — bullets: MEI, confeiteiros, salgadeiros, food trucks
- [x] `LandingFaq.vue` — Accordion com 4 perguntas
- [x] `LandingCta.vue` — CTA final + botão Cadastrar
- [x] Footer simples em `MarketingLayout` (copyright Precifica)

#### Passo 9: Home.vue
- [x] Reescrever `resources/js/Pages/Home.vue` usando `MarketingLayout` e compondo todas as seções em ordem

---

## 🧪 Critérios de Aceite

- [x] `/` renderiza landing completa (7 seções) sem exigir login
- [x] Visitante vê "Entrar" e "Cadastrar" no header
- [x] Usuário logado em `/` vê "Ir para o Dashboard" (sem redirect automático)
- [x] `/register` cria conta, autentica e redireciona para `/dashboard`
- [x] Logado em `/login` ou `/register` → redirect `/dashboard`
- [x] Todos os testes Pest passam (`docker compose run --rm test`)
- [x] `npx vue-tsc --noEmit` sem erros
