# Factories e dados de teste

## Cada teste cria seus próprios dados

Crie registros mutáveis dentro de cada teste ou por meio de um helper privado que o teste chama. A preparação então permanece visível, e cada teste pode selecionar seu estado de factory.

Use `setUp()` apenas para configuração que se aplica a todos os testes da classe. Não crie registros nele, porque seus objetos permanecem em memória até o fim da suíte.

## Construção de registros

- Use `create()` se o teste precisar do registro no banco de dados.
- Use `make()` apenas se o teste não precisar do banco de dados. Exemplos incluem renderizar uma notificação e testar o comportamento de um value object.
- Use um estado de factory nomeado em vez de um atributo bruto. `User::factory()->unverified()->create()` dá significado ao estado. `create(['email_verified_at' => null])` informa apenas seu valor.
- Use `for()` ou o helper de relacionamento do projeto para declarar o dono de um registro.
- Se vários registros precisarem compartilhar um registro pai, use `recycle()`.
- Se vários registros precisarem de atributos diferentes, use `sequence()`.

```php
$organization = Organization::factory()->onPlan(BillingPlan::PRO)->create();

$environment = Environment::factory()->recycle($organization)->create();

$organizations = Organization::factory()
    ->count(3)
    ->sequence(
        ['created_at' => now()->setSeconds(30)],
        ['created_at' => now()->setSeconds(1)],
    )
    ->create();
```

Crie apenas os registros necessários para preparar o comportamento ou dar suporte a uma asserção.

## Data providers

Use um data provider quando a preparação, o corpo do teste e as asserções permanecerem os mesmos entre os valores de entrada.

```php
public static function nonAdminRoles(): array
{
    return collect(Role::cases())
        ->reject(fn (Role $role): bool => $role === Role::ADMIN)
        ->mapWithKeys(fn (Role $role): array => [$role->value => [$role]])
        ->all();
}

#[DataProvider('nonAdminRoles')]
public function test_forbids_roles_other_than_admin(Role $role): void
{
    $this->actingAs(User::factory()->hasOrganization($role)->create())
        ->post('/settings')
        ->assertForbidden();
}
```

Declare cada método de data provider como `public static`.

Use testes parametrizados para:

- casos de enum
- papéis e planos
- valores de limite
- valores de entrada que são inválidos da mesma forma
- pares de valores de entrada e saída

Se os casos precisarem de uma preparação diferente, um comportamento diferente ou asserções diferentes, escreva testes separados. Uma função de teste com uma ramificação no corpo são dois testes em uma função.

Dê a cada caso do data provider uma chave que indique a diferença. Uma falha então identifica o caso sem exigir que você conte posições.
