# Checklists para Operações em Múltiplas Etapas

Use estes checklists ao realizar configurações complexas. Copie o checklist relevante e acompanhe o progresso conforme avança.

## Configuração completa de ambiente (app + banco de dados + cache + domínio)

```
- [ ] Criar ou selecionar a aplicação
- [ ] Criar o ambiente
- [ ] Provisionar o banco de dados (`database-cluster:create` e depois `database:create`)
- [ ] Provisionar o cache (`cache:create`)
- [ ] Definir variáveis de ambiente (`environment:variables`)
- [ ] Criar e anexar quaisquer secrets (`secret:create` e depois `environment-secret:attach`)
- [ ] Anexar domínio personalizado (`domain:create` e depois `domain:verify`)
- [ ] Fazer deploy (`deploy` e depois `deploy:monitor`)
- [ ] Verificar se o deploy está no ar
```

## Novo app do zero

```
- [ ] Executar `cloud ship -n` com as opções necessárias
- [ ] Monitorar o status do deploy
- [ ] Definir variáveis de ambiente, se necessário
- [ ] Verificar se o app está acessível
```

## Adicionando um banco de dados a um ambiente existente

```
- [ ] Verificar clusters de banco de dados existentes (`database-cluster:list --json -n`)
- [ ] Criar um novo cluster, se necessário (`database-cluster:create --json -n`)
- [ ] Criar o banco de dados no cluster (`database:create --json -n`)
- [ ] Atualizar as variáveis de ambiente com os detalhes de conexão, se necessário
- [ ] Fazer redeploy se o app precisar carregar a nova configuração
```

## Adicionando um cache a um ambiente existente

```
- [ ] Verificar caches existentes (`cache:list --json -n`)
- [ ] Criar o cache (`cache:create --json -n`)
- [ ] Atualizar as variáveis de ambiente com os detalhes de conexão do cache, se necessário
- [ ] Fazer redeploy se o app precisar carregar a nova configuração
```

## Enviando e-mail com Resend

```
- [ ] Verificar domínios de envio verificados (`resend:domains --status=verified --json -n`)
- [ ] Se não houver nenhum, direcionar o usuário ao painel para conectar o Resend e verificar um domínio
- [ ] Anexar o Resend (`resend:attach {environment} --from-address=... --json -n`)
- [ ] Instalar `resend/resend-php` no projeto caso esteja faltando
- [ ] Fazer commit e redeploy (`deploy` e depois `deploy:monitor`)
```

## Configuração de domínio personalizado

```
- [ ] Criar o domínio (`domain:create --json -n`)
- [ ] Obter os registros DNS para configurar (`domain:get --json -n`)
- [ ] Orientar o usuário a adicionar os registros DNS no registrador de domínio
- [ ] Verificar o domínio (`domain:verify -n`)
- [ ] Confirmar que a verificação foi aprovada
```
