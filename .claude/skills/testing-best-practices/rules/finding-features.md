# Como encontrar recursos do framework de testes

O PHPUnit e o Laravel fornecem recursos para a maioria das necessidades de teste. Encontre um recurso existente antes de implementar o comportamento manualmente.

- Passe para `search-docs` a capacidade de que você precisa em vez do nome de um método de que você se lembra. Ele retorna a documentação de testes do Laravel para a versão instalada.
- Consulte `https://phpunit.de/documentation.html` para atributos, asserções e opções de linha de comando específicos da versão do PHPUnit.
- Se uma pesquisa não retornar resultados, informe ao usuário que a versão instalada não fornece o recurso. Não escreva uma API que você não confirmou.

Procure um recurso nesta tabela antes de escrever o código manualmente.

| Trabalho necessário | Termo para pesquisar |
| --- | --- |
| Executar um método de teste com muitos valores de entrada | data provider, `#[DataProvider]`, `#[TestWith]` |
| Executar um teste apenas depois que outro teste passar | `#[Depends]` |
| Selecionar ou pular um conjunto de testes em uma execução | `#[Group]`, `--group`, `--exclude-group` |
| Pular um teste em uma versão ou na ausência de uma extensão | `#[RequiresPhp]`, `#[RequiresPhpExtension]` |
| Encontrar um teste que depende da ordem da execução | `--order-by=random` |
| Reduzir o tempo de uma suíte lenta | ParaTest, `--cache-result` |
| Parar a execução na primeira falha enquanto você depura | `--stop-on-failure`, `--filter` |

## Métodos de asserção integrados do Laravel

O Laravel fornece asserções para cada parte do framework. Consulte `https://laravel.com/framework/docs/testing` para a lista completa e procure uma asserção antes de construir uma verificação manualmente. Exemplos incluem `assertDatabaseHas()`, `assertModelExists()`, `assertSoftDeleted()`, asserções de resposta como `assertRedirectToRoute()` e `assertJsonPath()`, e asserções de fakes como `Queue::assertPushed()` e `Notification::assertSentTo()`.

Uma verificação construída manualmente falha com `false is not true`. Essa mensagem não identifica nada. Uma asserção do framework nomeia a tabela, o valor ou a resposta incorreta, de modo que a falha mostra o que corrigir.

```php
// A falha diz que false is not true. Em vez disso...
$this->assertTrue(User::where('email', 'taylor@laravel.com')->exists());

// Use isto... a falha nomeia a tabela e os atributos que não encontrou...
$this->assertDatabaseHas('users', ['email' => 'taylor@laravel.com']);
```
