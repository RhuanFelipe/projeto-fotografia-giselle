# Boas práticas de filas e jobs

## Mantenha o tempo de reserva maior que o tempo de execução

Para drivers de fila que usam a configuração `retry_after` do Laravel, configure-a para exceder o maior timeout de worker ou job por uma margem de segurança. Quando uma reserva expira, outro worker pode reservar o mesmo job enquanto o primeiro processo ainda está em execução. Mantenha o `--timeout` do worker vários segundos menor que `retry_after`.

```php
// Job
public $timeout = 120;

// config/queue.php for the connection
'retry_after' => 150,
```

O Amazon Simple Queue Service (SQS) usa seu próprio visibility timeout em vez do `retry_after` do Laravel. Configure esse timeout no nível da fila. Como os workers também podem parar após efeitos colaterais, mas antes de confirmar um job, torne jobs importantes idempotentes mesmo com configurações de timeout corretas.

## Aplique backoff em falhas transitórias

Use atrasos progressivamente maiores quando uma dependência precisar de tempo para se recuperar. Não tente novamente falhas permanentes de validação ou de regra de negócio.

```php
class SyncWithStripe implements ShouldQueue
{
    public $tries = 4;

    public $backoff = [1, 5, 10];
}
```

Middlewares de limitação de taxa (rate-limiting) e de controle de exceções (exception-throttling) podem liberar jobs de volta para a fila. Tentativas liberadas ainda podem contar para o limite máximo de tentativas, portanto configure `$tries` ou `retryUntil()` para permitir a janela de novas tentativas pretendida.

## Use jobs únicos para deduplicação de despachos

Implemente `ShouldBeUnique` quando apenas uma instância na fila de um job lógico dever existir. A unicidade usa um bloqueio de cache (cache lock). Ela não substitui o processamento idempotente nem uma restrição de banco de dados.

```php
class GenerateInvoice implements ShouldQueue, ShouldBeUnique
{
    public $uniqueFor = 3600;

    public function uniqueId(): string
    {
        return (string) $this->order->id;
    }
}
```

Todos os processos que despacham jobs devem usar um cache compartilhado que suporte bloqueios. Restrições de job único não se aplicam a jobs dentro de lotes (batches).

Use `ShouldBeUniqueUntilProcessing` apenas quando o bloqueio dever ser liberado imediatamente antes do início do processamento. Outra instância pode então ser despachada enquanto a primeira está em execução:

```php
class UpdateSearchIndex implements ShouldQueue, ShouldBeUniqueUntilProcessing
{
    // ...
}
```

## Trate falhas terminais quando necessário

Implemente `failed()` quando a aplicação precisar atualizar estado, alertar um operador ou registrar contexto específico do domínio após todas as tentativas se esgotarem. Registrar todas as falhas em cada job pode duplicar o relatório de falhas do sistema de filas.

O Laravel invoca `failed()` em uma nova instância do job, portanto alterações feitas no job durante `handle()` não estarão disponíveis em `failed()`.

```php
public function failed(?Throwable $exception): void
{
    $this->podcast->update(['status' => 'failed']);

    Log::error('Podcast processing failed', [
        'podcast_id' => $this->podcast->id,
        'exception' => $exception,
    ]);
}
```

## Limite a taxa de chamadas externas

Use middlewares de fila como `RateLimited` quando jobs compartilharem uma cota de API de terceiros. Defina o limitador nomeado e escolha os atrasos de liberação e os limites de tentativas em conjunto.

```php
public function middleware(): array
{
    return [new RateLimited('external-api')];
}
```

## Agrupe jobs em lote para coordenação de grupo

Use `Bus::batch()` para monitorar um grupo de jobs e executar callbacks quando o lote for concluído ou encontrar falhas. Um lote não é uma transação de banco de dados. O Laravel não reverte jobs concluídos quando outro job falha. Por padrão, um job com falha cancela o lote. Chame `allowFailures()` apenas quando falha parcial for aceitável.

```php
Bus::batch([
    new ImportCsvChunk($chunk1),
    new ImportCsvChunk($chunk2),
])
    ->then(fn (Batch $batch) => Notification::send($user, new ImportComplete))
    ->catch(fn (Batch $batch, Throwable $exception) => Log::error('Import batch failed', [
        'exception' => $exception,
    ]))
    ->dispatch();
```

## Configure limites de novas tentativas baseados em tempo deliberadamente

Use `retryUntil()` como alternativa baseada em tempo para uma contagem máxima de tentativas. O Laravel pode tentar executar o job quantas vezes forem necessárias até esse prazo limite, sujeito a outras condições de falha, como o máximo de exceções. `retryUntil()` tem precedência sobre limites baseados em tentativas, então você não precisa definir `$tries = 0`.

```php
public function retryUntil(): DateTimeInterface
{
    return now()->addHours(4);
}
```

## Use o Horizon para operações de fila com Redis

O Laravel Horizon fornece monitoramento, balanceamento, métricas e configuração de supervisor para filas Redis. Ele não oferece suporte a drivers de fila que não sejam Redis.
