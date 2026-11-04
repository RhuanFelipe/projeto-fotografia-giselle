<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DestaqueSerie extends Model
{
    protected $table = 'destaques_serie';

    protected $fillable = [
        'serie_id',
        'descricao',
        'ordem',
    ];

    protected $casts = [
        'ordem' => 'integer',
    ];

    public function serie(): BelongsTo
    {
        return $this->belongsTo(SeriePortfolio::class, 'serie_id');
    }
}

