/**
 * Chess Mastery — Teoria de Aberturas & Defesas Pré-Instaladas
 * 100% Offline · Sincronizado com @shared/ui/chess/openingsTheory.js
 */
(function () {
  window.OPENING_CATEGORIES = [
    { id: 'open', label: 'Aberturas Abertas', subtitle: '1.e4 e5 — O Choque Central Clássico', icon: '⚔️' },
    { id: 'semi_open', label: 'Defesas Semi-Abertas', subtitle: '1.e4 contra Defesas Negras (Siciliana, Francesa, Caro-Kann)', icon: '🛡️' },
    { id: 'closed', label: 'Aberturas Fechadas', subtitle: '1.d4 d5 — A Batalha Estratégica do Gambito da Dama', icon: '🏰' },
    { id: 'semi_closed', label: 'Defesas Semi-Fechadas & Índias', subtitle: '1.d4 Cf6 — Sistemas Hipermodernos (KID, Nimzoíndia, Grünfeld)', icon: '⚡' },
    { id: 'flank', label: 'Aberturas de Flanco', subtitle: '1.c4, 1.Cf3 — Controle Assimétrico e Pressão à Distância', icon: '🌐' },
  ];

  window.CHESS_OPENINGS = [
    // 1. ABERTURAS ABERTAS (1.e4 e5)
    {
      id: 'op-italiana-giuoco-piano',
      namePt: 'Abertura Italiana (Giuoco Piano)',
      nameOriginal: 'Italian Game (Giuoco Piano)',
      eco: 'C50',
      category: 'open',
      heroColor: 'w',
      badgeText: 'Desenvolvimento Harmônico & Ataque a f7',
      tag: 'Clássica / Posicional',
      introPt: 'Uma das aberturas mais antigas e nobres do xadrez. O Bispo em c4 aponta diretamente para o ponto mais vulnerável das pretas (f7), enquanto as brancas preparam a construção de um centro amplo com c3 e d4.',
      pawnStructure: 'As Brancas buscam formar o duo central d4-e4. As Pretas sustentam e5 e contestam o avanço d4 com ...exd4 seguido por ...d5.',
      plansWhite: [
        'Construir a dupla central d4 e e4 com a preparação c2-c3.',
        'Explorar a debilidade da casa f7 através do Bispo de c4 e saltos do Cavalo para g5.',
        'Manobrar o Cavalo de b1 via d2-f1-g3 para reforçar o ataque na ala do Rei.'
      ],
      plansBlack: [
        'Neutralizar o Bispo de c4 com contra-ataques precisos (...Cf6 e ...d5).',
        'Manter o ponto forte em e5 ou trocar em d4 gerando contra-jogo ativo.',
        'Cravadas ativas do Cavalo de f3 com ...Bg4 quando o centro branco avançar.'
      ],
      trapsPt: 'Cuidado com 4.c3 seguido de d4 precoce sem preparação; as Pretas podem contra-atacar com 4...Cf6 e punir o peão de e4 desprotegido.',
      relatedBookGameId: 'xb-game-morphy-opera',
      movesSan: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4', 'cxd4', 'Bb4+', 'Bd2', 'Bxd2+', 'Nbxd2', 'd5'],
      annotations: {
        1: { ply: 1, commentPt: 'Ocupa o centro e libera diagonais para a Dama e o Bispo do Rei.', arrows: [{ from: 'e2', to: 'e4', color: 'emerald' }], highlights: [{ square: 'e4', color: 'emerald' }] },
        2: { ply: 2, commentPt: 'A melhor resposta de simetria: contesta o controle de d4 e prepara o desenvolvimento rápido.', arrows: [{ from: 'e7', to: 'e5', color: 'emerald' }] },
        3: { ply: 3, commentPt: 'Desenvolve atacando imediatamente o peão central e5.', arrows: [{ from: 'g1', to: 'f3', color: 'emerald' }] },
        4: { ply: 4, commentPt: 'Desenvolve defendendo o peão central e5.', arrows: [{ from: 'b8', to: 'c6', color: 'emerald' }] },
        5: { ply: 5, commentPt: 'O lance temático da Italiana! O Bispo ocupa a grande diagonal mirando a fraca casa f7.', arrows: [{ from: 'f1', to: 'c4', color: 'emerald' }], highlights: [{ square: 'f7', color: 'amber' }] },
        6: { ply: 6, commentPt: 'Giuoco Piano ("Jogo Tranquilo"): desenvolve ativamente sem permitir saltos imediatos de Cg5.', arrows: [{ from: 'f8', to: 'c5', color: 'emerald' }] },
        7: { ply: 7, commentPt: 'O lance chave! As Brancas preparam o grande empurrão central d2-d4 para dominar o tabuleiro.', arrows: [{ from: 'c2', to: 'c3', color: 'emerald' }, { from: 'c3', to: 'd4', color: 'sky' }] },
        8: { ply: 8, commentPt: 'Excelente contragolpe: desenvolve a peça e ataca o peão desprotegido de e4.', arrows: [{ from: 'g8', to: 'f6', color: 'emerald' }] },
        9: { ply: 9, commentPt: 'Ruptura central! As brancas desafiam o centro preto e abrem a coluna c.', arrows: [{ from: 'd2', to: 'd4', color: 'emerald' }] },
        10: { ply: 10, commentPt: 'As Pretas são forçadas a ceder a tensão no centro para não perder o Bispo.', arrows: [{ from: 'e5', to: 'd4', color: 'emerald' }] },
        11: { ply: 11, commentPt: 'Retomada formando o imponente centro de peões brancos d4-e4.', arrows: [{ from: 'c3', to: 'd4', color: 'emerald' }], highlights: [{ square: 'd4', color: 'emerald' }, { square: 'e4', color: 'emerald' }] },
        12: { ply: 12, commentPt: 'Xeque intermediário fundamental! Obriga as brancas a cobrir o xeque e ganha tempo para o contra-ataque d5.', arrows: [{ from: 'c5', to: 'b4', color: 'emerald' }] }
      }
    },
    {
      id: 'op-gambit-evans',
      namePt: 'Gambito Evans',
      nameOriginal: 'Evans Gambit',
      eco: 'C52',
      category: 'open',
      heroColor: 'w',
      badgeText: 'Sacrifício Romântico & Velocidade Pura',
      tag: 'Ultra-Agressiva / Tática',
      introPt: 'Criado pelo capitão William Evans em 1827. As brancas sacrificam o peão b4 para desviar o Bispo preto, ganhar tempos com c3 e d4, e acelerar o desenvolvimento a níveis devastadores.',
      pawnStructure: 'Brancas com peão a menos mas centro colossal e linhas abertas diagonais contra o Rei preto.',
      plansWhite: [
        'Sacrificar o peão de b4 para ganhar dois tempos capitais com c2-c3 e d2-d4.',
        'Abrir as diagonais para o Bispo de c4 e a Dama em b3 mirando f7.',
        'Impedir o roque das Pretas com Ba3 se necessário.'
      ],
      plansBlack: [
        'Aceitar o gambito mas devolver o peão no momento oportuno (...d5!) para aliviar a pressão.',
        'Manter o Rei protegido e buscar a simplificação de peças menores.',
        'Evitar ganância excessiva de peões na ala da Dama.'
      ],
      trapsPt: 'Tentar segurar todos os peões com ...Db6 ou ...De7 expõe o Rei preto a sacrifícios imediatos em f7.',
      relatedBookGameId: 'xb-game-steinitz-bardeleben',
      movesSan: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bxb4', 'c3', 'Ba5', 'd4', 'exd4', 'O-O', 'Nge7', 'cxd4', 'd5'],
      annotations: {
        7: { ply: 7, commentPt: 'O Lance do Gambito Evans! 4. b4! Sacrifica o peão da ala da Dama para abrir linhas e ganhar tempos.', badge: '!', arrows: [{ from: 'b2', to: 'b4', color: 'rose' }], highlights: [{ square: 'b4', color: 'rose' }] },
        8: { ply: 8, commentPt: 'As Pretas aceitam o desafio capturando o peão.', arrows: [{ from: 'c5', to: 'b4', color: 'emerald' }] },
        9: { ply: 9, commentPt: 'Ganha tempo sobre o Bispo e apoia a ruptura d4.', arrows: [{ from: 'c2', to: 'c3', color: 'emerald' }] },
        11: { ply: 11, commentPt: 'Golpe no centro! O objetivo do gambito ganha vida com pressão máxima.', arrows: [{ from: 'd2', to: 'd4', color: 'emerald' }] }
      }
    },
    {
      id: 'op-ruy-lopez-morphy',
      namePt: 'Abertura Espanhola (Ruy López: Defesa Morphy)',
      nameOriginal: 'Ruy Lopez (Morphy Defense)',
      eco: 'C70',
      category: 'open',
      heroColor: 'w',
      badgeText: 'O Clássico dos Campeões Mundiais',
      tag: 'Estratégica / Profunda',
      introPt: 'Jogada e estudada desde o século XVI, a Espanhola é o teste supremo da compreensão estratégica. O Bispo em b5 pressiona indiretamente o peão de e5 ao ameaçar o Cavalo que o defende.',
      pawnStructure: 'As Pretas frequentemente expandem com ...b5 e ...d6. As Brancas constroem com c3 e d4 mantendo tensão.',
      plansWhite: [
        'Manter pressão constante sobre e5 e transferir o Cavalo de b1 para f1 e g3.',
        'Controlar a coluna e aberta com Te1 após o roque.',
        'Preparar a expansão central c3 seguido de d4 mantendo a flexibilidade.'
      ],
      plansBlack: [
        'Questionar o Bispo branco imediatamente com 3...a6 (Defesa Morphy).',
        'Espantar o Bispo com ...b5 e estabilizar o centro com ...d6 e ...Be7.',
        'Contra-atacar a ala da Dama com ...Ca5 e ...c5.'
      ],
      trapsPt: 'Armadilha da Arca de Noé: as Pretas prendem o Bispo branco de casas claras em b3 com a manobra ...a6, ...b5, ...d6 e ...c4!',
      relatedBookGameId: 'xb-game-capablanca-steiner',
      movesSan: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O'],
      annotations: {
        5: { ply: 5, commentPt: '3. Bb5! A Ruy López clássica. Ataca o defensor do peão e5.', arrows: [{ from: 'f1', to: 'b5', color: 'emerald' }], highlights: [{ square: 'c6', color: 'sky' }, { square: 'e5', color: 'amber' }] },
        6: { ply: 6, commentPt: 'A célebre Defesa Morphy: força o Bispo branco a declarar suas intenções.', arrows: [{ from: 'a7', to: 'a6', color: 'emerald' }] },
        7: { ply: 7, commentPt: 'Mantém a cravada e a pressão ao longo da diagonal a4-e8.', arrows: [{ from: 'b5', to: 'a4', color: 'emerald' }] },
        11: { ply: 11, commentPt: 'Defende o peão e4 e coloca a Torre na coluna real central.', arrows: [{ from: 'f1', to: 'e1', color: 'emerald' }] }
      }
    },
    {
      id: 'op-ruy-lopez-exchange',
      namePt: 'Abertura Espanhola (Variante das Trocas)',
      nameOriginal: 'Ruy Lopez (Exchange Variation)',
      eco: 'C68',
      category: 'open',
      heroColor: 'w',
      badgeText: 'Maioria de Peões no Final & Fischer Weapon',
      tag: 'Final Superior / Estratégica',
      introPt: 'Popularizada por Emanuel Lasker e refinada por Bobby Fischer. As brancas entregam o par de bispos na 4ª jogada para dobrar os peões pretos na coluna c, garantindo uma maioria limpa no final.',
      pawnStructure: 'As Brancas têm 4 peões contra 3 na ala do Rei (maioria saudável capaz de criar um peão passado). As Pretas têm 4 peões na ala da Dama neutralizados por 3 brancos devido aos peões dobrados.',
      plansWhite: [
        'Trocar todas as peças maiores para entrar diretamente em um final de peões ganhador.',
        'Avançar a maioria de peões na ala do Rei (f4, e5, g4) criando um peão passado protegido.',
        'Controlar a coluna d com as Torres.'
      ],
      plansBlack: [
        'Utilizar a força do par de bispos em posição aberta para criar contra-ataque dinâmico.',
        'Evitar trocas passivas e abrir o jogo antes que o final chegue.',
        'Ativar a Dama em d6 ou f6 e rocar na ala grande se possível.'
      ],
      trapsPt: 'As Pretas não devem rocar curto passivamente; a ausência de peões intactos na ala da Dama exige dinamismo.',
      relatedBookGameId: 'kg-game-fischer-spassky-m6',
      movesSan: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Bxc6', 'dxc6', 'O-O', 'f6', 'd4', 'exd4', 'Nxd4', 'c5', 'Nb3', 'Qxd1', 'Rxd1'],
      annotations: {
        7: { ply: 7, commentPt: '4. Bxc6! A troca imediata. Fischer jogava esta linha para desmantelar a estrutura preta.', badge: '!', arrows: [{ from: 'b5', to: 'c6', color: 'emerald' }], highlights: [{ square: 'c6', color: 'rose' }, { square: 'c7', color: 'rose' }] },
        8: { ply: 8, commentPt: 'A retomada correta: abre linhas para o Bispo de c8 e a Dama.', arrows: [{ from: 'd7', to: 'c6', color: 'emerald' }] }
      }
    },
    {
      id: 'op-four-knights',
      namePt: 'Abertura dos Quatro Cavalos',
      nameOriginal: 'Four Knights Game',
      eco: 'C49',
      category: 'open',
      heroColor: 'w',
      badgeText: 'Simetria de Ferro & A Arte de Capablanca',
      tag: 'Posicional Clássica',
      introPt: 'Abertura de máxima solidez e princípios puros de desenvolvimento. Todas as quatro peças menores entram rapidamente em jogo. Orfeu D\'Agostini dedica destaque a ela em Xadrez Básico.',
      pawnStructure: 'Centro clássico e5 vs e4. As Brancas buscam a dobra de peões com Bxc6 e abertura da coluna f.',
      plansWhite: [
        'Cravar o Cavalo de f6 com Bg5 após Bb5 e roque curto.',
        'Dobrar os peões pretos em c6 e abrir a coluna de Bispo do Rei (f) com f4.',
        'Usar as Torres dobradas na coluna f para atacar o Rei preto.'
      ],
      plansBlack: [
        'Manter a simetria com ...Bb4 e manobrar o Cavalo para e7 e g6.',
        'Pressionar o centro com ...d6 e ...De7.',
        'Trocar o Bispo pelo Cavalo de c3 para equilibrar as estruturas.'
      ],
      trapsPt: 'Se as Pretas jogarem ...h6 antes do roque, as Brancas podem sacrificar em h6 com ataque de mate.',
      relatedBookGameId: 'xb-game-capablanca-steiner',
      movesSan: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6', 'Bb5', 'Bb4', 'O-O', 'O-O', 'd3', 'd6', 'Bg5', 'Bxc3', 'bxc3', 'Qe7'],
      annotations: {
        5: { ply: 5, commentPt: 'Ambos os lados mobilizam seus quatro cavalos nos lances iniciais.', arrows: [{ from: 'b1', to: 'c3', color: 'emerald' }] },
        13: { ply: 13, commentPt: 'Bg5! A cravada temática no Cavalo de f6. Inicia o plano mestre ensinado por Capablanca.', arrows: [{ from: 'c1', to: 'g5', color: 'emerald' }], highlights: [{ square: 'f6', color: 'rose' }] }
      }
    },
    {
      id: 'op-petroff-defense',
      namePt: 'Defesa Russa (Petroff)',
      nameOriginal: 'Petrov Defense',
      eco: 'C42',
      category: 'open',
      heroColor: 'b',
      badgeText: 'A Fortaleza Inabalável dos Torneios',
      tag: 'Defesa Sólida / Contragolpe',
      introPt: 'Em vez de defender e5 com ...Cc6, as pretas contra-atacam imediatamente o peão de e4 com 2...Cf6. Foi a arma predileta de Anatoly Karpov e Fabiano Caruana para anular o primeiro lance branco.',
      pawnStructure: 'Estruturas simétricas com pontos fortes centrais em d4 e d5.',
      plansWhite: [
        'Buscar desequilíbrios com 3.d4 ou avanços na ala da Dama.',
        'Pressionar o Cavalo preto centralizado em e4 com Bd3 e c4.',
        'Manter iniciativa através do tempo extra de desenvolvimento.'
      ],
      plansBlack: [
        'Instalar o Cavalo na casa forte e4 e apoiar com ...d5.',
        'Desenvolver o Bispo para e7 e rocar rapidamente.',
        'Liquiditar as peças ativas brancas mantendo solidez pétrea.'
      ],
      trapsPt: 'Armadilha do Principiante: Nunca jogar 2...Cxe4? após 3.Cxe5, pois 4.De2! ganha o Cavalo ou a Dama preta.',
      relatedBookGameId: 'xb-game-capablanca-steiner',
      movesSan: ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'd6', 'Nf3', 'Nxe4', 'd4', 'd5', 'Bd3', 'Be7', 'O-O', 'O-O', 'c4', 'c6'],
      annotations: {
        4: { ply: 4, commentPt: '2... Nf6! A Defesa Petroff. Ignora a ameaça em e5 e ataca e4.', badge: '!', arrows: [{ from: 'g8', to: 'f6', color: 'emerald' }], highlights: [{ square: 'e4', color: 'sky' }] },
        6: { ply: 6, commentPt: 'Lance profilático crucial: expulsa o Cavalo branco antes de recapturar em e4.', arrows: [{ from: 'd7', to: 'd6', color: 'emerald' }] }
      }
    },

    // 2. DEFESAS SEMI-ABERTAS (1.e4 outros)
    {
      id: 'op-siciliana-najdorf',
      namePt: 'Defesa Siciliana (Variante Najdorf)',
      nameOriginal: 'Sicilian Defense (Najdorf Variation)',
      eco: 'B90',
      category: 'semi_open',
      heroColor: 'b',
      badgeText: 'A Arma Favorita de Fischer e Kasparov',
      tag: 'Combate Dinâmico / Teoria Afiada',
      introPt: 'Considerada a variante mais rica e complexa do xadrez moderno. Com 5...a6, as pretas controlam a casa b5, preparam uma expansão em b5 e mantêm flexibilidade total no centro (e5 ou e6).',
      pawnStructure: 'Maioria central de peões das Pretas (peões d6 e e5/e6 contra peão e4 branco), coluna c semi-aberta para as Pretas.',
      plansWhite: [
        'Ataque Inglês: f3, Be3, Qd2, 0-0-0 e tempestade de peões com g4-h4 contra o Rei preto.',
        'Ataque Clássico: 6.Bg5 com pressão imediata no Cavalo de f6 e avanço f4-f5.',
        'Dominar a casa d5 com peças menores.'
      ],
      plansBlack: [
        'Avançar ...b5 na ala da Dama e pressionar a coluna c com ...Tc8.',
        'Instalar o Cavalo em c5 ou e5 aproveitando casas fracas brancas.',
        'Ruptura central ...d5 no momento em que o ataque branco desacelerar.'
      ],
      trapsPt: 'Cuidado ao jogar ...e5 com o Bispo branco em c4 sem preparação: a casa d5 se torna um posto permanente invulnerável.',
      relatedBookGameId: 'kg-game-fischer-spassky-m6',
      movesSan: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be3', 'e5', 'Nb3', 'Be6', 'f3', 'Be7', 'Qd2', 'O-O'],
      annotations: {
        2: { ply: 2, commentPt: '1... c5! A Defesa Siciliana. Luta desbalanceada pelo centro a partir do primeiro lance.', arrows: [{ from: 'c7', to: 'c5', color: 'emerald' }] },
        10: { ply: 10, commentPt: '5... a6! A célebre Najdorf. Domina a casa b5 e prepara ...b5 ou ...e5.', badge: '!', arrows: [{ from: 'a7', to: 'a6', color: 'emerald' }], highlights: [{ square: 'b5', color: 'sky' }] },
        12: { ply: 12, commentPt: 'Golpe no centro! Expulsa o Cavalo e toma controle das casas pretas.', arrows: [{ from: 'e7', to: 'e5', color: 'emerald' }] }
      }
    },
    {
      id: 'op-siciliana-dragao',
      namePt: 'Defesa Siciliana (Variante do Dragão)',
      nameOriginal: 'Sicilian Defense (Dragon Variation)',
      eco: 'B70',
      category: 'semi_open',
      heroColor: 'b',
      badgeText: 'O Fogo da Grande Diagonal h8-a1',
      tag: 'Tática Violenta / Ataques Opostos',
      introPt: 'O nome deriva da semelhança da cadeia de peões pretos (d6-e7-f7-g6-h7) com a constelação do Dragão. O Bispo em g7 cospe fogo em direção à ala da Dama branca em roques opostos.',
      pawnStructure: 'Peão em g6 com roque curto preto. Brancas rocam grande e avançam peões h e g.',
      plansWhite: [
        'Ataque Iugoslavo: Be3, f3, Qd2, 0-0-0, Bc4 e h4-h5 abrindo a coluna h para mate.',
        'Trocar o poderoso Bispo do Dragão com Bh6.',
        'Sacrificar qualidade em d5 ou h5 para abrir a fortaleza do Rei preto.'
      ],
      plansBlack: [
        'Pressionar o Cavalo de c3 com a Torre em c8 e o Bispo em g7.',
        'Sacrifício temático de qualidade ...Txc3! destruindo o abrigo do Rei branco.',
        'Avanço rápido de peões na ala da Dama (...b5, ...a5).'
      ],
      trapsPt: 'Qualquer segundo perdido no Ataque Iugoslavo é fatal: quem atacar primeiro em roques opostos vence a partida.',
      relatedBookGameId: 'mt-game-tal-botvinnik-m6',
      movesSan: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6', 'Bc4', 'Bd7'],
      annotations: {
        10: { ply: 10, commentPt: '5... g6! O sinal do Dragão. O Bispo tomará seu posto supremo em g7.', arrows: [{ from: 'g7', to: 'g6', color: 'emerald' }] },
        12: { ply: 12, commentPt: 'O Bispo do Dragão entra em cena apontando para a ala da Dama.', arrows: [{ from: 'f8', to: 'g7', color: 'emerald' }], highlights: [{ square: 'g7', color: 'emerald' }, { square: 'c3', color: 'amber' }] }
      }
    },
    {
      id: 'op-francesa-avanco',
      namePt: 'Defesa Francesa (Variante do Avanço)',
      nameOriginal: 'French Defense (Advance Variation)',
      eco: 'C02',
      category: 'semi_open',
      heroColor: 'b',
      badgeText: 'A Cadeia de Peões & A Teoria de Nimzowitsch',
      tag: 'Estratégia Pura / Bloqueio',
      introPt: 'Objeto de estudo detalhado por Aron Nimzowitsch em "Meu Sistema". As brancas fecham o centro com 3.e5, e a luta gravita em torno do enfraquecimento e ataque à base da cadeia de peões (d4 e c5).',
      pawnStructure: 'Cadeia de peões interligada: Brancas em c3-d4-e5; Pretas em f7-e6-d5. Base branca em d4, ponta em e5.',
      plansWhite: [
        'Sustentar a base d4 com c2-c3.',
        'Utilizar a cunha espacial em e5 para armar um ataque ao roque na ala do Rei.',
        'Manter o Bispo de casas brancas apontando para h7 via Bd3.'
      ],
      plansBlack: [
        'Bombardear imediatamente a base da cadeia branca com ...c5, ...Cc6 e ...Db6.',
        'Ativar o Cavalo via h6-f5 para colocar quatro peças atacando o peão de d4.',
        'Resolver o problema do "Bispo mau" de c8 através de trocas ou manobras para a6.'
      ],
      trapsPt: 'As Pretas não devem jogar ...cxd4 muito cedo sem necessidade; manter a tensão em c5 imobiliza as peças brancas em d4.',
      relatedBookGameId: 'ms-game-nimzowitsch-salwe',
      movesSan: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6', 'a3', 'c4', 'Nbd2', 'Na5'],
      annotations: {
        2: { ply: 2, commentPt: '1... e6. A Francesa prepara a sólida sustentação do centro com d5.', arrows: [{ from: 'e7', to: 'e6', color: 'emerald' }] },
        5: { ply: 5, commentPt: '3. e5! Variante do Avanço. Cria a famosa cadeia de peões analisada por Nimzowitsch.', arrows: [{ from: 'e4', to: 'e5', color: 'emerald' }], highlights: [{ square: 'e5', color: 'emerald' }, { square: 'd4', color: 'emerald' }] },
        6: { ply: 6, commentPt: 'O contra-ataque obrigatório à base da cadeia!', arrows: [{ from: 'c7', to: 'c5', color: 'emerald' }] },
        10: { ply: 10, commentPt: 'Pressão máxima em d4! O peão central branco treme sob o assalto preto.', arrows: [{ from: 'd8', to: 'b6', color: 'emerald' }], highlights: [{ square: 'd4', color: 'rose' }] }
      }
    },
    {
      id: 'op-caro-kann-classica',
      namePt: 'Defesa Caro-Kann (Variante Clássica)',
      nameOriginal: 'Caro-Kann Defense (Classical Variation)',
      eco: 'B18',
      category: 'semi_open',
      heroColor: 'b',
      badgeText: 'Solidez Blindada & Estrutura Impecável',
      tag: 'Rochosa / Final Superior',
      introPt: 'Diferente da Francesa, a Caro-Kann prepara d5 com 1...c6, permitindo que o Bispo de casas brancas saia para f5 antes do fechamento da cadeia com ...e6. Favorecida por Capablanca e Karpov.',
      pawnStructure: 'As Pretas têm uma estrutura de peões ultra-sólida na ala do Rei (e6-f7-g7-h7) sem debilidades no final.',
      plansWhite: [
        'Ganhar espaço na ala do Rei com a manobra h4-h5 incomodando o Bispo preto.',
        'Instalar o Cavalo em e5 e posicionar o Bispo de casas claras na diagonal d3-h7.',
        'Aproveitar o desenvolvimento mais dinâmico para abrir o centro.'
      ],
      plansBlack: [
        'Trocar o Bispo em d3 e solidificar com ...e6 e ...Cd7.',
        'Buscar rupturas centrais libertadoras com ...c5 no momento exato.',
        'Conduzir o jogo para um final técnico onde a estrutura preta é imbatível.'
      ],
      trapsPt: 'Cuidado com lances descuidados de Bispo que permitam Cxg6 seguido de enfraquecimento da estrutura do roque.',
      relatedBookGameId: 'xb-game-botvinnik-capablanca',
      movesSan: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'h4', 'h6', 'Nf3', 'Nd7', 'h5', 'Bh7', 'Bd3', 'Bxd3', 'Qxd3', 'e6'],
      annotations: {
        2: { ply: 2, commentPt: '1... c6. A Caro-Kann: prepara a sustentação inquebrantável do peão em d5.', arrows: [{ from: 'c7', to: 'c6', color: 'emerald' }] },
        8: { ply: 8, commentPt: '4... Bf5! A grande virtude sobre a Francesa: o Bispo desenvolve-se ativamente!', arrows: [{ from: 'c8', to: 'f5', color: 'emerald' }], highlights: [{ square: 'f5', color: 'emerald' }] }
      }
    },

    // 3. ABERTURAS FECHADAS (1.d4 d5)
    {
      id: 'op-qgd-tartakower',
      namePt: 'Gambito da Dama Recusado (QGD)',
      nameOriginal: "Queen's Gambit Declined",
      eco: 'D30',
      category: 'closed',
      heroColor: 'w',
      badgeText: 'O Trono dos Campeões Mundiais',
      tag: 'Estratégica / Clássica Suprema',
      introPt: 'A abertura fechada mais respeitada da história, presente em praticamente todos os matches de Campeonato Mundial (Kasparov, Karpov, Alekhine, Capablanca). As pretas sustentam o centro em d5 com e6.',
      pawnStructure: 'Centro d4-c4 vs d5-e6. As Pretas mantêm uma âncora firme em d5 e buscam a libertação com ...c5 ou ...e5.',
      plansWhite: [
        'Pressionar a coluna c com Tc1 e utilizar a cravada de Bg5 contra o Cavalo de f6.',
        'Instalar um posto avançado de Cavalo na casa e5.',
        'Realizar a manobra minoritária (a3-b4) na ala da Dama para enfraquecer os peões pretos.'
      ],
      plansBlack: [
        'Aliviar a posição trocando peças menores através da Manobra de Capablanca (...Cd5).',
        'Libertar o Bispo de c8 via fianqueto (...b6 e ...Bb7) ou ruptura ...c5.',
        'Construir a barreira clássica com ...h6 e ...Be7.'
      ],
      trapsPt: 'Armadilha do Elefante: Se as Brancas tentarem ganhar o peão d5 com 4.cxd5 exd5 5.Cxd5??, as Pretas respondem 5...Cxd5! 6.Bxd8 Bb4+! recuperando a Dama com peça a mais.',
      relatedBookGameId: 'xb-game-botvinnik-capablanca',
      movesSan: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'h6', 'Bh4', 'b6', 'cxd5', 'Nxd5'],
      annotations: {
        3: { ply: 3, commentPt: '2. c4! O Gambito da Dama. Oferece o peão de flanco para dominar o centro com d4 e e4.', arrows: [{ from: 'c2', to: 'c4', color: 'emerald' }] },
        4: { ply: 4, commentPt: '2... e6! O Gambito Recusado. A melhor réplica estratégica, mantendo o bastião em d5.', arrows: [{ from: 'e7', to: 'e6', color: 'emerald' }], highlights: [{ square: 'd5', color: 'emerald' }] },
        7: { ply: 7, commentPt: 'A cravada clássica de Rubinstein e Capablanca.', arrows: [{ from: 'c1', to: 'g5', color: 'emerald' }] }
      }
    },
    {
      id: 'op-qga-aceito',
      namePt: 'Gambito da Dama Aceito (QGA)',
      nameOriginal: "Queen's Gambit Accepted",
      eco: 'D20',
      category: 'closed',
      heroColor: 'b',
      badgeText: 'Dinâmica de Espaço & Troca Central',
      tag: 'Contra-ataque Aberto',
      introPt: 'As pretas aceitam o peão c4 para desobstruir o centro e acelerar seu contra-ataque com ...c5 e ...a6-b5. Não pretendem segurar o peão, mas ganhar tempos de desenvolvimento.',
      pawnStructure: 'Brancas com centro e4-d4 aberto; Pretas com expansão rápida na ala da Dama a6-b5.',
      plansWhite: [
        'Recuperar o peão com Bxc4 sem concessões.',
        'Dominar o centro com e4 ou criar pressão na coluna d semi-aberta.',
        'Aproveitar o roque antecipado para lançar peças sobre a ala do Rei.'
      ],
      plansBlack: [
        'Não tentar segurar o peão c4 com ...b5 (que costuma ser refutado com a4!).',
        'Desferir o contra-golpe temático ...c5 para romper o centro branco.',
        'Fianquetar o Bispo da Dama em b7 com grande atividade.'
      ],
      trapsPt: 'Tentar segurar o peão c4 com 3...b5? leva a 4.a4 c6 5.axb5 cxb5 6.Qf3! ganhando a Torre de a8 presa no canto.',
      relatedBookGameId: 'xb-game-botvinnik-capablanca',
      movesSan: ['d4', 'd5', 'c4', 'dxc4', 'Nf3', 'Nf6', 'e3', 'e6', 'Bxc4', 'c5', 'O-O', 'a6', 'Qe2', 'b5', 'Bb3', 'Bb7'],
      annotations: {
        4: { ply: 4, commentPt: '2... dxc4! O Gambito Aceito. Abre linhas imediatas.', arrows: [{ from: 'd5', to: 'c4', color: 'emerald' }] },
        14: { ply: 14, commentPt: 'Contra-ataque chave! Golpea o peão branco antes que ele se consolide.', arrows: [{ from: 'c7', to: 'c5', color: 'emerald' }] }
      }
    },
    {
      id: 'op-slav-defense',
      namePt: 'Defesa Eslava',
      nameOriginal: 'Slav Defense',
      eco: 'D10',
      category: 'closed',
      heroColor: 'b',
      badgeText: 'A Muralha Central & Bispo Livre',
      tag: 'Solidez Absoluta',
      introPt: 'Sustenta d5 com o lance 2...c6 sem trancar o Bispo de casas claras (como ocorre no QGD com ...e6). É a defesa favorita de Vassily Smyslov e Garry Kasparov contra 1.d4.',
      pawnStructure: 'Triângulo defensivo c6-d5. As Pretas mantêm estrutura sólida e flexibilidade para avançar.',
      plansWhite: [
        'Impedir o desenvolvimento fácil do Bispo preto com cxd5 ou Qb3.',
        'Jogar a4 para impedir ...b5 após a captura em c4.',
        'Construir forte centro de peões com e4.'
      ],
      plansBlack: [
        'Desenvolver o Bispo para f5 antes de fechar a cadeia com ...e6.',
        'Capturar em c4 e apoiar o Bispo em b4.',
        'Manter estabilidade absoluta no centro.'
      ],
      trapsPt: 'Desenvolver o Bispo prematuramente para f5 sem cuidado pode expor b7 ao golpe Qb3!',
      relatedBookGameId: 'mt-game-tal-smyslov-bled',
      movesSan: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'dxc4', 'a4', 'Bf5', 'e3', 'e6', 'Bxc4', 'Bb4', 'O-O', 'O-O'],
      annotations: {
        4: { ply: 4, commentPt: '2... c6! A Defesa Eslava. Sustenta o centro mantendo livre a diagonal do Bispo de c8.', arrows: [{ from: 'c7', to: 'c6', color: 'emerald' }] },
        10: { ply: 10, commentPt: 'a4! Lance profilático essencial para conter a expansão ...b5 das Pretas.', arrows: [{ from: 'a2', to: 'a4', color: 'emerald' }] }
      }
    },
    {
      id: 'op-sistema-london',
      namePt: 'Sistema London',
      nameOriginal: 'London System',
      eco: 'D02',
      category: 'closed',
      heroColor: 'w',
      badgeText: 'A Estrutura Piramidal Inabalável',
      tag: 'Universal / Esquema Sólido',
      introPt: 'Um dos sistemas mais populares da atualidade (adotado com frequência por Magnus Carlsen). As brancas desenvolvem o Bispo para f4 antes de jogar e3, construindo uma pirâmide harmoniosa com c3 e d4.',
      pawnStructure: 'Pirâmide de granito: peões em c3-d4-e3 com o Bispo fora da cadeia em f4.',
      plansWhite: [
        'Instalar um Cavalo poderoso na casa central e5.',
        'Armar um ataque temático com Bd3, Cd2, f4 e manobra de Dama para f3 ou h5.',
        'Manter uma posição sólida e imune a surpresas táticas na abertura.'
      ],
      plansBlack: [
        'Desafiar o centro branco com ...c5 e pressionar b2 com ...Db6.',
        'Trocar o forte Bispo de f4 com a manobra ...Bd6 ou ...Ch5.',
        'Fianquetar o Bispo na ala do Rei (...g6 e ...Bg7) para neutralizar o ataque branco.'
      ],
      trapsPt: 'As Pretas não devem jogar passivamente; contestar a casa e5 com ...c5 e ...Cc6 é mandatório.',
      relatedBookGameId: 'ms-game-nimzowitsch-alapin',
      movesSan: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'c5', 'c3', 'Nc6', 'Nd2', 'e6', 'Ngf3', 'Bd6', 'Bg3', 'O-O', 'Bd3'],
      annotations: {
        3: { ply: 3, commentPt: '2. Bf4! A marca registrada do London: o Bispo sai antes de e3 fechar a diagonal.', arrows: [{ from: 'c1', to: 'f4', color: 'emerald' }] },
        7: { ply: 7, commentPt: 'c3 solidifica o centro e completa a base piramidal.', arrows: [{ from: 'c2', to: 'c3', color: 'emerald' }] }
      }
    },

    // 4. DEFESAS SEMI-FECHADAS & ÍNDIAS (1.d4 Cf6)
    {
      id: 'op-kings-indian-mar-del-plata',
      namePt: 'Defesa Índia do Rei (KID: Mar del Plata)',
      nameOriginal: "King's Indian Defense (Mar del Plata)",
      eco: 'E97',
      category: 'semi_closed',
      heroColor: 'b',
      badgeText: 'O Ataque Feroz ao Rei & A Glória de Kasparov',
      tag: 'Ultra-Dinâmica / Risco Total',
      introPt: 'A defesa mais combativa e visceral contra 1.d4. As pretas concedem o centro às brancas para depois fechá-lo com ...e5 e d5, lançando uma avalanche suicida de peões no flanco do Rei (...f5-f4-g5-g4).',
      pawnStructure: 'Centro completamente bloqueado: peões brancos em c4-d5-e4; peões pretos em c7-d6-e5. As Brancas atacam na ala da Dama; as Pretas atacam o Rei branco.',
      plansWhite: [
        'Romper rapidamente na ala da Dama com c4-c5 e abrir a coluna c para as Torres.',
        'Invadir a 7ª fileira preta e atacar os peões da base b7 e d6.',
        'Defender a ala do Rei transferindo peças menores para conter a avalanche preta.'
      ],
      plansBlack: [
        'Retirar o Cavalo de f6 e avançar a ruptura temática ...f7-f5!',
        'Fechar a ala do Rei com ...f4 e avançar a muralha de peões ...g5 e ...g4.',
        'Sacrificar material se necessário para dar mate direto no Rei branco.'
      ],
      trapsPt: 'Quem hesitar um lance perde: o ataque das pretas ao Rei é fulminante se as brancas demorarem a romper em c5.',
      relatedBookGameId: 'kg-game-byrne-fischer-century',
      movesSan: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5', 'O-O', 'Nc6', 'd5', 'Ne7', 'Ne1', 'Nd7', 'Nd3', 'f5'],
      annotations: {
        4: { ply: 4, commentPt: 'O Bispo indiano em g7 controla a diagonal e apoia o futuro contragolpe.', arrows: [{ from: 'f8', to: 'g7', color: 'emerald' }] },
        11: { ply: 11, commentPt: '6... e5! Golpe no centro clássico. Se d5, a luta de vida ou morte começa.', arrows: [{ from: 'e7', to: 'e5', color: 'emerald' }] },
        15: { ply: 15, commentPt: 'd5 fecha o centro e define o tabuleiro em duas guerras opostas.', arrows: [{ from: 'd4', to: 'd5', color: 'emerald' }] },
        20: { ply: 20, commentPt: '10... f5! A bandeira de guerra da Índia do Rei! Começa o ataque ao Rei branco.', badge: '!', arrows: [{ from: 'f7', to: 'f5', color: 'rose' }], highlights: [{ square: 'f5', color: 'rose' }] }
      }
    },
    {
      id: 'op-nimzo-indian-rubinstein',
      namePt: 'Defesa Nimzoíndia (Variante Rubinstein)',
      nameOriginal: 'Nimzo-Indian Defense (Rubinstein)',
      eco: 'E40',
      category: 'semi_closed',
      heroColor: 'b',
      badgeText: 'A Obra-Prima Hipermoderna de Nimzowitsch',
      tag: 'Estratégia Posicional / Cravada',
      introPt: 'Proposta por Aron Nimzowitsch. As pretas cravam o Cavalo de c3 com 3...Bb4, impedindo o avanço branco e4 e lutando pelo controle da casa e4 à distância, frequentemente dobrando os peões brancos com ...Bxc3.',
      pawnStructure: 'As Brancas frequentemente ficam com peões dobrados na coluna c (c3 e c4). As Pretas bloqueiam a posição com peões em c5 e d6.',
      plansWhite: [
        'Aproveitar o par de bispos caso as pretas entreguem o Bispo em c3.',
        'Reparar a estrutura de peões e buscar a expansão central e4.',
        'Pressionar o centro com a Dama em c2 ou Bispo em d3.'
      ],
      plansBlack: [
        'Imobilizar os peões dobrados brancos em c4 com ...b6, ...Ba6 e ...Ca5.',
        'Controlar com mão de ferro a casa central e4 com peças menores.',
        'Jogar finais onde os peões dobrados brancos são fraquezas crônicas.'
      ],
      trapsPt: 'Cravada temática: o Cavalo de c3 não pode mover-se enquanto o Rei estiver na diagonal e1-b4.',
      relatedBookGameId: 'ms-game-samisch-nimzowitsch-zugzwang',
      movesSan: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3', 'O-O', 'Bd3', 'd5', 'Nf3', 'c5', 'O-O', 'dxc4', 'Bxc4', 'Nbd7'],
      annotations: {
        6: { ply: 6, commentPt: '3... Bb4! A Nimzoíndia. Crava o Cavalo e domina e4 sem mover peões centrais.', badge: '!', arrows: [{ from: 'f8', to: 'b4', color: 'emerald' }], highlights: [{ square: 'c3', color: 'amber' }, { square: 'e4', color: 'sky' }] },
        7: { ply: 7, commentPt: 'A sólida Variante Rubinstein. Desenvolve com calma sustentando d4.', arrows: [{ from: 'e2', to: 'e3', color: 'emerald' }] }
      }
    },
    {
      id: 'op-grunfeld-defense',
      namePt: 'Defesa Grünfeld (Variante das Trocas)',
      nameOriginal: 'Grünfeld Defense (Exchange Variation)',
      eco: 'D85',
      category: 'semi_closed',
      heroColor: 'b',
      badgeText: 'O Centro Gigante Sob Fogo Cruzado',
      tag: 'Hipermoderna Dinâmica',
      introPt: 'Famosa pela célebre vitória de Bobby Fischer contra Donald Byrne na "Partida do Século". As pretas dão às brancas um centro colossal de peões para depois destruí-lo com ...c5, ...Bg7 e ...Cc6.',
      pawnStructure: 'Centro maciço branco com c3-d4-e4. As Pretas atacam com peão c5 e peças menores apontadas para d4.',
      plansWhite: [
        'Defender a todo custo o centro d4 com Bc4, Ne2 e Be3.',
        'Usar a vantagem de espaço para sufocar as pretas e apoiar peão passado em d5.',
        'Manter peças ativas na ala do Rei.'
      ],
      plansBlack: [
        'Concentrar fogo de artilharia em d4 (...c5, ...Bg7, ...Cc6, ...Bg4).',
        'Trocar peças para reduzir a força do centro branco.',
        'Criar um peão passado na ala da Dama aproveitando a maioria 2 contra 1.'
      ],
      trapsPt: 'Se as Brancas descuidarem da proteção de d4 por um único lance, a posição desmorona como um castelo de cartas.',
      relatedBookGameId: 'kg-game-byrne-fischer-century',
      movesSan: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'cxd5', 'Nxd5', 'e4', 'Nxc3', 'bxc3', 'Bg7', 'Bc4', 'c5', 'Ne2', 'O-O', 'O-O', 'Nc6'],
      annotations: {
        6: { ply: 6, commentPt: '3... d5! O lance característico da Grünfeld. Convida as brancas a tomarem o centro.', arrows: [{ from: 'd7', to: 'd5', color: 'emerald' }] },
        11: { ply: 11, commentPt: 'e4! As brancas formam o imponente centro clássico.', arrows: [{ from: 'e2', to: 'e4', color: 'emerald' }], highlights: [{ square: 'd4', color: 'emerald' }, { square: 'e4', color: 'emerald' }] },
        14: { ply: 14, commentPt: '7... c5! O contragolpe fulminante contra a base central em d4.', arrows: [{ from: 'c7', to: 'c5', color: 'rose' }], highlights: [{ square: 'd4', color: 'rose' }] }
      }
    },

    // 5. ABERTURAS DE FLANCO (1.c4, 1.Cf3)
    {
      id: 'op-english-opening',
      namePt: 'Abertura Inglesa (Quatro Cavalos)',
      nameOriginal: 'English Opening (Four Knights)',
      eco: 'A28',
      category: 'flank',
      heroColor: 'w',
      badgeText: 'Flexibilidade Posicional & Controle de d5',
      tag: 'Flanco / Manobras Sofisticadas',
      introPt: 'Introduzida pelo campeão inglês Howard Staunton em 1843. Com 1.c4, as brancas exercem pressão assimétrica sobre a casa central d5 sem comprometer peões centrais precocemente.',
      pawnStructure: 'Peão em c4 com expansão na ala da Dama. As Pretas jogam com e5 formando uma Siciliana invertida.',
      plansWhite: [
        'Fianquetar o Bispo em g2 para dominar a grande diagonal e a casa d5.',
        'Avançar na ala da Dama com a3, Rb1 e b4.',
        'Transpor para esquemas favoráveis do Gambito da Dama ou Reti se desejado.'
      ],
      plansBlack: [
        'Estabelecer uma sólida presença central com ...e5 e ...c6 ou ...d5.',
        'Contra-atacar na ala do Rei com ...f5 caso o centro permaneça fechado.',
        'Neutralizar o Bispo de g2 com manobras precisas de Cavalo.'
      ],
      trapsPt: 'As Pretas não devem avançar ...e4 sem suficiente suporte, sob risco de perderem o peão após d3.',
      relatedBookGameId: 'ms-game-nimzowitsch-alapin',
      movesSan: ['c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6', 'g3', 'd5', 'cxd5', 'Nxd5', 'Bg2', 'Nb6', 'O-O', 'Be7'],
      annotations: {
        1: { ply: 1, commentPt: '1. c4! Abertura Inglesa. Controla d5 pelo flanco.', arrows: [{ from: 'c2', to: 'c4', color: 'emerald' }], highlights: [{ square: 'd5', color: 'sky' }] },
        7: { ply: 7, commentPt: 'O Bispo em g2 é a alma da Inglesa, varrendo o tabuleiro.', arrows: [{ from: 'g2', to: 'g3', color: 'emerald' }] }
      }
    }
  ];
})();
