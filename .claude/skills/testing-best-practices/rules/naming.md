# Nomenclatura e estrutura

## Organização de arquivos

- Nomeie cada arquivo de teste como `{ClassName}Test.php`.
- Coloque cada arquivo de teste no mesmo caminho relativo da classe sob teste. A classe `app/Actions/DeleteTeam.php` recebe o teste `tests/Unit/Actions/DeleteTeamTest.php`.
- Siga a convenção do projeto para arquivos de fixture. Se não existir nenhuma, coloque as fixtures em `tests/Fixtures/` e carregue-as pelo caminho.
- Mova valores literais grandes para fora do corpo do teste e para arquivos de fixture.

## Classe de teste e métodos

- Estenda a classe base `TestCase` do projeto em cada classe de teste de feature.
- Estenda `PHPUnit\Framework\TestCase` em cada classe de teste unitário, como faz o stub de `php artisan make:test --unit`. Um teste unitário cobre lógica que não usa o framework, portanto não inicializa a aplicação.
- Dê a cada método de teste o prefixo `test_`, ou adicione o atributo `#[Test]` ao método. Use a convenção dos outros arquivos no mesmo diretório.

## Nomeando testes

O nome de um método de teste é uma especificação. Separe as palavras com underscores. Indique o resultado visível para o usuário e a condição que o causa.

- Nomeie o comportamento, não o método sob teste. O nome do arquivo já informa a classe.
- Informe o código de status exato no nome de um teste para um erro de API.
- Não escreva `given`, `when` ou `then` no nome.

```php
public function test_unauthenticated_request_redirects_to_login(): void { ... }
public function test_returns_401_when_no_token_is_provided(): void { ... }
public function test_valid_payload_creates_record_and_returns_201(): void { ... }
```

Use um verbo que descreva um resultado, como `returns`, `renders`, `creates`, `dispatches`, `rejects`, `forbids`, `falls back` ou `does not`.

Não escreva `test_store()`, `test_it_works()` ou `test_validation()`, porque nenhum deles informa um resultado.

## Agrupamento

Escreva uma classe de teste para cada classe sob teste. Se um arquivo cobrir ações separadas em um ciclo de vida, escreva uma classe de teste separada para cada ação, como `StoreOrderControllerTest` e `UpdateOrderControllerTest`.

Use o atributo `#[Group]` para marcar os testes que uma execução deve selecionar ou deve pular. Não use um grupo para dar estrutura a um arquivo, porque uma classe já fornece a estrutura.
