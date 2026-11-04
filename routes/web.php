<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\AdminController;

Route::get('/', [SiteController::class, 'index'])->name('home');
Route::get('/index.html', fn() => redirect('/', 301));

Route::get('/ensaios', [SiteController::class, 'ensaios'])->name('ensaios');
Route::get('/ensaios.html', [SiteController::class, 'ensaios']);

Route::get('/detalhes-evento', [SiteController::class, 'detalhesEvento'])->name('detalhes-evento');
Route::get('/detalhes-evento.html', [SiteController::class, 'detalhesEvento']);

Route::get('/agenda', [SiteController::class, 'agenda'])->name('agenda');
Route::get('/agenda.html', [SiteController::class, 'agenda']);

Route::get('/orcamentos', [SiteController::class, 'orcamentos'])->name('orcamentos');
Route::get('/orcamentos.html', [SiteController::class, 'orcamentos']);

Route::get('/admin', [AdminController::class, 'index'])->name('admin');
Route::get('/admin.html', [AdminController::class, 'index']);
