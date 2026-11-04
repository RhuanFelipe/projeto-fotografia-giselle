<?php

namespace App\Services;

use App\Models\DiaAgenda;
use App\Models\HorarioAgenda;
use Illuminate\Support\Facades\DB;

class AgendaService
{
    public function getMapaAgenda(): array
    {
        $dias = DiaAgenda::with('horarios')->get();
        $mapa = [];

        foreach ($dias as $dia) {
            $dataStr = $dia->data->format('Y-m-d');
            $statusMap = [
                'disponivel' => 'available',
                'poucas_vagas' => 'limited',
                'reservado' => 'booked',
                'bloqueado' => 'booked',
            ];

            $mapa[$dataStr] = [
                'status' => $statusMap[$dia->status] ?? $dia->status,
                'status_original' => $dia->status,
                'title' => $dia->titulo ?? '',
                'categoria' => $dia->categoria ?? '',
                'slots' => $dia->horarios->map(fn($h) => [
                    'time' => $h->horario,
                    'desc' => $h->descricao,
                    'disp' => (bool) $h->disponivel,
                ])->toArray(),
            ];
        }

        return $mapa;
    }

    public function salvarOuAtualizarDia(string $data, string $status, ?string $titulo, ?string $categoria, array $slots = []): DiaAgenda
    {
        return DB::transaction(function () use ($data, $status, $titulo, $categoria, $slots) {
            $statusDb = match ($status) {
                'available' => 'disponivel',
                'limited' => 'poucas_vagas',
                'booked' => 'reservado',
                default => $status,
            };

            $dia = DiaAgenda::updateOrCreate(
                ['data' => $data],
                [
                    'status' => $statusDb,
                    'titulo' => $titulo,
                    'categoria' => $categoria,
                ]
            );

            // Atualiza slots se fornecidos
            if (!empty($slots)) {
                $dia->horarios()->delete();
                foreach ($slots as $idx => $slot) {
                    HorarioAgenda::create([
                        'dia_agenda_id' => $dia->id,
                        'horario' => $slot['time'] ?? 'Horário',
                        'descricao' => $slot['desc'] ?? '',
                        'disponivel' => (bool) ($slot['disp'] ?? false),
                        'ordem' => $idx + 1,
                    ]);
                }
            }

            return $dia->load('horarios');
        });
    }
}

