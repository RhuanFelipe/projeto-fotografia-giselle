<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FotoPortfolio;
use App\Models\DiaAgenda;
use App\Models\SolicitacaoOrcamento;
use App\Models\CategoriaServico;
use App\Models\TabelaPreco;
use App\Models\AdicionalServico;
use App\Models\ConfiguracaoEstudio;
use App\Http\Requests\SalvarPrecosRequest;
use App\Services\AgendaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminApiController extends Controller
{
    public function metricas()
    {
        $totalFotos = FotoPortfolio::count();
        $eventosReservados = DiaAgenda::where('status', 'reservado')->count();
        $novosLeads = SolicitacaoOrcamento::where('status', 'novo')->count();

        // Média de ticket para estimativa
        $precoCasamento = DB::table('tabela_precos')
            ->join('categorias_servico', 'tabela_precos.categoria_servico_id', '=', 'categorias_servico.id')
            ->where('categorias_servico.slug', 'casamento')
            ->value('preco_base') ?? 3200;

        $preco15 = DB::table('tabela_precos')
            ->join('categorias_servico', 'tabela_precos.categoria_servico_id', '=', 'categorias_servico.id')
            ->where('categorias_servico.slug', 'festa-15anos')
            ->value('preco_base') ?? 1800;

        $ticketMedio = ($precoCasamento + $preco15) / 2;
        $receitaEstimada = $eventosReservados * $ticketMedio;

        $proximosEventos = DiaAgenda::where('data', '>=', now()->toDateString())
            ->orderBy('data', 'asc')
            ->take(5)
            ->get();

        $leadsRecentes = SolicitacaoOrcamento::orderBy('id', 'desc')->take(5)->get();

        return response()->json([
            'totalFotos' => $totalFotos,
            'eventosReservados' => $eventosReservados,
            'novosLeads' => $novosLeads,
            'receitaEstimada' => $receitaEstimada,
            'proximosEventos' => $proximosEventos,
            'leadsRecentes' => $leadsRecentes,
        ]);
    }

    public function leads(Request $request)
    {
        $status = $request->query('status', 'all');
        $query = SolicitacaoOrcamento::orderBy('id', 'desc');

        if ($status !== 'all') {
            $statusMap = [
                'new' => 'novo',
                'contacted' => 'contactado',
                'closed' => 'fechado',
            ];
            $dbStatus = $statusMap[$status] ?? $status;
            $query->where('status', $dbStatus);
        }

        $leads = $query->get()->map(function ($lead) {
            $statusReverse = [
                'novo' => 'new',
                'contactado' => 'contacted',
                'fechado' => 'closed',
                'cancelado' => 'canceled',
            ];

            return [
                'id' => $lead->id,
                'nome' => $lead->nome,
                'email' => $lead->email,
                'telefone' => $lead->telefone,
                'categoria' => $lead->nome_categoria ?? 'Geral',
                'data_evento' => $lead->data_evento ? $lead->data_evento->format('Y-m-d') : null,
                'mensagem' => $lead->mensagem,
                'status' => $statusReverse[$lead->status] ?? $lead->status,
                'tipo' => $lead->tipo,
                'criado_em' => $lead->created_at ? $lead->created_at->toISOString() : null,
            ];
        });

        return response()->json($leads);
    }

    public function atualizarStatusLead(Request $request, $id)
    {
        $lead = SolicitacaoOrcamento::findOrFail($id);
        $novoStatus = $request->status; // new, contacted, closed

        $statusMap = [
            'new' => 'novo',
            'contacted' => 'contactado',
            'closed' => 'fechado',
        ];

        $lead->status = $statusMap[$novoStatus] ?? $novoStatus;
        $lead->save();

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Status do lead atualizado!',
            'status' => $novoStatus,
        ]);
    }

    public function aprovarLeadAgenda(Request $request, $id, AgendaService $agendaService)
    {
        $lead = SolicitacaoOrcamento::findOrFail($id);

        if (!$lead->data_evento) {
            return response()->json(['sucesso' => false, 'erro' => 'Lead não possui data informada.'], 422);
        }

        $dataStr = $lead->data_evento->format('Y-m-d');
        $titulo = ($lead->nome_categoria ?? 'Evento') . ' - ' . $lead->nome;

        $agendaService->salvarOuAtualizarDia(
            $dataStr,
            'booked',
            $titulo,
            $lead->nome_categoria,
            [
                ['time' => 'Evento Confirmado', 'desc' => "{$titulo} ({$lead->telefone})", 'disp' => false]
            ]
        );

        $lead->status = 'fechado';
        $lead->save();

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Data confirmada e agendada no calendário!',
        ]);
    }

    public function excluirLead($id)
    {
        $lead = SolicitacaoOrcamento::findOrFail($id);
        $lead->delete();

        return response()->json(['sucesso' => true, 'mensagem' => 'Lead removido.']);
    }

    public function salvarPrecos(SalvarPrecosRequest $request)
    {
        $dados = $request->validated();

        DB::transaction(function () use ($dados) {
            if (!empty($dados['basePrices'])) {
                foreach ($dados['basePrices'] as $slug => $info) {
                    $cat = CategoriaServico::firstOrCreate(
                        ['slug' => $slug],
                        ['nome' => $info['name'] ?? ucfirst($slug), 'ativo' => true]
                    );

                    TabelaPreco::updateOrCreate(
                        ['categoria_servico_id' => $cat->id],
                        [
                            'preco_base' => $info['base'] ?? 1000,
                            'horas_inclusas' => $info['baseHours'] ?? 2,
                            'quantidade_fotos' => $info['photoCount'] ?? 30,
                        ]
                    );
                }
            }

            if (isset($dados['hourlyRate'])) {
                ConfiguracaoEstudio::updateOrCreate(
                    ['chave' => 'valor_hora_adicional'],
                    ['valor' => (string) $dados['hourlyRate'], 'tipo_dado' => 'decimal']
                );
            }

            if (!empty($dados['addons'])) {
                foreach ($dados['addons'] as $slug => $info) {
                    AdicionalServico::updateOrCreate(
                        ['slug' => $slug],
                        [
                            'nome' => $info['name'] ?? ucfirst($slug),
                            'preco' => $info['price'] ?? 0,
                            'ativo' => true,
                        ]
                    );
                }
            }
        });

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Tabela de preços sincronizada com o MySQL!',
        ]);
    }

    public function obterSecoes()
    {
        $padrao = [
            'inicio' => true,
            'agenda' => true,
            'ensaios' => true,
            'orcamentos' => true,
            'sobre' => true,
            'depoimentos' => true,
            'contato' => true,
        ];

        $salvas = ConfiguracaoEstudio::getValor('secoes_visibilidade', $padrao);
        if (!is_array($salvas)) {
            $salvas = json_decode($salvas, true) ?? $padrao;
        }

        return response()->json(array_merge($padrao, $salvas));
    }

    public function salvarSecoes(Request $request)
    {
        $dados = $request->input('secoes', $request->all());

        $padrao = [
            'inicio' => true,
            'agenda' => true,
            'ensaios' => true,
            'orcamentos' => true,
            'sobre' => true,
            'depoimentos' => true,
            'contato' => true,
        ];

        $limpo = [];
        foreach ($padrao as $chave => $valorPadrao) {
            if (isset($dados[$chave])) {
                $limpo[$chave] = filter_var($dados[$chave], FILTER_VALIDATE_BOOLEAN);
            } else {
                $limpo[$chave] = $valorPadrao;
            }
        }

        ConfiguracaoEstudio::setValor('secoes_visibilidade', $limpo, 'json');

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Visibilidade das seções atualizada com sucesso no banco de dados!',
            'secoes' => $limpo,
        ]);
    }
}

