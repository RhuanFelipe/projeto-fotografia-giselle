# Boas práticas do cliente HTTP

## Defina timeouts explícitos

O cliente HTTP do Laravel possui um timeout de resposta de 30 segundos por padrão. Escolha timeouts de resposta e de conexão adequados ao serviço e à requisição ou job chamador. Tentativas de reenvio (retries) podem multiplicar o tempo total decorrido.

Menos resiliente:

```php
$response = Http::get('https://api.example.com/users');
```

Preferível:

```php
$response = Http::connectTimeout(3)
    ->timeout(5)
    ->get('https://api.example.com/users');
```

Defina configurações compartilhadas em uma macro ou em um cliente dedicado:

```php
Http::macro('github', function () {
    return Http::baseUrl('https://api.github.com')
        ->connectTimeout(3)
        ->timeout(10)
        ->withToken(config('services.github.token'));
});

$response = Http::github()->get('/repos/laravel/framework');
```

## Reenvie apenas operações seguras

Reenvie falhas transitórias de conexão, respostas de limite de taxa (rate-limit) e erros de servidor com um atraso apropriado. Reenvie requisições idempotentes, como `GET`, quando a operação puder ser executada com segurança mais de uma vez. Reenvie uma requisição que altera estado apenas quando a API remota suportar uma chave de idempotência ou fornecer proteção equivalente contra duplicidade.

Inseguro sem garantia de idempotência:

```php
$response = Http::retry([100, 500, 1000])
    ->post('https://api.example.com/v1/charges', $data);
```

Seguro para uma requisição idempotente:

```php
$response = Http::connectTimeout(3)
    ->timeout(10)
    ->retry([100, 500, 1000], 0, function (Throwable $exception) {
        return $exception instanceof ConnectionException
            || ($exception instanceof RequestException
                && ($exception->response->serverError() || $exception->response->status() === 429));
    })
    ->get('https://api.example.com/data');
```

Para uma API que altera estado com suporte a idempotência, envie uma chave de idempotência estável em todas as tentativas:

```php
$response = Http::withHeaders(['Idempotency-Key' => $paymentAttempt->uuid])
    ->connectTimeout(3)
    ->timeout(10)
    ->retry([100, 500, 1000], 0, function (Throwable $exception) {
        return $exception instanceof ConnectionException
            || ($exception instanceof RequestException
                && ($exception->response->serverError() || $exception->response->status() === 429));
    })
    ->post('https://api.example.com/v1/charges', $data);
```

## Trate erros explicitamente

Por padrão, o cliente HTTP retorna respostas para códigos de status `4xx` e `5xx` em vez de lançar exceções. Inspecione os status esperados ou chame `throw()` antes de consumir um payload de sucesso.

Inseguro quando um payload de sucesso é esperado:

```php
$user = Http::get('https://api.example.com/users/1')->json();
```

Preferível:

```php
$user = Http::connectTimeout(3)
    ->timeout(5)
    ->get('https://api.example.com/users/1')
    ->throw()
    ->json();
```

Quando for necessária degradação graciosa, trate alternativas esperadas explicitamente:

```php
$response = Http::connectTimeout(3)
    ->timeout(5)
    ->get('https://api.example.com/users/1');

if ($response->successful()) {
    return $response->json();
}

if ($response->notFound()) {
    return null;
}

$response->throw();
```

## Agrupe requisições independentes com pool

Use `Http::pool()` quando várias requisições independentes puderem ser executadas simultaneamente. O pooling altera o tempo de execução, não o tratamento de erros. Inspecione ou chame `throw()` para cada resposta conforme necessário.

```php
use Illuminate\Http\Client\Pool;

$responses = Http::pool(fn (Pool $pool) => [
    $pool->as('users')->connectTimeout(3)->timeout(5)
        ->get('https://api.example.com/users'),
    $pool->as('posts')->connectTimeout(3)->timeout(5)
        ->get('https://api.example.com/posts'),
]);

$users = $responses['users']->throw()->json();
$posts = $responses['posts']->throw()->json();
```

## Simule requisições HTTP em testes

Use `Http::fake()` para integrações externas e use `Http::preventStrayRequests()` quando uma requisição real inesperada dever falhar o teste. Teste também timeouts, falhas de conexão e respostas de erro que a aplicação trata.

```php
it('syncs a user from the API', function () {
    Http::preventStrayRequests();

    Http::fake([
        'api.example.com/users/1' => Http::response([
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]),
    ]);

    (new UserSyncService)->sync(1);

    Http::assertSent(fn (Request $request) =>
        $request->url() === 'https://api.example.com/users/1'
    );
});
```

Por exemplo, para testar o caminho de falha da integração, simule uma falha de conexão:

```php
Http::fake([
    'api.example.com/*' => Http::failedConnection(),
]);
```
