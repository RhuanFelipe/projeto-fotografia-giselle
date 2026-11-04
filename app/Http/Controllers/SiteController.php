<?php

namespace App\Http\Controllers;

use App\Models\SeriePortfolio;
use App\Models\DiaAgenda;
use App\Models\CategoriaServico;
use App\Models\AdicionalServico;
use App\Models\ConfiguracaoEstudio;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    protected function obterSecoes(): array
    {
        $padrao = [
            'inicio' => true,
            'agenda' => true,
            'ensaios' => true,
            'orcamentos' => true,
            'sobre' => true,
            'depoimentos' => true,
            'contato' => true,
        ];

        $salvas = ConfiguracaoEstudio::getValor('secoes_visibilidade', $padrao);
        if (!is_array($salvas)) {
            $salvas = json_decode($salvas, true) ?? $padrao;
        }

        return array_merge($padrao, $salvas);
    }

    public function index()
    {
        $series = SeriePortfolio::where('ativo', true)->get()->keyBy('slug');
        $secoes = $this->obterSecoes();
        return view('index', compact('series', 'secoes'));
    }

    public function ensaios()
    {
        $series = SeriePortfolio::where('ativo', true)->get()->keyBy('slug');
        $secoes = $this->obterSecoes();
        return view('ensaios', compact('series', 'secoes'));
    }

    public function detalhesEvento(Request $request)
    {
        $id = $request->query('id', 'casamento');
        $serie = SeriePortfolio::with(['fotos', 'timeline', 'destaques', 'paragrafos'])
            ->where('slug', $id)
            ->first();
        $secoes = $this->obterSecoes();

        return view('detalhes-evento', compact('serie', 'id', 'secoes'));
    }

    public function agenda()
    {
        $secoes = $this->obterSecoes();
        return view('agenda', compact('secoes'));
    }

    public function orcamentos()
    {
        $secoes = $this->obterSecoes();
        return view('orcamentos', compact('secoes'));
    }
}
