# Boas práticas de envio de e-mails

## Coloque envios de e-mail lentos na fila

Implemente `ShouldQueue` em um mailable quando a entrega normalmente precisar acontecer em segundo plano. O Laravel coloca esse mailable na fila mesmo quando o ponto de chamada usa `Mail::send()`.

```php
class OrderShipped extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;
}
```

Mantenha o envio de e-mail síncrono quando o chamador precisar saber imediatamente se a entrega foi aceita ou quando nenhum worker de fila estiver disponível.

## Dispare e-mails em fila após o commit

Um worker de fila pode processar um mailable em fila disparado durante uma transação de banco de dados antes que a transação seja confirmada. Chame `afterCommit()` no mailable, ou habilite a opção `after_commit` da conexão de fila, quando o e-mail depender de registros confirmados.

```php
Mail::to($user)->send(
    (new OrderShipped($order))->afterCommit()
);
```

Se a transação sofrer rollback, o Laravel não dispara um mailable configurado para após o commit. A configuração de after-commit afeta apenas e-mails em fila. Ela não adia entregas síncronas.

## Valide o modo de entrega nos testes

Use `Mail::assertQueued()` para mailables em fila e `Mail::assertSent()` para mailables enviados de forma síncrona.

Incorreto para um mailable que implementa `ShouldQueue`:

```php
Mail::assertSent(OrderShipped::class);
```

Correto:

```php
Mail::assertQueued(OrderShipped::class);
```

## Use mailables Markdown quando forem adequados

Mailables Markdown renderizam versões em HTML e texto plano a partir dos componentes de e-mail do Laravel e suportam temas publicáveis. Eles são ideais para mensagens transacionais convencionais. Um par personalizado de HTML e texto pode atender melhor a um design especializado.

```bash
php artisan make:mail OrderShipped --markdown=mail.orders.shipped
```

## Separe testes de conteúdo e de entrega

Teste o conteúdo renderizado instanciando o mailable e usando asserções como `assertSeeInHtml()` e `assertSeeInText()`. Teste a entrega separadamente com `Mail::fake()` e `assertSent()` ou `assertQueued()` para que as falhas identifiquem claramente o comportamento afetado.
