# Boas práticas de configuração

## Leia variáveis de ambiente em arquivos de configuração

Chame `env()` apenas a partir de arquivos de configuração. Depois de armazenar a configuração em cache, o Laravel não carrega o arquivo `.env` da aplicação, portanto, leia os valores de configuração no código da aplicação por meio de `config()`.

Incorreto:

```php
$key = env('API_KEY');
```

Correto:

```php
// config/services.php
return [
    'key' => env('API_KEY'),
];

// Application code
$key = config('services.key');
```

## Proteja segredos de produção

Não faça commit de segredos de produção em texto simples. O Laravel pode criptografar um arquivo de ambiente para que você possa armazená-lo com segurança. Plataformas de implantação também podem fornecer segredos por meio de seus cofres de segredos nativos.

Incorreto:

```bash
# A plaintext .env file committed to the repository
STRIPE_SECRET=<your-stripe-secret>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
```

Arquivo de ambiente criptografado:

```bash
php artisan env:encrypt --env=production --readable
php artisan env:decrypt --env=production
```

Para implantações hospedadas, considere o armazenamento de segredos nativo da plataforma, como AWS Secrets Manager ou Vault, e injete segredos em tempo de execução.

## Use `App::environment()` para verificações de ambiente

Incorreto:

```php
if (env('APP_ENV') === 'production') {
    // ...
}
```

Correto:

```php
if (app()->isProduction()) {
    // ...
}

if (App::environment('production')) {
    // ...
}
```

## Nomeie valores de domínio repetidos

Use um enum ou constante de classe quando um valor de domínio for repetido ou representar um conjunto restrito. Um literal de string único nem sempre precisa de uma constante nomeada.

```php
// Repeated literal
return $this->type === 'normal';

// Named domain value
return $this->type === self::TYPE_NORMAL;
```

Se a aplicação oferecer suporte à localização, coloque as strings voltadas para o usuário em arquivos de idioma e recupere-as com `__()`. Literais simples são razoáveis para aplicações que intencionalmente não oferecem suporte a múltiplos idiomas.

```php
// In a localized application
return back()->with('message', __('app.article_added'));
```
