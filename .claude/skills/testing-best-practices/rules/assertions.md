# Asserções

## Arrange, act, assert

Escreva cada teste em três partes: preparação, uma ação e asserções. Coloque uma linha em branco entre elas para que os leitores possam identificar cada parte sem comentários.

Mantenha cada teste autocontido. Não use valores criados por outro teste.

## Como encontrar a asserção correta

Primeiro identifique o sujeito da verificação e, em seguida, encontre uma asserção projetada para ele. Uma asserção específica para o sujeito identifica o valor incorreto quando o teste falha.

1. Pesquise as asserções do Laravel para sujeitos do framework como respostas, banco de dados, sessões, models, filas, eventos, e-mail e notificações.
2. Consulte a documentação do PHPUnit 12.5.42 em `https://phpunit.de/documentation.html` para as asserções do PHPUnit referentes a um valor simples, um tipo, um formato ou uma estrutura.
3. Construa a verificação manualmente apenas se não existir nenhuma asserção para o sujeito.
4. Confirme o nome na documentação antes de usá-lo. Não escreva uma asserção que você não confirmou.

Use a asserção desta tabela para cada sujeito.

| Sujeito | Asserção a usar |
| --- | --- |
| Um valor de retorno, o estado de um objeto ou a transformação de um valor | `assertSame()`, ou a asserção para o tipo |
| Um status HTTP, JSON, uma sessão ou Inertia | uma asserção de resposta do Laravel |
| O estado no banco de dados | uma asserção de banco de dados do Laravel |
| A existência de um model | `assertModelExists($model)` em vez de `assertDatabaseHas('users', ['id' => $user->id])` |

Use `assertSame()` e não `assertEquals()`, porque `assertSame()` também compara o tipo.

Faça asserção de cada fato uma vez, mas status e conteúdo são fatos separados. `assertSee` passa em uma página de erro que contém o texto, portanto mantenha `assertOk()` junto dele quando o status fizer parte do comportamento.

## Asserções de resposta nomeadas

Use uma asserção de resposta nomeada, como `assertNotFound()`, em vez de `assertStatus(404)`. Uma falha então identifica o contrato quebrado. O Laravel fornece asserções nomeadas para códigos de status comumente testados.

Agrupe as asserções para um sujeito juntas. Inicie um novo grupo quando o sujeito mudar.

## Faça asserção de um valor conhecido

Escreva o valor esperado no teste ou calcule o valor esperado por um método diferente. Não calcule o valor esperado com a lógica da implementação, porque o teste passa mesmo quando essa lógica está errada.

```php
// O teste calcula o valor com a lógica da implementação...
$expected = now()->subHours(24)->floorSeconds(30)->toJson();
$this->assertSame($expected, $from);

// O teste define uma entrada fixa e faz asserção de um valor conhecido...
$this->travelTo('2025-01-01 00:00:00');
$this->assertSame('2024-12-31T00:00:00.000000Z', $from);
```

## Faça asserção do resultado completo

Um código de status não é o resultado completo de uma operação de escrita. Faça asserção de cada um dos itens a seguir se a operação os alterar:

- A resposta ou o valor de retorno.
- O estado no banco de dados.
- Os jobs e os eventos que a operação despacha.
- As notificações e os e-mails que a operação envia.

No caminho de falha, faça asserção de que a operação não realiza nenhuma dessas alterações. Um teste que faz asserção apenas de `assertOk()` passa mesmo quando a aplicação não salva nenhum registro.
