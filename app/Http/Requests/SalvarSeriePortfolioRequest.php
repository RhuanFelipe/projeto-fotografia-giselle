<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SalvarSeriePortfolioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'titulo' => $this->titulo ?? $this->title ?? 'Série Fotográfica',
            'slug' => $this->slug ?? $this->id ?? null,
            'coverImg' => $this->coverImg ?? $this->imagem_capa ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            'id' => 'nullable|string',
            'slug' => 'nullable|string|max:100',
            'titulo' => 'required|string|max:200',
            'title' => 'nullable|string|max:200',
            'categoryLabel' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:200',
            'coverImg' => 'nullable|string|max:255',
            'summary' => 'nullable|string|max:2000',
            'slides' => 'nullable|array',
            'timeline' => 'nullable|array',
            'highlights' => 'nullable|array',
            'testimonial' => 'nullable|array',
        ];
    }
}
