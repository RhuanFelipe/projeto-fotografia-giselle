# Boas práticas de cache

## Use `Cache::remember()` para leituras cache-aside

`Cache::remember()` implementa uma leitura cache-aside sem uma verificação separada de veracidade (truthiness). Ele não impede que requisições concorrentes calculem o mesmo valor ausente. Quando você precisar evitar computação duplicada, use uma trava atômica.

A versão manual abaixo trata valores falsy válidos, como `false` ou `0`, como falhas de cache (cache misses).

Incorreto:

```php
$val = Cache::get('stats');
if (! $val) {
    $val = $this->computeStats();
    Cache::put('stats', $val, 60);
}
```

Correto:

```php
$val = Cache::remember('stats', 60, fn () => $this->computeStats());
```

## Considere `Cache::flexible()` para stale-while-revalidate

Para chaves lidas com frequência, `Cache::flexible()` pode servir dados obsoletos durante um período de obsolescência definido e registrar uma atualização adiada. Durante uma requisição HTTP, essa atualização normalmente ocorre após a resposta. A atualização não é um job em segundo plano durável. Após o término do período de obsolescência, a requisição recalcula o valor de forma síncrona.

Expiração síncrona:

```php
Cache::remember('users', 300, fn () => User::all());
```

Compromisso stale-while-revalidate:

```php
Cache::flexible('users', [300, 600], fn () => User::all());
```

Neste exemplo, o valor fica atualizado (fresh) por cinco minutos. O Laravel pode servir o valor obsoleto até dez minutos após ter sido armazenado em cache.

## Use `Cache::memo()` para evitar acessos redundantes em uma execução

Quando o código lê a mesma chave de cache repetidamente durante uma requisição ou job, `memo()` decora um armazenamento de cache e mantém os valores resolvidos em memória para essa execução.

```php
$settings = Cache::memo()->get('settings');
```

Leituras repetidas por meio do mesmo armazenamento memoizado evitam consultas adicionais ao armazenamento. Escritas por meio do armazenamento memoizado atualizam ou invalidam seus valores em memória conforme apropriado.

## Use tags de cache para invalidar grupos relacionados

As tags agrupam entradas relacionadas para invalidação sem rastrear cada chave. Os drivers `file`, `dynamodb` e `database` não suportam tags de cache. Confirme se um armazenamento suporta tags antes de escolhê-lo.

```php
Cache::tags(['user-1'])->flush();
```

## Use `Cache::add()` para escritas condicionais atômicas

`add()` grava atomicamente um valor somente quando a chave ainda não existe.

Incorreto:

```php
if (! Cache::has('lock')) {
    Cache::put('lock', true, 10);
}
```

Correto:

```php
Cache::add('lock', true, 10);
```

Quando você precisar de propriedade da trava e liberação segura, use `Cache::lock()` em vez de uma chave de cache comum.

## Use `once()` para memoização em processo

`once()` memoiza o valor de retorno de um callback para a requisição ou job atual. Chamadas feitas a partir de uma instância de objeto têm escopo limitado a essa instância. Diferentemente de `Cache::memo()`, `once()` não lê de um armazenamento de cache externo.

```php
public function roles(): Collection
{
    return once(fn () => $this->loadRoles());
}
```

Chamadas repetidas retornam o resultado memoizado sem executar o callback novamente. Use `once()` para computações repetidas dentro de uma única execução. Use `Cache::memo()` para memoizar o acesso a um armazenamento subjacente que também possa persistir valores entre execuções.

## Configure armazenamentos de cache de failover em produção

O driver de failover tenta cada armazenamento configurado em ordem quando uma operação de armazenamento lança uma exceção. Ele não consulta armazenamentos posteriores para uma falha de cache comum (cache miss) e não replica dados entre armazenamentos.

```php
'failover' => ['driver' => 'failover', 'stores' => ['redis', 'database']],
```
