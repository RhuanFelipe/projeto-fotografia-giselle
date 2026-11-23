# Checklist de detecção

Cada dimensão aqui é uma bifurcação genuína: o Laravel oferece duas ou mais abordagens válidas, a escolha do app muda o que o próximo agente escreve e nenhuma ferramenta ativa do projeto pode decidir por você. Ficaram de fora propositalmente: formatação pura (o Pint cuida disso), qualquer forma que uma regra instalada e habilitada do Rector reescreva para um formato canônico (`$casts` para `casts()`, `$fillable` para atributos, regras em pipe-string para arrays, migrations nomeadas para anônimas, `$signature` para `#[Signature]`) e padrões do framework que qualquer agente escreve sem ser solicitado (jobs `ShouldQueue`, tipos de retorno de relacionamentos, `HasFactory`).

Cada item traz a bifurcação e, em seguida, uma dica (um grep ou diretório para identificar qual lado o app adota). As dicas são apenas um ponto de partida. Leia os arquivos encontrados. Nunca registre com base em uma contagem bruta. Aplique as regras básicas a cada veredito: uma escolha consistente que seja um padrão do framework ou o formato-alvo de uma ferramenta não é um padrão do projeto. Linhas marcadas com `(architecture)` têm o sinal mais alto, portanto registre tanto a presença quanto a ausência deliberada.

---

## A. Validação e entrada HTTP

1. Ponto de entrada de validação: `$request->validate()` inline vs classes Form Request vs `Validator::make()`.
   - Dica: `ls app/Http/Requests`. Grep -- `->validate(` / `Validator::make(` em `app/Http/Controllers`.
2. Localização de regras personalizadas: objetos de regra invocáveis em `app/Rules` vs closures inline vs `Validator::extend()` em um provider. Objetos de regra são o caminho padrão de `make:rule`, portanto registre apenas se o app depender de closures ou `Validator::extend`. "Nenhum objeto de regra" por si só não tem sinal.
   - Dica: `ls app/Rules`. Grep `Validator::extend` em `app/Providers`.
3. Recuperação tipada de entrada: getters tipados (`$request->string()`, `->integer()`, `->enum()`, `->date()`) vs `$request->input()` bruto / propriedades dinâmicas.
   - Dica: grep -- `->string(` / `->integer(` / `->enum(` vs `->input(` em `app/Http`.
4. Mensagens/atributos personalizados: `lang/*/validation.php` vs métodos `messages()` / `attributes()` em Form Request.
   - Dica: `ls lang`. Grep `function messages`, `function attributes` em `app/Http/Requests`.

## B. Controllers e roteamento

5. Formato do controller: ação única invocável (`__invoke`) vs resource controllers vs multi-método simples.
   - Dica: grep `__invoke` nos controllers. `Route::resource` / `apiResource` vs rotas por verbo HTTP.
6. Localização da lógica de negócio (architecture): fat controllers vs delegada para Actions / Services / Jobs.
   - Dica: leia alguns métodos de controller. `ls app/Actions app/Services`.
7. Estilo de manipulador de rota: closures em `routes/*.php` vs classes de controller.
   - Dica: conte `function ()` vs `::class` em `routes/web.php`, `routes/api.php`.
8. Atribuição de middleware: `->middleware()` na rota/grupo vs `HasMiddleware::middleware()` no controller vs atributo `#[Middleware]`.
   - Dica: grep -- `implements HasMiddleware`, `#[Middleware(` em controllers vs `->middleware(` em rotas.
9. Route model binding: implícito (models tipados por type-hint) vs `Route::bind` explícito vs `findOrFail` manual.
   - Dica: parâmetros de model tipados nas assinaturas vs `findOrFail(` em controllers. Grep `Route::bind`.
10. Rate limiting: `RateLimiter::for()` nomeado + `throttle:name` vs `throttle:60,1` inline.
    - Dica: grep `RateLimiter::for` em providers vs `throttle:` em arquivos de rota.

## C. Autorização

11. Casa da autorização: Gates (`Gate::define`) vs classes Policy em `app/Policies`.
    - Dica: `ls app/Policies`. Grep `Gate::define` em `app/Providers`.
12. Ponto de chamada da autorização: `$this->authorize()` / `Gate::authorize()` vs `$user->can()` vs middleware `can` vs `#[Authorize]` vs `@can` no Blade.
    - Dica: grep -- `authorize(`, `->can(`, `middleware('can:`, `#[Authorize(`, `@can(`.

## D. Eloquent e models

13. Mass assignment: lista de permissão `$fillable` vs lista de bloqueio `$guarded`.
    - Dica: grep `protected $fillable` / `protected $guarded` em `app/Models`.
14. Accessors/mutators: classe moderna `Attribute` vs legado `getXxxAttribute()` / `setXxxAttribute()`. Registre ocorrências legadas, pois vão contra o padrão da ferramenta.
    - Dica: grep `: Attribute` / `Attribute::make` vs `function get[A-Z].*Attribute` em `app/Models`.
15. Chaves primárias: auto-incremento vs `HasUuids` vs `HasUlids`.
    - Dica: grep `HasUuids` / `HasUlids` em `app/Models`. Migration `id()` vs `uuid('id')`.
16. Casts personalizados: classes `CastsAttributes` dedicadas (`app/Casts`) vs `Attribute` inline vs strings de cast nativas.
    - Dica: `ls app/Casts`. Grep `Cast::class`, `AsStringable::class` nos models.
17. Camada de dados/consultas (architecture): Eloquent diretamente nos controllers vs repositories vs query objects dedicados (ex.: classes que expõem `builder(): Builder`).
    - Dica: `ls app/Repositories app/Queries`. Veja onde consultas não triviais são construídas.
18. Query scopes: métodos locais `scope`/`#[Scope]` vs classes builder dedicadas.
    - Dica: grep `function scope` / `#[Scope]` nos models. `ls app/*/Builders`.
19. Eventos de model: observers (`app/Observers`, `#[ObservedBy]`) vs closures em `booted()` vs classes de evento.
    - Dica: `ls app/Observers`. Grep `booted`, `::observe`, `#[ObservedBy]`.
20. Postura de eager-loading: `->with()` explícito por consulta vs padrões `$with` no nível do model. Trate `preventLazyLoading()` separadamente como uma proteção de desenvolvimento, pois pode complementar qualquer uma das posturas.
    - Dica: grep -- `protected $with`, `->with(`, e separadamente `preventLazyLoading` em `app/`.

## E. Arquitetura e organização

21. Estrutura de Action/Service (architecture): classes Action (invocadas via `handle` / `execute` / `__invoke`) vs service objects vs nenhum dos dois. Faça cruzamento com o mapa de `app/` da Etapa 0: qualquer pasta `Actions`/`Services`/`Pipelines`/`Jobs`-como-actions representa esse padrão, portanto registre como ela é invocada.
    - Dica: `ls app/` (toda a árvore, não apenas `Actions`/`Services`). Faça grep do método de invocação na pasta encontrada.
22. DTOs (architecture): spatie/laravel-data vs classes `readonly` simples vs arrays por toda parte.
    - Dica: `ls app/Data`. Grep `extends Data`, `readonly class` em `app/`.
23. Aquisição de dependências: injeção via construtor/método vs service location com `app()` / `resolve()` / `App::make()`.
    - Dica: grep `app(` / `resolve(` / `::make(` em `app/` vs dependências promovidas no construtor.
24. Desacoplamento: eventos + listeners vs chamadas diretas a serviços.
    - Dica: `ls app/Events app/Listeners`. Grep `event(`, `::dispatch(`.
25. Idioma de helper vs facade: helpers globais (`config()`, `auth()`, `response()`) vs facades (`Config::`, `Auth::`, `Response::`).
    - Dica: proporção de `config(` vs `Config::` (etc.) em `app/`.
26. Layout de namespaces (architecture): esqueleto padrão `app/` vs pastas de domínio/módulo (`app/Domain/**`, módulos).
    - Dica: `ls app/`, procure por `Domain/`, `Modules/`, pastas de bounded-context.
27. Enums: backed vs pure, nomenclatura dos casos e onde vivem.
    - Dica: `ls app/Enums`. Grep `enum .*: string`, `enum .*: int`.

## F. Frontend e views

Nenhum pacote Livewire/Inertia/Flux está instalado. Este app pode ser apenas API. Confirme a partir de `resources/views` antes de varrer e trate as dimensões de Livewire/Flux como não aplicáveis.

28. Stack de frontend: Blade+Livewire vs Inertia (Vue/React/Svelte) vs apenas Blade / API + SPA separada.
    - Dica: `composer.json` + `package.json`. `ls resources/js/pages`, `resources/views`.
29. Composição Blade: componentes de classe `<x-*>` vs componentes anônimos (`@props`) vs partials `@include`.
    - Dica: `ls app/View/Components`. Grep `<x-`, `@include` em `resources/views`.
32. Localização: chaves curtas (`lang/*/*.php` + `__('messages.welcome')`) vs chaves de string JSON (`lang/*.json` + `__('Full sentence')`).
    - Dica: `ls lang`. Grep `__('` com pontos vs chaves de frase.

## G. Banco de dados e migrations

33. Chaves estrangeiras: `foreignId()->constrained()` vs `foreignIdFor(Model::class)` vs `foreign()->references()->on()` manual.
    - Dica: grep -- `foreignId(`, `foreignIdFor(`, `->foreign(` em `database/migrations`.
34. Métodos `down()`: lógica reversa real vs omitidos / migrations unidirecionais.
    - Dica: grep `function down` vs a quantidade de migrations.
35. Armazenamento de enum: coluna `enum()` no banco vs `string()` + cast de enum PHP no model.
    - Dica: grep -- `->enum(` em migrations vs colunas string com cast para enums.
36. Transações: closure `DB::transaction(fn ...)` vs `beginTransaction` / `commit` / `rollBack` manuais.
    - Dica: grep `DB::transaction`, `beginTransaction` em `app/`.
37. Escritas idempotentes: `upsert` / `updateOrCreate` / `firstOrCreate` vs buscar e depois salvar.
    - Dica: grep `upsert(`, `updateOrCreate(`, `firstOrCreate(` em `app/`.

## H. Testes

38. Framework: Pest (`it()` / `test()` / `expect()`) vs classes PHPUnit.
    - Dica: `ls tests/Pest.php`. Grep `it(` / `test(` vs `extends TestCase`.
39. Reset do banco de dados: `RefreshDatabase` vs `DatabaseTruncation` vs `DatabaseMigrations`.
    - Dica: grep pelos nomes dessas traits em `tests/`.
40. Fixtures: compare como registros equivalentes pertencentes ao teste são criados, como factories vs inserções manuais. Acompanhe seeders separadamente para dados de referência compartilhados, pois `$this->seed()` comumente e legitimamente coexiste com factories.
    - Dica: grep `::factory(` e inserções diretas em `tests/`. Inspecione separadamente chamadas a `$this->seed(` e o que esses seeders fornecem.
41. Isolamento de colaboradores: como o app cria dublês de suas próprias classes, `mock()` / `spy()` do Mockery vs integração real. Ignore fakes de facade como `Mail::fake()` aqui. Eles isolam serviços do framework por padrão e não são uma bifurcação contra Mockery.
    - Dica: grep -- `->mock(`, `->spy(`, `Mockery::` em `tests/`.
42. Asserções de endpoint: array `assertJson([...])` / `assertJsonFragment` vs `AssertableJson` fluente.
    - Dica: grep `AssertableJson`, `assertJsonFragment` em `tests/`.

## I. Respostas e API resources

43. Formato da resposta: classes API Resource vs `response()->json()` vs retorno direto de models/arrays.
    - Dica: `ls app/Http/Resources`. Grep -- `JsonResource`, `->json(` em controllers.
44. Inclusão de relacionamentos em Resource: proteções `whenLoaded()` vs acesso incondicional ao relacionamento. Não conte atributos escalares comuns como rivais de relacionamentos condicionais, e avalie campos `when()` gerais separadamente.
    - Dica: compare campos de relacionamento que usam `whenLoaded(` com acesso incondicional a propriedades de relacionamento em `app/Http/Resources`.
45. Contratos de paginação: dentro de categorias de endpoints comparáveis, `paginate()` com contagem total vs `simplePaginate()` vs `cursorPaginate()`. Eles têm contratos diferentes de totais, navegação, ordenação e desempenho, portanto registre apenas uma política de API estável delimitada por caminho, nunca uma maioria global do projeto.
    - Dica: faça grep deles em `app/`, depois agrupe as ocorrências por tipo de endpoint e contrato de cliente antes de compará-las.
46. Redirecionamentos/URLs web: `route('name')` vs `url('/path')` vs `action([...])`.
    - Dica: grep `route('`, `url('/`, `action([` em `app/Http` e views.

## J. Strings, collections e datas

47. Idioma de iteração: pipelines `collect()->map()->filter()` vs `array_map` / `foreach`.
    - Dica: grep -- `collect(`, `->map(` vs densidade de `array_map`, `foreach` em `app/`.
48. API de strings: fluente `Str::of()->...` (Stringable) vs `Str::` estático vs nativas (`trim`, `strtoupper`).
    - Dica: grep `Str::of(` vs `Str::` vs funções nativas de string.
49. Datas: compare estilos equivalentes de chamada de construção (helpers `now()` / `today()` vs `Carbon::`) separadamente da política de data mutável/imutável da aplicação. `Date::use(CarbonImmutable::class)` pode fazer os helpers retornarem datas imutáveis, então esses sinais são complementares em vez de conflitantes.
    - Dica: grep `now(` e `Carbon::` para estilo de chamada. Inspecione separadamente `CarbonImmutable` e `Date::use` para política de mutabilidade.

---

Apenas bifurcações genuínas. Cada linha sobreviveu ao filtro "nenhuma ferramenta pode decidir isso, e não é o padrão". Dê a cada dimensão aplicável exatamente um veredito: pattern, conflict, default, no-signal, tooling-owned ou already-recorded. As linhas marcadas com `(architecture)` são de onde vêm as regras de maior valor.
