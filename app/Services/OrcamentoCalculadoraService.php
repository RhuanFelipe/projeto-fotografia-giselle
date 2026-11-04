<?php

namespace App\Services;

use App\Models\CategoriaServico;
use App\Models\AdicionalServico;
use App\Models\ConfiguracaoEstudio;

class OrcamentoCalculadoraService
{
    public function calcular(string $categoriaSlug, int $horas, array $adicionaisSlugs = []): array
    {
        $categoria = CategoriaServico::with('tabelaPreco')->where('slug', $categoriaSlug)->first();

        if (!$categoria || !$categoria->tabelaPreco) {
            return [
                'sucesso' => false,
                'erro' => 'Categoria não encontrada ou sem tabela de preços.',
            ];
        }

        $tabela = $categoria->tabelaPreco;
        $precoBase = (float) $tabela->preco_base;
        $horasInclusas = (int) $tabela->horas_inclusas;
        $taxaHoraAdicional = (float) ConfiguracaoEstudio::getValor('valor_hora_adicional', 220);

        $horasExtras = max(0, $horas - $horasInclusas);
        $custoHorasExtras = $horasExtras * $taxaHoraAdicional;

        $adicionaisEncontrados = AdicionalServico::whereIn('slug', $adicionaisSlugs)->where('ativo', true)->get();
        $custoAdicionais = (float) $adicionaisEncontrados->sum('preco');

        $totalGeral = $precoBase + $custoHorasExtras + $custoAdicionais;

        return [
            'sucesso' => true,
            'categoria' => [
                'id' => $categoria->id,
                'slug' => $categoria->slug,
                'nome' => $categoria->nome,
                'preco_base' => $precoBase,
                'horas_inclusas' => $horasInclusas,
                'quantidade_fotos' => $tabela->quantidade_fotos,
            ],
            'horas_solicitadas' => $horas,
            'horas_extras' => $horasExtras,
            'taxa_hora_adicional' => $taxaHoraAdicional,
            'custo_horas_extras' => $custoHorasExtras,
            'adicionais' => $adicionaisEncontrados->map(fn($item) => [
                'slug' => $item->slug,
                'nome' => $item->nome,
                'preco' => (float) $item->preco,
            ]),
            'custo_adicionais' => $custoAdicionais,
            'total_geral' => $totalGeral,
        ];
    }
}

