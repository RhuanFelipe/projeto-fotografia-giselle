# Boas práticas de agendamento de tarefas

## Evite sobreposições indesejadas

Use `withoutOverlapping()` quando uma segunda execução não puder começar enquanto a execução anterior mantiver o bloqueio. Use-o para tarefas de duração variável que não são seguras para execução simultânea.

```php
Schedule::command('reports:generate')
    ->everyFifteenMinutes()
    ->withoutOverlapping(30);
```

O valor opcional é o tempo de expiração do bloqueio em minutos, não o timeout da tarefa. Escolha o valor com cuidado. O padrão é 24 horas, e uma expiração muito curta pode permitir sobreposição enquanto a primeira tarefa ainda estiver em execução. Limpe bloqueios obsoletos com `php artisan schedule:clear-cache`. A própria tarefa ainda deve tolerar novas tentativas e execução parcial sempre que prático.

## Execute uma tarefa em apenas um servidor

Use `onOneServer()` quando apenas um nó agendador dever executar uma tarefa elegível. Os nós agendadores devem usar o mesmo cache store padrão, e esse store deve suportar bloqueios atômicos (atomic locks). Stores suportados incluem `database`, `memcached`, `dynamodb` e `redis`.

```php
Schedule::command('billing:charge')->daily()->onOneServer();
```

Nomeie closures agendadas antes de aplicar `onOneServer()`, especialmente ao agendar a mesma closure com parâmetros diferentes, para que cada tarefa tenha uma identidade de bloqueio distinta.

## Execute comandos elegíveis em segundo plano

Tarefas previstas para o mesmo horário são executadas sequencialmente por padrão. Use `runInBackground()` quando um comando agendado independente e de longa duração não dever atrasar tarefas posteriores.

```php
Schedule::command('analytics:process')->hourly()->runInBackground();
```

O Laravel restringe `runInBackground()` a tarefas agendadas com `command()` e `exec()`. Ele não está disponível para closures agendadas. Forneça logging e monitoramento de falhas aos processos em segundo plano.

## Restrinja tarefas por ambiente

Use `environments()` quando uma tarefa dever ser executada apenas em ambientes de aplicação nomeados. Trate `environments()` como uma salvaguarda operacional, não como um controle de autorização.

```php
Schedule::command('billing:charge')
    ->monthly()
    ->environments(['production']);
```

## Agrupe configurações compartilhadas

Use grupos de agendamento quando várias tarefas compartilharem frequência ou restrições.

```php
Schedule::daily()
    ->onOneServer()
    ->timezone('America/New_York')
    ->group(function () {
        Schedule::command('emails:send --force');
        Schedule::command('emails:prune');
    });
```

## Limite o trabalho dentro da tarefa

O agendador não fornece um método de evento `takeUntilTimeout()` nem encerra tarefas arbitrárias em um prazo limite. Limite o trabalho no próprio comando ou job processando lotes finitos, verificando um prazo limite ou despachando jobs de fila com timeouts adequados. Use controles do sistema operacional ou de processos quando o encerramento rígido for necessário.
