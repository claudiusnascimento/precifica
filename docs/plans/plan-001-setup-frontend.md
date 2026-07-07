### 📄 Criar em: `docs/plans/plan-001-setup-frontend.md`

```markdown
# Plan 001: Configuração do Ecossistema Frontend (Vue 3 + TypeScript + Tailwind + shadcn)

## 📋 Checklist de Execução

### Passo 1: Instalação de Dependências
- [ ] Instalar pacotes do Vue 3 e TypeScript: `vue`, `vue-router`, `pinia`, `typescript`, `@vitejs/plugin-vue`.
- [ ] Instalar Tailwind CSS e dependências de utilitários do shadcn: `tailwindcss`, `postcss`, `autoprefixer`, `clsx`, `tailwind-merge`, `lucide-vue-next`, `radix-vue`.
- [ ] Instalar o CLI do shadcn-vue como dependência de desenvolvimento: `shadcn-vue`.

### Passo 2: Arquivos de Configuração Estruturais
- [ ] Criar/Ajustar o `tsconfig.json` na raiz do projeto mapeando o alias `@/*` para `resources/js/*`.
- [ ] Ajustar o `vite.config.ts` para incluir o plugin do Vue (`@vitejs/plugin-vue`) e o mapeamento de paths do Node (`path.resolve`).
- [ ] Inicializar e configurar o Tailwind CSS (`tailwind.config.js` ou arquivo v4 correspondente) apontando os caminhos de conteúdo para as pastas `.vue` e `.ts` dentro de `resources/js`.

### Passo 3: Inicialização do shadcn-vue
- [ ] Criar o arquivo `components.json` na raiz com a seguinte configuração de caminhos:
  - `baseUrl`: `./resources/js`
  - `components`: `@/Components`
  - `ui`: `@/Components/ui`
  - `utils`: `@/lib/utils`
- [ ] Criar o arquivo helper de classes utilitárias em `resources/js/lib/utils.ts` contendo a função `cn()`.

### Passo 4: Inicialização do App Vue 3
- [ ] Criar o arquivo base HTML/Blade (`resources/views/app.blade.php`) contendo a div `#app` e a diretiva `@vite`.
- [ ] Criar o componente raiz `resources/js/App.vue` com um template básico.
- [ ] Criar o ponto de entrada `resources/js/app.ts` instanciando o app Vue e montando-o na div `#app`.
- [ ] Configurar uma rota fallback no Laravel (`routes/web.php`) para redirecionar qualquer rota não-API para a view `app.blade.php`, permitindo que o Vue Router assuma o controle futuramente.

## 🧪 Critérios de Aceite e Verificação
- [ ] O comando `npm run dev` compila sem erros de TypeScript ou Vite.
- [ ] A página inicial carrega o componente `App.vue` com estilização do Tailwind funcionando.
- [ ] O comando `npx shadcn-vue add button` roda com sucesso e cria o arquivo correspondente em `resources/js/Components/ui/button/Button.vue`.
