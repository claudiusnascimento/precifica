# Plan 003: Sistema de Múltiplos Presets de Cores Modulares (.ts)

## 📋 Checklist de Execução

### Passo 1: Criação da Estrutura de Temas
- [x] Criar o diretório `resources/js/Themes/`.
- [x] Criar o arquivo `resources/js/Themes/zinc.ts` mapeando os valores padrões do shadcn zinc (light e dark).
- [x] Criar o arquivo `resources/js/Themes/custom-orange.ts` e estruturar nele os valores de variáveis CSS gerados a partir do código `bIm515k` do site do shadcn.
- [x] Criar o `resources/js/Themes/index.ts` importando e reunindo todos os temas em um mapa/dicionário indexado por ID.

### Passo 2: Desenvolvimento da Store de Tema (Pinia)
- [x] Criar a store `resources/js/Stores/theme.ts` controlando os estados `currentMode` ('light' | 'dark') e `currentPreset` (ID do tema).
- [x] Criar uma função utilitária dentro da store chamada `applyTheme()` que:
  - Adicione/remova a classe `.dark` do `html`.
  - Recupere as variáveis do preset ativo e use `document.documentElement.style.setProperty` para injetá-las em tempo de execução.
- [x] Configurar a persistência do estado no `localStorage` e invocar a inicialização da store no ponto de entrada `resources/js/app.ts`.

### Passo 3: Relação com a Interface
- [x] Criar o componente de seleção de temas (`ThemeSelector.vue`) utilizando os componentes de UI do shadcn.
- [x] Adicionar o seletor no layout principal (`AppLayout.vue`).

## 🧪 Critérios de Aceite
- [x] O projeto compila normalmente sem quebras.
- [x] Mudar o preset altera as cores de realce (como os botões) imediatamente sem recarregar a página.
- [x] O visual do modo escuro respeita as tonalidades configuradas de forma isolada dentro do arquivo `.ts` do preset correspondente.

## 📝 Notas de Implementação

- Tipos compartilhados em `resources/js/types/theme.ts` (`ThemePreset`, `ThemeMode`, `THEME_CSS_VARIABLES`).
- Variáveis estáticas `:root`/`.dark` removidas de `app.css`; tokens semânticos Tailwind permanecem em `@theme inline`.
- Preset padrão ao primeiro acesso: `zinc`.
- Chave de persistência: `precifica-theme`.
