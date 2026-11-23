---
name: infer-conventions
description: "Use esta skill para analisar como uma aplicação Laravel é realmente escrita e registrar suas convenções como regras compartilhadas. Acione quando o usuário quiser detectar, inferir, documentar ou padronizar convenções do projeto ou estilo de código, configurar ou expandir `.ai/rules`, resolver padrões mistos ou conflitantes (ex.: \"estamos usando Form Requests ou validação inline?\"), ou integrar agentes e colegas de equipe ao \"como fazemos as coisas aqui\". Cobre: uma varredura sistemática de ~49 dimensões de convenções Laravel (validação, models, arquitetura, testes, frontend, banco de dados, respostas de API), descoberta aberta de padrões internos, relato de conflitos e registro de regras com escopo nos caminhos corretos via ferramenta MCP `record-rule` do Boost. Execute esta skill apenas quando o usuário solicitar explicitamente; nunca inicie uma varredura como parte de outra tarefa. Não use para revisão pontual de código, imposição de formatação que um linter já trata ou edição manual de arquivos `.ai/rules`."
disable-model-invocation: true
license: MIT
metadata:
  author: laravel
---

# Inferir convenções

Aprenda como esta aplicação escreve Laravel e registre o que aprender como regras duráveis com escopo por caminho para que outros agentes leiam. Você está documentando a realidade, não melhorando-a.

## Regras básicas (leia antes de começar)

- Consistência em primeiro lugar. O estilo majoritário da base de código é a convenção. Nunca o julgue, nunca proponha um padrão "melhor", nunca registre o que o código deveria fazer. Se o app valida inline em todo lugar, essa é a regra, mesmo que Form Requests fossem mais bonitos.
- Pule o que uma ferramenta ativa produz, mantenha o que uma ferramenta combateria. Inspecione primeiro a configuração de Pint e Rector do projeto. Uma transformação do Rector só pertence à ferramenta quando seu pacote e a regra ou conjunto relevante estão instalados e habilitados. Ferramentas ativas podem reescrever o código para uma forma canônica: `$casts` para `casts()`, `$fillable` para atributos, accessors mágicos para a classe `Attribute`, regras em string com pipe para arrays, `$signature` para `#[Signature]`, migrations nomeadas para anônimas e muito mais. Quando o app já está na forma-alvo de uma ferramenta ativa, a ferramenta cuida disso, então não registre nada. Mas quando o app mantém deliberadamente uma forma que uma ferramenta ativa refatoraria, como accessors legados `getXxxAttribute()` que a classe `Attribute` substituiria, nenhuma ferramenta consegue reproduzir essa escolha e um agente usaria o padrão oposto por padrão. Registre essa escolha intencional contra a corrente.
- Registre decisões, não padrões padrão do framework. Um padrão consistente só merece uma regra quando reflete uma escolha: o app adotou uma opção válida onde o framework ou a prática comum ofereciam outras, ou o padrão surpreenderia um agente competente. Padrões padrão do framework não orientam nada, então pule-os: migrations anônimas, comandos `$signature`, jobs `ShouldQueue`, `casts()` no Laravel 11+, rotas nomeadas, objetos Rule em `app/Rules` e `Mail::fake()` ou `Bus::fake()` para isolar serviços do framework. Uma bifurcação real não basta por si só. Avalie o lado escolhido pelo app e registre apenas o lado que um agente não escolheria sozinho: closures inline em toda parte, accessors legados, uma camada de query personalizada. Cuidado também com falsas bifurcações. "Sem Mockery" ao lado de fakes de facade não é uma escolha contra Mockery, porque eles simulam coisas diferentes. O teste para cada candidato: sem esta regra, o próximo agente provavelmente escreveria diferente? Apenas "sim" merece uma regra.
- Escolhas arquiteturais são ouro. Registre presença e ausência deliberada. O padrão estrutural ao qual o app se compromete é a convenção de maior sinal e a única que nenhuma ferramenta decide: classes Action e como são invocadas (`handle` / `execute` / `__invoke`), objetos de serviço, objetos de query dedicados expondo `builder()`, DTOs (`spatie/laravel-data` vs classes `readonly`), validação com Form Request vs inline, espinha dorsal de eventos e listeners vs chamadas diretas, e pastas de domínio ou módulo. Registre também uma não-adoção consistente, como "consultar Eloquent diretamente nos controllers, sem camada de repositório", para que o próximo agente siga o nível do app em vez de exagerar na engenharia.
- Nunca duplique `.ai/rules`. Leia `.ai/rules/index.md` e os arquivos de área antes da varredura. Uma dimensão já coberta ali é marcada como concluída e pulada.
- Evidência ou silêncio. Uma convenção precisa de pelo menos 3 exemplos consistentes e nenhum rival relevante para se tornar candidata. Todo veredito do Passo 1 aplica esse critério.
- A regra registrada afirma a convenção, nada mais. Uma ou duas linhas imperativas: este projeto faz X, portanto faça X aqui. Mantenha evidências de detecção fora. Sem contagens, proporções, uso atual, listas de arquivos ou caminhos de exemplo, porque isso é prova para a etapa de confirmação, não parte da regra. No máximo um fragmento curto de sintaxe, e aponte para `search-docs` para detalhes da API.

## Processo

Cada passo termina em um critério de conclusão verificável. Não avance até que ele seja atendido.

Distribua em paralelo sempre que puder. Os grupos da checklist são independentes, portanto podem rodar em paralelo. Se o seu ambiente puder iniciar subagentes (uma ferramenta Task, dispatch ou equivalente), faça o Passo 0 você mesmo e entregue cada grupo da checklist (A a J) e o mapa de arquitetura ao seu próprio subagente. Cada subagente executa os greps, lê alguns arquivos representativos e retorna vereditos estruturados (dimensão, veredito, evidência, glob / título / nota propostos). Você agrega, remove duplicatas e executa os Passos 3 a 5. Distribuir em paralelo é muito mais rápido em um app real. Sem subagentes, execute os passos em sequência, com o mesmo critério e a mesma saída.

### Passo 0: Orientar-se

Leia `composer.json` (pacotes instalados indicam quais grupos da checklist se aplicam), a configuração de `pint.json` / PHPStan / Rector, `.ai/rules/index.md` se existir e, mais importante, mapeie a árvore de `app/`. Liste cada diretório sob `app/` (e qualquer `Modules/`, `src/`, `packages/` ou raiz de domínio). Cada pasta além do esqueleto padrão do Laravel (`Http`, `Models`, `Providers`, `Console`, `Exceptions`) é um padrão estrutural adotado pelo app e candidata a uma regra de alto valor: `Actions`, `Services`, `Data` ou DTOs, `Queries`, `Repositories`, `ViewModels`, `Pipelines`, `Support`, `Enums`, `Contracts`, `Observers` ou raízes `Domain` e módulos. Anote cada uma. Você confirmará como ela é usada no Passo 2.

Este app não possui pacotes Livewire/Inertia/Flux instalados. Trate o grupo de frontend como provavelmente apenas API: confirme em `resources/views` antes de gastar tempo ali e pule as dimensões de Livewire/Inertia/Flux.

Concluído quando: você tiver os grupos aplicáveis da checklist, as dimensões já registradas em `.ai/rules` e uma lista de cada diretório não padrão de `app/` mapeado para o padrão que representa.

### Passo 1: Varredura predefinida

Abra `references/checklist.md` e avalie cada dimensão aplicável usando suas dicas de busca. Dê a cada uma exatamente um veredito:

- Pattern (Padrão). Atinge o critério, rival abaixo de ~20% dos locais e reflete uma escolha real (passa no teste de decisões vs padrões padrão). Candidata a registro. Cite 2 a 3 arquivos de exemplo.
- Conflict (Conflito). Ambos os estilos presentes em números relevantes. Relate a divisão com contagens e arquivos de exemplo. Nunca registre um vencedor preferido enquanto o código permanecer misto, nem mesmo no modo yolo, porque isso descreveria uma aspiração e não a realidade. Registre apenas se o usuário identificar uma fronteira estável de caminho ou contexto que explique os dois estilos. Caso contrário, adie até o código ser reconciliado.
- Default (Padrão do framework). Consistente, mas um padrão do framework ou prática comum que o agente já escreve sem ser instruído. Pule como irrelevante, não é uma convenção.
- No signal (Sem sinal). Abaixo do critério: recurso não utilizado ou poucos exemplos. Pule silenciosamente (no máximo uma linha de resumo).
- Tooling-owned ou Already-recorded (Gerenciado por ferramenta ou já registrado). Pule conforme as regras básicas.

Concluído quando: cada dimensão aplicável tiver exatamente um desses vereditos.

### Passo 2: Passada aberta

Primeiro, feche o mapa de arquitetura do Passo 0. Para cada diretório não padrão de `app/` listado, confirme como o padrão é usado e aplique os mesmos testes de evidência e decisões vs padrões padrão do Passo 1. Diretórios padrão de geradores ou pouco usados como `Rules`, `Observers`, `Mail` e `Notifications` são sinais para inspecionar, não convenções automáticas. Torne candidatos os padrões estruturais genuínos: classes Action invocadas via `handle` / `execute` / `__invoke`, Services injetados no construtor, objetos `Queries` expondo `builder(): Builder`, DTOs como classes `readonly` ou `spatie/laravel-data`, pastas de módulo ou domínio como unidade de organização. Restrinja cada padrão qualificado ao glob de seu próprio diretório. Registre também uma ausência deliberada consistente, como "sem camada de repositório, controllers consultam Eloquent diretamente", para que o próximo agente mantenha o mesmo nível do app.

Em seguida, encontre os outros padrões específicos desta base de código: classes base ou abstratas que a maioria do código estende, traits usadas em toda parte, escopo de tenancy ou autorização tecido nas queries, esquemas de nomenclatura e helpers personalizados. Mesmo critério de evidência, cite arquivos. Registre todo padrão estrutural genuíno e limite os demais achados internos a ~5 para manter a passada com alto sinal.

Concluído quando: cada diretório não padrão de `app/` do Passo 0 tiver um veredito e a passada tiver produzido seus achados internos citados (ou concluído que não há nenhum).

### Passo 3: Confirmar

Apresente todos os candidatos em um único lote. Por item: dimensão, veredito, evidência (contagens e arquivos) e exatamente o `glob` ou `globs` / `title` / `note` propostos. Apresente conflitos como perguntas sobre uma fronteira de contexto existente ou limpeza adiada, não como escolha de estilo futuro.

O modo padrão é confirmar: registre apenas o que o usuário aprovar. Mude para yolo apenas quando a invocação disser isso ("yolo", "don't ask", "just record them"); então registre todos os candidatos de padrão sem perguntar. Conflitos ainda vão para o usuário mesmo no modo yolo.

Concluído quando: cada candidato for aprovado, rejeitado ou (no caso de conflitos) decidido.

### Passo 4: Registrar

Faça uma chamada `record-rule` para cada glob ao qual uma convenção aprovada se aplica. Escolha os globs mais específicos que cobrem a evidência citada na tabela de mapeamento abaixo. Se uma convenção abrange models e migrations, registre-a em ambos os domínios para que agentes a descubram a partir de qualquer caminho. O `note` é a convenção pura: remova todo vestígio da detecção (veja a regra básica). Se `record-rule` estiver indisponível (regras desabilitadas), informe o texto completo da regra para que o usuário possa habilitar `BOOST_RULES_ENABLED` ou adicioná-la manualmente.

Registre isto:

> Accessors e mutators: use o estilo legado de métodos mágicos (`getXxxAttribute()` / `setXxxAttribute()`), não a classe `Attribute`. Siga esse padrão nos models.

Não isto:

> Accessors/mutators usam o estilo legado de métodos mágicos; o estilo da classe `Attribute` não é usado em nenhum lugar (13 legados, 0 classe Attribute), ex.: `app/Models/Post.php`. Siga o estilo legado nos models existentes.

Concluído quando: cada item aprovado tiver uma resposta de sucesso da ferramenta e qualquer falha for relatada com o texto da regra.

### Passo 5: Resumir

Liste as regras registradas (arquivo e título), conflitos adiados pelo usuário, ausências de sinal relevantes e lembre o usuário de fazer commit de `.ai/rules` para que sua equipe e agentes compartilhem as convenções.

## Mapeamento de globs

Anexe cada regra ao caminho mais específico que cobre sua evidência. Não use `app/**` quando uma subárvore servir. Combine o glob com onde o código vive, o que não é igual em um esqueleto padrão e em um layout modular ou DDD. Use o mapa de `app/` do Passo 0 para escolher o caminho real.

Exemplos:

- Models: `app/Models/**` em um app padrão, ou `app/Modules/Blog/Models/**` / `src/Domain/Blog/**` em um modular.
- Controllers, rotas, validação, respostas: `app/Http/**`, ou `app/Modules/*/Http/**` quando cada módulo possui sua própria camada HTTP.
- Actions, Services, DTOs: `app/Actions/**`, `app/Services/**`, `app/Data/**`, ou o caminho de módulo usado pelo app.
- Testes: `tests/**`.
- Migrations e banco de dados: `database/migrations/**`.
- Realmente global no app (raro, ex.: recuperação de autenticação): `app/**`.

`record-rule` recebe um glob. Quando uma convenção abrange dois domínios (ex.: chaves UUID tocam models e migrations), chame-o uma vez por domínio com o mesmo título e nota. Mencionar outro caminho na nota não torna a regra descobrível lá.

## Casos extremos

- Regras desabilitadas ou `record-rule` ausente: a detecção é somente leitura, portanto os Passos 0 a 3 ainda rodam e o registro recorre ao caminho manual no Passo 4.
- App minúsculo ou recém-criado: a maioria das dimensões cai em sem sinal. Diga isso ("ainda não há código suficiente para inferir convenções") e não registre nada.
- App enorme: cada dimensão é um grep limitado mais algumas leituras de arquivo. Amostre arquivos representativos, não leia tudo.
- Reexecuções: ler `.ai/rules` no Passo 0 torna as reexecuções incrementais, então apenas dimensões novas ou não decididas aparecem.
- Layout não padrão (módulos, DDD): a passada aberta captura o próprio layout como convenção nº 1. Adapte os globs na tabela de mapeamento aos caminhos observados.
