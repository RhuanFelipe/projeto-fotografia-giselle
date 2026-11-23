---
name: laravel-best-practices
description: "Aplique esta skill sempre que escrever, revisar ou refatorar código PHP Laravel. Isso inclui criar ou modificar controllers, models, migrations, form requests, policies, jobs, comandos agendados, classes de serviço e consultas Eloquent. Aciona para problemas de N+1 e performance de consultas, estratégias de cache, padrões de autorização e segurança, validação, tratamento de erros, configuração de filas e jobs, definições de rotas e decisões arquiteturais. Use também para revisões de código Laravel e refatoração de código Laravel existente para seguir boas práticas. Cobre qualquer tarefa envolvendo padrões de código PHP no backend Laravel."
license: MIT
metadata:
  author: laravel
---

# Boas práticas do Laravel

Boas práticas para Laravel, organizadas como um índice de arquivos de regras. Cada arquivo de regra ensina o que fazer e por quê. Para a sintaxe exata da API, verifique com `search-docs`.

## Consistência em primeiro lugar

Antes de aplicar qualquer regra, verifique o que a aplicação já faz. O Laravel oferece várias abordagens válidas. A melhor escolha é a que a base de código já utiliza, mesmo que outro padrão fosse melhor na teoria. Inconsistência é pior do que um padrão subótimo.

Verifique arquivos irmãos e controllers, models ou testes relacionados para encontrar padrões estabelecidos. Se existir um, siga-o. Não introduza uma segunda forma. Estas regras são padrões padrão para quando ainda não existe um padrão, não sobrescritas.

## Como aplicar

1. Verifique os arquivos alterados, código próximo, configuração do projeto e testes relevantes para identificar padrões estabelecidos. Só desvie por um defeito de corretude ou segurança, e destaque o desvio.
2. Mapeie cada preocupação afetada para o índice de regras abaixo. Leia cada arquivo de regra mapeado antes de editar. Pule arquivos de regras não relacionados.
3. Faça a menor alteração coerente. Mantenha a arquitetura e a nomenclatura da aplicação em vez de introduzir um segundo padrão para a mesma tarefa.
4. Verifique APIs do Laravel sensíveis à versão para a versão instalada com `search-docs`, ou inspecione o framework instalado quando `search-docs` estiver indisponível.
5. Execute primeiro os testes relevantes mais restritos e, em seguida, as verificações de formatação e análise estática do projeto quando a alteração justificar.
6. Releia o diff comparando com cada regra mapeada antes de finalizar.

## Índice de regras

Alterações transversais frequentemente precisam de mais de um arquivo de regra.

| Preocupação | Ler |
| --- | --- |
| Contagem de queries, eager loading, índices, grandes conjuntos de dados | [`rules/db-performance.md`](rules/db-performance.md) |
| Subqueries, agregações, ordenação complexa e planos de query | [`rules/advanced-queries.md`](rules/advanced-queries.md) |
| Models, relacionamentos, escopos, casts | [`rules/eloquent.md`](rules/eloquent.md) |
| Autenticação, autorização, segurança de entrada, segredos, uploads | [`rules/security.md`](rules/security.md) |
| Form Requests e regras de validação | [`rules/validation.md`](rules/validation.md) |
| Controllers, route binding, resources, middleware | [`rules/routing.md`](rules/routing.md) |
| Alterações de schema, colunas, chaves estrangeiras, índices | [`rules/migrations.md`](rules/migrations.md) |
| Jobs, tentativas, unicidade, batches, Horizon | [`rules/queue-jobs.md`](rules/queue-jobs.md) |
| Tempo de vida de cache, invalidação, locks, memoização | [`rules/caching.md`](rules/caching.md) |
| Requisições externas, tentativas, timeouts, fakes | [`rules/http-client.md`](rules/http-client.md) |
| Exceções, relato, renderização, contexto de log | [`rules/error-handling.md`](rules/error-handling.md) |
| Eventos e notificações | [`rules/events-notifications.md`](rules/events-notifications.md) |
| Mailables e asserções de e-mail | [`rules/mail.md`](rules/mail.md) |
| Tarefas agendadas e proteção contra sobreposição | [`rules/scheduling.md`](rules/scheduling.md) |
| Collections, iteração lazy, operações em lote | [`rules/collections.md`](rules/collections.md) |
| Componentes Blade, atributos, composers | [`rules/blade-views.md`](rules/blade-views.md) |
| Valores de ambiente e configuração da aplicação | [`rules/config.md`](rules/config.md) |
| Testes: cobertura, factories, fakes e asserções | a skill `testing-best-practices` |
| Nomenclatura, helpers, limites de arquivos, estilo PHP | [`rules/style.md`](rules/style.md) |
| Actions, services, dependências, estrutura da aplicação | [`rules/architecture.md`](rules/architecture.md) |

## Regras de decisão

- Prefira recursos do framework e abstrações existentes da aplicação em vez de novos helpers ou dependências.
- Evite abstrações especulativas. Extraia código quando isso criar uma fronteira de domínio clara, remover duplicação relevante ou tornar o comportamento testável de forma independente.
- Mantenha o acesso ao banco de dados fora das views Blade e evite queries N+1 ocultas em controllers, resources, jobs e serialização.
