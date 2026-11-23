# Boas práticas para consultas avançadas

## Selecione valores únicos de relacionamento com subconsultas

Quando precisar apenas de um único valor de um relacionamento has-many, considere uma subconsulta correlacionada com `addSelect()` em vez de carregar todo o relacionamento. A subconsulta seleciona o valor como parte da consulta principal, sem uma consulta adicional de relacionamento.

```php
public function scopeWithLastLoginAt($query): void
{
    $query->addSelect([
        'last_login_at' => Login::select('created_at')
            ->whereColumn('user_id', 'users.id')
            ->latest()
            ->take(1),
    ])->withCasts(['last_login_at' => 'datetime']);
}
```

## Crie relacionamentos dinâmicos com uma chave estrangeira de subconsulta

O mesmo padrão pode selecionar uma chave estrangeira e expor o modelo selecionado por meio de um relacionamento `belongsTo`. O carregamento antecipado (eager loading) desse relacionamento ainda executa uma consulta separada, mas o padrão evita carregar toda a coleção has-many.

```php
public function lastLogin(): BelongsTo
{
    return $this->belongsTo(Login::class, 'last_login_id');
}

public function scopeWithLastLogin($query): void
{
    $query->addSelect([
        'last_login_id' => Login::select('id')
            ->whereColumn('user_id', 'users.id')
            ->latest()
            ->take(1),
    ])->with('lastLogin');
}
```

## Combine contagens relacionadas com agregações condicionais

Use agregações condicionais para combinar várias contagens sobre o mesmo conjunto de dados filtrado em uma única consulta. Use `toBase()` quando precisar apenas de valores escalares e a hidratação de modelos não agregar nada. Confirme a sintaxe da expressão em relação ao mecanismo de banco de dados da aplicação.

```php
$statuses = Feature::toBase()
    ->selectRaw("count(case when status = 'Requested' then 1 end) as requested")
    ->selectRaw("count(case when status = 'Planned' then 1 end) as planned")
    ->selectRaw("count(case when status = 'Completed' then 1 end) as completed")
    ->first();
```

## Reutilize modelos pai carregados com `setRelation()`

Quando um pai e seus filhos já estiverem carregados e o código também acessar `$child->parent`, defina o relacionamento inverso para a instância pai existente. Definir o relacionamento inverso evita uma consulta extra de carregamento preguiçoso (lazy loading) para cada filho.

```php
$feature->load('comments.user');
$feature->comments->each->setRelation('feature', $feature);
```

## Compare `whereHas()` com uma subconsulta `IN`

`whereHas()` normalmente produz uma subconsulta `EXISTS`, enquanto `whereIn()` pode expressar o mesmo filtro com uma subconsulta `IN`. Qualquer uma das formas pode ser mais rápida, dependendo do mecanismo de banco de dados, índices, cardinalidade e plano de consulta. Meça ambas as formas com dados representativos. Nenhuma das subconsultas carrega seu conjunto de resultados na memória do PHP.

Opção usando `EXISTS`:

```php
$query->whereHas('company', fn ($q) => $q->where('name', 'like', $term));
```

Opção usando `IN`:

```php
$query->whereIn('company_id', Company::where('name', 'like', $term)->select('id'));
```

## Compare duas consultas simples contra uma consulta complexa

Duas consultas direcionadas podem superar uma subconsulta correlacionada complexa ou um join quando a primeira consulta é altamente seletiva. Elas também adicionam uma viagem de ida e volta (round trip) ao banco de dados, podem transferir uma grande lista de identificadores e não fornecem um snapshot de consistência de consulta única. Decida com base nos planos de consulta e em medições semelhantes às de produção.

## Projete índices compostos para a consulta

Para ordenações comuns com múltiplas colunas, considere um índice composto cuja ordem das colunas dê suporte aos filtros e à ordenação da consulta. Os mecanismos de banco de dados podem combinar índices ou escolher uma ordenação explícita, portanto, apenas corresponder à lista do `ORDER BY` não garante que o mecanismo usará o índice. Verifique o plano de consulta.

```php
// Migration
$table->index(['last_name', 'first_name']);

// Query that this index may support
User::query()->orderBy('last_name')->orderBy('first_name')->paginate();
```

## Considere uma subconsulta correlacionada para ordenação has-many

Ao ordenar por um valor de um relacionamento has-many, um join direto pode duplicar linhas pai, a menos que primeiro reduza a tabela relacionada a uma linha por pai. Uma subconsulta correlacionada em `orderBy()` costuma ser mais simples, mas seu desempenho depende do plano de consulta e dos índices de suporte.

```php
public function scopeOrderByLastLogin($query): void
{
    $query->orderByDesc(Login::select('created_at')
        ->whereColumn('user_id', 'users.id')
        ->latest()
        ->take(1)
    );
}
```
