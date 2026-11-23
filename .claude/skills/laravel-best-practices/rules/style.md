# Boas práticas de convenção e estilo

## Siga as convenções de nomenclatura do projeto

Prefira as convenções do Laravel em código novo, mas preserve uma convenção estabelecida do projeto a menos que uma renomeação coordenada valha a pena.

| Elemento | Convenção | Exemplo |
| --- | --- | --- |
| Controller | Nome do recurso no singular | `ArticleController` |
| Model | StudlyCase no singular | `User` |
| Tabela | snake_case no plural | `article_comments` |
| Tabela pivô | Nomes dos models no singular em ordem alfabética, em snake_case | `article_user` |
| Coluna | snake_case | `meta_title` |
| Chave estrangeira convencional | Nome do model no singular mais `_id`, em snake_case | `article_id` |
| URI de recurso | Recurso no plural | `articles/1` |
| Nome de rota | Segmentos separados por ponto, com snake_case dentro de um segmento quando necessário | `users.show_active` |
| Método | camelCase | `getAll` |
| Variável | camelCase | `$articlesWithAuthor` |
| Coleção | Descritiva e no plural | `$activeUsers` |
| Objeto | Descritivo e no singular | `$activeUser` |
| View | kebab-case | `show-filtered.blade.php` |
| Arquivo de configuração | snake_case | `google_calendar.php` |
| Enumeração | StudlyCase no singular | `UserType` |

## Prefira sintaxe clara e idiomática

Use helpers e métodos de consulta do Laravel quando eles comunicarem a intenção mais diretamente. Não encurte o código quando o resultado for ambíguo ou perder informações úteis de tipo.

| Mais verboso | Alternativa idiomática |
| --- | --- |
| `Session::get('cart')` | `session('cart')` |
| `$request->session()->get('cart')` | `session('cart')` |
| `return Redirect::back()` | `return back()` |
| `Carbon::now()` | `now()` |
| `->where('column', '=', 1)` | `->where('column', 1)` |
| `->orderBy('created_at', 'desc')` | `->latest()` |
| `->orderBy('created_at', 'asc')` | `->oldest()` |
| `->first()?->name` | `->value('name')` quando apenas esse valor for necessário |

Use acessores de requisição tipados como `$request->string()`, `$request->integer()` e `$request->boolean()` quando sua coerção corresponder à operação.

## Use utilitários quando eles esclarecerem a intenção

Os utilitários `Str`, `Arr`, `Number` e `Uri` do Laravel fornecem operações expressivas e comportamento consistente com o framework. Prefira-os quando forem mais claros ou mais seguros do que uma operação equivalente do PHP, não como substituição para toda função nativa.

```php
$slug = Str::slug($title);
$short = Str::limit($text, 100);
$class = class_basename(User::class);
$result = Str::of($input)->trim()->replace('_', '-')->lower();
```

Use `Arr` para notação de ponto (dot notation) e transformações comuns:

```php
$name = Arr::get($array, 'user.name', 'default');
$public = Arr::only($attributes, ['name', 'email']);
```

Use `Number` para formatação de exibição localizada, não para valores que você armazena ou calcula:

```php
Number::format(1000000);
Number::currency(1500, 'USD');
Number::fileSize(1024 * 1024);
```

Use `Uri` quando uma API estruturada ajudar você a construir ou transformar um uniform resource identifier (URI):

```php
$uri = Uri::of('https://example.com/search')
    ->withQuery(['q' => 'laravel', 'page' => 1]);
```

Antes de usar classes ou métodos utilitários mais recentes, verifique a documentação para a versão do Laravel do projeto.

## Mantenha o código de apresentação sustentável

Prefira o pipeline de assets, os componentes e as convenções existentes do projeto para JavaScript e Cascading Style Sheets (CSS) substanciais. Pequenos scripts ou estilos específicos de página podem ser razoáveis em layouts Blade ou stacks. Evite misturar grandes blocos de comportamento e estilo nos templates.

Passe dados do servidor com uma codificação adequada ao seu contexto. Por exemplo, `Js::from()` do Blade formata dados com segurança para JavaScript:

```blade
<script>
    const article = {{ Js::from($article) }};
</script>
```

Atributos `data-*` são úteis para pequenos valores escalares, mas serializar um model grande em um atributo pode expor campos desnecessários e complicar o escape.

## Escreva comentários que expliquem o porquê

Prefira nomes claros e pequenas unidades de código em vez de comentários que apenas repetem uma operação. Adicione comentários concisos para restrições não óbvias, compromissos (tradeoffs), soluções alternativas, expressões regulares ou comportamento externo que o código não consegue expressar por si só. Mantenha os comentários precisos quando o comportamento mudar.

Pouco útil:

```php
// Check whether the query has joins.
if (count((array) $builder->getQuery()->joins) > 0) {
    // ...
}
```

Mais claro:

```php
if ($this->hasJoins()) {
    // ...
}
```
