# Boas práticas para collections

## Use higher-order messages para operações simples

Closure explícita:

```php
$users->each(function (User $user) {
    $user->markAsVip();
});
```

Equivalente conciso:

```php
$users->each->markAsVip();
```

Higher-order messages funcionam com métodos de collection suportados, como `each`, `map`, `filter` e `sum`. Use uma closure explícita quando argumentos ou lógica não trivial ficarem mais claros.

## Escolha entre `cursor()` e `lazy()`

`cursor()` executa uma consulta e hidrata um modelo por vez, mas não consegue fazer carregamento antecipado (eager loading) de relacionamentos. O buffer de resultados do driver de banco de dados ainda pode usar muita memória para resultados muito grandes. Use-o para iteração apenas de atributos com baixo consumo de memória quando uma consulta de longa duração for aceitável.

`lazy()` executa múltiplas consultas em blocos (chunked) e retorna uma `LazyCollection` plana. Ele suporta carregamento antecipado de relacionamentos para cada bloco e evita manter um único cursor de banco de dados aberto durante toda a iteração.

Com relacionamentos:

```php
User::with('roles')->lazy()->each(function (User $user) {
    // The roles for this chunk have been eager loaded.
});
```

Sem relacionamentos:

```php
User::cursor()->each(function (User $user) {
    // Process model attributes.
});
```

## Use `lazyById()` ao atualizar registros durante a iteração

`lazy()` usa paginação por offset, portanto, atualizar uma coluna que afeta a consulta pode deslocar linhas e fazer com que a iteração pule registros ou os processe duas vezes. `lazyById()` pagina por uma chave monotônica e é mais seguro quando você atualiza outras colunas durante a iteração. Não altere a própria chave de paginação enquanto estiver iterando.

## Use `toQuery()` para operações em lote em collections

Use `toQuery()` para construir uma consulta a partir dos modelos em uma collection Eloquent em vez de construir manualmente uma cláusula `whereIn`.

Consulta manual:

```php
User::whereIn('id', $users->modelKeys())->update(['active' => false]);
```

Consulta via collection:

```php
$users->toQuery()->update(['active' => false]);
```

`toQuery()` requer uma collection Eloquent não vazia cujos modelos sejam do mesmo tipo. Assim como outras atualizações em lote do Eloquent, ela não dispara eventos de atualização por modelo, portanto, use-a apenas quando não precisar desses eventos.

## Use `#[CollectedBy]` para classes de collection personalizadas

O atributo `#[CollectedBy]` declara a classe de collection personalizada sem exigir a sobrescrita de `newCollection()`.

```php
#[CollectedBy(UserCollection::class)]
class User extends Model {}
```
