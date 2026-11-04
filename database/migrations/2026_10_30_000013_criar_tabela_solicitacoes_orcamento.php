<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitacoes_orcamento', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['orcamento', 'pre_reserva'])->default('orcamento');
            $table->string('nome', 150);
            $table->string('email', 191)->nullable();
            $table->string('telefone', 40);
            $table->foreignId('categoria_servico_id')->nullable()->constrained('categorias_servico')->nullOnDelete();
            $table->string('nome_categoria', 120)->nullable();
            $table->date('data_evento')->nullable();
            $table->integer('horas_cobertura')->nullable();
            $table->decimal('valor_estimado', 10, 2)->nullable();
            $table->text('mensagem')->nullable();
            $table->json('adicionais_selecionados')->nullable();
            $table->enum('status', ['novo', 'contactado', 'fechado', 'cancelado'])->default('novo');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitacoes_orcamento');
    }
};

