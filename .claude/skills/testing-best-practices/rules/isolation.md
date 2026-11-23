# Fakes, mocks e determinismo

Testes que dependem de tempo real, aleatoriedade, sleep ou chamadas de rede podem falhar por motivos não relacionados ao código sob teste. Controle todos os quatro.

## Como isolar uma dependência

Consulte `https://laravel.com/framework/docs/mocking` para os fakes do Laravel, dublês de facade e asserções de fakes. Confirme cada nome antes de usá-lo.

Identifique a dependência e escolha a primeira opção que se aplica. Um fake do framework preserva o caminho real do código, enquanto um mock substitui a dependência.

1. Sempre use fakes do framework para facades como eventos, filas, e-mail, notificações, armazenamento, cliente HTTP, tempo e sleep.
2. Use uma implementação fake definida pelo desenvolvedor de um serviço se a aplicação fornecer uma.
3. Use um mock para um contrato resolvido pelo contêiner apenas quando a implementação real sair do processo ou for não determinística.
4. Use a implementação real para todo o resto, incluindo o banco de dados.

## Fakes do framework

- Crie cada fake dentro do método de teste que precisa dele. Não crie fakes em `setUp()`.
- Passe nomes de classes para `Event::fake()` e `Queue::fake()` quando você souber quais classes o código despacha. Um fake sem nomes de classes pode ocultar um despacho inesperado.
- Use um fake sem nomes de classes apenas quando o teste fizer asserção do resultado completo, incluindo uma chamada a `assertNothingPushed()`.
- Escreva uma asserção para cada fake. A asserção declara que o código despacha o item ou que o código não despacha o item.
- Se os dados de um job ou evento fizerem parte do comportamento, faça asserção desses dados.
- Use `Exceptions::fake()` para fazer asserção de que a aplicação reporta a exceção correta. Não use `withoutExceptionHandling()`, porque isso altera a resposta sob teste.

Crie registros pré-requisito de factory antes de chamar `Event::fake()`. Factories usam eventos de model, como um hook `creating` que gera um UUID. Um fake sem nomes de classes suprime esses eventos, e a factory pode então produzir um model inválido. Chame o fake primeiro apenas quando um evento de factory estiver sob teste e passe o nome da classe desse evento.

## Mocking

Use `shouldReceive()` antes da ação para declarar uma expectativa. Use `shouldHaveReceived()` após a ação para um spy. Se uma verificação de igualdade não puder expressar o argumento esperado, como uma verificação de um campo de um value object, use `Mockery::on()` ou `withArgs()`.

Use `$this->mock(Contract::class)` para colocar um mock no contêiner. Não construa um mock do PHPUnit para uma classe que o Mockery pode dublar, porque o projeto usa Mockery.

## Testes de HTTP de saída

Chame `Http::preventStrayRequests()`. Qualquer requisição sem um fake correspondente falha sem alcançar a rede.

Faça fake do endpoint exato que cada teste chama. Não chame `Http::fake()` sem um endpoint, porque um fake sem endpoint aceita requisições inesperadas e pode ocultar defeitos.

## Tempo e aleatoriedade

- Congele o tempo ou avance o tempo em cada teste que dependa de uma data, um período ou um timestamp.
- Use os helpers do framework `$this->freezeTime()`, `$this->travelTo()`, `$this->travel()` e `$this->travelBack()`. Não chame `Carbon::setTestNow()`.
- Se o teste fizer asserção de um identificador ou slug, use `Str::createRandomStringsUsing()` para fixar a string gerada.
- Use `Sleep::fake()` em vez de um sleep real e faça asserção dos sleeps que o código solicita.
- Se a suíte não restaurar o tempo e a aleatoriedade para cada teste, restaure-os após cada teste.

## Banco de dados

- Execute consultas reais contra os registros reais no banco de dados de teste. Não faça mock do query builder, porque o teste então faz asserção do mock.
- Se a estrutura do model serializado for um contrato, faça asserção das chaves exatas de `toArray()`. O teste então falha quando o model expõe um novo atributo.
- Teste o comportamento da aplicação causado pelo esquema, como a exclusão de registros dependentes por meio de um cascade. Não teste a implementação de cascade do motor de banco de dados.
- Use `LazilyRefreshDatabase` em vez de `RefreshDatabase`. Um teste que não usa o banco de dados então não executa as migrations.
