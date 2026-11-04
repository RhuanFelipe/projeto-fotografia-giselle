<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PortfolioApiController;
use App\Http\Controllers\Api\AgendaApiController;
use App\Http\Controllers\Api\OrcamentoApiController;
use App\Http\Controllers\Api\AdminApiController;
use App\Http\Controllers\Api\AuthApiController;

// Autenticação
Route::post('/auth/login', [AuthApiController::class, 'login']);
Route::post('/auth/logout', [AuthApiController::class, 'logout']);
Route::get('/auth/me', [AuthApiController::class, 'me']);

// Portfólio & Fotos
Route::get('/portfolio', [PortfolioApiController::class, 'index']);
Route::get('/portfolio/{slug}', [PortfolioApiController::class, 'show']);
Route::post('/portfolio', [PortfolioApiController::class, 'store']);
Route::delete('/portfolio/{slug}', [PortfolioApiController::class, 'destroy']);
Route::post('/portfolio/upload', [PortfolioApiController::class, 'uploadFoto']);

// Agenda & Reservas
Route::get('/agenda', [AgendaApiController::class, 'index']);
Route::post('/agenda', [AgendaApiController::class, 'store']);
Route::post('/agenda/reservar', [AgendaApiController::class, 'reservar']);

// Orçamentos & Simulador
Route::get('/orcamentos/tabela-precos', [OrcamentoApiController::class, 'tabelaPrecos']);
Route::post('/orcamentos/calcular', [OrcamentoApiController::class, 'calcular']);
Route::post('/orcamentos/solicitar', [OrcamentoApiController::class, 'salvarSolicitacao']);

// Painel Administrativo
Route::get('/admin/metricas', [AdminApiController::class, 'metricas']);
Route::get('/admin/leads', [AdminApiController::class, 'leads']);
Route::patch('/admin/leads/{id}/status', [AdminApiController::class, 'atualizarStatusLead']);
Route::post('/admin/leads/{id}/aprovar-agenda', [AdminApiController::class, 'aprovarLeadAgenda']);
Route::delete('/admin/leads/{id}', [AdminApiController::class, 'excluirLead']);
Route::post('/admin/precos', [AdminApiController::class, 'salvarPrecos']);

// Controle de Visibilidade das Seções do Site
Route::get('/secoes', [AdminApiController::class, 'obterSecoes']);
Route::get('/admin/secoes', [AdminApiController::class, 'obterSecoes']);
Route::post('/admin/secoes', [AdminApiController::class, 'salvarSecoes']);

