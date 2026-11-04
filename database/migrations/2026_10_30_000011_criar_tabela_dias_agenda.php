<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dias_agenda', function (Blueprint $table) {
            $table->id();
            $table->date('data')->unique();
            $table->enum('status', ['disponivel', 'poucas_vagas', 'reservado', 'bloqueado'])->default('disponivel');
            $table->string('titulo', 150)->nullable();
            $table->string('categoria', 100)->nullable();
            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dias_agenda');
    }
};

