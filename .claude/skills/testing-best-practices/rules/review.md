# Revisando testes

Verifique cada item neste arquivo. Um teste pode passar e ainda assim não fornecer valor. Para cada teste, identifique o defeito que ele capturaria.

Reporte cada achado. Não exclua nem reescreva um teste sem a aprovação do usuário. Se um problema aparecer por toda a suíte como uma convenção, reporte o padrão uma vez em vez de uma vez para cada arquivo afetado.

## Valor do teste

- [ ] Cada teste cobre comportamento observável ou um contrato da aplicação, e passa após uma alteração na implementação que mantenha o comportamento.
- [ ] Cada declaração testada é exercitada por meio de comportamento, e nenhum teste faz asserção do comportamento do framework. Um teste do que este projeto configura, como um relacionamento com restrição, um cast ou um scope, pertence a este projeto.
- [ ] Cada teste detecta um defeito distinto que nenhum outro teste cobre. Reduza uma duplicata na camada superior ao único caso que prova a conexão.
- [ ] Cada decisão alterada e cada modo de falha de alto valor aplicável têm cobertura.

## Nomes e estrutura

- [ ] Cada arquivo tem o nome `{ClassName}Test.php` e o caminho relativo da classe sob teste.
- [ ] Cada nome informa um resultado, a condição que o causa e o código de status para um erro de API.
- [ ] Cada classe de teste de feature estende a classe base `TestCase` do projeto, cada classe de teste unitário estende `PHPUnit\Framework\TestCase`, e cada arquivo usa consistentemente o prefixo `test_` ou o atributo `#[Test]`.

## Cobertura

- [ ] Testes HTTP cobrem autenticação, autorização, papel, escopo e validação quando aplicável.
- [ ] Uma requisição para um registro de um tenant diferente recebe um código de status que não confirma que o registro existe.
- [ ] A matriz completa de permissões pertence aos testes de policy, não aos testes de controller.
- [ ] Cada regra de validação tem um teste que faz asserção da mensagem visível ao usuário. Se um teste unitário cobrir uma matriz, reduza a cobertura duplicada de nível superior a um caso em vez de excluí-la.
- [ ] Entradas de usuário renderizadas e cada parte dinâmica de uma consulta têm um teste de segurança.

## Dados e determinismo

- [ ] Cada teste cria seus registros mutáveis diretamente ou por meio de um helper que ele chama, e cada registro criado prepara o comportamento ou dá suporte a uma asserção.
- [ ] `setUp()` contém apenas configuração.
- [ ] Cada estado de factory e cada relacionamento expressa o significado dos dados.
- [ ] Cada chamada a `make()` está em um teste que não precisa do banco de dados.
- [ ] Cada teste controla tempo, aleatoriedade, sleep e HTTP de saída.
- [ ] Cada teste passa isoladamente e passa na suíte completa em qualquer ordem.

## Asserções

- [ ] Cada valor esperado é um valor conhecido, e o teste não calcula o valor com a lógica da implementação.
- [ ] Cada teste de uma operação de escrita faz asserção da resposta, do estado no banco de dados e dos efeitos colaterais.
- [ ] Cada fake tem uma asserção e informa os nomes das classes, a menos que o teste faça asserção do resultado completo.
- [ ] Cada grupo de asserções permanece em um sujeito, e cada comparação usa `assertSame()`.
