# Spec 004: Sistema de Autenticação Completo (Laravel Sanctum API + Vue 3 SPA)

## 1. Objetivo
Implementar o fluxo completo de autenticação da aplicação "Precifica", utilizando o Laravel Sanctum no backend para autenticação segura via SPA/Cookies e o Vue Router no frontend para controle de acessos, cobrindo a página pública inicial, Login, Dashboard protegido, Logout e Recuperação de Senha.

## 2. Contexto Técnico e Segurança
- **Backend (Laravel 13):** Utilização do **Laravel Sanctum** para autenticação baseada em cookies encriptados (Stateful Authentication). Os endpoints retornam respostas JSON padronizadas.
- **Frontend (Vue 3):** Uma store do Pinia (`useAuthStore`) gerencia o estado do usuário logado e monitora a sessão ativa.
- **Mapeamento de Rotas do Frontend (Vue Router):**
  - `/` (Pública): Exibe uma página simples com o texto "Home Page".
  - `/login` (Pública/Guest): Formulário de autenticação. Se o usuário já estiver logado, redireciona para o `/dashboard`.
  - `/dashboard` (Protegida): Apenas para usuários autenticados. Se não estiver logado, redireciona para `/login`.

## 3. Fluxo de Dados e Pipeline Backend (Alinhado ao AGENTS.md)
Toda requisição de autenticação deve seguir o fluxo:
`API Route ➔ AuthController ➔ AuthAction ➔ JSON Response`

### Endpoints da API (`routes/api.php`):
- `GET /sanctum/csrf-cookie` -> Inicializa a proteção CSRF do Sanctum antes do login.
- `POST /api/login` -> Autentica o usuário e inicia a sessão via Sanctum.
- `POST /api/logout` -> Invalida a sessão atual.
- `POST /api/forgot-password` -> Dispara o e-mail com o link de recuperação.
- `POST /api/reset-password` -> Processa a nova senha usando o token recebido.
