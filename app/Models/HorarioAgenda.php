<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HorarioAgenda extends Model
{
    protected $table = 'horarios_agenda';

    protected $fillable = [
        'dia_agenda_id',
        'horario',
        'descricao',
        'disponivel',
        'ordem',
    ];

    protected $casts = [
        'disponivel' => 'boolean',
        'ordem' => 'integer',
    ];

    public function dia(): BelongsTo
    {
        return $this->belongsTo(DiaAgenda::class, 'dia_agenda_id');
    }
}

