# Boas práticas de arquitetura

## Extraia operações de negócio focadas

Extraia uma operação de negócio discreta para uma classe de ação (action class) quando isso tornar a operação mais fácil de reutilizar ou testar. Uma classe de ação não tem significado especial para o Laravel. Siga as convenções de nomenclatura e invocação do projeto.

```php
class CreateOrderAction
{
    public function __construct(private InventoryService $inventory) {}

    public function handle(array $data): Order
    {
        $order = Order::create($data);
        $this->inventory->reserve($order);

        return $order;
    }
}
```

## Injete dependências obrigatórias

Prefira injeção via construtor para dependências necessárias durante todo o ciclo de vida de um objeto. Use injeção via método para uma dependência que apenas uma ação de controller, listener, manipulador de job ou outro método invocado pelo contêiner precise. Evite `app()` e `resolve()` quando a injeção normal puder tornar uma dependência explícita.

Dependência oculta:

```php
class OrderController extends Controller
{
    public function store(StoreOrderRequest $request)
    {
        $service = app(OrderService::class);

        return $service->create($request->validated());
    }
}
```

Dependência injetada:

```php
class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, OrderService $service)
    {
        return $service->create($request->validated());
    }
}
```

## Dependa de contratos nas fronteiras

Dependa de contratos nas fronteiras do sistema, como gateways de pagamento, canais de notificação e serviços externos, quando a testabilidade ou implementações intercambiáveis justificarem a abstração.

Dependência concreta de fronteira:

```php
class OrderService
{
    public function __construct(private StripeGateway $gateway) {}
}
```

Dependência de contrato de fronteira:

```php
interface PaymentGateway
{
    public function charge(int $amount, string $customerId): PaymentResult;
}

class OrderService
{
    public function __construct(private PaymentGateway $gateway) {}
}
```

Vincule em um service provider:

```php
$this->app->bind(PaymentGateway::class, StripeGateway::class);
```

## Especifique uma ordem de classificação determinística

Sem um `ORDER BY` explícito, a ordem das linhas é indefinida. Escolha uma ordem que corresponda ao recurso e adicione um critério de desempate único quando uma paginação estável for importante.

Ordem não especificada:

```php
$posts = Post::paginate();
```

Mais recentes primeiro com um critério de desempate estável:

```php
$posts = Post::query()
    ->orderByDesc('created_at')
    ->orderByDesc('id')
    ->paginate();
```

## Use travas atômicas para condições de corrida

Use uma trava (lock) quando processos concorrentes precisarem ser executados um de cada vez. `Cache::lock()` fornece uma trava atômica quando o armazenamento de cache configurado suporta travas. `lockForUpdate()` trava as linhas selecionadas no banco de dados e deve ser executado dentro de uma transação de banco de dados. Esses mecanismos resolvem problemas diferentes de coordenação. Defina o tempo de concessão (`10` abaixo) maior do que o callback jamais poderá levar para executar. Assim que o tempo expirar, outro processo poderá adquirir a trava enquanto o primeiro processo ainda estiver trabalhando.

```php
Cache::lock('order-processing-'.$order->id, 10)->block(5, function () use ($order) {
    $order->process();
});

// Or at query level, inside a transaction
DB::transaction(function () use ($id) {
    $product = Product::where('id', $id)->lockForUpdate()->first();

    // Read and update the product while the database lock is held.
});
```

## Use funções de string `mb_*`

Quando não existir um helper do Laravel, prefira funções compatíveis com multibyte, como `mb_strlen()` e `mb_strtolower()`, para texto UTF-8. Por exemplo, `strlen()` conta bytes, enquanto `strtolower()` não tem suporte a multibyte.

Incorreto:

```php
strlen('José');          // 5 bytes, not 4 characters
strtolower('MÜNCHEN');  // Does not lowercase Ü
```

Correto:

```php
mb_strlen('José');         // 4 characters
mb_strtolower('MÜNCHEN'); // 'münchen'

// Prefer Laravel's Str helpers when available
Str::length('José');       // 4
Str::lower('MÜNCHEN');     // 'münchen'
```

## Use `defer()` para trabalho pós-resposta

Para trabalhos leves que não precisam de novas tentativas ou durabilidade contra falhas, considere `defer()` em vez de despachar um job. Durante uma requisição HTTP, o callback normalmente é executado após o Laravel enviar a resposta, mas ainda é executado no mesmo processo PHP.

Enfileirado e durável:

```php
dispatch(new LogPageView($page));
```

Adiado no processo atual:

```php
defer(fn () => PageView::create(['page_id' => $page->id, 'user_id' => auth()->id()]));
```

Use um job em fila quando o trabalho precisar de novas tentativas, controles de fila ou durabilidade entre falhas de processo.

## Use `Context` para dados no escopo da requisição

A facade `Context` disponibiliza dados contextuais em todo o ciclo de vida de execução atual sem passar argumentos manualmente por todas as camadas.

```php
// In middleware
Context::add('tenant_id', $request->header('X-Tenant-ID'));

// Later in the same execution lifecycle
$tenantId = Context::get('tenant_id');
```

O Laravel adiciona o contexto visível ao contexto de log. Ele também captura tanto o contexto visível quanto o oculto e os restaura para jobs em fila. Use `Context::addHidden()` para dados que devem ser propagados para jobs em fila sem aparecer nos logs. Não coloque segredos no contexto, a menos que você pretenda essa propagação.

## Use `Concurrency::run()` para execução paralela

Execute operações independentes simultaneamente por meio do driver de concorrência configurado no Laravel.

```php
use Illuminate\Support\Facades\Concurrency;

[$users, $orders] = Concurrency::run([
    fn () => User::count(),
    fn () => Order::where('status', 'pending')->count(),
]);
```

Com um driver baseado em processos, cada closure é executada em um processo PHP separado que inicializa a aplicação. Use concorrência quando consultas independentes ao banco de dados, chamadas de cliente HTTP ou computações se beneficiarem o suficiente para compensar a sobrecarga de processo e serialização. O driver `sync` executa closures sequencialmente e é útil principalmente durante testes.

## Siga as convenções do framework

Siga as convenções do Laravel, a menos que o domínio ou um esquema existente exija uma substituição.

Esquema personalizado:

```php
class Customer extends Model
{
    protected $table = 'Customer';
    protected $primaryKey = 'customer_id';

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_customer', 'customer_id', 'role_id');
    }
}
```

Esquema convencional:

```php
class Customer extends Model
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }
}
```
