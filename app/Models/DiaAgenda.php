<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiaAgenda extends Model
{
    protected $table = 'dias_agenda';

    protected $fillable = [
        'data',
        'status',
        'titulo',
        'categoria',
        'observacoes',
    ];

    protected $casts = [
        'data' => 'date:Y-m-d',
    ];

    public function horarios(): HasMany
    {
        return $this->hasMany(HorarioAgenda::class, 'dia_agenda_id')->orderBy('ordem');
    }
}

