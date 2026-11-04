<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfiguracaoEstudio extends Model
{
    protected $table = 'configuracoes_estudio';

    protected $fillable = [
        'chave',
        'valor',
        'tipo_dado',
    ];

    public static function getValor(string $chave, $default = null)
    {
        $registro = static::where('chave', $chave)->first();
        if (!$registro) return $default;

        return match ($registro->tipo_dado) {
            'integer', 'int' => (int) $registro->valor,
            'decimal', 'float' => (float) $registro->valor,
            'boolean', 'bool' => filter_var($registro->valor, FILTER_VALIDATE_BOOLEAN),
            'json', 'array' => json_decode($registro->valor, true) ?? $default,
            default => $registro->valor,
        };
    }

    public static function setValor(string $chave, $valor, string $tipo = 'string')
    {
        $valorGravado = is_array($valor) || is_object($valor) ? json_encode($valor) : (string) $valor;
        return static::updateOrCreate(
            ['chave' => $chave],
            [
                'valor' => $valorGravado,
                'tipo_dado' => $tipo,
            ]
        );
    }
}

