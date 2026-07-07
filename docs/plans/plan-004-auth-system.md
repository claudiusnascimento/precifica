# Plan 004: Sistema de Autenticação Completo (Laravel Sanctum API + Vue 3 SPA)

## 📋 Checklist de Execução

### 🖥️ PARTE 1: BACKEND (Laravel 13 + Sanctum)

#### Passo 1: Configuração do Laravel Sanctum
- [x] Certificar-se de que o Laravel Sanctum está instalado e configurado como middleware stateful em `bootstrap/app.php` para aceitar requisições do domínio do frontend.
- [x] Configurar as variáveis de ambiente (`SANCTUM_STATEFUL_DOMAINS` e `SESSION_DOMAIN`) no `.env`.
- [x] Declarar as rotas de auth em `routes/api.php`.

#### Passo 2: Criação das Actions de Negócio (Camada Inegociável)
- [x] Criar `app/Actions/User/LoginUserAction.php` para validar credenciais com `Auth::attempt`.
- [x] Criar `app/Actions/User/SendResetLinkAction.php` para gerar o token e enviar o e-mail de recuperação.
- [x] Criar `app/Actions/User/ResetPasswordAction.php` para validar o token e atualizar a senha com `Hash::make`.

#### Passo 3: Controller, Validação e Testes
- [x] Criar `app/Http/Controllers/Api/Auth/AuthController.php` injetando as Actions.
- [x] Criar testes de Feature com Pest em `tests/Feature/Auth/` simulando as requisições do Sanctum.

---

### 🎨 PARTE 2: FRONTEND (Vue 3 + shadcn)

#### Passo 4: Configuração de Rotas (Vue Router)
- [x] Criar a página pública em `resources/js/Pages/Home.vue` exibindo apenas o texto "Home Page".
- [x] Atualizar o arquivo `resources/js/router/index.ts` com as rotas: `/` (Home), `/login` (Login), e `/dashboard` (Dashboard).
- [x] Implementar a lógica de Route Guard (`router.beforeEach`):
  - Se for para `/dashboard` e não estiver autenticado ➔ redireciona para `/login`.
  - Se tentar ir para `/login` já estando autenticado ➔ redireciona para `/dashboard`.

#### Passo 5: Store do Pinia e Integração
- [x] Desenvolver a store `resources/js/Stores/auth.ts` configurando as chamadas HTTP (lembrando de chamar o endpoint `/sanctum/csrf-cookie` antes do login).
- [x] Implementar o redirecionamento automático para o `/dashboard` após o sucesso do login.

#### Passo 6: Criação das Telas de Autenticação
- [x] Criar a tela `Login.vue` com componentes do shadcn.
- [x] Criar as telas `ForgotPassword.vue` e `ResetPassword.vue`.

## 🧪 Critérios de Aceite
- [x] Acessar `/` renderiza "Home Page" sem exigir login.
- [x] Tentar acessar `/dashboard` deslogado força o redirecionamento imediato para `/login`.
- [x] Fazer o login com sucesso altera o estado do Pinia e redireciona o usuário para o `/dashboard`.
- [x] Todos os testes automatizados do Pest PHP passam com sucesso.
