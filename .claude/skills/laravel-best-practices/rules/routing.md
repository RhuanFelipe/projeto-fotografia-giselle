# Boas práticas de roteamento e controllers

## Use implicit route model binding

Deixe o Laravel resolver os models a partir dos parâmetros da rota quando a busca padrão e o comportamento para model ausente atenderem ao endpoint.

Em vez de busca manual:

```php
public function show(int $id): View
{
    $post = Post::findOrFail($id);

    return view('posts.show', ['post' => $post]);
}
```

Use route model binding:

```php
public function show(Post $post): View
{
    return view('posts.show', ['post' => $post]);
}
```

## Aplique escopo em bindings aninhados

Use scoped bindings quando um recurso aninhado precisar pertencer ao seu recurso pai. Scoped bindings restringem a resolução do model. Eles não substituem a autorização.

```php
Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
    // The resolved post belongs to the resolved user.
})->scopeBindings();
```

## Use rotas de recurso para ações de recurso

Use `Route::resource()` ou `Route::apiResource()` quando o endpoint seguir as ações de resource-controller do Laravel. Defina rotas explícitas quando o comportamento não se encaixar nesse vocabulário.

```php
Route::resource('posts', PostController::class);

// Alternatively, for an API-only resource:
Route::apiResource('posts', ApiPostController::class);
```

`apiResource()` omite as rotas orientadas a HTML `create` e `edit`. Ele não adiciona um prefixo `/api`. Esse prefixo vem da configuração de rotas de API da aplicação.

## Organize controllers em torno de recursos

Por padrão, organize cada controller em torno de um recurso e use as ações padrão de recurso do Laravel: `index`, `show`, `create`, `store`, `edit`, `update` e `destroy`. Essa convenção mantém as rotas previsíveis e evita que controllers acumulem comportamentos não relacionados.

Quando um controller precisar de uma ação personalizada como `publish`, `approve` ou `archive`, considere primeiro se esse comportamento representa um recurso separado. Um resource controller focado fornece ao comportamento seu próprio limite de autorização, validação e middleware.

Ação personalizada no controller principal:

```php
Route::post('/podcasts/{podcast}/publish', [PodcastController::class, 'publish']);
```

O podcast publicado modelado como um recurso:

```php
Route::post('/published-podcasts/{podcast}', [PublishedPodcastController::class, 'store'])
    ->name('published-podcasts.store');

Route::delete('/published-podcasts/{podcast}', [PublishedPodcastController::class, 'destroy'])
    ->name('published-podcasts.destroy');
```

```php
class PublishedPodcastController extends Controller
{
    public function store(Podcast $podcast): RedirectResponse
    {
        $podcast->publish();

        return back();
    }

    public function destroy(Podcast $podcast): RedirectResponse
    {
        $podcast->unpublish();

        return back();
    }
}
```

Trate um verbo personalizado como um sinal de design, não como prova de que outro controller é necessário. Use parâmetros de query para filtragem simples e mantenha uma rota de ação explícita quando modelar a operação como um recurso obscureceria o domínio ou entraria em conflito com convenções estabelecidas do projeto.

## Mantenha os controllers focados em preocupações HTTP

Controllers devem coordenar entrada HTTP, autorização, validação, uma operação da aplicação e a resposta. Extraia lógica de negócio substancial ou reutilizável, mas não introduza uma action ou service apenas para satisfazer um limite arbitrário de linhas.

```php
public function store(StorePostRequest $request, CreatePostAction $create): RedirectResponse
{
    $post = $create->handle($request->validated());

    return redirect()->route('posts.show', $post);
}
```

Um form request pode realizar validação e autorização antes da execução do controller. Não repita suas regras no controller. Mantenha validação simples e específica do endpoint inline quando a extração não melhorar o reuso ou a clareza. Consulte as regras de validação para obter detalhes.
