<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AgendaService;
use App\Http\Requests\AtualizarDiaAgendaRequest;
use App\Models\SolicitacaoOrcamento;
use Illuminate\Http\Request;

class AgendaApiController extends Controller
{
    protected AgendaService $agendaService;

    public function __construct(AgendaService $agendaService)
    {
        $this->agendaService = $agendaService;
    }

    public function index()
    {
        return response()->json($this->agendaService->getMapaAgenda());
    }

    public function store(AtualizarDiaAgendaRequest $request)
    {
        $dados = $request->validated();
        $dia = $this->agendaService->salvarOuAtualizarDia(
            $dados['data'],
            $dados['status'],
            $dados['titulo'] ?? null,
            $dados['categoria'] ?? null,
            $dados['slots'] ?? []
        );

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Agenda atualizada no banco MySQL!',
            'dia' => $dia,
        ]);
    }

    public function reservar(Request $request)
    {
        $request->validate([
            'nome' => 'required|string|max:150',
            'whatsapp' => 'nullable|string|max:40',
            'telefone' => 'nullable|string|max:40',
            'dataPretendida' => 'required|date',
            'pacote' => 'nullable|string|max:120',
        ]);

        $lead = SolicitacaoOrcamento::create([
            'tipo' => 'pre_reserva',
            'nome' => $request->nome,
            'telefone' => $request->whatsapp ?? $request->telefone ?? '',
            'data_evento' => $request->dataPretendida,
            'nome_categoria' => $request->pacote ?? 'Pacote Selecionado',
            'status' => 'novo',
            'mensagem' => "Pré-reserva solicitada diretamente para o pacote: " . ($request->pacote ?? 'Não informado'),
        ]);

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Pré-reserva registrada com sucesso!',
            'lead' => $lead,
        ]);
    }
}

