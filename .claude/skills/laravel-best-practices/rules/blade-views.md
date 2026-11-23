# Boas práticas para Blade e views

## Use `$attributes->merge()` em templates de componentes

Use o attribute bag do componente para que os chamadores possam adicionar atributos. `merge()` combina atributos padrão com os valores fornecidos pelo chamador. Os valores de classe recebem um comportamento especial de mesclagem.

```blade
<div {{ $attributes->merge(['class' => 'alert alert-'.$type]) }}>
    {{ $message }}
</div>
```

## Use `@pushOnce` para scripts por componente

Se um componente for renderizado repetidamente, `@push` adiciona seu script a cada renderização. Use um bloco `@pushOnce` nomeado de forma consistente para adicionar esse conteúdo apenas uma vez por resposta renderizada.

## Prefira componentes para interfaces explícitas

Use um componente Blade quando uma interface reutilizável se beneficiar de props explícitas, um attribute bag ou slots. Um include ainda é adequado para um pequeno partial que intencionalmente usa os dados da view atual. Passe um array de dados explícito quando o compartilhamento implícito de variáveis ocultar as dependências do partial.

## Compartilhe dados de view compatíveis com um view composer

Use um view composer para centralizar os dados de que uma ou mais views Blade nomeadas precisam sempre que o Laravel as renderiza. Mantenha o composer compatível com cada view que ele atende e evite curingas (wildcards) amplos quando as views exigirem formatos de dados diferentes. Um view composer é executado quando o Laravel renderiza a view correspondente. Ele não fornece dados para respostas JSON, streamed ou outras respostas que não sejam de view.

## Retorne fragmentos Blade para renderização parcial

Uma rota pode retornar uma view completa ou um fragmento nomeado para clientes como htmx ou Turbo.

```php
return view('dashboard', compact('users'))
    ->fragmentIf($request->hasHeader('HX-Request'), 'user-list');
```

## Compartilhe props de componentes pai com `@aware`

Use `@aware` quando um componente aninhado precisar de uma prop passada explicitamente para um componente ancestral. `@aware` não expõe o valor padrão de uma prop de um ancestral, a menos que esse valor tenha sido passado pelo attribute bag.
