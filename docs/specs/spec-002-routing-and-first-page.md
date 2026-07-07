# Spec 002: Roteamento SPA (Vue Router) e Primeira Página (Dashboard)

## 1. Objetivo
Configurar o sistema de rotas do lado do cliente (Single Page Application) usando Vue Router e criar a primeira tela funcional (Dashboard/Home), garantindo que ela consuma a estrutura base de layout e componentes do shadcn-vue.

## 2. Contexto Técnico
- **Roteador:** `vue-router` v4+ integrado ao TypeScript.
- **Modo de Histórico:** HTML5 History Mode (`createWebHistory`), para termos URLs limpas (sem a hashtag `#`).
- **Ponto de Entrada:** O Laravel irá capturar qualquer rota web (`/*`) e renderizar a view Blade raiz (`app.blade.php`). A partir daí, o Vue Router assume o mapeamento da URL.

## 3. Requisitos de Arquitetura e Fluxo de Dados
- As páginas do SPA devem residir estritamente em `resources/js/Pages/`.
- Deve existir uma pasta `resources/js/Layouts/` para encapsular elementos globais da interface (ex: Sidebar, Header). As páginas serão renderizadas dentro desse Layout usando `<RouterView />`.
- Como o backend é uma API pura, a primeira página (Dashboard) deve estar estruturada para, no futuro, disparar requisições HTTP (via Axios/Fetch) para os endpoints de `/api/*`.

## 4. Estrutura de Arquivos Alvo
```text
resources/js/
├── Layouts/
│   └── AppLayout.vue         # Layout base com Sidebar/Header para o SaaS
├── Pages/
│   └── Dashboard.vue         # Primeira tela visível do usuário
├── router/
│   └── index.ts              # Configuração e mapeamento de rotas do Vue Router
└── App.vue                   # Atualizado para conter apenas o <RouterView /> global
