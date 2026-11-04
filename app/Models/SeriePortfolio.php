<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SeriePortfolio extends Model
{
    protected $table = 'series_portfolio';

    protected $fillable = [
        'slug',
        'categoria_servico_id',
        'titulo',
        'titulo_curto',
        'rotulo_categoria',
        'localizacao',
        'data_formatada',
        'data_evento',
        'duracao',
        'equipe',
        'quantidade_entrega',
        'estilo_iluminacao',
        'imagem_capa',
        'resumo',
        'depoimento_texto',
        'depoimento_autor',
        'depoimento_papel',
        'ativo',
        'ordem',
    ];

    protected $casts = [
        'ativo' => 'boolean',
        'ordem' => 'integer',
        'data_evento' => 'date',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(CategoriaServico::class, 'categoria_servico_id');
    }

    public function fotos(): HasMany
    {
        return $this->hasMany(FotoPortfolio::class, 'serie_id')->orderBy('ordem');
    }

    public function timeline(): HasMany
    {
        return $this->hasMany(EtapaTimeline::class, 'serie_id')->orderBy('ordem');
    }

    public function destaques(): HasMany
    {
        return $this->hasMany(DestaqueSerie::class, 'serie_id')->orderBy('ordem');
    }

    public function paragrafos(): HasMany
    {
        return $this->hasMany(ParagrafoHistoria::class, 'serie_id')->orderBy('ordem');
    }
}

