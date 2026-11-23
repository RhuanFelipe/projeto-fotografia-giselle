# Boas práticas de migrations

## Gere migrations com o Artisan

Use `php artisan make:migration` para gerar o nome de arquivo com timestamp e a estrutura da migration.

```bash
php artisan make:migration create_posts_table
php artisan make:migration add_slug_to_posts_table
```

## Defina restrições de chave estrangeira deliberadamente

Use `constrained()` quando suas convenções de nomenclatura e ações padrão corresponderem ao relacionamento. Especifique a tabela ou o comportamento de exclusão quando não corresponderem.

```php
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
$table->foreignId('author_id')->constrained('users');
```

Não adicione um índice duplicado de coluna única sem verificar como o driver do banco de dados trata os índices de chave estrangeira e os índices já criados pela migration.

## Trate migrations implantadas como imutáveis

Depois que uma migration tiver sido executada em um ambiente compartilhado ou de produção, crie uma nova migration para alterações posteriores. Editar o arquivo antigo faz com que instalações novas difiram de instalações atualizadas.

Para uma migration local que não foi compartilhada ou implantada, editá-la e executá-la novamente pode ser mais simples.

## Projete índices para consultas reais

Adicione índices com base nos padrões de consulta, seletividade, custo de escrita e na capacidade do banco de dados de usar índices compostos. Uma coluna que aparece em `WHERE`, `ORDER BY` ou `JOIN` não precisa automaticamente de seu próprio índice.

Declare cada índice selecionado na migration de esquema que cria ou altera a tabela relevante. Confirme índices importantes com dados representativos e o plano de consulta do banco de dados. Evite índices redundantes cujas colunas iniciais duplicam um índice existente sem atender a uma consulta distinta. Consulte as regras de desempenho de banco de dados e consultas avançadas para orientações sobre seleção de índices e ordem de colunas.

## Execute em etapas alterações que afetam linhas existentes

Adicionar uma coluna obrigatória ou única a uma tabela populada geralmente requer várias etapas seguras para implantação. Adicione uma coluna anulável (`nullable`), implante código que consiga lidar com ambos os estados, preencha as linhas existentes em lotes limitados (backfill) e, em seguida, adicione a restrição ou índice obrigatório após os dados estarem válidos.

Não presuma que esta migration seja segura em uma tabela populada:

```php
$table->string('slug')->unique();
```

Preenchimentos (backfills) grandes geralmente funcionam melhor como um comando ou job observável e reiniciável do que dentro de uma migration de esquema. Pequenas alterações determinísticas de dados podem ser razoáveis em uma migration quando você compreende seu comportamento de bloqueio, transação e implantação.

## Espelhe valores padrão apenas quando models não salvos precisarem deles

O banco de dados aplica um valor padrão quando insere uma linha, não quando você instancia um model. Espelhe o valor em `$attributes` do model apenas quando o código da aplicação precisar observar esse padrão antes da persistência e mantenha ambas as definições sincronizadas.

```php
// Migration
$table->string('status')->default('pending');

// Model
protected $attributes = [
    'status' => 'pending',
];
```

## Torne os rollbacks honestos

Implemente `down()` quando puder reverter a alteração com segurança. Um rollback que remove colunas populadas ou não consegue restaurar dados transformados é destrutivo, mesmo que seja sintaticamente reversível. Documente essa limitação e prefira uma migration de correção futura (forward-fix) em produção.

## Mantenha as migrations focadas

Mantenha cada migration pequena o suficiente para raciocinar sobre ela, implantar e reverter. Separe preenchimentos de longa duração das alterações de esquema quando a divisão reduzir bloqueios e oferecer suporte à implantação em fases. Não divida operações relacionadas apenas para impor uma separação genérica entre definição de dados e manipulação de dados.
