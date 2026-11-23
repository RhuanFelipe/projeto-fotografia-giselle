# Boas práticas de Eloquent

## Defina tipos de relacionamento precisos

Defina o relacionamento que corresponde à associação do banco de dados e declare seu tipo de retorno concreto.

```php
public function comments(): HasMany
{
    return $this->hasMany(Comment::class);
}

public function author(): BelongsTo
{
    return $this->belongsTo(User::class, 'user_id');
}
```

## Use escopos locais para consultas reutilizáveis

Extraia restrições de consulta reutilizáveis para escopos locais para evitar duplicação.

Restrições duplicadas:

```php
$active = User::where('verified', true)->whereNotNull('activated_at')->get();
$articles = Article::whereHas('user', function ($q) {
    $q->where('verified', true)->whereNotNull('activated_at');
})->get();
```

Escopo local reutilizável:

```php
#[Scope]
protected function active(Builder $query): Builder
{
    return $query->where('verified', true)->whereNotNull('activated_at');
}

// Usage
$active = User::active()->get();
$articles = Article::whereHas('user', fn ($q) => $q->active())->get();
```

## Aplique escopos globais com moderação

Um escopo global modifica silenciosamente cada consulta no modelo, tornando as consultas difíceis de depurar. Prefira escopos locais e reserve escopos globais para restrições universais, como soft deletes ou multi-tenancy.

Contrapartida do escopo global:

```php
class PublishedScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('published', true);
    }
}

// Admin panels, reports, and jobs now omit drafts unless the scope is removed.
```

Escopo local explícito:

```php
#[Scope]
protected function published(Builder $query): Builder
{
    return $query->where('published', true);
}

Post::published()->paginate(); // Explicit
Post::paginate(); // Admin sees all
```

## Defina casts de atributos

Use o método `casts()` para conversão automática de tipos. Se a convenção do projeto for a propriedade `$casts`, siga essa convenção.

```php
protected function casts(): array
{
    return [
        'is_active' => 'boolean',
        'metadata' => 'array',
        'total' => 'decimal:2',
    ];
}
```

## Faça cast de atributos de data e hora

Faça cast de um atributo de data ou timestamp quando o código da aplicação precisar tratá-lo como uma instância de Carbon. O Eloquent já faz cast dos timestamps convencionais `created_at` e `updated_at`.

Parsing manual no template:

```blade
{{ Carbon::parse($order->ordered_at)->toDateString() }}
```

Cast no modelo:

```php
protected function casts(): array
{
    return [
        'ordered_at' => 'datetime',
    ];
}
```

```blade
{{ $order->ordered_at->toDateString() }}
{{ $order->ordered_at->format('m-d') }}
```

## Use `whereBelongsTo()` para consultas de relacionamento

`whereBelongsTo()` expressa a restrição de relacionamento sem nomear sua chave estrangeira.

Restrição por chave estrangeira:

```php
Post::where('user_id', $user->id)->get();
```

Restrição baseada no relacionamento:

```php
Post::whereBelongsTo($user)->get();
Post::whereBelongsTo($user, 'author')->get();
```

## Mantenha consultas da aplicação conscientes do modelo

Prefira modelos Eloquent e relacionamentos para consultas da aplicação baseadas em modelos. Eles preservam casts, escopos e a configuração da tabela do modelo. O query builder e o SQL bruto exigem nomes de tabelas. Use-os quando você realmente precisar do comportamento de nível mais baixo.

Alternativas de nível mais baixo:

```php
DB::table('users')->where('active', true)->get();

$query->join('companies', 'companies.id', '=', 'users.company_id');

DB::select('SELECT * FROM orders WHERE status = ?', ['pending']);
```

Consultas conscientes do modelo:

```php
User::where('active', true)->get();
Order::where('status', 'pending')->get();
```

Quando uma operação do query builder precisar seguir o nome de tabela configurado de um modelo, use `(new User)->getTable()`. Para joins complexos ou SQL bruto, nomes explícitos de tabelas podem ser mais claros. Quando o schema puder mudar, cubra essas referências de tabela com testes.

Em migrations, use nomes explícitos de tabelas em vez de modelos da aplicação. Migrations são registros históricos, mas modelos e seus escopos podem mudar depois que você fizer o deploy de uma migration.
