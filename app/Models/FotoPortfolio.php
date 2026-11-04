<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FotoPortfolio extends Model
{
    protected $table = 'fotos_portfolio';

    protected $fillable = [
        'serie_id',
        'caminho_imagem',
        'momento',
        'legenda',
        'estilo_customizado',
        'e_capa',
        'ordem',
    ];

    protected $casts = [
        'e_capa' => 'boolean',
        'ordem' => 'integer',
    ];

    public function serie(): BelongsTo
    {
        return $this->belongsTo(SeriePortfolio::class, 'serie_id');
    }
}

