<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeriePortfolio;
use App\Models\FotoPortfolio;
use App\Http\Requests\SalvarSeriePortfolioRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PortfolioApiController extends Controller
{
    public function index()
    {
        $series = SeriePortfolio::with(['fotos', 'timeline', 'destaques', 'paragrafos'])
            ->where('ativo', true)
            ->orderBy('ordem')
            ->get();

        $formatado = [];
        foreach ($series as $serie) {
            $formatado[$serie->slug] = $this->formatarSerie($serie);
        }

        return response()->json($formatado);
    }

    public function show($slug)
    {
        $serie = SeriePortfolio::with(['fotos', 'timeline', 'destaques', 'paragrafos'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($this->formatarSerie($serie));
    }

    public function store(SalvarSeriePortfolioRequest $request)
    {
        $dados = $request->validated();
        $slug = $dados['slug'] ?? ($dados['id'] ?? Str::slug($dados['titulo']));

        $serie = SeriePortfolio::updateOrCreate(
            ['slug' => $slug],
            [
                'titulo' => $dados['titulo'],
                'titulo_curto' => $dados['titulo_curto'] ?? $dados['titulo'],
                'rotulo_categoria' => $dados['categoryLabel'] ?? 'Série Fotográfica',
                'localizacao' => $dados['location'] ?? '',
                'imagem_capa' => $dados['coverImg'] ?? 'assets/images/hero.jpg',
                'resumo' => $dados['summary'] ?? '',
                'depoimento_texto' => $dados['testimonial']['quote'] ?? null,
                'depoimento_autor' => $dados['testimonial']['author'] ?? null,
                'depoimento_papel' => $dados['testimonial']['role'] ?? null,
                'ativo' => true,
            ]
        );

        if (!empty($dados['slides'])) {
            $serie->fotos()->delete();
            foreach ($dados['slides'] as $i => $slide) {
                FotoPortfolio::create([
                    'serie_id' => $serie->id,
                    'caminho_imagem' => $slide['src'],
                    'momento' => $slide['moment'] ?? "Foto {$i}",
                    'legenda' => $slide['caption'] ?? '',
                    'estilo_customizado' => $slide['imgStyle'] ?? '',
                    'e_capa' => ($slide['src'] === $serie->imagem_capa),
                    'ordem' => $i + 1,
                ]);
            }
        }

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Série salva com sucesso no MySQL!',
            'serie' => $this->formatarSerie($serie->fresh(['fotos', 'timeline', 'destaques', 'paragrafos'])),
        ]);
    }

    public function destroy($slug)
    {
        $serie = SeriePortfolio::where('slug', $slug)->firstOrFail();
        $serie->delete();

        return response()->json([
            'sucesso' => true,
            'mensagem' => 'Série removida com sucesso.',
        ]);
    }

    public function uploadFoto(Request $request)
    {
        $request->validate([
            'foto' => 'required|image|max:10240', // até 10MB
        ]);

        $path = $request->file('foto')->store('portfolio', 'public');
        $url = asset('storage/' . $path);

        return response()->json([
            'sucesso' => true,
            'url' => $url,
            'caminho' => $path,
        ]);
    }

    private function formatarSerie(SeriePortfolio $serie): array
    {
        return [
            'id' => $serie->slug,
            'title' => $serie->titulo,
            'shortTitle' => $serie->titulo_curto ?? $serie->titulo,
            'categoryLabel' => $serie->rotulo_categoria ?? 'Fotografia',
            'orcamentoKey' => $serie->slug,
            'location' => $serie->localizacao ?? '',
            'date' => $serie->data_formatada ?? ($serie->data_evento ? $serie->data_evento->format('d/m/Y') : ''),
            'duration' => $serie->duracao ?? '',
            'team' => $serie->equipe ?? '',
            'deliveryCount' => $serie->quantidade_entrega ?? '',
            'lightingStyle' => $serie->estilo_iluminacao ?? '',
            'coverImg' => $serie->imagem_capa,
            'summary' => $serie->resumo ?? '',
            'storyParagraphs' => $serie->paragrafos->pluck('texto')->toArray(),
            'timeline' => $serie->timeline->map(fn($t) => [
                'time' => $t->horario,
                'title' => $t->titulo,
                'desc' => $t->descricao,
            ])->toArray(),
            'highlights' => $serie->destaques->pluck('descricao')->toArray(),
            'testimonial' => [
                'quote' => $serie->depoimento_texto ?? '',
                'author' => $serie->depoimento_autor ?? '',
                'role' => $serie->depoimento_papel ?? '',
            ],
            'slides' => $serie->fotos->map(fn($f) => [
                'src' => $f->caminho_imagem,
                'moment' => $f->momento ?? '',
                'caption' => $f->legenda ?? '',
                'imgStyle' => $f->estilo_customizado ?? '',
            ])->toArray(),
        ];
    }
}

