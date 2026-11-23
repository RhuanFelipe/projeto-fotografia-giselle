# Boas práticas de tratamento de erros

## Escolha onde reportar e renderizar exceções

O Laravel suporta métodos específicos na exceção e callbacks centralizados no handler. Siga o padrão que o projeto já utiliza.

Métodos na exceção mantêm o comportamento próximo à definição da exceção:

```php
class InvalidOrderException extends Exception
{
    public function report(): void
    {
        // Send the exception to a custom reporter.
    }

    public function render(Request $request): Response
    {
        return response()->view('errors.invalid-order', status: 422);
    }
}
```

Callbacks centralizados em `bootstrap/app.php` mantêm junta a política de exceções da aplicação:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->report(function (InvalidOrderException $e) {
        // Send the exception to a custom reporter.
    });
    $exceptions->render(function (InvalidOrderException $e, Request $request) {
        return response()->view('errors.invalid-order', status: 422);
    });
})
```

O método `report()` de uma exceção suprime o reporte padrão do Laravel, a menos que retorne `false`. Um callback de reporte permite o reporte padrão, a menos que retorne `false` ou seja encadeado com `stop()`. Use `ShouldntReport` ou `dontReport()` quando o handler não deve reportar uma exceção de forma alguma. Em contrapartida, retornar `false` de um método `render()` ou callback de renderização delega para a renderização padrão do Laravel.

## Marque exceções que o handler não deve reportar

Implementar `ShouldntReport` impede que o handler de exceções do Laravel reporte esse tipo de exceção e mantém a política visível na classe. Isso não impede que o código da aplicação registre a exceção no log explicitamente.

```php
class PodcastProcessingException extends Exception implements ShouldntReport {}
```

## Limite reportes de exceções de alto volume

Uma integração com falha pode inundar logs ou ferramentas de rastreamento de erros. Configure `throttle()` com um resultado `Lottery` ou `Limit` para amostrar ou limitar a taxa de reportes de exceções correspondentes. Escolha chaves deliberadamente quando classes de exceção, tenants ou integrações separadas precisarem de limites independentes.

## Previna reportes duplicados de uma mesma instância de exceção

Habilite `dontReportDuplicates()` quando o mesmo objeto de exceção puder passar por múltiplas chamadas `report($exception)`. Ele desduplica pela identidade do objeto, não pela classe ou mensagem da exceção.

## Defina renderização JSON para rotas de API

Por padrão, o Laravel usa negociação de conteúdo da requisição para decidir se renderiza uma exceção como JSON. Se o contrato da API da aplicação exigir JSON independentemente do cabeçalho `Accept`, defina essa política explicitamente para as rotas relevantes.

```php
$exceptions->shouldRenderJsonWhen(function (Request $request, Throwable $e) {
    return $request->is('api/*') || $request->expectsJson();
});
```

## Adicione contexto às classes de exceção

Anexe dados estruturados a uma exceção por meio de `context()`. O Laravel mescla esses dados no contexto de log da exceção quando o handler a reporta.

```php
class InvalidOrderException extends Exception
{
    public function context(): array
    {
        return ['order_id' => $this->orderId];
    }
}
```
