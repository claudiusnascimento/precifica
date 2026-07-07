# Plan 001: Configuração do Ecossistema Frontend (Vue 3 + TypeScript + Tailwind + shadcn)

## 📋 Checklist de Execução

### Passo 1: Instalação de Dependências
- [x] Instalar pacotes do Vue 3 e TypeScript: `vue`, `vue-router`, `pinia`, `typescript`, `@vitejs/plugin-vue`.
- [x] Instalar Tailwind CSS e dependências de utilitários do shadcn: `tailwindcss`, `postcss`, `autoprefixer`, `clsx`, `tailwind-merge`, `lucide-vue-next`, `radix-vue`.
- [x] Instalar o CLI do shadcn-vue como dependência de desenvolvimento: `shadcn-vue`.

### Passo 2: Arquivos de Configuração Estruturais
- [x] Criar/Ajustar o `tsconfig.json` na raiz do projeto mapeando o alias `@/*` para `resources/js/*`.
- [x] Ajustar o `vite.config.ts` para incluir o plugin do Vue (`@vitejs/plugin-vue`) e o mapeamento de paths do Node (`path.resolve`).
- [x] Inicializar e configurar o Tailwind CSS (`tailwind.config.js` ou arquivo v4 correspondente) apontando os caminhos de conteúdo para as pastas `.vue` e `.ts` dentro de `resources/js`.

### Passo 3: Inicialização do shadcn-vue
- [x] Criar o arquivo `components.json` na raiz com a seguinte configuração de caminhos:
  - `baseUrl`: `./resources/js`
  - `components`: `@/Components`
  - `ui`: `@/Components/ui`
  - `utils`: `@/lib/utils`
- [x] Criar o arquivo helper de classes utilitárias em `resources/js/lib/utils.ts` contendo a função `cn()`.

### Passo 4: Inicialização do App Vue 3
- [x] Criar o arquivo base HTML/Blade (`resources/views/app.blade.php`) contendo a div `#app` e a diretiva `@vite`.
- [x] Criar o componente raiz `resources/js/App.vue` com um template básico.
- [x] Criar o ponto de entrada `resources/js/app.ts` instanciando o app Vue e montando-o na div `#app`.
- [x] Configurar uma rota fallback no Laravel (`routes/web.php`) para redirecionar qualquer rota não-API para a view `app.blade.php`, permitindo que o Vue Router assuma o controle futuramente.

## 🧪 Critérios de Aceite e Verificação
- [x] O comando `npm run dev` compila sem erros de TypeScript ou Vite.
- [x] A página inicial carrega o componente `App.vue` com estilização do Tailwind funcionando.
- [x] O comando `npx shadcn-vue add button` roda com sucesso e cria o arquivo correspondente em `resources/js/Components/ui/button/Button.vue`.
