# Desempenho da suíte de testes

Estas configurações se aplicam ao projeto e ao CI, não a testes individuais. Leia `rules/isolation.md` para escolhas dentro de um teste.

Consulte a documentação do PHPUnit 12.5.42 em `https://phpunit.de/documentation.html` para opções do PHPUnit que tornam as execuções de teste mais rápidas.
Verifique cada flag na documentação antes de adicioná-la ao CI.

Meça antes de alterar uma configuração. Encontre o teste lento primeiro e aplique uma configuração global do projeto apenas após identificar o trabalho custoso.

## Ambiente de teste

- Defina `BCRYPT_ROUNDS=4` em `.env.testing` ou em `phpunit.xml`. O valor padrão é 12, e o hash então consome a maior parte do tempo de cada teste que autentica um usuário.
- Desative o Xdebug. A menos que a execução precise de cobertura, desative o pcov também.
- Desative pacotes que executam trabalho em cada requisição no ambiente de teste. Exemplos são Pulse, Telescope e Nightwatch.
- Use as traits `WithCachedConfig` e `WithCachedRoutes`, para que a execução não analise a configuração e as rotas para cada teste.
- Chame `withoutVite()`, ou `withoutMix()`, para que o framework não resolva um asset compilado.

## Fakes globais

Coloque estas três chamadas no `setUp()` da classe base `TestCase` do projeto:

- `Http::preventStrayRequests()`, porque uma requisição que alcança a rede pode deixar a suíte lenta. Ela captura requisições que passam pelo cliente HTTP do Laravel. Verifique o uso direto de Guzzle e cURL separadamente.
- `Sleep::fake(syncWithCarbon: true)`, para que um retry e um backoff não executem sleep.
- `Exceptions::fake()`, para que a suíte não reporte uma exceção para um serviço externo.

## Como executar a suíte em paralelo

Execute `php artisan test --parallel`, que usa o ParaTest, para distribuir os testes pelos núcleos de CPU da máquina. Se a contagem padrão não for adequada para a máquina ou para o CI, adicione `--processes=N`.

Uma execução paralela dá a cada processo um banco de dados separado. Cada teste deve atender às condições abaixo. Um teste que falha apenas em paralelo viola uma delas.

- O teste cria cada registro que lê. Ele não lê um registro que outro teste cria.
- O teste não depende da ordem da execução.
- O teste não compartilha um arquivo, uma chave de cache ou uma fila com outro teste. Dê a cada processo um nome separado para esse recurso.

## Como encontrar um teste lento

Execute `php artisan test --profile` para listar os testes mais lentos. Comece pelos dez testes mais lentos, porque a mesma causa frequentemente se aplica à suíte inteira.

Se a causa de um teste lento não estiver clara, adicione um event listener ou uma entrada de log temporária para identificar o trabalho que o teste realiza.

## Erros comuns

- A execução carrega o Xdebug para um teste que não precisa dele.
- `BCRYPT_ROUNDS` mantém o valor padrão, porque o projeto não tem `.env.testing`.
- O código sob teste chama o `sleep()` real, e o `Sleep::fake()` então não ajuda.
