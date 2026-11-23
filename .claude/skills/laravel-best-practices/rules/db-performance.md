# Boas práticas de desempenho de banco de dados

## Faça eager loading de relacionamentos antes de iterar

Quando o código acessa um relacionamento em muitos modelos, faça o eager loading do relacionamento com `with()`. O eager loading evita o padrão de consulta N+1: uma consulta inicial mais uma consulta de relacionamento por modelo. O lazy loading é razoável quando o código pode não precisar do relacionamento ou quando apenas um modelo está envolvido.

Versão com lazy loading:

```php
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name;
}
```

Versão com eager loading:

```php
$posts = Post::with('author')->get();
foreach ($posts as $post) {
    echo $post->author->name;
}
```

Restrinja um eager load quando o código não precisar das colunas grandes. Inclua a chave primária do modelo relacionado e todas as colunas que o Eloquent precisa para corresponder ao relacionamento. Neste exemplo, `users.id` e `posts.user_id` correspondem posts a usuários, e selecionar `posts.id` mantém a chave primária de cada modelo relacionado:

```php
$users = User::with(['posts' => function ($query) {
    $query->select('id', 'user_id', 'title')
          ->where('published', true)
          ->latest()
          ->limit(10);
}])->get();
```

## Previna lazy loading em desenvolvimento

Habilite a prevenção de lazy loading em `AppServiceProvider::boot()` para capturar consultas N+1 durante o desenvolvimento.

```php
public function boot(): void
{
    Model::preventLazyLoading(! app()->isProduction());
}
```

Com a prevenção habilitada, acessar um relacionamento não carregado lança uma `LazyLoadingViolationException` por padrão. Para personalizar o tratamento da violação, use `handleLazyLoadingViolationUsing()`.

## Selecione apenas as colunas necessárias

Quando omitir colunas grandes de texto, binário ou JSON trouxer um benefício significativo, selecione apenas as colunas que a operação precisa.

Todas as colunas:

```php
$posts = Post::with('author')->get();
```

Colunas selecionadas:

```php
$posts = Post::select('id', 'title', 'user_id', 'created_at')
    ->with(['author:id,name,avatar'])
    ->get();
```

Quando você limitar as colunas selecionadas, mantenha todas as chaves que o Eloquent precisa para a correspondência. Um relacionamento `belongsTo` precisa de sua chave estrangeira na consulta pai e da chave do proprietário na consulta relacionada. Um relacionamento `hasMany` precisa da chave local do pai e da chave estrangeira do modelo relacionado.

## Processe grandes conjuntos de dados incrementalmente

Quando carregar todo o conjunto de resultados exceder o orçamento prático de memória da aplicação, use chunking ou iteração lazy.

Carrega o conjunto completo de resultados:

```php
$users = User::all();
foreach ($users as $user) {
    $user->notify(new WeeklyDigest);
}
```

Processa blocos (chunks) limitados:

```php
User::where('subscribed', true)->chunk(200, function ($users) {
    foreach ($users as $user) {
        $user->notify(new WeeklyDigest);
    }
});
```

Use `chunkById()` quando atualizações puderem alterar quais linhas correspondem à consulta. O `chunk()` padrão usa paginação por offset, então as posições dos resultados podem mudar conforme as linhas são alteradas:

```php
User::where('active', false)->chunkById(200, function ($users) {
    $users->each->delete();
});
```

Para iteração somente leitura que usa apenas atributos do modelo, `cursor()` executa uma consulta e hidrata um modelo por vez. Alguns drivers de banco de dados ainda armazenam em buffer os resultados brutos. Use `lazy()` quando precisar fazer eager loading de relacionamentos em blocos. Use `lazyById()` ou `chunkById()` quando atualizações puderem alterar quais linhas correspondem à consulta. Consulte as regras de coleções para detalhes sobre essas escolhas.

## Adicione índices para padrões de consulta medidos

Projete índices em torno de padrões de consulta frequentes e sensíveis a desempenho. A presença de uma coluna em `WHERE`, `ORDER BY`, `JOIN` ou `GROUP BY` não justifica por si só um índice. Seletividade, custo de escrita, índices existentes e o plano de execução do banco de dados são fatores importantes.

Schema sem um índice de consulta específico da aplicação:

```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->string('status');
    $table->timestamps();
});
```

Schema otimizado para `WHERE status = ? ORDER BY created_at`:

```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->string('status');
    $table->timestamps();
    $table->index(['status', 'created_at']);
});
```

Use dados semelhantes aos de produção e as ferramentas de plano de consulta do banco de dados para confirmar a ordem das colunas de um índice composto e se o índice realmente ajuda. Antes de adicionar um índice para uma chave estrangeira, verifique se o banco de dados já criou um.

## Conte relacionamentos sem carregá-los

Use `withCount()` quando precisar apenas das contagens dos relacionamentos. Carregar e hidratar todos os modelos relacionados desperdiça memória.

Carrega modelos relacionados:

```php
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->comments->count();
}
```

Seleciona contagens de relacionamentos:

```php
$posts = Post::withCount('comments')->get();
foreach ($posts as $post) {
    echo $post->comments_count;
}
```

Contagem condicional:

```php
$posts = Post::withCount([
    'comments',
    'comments as approved_comments_count' => function ($query) {
        $query->where('approved', true);
    },
])->get();
```

## Mantenha consultas fora dos templates Blade

Prepare os dados antes de renderizar um template Blade, por exemplo em um controller, em um serviço de consulta ou em um view composer. Consultas fora do template permanecem visíveis e testáveis.

Consulta no template:

```blade
@foreach (User::all() as $user)
    {{ $user->profile->name }}
@endforeach
```

Dados preparados antes da renderização:

```php
// Controller
$users = User::with('profile')->get();

return view('users.index', compact('users'));
```

```blade
@foreach ($users as $user)
    {{ $user->profile->name }}
@endforeach
```
