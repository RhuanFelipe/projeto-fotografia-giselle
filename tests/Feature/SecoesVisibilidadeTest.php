<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\ConfiguracaoEstudio;

class SecoesVisibilidadeTest extends TestCase
{
    use RefreshDatabase;

    public function test_pode_obter_secoes_visibilidade_com_padrao(): void
    {
        $response = $this->getJson('/api/secoes');

        $response->assertStatus(200);
        $response->assertJson([
            'inicio' => true,
            'agenda' => true,
            'ensaios' => true,
            'orcamentos' => true,
            'sobre' => true,
            'depoimentos' => true,
            'contato' => true,
        ]);
    }

    public function test_pode_salvar_e_ocultar_agenda_de_eventos(): void
    {
        $payload = [
            'secoes' => [
                'inicio' => true,
                'agenda' => false, // Ocultar a agenda
                'ensaios' => true,
                'orcamentos' => true,
                'sobre' => true,
                'depoimentos' => true,
                'contato' => true,
            ],
        ];

        $postResponse = $this->postJson('/api/admin/secoes', $payload);

        $postResponse->assertStatus(200);
        $postResponse->assertJson([
            'sucesso' => true,
            'secoes' => [
                'agenda' => false,
                'ensaios' => true,
            ],
        ]);

        // Verifica se persistiu no banco
        $salvo = ConfiguracaoEstudio::getValor('secoes_visibilidade');
        $this->assertIsArray($salvo);
        $this->assertFalse($salvo['agenda']);
        $this->assertTrue($salvo['ensaios']);

        // Verifica se a API pública retorna o novo estado
        $getResponse = $this->getJson('/api/secoes');
        $getResponse->assertStatus(200);
        $getResponse->assertJson([
            'agenda' => false,
            'ensaios' => true,
        ]);
    }

    public function test_site_controller_injeta_secoes_na_view(): void
    {
        ConfiguracaoEstudio::setValor('secoes_visibilidade', [
            'inicio' => true,
            'agenda' => false,
            'ensaios' => true,
            'orcamentos' => true,
            'sobre' => true,
            'depoimentos' => true,
            'contato' => true,
        ], 'json');

        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertViewHas('secoes', function ($secoes) {
            return isset($secoes['agenda']) && $secoes['agenda'] === false;
        });
    }
}
