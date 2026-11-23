# Testes de segurança

Teste cada fronteira de segurança onde a entrada do usuário afeta a autorização, a saída renderizada ou a construção de consultas. Um defeito nessa fronteira é difícil de detectar, porque a funcionalidade pode continuar funcionando.

Escreva um teste para cada um destes casos:

- **Acesso entre tenants.** Requisite um registro de um tenant, equipe ou organização diferente. Leia `rules/endpoint-tests.md` para saber quando a resposta deve ser `404` em vez de `403`.
- **Cada papel sem privilégios.** Use um data provider sobre os papéis que o endpoint deve recusar.
- **Escapamento de conteúdo fornecido pelo usuário.** Teste o escapamento em HTML e e-mail. Inclua nomes e cada campo de texto livre que um template renderiza. Faça asserção de que caracteres perigosos são escapados e que o valor bruto está ausente. Não faça asserção de uma entidade exata para uma aspa, porque Markdown e inliners de CSS de e-mail podem decodificá-la.
- **Injeção em componentes dinâmicos de consulta.** Exemplos incluem colunas de ordenação, campos de filtro e direções de ordenação.
- **Uma chave inesperada** em um payload ou array de configuração. Um merge que aceita todas as chaves pode definir um atributo que o usuário não deve controlar.

```php
public function test_escapes_dangerous_content_in_the_notification(): void
{
    $organization = Organization::factory()->make([
        'name' => "O'Reilly <script>alert('xss')</script>",
    ]);

    $content = (new QuotaApproaching($organization, 80))->toMail()->render();

    $this->assertStringContainsString('&lt;script&gt;', $content);
    $this->assertStringNotContainsString("<script>alert('xss')</script>", $content);
}
```

O Laravel fornece defesas contra mass assignment, acesso não autorizado e saída não escapada. Teste se a aplicação aplica a defesa correta a cada atributo, rota e template.
