<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaServico extends Model
{
    protected $table = 'categorias_servico';

    protected $fillable = [
        'slug',
        'nome',
        'descricao',
        'ativo',
        'ordem',
    ];

    protected $casts = [
        'ativo' => 'boolean',
        'ordem' => 'integer',
    ];

    public function tabelaPreco(): HasOne
    {
        return $this->hasOne(TabelaPreco::class, 'categoria_servico_id');
    }

    public function series(): HasMany
    {
        return $this->hasMany(SeriePortfolio::class, 'categoria_servico_id');
    }

    public function solicitacoes(): HasMany
    {
        return $this->hasMany(SolicitacaoOrcamento::class, 'categoria_servico_id');
    }
}

