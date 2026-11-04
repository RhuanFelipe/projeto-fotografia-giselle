<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tabela_precos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_servico_id')->constrained('categorias_servico')->cascadeOnDelete();
            $table->decimal('preco_base', 10, 2);
            $table->integer('horas_inclusas')->default(2);
            $table->integer('quantidade_fotos')->default(30);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tabela_precos');
    }
};

