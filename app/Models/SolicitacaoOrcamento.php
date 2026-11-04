<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SolicitacaoOrcamento extends Model
{
    protected $table = 'solicitacoes_orcamento';

    protected $fillable = [
        'tipo',
        'nome',
        'email',
        'telefone',
        'categoria_servico_id',
        'nome_categoria',
        'data_evento',
        'horas_cobertura',
        'valor_estimado',
        'mensagem',
        'adicionais_selecionados',
        'status',
    ];

    protected $casts = [
        'data_evento' => 'date',
        'horas_cobertura' => 'integer',
        'valor_estimado' => 'decimal:2',
        'adicionais_selecionados' => 'array',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaServico::class, 'categoria_servico_id');
    }
}

