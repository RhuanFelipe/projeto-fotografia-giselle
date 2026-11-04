<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AtualizarDiaAgendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'data' => 'required|date',
            'status' => 'required|string',
            'titulo' => 'nullable|string|max:150',
            'categoria' => 'nullable|string|max:100',
            'slots' => 'nullable|array',
        ];
    }
}

