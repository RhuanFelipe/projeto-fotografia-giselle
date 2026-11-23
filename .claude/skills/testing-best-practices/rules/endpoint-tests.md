# Testes de endpoint

## Como escrever o teste

Consulte `https://laravel.com/framework/docs/http-tests` para os helpers de requisição, os helpers de autenticação e as asserções de resposta. Confirme o nome antes de usá-lo e não adivinhe uma asserção.

Escolha uma asserção com base no sujeito da verificação: o status, um cabeçalho, um redirecionamento, o corpo JSON, a sessão, um erro de validação ou a view. O Laravel fornece uma asserção nomeada para cada sujeito que identifica o valor incorreto.

## Cobertura de endpoint

Escreva um teste para cada caso aplicável:

- A requisição tem autenticação ausente ou inválida.
- A requisição vem de um tenant, equipe ou organização diferente.
- O usuário tem um papel ou permissão insuficiente.
- A requisição não satisfaz uma restrição de rota ou escopo.
- A requisição falha na validação.
- A requisição é válida. Faça asserção tanto da resposta quanto do estado persistido.

Faça asserção do comportamento real da aplicação em vez de um código de status genérico. Uma API retorna `401` para um token ausente ou inválido, enquanto um endpoint de navegador redireciona para a rota de login.

## Isolamento de tenant

Faça asserção do código de status retornado para uma requisição entre tenants. Use `404` em vez de `403` quando um tenant não deve saber que o registro de outro tenant existe, porque `403` confirma sua existência.

## Teste autorização no nível da policy

Um teste HTTP mostra que o endpoint executa autorização. Ele não consegue identificar qual mecanismo recusou a requisição porque middleware, uma policy e uma chamada a `abort()` podem todos retornar `403`.

- Faça asserção da matriz completa de permissões contra a policy ou o gate. Uma falha então nomeia a regra que não está correta.
- Escreva um teste HTTP para um papel recusado, o que mostra que o endpoint chama a autorização.
- Se o projeto tiver um helper que faz asserção da habilidade e dos argumentos do gate, use esse helper.

## Testando validação

- Escreva um teste para cada regra de validação quando cada falha representar um contrato separado.
- Escreva um teste com um payload vazio para fazer asserção de vários campos obrigatórios juntos.
- Faça asserção do texto da mensagem que o usuário recebe. Uma mensagem que está presente mas errada é um defeito.
- Use um data provider com o atributo `#[DataProvider]` para valores de entrada que precisam da mesma preparação e das mesmas asserções. Use o atributo `#[TestWith]` para um conjunto pequeno de valores.

Envie um valor de entrada que não seja válido através da aplicação e faça asserção do erro. Não faça asserção de que um array de regras contém uma string, porque essa asserção testa a declaração e não o comportamento. Use esse tipo de asserção apenas para uma regra que nenhuma requisição consegue alcançar e escreva o motivo no teste.

### Qual camada é dona de qual caso

O teste da classe de regra é dono da matriz de valores que passam e falham. O teste de endpoint prova que o endpoint aplica a regra e que o usuário recebe a mensagem.

Quando ambos os testes contiverem a matriz, mova-a para o teste da classe de regra e mantenha um caso no teste de endpoint. Nunca remova o último caso, porque o teste da classe de regra ainda passa se a requisição omitir a regra. A mesma divisão se aplica a policies, scopes e outras classes chamadas por uma requisição.
