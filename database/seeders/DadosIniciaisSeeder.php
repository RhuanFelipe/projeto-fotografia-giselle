<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DadosIniciaisSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Usuário Administrador
        DB::table('usuarios')->insertOrIgnore([
            'id' => 1,
            'nome' => 'Rhuan Administrador',
            'email' => 'admin@rhuanfotografia.com.br',
            'senha' => Hash::make('123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Configurações Globais do Estúdio
        $configs = [
            ['chave' => 'valor_hora_adicional', 'valor' => '220', 'tipo_dado' => 'decimal'],
            ['chave' => 'nome_estudio', 'valor' => 'Rhuan Fotografia Autoral', 'tipo_dado' => 'string'],
            ['chave' => 'telefone_whatsapp', 'valor' => '(11) 99876-5432', 'tipo_dado' => 'string'],
            ['chave' => 'email_contato', 'valor' => 'contato@rhuanfotografia.com.br', 'tipo_dado' => 'string'],
            ['chave' => 'endereco_estudio', 'valor' => 'Jardim Imperial • Holambra, SP', 'tipo_dado' => 'string'],
            ['chave' => 'secoes_visibilidade', 'valor' => json_encode([
                'inicio' => true,
                'agenda' => true,
                'ensaios' => true,
                'orcamentos' => true,
                'sobre' => true,
                'depoimentos' => true,
                'contato' => true,
            ]), 'tipo_dado' => 'json'],
        ];
        foreach ($configs as $config) {
            DB::table('configuracoes_estudio')->updateOrInsert(
                ['chave' => $config['chave']],
                array_merge($config, ['created_at' => now(), 'updated_at' => now()])
            );
        }

        // 3. Categorias de Serviço & Preços Base
        $categorias = [
            'ensaio-feminino' => ['nome' => 'Ensaio Feminino / Retrato', 'base' => 650, 'horas' => 2, 'fotos' => 25, 'ordem' => 1],
            'ensaio-gestante' => ['nome' => 'Ensaio Gestante Fine Art', 'base' => 750, 'horas' => 2, 'fotos' => 30, 'ordem' => 2],
            'festa-15anos' => ['nome' => 'Festa de 15 Anos / Debutante', 'base' => 1800, 'horas' => 5, 'fotos' => 150, 'ordem' => 3],
            'casamento' => ['nome' => 'Casamento Completo', 'base' => 3200, 'horas' => 8, 'fotos' => 350, 'ordem' => 4],
            'evento-social' => ['nome' => 'Evento Social / Aniversário', 'base' => 1200, 'horas' => 4, 'fotos' => 100, 'ordem' => 5],
        ];

        foreach ($categorias as $slug => $cat) {
            $catId = DB::table('categorias_servico')->insertGetId([
                'slug' => $slug,
                'nome' => $cat['nome'],
                'ativo' => true,
                'ordem' => $cat['ordem'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('tabela_precos')->insert([
                'categoria_servico_id' => $catId,
                'preco_base' => $cat['base'],
                'horas_inclusas' => $cat['horas'],
                'quantidade_fotos' => $cat['fotos'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 4. Adicionais de Serviço
        $adicionais = [
            ['slug' => 'album-fineart', 'nome' => 'Álbum Fine Art Luxo (30x30cm)', 'descricao' => 'Capa em linho cru com 40 páginas em papel de algodão.', 'preco' => 780],
            ['slug' => 'segundo-fotografo', 'nome' => 'Segundo Fotógrafo Especialista', 'descricao' => 'Cobertura completa de múltiplos ângulos simultâneos.', 'preco' => 600],
            ['slug' => 'ensaio-pre', 'nome' => 'Ensaio Pré-Evento (Externo)', 'descricao' => 'Sessão fotográfica ao ar livre antes da data principal.', 'preco' => 550],
            ['slug' => 'drone', 'nome' => 'Imagens Aéreas com Drone', 'descricao' => 'Capturas aéreas em alta definição do local e da celebração.', 'preco' => 450],
            ['slug' => 'express', 'nome' => 'Entrega Expressa em 48 Horas', 'descricao' => 'Prévia especial completa entregue em até 2 dias úteis.', 'preco' => 350],
        ];

        foreach ($adicionais as $add) {
            DB::table('adicionais_servico')->insert(array_merge($add, [
                'ativo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }

        // 5. Séries do Portfólio
        $catCasamento = DB::table('categorias_servico')->where('slug', 'casamento')->value('id');
        $cat15Anos = DB::table('categorias_servico')->where('slug', 'festa-15anos')->value('id');
        $catGestante = DB::table('categorias_servico')->where('slug', 'ensaio-gestante')->value('id');
        $catFeminino = DB::table('categorias_servico')->where('slug', 'ensaio-feminino')->value('id');

        // Série: Casamento
        $casamentoId = DB::table('series_portfolio')->insertGetId([
            'slug' => 'casamento',
            'categoria_servico_id' => $catCasamento,
            'titulo' => 'O Sim de Mariana & Rodrigo',
            'titulo_curto' => 'Mariana & Rodrigo',
            'rotulo_categoria' => 'Casamento Real',
            'localizacao' => 'Jardim Imperial • Holambra, SP',
            'data_formatada' => '18 de Outubro de 2026',
            'data_evento' => '2026-10-18',
            'duracao' => '8 Horas de Cobertura Integral',
            'equipe' => '2 Fotógrafos + Assistente de Luz',
            'quantidade_entrega' => '420 Fotos Tratadas em Alta Resolução',
            'estilo_iluminacao' => 'Luz Natural Golden Hour & Flash Difuso Quente',
            'imagem_capa' => 'assets/images/casamento.jpg',
            'resumo' => 'Uma celebração rústico-chique ao ar livre envolta por roseiras, votos emocionantes e a luz dourada do fim de tarde no interior paulista.',
            'depoimento_texto' => 'Quando abrimos a galeria pela primeira vez, choramos tudo de novo! O Rhuan capturou sorrisos e abraços que nem tínhamos visto acontecer no dia. As fotos do pôr do sol parecem pinturas.',
            'depoimento_autor' => 'Mariana & Rodrigo Vasconcelos',
            'depoimento_papel' => 'Noivos • Casamento em Holambra',
            'ativo' => true,
            'ordem' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Parágrafos da História (Casamento)
        $paragrafosCasamento = [
            'O casamento de Mariana e Rodrigo foi planejado para refletir a leveza e a cumplicidade do casal. Realizado nos jardins floridos de Holambra, o evento começou no meio da tarde para aproveitar a transição suave da luz do sol entre as árvores centenárias.',
            'Durante o making-of, priorizamos retratos intimistas e serenos, registrando a troca de cartas manuscritas e o carinho da família. Na cerimônia ao ar livre, trabalhamos com duas câmeras em ângulos complementares para capturar tanto a reação emocionante do noivo no altar quanto os olhares marejados dos convidados.',
            'Logo após os votos, conduzimos um ensaio de 25 minutos pelo campo durante o pôr do sol (Golden Hour), sem poses rígidas — apenas caminhando, conversando e deixando a emoção do momento fluir antes da abertura animada da pista de dança.'
        ];
        foreach ($paragrafosCasamento as $i => $p) {
            DB::table('paragrafos_historia')->insert([
                'serie_id' => $casamentoId,
                'texto' => $p,
                'ordem' => $i + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Timeline (Casamento)
        $timelineCasamento = [
            ['time' => '14:30', 'title' => 'Making-of da Noiva & Detalhes', 'desc' => 'Registro do vestido, joias de família, buquê orgânico e preparação com mãe e madrinhas.'],
            ['time' => '16:15', 'title' => 'Cerimônia sob as Figueiras', 'desc' => 'Entrada do cortejo, votos autorais ao ar livre e chuva de pétalas naturais na saída.'],
            ['time' => '17:30', 'title' => 'Ensaio Golden Hour do Casal', 'desc' => 'Sessão exclusiva nos jardins com luz lateral dourada de fim de tarde.'],
            ['time' => '19:00', 'title' => 'Jantar Intimista & Primeira Dança', 'desc' => 'Brinde sob varal de luzes quentes, corte do bolo e valsa contemporânea.'],
            ['time' => '20:30', 'title' => 'Festa & Pista de Dança', 'desc' => 'Cobertura dinâmica e espontânea da celebração com amigos até a madrugada.'],
        ];
        foreach ($timelineCasamento as $i => $t) {
            DB::table('etapas_timeline')->insert([
                'serie_id' => $casamentoId,
                'horario' => $t['time'],
                'titulo' => $t['title'],
                'descricao' => $t['desc'],
                'ordem' => $i + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Destaques (Casamento)
        $destaquesCasamento = [
            'Cobertura completa de 8 horas com 2 fotógrafos',
            'Making-of da noiva e do noivo simultâneos',
            'Ensaio exclusivo no pôr do sol pós-cerimônia',
            'Galeria online privativa entregue em 15 dias úteis',
            'Álbum Fine Art 30x30cm em linho cru com 40 páginas',
            'Prévia expressa com 30 fotos entregue em 48 horas',
        ];
        foreach ($destaquesCasamento as $i => $d) {
            DB::table('destaques_serie')->insert([
                'serie_id' => $casamentoId,
                'descricao' => $d,
                'ordem' => $i + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Fotos (Casamento)
        $fotosCasamento = [
            ['src' => 'assets/images/casamento.jpg', 'moment' => 'Foto 01 • Ensaio no Pôr do Sol', 'caption' => 'Mariana e Rodrigo nos jardins de Holambra logo após o "Sim", banhados pela luz dourada das 17h40.', 'e_capa' => true],
            ['src' => 'assets/images/hero.jpg', 'moment' => 'Foto 02 • Making-of da Noiva', 'caption' => 'Retrato editorial nos momentos finais da preparação, valorizando a luz de janela suave e a delicadeza do véu.', 'e_capa' => false],
            ['src' => 'assets/images/casamento.jpg', 'moment' => 'Foto 03 • Detalhes no Altar', 'caption' => 'Enquadramento aproximado destacando a conexão das mãos, as alianças e o buquê autoral.', 'e_capa' => false],
            ['src' => 'assets/images/feminino.jpg', 'moment' => 'Foto 04 • Retrato Individual no Campo', 'caption' => 'Breve pausa individual da noiva entre as árvores centenárias antes da recepção com os convidados.', 'e_capa' => false],
            ['src' => 'assets/images/casamento.jpg', 'moment' => 'Foto 05 • Estética Fine Art Monocromática', 'caption' => 'Versão monocromática atemporal ressaltando as texturas do linho e a emoção pura do momento.', 'e_capa' => false],
        ];
        foreach ($fotosCasamento as $i => $f) {
            DB::table('fotos_portfolio')->insert([
                'serie_id' => $casamentoId,
                'caminho_imagem' => $f['src'],
                'momento' => $f['moment'],
                'legenda' => $f['caption'],
                'e_capa' => $f['e_capa'],
                'ordem' => $i + 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Série: 15 Anos
        $quinzeId = DB::table('series_portfolio')->insertGetId([
            'slug' => '15anos',
            'categoria_servico_id' => $cat15Anos,
            'titulo' => 'Noite Inesquecível de Clara',
            'titulo_curto' => 'Debutante Clara',
            'rotulo_categoria' => '15 Anos & Debutante',
            'localizacao' => 'Salão Villa Real • São Paulo, SP',
            'data_formatada' => '24 de Outubro de 2026',
            'data_evento' => '2026-10-24',
            'duracao' => '6 Horas de Cobertura',
            'equipe' => '2 Fotógrafos + Iluminação Criativa',
            'quantidade_entrega' => '240 Fotos Tratadas',
            'imagem_capa' => 'assets/images/15anos.jpg',
            'resumo' => 'Cenas vibrantes com luzes pontuais, vestido rodado champanhe e valsa emocionante com família e amigos.',
            'depoimento_texto' => 'Fiquei encantada com cada foto! O Rhuan conseguiu captar minha felicidade e a energia da festa do começo ao fim.',
            'depoimento_autor' => 'Clara & Família',
            'depoimento_papel' => 'Debutante',
            'ativo' => true,
            'ordem' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('fotos_portfolio')->insert([
            'serie_id' => $quinzeId,
            'caminho_imagem' => 'assets/images/15anos.jpg',
            'momento' => 'Foto 01 • A Grande Valsa',
            'legenda' => 'Clara no centro do salão durante o giro principal da valsa.',
            'e_capa' => true,
            'ordem' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Série: Gestante
        $gestanteId = DB::table('series_portfolio')->insertGetId([
            'slug' => 'gestante',
            'categoria_servico_id' => $catGestante,
            'titulo' => 'À Espera de Bento',
            'titulo_curto' => 'Lívia & Bento',
            'rotulo_categoria' => 'Ensaio Gestante',
            'localizacao' => 'Parque das Águas • Campinas, SP',
            'data_formatada' => '12 de Outubro de 2026',
            'data_evento' => '2026-10-12',
            'duracao' => '2 Horas',
            'equipe' => '1 Fotógrafo Especialista',
            'quantidade_entrega' => '45 Fotos Tratadas',
            'imagem_capa' => 'assets/images/gestante.jpg',
            'resumo' => 'A conexão materna traduzida em tons neutros, aconchego e a serenidade da gestação na natureza.',
            'ativo' => true,
            'ordem' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('fotos_portfolio')->insert([
            'serie_id' => $gestanteId,
            'caminho_imagem' => 'assets/images/gestante.jpg',
            'momento' => 'Foto 01 • Conexão Materna',
            'legenda' => 'Luz difusa de manhã valorizando as formas e a tranquilidade da maternidade.',
            'e_capa' => true,
            'ordem' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Série: Feminino
        $femId = DB::table('series_portfolio')->insertGetId([
            'slug' => 'feminino',
            'categoria_servico_id' => $catFeminino,
            'titulo' => 'Essência & Retrato Autoral',
            'titulo_curto' => 'Camila Fernandes',
            'rotulo_categoria' => 'Ensaio Feminino',
            'localizacao' => 'Estúdio Luz & Sombra • São Paulo, SP',
            'data_formatada' => '05 de Outubro de 2026',
            'data_evento' => '2026-10-05',
            'duracao' => '2h30 de Sessão',
            'equipe' => '1 Fotógrafo + Direção de Poses',
            'quantidade_entrega' => '35 Fotos com Retoque Fine Art',
            'imagem_capa' => 'assets/images/feminino.jpg',
            'resumo' => 'Retratos elegantes focados em autoimagem, sofisticação e iluminação dramática contemporânea.',
            'ativo' => true,
            'ordem' => 4,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('fotos_portfolio')->insert([
            'serie_id' => $femId,
            'caminho_imagem' => 'assets/images/feminino.jpg',
            'momento' => 'Foto 01 • Retrato Editorial',
            'legenda' => 'Iluminação clássica destacando a expressividade do olhar.',
            'e_capa' => true,
            'ordem' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 6. Dias e Horários da Agenda
        $diasAgenda = [
            '2026-10-18' => [
                'status' => 'reservado',
                'titulo' => 'Casamento Mariana & Rodrigo',
                'categoria' => 'Casamento',
                'slots' => [['time' => '16:00 - 02:00', 'desc' => 'Cerimônia & Recepção (Reservado)', 'disp' => false]]
            ],
            '2026-10-24' => [
                'status' => 'reservado',
                'titulo' => 'Festa de 15 Anos - Clara',
                'categoria' => 'Festa 15 Anos',
                'slots' => [['time' => '19:00 - 03:00', 'desc' => 'Festa de Gala (Reservado)', 'disp' => false]]
            ],
            '2026-10-25' => [
                'status' => 'poucas_vagas',
                'titulo' => 'Ensaios Externos',
                'categoria' => 'Ensaio',
                'slots' => [
                    ['time' => '08:30 - 10:30', 'desc' => 'Ensaio Gestante - Lívia (Reservado)', 'disp' => false],
                    ['time' => '16:00 - 18:00', 'desc' => 'Horário Golden Hour (Disponível!)', 'disp' => true]
                ]
            ],
            '2026-10-31' => [
                'status' => 'reservado',
                'titulo' => 'Casamento Beatriz & Guilherme',
                'categoria' => 'Casamento',
                'slots' => [['time' => '15:30 - 01:00', 'desc' => 'Evento Completo (Reservado)', 'disp' => false]]
            ],
            '2026-11-07' => [
                'status' => 'reservado',
                'titulo' => 'Festa de 15 Anos - Larissa',
                'categoria' => 'Festa 15 Anos',
                'slots' => [['time' => '19:30 - 03:30', 'desc' => 'Espaço Villa Real (Reservado)', 'disp' => false]]
            ],
            '2026-11-14' => [
                'status' => 'poucas_vagas',
                'titulo' => 'Ensaios em Estúdio',
                'categoria' => 'Ensaio',
                'slots' => [
                    ['time' => '10:00 - 12:00', 'desc' => 'Ensaio Feminino (Disponível!)', 'disp' => true],
                    ['time' => '14:30 - 16:30', 'desc' => 'Ensaio de Família (Reservado)', 'disp' => false]
                ]
            ],
        ];

        foreach ($diasAgenda as $data => $info) {
            $diaId = DB::table('dias_agenda')->insertGetId([
                'data' => $data,
                'status' => $info['status'],
                'titulo' => $info['titulo'],
                'categoria' => $info['categoria'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($info['slots'] as $i => $slot) {
                DB::table('horarios_agenda')->insert([
                    'dia_agenda_id' => $diaId,
                    'horario' => $slot['time'],
                    'descricao' => $slot['desc'],
                    'disponivel' => $slot['disp'],
                    'ordem' => $i + 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 7. Solicitações de Orçamento Iniciais (Leads)
        DB::table('solicitacoes_orcamento')->insert([
            'tipo' => 'orcamento',
            'nome' => 'Mariana Vasconcelos',
            'email' => 'mariana.vasc@gmail.com',
            'telefone' => '(11) 98765-4321',
            'categoria_servico_id' => $catCasamento,
            'nome_categoria' => 'Casamento Completo',
            'data_evento' => '2026-11-21',
            'horas_cobertura' => 8,
            'valor_estimado' => 4500.00,
            'mensagem' => 'Gostaria de saber se a data de 21/11 está disponível para cerimônia em Holambra.',
            'status' => 'novo',
            'created_at' => now()->subDays(2),
            'updated_at' => now()->subDays(2),
        ]);
    }
}

