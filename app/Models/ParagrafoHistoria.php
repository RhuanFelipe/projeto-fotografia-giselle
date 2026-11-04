<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParagrafoHistoria extends Model
{
    protected $table = 'paragrafos_historia';

    protected $fillable = [
        'serie_id',
        'texto',
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

