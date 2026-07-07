# Spec 003: Sistema de Múltiplos Presets de Cores Modulares (.ts)

## 1. Objetivo
Implementar um gerenciador de temas dinâmico no frontend que permita alternar entre Modo Claro/Escuro e múltiplos presets visuais do shadcn de forma modular, onde cada preset é isolado em seu próprio arquivo TypeScript.

## 2. Contexto Técnico e Arquitetura
- **Modularização:** Cada preset gerado no site do shadcn será convertido em um arquivo `.ts` dentro de `resources/js/Themes/`.
- **Estrutura do Objeto:** Cada arquivo de tema exporta um `ThemePreset` com blocos `light` e `dark`, mapeando variáveis CSS (`--primary`, `--background`, etc.) em formato HSL.
- **Aplicação Dinâmica:** A store Pinia (`Stores/theme.ts`) lê o preset ativo e injeta as variáveis em `document.documentElement.style` via `setProperty`, eliminando seletores estáticos `:root`/`.dark` no CSS global.
- **Persistência:** Preferências de modo (`light` | `dark`) e preset ativo são salvas em `localStorage` sob a chave `precifica-theme`.

## 3. Presets Iniciais

| ID | Arquivo | Origem |
|---|---|---|
| `zinc` | `Themes/zinc.ts` | Paleta padrão Zinc do shadcn |
| `custom-orange` | `Themes/custom-orange.ts` | Preset shadcn `bIm515k` (vega + neutral + blue) |

> O código `bIm515k` decodifica para `style: vega`, `baseColor: neutral`, `theme: blue`. O arquivo mantém o nome `custom-orange` conforme convenção do projeto.

## 4. Estrutura de Arquivos

```text
resources/js/
├── Themes/
│   ├── index.ts              # Mapa centralizado de presets disponíveis
│   ├── zinc.ts               # Variáveis nativas do tema Zinc
│   └── custom-orange.ts      # Variáveis do preset shadcn bIm515k
├── Stores/
│   └── theme.ts              # Estado, localStorage e applyTheme()
├── types/
│   └── theme.ts              # ThemePreset, ThemeMode, ThemeVariables
└── Components/
    └── ThemeSelector.vue     # Seletor de preset e modo no AppLayout
```

## 5. Fluxo de Aplicação

1. `app.ts` inicializa a store e chama `initialize()` → `applyTheme()`.
2. `applyTheme()` alterna a classe `.dark` no `<html>` conforme `currentMode`.
3. Itera `THEME_CSS_VARIABLES` e aplica cada valor do preset ativo no modo corrente.
4. `ThemeSelector.vue` expõe botões shadcn para trocar preset e modo sem recarregar a página.

## 6. CSS Global

O `resources/css/app.css` mantém apenas:
- Diretivas Tailwind v4 (`@import`, `@source`, `@theme inline`).
- Mapeamento de tokens semânticos (`--color-primary: var(--primary)`).
- Estilos base (`body`, `border-border`).

Os valores concretos de cor **não** residem mais no CSS — são injetados em runtime pela store.
