<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fotos_portfolio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('serie_id')->constrained('series_portfolio')->cascadeOnDelete();
            $table->string('caminho_imagem', 255);
            $table->string('momento', 150)->nullable();
            $table->text('legenda')->nullable();
            $table->string('estilo_customizado', 255)->nullable();
            $table->boolean('e_capa')->default(false);
            $table->integer('ordem')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fotos_portfolio');
    }
};

