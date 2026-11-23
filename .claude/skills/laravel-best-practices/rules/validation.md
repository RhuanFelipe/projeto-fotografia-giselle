# Boas práticas de validação e formulários

## Extraia a validação quando isso melhorar a fronteira

Use um form request quando a validação ou autorização for substancial, reutilizada ou mais clara fora do controller. `$request->validate()` inline continua apropriado para um conjunto pequeno de regras específico do endpoint.

```php
public function store(StorePostRequest $request): RedirectResponse
{
    $post = Post::create($request->validated());

    return redirect()->route('posts.show', $post);
}
```

O método `authorize()` de um form request pode impor acesso à operação. A validação verifica o formato e os valores da entrada. A validação por si só não autoriza o usuário.

## Prefira uma sintaxe de regras legível

A sintaxe de array combina-se com objetos de regra e evita problemas de delimitadores. Prefira a sintaxe de array em código novo quando ela melhorar a legibilidade e mantenha o estilo local consistente.

```php
'email' => ['required', 'email', Rule::unique('users')],
```

A sintaxe de string continua válida para regras simples:

```php
'email' => 'required|email|unique:users',
```

## Use apenas os dados validados pretendidos

Use `validated()` ou `safe()` em vez de `$request->all()` ao repassar dados da requisição adiante. Quando as regras de validação também abrangerem campos de controle ou dados aninhados, selecione apenas os campos destinados à operação.

Inseguro:

```php
Post::create($request->all());
```

Preferido:

```php
$post = Post::create($request->safe()->only(['title', 'body']));
```

Dados validados não são automaticamente seguros para mass assignment. Mantenha as regras `$fillable` ou `$guarded` do model alinhadas com a operação e nunca adicione um atributo sensível à validação apenas para tornar o mass assignment conveniente.

## Expresse regras condicionais com clareza

Use regras condicionais como `Rule::when()`, `required_if` ou `exclude_unless` quando elas tornarem a condição explícita. Escolha a forma mais simples que permaneça fácil de testar.

```php
'company_name' => [
    'string',
    'max:255',
    Rule::when(
        $this->input('account_type') === 'business',
        ['required'],
        ['nullable'],
    ),
],
```

## Adicione validação cruzada de campos após as regras base

Use o método `after()` de um form request para validação que depende de múltiplos campos ou do estado da aplicação. Pule consultas custosas quando campos pré-requisito já tiverem falhado na validação.

```php
public function after(): array
{
    return [
        function (Validator $validator) {
            if ($validator->errors()->hasAny(['product_id', 'quantity'])) {
                return;
            }

            $stock = Product::find($this->integer('product_id'))?->stock;

            if ($stock !== null && $this->integer('quantity') > $stock) {
                $validator->errors()->add('quantity', 'Not enough stock.');
            }
        },
    ];
}
```

A validação contra estado mutável não impede uma condição de corrida (race condition) entre a validação e a persistência. Imponha estoque, unicidade e invariantes semelhantes com restrições de banco de dados, atualizações atômicas ou uma transação de banco de dados, conforme apropriado.
