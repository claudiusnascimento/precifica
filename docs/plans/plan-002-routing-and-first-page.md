# Plan 002: Roteamento SPA (Vue Router) e Primeira Página (Dashboard)

## 📋 Checklist de Execução

### Passo 1: Configuração do Vue Router
- [x] Criar o arquivo `resources/js/router/index.ts` para instanciar o roteador com `createRouter` e `createWebHistory`.
- [x] Definir a tipagem estrita das rotas e configurar a rota inicial `/dashboard` (com um alias ou redirecionamento para `/` se preferir).
- [x] Atualizar o arquivo de entrada `resources/js/app.ts` para registrar o roteador usando `.use(router)`.

### Passo 2: Criação da Estrutura de Telas e Layout
- [x] Criar a pasta `resources/js/Layouts/`.
- [x] Criar o arquivo `resources/js/Layouts/AppLayout.vue`. Ele deve conter uma estrutura inicial de casca para o SaaS (espaço para Sidebar de navegação e área de conteúdo com `<slot />` ou `<RouterView />`).
- [x] Criar o componente da página em `resources/js/Pages/Dashboard.vue`. Use o Tailwind e inclua um componente simples do shadcn (ex: um `Button` ou um `Card`) para testar a integração visual.

### Passo 3: Ajuste do Componente Raiz
- [x] Atualizar o `resources/js/App.vue` para limpar qualquer código de teste anterior e manter apenas o componente `<RouterView />` encapsulado (ou aplicando o layout global).

## 🧪 Critérios de Aceite e Verificação
- [x] O projeto compila sem erros executando `npm run dev`.
- [x] Ao acessar o link local no navegador (ex: `http://localhost/dashboard`), a tela do Dashboard é renderizada corretamente dentro do `AppLayout`.
- [x] Nenhum erro de TypeScript ou de importação ausente aparece no console do navegador.
