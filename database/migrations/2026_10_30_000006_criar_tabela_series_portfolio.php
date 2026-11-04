<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('series_portfolio', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->foreignId('categoria_servico_id')->nullable()->constrained('categorias_servico')->nullOnDelete();
            $table->string('titulo', 200);
            $table->string('titulo_curto', 120)->nullable();
            $table->string('rotulo_categoria', 100)->nullable();
            $table->string('localizacao', 200)->nullable();
            $table->string('data_formatada', 100)->nullable();
            $table->date('data_evento')->nullable();
            $table->string('duracao', 100)->nullable();
            $table->string('equipe', 150)->nullable();
            $table->string('quantidade_entrega', 100)->nullable();
            $table->string('estilo_iluminacao', 150)->nullable();
            $table->string('imagem_capa', 255)->default('assets/images/hero.jpg');
            $table->text('resumo')->nullable();
            $table->text('depoimento_texto')->nullable();
            $table->string('depoimento_autor', 150)->nullable();
            $table->string('depoimento_papel', 150)->nullable();
            $table->boolean('ativo')->default(true);
            $table->integer('ordem')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('series_portfolio');
    }
};

