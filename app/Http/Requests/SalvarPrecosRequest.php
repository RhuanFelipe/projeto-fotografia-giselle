<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SalvarPrecosRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'basePrices' => 'nullable|array',
            'hourlyRate' => 'nullable|numeric|min:0',
            'addons' => 'nullable|array',
        ];
    }
}

