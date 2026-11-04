<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuracoes_estudio', function (Blueprint $table) {
            $table->id();
            $table->string('chave', 80)->unique();
            $table->text('valor')->nullable();
            $table->string('tipo_dado', 20)->default('string');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuracoes_estudio');
    }
};

