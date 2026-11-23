---
name: tailwindcss-development
description: "Sempre acionar quando a mensagem do usuário incluir 'tailwind' de qualquer forma. Acione também para: construir layouts responsivos em grid (grids de cards em múltiplas colunas, grids de produtos), estruturas de página flex/grid (dashboards com barras laterais, topbars fixas, navegação com toggle mobile), estilizar componentes de UI (cards, tabelas, navbars, seções de preços, formulários, inputs, badges), adicionar variantes de modo escuro, corrigir espaçamento ou tipografia e trabalho com Tailwind v3/v4. Caso de uso principal: escrever ou corrigir classes utilitárias do Tailwind em templates HTML (Blade, JSX, Vue). Pule para lógica PHP de backend, consultas de banco, rotas de API, JavaScript sem componente HTML/CSS, auditorias de arquivos CSS, configuração de ferramenta de build e CSS puro."
license: MIT
metadata:
  author: laravel
---

# Desenvolvimento com Tailwind CSS

## Documentação

Use `search-docs` para padrões detalhados e documentação do Tailwind CSS v4.

## Uso básico

- Use classes do Tailwind CSS para estilizar HTML. Antes de introduzir novos padrões, verifique e siga as convenções de Tailwind já existentes no projeto.
- Ofereça extrair padrões repetidos para componentes que sigam as convenções do projeto, como componentes Blade, JSX ou Vue.
- Considere posicionamento, ordem, prioridade e padrões das classes. Remova classes redundantes, adicione classes aos elementos pai ou filho com cuidado para reduzir repetição e agrupe elementos logicamente.

## Especificidades do Tailwind CSS v4

- Use sempre Tailwind CSS v4 e evite utilitários descontinuados.
- `corePlugins` não é suportado no Tailwind v4.

### Configuração CSS-first

No Tailwind v4, você configura o Tailwind no CSS com a diretiva `@theme`. Você não precisa de um arquivo `tailwind.config.js` separado:

<!-- Configuração CSS-First -->
```css
@theme {
  --color-brand: oklch(0.72 0.11 178);
}
```

### Sintaxe de importação

No Tailwind v4, importe o Tailwind com uma declaração CSS `@import` comum em vez das diretivas `@tailwind` usadas na v3:

<!-- Sintaxe de Importação v4 -->
```diff
- @tailwind base;
- @tailwind components;
- @tailwind utilities;
+ @import "tailwindcss";
```

### Utilitários substituídos

O Tailwind v4 removeu utilitários descontinuados. Use as substituições mostradas abaixo. Para opacidade, remova a classe `*-opacity-*` e adicione o valor como modificador na cor existente: `bg-blue-500 bg-opacity-50` vira `bg-blue-500/50`, `text-white text-opacity-75` vira `text-white/75`.

| Descontinuado | Substituição |
|---------------|--------------|
| bg-opacity-* | bg-{color}/* |
| text-opacity-* | text-{color}/* |
| border-opacity-* | border-{color}/* |
| divide-opacity-* | divide-{color}/* |
| ring-opacity-* | ring-{color}/* |
| placeholder-opacity-* | placeholder-{color}/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |

## Espaçamento

Use utilitários `gap` em vez de margens para espaçamento entre irmãos:

<!-- Utilitários Gap -->
```html
<div class="flex gap-8">
    <div>Item 1</div>
    <div>Item 2</div>
</div>
```

## Modo escuro

Se as páginas e os componentes existentes suportarem modo escuro, novas páginas e componentes devem suportá-lo da mesma forma, normalmente usando a variante `dark:`:

<!-- Modo Escuro -->
```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    O conteúdo se adapta ao esquema de cores
</div>
```

## Armadilhas comuns

- Usar utilitários descontinuados da v3, como `bg-opacity-*` e `flex-shrink-*`
- Usar diretivas `@tailwind` em vez de `@import "tailwindcss"`
- Usar `tailwind.config.js` em vez da diretiva CSS `@theme`
- Usar margens para espaçamento entre irmãos em vez de utilitários `gap`
- Esquecer de adicionar variantes de modo escuro quando o projeto utiliza modo escuro
