---
name: deploying-to-cloud
description: "Faz deploy e gerencia aplicações Laravel no Laravel Cloud usando a CLI `cloud`. Use quando o usuário quiser fazer deploy de um app, enviar para a Cloud, criar ou gerenciar aplicações, ambientes, bancos de dados, caches, object storage, filas, domínios, instâncias, processos em segundo plano, segredos, compute, tarefas agendadas ou infraestrutura do Laravel Cloud; ou consultar cobrança, uso ou gastos. Aciona em deploy, envio, gerenciamento da Cloud, configuração de ambiente, provisionamento de banco de dados, consultas de cobrança ou uso, CLI `cloud` e solução de problemas de deploy no Laravel Cloud."
license: MIT
metadata:
  author: laravel
---

# Fazendo Deploy com Laravel Cloud

Use a [documentação do Laravel Cloud](https://cloud.laravel.com/docs/llms.txt) para obter detalhes atualizados sobre o comportamento dos recursos. Use a CLI do Cloud para operações na Cloud em vez de adivinhar fluxos de dashboard ou API. Instale-a no projeto e execute como `./vendor/bin/cloud` por padrão; use o comando `cloud` instalado globalmente apenas como alternativa. Os comandos abaixo estão escritos como `cloud` por brevidade; execute-os como `./vendor/bin/cloud`, a menos que esteja usando a instalação global.

## Configuração da Aplicação

- O Laravel Cloud faz deploy a partir do GitHub, GitLab ou Bitbucket. Uma nova aplicação Laravel requer PHP 8.2 ou superior, Laravel 9 ou superior, um provedor Git conectado e uma região de deploy.
- A Cloud cria ambientes para aplicações. Use ambientes separados de produção, staging e preview; cada ambiente possui seu próprio compute, recursos e configurações de deploy.
- Mantenha o compute da aplicação e os recursos anexados na mesma região sempre que possível.
- A Cloud constrói uma imagem Docker usando a versão do PHP selecionada, executa os comandos de build e deploy configurados e direciona o tráfego para um deploy bem-sucedido com zero downtime. O push-to-deploy vem habilitado por padrão, e deploys manuais e hooks de deploy também estão disponíveis.

## Build e Deploy

- Um comando típico de build no Laravel é `composer install --no-dev && npm run build`.
- Execute comandos de otimização e geração de cache durante o build, não durante o deploy. Um comando típico de deploy é `php artisan migrate --force`.
- Comandos de build e deploy têm timeout de 15 minutos. Comandos de deploy rodam imediatamente antes de a release entrar no ar, e alterações no sistema de arquivos feitas por comandos de deploy não são persistidas.
- Não adicione `php artisan queue:restart`, `php artisan horizon:terminate`, `php artisan optimize:clear` ou `php artisan storage:link` aos comandos de deploy. A Cloud gerencia reinicializações de workers e processos; alterações no sistema de arquivos durante o deploy não são persistentes.
- Após alterar configurações de ambiente, recursos anexados ou segredos vinculados, faça o redeploy do ambiente para que as mudanças entrem em vigor.

## Configuração e Recursos

- Bancos de dados, caches e object storage anexados injetam suas variáveis de conexão automaticamente. Variáveis de ambiente personalizadas têm precedência sobre valores injetados.
- Use o Secrets Manager para valores criptografados em nível de organização compartilhados entre ambientes. Valores de segredos não podem ser lidos após a criação; faça redeploy dos ambientes afetados após criar, atualizar, vincular, desvincular ou excluir um segredo.
- Os sistemas de arquivos dos ambientes são efêmeros e não são compartilhados entre réplicas. Use um banco de dados ou Laravel Valkey para cache e sessões persistentes, e Laravel Cloud Object Storage para arquivos persistentes. Não dependa de arquivos locais para sobreviver a um deploy.

### Object Storage e Visibilidade de Arquivos

- O Laravel Cloud Object Storage usa Cloudflare R2. O R2 aplica visibilidade em nível de bucket; um bucket não pode misturar objetos privados e públicos.
- Para arquivos privados, use sempre `Storage::disk()` sem argumentos, como `Storage::disk()->put(...)`, para que o Laravel use o disco padrão do ambiente. Não passe nome de disco para armazenamento privado/padrão. Anexe um bucket Cloud privado como o disco padrão do ambiente.
- Para arquivos públicos, use o disco público nomeado: `Storage::disk('public')->put(...)`. Anexe um segundo bucket Cloud configurado como público e dê a ele o nome de disco `public`.
- Aplicações que usam arquivos privados e públicos precisam, portanto, de dois buckets de Cloud Object Storage anexados ao ambiente: um bucket padrão privado e um bucket público chamado `public`.
- Não defina `visibility: 'public'` por arquivo ou no Flysystem para Cloud Object Storage. O R2 não suporta cabeçalhos ACL por objeto e rejeita essas requisições; escolha a visibilidade do bucket ao criá-lo.
- Buckets privados não são acessíveis pela internet, mas o Laravel pode gerar URLs públicas temporárias com `Storage::temporaryUrl(...)`. Buckets públicos expõem todos os objetos por meio de sua URL pública fornecida pela Cloud.
- Instale o adaptador S3 do Flysystem antes de usar o Cloud Object Storage: `composer require league/flysystem-aws-s3-v3 "^3.0" --with-all-dependencies`.

## Filas e Agendamento

- Filas gerenciadas (Managed queues) são a opção recomendada. Elas provisionam workers dedicados e escalam automaticamente conforme o trabalho na fila.
- Filas gerenciadas exigem uma versão recente suportada do Laravel e `aws/aws-sdk-php`; consulte a documentação atual da Cloud antes de alterar dependências.
- Habilite o agendador (scheduler) em um cluster App ou Worker para executar `php artisan schedule:run` a cada minuto. Quando um ambiente tiver múltiplas réplicas, use `onOneServer` do Laravel para tarefas que devem rodar apenas uma vez.
- Apenas tamanhos de compute Flex podem escalar para zero. Ambientes scale-to-zero acordam para tarefas agendadas e jobs em fila do Laravel, mas jobs de longa duração podem ser interrompidos quando o timeout de inatividade for atingido. Use filas gerenciadas para cargas de trabalho que não podem ser interrompidas.

## Domínios e Armazenamento

- Cada ambiente recebe um domínio `laravel.cloud` após seu primeiro deploy bem-sucedido. A Cloud verifica automaticamente domínios personalizados e provisiona SSL após a configuração dos registros DNS necessários.
- Não use o sistema de arquivos efêmero para uploads persistentes, arquivos gerados, cache ou dados de sessão. Use o recurso apropriado da Cloud.

## Cloud CLI

### Configuração

```shell
composer require --dev laravel/cloud-cli
./vendor/bin/cloud auth -n
```

Se uma instalação local no projeto não estiver disponível, instale a CLI globalmente com `composer global require laravel/cloud-cli` e invoque como `cloud`.

`cloud auth` abre um navegador. Se não houver navegador disponível, defina `LARAVEL_CLOUD_TOKEN` no ambiente. Ele sobrescreve qualquer token salvo e não grava nada em disco. Para salvar um token, execute `cloud auth:token --add --token=<token> -n` ou envie via pipe com `echo "$TOKEN" | cloud auth:token --add -n`.

### Comandos

Os comandos seguem um padrão CRUD: `resource:list`, `resource:get`, `resource:create`, `resource:update`, `resource:delete`.

Recursos disponíveis: `application`, `environment`, `instance`, `database-cluster`, `database`, `cache`, `bucket`, `domain`, `websocket-cluster`, `background-process`, `secret`, `command`, `deployment`.

Alguns recursos têm comandos adicionais (ex.: `domain:verify`, `database:open`, `instance:sizes`, `cache:types`, `database:types`, `<resource>:metrics`). Descubra-os via `cloud -h`.

Nunca fixe assinaturas de comandos no código. Execute sempre `cloud <command> -h` para descobrir as opções em tempo de execução.

### Flags da CLI

- Sempre adicione `-n` a todos os comandos para evitar que a CLI trave esperando entrada.
- Nunca use `-q` ou `--silent`; eles suprimem toda a saída.

Combinações de flags por operação:
- Leitura (`:list`, `:get`) → `--json -n`
- Criação (`:create`) → `--json -n`
- Atualização (`:update`) → `--json -n --force`
- Exclusão (`:delete`) → `-n --force` (sem `--json`)
- Variáveis de ambiente → `-n --force`
- Deploy ou ship → `-n` com todas as opções passadas explicitamente (sem `--json`)

### Fluxo de Deploy

Identifique a tarefa e siga o caminho correspondente:

- Primeiro deploy: inspecione `cloud ship -h`, depois execute `cloud ship -n` com todos os valores obrigatórios.

- Aplicação existente:
  ```shell
  cloud deploy {app_name} {environment} -n --open
  cloud deploy:monitor -n
  ```

- Variáveis de ambiente: `cloud environment:variables -n --force`. Para copiar chaves do `.env` local e fazer deploy em um passo: `cloud deploy {app_name} {environment} -n --push-env-keys=KEY_ONE,KEY_TWO`

- Segredos: `echo "$VALUE" | cloud secret:create --name=NAME --json -n`, depois `cloud environment-secret:attach`

- Provisionar infraestrutura: `cloud <resource>:create --json -n`

- Monorepo (aplicação em um subdiretório): adicione `--root-directory=<subdir>` ao `cloud ship` ou `cloud application:create`.

- Domínio personalizado: `cloud domain:create --json -n`, depois `cloud domain:verify -n`.

- Edge cache: `cloud environment:purge-edge-cache {environment} -n` limpa tudo; passe `--path=/blog/post`, `--prefix=/blog/` ou `--tag=<cache-tag>` para limpar parcialmente. Tags exigem uma edge network dedicada.

- Domínio Laravel Cloud: `cloud environment:vanity-domain {environment} --name=<subdomain> --deploy -n --force`. Passe apenas a primeira parte do domínio. O novo domínio entra em vigor no próximo deploy, que `--deploy` inicia e monitora. Só pode ser alterado uma vez a cada 30 minutos, portanto confirme antes com o usuário.

- Padrões de repositório: `cloud repo:config {application} -n` define os padrões locais de aplicação e organização. Passe `--organization=<id|name|slug>` quando o usuário tiver múltiplas organizações.

Para operações em várias etapas, veja [reference/checklists.md](reference/checklists.md).

- Se as necessidades do usuário não estiverem claras, pergunte antes de executar qualquer comando.

### Quando um Comando Falhar

1. Leia a saída de erro.
2. Verifique o status do recurso com `:list --json -n` ou `:get --json -n`.
3. Para erros de autenticação, execute `cloud auth -n`.
4. Corrija o problema e execute o comando novamente.
5. Se o mesmo erro ocorrer após uma correção, pare e pergunte ao usuário em vez de repetir a operação.

Sempre execute `cloud deploy:monitor -n` após cada deploy. Se falhar, execute `cloud deployment:logs {deploymentId} --json -n` para encontrar a etapa de build ou deploy com `"status": "failed"` e leia seu `output`. Mostre ao usuário o que deu errado antes de tentar corrigir.

### Delegação para Subagentes

Delegue operações com saída extensa para subagentes usando a ferramenta Task para manter a janela de contexto principal pequena. Apenas o resumo retorna; a saída verbosa fica no contexto do subagente.

Delegue estes comandos para um subagente:
- `cloud deploy:monitor -n` — logs de deploy podem ser muito longos
- `cloud deployment:get --json -n` — detalhes completos do deploy
- `cloud deployment:logs --json -n` — saída completa de build ou deploy de cada etapa
- `cloud <resource>:list --json -n` — listar muitos recursos gera um JSON grande
- `cloud <resource>:metrics --json -n` — todos os pontos de dados são incluídos; restrinja com `--fields` (ex.: `--fields=period,cpuUsage.average`)
- `cloud command:run` — quando a saída puder ser longa
- `cloud usage --detailed --json -n` — o payload inclui detalhes de cada banco, cache, bucket, websocket e aplicação
- Buscar documentação em https://cloud.laravel.com/docs/llms.txt via `WebFetch`

Mantenha no contexto principal:
- Comandos curtos como `:create`, `:delete`, `:update` — a saída é pequena
- `cloud deploy -n` — você precisa do ID do deploy imediatamente
- Qualquer comando cujo resultado seja necessário imediatamente para o próximo passo

### Regras

Siga estas regras:
- Seleção de flags — use sempre as combinações documentadas acima
- Sequência de deploy — faça o deploy e depois monitore, nunca pule o monitoramento
- Comandos destrutivos — sempre confirme com o usuário antes, mostre o comando e aguarde aprovação. Isso inclui excluir aplicações, ambientes, bancos de dados, caches, buckets, domínios ou segredos, e desvincular o Resend.
- Loop de erros — diagnostique, corrija uma vez, pergunte ao usuário se falhar novamente

Use julgamento para:
- Tamanhos de instância, regiões, tipos de cluster — pergunte ao usuário se não especificado
- Quais recursos provisionar — com base no que o usuário descrever
- Ordem de provisionamento — não há sequência rígida exigida
- Como apresentar a saída — resumir, mostrar bruto ou extrair campos conforme o contexto

### Segredos (Secrets)

Segredos são valores criptografados compartilhados na organização e anexados a ambientes. A CLI criptografa os valores localmente, então texto plano nunca chega à API.

```shell
cloud secret:list --json -n
echo "$VALUE" | cloud secret:create --name=STRIPE_KEY --json -n
cloud environment-secret:attach {environment} {secretId} -n
cloud environment-secret:detach {environment} {secretId} --force -n
cloud environment-secret:list {environment} --json -n
```

Envie o valor via pipe. `--value=` funciona, mas deixa o texto plano no histórico do shell e na lista de processos.

`secret:update`, `secret:delete`, `environment-secret:attach` e `environment-secret:detach` recebem IDs de segredo, não nomes — nomes não são únicos. Leia os IDs com `cloud secret:list --json -n`.

Não existe `secret:get`. `environment-secret:detach` remove um segredo de um ambiente e o mantém; `secret:delete` exclui o segredo e o desvincula de todos os lugares.

Segredos exigem a extensão PHP `sodium`. Nenhum outro comando exige.

Faça redeploy dos ambientes afetados após criar, atualizar, anexar, desvincular ou excluir um segredo.

### E-mail (Resend)

O Resend envia os e-mails de um ambiente. Conectar uma conta Resend e verificar domínios de envio acontecem no dashboard; a CLI não faz nenhum dos dois. Quando `resend:attach` informar que não há domínios verificados, forneça ao usuário o link das configurações de integração retornado no erro.

```shell
cloud resend:domains --status=verified --json -n
cloud resend:attach {environment} --from-address=hello@{verifiedDomain} --from-name="My App" --json -n
cloud resend:update {environment} --from-address=team@{verifiedDomain} --json -n
cloud resend:keys {environment} --json -n
cloud resend:detach {environment} --force -n
```

- O endereço de remetente deve usar um domínio de envio verificado. `--from-name` usa o nome da aplicação por padrão.
- `resend:attach` cria uma nova chave de envio. Para compartilhar uma com outro ambiente, passe `--reuse-key-id` com um ID de `resend:keys`.
- Ao anexar, a Cloud define `RESEND_API_KEY`, `MAIL_MAILER`, `MAIL_FROM_ADDRESS` e `MAIL_FROM_NAME`, substituindo os que já existiam no ambiente.
- A aplicação precisa de `resend/resend-php`. Com `-n`, `resend:attach` apenas avisa se estiver faltando; execute `composer require resend/resend-php` no projeto.
- Desvincular exclui a chave de envio, a menos que outro ambiente a utilize.
- Faça redeploy do ambiente após anexar, atualizar ou desvincular o Resend.

### Acesso Remoto

#### Tinker (v0.2.0 ou superior)

Execute código PHP diretamente em um ambiente Cloud:

```shell
cloud tinker {environment} --code='Your PHP code here' --timeout=60 -n
```

- `--code` — código PHP a executar (obrigatório em modo não interativo)
- `--timeout` — número máximo de segundos para aguardar a saída (padrão: 60)

O código deve imprimir resultados explicitamente usando `echo`, `dump` ou similar; expressões isoladas não geram saída.

Sempre passe `--code` e `-n` para evitar prompts interativos.

#### Comandos Remotos

Execute comandos de shell em um ambiente Cloud:

```shell
cloud command:run {environment} --cmd='your command here' -n
```

- `--cmd` — comando a executar (obrigatório em modo não interativo)
- `--no-monitor` — pula o streaming de saída em tempo real
- `--copy-output` — copia a saída para a área de transferência

Revisar comandos anteriores:

- `cloud command:list {environment} --json -n` — lista o histórico de comandos
- `cloud command:get {commandId} --json -n` — obtém detalhes e saída de um comando específico

### Cobrança e Uso

Visualize a cobrança e o uso da organização atual:

```shell
cloud usage --json -n
```

- `--period=current|previous|1|2|3` — Período de cobrança (padrão: `current`; `1`, `2` e `3` correspondem a um, dois e três períodos atrás, respectivamente). Outros valores retornam erro.
- `--environment=<id>` — filtra o uso para um único ambiente
- `--detailed` — inclui detalhamento por aplicação, recurso e complemento
- `--json` — saída legível por máquina (sempre use junto com `-n`)

Consultas comuns:

- Gasto atual: `cloud usage --json -n | jq '.currentSpendCents'`
- Fatura do mês passado: `cloud usage --period=previous --json -n`
- Um ambiente, detalhamento completo: `cloud usage --environment=<id> --detailed --json -n`

Todos os valores estão em centavos. As chaves estão em camelCase em todos os níveis (ex.: `currentSpendCents`, `bandwidth.allowanceBytes`, `databases[].totalCents`, `applications[].totalCostCents`).

### Configuração

1. Ambiente: `LARAVEL_CLOUD_TOKEN` — token de API, com precedência sobre qualquer token salvo (vazio conta como não definido)
2. Global: `~/.config/cloud/config.json` — tokens de autenticação e preferências
3. Local do repositório: `.cloud/config.json` — padrões de app e ambiente (definido por `cloud repo:config {application} -n`)
4. Argumentos da CLI sobrescrevem ambos os arquivos de configuração

Passe a aplicação para `repo:config`. Sem ela, o comando precisa solicitar entrada e falha com `-n` quando a organização possui mais de uma aplicação. Comandos de deploy não precisam desses padrões; passe a aplicação e o ambiente diretamente para eles.

Usar múltiplas organizações exige múltiplos tokens de API armazenados. Os comandos leem `organization_id` de `.cloud/config.json` para selecionar uma e falham se não estiver definido. Defina com `cloud repo:config {application} --organization=<id|name|slug> -n`.

`LARAVEL_CLOUD_TOKEN` armazena um token, portanto escolhe a organização por conta própria. Informar outra com `--organization` falha em vez de recorrer à organização do token.

## Documentação

Documentação do Laravel Cloud: https://cloud.laravel.com/docs/llms.txt

Quando o usuário perguntar como algo funciona ou precisar de uma explicação sobre algum recurso do Laravel Cloud, busque a documentação na URL acima usando `WebFetch` e use-a para fornecer respostas precisas.

## Quando Estiver Travado

- Busque https://cloud.laravel.com/docs/llms.txt para documentação oficial
- Execute `cloud <command> -h` para ver as opções de qualquer comando
- Execute `cloud -h` para descobrir comandos

## Verificação

1. Confirme a aplicação e o ambiente de destino antes de alterar ou fazer deploy de qualquer coisa.
2. Verifique as alterações pendentes no ambiente e os recursos necessários antes do deploy.
3. Monitore cada deploy até a conclusão com `cloud deploy:monitor -n`.
4. Para alterações em produção, verifique a URL da aplicação, logs, filas, tarefas agendadas e a saúde dos recursos relevantes.
