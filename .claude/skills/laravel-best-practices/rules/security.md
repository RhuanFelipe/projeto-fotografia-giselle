# Boas práticas de segurança

## Controle o mass assignment

Defina `$fillable` quando um model for preenchido a partir de arrays derivados de requisições, ou proteja atributos deliberadamente por outra convenção consistente do model. Os models do Laravel protegem todos os atributos por padrão. `$guarded = []` desativa essa proteção.

```php
class User extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password',
    ];
}
```

Não passe dados de requisição não confiáveis para um model com `$guarded = []`. A proteção de mass-assignment controla quais atributos `create()`, `fill()` e `update()` podem definir. Ela não valida valores nem autoriza a operação.

## Autorize ações protegidas

Use policies, gates ou autorização de form request para ações que dependem das permissões do usuário atual. A autenticação por si só não estabelece permissão, e validação não é autorização.

```php
public function update(UpdatePostRequest $request, Post $post): RedirectResponse
{
    Gate::authorize('update', $post);

    $post->update($request->validated());

    return redirect()->route('posts.show', $post);
}
```

A autorização pode, em vez disso, ficar no form request:

```php
public function authorize(): bool
{
    return $this->user()?->can('update', $this->route('post')) ?? false;
}
```

Ações públicas intencionalmente disponíveis para todos não precisam de uma verificação de autorização redundante.

## Vincule parâmetros de consulta (bind query parameters)

Use Eloquent, o query builder ou bindings explícitos em vez de interpolar valores não confiáveis em Structured Query Language (SQL). Bindings protegem valores, não identificadores como nomes de colunas ou direções de ordenação. Mapeie identificadores selecionados pelo usuário para uma lista de permissões (allow-list).

Incorreto:

```php
DB::select("SELECT * FROM users WHERE name = '{$request->name}'");
```

Correto:

```php
User::where('name', $request->name)->get();
User::whereRaw('LOWER(name) = ?', [$request->string('name')->lower()->toString()])->get();
```

## Escape a saída em seu contexto

A sintaxe `{{ }}` do Blade realiza escape de HTML na saída. Use `{!! !!}` apenas para conteúdo sanitizado para o contexto HTML exato onde ele é renderizado. As regras de escape diferem para HTML, URLs, JavaScript e Cascading Style Sheets (CSS).

Incorreto para conteúdo não confiável:

```blade
{!! $user->bio !!}
```

Correto:

```blade
{{ $user->bio }}
```

## Aplique proteção contra cross-site request forgery

Inclua `@csrf` em formulários Blade que alteram estado tratados pelo middleware `web` do Laravel. Rotas intencionalmente excluídas da verificação de cross-site request forgery (CSRF), como webhooks validados de terceiros, precisam de sua própria verificação de autenticidade.

```blade
<form method="POST" action="/posts">
    @csrf
    <input type="text" name="title">
</form>
```

Aplicações Inertia comumente usam Axios, que retorna o cookie criptografado `XSRF-TOKEN` no cabeçalho `X-XSRF-TOKEN`. Ao usar outro cliente HTTP, confirme a configuração equivalente. Não desative a proteção CSRF apenas para corrigir uma incompatibilidade de token.

## Limite a taxa de requisições em endpoints sensíveis

Aplique limites de taxa (rate limits) adequados a tentativas de login, recuperação de senha, mensagens de verificação e rotas de application programming interface (API) custosas ou propensas a abuso. Escolha a chave do limitador deliberadamente. Um endereço Internet Protocol (IP) sozinho pode agrupar injustamente usuários atrás de uma rede compartilhada. Um identificador de conta sozinho pode permitir negação de serviço direcionada.

```php
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by(Str::transliterate(
        Str::lower($request->string('email')).'|'.$request->ip()
    ));
});

Route::post('/login', LoginController::class)->middleware('throttle:login');
```

A limitação de taxa reduz abusos. Ela não substitui autenticação, autorização ou proteção contra negação de serviço upstream.

## Valide e armazene uploads com segurança

Valide o tipo de conteúdo esperado, o tamanho e as dimensões quando relevante. A regra `mimes` do Laravel lê o conteúdo do arquivo e infere um tipo Multipurpose Internet Mail Extensions (MIME) correspondente às extensões listadas. Ela não valida a extensão de nome de arquivo atribuída pelo usuário. A regra `extensions` verifica essa extensão. Não a utilize isoladamente.

```php
public function rules(): array
{
    return [
        'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
    ];
}
```

Use os métodos de armazenamento do Laravel para gerar um nome de arquivo e armazene arquivos não confiáveis fora de um local publicamente executável. Arquivos públicos podem exigir controles adicionais, como recodificação de imagem, cabeçalhos content-disposition e bloqueio explícito de formatos ativos.

```php
$path = $request->file('avatar')->store('avatars');
```

## Mantenha segredos fora do código da aplicação

Não faça commit de arquivos de ambiente preenchidos nem insira credenciais diretamente no código. Leia variáveis de ambiente nos arquivos de configuração e use `config()` no código da aplicação para que o cache de configuração funcione. Consulte as regras de configuração para arquivos de ambiente criptografados e armazenamentos externos de segredos.

## Audite dependências

Execute `composer audit` regularmente e na integração contínua. Analise as descobertas quanto à explorabilidade e atualize ou mitigue pacotes afetados prontamente.

```bash
composer audit
```

## Criptografe atributos sensíveis quando apropriado

Use o cast `encrypted` para valores sensíveis que precisam ser recuperáveis e use `$hidden` para omiti-los da serialização em array e JavaScript Object Notation (JSON). Atributos ocultos permanecem acessíveis em PHP, e a criptografia não substitui o controle de acesso. Não é possível consultar valores criptografados de forma significativa. Armazene-os em uma coluna `TEXT` ou maior, pois o comprimento do texto cifrado varia.

```php
class Integration extends Model
{
    protected $hidden = ['api_key', 'api_secret'];

    protected function casts(): array
    {
        return [
            'api_key' => 'encrypted',
            'api_secret' => 'encrypted',
        ];
    }
}
```
