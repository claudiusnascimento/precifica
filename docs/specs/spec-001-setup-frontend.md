# Spec 001: Configuração do Ecossistema Frontend (Vue 3 + TypeScript + Tailwind + shadcn)

## 1. Objetivo
Estabelecer a base do front-end da aplicação "Precifica" como um Single Page Application (SPA) dentro da estrutura do Laravel, configurando TypeScript estrito, Tailwind CSS e a biblioteca de componentes primitivos shadcn-vue.

## 2. Contexto Técnico
- **Framework base:** Vue 3 (Composition API com `<script setup>`).
- **Linguagem:** TypeScript (Modo estrito para garantir tipagem em toda a camada de consumo da API).
- **Estilização:** Tailwind CSS (Base para os tokens de design do shadcn).
- **Componentes:** `shadcn-vue` (primitivos baseados em `radix-vue`).
- **Build Tool:** Vite (integrado nativamente com o plugin do Laravel).

## 3. Requisitos de Arquitetura (Frontend)
- Toda a lógica de estado e interface deve residir em `resources/js/`.
- Os aliases de caminhos do TypeScript/Vite devem apontar `@/*` diretamente para `resources/js/*`.
- Os componentes do shadcn devem ser injetados exclusivamente em `resources/js/Components/ui/`.
- O roteamento inicial do SPA deve estar preparado para interceptar as rotas web, deixando as rotas `/api/*` livres para o Laravel.

## 4. Estrutura de Arquivos Alvo
```text
resources/js/
├── Components/
│   └── ui/                   # Componentes purificados do shadcn
├── Composables/              # Hooks reutilizáveis (requisições, etc.)
├── Pages/                    # Visualizações/Telas do SPA
├── types/                    # Interfaces globais TypeScript
├── App.vue                   # Componente raiz do SPA
├── app.ts                    # Inicialização do Vue 3
└── lib/
    └── utils.ts              # Utilitário cn() do shadcn (clsx + tailwind-merge)
