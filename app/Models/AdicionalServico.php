<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdicionalServico extends Model
{
    protected $table = 'adicionais_servico';

    protected $fillable = [
        'slug',
        'nome',
        'descricao',
        'preco',
        'ativo',
    ];

    protected $casts = [
        'preco' => 'decimal:2',
        'ativo' => 'boolean',
    ];
}

