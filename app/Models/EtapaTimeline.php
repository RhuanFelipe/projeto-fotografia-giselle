<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EtapaTimeline extends Model
{
    protected $table = 'etapas_timeline';

    protected $fillable = [
        'serie_id',
        'horario',
        'titulo',
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

