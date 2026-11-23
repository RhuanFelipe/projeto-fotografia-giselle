# Boas práticas de eventos e notificações

## Confie na descoberta de eventos

O Laravel descobre listeners nos diretórios de listeners configurados inspecionando argumentos de eventos com type-hint nos métodos `handle()` ou `__invoke()`. Registre listeners manualmente apenas quando a descoberta estiver desabilitada, o listener estiver fora desses diretórios ou o registro explícito for mais claro.

## Faça cache da descoberta de eventos no deploy em produção

Faça cache dos listeners descobertos durante o deploy em produção com `php artisan optimize` ou `php artisan event:cache`. Reconstrua o cache sempre que as definições de listeners mudarem.

## Use `ShouldDispatchAfterCommit` dentro de transações

Quando você dispara um evento dentro de uma transação de banco de dados, `ShouldDispatchAfterCommit` atrasa o disparo até que todas as transações abertas sejam confirmadas (commit). Se uma transação sofrer rollback, o Laravel descarta o evento. O atraso afeta listeners síncronos e em fila. Não se limita ao agendamento de filas.

```php
class OrderShipped implements ShouldDispatchAfterCommit {}
```

## Coloque notificações lentas na fila

Coloque na fila notificações que chamam serviços externos, como e-mail, mensagens de texto ou Slack, quando elas não precisarem ser concluídas antes da resposta. Mantenha uma notificação síncrona quando a conclusão imediata ou o retorno de falha fizer parte da operação.

```php
class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;
}
```

## Dispare notificações em fila após o commit

Uma notificação em fila enviada dentro de uma transação de banco de dados pode ser executada antes que a transação seja confirmada. Chame `afterCommit()` na notificação em fila, ou habilite a opção `after_commit` da conexão de fila, quando sua entrega depender de dados confirmados. Nenhuma das opções tem efeito de agendamento em uma notificação síncrona.

```php
$user->notify((new InvoicePaid($invoice))->afterCommit());
```

## Direcione canais de notificação para filas dedicadas

Diferentes canais de notificação podem ter diferentes requisitos de latência e prioridade. Implemente `viaQueues()` quando os canais precisarem usar filas separadas.

## Use notificações sob demanda para destinatários que não são usuários

Evite criar modelos fictícios para enviar notificações para endereços arbitrários.

```php
Notification::route('mail', 'admin@example.com')->notify(new SystemAlert());
```

## Implemente `HasLocalePreference` em modelos notificáveis

Implemente `HasLocalePreference::preferredLocale()` em um modelo notificável quando notificações e mailables precisarem usar o idioma (locale) do destinatário. O Laravel também preserva esse locale para entregas em fila. Uma chamada explícita a `locale()` ainda pode sobrescrever a preferência para uma notificação individual.
