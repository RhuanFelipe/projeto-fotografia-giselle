<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('horarios_agenda', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dia_agenda_id')->constrained('dias_agenda')->cascadeOnDelete();
            $table->string('horario', 50);
            $table->string('descricao', 255);
            $table->boolean('disponivel')->default(false);
            $table->integer('ordem')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('horarios_agenda');
    }
};

