---
name: testing-best-practices
description: "Design e revisão de testes no Laravel. Use ao selecionar cobertura, nomear ou estruturar testes, escolher asserções ou dados de teste, isolar dependências, testar limites HTTP ou de segurança, melhorar a performance da suíte ou revisar o valor de testes. Use orientações do framework ou search-docs para sintaxe de Pest e PHPUnit."
license: MIT
metadata:
  author: laravel
---

# Boas práticas de testes

Esta skill fornece regras para projetar testes no Laravel. Cada arquivo de regra explica o que fazer e por quê. Use `search-docs` para sintaxe da API do Laravel. Consulte a documentação do PHPUnit 12.5.42 em `https://phpunit.de/documentation.html` para sintaxe da API do PHPUnit.
Este projeto usa PHPUnit. Siga as orientações correspondentes em cada regra.

## Consistência em primeiro lugar

Leia testes próximos antes de escolher sintaxe e organização.

Um padrão repetido em todo o projeto é uma convenção, e convenções do projeto têm precedência sobre esta skill. Siga-as e dê aos novos testes a mesma estrutura.

Estas regras regem os testes que você escreve agora. Um teste existente que segue uma convenção do projeto não é defeituoso apenas por conflitar com esta skill. Não o exclua nem o reescreva. Se a convenção tiver desvantagens, explique-as e deixe o usuário decidir.

## O que testar

Leia esta seção antes de escrever um teste.

- Teste comportamento observável e contratos da aplicação. Um teste deve continuar passando após uma mudança de implementação se o comportamento permanecer o mesmo.
- Cubra cada decisão alterada e cada modo de falha de alto valor aplicável. Uma decisão é uma ramificação, uma validação, um cálculo ou uma autorização.
- Exercite declarações por meio do comportamento em vez de repetir o texto delas.
- Deixe o comportamento do framework para os testes do framework. Testar configuração do projeto não é testar o framework. Um relacionamento com restrição, cast, escopo ou regra de validação pertence a este projeto.
- Mantenha todo teste capaz de detectar um defeito distinto. Quando dois testes detectarem o mesmo defeito, reduza o teste da camada superior a um caso e relate a duplicação. Não exclua um teste existente.
- Escreva um feature test primeiro. Escreva um unit test apenas para lógica que não usa o framework.
- Escreva um feature test para todo comportamento acessível por uma requisição. Testes reais em navegador exigem `laravel/dusk` e download de navegador, nenhum dos quais este projeto instala. Mencione o pacote apenas se o usuário pedir um teste real em navegador.
- Use as ferramentas de teste que o projeto instala. Adicione uma nova dependência de teste, plugin ou navegador somente depois que o usuário pedir.

## Como aplicar

1. Leia o código sob teste. Leia os testes no mesmo diretório. Identifique cada decisão no código.
2. Selecione cada ramificação aplicável no índice de regras. Leia cada arquivo de regra selecionado.
3. Relate cada defeito no código antes de escrever um teste. Exemplos são um método sem corpo, uma policy que nenhuma action chama e uma ação de escrita sem validação. Teste o comportamento real. Relate o defeito ao usuário.
4. Escreva os testes. Execute o menor conjunto de testes que cobre a alteração. Os testes devem passar.
5. Verifique cada item aplicável em `rules/review.md` e em cada arquivo de regra selecionado. Resolva toda divergência antes de concluir.

## Índice de regras

A maioria das alterações precisa de mais de um arquivo de regra.

| Assunto | Arquivo de regra |
| --- | --- |
| Recursos do framework de teste que podem já fazer o trabalho | [`rules/finding-features.md`](rules/finding-features.md) |
| Estrutura de arquivos, nomes de testes e grupos | [`rules/naming.md`](rules/naming.md) |
| Arrange-act-assert e escolha da asserção correta | [`rules/assertions.md`](rules/assertions.md) |
| Cobertura de endpoints, autenticação, autorização, isolamento de tenant, validação e testes de navegador | [`rules/endpoint-tests.md`](rules/endpoint-tests.md) |
| Factories, propriedade dos dados de teste e valores de entrada repetidos | [`rules/test-data.md`](rules/test-data.md) |
| Fakes, mocks, HTTP externo, tempo, aleatoriedade e bancos de dados | [`rules/isolation.md`](rules/isolation.md) |
| Escaping, injeção, acesso entre tenants e verificações de privilégio | [`rules/security.md`](rules/security.md) |
| Configurações de ambiente e CI para uma suíte lenta | [`rules/performance.md`](rules/performance.md) |
| Revisão de um teste ou suíte | [`rules/review.md`](rules/review.md) |
