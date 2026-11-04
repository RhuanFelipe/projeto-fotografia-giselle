<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategoriaServico;
use App\Models\AdicionalServico;
use App\Models\ConfiguracaoEstudio;
use App\Models\SolicitacaoOrcamento;
use App\Services\OrcamentoCalculadoraService;
use App\Http\Requests\SolicitacaoOrcamentoRequest;
use Illuminate\Http\Request;

class OrcamentoApiController extends Controller
{
    protected OrcamentoCalculadoraService $calculadora;

    public function __construct(OrcamentoCalculadoraService $calculadora)
    {
        $this->calculadora = $calculadora;
    }

    public function tabelaPrecos()
    {
        $categorias = CategoriaServico::with('tabelaPreco')->where('ativo', true)->orderBy('ordem')->get();
        $basePrices = [];

        foreach ($categorias as $cat) {
            $basePrices[$cat->slug] = [
                'name' => $cat->nome,
                'base' => $cat->tabelaPreco ? (float) $cat->tabelaPreco->preco_base : 1000,
                'baseHours' => $cat->tabelaPreco ? (int) $cat->tabelaPreco->horas_inclusas : 2,
                'photoCount' => $cat->tabelaPreco ? (int) $cat->tabelaPreco->quantidade_fotos : 30,
            ];
        }

        $hourlyRate = (float) ConfiguracaoEstudio::getValor('valor_hora_adicional', 220);

        $addonsModels = AdicionalServico::where('ativo', true)->get();
        $addons = [];
        foreach ($addonsModels as $add) {
            $addons[$add->slug] = [
                'name' => $add->nome,
                'price' => (float) $add->preco,
            ];
        }

        return response()->json([
            'basePrices' => $basePrices,
            'hourlyRate' => $hourlyRate,
            'addons' => $addons,
        ]);
    }

    public function calcular(Request $request)
    {
        $request->validate([
            'categoria' => 'required|string',
            'horas' => 'required|integer|min:1',
            'adicionais' => 'nullable|array',
        ]);

        $resultado = $this->calculadora->calcular(
            $request->categoria,
            $request->horas,
            $request->adicionais ?? []
        );

        return response()->json($resultado);
    }

    public function salvarSolicitacao(SolicitacaoOrcamentoRequest $request)
    {
        $dados = $request->validated();

        $catSlug = $dados['categoria_slug'] ?? null;
        $categoriaId = null;
        if ($catSlug) {
            $categoriaId = CategoriaServico::where('slug', $catSlug)->value('id');
        }

        $lead = SolicitacaoOrcamento::create([
            'tipo' => $dados['tipo'] ?? 'orcamento',
            'nome' => $dados['nome'],
            'email' => $dados['email'] ?? null,
            'telefone' => $dados['telefone'],
            'categoria_servico_id' => $categoriaId,
            'nome_categoria' => $dados['categoria'] ?? null,
            'data_evento' => $dados['data_evento'] ?? null,
            'horas_cobertura' => $dados['horas'] ?? null,
            'valor_estimado' => $dados['valor_estimado'] ?? null,
            'mensagem' => $dados['mensagem'] ?? null,
            'adicionais_selecionados' => $dados['adicionais'] ?? null,
            'status' => 'novo',
        ]);

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Sua solicitação foi gravada com sucesso em nossa base!',
            'lead' => $lead,
        ]);
    }
}

