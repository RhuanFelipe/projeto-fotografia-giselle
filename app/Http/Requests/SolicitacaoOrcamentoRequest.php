<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SolicitacaoOrcamentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo' => 'nullable|in:orcamento,pre_reserva',
            'nome' => 'required|string|max:150',
            'email' => 'nullable|email|max:191',
            'telefone' => 'required|string|max:40',
            'categoria' => 'nullable|string|max:120',
            'categoria_slug' => 'nullable|string|max:80',
            'data_evento' => 'nullable|date',
            'horas' => 'nullable|integer|min:1|max:24',
            'valor_estimado' => 'nullable|numeric|min:0',
            'mensagem' => 'nullable|string|max:2000',
            'adicionais' => 'nullable|array',
        ];
    }
}

