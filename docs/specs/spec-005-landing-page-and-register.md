# Spec 005: Landing Page e Cadastro de Usuário

## 1. Objetivo

Substituir a página placeholder em `/` por uma **landing page completa** do Precifica — SaaS de precificação de receitas para gastronomia/confeitaria — e implementar o fluxo de **cadastro** (`/register`) com endpoint de API, seguindo a arquitetura definida no `AGENTS.md`.

## 2. Contexto de Negócio

O Precifica ajuda quem produz comida (ex.: pastéis, salgados, doces) a:

1. Cadastrar ingredientes e custos
2. Montar receitas com rendimento (quantas unidades a receita produz)
3. Visualizar custo por unidade e projeção de ganho mensal em diferentes margens de lucro (20%, 40%, 60%)

A landing deve comunicar esse valor de forma clara para visitantes não autenticados e converter em cadastro.

## 3. Decisões de Produto (validadas)

| Decisão | Escolha |
|---|---|
| Botão "Cadastrar" | Rota `/register` com backend completo |
| Usuário logado em `/` | Exibe landing; header mostra "Ir para o Dashboard" |
| Profundidade da landing | Completa: Hero, Como funciona, Benefícios, Exemplo, Para quem é, FAQ, CTA |
| Abordagem técnica | `MarketingLayout` + componentes por seção |

## 4. Arquitetura Frontend

### 4.1 Layout

- **`MarketingLayout.vue`**: layout público com header sticky, slot de conteúdo e footer simples.
- **`LandingHeader.vue`**: logo "Precifica" à esquerda; CTAs à direita conforme estado de auth.

### 4.2 Header — comportamento por estado

**Visitante (não autenticado):**
- `Entrar` → `/login` (variant `outline`)
- `Cadastrar` → `/register` (variant `default`)

**Autenticado:**
- `Ir para o Dashboard` → `/dashboard` (variant `default`)
- Sem redirect automático ao acessar `/`

### 4.3 Seções da landing (`Pages/Home.vue`)

| Seção | Componente | Conteúdo principal |
|---|---|---|
| Hero | `LandingHero.vue` | Título, subtítulo, CTAs (Cadastrar / Ver como funciona) |
| Como funciona | `LandingHowItWorks.vue` | 3 passos numerados |
| Benefícios | `LandingBenefits.vue` | 4 cards com ícones |
| Exemplo | `LandingExample.vue` | Cenário pastel: custo, rendimento, margens 20/40/60%, projeção mensal |
| Para quem é | `LandingAudience.vue` | Público-alvo (MEI, confeiteiros, salgadeiros, food trucks) |
| FAQ | `LandingFaq.vue` | 4 perguntas em Accordion |
| CTA final | `LandingCta.vue` | Chamada + botão Cadastrar |

### 4.4 Tom e idioma

- Português (BR)
- Tom direto e acolhedor, sem jargão contábil excessivo

### 4.5 UI (shadcn-vue)

**Já instalados:** `Button`, `Card`, `Input`, `Label`

**Adicionar via CLI:** `badge`, `separator`, `accordion`

**Regras:** tokens semânticos (`bg-background`, `text-muted-foreground`), `flex` + `gap-*`, ícones `lucide-vue-next` com `data-icon` em botões.

## 5. Cadastro (`/register`)

### 5.1 Frontend

- Página `Register.vue` no padrão visual de `Login.vue` (`GuestLayout` + `Card`)
- Campos: nome, e-mail, senha, confirmar senha
- Link para `/login` ("Já tem conta? Entrar")
- Sucesso: auto-login + redirect `/dashboard`

### 5.2 Backend (pipeline AGENTS.md)

`POST /api/register` → `AuthController@register` → `RegisterUserAction` → `UserResource` JSON

**`RegisterUserAction`:**
- Valida unicidade de e-mail (via FormRequest)
- Cria `User` com `role: UserRole::USER`
- Executa `Auth::login($user)` + `session()->regenerate()` (mesmo padrão pós-login Sanctum)
- Retorna usuário autenticado

**Validação (`RegisterRequest`):**
- `name`: required, string, max:255
- `email`: required, email, unique:users
- `password`: required, confirmed, regras padrão Laravel

### 5.3 Router

- Nova rota `/register` com `meta.guest: true`
- Guard: usuário autenticado que acessa `/login` **ou** `/register` → redirect `/dashboard`
- `/` permanece pública para todos

### 5.4 Pinia (`auth.ts`)

- Novo tipo `RegisterPayload`
- Nova action `register(payload)` → CSRF cookie → `POST /api/register` → atualiza `user` → redirect dashboard

## 6. Exemplo numérico (copy da landing)

Cenário ilustrativo fixo (não calculado em runtime nesta spec):

- Custo total dos ingredientes: **R$ 40,00**
- Rendimento da receita: **50 pastéis**
- Custo por unidade: **R$ 0,80**
- Vendas estimadas/mês: **500 unidades**
- Margens exibidas: **20%**, **40%**, **60%** com preço sugerido e ganho mensal projetado

## 7. Fora de escopo

- Verificação obrigatória de e-mail
- OAuth / login social
- Blog, pricing page, animações pesadas
- i18n
- Cálculos reais de receita (feature futura)

## 8. Critérios de aceite

- [x] `/` exibe landing completa com todas as seções
- [x] Header mostra Entrar/Cadastrar para visitantes
- [x] Header mostra "Ir para o Dashboard" para usuários logados em `/`
- [x] `/register` cadastra usuário, autentica e redireciona para `/dashboard`
- [x] Usuário logado em `/register` ou `/login` é redirecionado para `/dashboard`
- [x] Testes Pest cobrem `POST /api/register` (sucesso + validações)
- [x] `docker compose run --rm test` passa sem regressões
