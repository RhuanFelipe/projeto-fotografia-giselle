<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TabelaPreco extends Model
{
    protected $table = 'tabela_precos';

    protected $fillable = [
        'categoria_servico_id',
        'preco_base',
        'horas_inclusas',
        'quantidade_fotos',
    ];

    protected $casts = [
        'preco_base' => 'decimal:2',
        'horas_inclusas' => 'integer',
        'quantidade_fotos' => 'integer',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaServico::class, 'categoria_servico_id');
    }
}

