
window.PREINSTALLED_BOOKS = [
  // ============================================================================
  // LIVRO 1: XADREZ BÁSICO — ORFEU GILBERTO D'AGOSTINI
  // ============================================================================
  {
    id: 'xadrez-basico-agostini',
    titlePt: 'Xadrez Básico',
    titleOriginal: 'Xadrez Básico (Edição Clássica)',
    author: "Orfeu Gilberto D'Agostini",
    originalLanguage: 'pt',
    originalNotation: 'descriptive_pt',
    publicationYear: '1954 / 2008',
    coverAccent: 'from-amber-600/30 via-amber-900/20 to-zinc-950',
    badgeText: 'Notação Descritiva ↔ Algébrica',
    descriptionPt:
      'A maior obra didática da língua portuguesa (601 páginas). Todas as partidas clássicas, aberturas, meio-jogo e finais originalmente em Notação Descritiva (P4R, C3BR, B4B) convertidas e sincronizadas para Notação Algébrica moderna.',
    sourceFileName: 'pdfcoffee.com_xadrez-basico-orfeu-gilberto-dagostini-2008.pdf',
    chapters: [
      {
        id: 'xb-cap-1',
        number: 1,
        titlePt: 'As Partidas Modelo e as Razões dos Lances',
        subtitlePt: 'Como conduzir a abertura e compreender a finalidade estratégica de cada lance (Págs. 80–120)',
        games: [
          {
            id: 'xb-game-capablanca-steiner',
            titlePt: '1ª Partida Analisada: O Domínio das Colunas e o Sacrifício no Roque',
            white: 'José Raúl Capablanca',
            black: 'Herman Steiner',
            event: 'Exibição de Los Angeles',
            year: '1933',
            result: '1-0',
            eco: 'C49',
            openingNamePt: 'Abertura dos Quatro Cavalos (Simétrica)',
            heroColor: 'w',
            introPt:
              "No Capítulo 'Como Conduzir uma Partida' (pág. 80 e 101 do Xadrez Básico), Orfeu D'Agostini utiliza esta obra-prima de Capablanca para ensinar a razão de cada lance: desenvolvimento rápido, abertura da coluna de Bispo do Rei (f) e destruição da cobertura de peões do roque adversário.",
            keyTakeawaysPt: [
              'Na notação descritiva original do livro: 1. P4R P4R 2. C3BR C3BD 3. C3B C3B 4. B5C B5C.',
              'Trocas que dobram peões adversários devem ser seguidas pela abertura de linhas para as Torres.',
              'O sacrifício posicional 18. B6B! (Bh6 / Bxf6) destrói o escudo do Rei preto em h8.',
            ],
            movesSan: [
              'e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6', 'Bb5', 'Bb4', 'O-O', 'O-O',
              'd3', 'd6', 'Bxc6', 'bxc6', 'Ne2', 'Nh5', 'c3', 'Bc5', 'Be3', 'Bb6',
              'd4', 'Bg4', 'Qd3', 'Bxf3', 'gxf3', 'Qf6', 'Kg2', 'Qg6+', 'Kh1', 'Qf6',
              'Ng1', 'Nf4', 'Bxf4', 'Qxf4', 'Ne2', 'Qf6', 'Rg1', 'Kh8', 'Rg3', 'Rg8', 'Rag1'
            ],
            annotations: {
              1: {
                ply: 1,
                commentPt:
                  "Notação Original do Livro: 1. P4R. D'Agostini explica: 'Excelente lance inicial. Ocupa o centro com um peão e abre imediatamente as diagonais para a Dama e para o Bispo do Rei (BR).'",
                arrows: [{ from: 'e2', to: 'e4', color: 'emerald' }, { from: 'f1', to: 'b5', color: 'sky' }],
                highlights: [{ square: 'e4', color: 'emerald' }, { square: 'd5', color: 'amber' }],
                hintPt: 'Ocupe o centro com o peão do Rei, liberando o Bispo de f1 e a Dama.',
              },
              3: {
                ply: 3,
                commentPt:
                  "Original: 2. C3BR (Cf3). Desenvolve o Cavalo para a sua melhor casa natural, atacando o peão central preto de 4R (e5) e preparando o roque pequeno.",
                badge: '!',
                arrows: [{ from: 'g1', to: 'f3', color: 'emerald' }, { from: 'f3', to: 'e5', color: 'rose' }],
                hintPt: 'Desenvolva o Cavalo da ala do Rei atacando imediatamente o peão de e5.',
              },
              7: {
                ply: 7,
                commentPt:
                  "Original: 4. B5C (Bb5). A Abertura dos Quatro Cavalos entra na linha espanhola. O Bispo pressiona o defensor indireto do centro e limpa a ala do Rei para o roque.",
                arrows: [{ from: 'f1', to: 'b5', color: 'emerald' }],
                hintPt: 'Coloque o Bispo na casa b5 (5CD na descritiva) pressionando o Cavalo de c6.',
              },
              13: {
                ply: 13,
                commentPt:
                  "Original: 7. BxC (Bxc6). Capablanca elimina o Cavalo da Dama preto para dobrar os peões na coluna c (BD), iniciando uma manobra de reagrupamento com o seu próprio Cavalo.",
                arrows: [{ from: 'b5', to: 'c6', color: 'amber' }],
                hintPt: 'Capture o Cavalo em c6 para estragar a estrutura de peões das Pretas na ala da Dama.',
              },
              15: {
                ply: 15,
                commentPt:
                  "Original: 8. C2R (Ne2). Manobra típica explicada por D'Agostini: o Cavalo sai de c3 para permitir o avanço P3B (c3) e P4D (d4), além de reforçar a ala do Rei.",
                badge: '!',
                arrows: [{ from: 'c3', to: 'e2', color: 'emerald' }, { from: 'e2', to: 'g3', color: 'sky' }],
                hintPt: 'Recue o Cavalo de c3 para e2 (2R), liberando o peão da coluna c para apoiar d4.',
              },
              21: {
                ply: 21,
                commentPt:
                  "Original: 11. P4D! (d4). Com o peão de c3 dando suporte, as Brancas assumem o controle total do centro e obrigam o Bispo preto de b6 a ficar passivo.",
                badge: '!',
                highlights: [{ square: 'd4', color: 'emerald' }, { square: 'e4', color: 'emerald' }],
                hintPt: 'Rompa no centro com o peão da Dama!',
              },
              25: {
                ply: 25,
                commentPt:
                  "Original: 13. PxB (gxf3). Embora dobre os peões na coluna f, esta captura abre a coluna CR (coluna g) diretamente contra o roque das Pretas! D'Agostini destaca como uma coluna aberta vale mais do que a simetria de peões.",
                arrows: [{ from: 'g1', to: 'g8', color: 'rose' }],
                hintPt: 'Recapture o Bispo abrindo a coluna g para as suas Torres.',
              },
              37: {
                ply: 37,
                commentPt:
                  "Original: 19. TR1CR! (Rg1). Capablanca toma posse imediata da coluna aberta g (CR). O Rei branco em h1 está completamente seguro, enquanto o Rei preto será alvo das duas Torres.",
                badge: '!',
                arrows: [{ from: 'f1', to: 'g1', color: 'emerald' }, { from: 'g1', to: 'g7', color: 'rose' }],
                hintPt: 'Coloque a Torre na coluna g recém-aberta.',
              },
              41: {
                ply: 41,
                commentPt:
                  "Original: 21. TD1CR! (Rag1). As Torres dobradas na coluna CR (g) garantem pressão decisiva sobre g7. Nas jogadas seguintes, Capablanca sacrifica para demolir a cobertura do Rei preto e vencer com elegância.",
                badge: '!!',
                arrows: [{ from: 'a1', to: 'g1', color: 'emerald' }, { from: 'g3', to: 'g7', color: 'rose' }],
                highlights: [{ square: 'g7', color: 'rose' }],
                hintPt: 'Dobre a segunda Torre na coluna g para criar ameaça letal em g7.',
              },
            },
          },
          {
            id: 'xb-game-steinitz-bardeleben',
            titlePt: '2ª Partida Analisada: A Caçada Imortal de Steinitz em Hastings',
            white: 'Wilhelm Steinitz',
            black: 'Curt von Bardeleben',
            event: 'Torneio Internacional de Hastings',
            year: '1895',
            result: '1-0',
            eco: 'C54',
            openingNamePt: 'Abertura Italiana — Giuoco Piano',
            heroColor: 'w',
            introPt:
              "Na pág. 93 e 107 do Xadrez Básico, D'Agostini analisa esta partida monumental para demonstrar os perigos de deixar o Rei sem rocar no centro e o poder devastador da sétima horizontal combinada com uma Torre 'imune' que persegue o Rei preto!",
            keyTakeawaysPt: [
              'Na página 101 do PDF do Xadrez Básico, esta partida aparece lado a lado com a 1ª partida analisada.',
              'Impedir o roque adversário com 14. Bxe7! Nxe7 15. Re1! prende o Rei preto na zona de fogo.',
              'A sequência 22. Rxe7+!! Kf8 23. Rf7+! Kg8 24. Rg7+! Kh8 25. Rxh7+! explora o fato de que todas as peças brancas estão atacadas, mas a Torre dá xeque perpétuo ou mate forçado se capturada!',
            ],
            movesSan: [
              'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4',
              'cxd4', 'Bb4+', 'Nc3', 'd5', 'exd5', 'Nxd5', 'O-O', 'Be6', 'Bg5', 'Be7',
              'Bxd5', 'Bxd5', 'Nxd5', 'Qxd5', 'Bxe7', 'Nxe7', 'Re1', 'f6', 'Qe2', 'Qd7',
              'Rac1', 'c6', 'd5', 'cxd5', 'Nd4', 'Kf7', 'Ne6', 'Rhc8', 'Qg4', 'g6',
              'Ng5+', 'Ke8', 'Rxe7+', 'Kf8', 'Rf7+', 'Kg8', 'Rg7+', 'Kh8', 'Rxh7+'
            ],
            annotations: {
              7: {
                ply: 7,
                commentPt:
                  "Original: 4. P3B (c3). Prepara a formação do centro clássico de peões com 5. P4D (d4), tema central que D'Agostini enfatiza: 'Sempre que possível, as Brancas devem jogar P4D nas aberturas do Peão do Rei'.",
                arrows: [{ from: 'c2', to: 'c3', color: 'emerald' }, { from: 'd2', to: 'd4', color: 'sky' }],
                hintPt: 'Apoie a casa d4 avançando o peão do Bispo da Dama (c3).',
              },
              9: {
                ply: 9,
                commentPt:
                  "Original: 5. P4D (no texto do PDF aparecia com typo de OCR '5. P4O', corrigido pelo nosso motor para P4D / d4!). As Brancas abrem o centro com ganho de tempo sobre o Bispo de c5.",
                badge: '!',
                highlights: [{ square: 'd4', color: 'emerald' }],
                hintPt: 'Avance o peão da Dama duas casas atacando o centro e o Bispo.',
              },
              27: {
                ply: 27,
                commentPt:
                  "Original: 14. T1R! (Re1). Crava imediatamente o Cavalo em e7 e impede que as Pretas façam o roque! D'Agostini destaca: 'Impedir o roque adversário é uma das maiores conquistas estratégicas na abertura'.",
                badge: '!',
                arrows: [{ from: 'f1', to: 'e1', color: 'emerald' }, { from: 'e1', to: 'e8', color: 'rose' }],
                highlights: [{ square: 'e7', color: 'rose' }],
                hintPt: 'Traga a Torre para a coluna e, cravando o Cavalo e proibindo o roque preto.',
              },
              33: {
                ply: 33,
                commentPt:
                  "Original: 17. P5D! (d5!). Sacrifício de peão isolado para abrir a casa forte d4 (4D) e de lá saltar com o Cavalo para e6 (6R)!",
                badge: '!',
                arrows: [{ from: 'd4', to: 'd5', color: 'amber' }, { from: 'f3', to: 'd4', color: 'emerald' }, { from: 'd4', to: 'e6', color: 'emerald' }],
                hintPt: 'Sacrifique o peão central em d5 para liberar a casa d4 para o seu Cavalo.',
              },
              37: {
                ply: 37,
                commentPt:
                  "Original: 19. C6R! (Ne6). O Cavalo instala-se como um polvo na 6ª fileira, controlando c7, d8, f8 e g7.",
                badge: '!',
                highlights: [{ square: 'e6', color: 'emerald' }, { square: 'c7', color: 'amber' }, { square: 'g7', color: 'rose' }],
                hintPt: 'Salte com o Cavalo para a casa forte e6 (6R).',
              },
              41: {
                ply: 41,
                commentPt:
                  "Original: 21. C5C+! (Ng5+). Inicia a combinação imortal! Se 21...fxg5, 22. Dxd7 ganha a Dama na hora.",
                badge: '!',
                arrows: [{ from: 'e6', to: 'g5', color: 'emerald' }, { from: 'g4', to: 'd7', color: 'rose' }],
                hintPt: 'Dê xeque descoberto com o Cavalo atacando a Dama preta em d7!',
              },
              43: {
                ply: 43,
                commentPt:
                  "Original: 22. TxC+!! (Rxe7+!!). Um dos lances mais famosos da história do xadrez! A Dama branca em g4 está atacada pela Dama preta, a Torre de c1 leva mate em c1, o Cavalo de g5 está solto, MAS a Torre branca em e7 é intocável porque 22...Rxe7 23. T1R+ leva a mate forçado!",
                badge: '!!',
                arrows: [{ from: 'e1', to: 'e7', color: 'emerald' }, { from: 'c1', to: 'e1', color: 'sky' }],
                highlights: [{ square: 'e7', color: 'emerald' }, { square: 'g4', color: 'amber' }],
                hintPt: 'Capture o Cavalo de e7 com a Torre dando xeque, deixando todas as suas outras peças em prise!',
              },
              45: {
                ply: 45,
                commentPt:
                  "Original: 23. T7BR+! (Rf7+!). A 'Torre Louca' persegue o Rei preto! Se 23...Dxf7, 24. Dxc8+ segue com mate forçado.",
                badge: '!!',
                arrows: [{ from: 'e7', to: 'f7', color: 'emerald' }],
                hintPt: 'Continue perseguindo o Rei na 7ª horizontal com a Torre!',
              },
              49: {
                ply: 49,
                commentPt:
                  "Original: 25. TxPT+!! (Rxh7+!!). Von Bardeleben retirou-se do salão de jogos sem responder! Independentemente de 25...Kg8 ou 25...Rxh7, Steinitz anunciou mate forçado em 10 lances (25...Kg8 26. Rg7+ Kh8 27. Qh4+ Kxg7 28. Qh7+ Kf8 29. Qh8+ Ke7 30. Qg7+ Ke8 31. Qg8+ Ke7 32. Qf7+ Kd8 33. Qf8+ Qe8 34. Nf7+ Kd7 35. Qd6#).",
                badge: '!!',
                highlights: [{ square: 'h7', color: 'emerald' }, { square: 'h8', color: 'rose' }],
                hintPt: 'Capture o peão de h7 com a Torre dando xeque!',
              },
            },
          },
        ],
      },
      {
        id: 'xb-cap-2',
        number: 2,
        titlePt: 'A Arte do Ataque e o Desenvolvimento Rápido',
        subtitlePt: 'Como punir o atraso no desenvolvimento com sacrifícios de abertura de linhas (Pág. 263 e 311)',
        games: [
          {
            id: 'xb-game-morphy-opera',
            titlePt: 'A Partida da Ópera de Paris — A Aula Magna de Desenvolvimento',
            white: 'Paul Morphy',
            black: 'Duque de Brunswick & Conde Isouard',
            event: 'Teatro da Ópera de Paris',
            year: '1858',
            result: '1-0',
            eco: 'C41',
            openingNamePt: 'Defesa Philidor',
            heroColor: 'w',
            introPt:
              "Na pág. 311 do Xadrez Básico, Orfeu D'Agostini apresenta esta partida como o exemplo perfeito de como o desenvolvimento acelerado e o domínio das colunas abertas superam a vantagem material quando o Rei inimigo permanece preso no centro.",
            keyTakeawaysPt: [
              'Cada lance de Morphy coloca uma nova peça em jogo ou cria uma ameaça direta.',
              '10. CxP! (Nxb5!) sacrifica um Cavalo para abrir as diagonais e impedir o roque preto.',
              'O sacrifício final de Dama 16. D8C+!! (Qb8+!!) força o mate de Torre e Bispo em 8D (d8).',
            ],
            movesSan: [
              'e4', 'e5', 'Nf3', 'd6', 'd4', 'Bg4', 'dxe5', 'Bxf3', 'Qxf3', 'dxe5',
              'Bc4', 'Nf6', 'Qb3', 'Qe7', 'Nc3', 'c6', 'Bg5', 'b5', 'Nxb5', 'cxb5',
              'Bxb5+', 'Nbd7', 'O-O-O', 'Rd8', 'Rxd7', 'Rxd7', 'Rd1', 'Qe6', 'Bxd7+', 'Nxd7',
              'Qb8+', 'Nxb8', 'Rd8#'
            ],
            annotations: {
              7: {
                ply: 7,
                commentPt:
                  "Original: 4. PxP (dxe5). Morphy força as Pretas a entregarem o par de Bispos com 4...BxC (Bxf3), caso contrário perderiam um peão sem compensação.",
                hintPt: 'Capture o peão em e5 para forçar as Pretas a trocarem em f3.',
              },
              11: {
                ply: 11,
                commentPt:
                  "Original: 6. B4B (Bc4). Desenvolve o Bispo apontando diretamente para o ponto mais vulnerável das Pretas: 2BR (f7), ameaçando mate em 1!",
                badge: '!',
                arrows: [{ from: 'f1', to: 'c4', color: 'emerald' }, { from: 'c4', to: 'f7', color: 'rose' }],
                hintPt: 'Desenvolva o Bispo mirando na casa f7 (2BR).',
              },
              13: {
                ply: 13,
                commentPt:
                  "Original: 7. D3CD! (Qb3!). Ataque duplo clássico aos pontos f7 (2BR) e b7 (2CD). Ao defender f7 com 7...D2R (Qe7), as Pretas trancam o seu próprio Bispo de f8!",
                badge: '!',
                arrows: [{ from: 'f3', to: 'b3', color: 'emerald' }, { from: 'b3', to: 'f7', color: 'rose' }, { from: 'b3', to: 'b7', color: 'amber' }],
                hintPt: 'Mova a Dama para atacar simultaneamente f7 e b7.',
              },
              19: {
                ply: 19,
                commentPt:
                  "Original: 10. CxP! (Nxb5!). Em vez de recuar o Bispo de c4, Morphy sacrifica o Cavalo para abrir toda a diagonal a4-e8 e manter o Rei preto cravado no centro!",
                badge: '!!',
                arrows: [{ from: 'c3', to: 'b5', color: 'emerald' }, { from: 'c4', to: 'e8', color: 'rose' }],
                highlights: [{ square: 'b5', color: 'emerald' }],
                hintPt: 'Sacrifique o Cavalo capturando o peão de b5!',
              },
              23: {
                ply: 23,
                commentPt:
                  "Original: 12. 0-0-0! (O-O-O!). O Grande Roque coloca o Rei branco em segurança e traz instantaneamente a Torre da Dama para a coluna d aberta, cravando o Cavalo de d7!",
                badge: '!',
                arrows: [{ from: 'e1', to: 'c1', color: 'emerald' }, { from: 'd1', to: 'd7', color: 'rose' }],
                hintPt: 'Faça o roque grande trazendo a Torre diretamente para a coluna d.',
              },
              25: {
                ply: 25,
                commentPt:
                  "Original: 13. TxC! (Rxd7!). Sacrifício de qualidade para eliminar o defensor e substituir a Torre cravada pela outra Torre de f1 no lance seguinte!",
                badge: '!',
                arrows: [{ from: 'd1', to: 'd7', color: 'emerald' }],
                hintPt: 'Elimine o Cavalo cravado em d7 com a sua Torre!',
              },
              31: {
                ply: 31,
                commentPt:
                  "Original: 16. D8C+!! (Qb8+!!). O golpe imortal! Sacrifica a Dama para desviar o Cavalo de d7 que vigiava a casa de mate d8 (1D das Pretas).",
                badge: '!!',
                arrows: [{ from: 'b3', to: 'b8', color: 'emerald' }, { from: 'd1', to: 'd8', color: 'rose' }],
                highlights: [{ square: 'b8', color: 'emerald' }, { square: 'd8', color: 'rose' }],
                hintPt: 'Sacrifique a Dama na 8ª fileira para desviar o único defensor da casa d8!',
              },
              33: {
                ply: 33,
                commentPt:
                  "Original: 17. T8D++ (Rd8#). Xeque-mate! O Bispo de g5 e a Torre de d8 executam o famoso 'Mate de Ópera'.",
                badge: '!',
                highlights: [{ square: 'd8', color: 'emerald' }, { square: 'e8', color: 'rose' }],
                hintPt: 'Execute o mate na 8ª fileira com a Torre apoiada pelo Bispo de g5!',
              },
            },
          },
        ],
      },
      {
        id: 'xb-cap-3',
        number: 3,
        titlePt: 'Estratégia Superior — O Avanço Central e Casas Fracas',
        subtitlePt: 'O plano estratégico completo do meio-jogo ao sacrifício decisivo (Pág. 566)',
        games: [
          {
            id: 'xb-game-botvinnik-capablanca',
            titlePt: 'Botvinnik vs. Capablanca (AVRO 1938) — O Avanço Central Imortal',
            white: 'Mikhail Botvinnik',
            black: 'José Raúl Capablanca',
            event: 'Torneio AVRO (Holanda)',
            year: '1938',
            result: '1-0',
            eco: 'E49',
            openingNamePt: 'Defesa Nimzo-Índia (Sistema Rubinstein / Sämisch)',
            heroColor: 'w',
            introPt:
              "Analisada em destaque na pág. 566 do Xadrez Básico sob o título 'Avanço bem preparado dos Peões centrais', esta partida mostra como Botvinnik entrega a ala da Dama em troca da marcha imparável dos peões e4-e5 e f4-f5, culminando na combinação imortal 30. B3T!! (Ba3!!).",
            keyTakeawaysPt: [
              'Um ataque na ala da Dama (ganho do peão de a4) vale menos que o domínio do centro e ataque direto ao Rei.',
              '19. P4R! (e4) e 20. P5R! (e5) expulsam o Cavalo defensor de f6.',
              '30. B3T!! (Ba3!!) desvia a Dama preta para permitir o sacrifício de Cavalo 31. C5T+! (Nh5+!).',
            ],
            movesSan: [
              'd4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3', 'd5', 'a3', 'Bxc3+',
              'bxc3', 'c5', 'cxd5', 'exd5', 'Bd3', 'O-O', 'Ne2', 'b6', 'O-O', 'Ba6',
              'Bxa6', 'Nxa6', 'Bb2', 'Qd7', 'a4', 'Rfe8', 'Qd3', 'c4', 'Qc2', 'Nb8',
              'Rae1', 'Nc6', 'Ng3', 'Na5', 'f3', 'Nb3', 'e4', 'Qxa4', 'e5', 'Nd7',
              'Qf2', 'g6', 'f4', 'f5', 'exf6', 'Nxf6', 'f5', 'Rxe1', 'Rxe1', 'Re8',
              'Re6', 'Rxe6', 'fxe6', 'Kg7', 'Qf4', 'Qe8', 'Qe5', 'Qe7', 'Ba3', 'Qxa3',
              'Nh5+', 'gxh5', 'Qg5+', 'Kf8', 'Qxf6+', 'Kg8', 'e7', 'Qc1+', 'Kf2', 'Qc2+',
              'Kg3', 'Qd3+', 'Kh4', 'Qe4+', 'Kxh5', 'Qe2+', 'Kh4', 'Qe4+', 'g4', 'Qe1+', 'Kh5'
            ],
            annotations: {
              37: {
                ply: 37,
                commentPt:
                  "Original: 19. P4R! (e4!). O momento estratégico supremo destacado por D'Agostini! As Brancas entregam o peão de a4 para colocar sua massa central em movimento.",
                badge: '!',
                arrows: [{ from: 'e3', to: 'e4', color: 'emerald' }, { from: 'e4', to: 'e5', color: 'emerald' }],
                hintPt: 'Inicie o avanço central com o peão do Rei, ignorando a perda do peão de a4!',
              },
              39: {
                ply: 39,
                commentPt:
                  "Original: 20. P5R! (e5!). Ganha espaço na ala do Rei, expulsa o Cavalo defensor de f6 e abre a casa e4 para as peças brancas.",
                badge: '!',
                highlights: [{ square: 'e5', color: 'emerald' }],
                hintPt: 'Avance o peão para a 5ª fileira expulsando o Cavalo de f6.',
              },
              51: {
                ply: 51,
                commentPt:
                  "Original: 26. T6R! (Re6!). Crava o ponto de bloqueio e força a criação de um peão passado protegido na 6ª horizontal (e6 / 6R).",
                badge: '!',
                arrows: [{ from: 'e1', to: 'e6', color: 'emerald' }],
                hintPt: 'Infiltre a Torre na casa e6 (6R) para criar um peão passado decisivo.',
              },
              59: {
                ply: 59,
                commentPt:
                  "Original: 30. B3T!! (Ba3!!). Uma das combinações mais célebres de todos os tempos! O Bispo em b2 parecia morto atrás dos peões dobrados, mas sacrifica-se em a3 para desviar a Dama preta do controle da casa g5!",
                badge: '!!',
                arrows: [{ from: 'b2', to: 'a3', color: 'emerald' }, { from: 'g3', to: 'h5', color: 'rose' }],
                highlights: [{ square: 'a3', color: 'emerald' }, { square: 'e7', color: 'amber' }],
                hintPt: 'Sacrifique o seu Bispo na casa a3 (3TD) para desviar a Dama de Capablanca!',
              },
              61: {
                ply: 61,
                commentPt:
                  "Original: 31. C5T+! (Nh5+!). O segundo sacrifício consecutivo de peça! As Pretas são obrigadas a aceitar com 31...PxC (gxh5), permitindo a entrada mortal da Dama branca em g5 com xeque.",
                badge: '!!',
                arrows: [{ from: 'g3', to: 'h5', color: 'emerald' }, { from: 'e5', to: 'g5', color: 'rose' }],
                hintPt: 'Sacrifique o Cavalo em h5 dando xeque ao Rei preto!',
              },
              67: {
                ply: 67,
                commentPt:
                  "Original: 34. P7R! (e7!). O peão chega à 7ª horizontal protegido pela Dama. Após a série de xeques da Dama preta, o Rei branco caminha até h5 (41. R5T!) onde acabam os xeques e a promoção em e8 é inevitável!",
                badge: '!',
                arrows: [{ from: 'e6', to: 'e7', color: 'emerald' }, { from: 'e7', to: 'e8', color: 'emerald' }],
                hintPt: 'Avance o peão passado para a 7ª fileira ameaçando mate/promoção em e8!',
              },
            },
          },
        ],
      },
      {
        id: 'xb-cap-4',
        number: 4,
        titlePt: 'Finais Clássicos Indispensáveis',
        subtitlePt: 'A Posição de Lucena e a Construção da Ponte (Págs. 167–181)',
        games: [
          {
            id: 'xb-game-lucena',
            titlePt: 'A Posição de Lucena — O Método da Ponte na 4ª Horizontal',
            white: 'Estudo Clássico (Brancas)',
            black: 'Defesa (Pretas)',
            event: 'Xadrez Básico — Cap. Finais de Torre (Pág. 167)',
            year: '1497 / 1954',
            result: '1-0',
            openingNamePt: 'Final de Torre e Peão contra Torre',
            heroColor: 'w',
            initialFen: '1K1k4/1P6/8/8/8/8/r7/2R5 w - - 0 1',
            introPt:
              "Na pág. 167 do Xadrez Básico, D'Agostini ensina a técnica mais importante de todos os finais de Torre: quando o seu peão está na 7ª casa e o seu Rei está na frente dele na 8ª casa, como tirar o Rei sem sofrer xeques infinitos por trás? Construindo a 'Ponte' na 4ª horizontal!",
            keyTakeawaysPt: [
              '1. T1D+ (Rd1+) expulsa o Rei adversário por uma coluna de distância.',
              '2. T4D! (Rd4!) é o lance-chave: coloca a Torre na 4ª horizontal para servir de escudo (ponte) no momento exato em que o Rei branco caminhar até a 5ª fileira!',
            ],
            movesSan: [
              'Rd1+', 'Ke7', 'Rd4', 'Ra1', 'Kc7', 'Rc1+', 'Kb6', 'Rb1+', 'Kc6', 'Rc1+', 'Kb5', 'Rb1+', 'Rb4'
            ],
            annotations: {
              1: {
                ply: 1,
                commentPt:
                  "Original: 1. T1D+! (Rd1+!). Primeiro passo obrigatório da regra de Lucena: dar xeque para afastar o Rei inimigo da coluna d, ganhando espaço para a manobra do nosso Rei.",
                badge: '!',
                arrows: [{ from: 'c1', to: 'd1', color: 'emerald' }, { from: 'd8', to: 'e7', color: 'amber' }],
                hintPt: 'Dê xeque na coluna d para expulsar o Rei preto de perto do peão!',
              },
              3: {
                ply: 3,
                commentPt:
                  "Original: 2. T4D!! (Rd4!!). O lance genial da Posição de Lucena! Por que justamente a 4ª fileira? Porque quando o nosso Rei sair de b8 e fizer zigue-zague até b5 (5CD), a Torre de d4 cruzará para b4 (4CD) bloqueando os xeques!",
                badge: '!!',
                arrows: [{ from: 'd1', to: 'd4', color: 'emerald' }, { from: 'd4', to: 'b4', color: 'sky' }],
                highlights: [{ square: 'd4', color: 'emerald' }, { square: 'b4', color: 'sky' }],
                hintPt: 'Coloque a sua Torre na 4ª horizontal para preparar a famosa Ponte de Lucena!',
              },
              5: {
                ply: 5,
                commentPt:
                  "Original: 3. R7B! (Kc7). Agora o Rei branco sai da frente do peão liberando a casa b8 para a coroação!",
                badge: '!',
                arrows: [{ from: 'b8', to: 'c7', color: 'emerald' }],
                hintPt: 'Tire o Rei de b8 liberando a casa de promoção do peão!',
              },
              13: {
                ply: 13,
                commentPt:
                  "Original: 7. T4CD! (Rb4!). A PONTE ESTÁ CONSTRUÍDA! A Torre branca intercepta os xeques na coluna b. Se as Pretas trocarem as Torres (7...TxT+ 8. RxT), o peão de b7 promove em b8 no lance seguinte!",
                badge: '!!',
                arrows: [{ from: 'd4', to: 'b4', color: 'emerald' }, { from: 'b7', to: 'b8', color: 'amber' }],
                highlights: [{ square: 'b4', color: 'emerald' }, { square: 'b8', color: 'amber' }],
                hintPt: 'Cubra o xeque trazendo a sua Torre da 4ª fileira para b4 (A Ponte)!',
              },
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // LIVRO 2: MEU SISTEMA (MI SISTEMA) — ARON NIMZOWITSCH
  // ============================================================================
  {
    id: 'meu-sistema-nimzowitsch',
    titlePt: 'Meu Sistema (Mi Sistema)',
    titleOriginal: 'Mi Sistema — Un Tratado Completo del Arte del Ajedrez',
    author: 'Aron Nimzowitsch',
    originalLanguage: 'es',
    originalNotation: 'descriptive_es',
    publicationYear: '1925 / Ed. Espanhola',
    coverAccent: 'from-emerald-600/30 via-teal-900/20 to-zinc-950',
    badgeText: 'Traduzido ES → PT · Bilíngue',
    descriptionPt:
      'A Bíblia da estratégia posicional hipermoderna, traduzida diretamente da edição espanhola (mi_sistema.epub) para o Português, preservando também os comentários originais em Espanhol para estudo comparativo.',
    sourceFileName: 'mi_sistema_211024_120341_220202_104710.epub',
    chapters: [
      {
        id: 'ms-cap-1',
        number: 1,
        titlePt: 'O Centro, o Desenvolvimento e a Liquidação',
        titleOriginal: 'Capítulo 1: El Centro y el Desarrollo',
        subtitlePt: 'O desenvolvimento como conceito democrático coletivo e o perigo de capturar peões na abertura',
        games: [
          {
            id: 'ms-game-nimzo-alapin',
            titlePt: 'Nimzowitsch vs. Alapin — O Castigo pela Ganância na Abertura',
            titleOriginal: 'Partida Ilustrativa: Nimzowitsch - Alapin (Vilna, 1914)',
            white: 'Aron Nimzowitsch',
            black: 'Semyon Alapin',
            event: 'Torneio de Mestres da Rússia (Vilna)',
            year: '1914',
            result: '1-0',
            eco: 'C11',
            openingNamePt: 'Defesa Francesa — Liquidação Central',
            heroColor: 'w',
            introPt:
              "No Capítulo 1 de 'Mi Sistema' (pág. 12 do EPUB), Nimzowitsch formula sua famosa lei: 'O desenvolvimento é um conceito coletivo e democrático: não se deve mandar um único oficial em uma longa excursão enquanto os demais ficam entediados no quartel'. Aqui ele demonstra como demolir um adversário que perde tempos capturando peões com a Dama.",
            introOriginal:
              "En el Capítulo 1 de 'Mi Sistema', Nimzowitsch escribe: 'El desarrollo es un concepto colectivo. Sería poco democrático enviar a uno de nuestros oficiales a darse una larga excursión mientras los demás se quedan en el cuartel con insoportable aburrimiento.'",
            keyTakeawaysPt: [
              'Um lance de peão não é um lance de desenvolvimento em si, mas apenas um auxiliar do desenvolvimento.',
              'Quando o centro está aberto, cada tempo ganho vale mais do que um peão.',
              'O sacrifício de Bispo 14. Bf6!! abre linhas fatais na coluna e contra o Rei preto sem roque.',
            ],
            movesSan: [
              'e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'exd5', 'Nxd5', 'Nf3', 'c5',
              'Nxd5', 'Qxd5', 'Be3', 'cxd4', 'Nxd4', 'a6', 'Be2', 'Qxg2', 'Bf3', 'Qg6',
              'Qd2', 'e5', 'O-O-O', 'exd4', 'Bxd4', 'Nc6', 'Bf6', 'Qxf6', 'Rhe1+', 'Be7',
              'Bxc6+', 'Kf8', 'Qd8+', 'Bxd8', 'Re8#'
            ],
            annotations: {
              7: {
                ply: 7,
                commentPt:
                  "Liquidação central típica de Nimzowitsch: as Brancas resolvem a tensão no centro para acelerar a mobilização de todas as peças menores.",
                commentOriginal:
                  "Liquidación central con el consiguiente desarrollo: las blancas disuelven la tensión para acelerar la movilización de sus piezas.",
                hintPt: 'Capture em d5 para abrir o centro e acelerar o desenvolvimento.',
              },
              13: {
                ply: 13,
                commentPt:
                  "Nimzowitsch centraliza o Bispo em e3. As Brancas já têm duas peças ativas, enquanto a Dama preta em d5 ficará exposta a ganhos de tempo.",
                commentOriginal:
                  "Las blancas desarrollan su alfil hacia el centro (Ae3), preparando el salto del caballo y el enroque largo.",
                badge: '!',
                hintPt: 'Desenvolva o Bispo da Dama para a casa central e3.',
              },
              19: {
                ply: 19,
                commentPt:
                  "10. Bf3! Enquanto Alapin gasta dois tempos preciosos capturando o peão de g2 com a Dama, Nimzowitsch desenvolve o segundo Bispo com ganho de tempo!",
                commentOriginal:
                  "10. Af3! Mientras las negras pierden tiempos capturando el peón de g2, el alfil blanco entra en juego con ganancia de tiempo sobre la dama.",
                badge: '!',
                arrows: [{ from: 'e2', to: 'f3', color: 'emerald' }, { from: 'f3', to: 'b7', color: 'rose' }],
                hintPt: 'Ative o Bispo em f3 ganhando tempo sobre a Dama preta!',
              },
              23: {
                ply: 23,
                commentPt:
                  "12. O-O-O!! Mobilização total! Nimzowitsch entrega uma peça inteira em d4 porque todas as cinco peças brancas estão prontas para o assalto, enquanto toda a ala da Dama e a Torre de h8 das Pretas ainda dormem na fileira inicial!",
                commentOriginal:
                  "12. 0-0-0!! ¡Movilización total! Las blancas entregan una pieza en d4 porque su ventaja de desarrollo es abrumadora.",
                badge: '!!',
                arrows: [{ from: 'e1', to: 'c1', color: 'emerald' }, { from: 'd1', to: 'd8', color: 'rose' }],
                highlights: [{ square: 'd4', color: 'amber' }],
                hintPt: 'Ignore o Cavalo atacado em d4 e faça o roque grande imediatamente!',
              },
              27: {
                ply: 27,
                commentPt:
                  "14. Bf6!! Golpe fulminante! Ameaçava mate em d8 e, ao mesmo tempo, obstrui/desvia a defesa da coluna e para a entrada da Torre de h1!",
                commentOriginal:
                  "14. Af6!! Una jugada de obstrucción y desviación brillante que amenaza mate inmediato en d8.",
                badge: '!!',
                arrows: [{ from: 'd4', to: 'f6', color: 'emerald' }, { from: 'd2', to: 'd8', color: 'rose' }],
                highlights: [{ square: 'f6', color: 'emerald' }],
                hintPt: 'Coloque o Bispo em f6 (6BR) ameaçando mate direto em d8!',
              },
              33: {
                ply: 33,
                commentPt:
                  "17. Dd8+!! Sacrifício de Dama idêntico ao de Morphy! Desvia o Bispo cravado de e7 para dar mate com a Torre em e8.",
                commentOriginal:
                  "17. Dd8+!! Sacrificio de dama que desvía al alfil de e7 y permite el mate en la octava fila.",
                badge: '!!',
                arrows: [{ from: 'd2', to: 'd8', color: 'emerald' }, { from: 'e1', to: 'e8', color: 'rose' }],
                hintPt: 'Sacrifique a Dama em d8 para abrir caminho ao mate de Torre em e8!',
              },
            },
          },
        ],
      },
      {
        id: 'ms-cap-2',
        number: 2,
        titlePt: 'A Cadeia de Peões e o Bloqueio de Casas Fortes',
        titleOriginal: 'Capítulo 9: La Cadena de Peones y el Bloqueo',
        subtitlePt: 'Como bloquear peões inimigos e conquistar casas fortes centrais (Carlsbad, 1911)',
        games: [
          {
            id: 'ms-game-nimzo-salwe',
            titlePt: 'Nimzowitsch vs. Salwe — O Nascimento da Teoria do Bloqueio',
            titleOriginal: 'Partida Ilustrativa: Nimzowitsch - Salwe (Carlsbad, 1911)',
            white: 'Aron Nimzowitsch',
            black: 'Georg Salwe',
            event: 'Torneio Internacional de Carlsbad',
            year: '1911',
            result: '1-0',
            eco: 'C02',
            openingNamePt: 'Defesa Francesa — Variante do Avanço',
            heroColor: 'w',
            introPt:
              "Esta é a partida que revolucionou a compreensão estratégica do xadrez moderno. Ao permitir 7. dxc5?! aparente cedendo o centro, Nimzowitsch mostra que o verdadeiro objetivo não é o peão, mas sim o controle e BLOQUEIO das casas d4 e e5 com peças!",
            introOriginal:
              "Esta partida marca un hito en la historia del juego posicional: las blancas ceden aparentemente la tensión central con 7. dxc5 para conquistar el bloqueo absoluto de las casillas d4 y e5.",
            keyTakeawaysPt: [
              'Quando um peão avança (e5), a casa em si pode ser trocada pelo domínio eterno da casa com peças (Bf4, Ce5, Bd4).',
              'O Bispo em d4 é o bloqueador perfeito: ataca ambas as alas enquanto blinda a posição branca.',
              'Restringir primeiro, bloquear segundo e destruir por último — a essência de Meu Sistema.',
            ],
            movesSan: [
              'e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6',
              'Bd3', 'Bd7', 'dxc5', 'Bxc5', 'O-O', 'f6', 'b4', 'Be7', 'Bf4', 'fxe5',
              'Nxe5', 'Nxe5', 'Bxe5', 'Nf6', 'Nd2', 'O-O', 'Nf3', 'Bd6', 'Qe2', 'Rac8',
              'Bd4', 'Qc7', 'Ne5', 'Be8', 'Rae1', 'Bxe5', 'Bxe5', 'Qc6', 'Bd4', 'Bd7',
              'Qc2', 'Rf7', 'Re3', 'b6', 'Rg3', 'Kh8', 'Bxh7', 'e5', 'Bg6', 'Re7',
              'Re1', 'Qd6', 'Be3', 'd4', 'Bg5', 'Rxc3', 'Rxc3', 'dxc3', 'Qxc3'
            ],
            annotations: {
              5: {
                ply: 5,
                commentPt:
                  "3. e5! A Variante do Avanço estabelece a famosa Cadeia de Peões branca (d4-e5) contra a cadeia preta (e6-d5). A base da cadeia branca é d4; a base da cadeia preta é e6.",
                commentOriginal:
                  "3. e5! Se establece la cadena de peones d4-e5. La base de las blancas es d4 y la de las negras es e6.",
                highlights: [{ square: 'd4', color: 'amber' }, { square: 'e5', color: 'emerald' }, { square: 'e6', color: 'rose' }],
                hintPt: 'Avance o peão do Rei para e5 estabelecendo a cadeia de peões.',
              },
              13: {
                ply: 13,
                commentPt:
                  "7. dxc5! Na época (1911), os mestres clássicos consideravam este lance um erro posicional. Nimzowitsch provou o contrário: as Brancas cedem o peão de d4 apenas para instalar suas peças nas casas fortes d4 e e5!",
                commentOriginal:
                  "7. dxc5! El movimiento revolucionario: las blancas abandonan el peón de d4 para adueñarse con sus piezas de las casillas centrales d4 y e5.",
                badge: '!!',
                arrows: [{ from: 'd4', to: 'c5', color: 'emerald' }, { from: 'c1', to: 'e3', color: 'sky' }],
                hintPt: 'Capture o peão de c5 para iniciar o plano de controle de casas centrais com peças.',
              },
              19: {
                ply: 19,
                commentPt:
                  "10. Bf4! Sobreproteção da casa estratégica e5! Mesmo que o peão de e5 seja trocado, uma peça branca ocupará e5 permanentemente.",
                commentOriginal:
                  "10. Af4! Superprotección de la casilla estratégica e5: si el peón desaparece, una pieza blanca tomará su lugar.",
                badge: '!',
                arrows: [{ from: 'c1', to: 'f4', color: 'emerald' }, { from: 'f4', to: 'e5', color: 'emerald' }],
                highlights: [{ square: 'e5', color: 'emerald' }],
                hintPt: 'Desenvolva o Bispo para f4 sobreprotegendo a casa central e5.',
              },
              31: {
                ply: 31,
                commentPt:
                  "16. Bd4! Veja o bloqueio ideal de Nimzowitsch em ação: o Bispo branco em d4 paralisa os peões centrais pretos (e6 e d5) e libera a casa e5 para a chegada do Cavalo!",
                commentOriginal:
                  "16. Ad4! El bloqueador ideal en d4 paraliza el centro negro y deja libre la casilla e5 para el caballo blanco.",
                badge: '!',
                highlights: [{ square: 'd4', color: 'emerald' }, { square: 'e5', color: 'sky' }],
                hintPt: 'Recue o Bispo para a casa bloqueadora d4, liberando e5 para o seu Cavalo.',
              },
              45: {
                ply: 45,
                commentPt:
                  "23. Tg3! Transferência do ataque! Como o centro está completamente bloqueado e sob domínio branco, a Torre desliza pela 3ª fileira para atacar o Rei preto em h8.",
                commentOriginal:
                  "23. Tg3! La transferencia del ataque: una vez inmovilizado el centro enemigo, la torre se traslada por la tercera fila hacia el flanco de rey.",
                badge: '!',
                arrows: [{ from: 'e3', to: 'g3', color: 'emerald' }, { from: 'g3', to: 'g7', color: 'rose' }],
                hintPt: 'Transfira a Torre da 3ª fileira para a coluna g visando o Rei preto!',
              },
              47: {
                ply: 47,
                commentPt:
                  "24. Bxh7! A colheita estratégica: o peão de h7 cai sem que as Pretas tenham qualquer contrajogo.",
                commentOriginal:
                  "24. Axh7! La cosecha estratégica tras el asedio posicional.",
                badge: '!',
                hintPt: 'Capture o peão indefeso de h7 com o Bispo!',
              },
            },
          },
        ],
      },
      {
        id: 'ms-cap-3',
        number: 3,
        titlePt: 'Profilaxia, Restrição e a Partida Imortal do Zugzwang',
        titleOriginal: 'Segunda Parte: El Juego de Posición y el Zugzwang',
        subtitlePt: 'Como paralisar completamente o exército adversário em pleno meio-jogo (Copenhague, 1923)',
        games: [
          {
            id: 'ms-game-immortal-zugzwang',
            titlePt: 'Sämisch vs. Nimzowitsch (1923) — A Partida Imortal do Zugzwang',
            titleOriginal: 'Partida Inmortal del Zugzwang: Sämisch - Nimzowitsch (Copenhague, 1923)',
            white: 'Friedrich Sämisch',
            black: 'Aron Nimzowitsch',
            event: 'Torneio Internacional de Copenhague',
            year: '1923',
            result: '0-1',
            eco: 'E18',
            openingNamePt: 'Defesa Índia da Dama',
            heroColor: 'b',
            introPt:
              "Joia máxima de 'Mi Sistema'. Jogando de Pretas, Nimzowitsch sacrifica uma peça inteira por dois peões e a 7ª horizontal, encerrando todas as peças de Sämisch em uma camisa de força até o lance silencioso 25...h6!! (25...P3TR!!), onde as Brancas abandonam porque qualquer lance no tabuleiro perde material!",
            introOriginal:
              "La joya cumbre de 'Mi Sistema'. Con negras, Nimzowitsch encierra a todo el ejército blanco en una camisa de fuerza que culmina con la jugada silenciosa 25...h6!!, dejando a las blancas en Zugzwang absoluto en pleno medio juego.",
            keyTakeawaysPt: [
              'Dica: Como Nimzowitsch joga de Pretas nesta partida, o tabuleiro gira automaticamente para a visão das Pretas (ou pressione X/F).',
              '19...fxe4! 20. Qxh5 Rxf2! entrega um Cavalo em troca do domínio absoluto da 2ª horizontal (7ª das Pretas).',
              '25...h6!! é o lance de espera mais famoso da história: as Brancas não têm nenhum lance útil!',
            ],
            movesSan: [
              'd4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6', 'g3', 'Bb7', 'Bg2', 'Be7',
              'Nc3', 'O-O', 'O-O', 'd5', 'Ne5', 'c6', 'cxd5', 'cxd5', 'Bf4', 'a6',
              'Rc1', 'b5', 'Qb3', 'Nc6', 'Nxc6', 'Bxc6', 'h3', 'Qd7', 'Kh2', 'Nh5',
              'Bd2', 'f5', 'Qd1', 'b4', 'Nb1', 'Bb5', 'Rg1', 'Bd6', 'e4', 'fxe4',
              'Qxh5', 'Rxf2', 'Qg5', 'Raf8', 'Kh1', 'R8f5', 'Qe3', 'Bd3', 'Rce1', 'h6'
            ],
            annotations: {
              30: {
                ply: 30,
                commentPt:
                  "15...Nh5! Nimzowitsch inicia a restrição na ala do Rei, preparando o avanço f5 para dominar a coluna f.",
                commentOriginal:
                  "15...Ch5! Las negras inician la restricción en el flanco de rey preparando f5.",
                arrows: [{ from: 'f6', to: 'h5', color: 'emerald' }, { from: 'f7', to: 'f5', color: 'sky' }],
                hintPt: 'Salte com o Cavalo para h5 preparando o avanço do peão f!',
              },
              34: {
                ply: 34,
                commentPt:
                  "17...b4! Expulsa o Cavalo branco de volta para a primeira fileira (b1), onde ele bloqueará suas próprias Torres!",
                commentOriginal:
                  "17...b4! Obliga al caballo blanco a retroceder a la primera fila (b1), entorpeciendo la comunicación de sus torres.",
                badge: '!',
                arrows: [{ from: 'b5', to: 'b4', color: 'emerald' }, { from: 'c3', to: 'b1', color: 'rose' }],
                hintPt: 'Avance o peão de b5 para b4 expulsando o Cavalo branco para a primeira fileira!',
              },
              40: {
                ply: 40,
                commentPt:
                  "20...fxe4!! Nimzowitsch sacrifica o Cavalo de h5! Em troca, a coluna f se abre completamente e a Torre preta invadirá f2 (a 7ª fileira das Pretas).",
                commentOriginal:
                  "20...fxe4!! ¡Sacrificio posicional de pieza! A cambio del caballo de h5, las negras conquistan la columna f y la séptima fila.",
                badge: '!!',
                arrows: [{ from: 'f5', to: 'e4', color: 'emerald' }, { from: 'f8', to: 'f2', color: 'rose' }],
                highlights: [{ square: 'f2', color: 'rose' }],
                hintPt: 'Capture o peão em e4 entregando o seu Cavalo de h5 para abrir a coluna f!',
              },
              42: {
                ply: 42,
                commentPt:
                  "21...Rxf2! A invasão na 7ª fileira (tema central do Capítulo 3 de Meu Sistema)! O Bispo branco de d2 e o Bispo de g2 ficam imediatamente cravados.",
                commentOriginal:
                  "21...Txf2! La invasión decisiva en la séptima fila. Ambos alfiles blancos quedan paralizados.",
                badge: '!',
                arrows: [{ from: 'f8', to: 'f2', color: 'emerald' }, { from: 'f2', to: 'd2', color: 'rose' }, { from: 'f2', to: 'g2', color: 'rose' }],
                hintPt: 'Invada a 2ª fileira capturando o peão de f2 com a Torre!',
              },
              48: {
                ply: 48,
                commentPt:
                  "24...Bd3! Crava e aprisiona a Dama branca! Se a Dama sair de e3, ...Rf1 seguido de ...R5f2 vence na hora.",
                commentOriginal:
                  "24...Ad3! Encierra por completo a la dama blanca y corta la columna c.",
                badge: '!',
                highlights: [{ square: 'd3', color: 'emerald' }, { square: 'e3', color: 'rose' }],
                hintPt: 'Instale o Bispo em d3 trancando as peças brancas na primeira fileira!',
              },
              50: {
                ply: 50,
                commentPt:
                  "25...h6!! (25...P3TR!!). O LANCE IMORTAL DO ZUGZWANG! As Pretas fazem um pequeno lance de espera com o peão da Torre e Sämisch abandona! Por quê? Veja o tabuleiro: 1) A Dama branca em e3 não tem nenhuma casa segura; 2) Se 26. g4, 26...R5f3 captura a Dama; 3) Se 26. Kh2, 26...R5f3!; 4) Se a Torre de e1 ou o Cavalo de b1 se moverem, cai o Bispo de d2 ou g2!",
                commentOriginal:
                  "25...h6!! ¡La jugada inmortal del Zugzwang! Las blancas abandonan porque cualquier movimiento de pieza o peón pierde material de inmediato.",
                badge: '!!',
                arrows: [{ from: 'h7', to: 'h6', color: 'emerald' }, { from: 'f5', to: 'f3', color: 'rose' }],
                highlights: [{ square: 'h6', color: 'emerald' }, { square: 'e3', color: 'rose' }, { square: 'f3', color: 'rose' }],
                hintPt: 'Faça um lance silencioso de espera com o peão da ala do Rei (h6), colocando as Brancas em Zugzwang total!',
              },
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // LIVRO 3: VIDA E PARTIDAS DE MIKHAIL TAL — MIKHAIL TAL
  // ============================================================================
  {
    id: 'mikhail-tal-life-games',
    titlePt: 'Vida e Partidas de Mikhail Tal',
    titleOriginal: 'The Life and Games of Mikhail Tal',
    author: 'Mikhail Tal',
    originalLanguage: 'en',
    originalNotation: 'algebraic_en',
    publicationYear: '1976 / 1997',
    coverAccent: 'from-rose-600/30 via-amber-900/20 to-zinc-950',
    badgeText: 'Traduzido EN → PT · Ataque e Sacrifício',
    descriptionPt:
      'Considerado por muitos o melhor livro de xadrez já escrito. As combinações vulcânicas do "Mago de Riga" rumo ao título mundial de 1960, traduzidas para o Português com todas as notações e figurinos higienizados.',
    sourceFileName: 'Life and Games of Mikhail Tal.epub / .pdf',
    chapters: [
      {
        id: 'tal-cap-1',
        number: 1,
        titlePt: 'O Torneio de Candidatos de 1959 — A Tempestade Tática',
        titleOriginal: 'Chapter 3: The Road to the World Championship (1959)',
        subtitlePt: 'Como criar complicações onde o cálculo puro supera a defesa passiva',
        games: [
          {
            id: 'tal-game-smyslov-1959',
            titlePt: 'Mikhail Tal vs. Vasily Smyslov (Bled, 1959) — Prêmio de Brilhantismo',
            titleOriginal: 'Game 48: Tal - Smyslov, Candidates Tournament, Bled 1959',
            white: 'Mikhail Tal',
            black: 'Vasily Smyslov',
            event: 'Torneio de Candidatos (Bled, Iugoslávia)',
            year: '1959',
            result: '1-0',
            eco: 'B10',
            openingNamePt: 'Defesa Caro-Kann',
            heroColor: 'w',
            introPt:
              "Enfrentando o ex-Campeão Mundial Vasily Smyslov, o jovem Tal de 22 anos recusa-se a recuar seu Cavalo atacado e desencadeia uma tempestade de sacrifícios na ala do Rei que culmina no espetacular sacrifício de Dama 19. Dxf7!!",
            introOriginal:
              "Facing former World Champion Vasily Smyslov, 22-year-old Tal refuses to retreat his attacked knight and unleashes a sacrificial storm culminating in the stunning Queen sacrifice 19. Qxf7!!",
            keyTakeawaysPt: [
              '14. Bd2! deixa o Cavalo de c4 para ser capturado a fim de ganhar dois tempos de ataque contra o Rei preto.',
              '19. Dxf7!! (Qxf7!!) sacrifica a Dama para atrair a Torre preta e aplicar um duplo real após 20. Rd2!',
            ],
            movesSan: [
              'e4', 'c6', 'd3', 'd5', 'Nd2', 'e5', 'Ngf3', 'Nd7', 'd4', 'dxe4',
              'Nxe4', 'exd4', 'Qxd4', 'Ngf6', 'Bg5', 'Be7', 'O-O-O', 'O-O', 'Nd6', 'Qa5',
              'Bc4', 'b5', 'Bd2', 'Qa6', 'Nf5', 'Bd8', 'Qh4', 'bxc4', 'Qg5', 'Nh5',
              'Nh6+', 'Kh8', 'Qxh5', 'Qxa2', 'Bc3', 'Nf6', 'Qxf7', 'Qa1+', 'Kd2', 'Rxf7',
              'Nxf7+', 'Kg8', 'Rxa1', 'Kxf7', 'Ne5+', 'Ke6', 'Nxc6', 'Ne4+', 'Ke3', 'Bb6+', 'Bd4'
            ],
            annotations: {
              19: {
                ply: 19,
                commentPt:
                  "10. Cd6! O Cavalo instala-se no coração da posição preta, cortando a comunicação das peças de Smyslov.",
                commentOriginal:
                  "10. Nd6! The knight jumps into the heart of Black's position, disrupting coordination.",
                badge: '!',
                highlights: [{ square: 'd6', color: 'emerald' }],
                hintPt: 'Salte com o Cavalo para a casa forte d6 no território das Pretas!',
              },
              23: {
                ply: 23,
                commentPt:
                  "12. Bd2! Começa o fogo de artifício de Tal! Em vez de perder tempo salvando o Bispo de c4, Tal contra-ataca a Dama preta e prepara o salto do Cavalo para f5.",
                commentOriginal:
                  "12. Bd2! Instead of retreating the c4-bishop, White counter-attacks the Queen and prepares Nf5.",
                badge: '!',
                arrows: [{ from: 'g5', to: 'd2', color: 'emerald' }, { from: 'd6', to: 'f5', color: 'rose' }],
                hintPt: 'Recue o Bispo de g5 para d2 atacando a Dama de a5 e oferecendo o Bispo de c4!',
              },
              27: {
                ply: 27,
                commentPt:
                  "14. Dh4! O Bispo de c4 continua em prise! Se Smyslov capturá-lo (14...bxc4), a Dama branca salta para g5 ameaçando mate imediato em g7!",
                commentOriginal:
                  "14. Qh4! The bishop on c4 remains taboo—if Black takes it, White's Queen leaps to g5 with direct mate threats.",
                badge: '!!',
                arrows: [{ from: 'd4', to: 'h4', color: 'emerald' }, { from: 'h4', to: 'g5', color: 'rose' }],
                hintPt: 'Transfira a Dama para h4 preparando a invasão mortal em g5!',
              },
              31: {
                ply: 31,
                commentPt:
                  "16. Ch6+! Desvia e tranca o Rei preto no canto h8, permitindo capturar o Cavalo de h5 com ganho de tempo.",
                commentOriginal:
                  "16. Nh6+! Forces the Black king into the corner on h8 and wins the h5-knight with tempo.",
                badge: '!',
                arrows: [{ from: 'f5', to: 'h6', color: 'emerald' }, { from: 'g5', to: 'h5', color: 'emerald' }],
                hintPt: 'Dê xeque com o Cavalo em h6 para abrir a coluna g5-h5!',
              },
              35: {
                ply: 35,
                commentPt:
                  "18. Bc3! Defende o mate em a1 indireta e ativamente, mirando como um laser em g7 e f8!",
                commentOriginal:
                  "18. Bc3! Parries the mate threat while aiming like a laser along the long diagonal toward g7.",
                badge: '!',
                arrows: [{ from: 'd2', to: 'c3', color: 'emerald' }, { from: 'c3', to: 'g7', color: 'rose' }],
                hintPt: 'Coloque o Bispo na grande diagonal em c3!',
              },
              37: {
                ply: 37,
                commentPt:
                  "19. Dxf7!! O GOLPE DE MESTRE DO MAGO DE RIGA! Se 19...Txf7, 20. Txd8+ Tf8 21. TxT# é mate! E após 19...Da1+ 20. Rd2! Txf7, segue o garfo real 21. Cxf7+ Rg8 22. Txa1 recuperando a Dama com peça a mais!",
                commentOriginal:
                  "19. Qxf7!! The Magician of Riga strikes! If 19...Rxf7 20. Rxd8+ mates, and after 19...Qa1+ 20. Kd2! Rxf7 21. Nxf7+ White wins back the Queen on a1 with a winning endgame!",
                badge: '!!',
                arrows: [{ from: 'h5', to: 'f7', color: 'emerald' }, { from: 'h6', to: 'f7', color: 'sky' }, { from: 'd1', to: 'd8', color: 'rose' }],
                highlights: [{ square: 'f7', color: 'emerald' }, { square: 'd8', color: 'rose' }],
                hintPt: 'Sacrifique a Dama capturando em f7 (sobrecarregando a Torre de f8 e a defesa de d8)!',
              },
            },
          },
        ],
      },
      {
        id: 'tal-cap-2',
        number: 2,
        titlePt: 'Campeão do Mundo — O Duelo com Botvinnik (1960)',
        titleOriginal: 'Chapter 4: World Champion (Moscow 1960)',
        subtitlePt: 'O histórico sacrifício de Cavalo 21...Cf4!! na 6ª partida do Match Mundial',
        games: [
          {
            id: 'tal-game-botvinnik-1960-g6',
            titlePt: 'Botvinnik vs. Tal (6ª Partida do Mundial 1960) — O Cavalo na Floresta Escura',
            titleOriginal: 'Game 64: Botvinnik - Tal, World Championship Match (Game 6), Moscow 1960',
            white: 'Mikhail Botvinnik',
            black: 'Mikhail Tal',
            event: 'Campeonato Mundial de Xadrez — Moscou (Partida 6)',
            year: '1960',
            result: '0-1',
            eco: 'E69',
            openingNamePt: 'Defesa Índia do Rei — Variante Fianchetto Clássica',
            heroColor: 'b',
            introPt:
              "A partida mais famosa da carreira de Mikhail Tal. Jogando de Pretas contra o patriarca do xadrez soviético Mikhail Botvinnik, Tal lança o seu Cavalo em f4 (21...Cf4!!) puramente por intuição, incendiando o tabuleiro até os árbitros precisarem transferir a partida para uma sala anexa devido ao barulho dos milhares de espectadores aplaudindo no teatro de Moscou!",
            introOriginal:
              "The signature game of Mikhail Tal's career. Playing Black against Mikhail Botvinnik, Tal hurls his knight into f4 (21...Nf4!!) purely by intuition, creating such chaos that the arbiters had to move the players backstage due to the roar of the Moscow audience!",
            keyTakeawaysPt: [
              'Tal joga de Pretas (o tabuleiro orienta-se na visão das Pretas).',
              '21...Cf4!! sacrifica um Cavalo inteiro para abrir a grande diagonal h8-a1 para o Bispo índio de g7 e criar um peão passado em f3.',
              '25...fxe2!! ignora a perda da Dama preta em b2 porque o peão em e2 e o par de Bispos decidem a luta!',
            ],
            movesSan: [
              'c4', 'Nf6', 'Nf3', 'g6', 'g3', 'Bg7', 'Bg2', 'O-O', 'd4', 'd6',
              'Nc3', 'Nbd7', 'O-O', 'e5', 'e4', 'c6', 'h3', 'Qb6', 'd5', 'cxd5',
              'cxd5', 'Nc5', 'Ne1', 'Bd7', 'Nd3', 'Nxd3', 'Qxd3', 'Rfc8', 'Rb1', 'Nh5',
              'Be3', 'Qb4', 'Qe2', 'Rc4', 'Rfc1', 'Rac8', 'Kh2', 'f5', 'exf5', 'Bxf5',
              'Ra1', 'Nf4', 'gxf4', 'exf4', 'Bd2', 'Qxb2', 'Rab1', 'f3', 'Rxb2', 'fxe2',
              'Rb3', 'Rd4', 'Be1', 'Be5+', 'Kg1', 'Bf4', 'Nxe2', 'Rxc1', 'Nxd4', 'Rxe1+',
              'Bf1', 'Be4', 'Ne2', 'Be5', 'f4', 'Bf6', 'Rxb7', 'Bxd5', 'Rc7', 'Bxa2', 'Rxa7', 'Bc4'
            ],
            annotations: {
              36: {
                ply: 36,
                commentPt:
                  "18...f5! Tal inicia as ações na ala do Rei antes que Botvinnik consolide a coluna c.",
                commentOriginal:
                  "18...f5! Tal initiates active operations on the kingside before White can consolidate the c-file.",
                badge: '!',
                arrows: [{ from: 'f7', to: 'f5', color: 'emerald' }],
                hintPt: 'Rompa na ala do Rei avançando o peão de f7 para f5!',
              },
              42: {
                ply: 42,
                commentPt:
                  "21...Cf4!! O SACRIFÍCIO LENDÁRIO DE TAL! Tal escreveu no livro: 'Não dava para calcular todas as variantes no relógio, mas a minha intuição dizia que a abertura da grande diagonal para o Bispo de g7 valia qualquer preço!'",
                commentOriginal:
                  "21...Nf4!! Tal's legendary intuitive knight sacrifice! Opening the long dark-squared diagonal for the g7-bishop unleashes unstoppable dynamic energy.",
                badge: '!!',
                arrows: [{ from: 'h5', to: 'f4', color: 'emerald' }, { from: 'g7', to: 'b2', color: 'rose' }],
                highlights: [{ square: 'f4', color: 'emerald' }, { square: 'g7', color: 'amber' }],
                hintPt: 'Sacrifique o Cavalo em f4 para abrir a grande diagonal do Bispo de g7!',
              },
              46: {
                ply: 46,
                commentPt:
                  "23...Dxb2! O Bispo de g7 e a Dama preta invadem b2 com efeito devastador sobre toda a 2ª horizontal das Brancas.",
                commentOriginal:
                  "23...Qxb2! The Queen crashes into b2 along the newly opened diagonal.",
                badge: '!',
                arrows: [{ from: 'b4', to: 'b2', color: 'emerald' }],
                hintPt: 'Capture o peão de b2 com a Dama aproveitando a grande diagonal aberta!',
              },
              48: {
                ply: 48,
                commentPt:
                  "24...f3!! Golpe intermediário genial! Enquanto a Dama preta está atacada em b2, Tal avança o peão atacando a Dama branca em e2 e o Bispo de g2!",
                commentOriginal:
                  "24...f3!! A brilliant intermediate blow! While Black's Queen is attacked on b2, the f-pawn advances to attack White's Queen and Bishop.",
                badge: '!!',
                arrows: [{ from: 'f4', to: 'f3', color: 'emerald' }, { from: 'f3', to: 'e2', color: 'rose' }],
                highlights: [{ square: 'f3', color: 'emerald' }],
                hintPt: 'Ignore a sua Dama atacada em b2 e avance o peão de f4 para f3!',
              },
              52: {
                ply: 52,
                commentPt:
                  "26...Td4! O erro de Botvinnik foi permitir que a Torre preta ativasse com ganho de tempo sobre o Bispo de d2, garantindo que as Pretas recuperem a peça mantendo dois peões passados a mais!",
                commentOriginal:
                  "26...Rd4! Activating the rook with tempo against the d2-bishop and securing a decisive endgame advantage.",
                badge: '!',
                arrows: [{ from: 'c4', to: 'd4', color: 'emerald' }, { from: 'd4', to: 'd2', color: 'rose' }],
                hintPt: 'Ative a Torre de c4 para d4 atacando o Bispo branco de d2!',
              },
            },
          },
        ],
      },
    ],
  },

  // ============================================================================
  // LIVRO 4: MEUS GRANDES PREDECESSORES VOL. 4 (BOBBY FISCHER) — GARRY KASPAROV
  // ============================================================================
  {
    id: 'kasparov-fischer-vol4',
    titlePt: 'Meus Grandes Predecessores, Vol. 4: Bobby Fischer',
    titleOriginal: 'Garry Kasparov on My Great Predecessors, Part IV: Fischer',
    author: 'Garry Kasparov',
    originalLanguage: 'en',
    originalNotation: 'algebraic_en',
    publicationYear: '2004',
    coverAccent: 'from-sky-600/30 via-indigo-900/20 to-zinc-950',
    badgeText: 'Traduzido EN → PT · Precisão Absoluta',
    descriptionPt:
      'A análise definitiva do 13º Campeão Mundial Garry Kasparov sobre a genialidade cristalina do 11º Campeão Mundial Bobby Fischer, incluindo A Partida do Século (1956) e a 6ª Partida de Reykjavik (1972) traduzidas para o Português.',
    sourceFileName: 'Garry Kasparov on Fischer My Great Predecessors, Part 4.epub / .pdf',
    chapters: [
      {
        id: 'kf-cap-1',
        number: 1,
        titlePt: 'O Prodígio Solitário — A Partida do Século (1956)',
        titleOriginal: 'Chapter: The Lone Genius — The Game of the Century',
        subtitlePt: 'Como Bobby Fischer, aos 13 anos de idade, criou uma das maiores obras de arte da história',
        games: [
          {
            id: 'kf-game-century-1956',
            titlePt: 'Donald Byrne vs. Bobby Fischer (1956) — A Partida do Século',
            titleOriginal: 'Donald Byrne - Robert James Fischer, Rosenwald Trophy, New York 1956',
            white: 'Donald Byrne',
            black: 'Robert James Fischer (13 anos)',
            event: 'Memorial Lessing Rosenwald (Nova York)',
            year: '1956',
            result: '0-1',
            eco: 'D92',
            openingNamePt: 'Defesa Grünfeld',
            heroColor: 'b',
            introPt:
              "Garry Kasparov escreve no Vol. 4: 'Uma verdadeira obra-prima de cálculo e harmonia que assombrou o mundo inteiro'. Ao punir o movimento repetido da Dama branca (10. Dc5?!), o garoto Fischer de 13 anos lança 11...Ca4!! e o imortal sacrifício de Dama 17...Be6!!, conduzindo uma caçada geométrica perfeita de moinho até o xeque-mate.",
            introOriginal:
              "Kasparov writes in Part IV: 'A true masterpiece of calculation and harmony that astonished the entire chess world.' Punishing White's repeated Queen moves, 13-year-old Fischer uncorks 11...Na4!! and the immortal Queen sacrifice 17...Be6!!",
            keyTakeawaysPt: [
              'Fischer joga de Pretas (visão das Pretas ativada).',
              'Mover a mesma peça várias vezes na abertura com o Rei ainda no centro convida combinações táticas devastadoras.',
              '11...Ca4!! e 17...Be6!! demonstram que a coordenação de Torre + 2 Bispos + Cavalo supera uma Dama solitária.',
            ],
            movesSan: [
              'Nf3', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'd4', 'O-O', 'Bf4', 'd5',
              'Qb3', 'dxc4', 'Qxc4', 'c6', 'e4', 'Nbd7', 'Rd1', 'Nb6', 'Qc5', 'Bg4',
              'Bg5', 'Na4', 'Qa3', 'Nxc3', 'bxc3', 'Nxe4', 'Bxe7', 'Qb6', 'Bc4', 'Nxc3',
              'Bc5', 'Rfe8+', 'Kf1', 'Be6', 'Bxb6', 'Bxc4+', 'Kg1', 'Ne2+', 'Kf1', 'Nxd4+',
              'Kg1', 'Ne2+', 'Kf1', 'Nc3+', 'Kg1', 'axb6', 'Qb4', 'Ra4', 'Qxb6', 'Nxd1',
              'h3', 'Rxa2', 'Kh2', 'Nxf2', 'Re1', 'Rxe1', 'Qd8+', 'Bf8', 'Nxe1', 'Bd5',
              'Nf3', 'Ne4', 'Qb8', 'b5', 'h4', 'h5', 'Ne5', 'Kg7', 'Kg1', 'Bc5+',
              'Kf1', 'Ng3+', 'Ke1', 'Bb4+', 'Kd1', 'Bb3+', 'Kc1', 'Ne2+', 'Kb1', 'Nc3+',
              'Kc1', 'Rc2#'
            ],
            annotations: {
              22: {
                ply: 22,
                commentPt:
                  "11...Ca4!! Um raio em céu azul analisado com admiração por Kasparov! Se 12. Cxa4, 12...Cxe4! recupera a peça com ataque esmagador sobre a Dama branca e a coluna e.",
                commentOriginal:
                  "11...Na4!! A bolt from the blue! If 12. Nxa4, 12...Nxe4! wins back the piece with a crushing attack along the e-file.",
                badge: '!!',
                arrows: [{ from: 'b6', to: 'a4', color: 'emerald' }, { from: 'f6', to: 'e4', color: 'rose' }],
                highlights: [{ square: 'a4', color: 'emerald' }, { square: 'e4', color: 'rose' }],
                hintPt: 'Ofereça o Cavalo na borda do tabuleiro (a4) para desviar o defensor do peão central e4!',
              },
              26: {
                ply: 26,
                commentPt:
                  "13...Cxe4! Abre a coluna e diretamente contra o Rei branco que ainda não fez o roque.",
                commentOriginal:
                  "13...Nxe4! Opens the e-file directly against White's uncastled King.",
                badge: '!',
                arrows: [{ from: 'f6', to: 'e4', color: 'emerald' }, { from: 'f8', to: 'e8', color: 'sky' }],
                hintPt: 'Capture o peão central de e4 abrindo a coluna para a Torre!',
              },
              34: {
                ply: 34,
                commentPt:
                  "17...Be6!! O LANCE DO SÉCULO! Byrne achava que 16. Bc5 ganhava qualidade fazendo um espeto entre a Dama preta em b6 e a Torre de e8. Em vez de mover a Dama, Fischer entrega a Dama inteira com 17...Be6!!, iniciando um moinho letal com Bispo e Cavalo!",
                commentOriginal:
                  "17...Be6!! THE MOVE OF THE CENTURY! Instead of saving his Queen on b6, 13-year-old Fischer sacrifices it for a lethal windmill of checks and material harvest!",
                badge: '!!',
                arrows: [{ from: 'g4', to: 'e6', color: 'emerald' }, { from: 'e6', to: 'c4', color: 'rose' }, { from: 'c3', to: 'e2', color: 'sky' }],
                highlights: [{ square: 'e6', color: 'emerald' }, { square: 'b6', color: 'amber' }],
                hintPt: 'Ignore o ataque à sua Dama em b6 e contra-ataque o Bispo de c4 com 17...Be6!!',
              },
              36: {
                ply: 36,
                commentPt:
                  "18...Bxc4+! Começa o mecanismo de Moinho (Windmill) que coleta material lance após lance enquanto o Rei branco fica preso na caixa g1-f1.",
                commentOriginal:
                  "18...Bxc4+! The windmill mechanism begins, harvesting material while the White king is trapped in the g1-f1 box.",
                badge: '!',
                arrows: [{ from: 'e6', to: 'c4', color: 'emerald' }, { from: 'c3', to: 'e2', color: 'sky' }],
                hintPt: 'Capture o Bispo de c4 dando xeque!',
              },
              82: {
                ply: 82,
                commentPt:
                  "41...Tc2# (Rc2#)! Xeque-mate geométrico perfeito com Torre, dois Bispos e Cavalo cercando o Rei branco!",
                commentOriginal:
                  "41...Rc2#! A picture-perfect geometric checkmate with Rook, two Bishops, and Knight!",
                badge: '!',
                highlights: [{ square: 'c2', color: 'emerald' }, { square: 'c1', color: 'rose' }],
                hintPt: 'Aplique o xeque-mate com a Torre em c2!',
              },
            },
          },
        ],
      },
      {
        id: 'kf-cap-2',
        number: 2,
        titlePt: 'O Match do Século — Reykjavik 1972 (Spassky Aplaude de Pé)',
        titleOriginal: 'Chapter: The Match of the Century — Reykjavik 1972',
        subtitlePt: 'A 6ª Partida do Campeonato Mundial: perfeição posicional e ataque na ala do Rei',
        games: [
          {
            id: 'kf-game-spassky-g6-1972',
            titlePt: 'Bobby Fischer vs. Boris Spassky (6ª Partida, 1972) — Sinfonia Posicional',
            titleOriginal: 'Game 6: Fischer - Spassky, World Championship Match, Reykjavik 1972',
            white: 'Robert James Fischer',
            black: 'Boris Spassky',
            event: 'Campeonato Mundial de Xadrez — Reykjavik (Partida 6)',
            year: '1972',
            result: '1-0',
            eco: 'D59',
            openingNamePt: 'Gambito da Dama Recusado — Defesa Tartakower',
            heroColor: 'w',
            introPt:
              "Pela primeira vez na vida em uma partida séria, Fischer abandona o seu fiel 1. e4 e surpreende o Campeão Mundial Boris Spassky com 1. c4! Kasparov analisa como Fischer domina os peões pendentes pretos (c5 e d5) e transfere todas as peças para um ataque demolidor na coluna f.",
            introOriginal:
              "For the first time in a major game, Fischer abandons his lifelong 1. e4 and shocks World Champion Boris Spassky with 1. c4! Kasparov analyzes how Fischer paralyzes Black's hanging pawns and switches to a devastating kingside attack.",
            keyTakeawaysPt: [
              '20. e4! força os peões pendentes pretos a avançarem (20...d4), cedendo para sempre a diagonal a2-g8 para o Bispo branco!',
              '38. Txf6! (Rxf6!) destrói a última barreira defensiva diante do Rei de Spassky.',
            ],
            movesSan: [
              'c4', 'e6', 'Nf3', 'd5', 'd4', 'Nf6', 'Nc3', 'Be7', 'Bg5', 'O-O',
              'e3', 'h6', 'Bh4', 'b6', 'cxd5', 'Nxd5', 'Bxe7', 'Qxe7', 'Nxd5', 'exd5',
              'Rc1', 'Be6', 'Qa4', 'c5', 'Qa3', 'Rc8', 'Bb5', 'a6', 'dxc5', 'bxc5',
              'O-O', 'Ra7', 'Be2', 'Nd7', 'Nd4', 'Qf8', 'Nxe6', 'fxe6', 'e4', 'd4',
              'f4', 'Qe7', 'e5', 'Rb8', 'Bc4', 'Kh8', 'Qh3', 'Nf8', 'b3', 'a5',
              'f5', 'exf5', 'Rxf5', 'Nh7', 'Rcf1', 'Qd8', 'Qg3', 'Re7', 'h4', 'Rbb7',
              'e6', 'Rbc7', 'Qe5', 'Qe8', 'a4', 'Qd8', 'R1f2', 'Qe8', 'R2f3', 'Qd8',
              'Bd3', 'Qe8', 'Qe4', 'Nf6', 'Rxf6', 'gxf6', 'Rxf6', 'Kg8', 'Bc4', 'Kh8', 'Qf4'
            ],
            annotations: {
              27: {
                ply: 27,
                commentPt:
                  "14. Bb5! Um lance sutil que provoca 14...a6 enfraquecendo os peões da ala da Dama preta antes de abrir a coluna c.",
                commentOriginal:
                  "14. Bb5! A subtle finesse provoking 14...a6 to weaken Black's queenside structure before opening the position.",
                badge: '!',
                arrows: [{ from: 'f1', to: 'b5', color: 'emerald' }],
                hintPt: 'Desenvolva o Bispo para b5 provocando o avanço a6!',
              },
              35: {
                ply: 35,
                commentPt:
                  "18. Cd4! Centraliza o Cavalo para eliminar o importante Bispo de casas claras das Pretas em e6.",
                commentOriginal:
                  "18. Nd4! Centralizes the knight to eliminate Black's vital light-squared bishop on e6.",
                badge: '!',
                arrows: [{ from: 'f3', to: 'd4', color: 'emerald' }, { from: 'd4', to: 'e6', color: 'rose' }],
                hintPt: 'Salte com o Cavalo para d4 visando eliminar o Bispo de e6!',
              },
              39: {
                ply: 39,
                commentPt:
                  "20. e4! O golpe estratégico chave apontado por Kasparov: ataca o centro preto e obriga Spassky a jogar 20...d4, entregando as casas claras c4 e e4 para as Brancas!",
                commentOriginal:
                  "20. e4! The key strategic strike: attacks Black's center and forces 20...d4, surrendering the light squares c4 and e4 forever!",
                badge: '!!',
                arrows: [{ from: 'e3', to: 'e4', color: 'emerald' }, { from: 'e2', to: 'c4', color: 'sky' }],
                highlights: [{ square: 'e4', color: 'emerald' }, { square: 'c4', color: 'sky' }],
                hintPt: 'Rompa imediatamente no centro com o peão do Rei (e4)!',
              },
              45: {
                ply: 45,
                commentPt:
                  "23. Bc4! O Bispo branco instala-se na diagonal a2-g8 como um monstro, cravando o peão de e6 e vigiando o Rei preto em h8.",
                commentOriginal:
                  "23. Bc4! The light-squared bishop dominates the a2-g8 diagonal, pinning the e6-pawn.",
                badge: '!',
                arrows: [{ from: 'e2', to: 'c4', color: 'emerald' }, { from: 'c4', to: 'g8', color: 'rose' }],
                hintPt: 'Instale o seu Bispo na diagonal aberta em c4!',
              },
              51: {
                ply: 51,
                commentPt:
                  "26. f5! Ruptura demolidora na coluna f! As Torres brancas dobrarão na coluna aberta contra o Rei preto.",
                commentOriginal:
                  "26. f5! The decisive breakthrough opening the f-file for White's heavy pieces.",
                badge: '!',
                arrows: [{ from: 'f4', to: 'f5', color: 'emerald' }, { from: 'f1', to: 'f5', color: 'rose' }],
                hintPt: 'Avance o peão de f4 para f5 abrindo a coluna f para as suas Torres!',
              },
              75: {
                ply: 75,
                commentPt:
                  "38. Txf6! (Rxf6!). Sacrifício de qualidade que destrói a última defesa de Spassky! Ao término desta partida após 41. Df4!, o próprio Boris Spassky levantou-se da cadeira no palco e aplaudiu Bobby Fischer junto com o público!",
                commentOriginal:
                  "38. Rxf6!! The final exchange sacrifice that shatters Black's defense. After 41. Qf4!, Boris Spassky stood up on stage and applauded Fischer along with the audience!",
                badge: '!!',
                arrows: [{ from: 'f5', to: 'f6', color: 'emerald' }, { from: 'f3', to: 'f6', color: 'emerald' }],
                highlights: [{ square: 'f6', color: 'emerald' }],
                hintPt: 'Elimine o Cavalo defensor de f6 capturando-o com a sua Torre!',
              },
            },
          },
        ],
      },
    ],
  },
];

const EXTRA_CHAPTERS_BY_BOOK = {
  // ============================================================================
  // LIVRO 1: XADREZ BÁSICO — ORFEU GILBERTO D'AGOSTINI
  // ============================================================================
  'xadrez-basico-agostini': [
    {
      id: 'xb-cap-fundamentos',
      number: 5,
      titlePt: 'Princípios Fundamentais da Abertura e o Ponto Fraco f7 (2BR)',
      subtitlePt: 'Por que o desenvolvimento rápido vence a caça prematura de peões (Págs. 45–79)',
      games: [
        {
          id: 'xb-game-greco-nn',
          titlePt: 'Gioachino Greco vs. NN — O Ataque Clássico sobre f7 (2BR)',
          white: 'Gioachino Greco',
          black: 'NN (Roma, 1620)',
          event: 'Manuscrito Clássico citado no Xadrez Básico',
          year: '1620',
          result: '1-0',
          eco: 'C54',
          openingNamePt: 'Abertura Italiana (Giuoco Piano — Ataque Greco)',
          studyPhase: 'openings',
          heroColor: 'w',
          introPt:
            "Na primeira parte do Xadrez Básico, Orfeu D'Agostini ensina as três leis de ouro da abertura: 1) Dominar o centro com peões (1. e4 e5); 2) Desenvolver rapidamente Cavalos e Bispos rumo ao centro (2. Cf3 Cc6 3. Bc4 Bc5); 3) Proteger o Rei com o roque. Nesta miniatura imortal de Greco, vemos o que acontece quando a casa f7 (2BR na notação descritiva) é atacada com energia.",
          readingSectionsPt: [
            {
              headingPt: 'A Lei do Centro e a Diagonal Italiana',
              bodyPt:
                "Quando as Brancas iniciam com 1. e4 e as Pretas respondem 1... e5, ambos os lados lutam pelas casas centrais d4 e f4. Com 2. Cf3 Cc6 3. Bc4 Bc5, o Bispo branco mira diretamente o ponto mais vulnerável da posição inicial preta: a casa f7 (2BR), defendida unicamente pelo Rei. Para preparar a construção de um centro ideal com os dois peões lado a lado, Greco joga 4. c3! (P3BD), preparando a ruptura 5. d4! (P4D).",
              focusPly: 7,
            },
            {
              headingPt: 'O Sacrifício de Peões em Troca de Linhas Abertas',
              bodyPt:
                "Após 4... Cf6 5. d4 exd4 6. cxd4 Bb4+, muitos iniciantes jogariam a passiva 7. Bd2, mas Greco demonstra o valor da iniciativa com o gambito 7. Cc3! Cxe4 8. O-O! Cxc3 9. bxc3 Bxc3. Ao custo de dois peões, todas as linhas centrais se abriram! Com 10. Db3! (D3CD), as Brancas criam um ataque duplo mortal sobre o Bispo em c3 e o peão de f7. Após 10... Bxa1 11. Bxf7+ Rf8 12. Bg5 Ce7 13. Ce5 Bxd4 14. Bg6! d5 15. Df3+ Bf5 16. Bxf5 Bxe5 17. Be6+ Bf6 18. Bxf6 gxf6 19. Dxf6+ Re8 20. Df7#, o ataque das peças menores triunfa enquanto a Torre preta de a8 jamais saiu do lugar!",
              focusPly: 19,
            },
          ],
          keyTakeawaysPt: [
            'A casa f7 (2BR) é o calcanhar de Aquiles das Pretas antes do roque.',
            'Abrir colunas e diagonais no centro vale mais do que conservar peões da ala na abertura.',
            'O ataque duplo 10. Db3! mira simultaneamente b7/c3 e o ponto crítico f7.',
          ],
          movesSan: [
            'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd4', 'exd4',
            'cxd4', 'Bb4+', 'Nc3', 'Nxe4', 'O-O', 'Nxc3', 'bxc3', 'Bxc3', 'Qb3', 'Bxa1',
            'Bxf7+', 'Kf8', 'Bg5', 'Ne7', 'Ne5', 'Bxd4', 'Bg6', 'd5', 'Qf3+', 'Bf5',
            'Bxf5', 'Bxe5', 'Be6+', 'Bf6', 'Bxf6', 'gxf6', 'Qxf6+', 'Ke8', 'Qf7#'
          ],
          annotations: {
            1: {
              ply: 1,
              commentPt: "Notação Descritiva: 1. P4R. Ocupa o centro e libera imediatamente o Bispo de f1 e a Dama.",
              arrows: [{ from: 'e2', to: 'e4', color: 'emerald' }],
              hintPt: 'Avance o peão do Rei duas casas.',
            },
            5: {
              ply: 5,
              commentPt: "Original: 3. B4B (Bc4). O Bispo aponta diretamente para f7 (2BR), o ponto mais sensível das Pretas.",
              arrows: [{ from: 'f1', to: 'c4', color: 'emerald' }, { from: 'c4', to: 'f7', color: 'rose' }],
              hintPt: 'Coloque o Bispo na diagonal italiana apontando para f7.',
            },
            9: {
              ply: 9,
              commentPt: "Original: 5. P4D! (d4). Com o apoio de c3, as Brancas questionam imediatamente o peão central preto e abrem linhas.",
              badge: '!',
              highlights: [{ square: 'd4', color: 'emerald' }, { square: 'e4', color: 'emerald' }],
              hintPt: 'Rompa no centro com o peão da Dama!',
            },
            19: {
              ply: 19,
              commentPt: "Original: 10. D3CD! (Qb3). Ataque duplo fulminante contra o Bispo em c3 e o peão de f7!",
              badge: '!!',
              arrows: [{ from: 'd1', to: 'b3', color: 'emerald' }, { from: 'b3', to: 'f7', color: 'rose' }, { from: 'b3', to: 'c3', color: 'amber' }],
              alternativeLinePt: "Se as Pretas defendessem f7 com 10... d5, seguiria 11. Bxd5 O-O 12. Ba3 com ataque esmagador.",
              hintPt: 'Traga a Dama para b3 atacando duas casas críticas ao mesmo tempo.',
            },
            27: {
              ply: 27,
              commentPt: "Original: 14. B6CR! (Bg6). Lance de bloqueio brilhante que ameaça mate imediato em f7 com a Dama!",
              badge: '!!',
              arrows: [{ from: 'f7', to: 'g6', color: 'emerald' }, { from: 'd1', to: 'f7', color: 'rose' }],
              hintPt: 'Desvie a proteção da coluna f com um golpe de Bispo em g6!',
            },
            39: {
              ply: 39,
              commentPt: "Original: 20. D7BR++ (Qf7#). Xeque-mate clássico demonstrado por D'Agostini!",
              badge: '!!',
              highlights: [{ square: 'f7', color: 'emerald' }, { square: 'e8', color: 'rose' }],
            },
          },
        },
      ],
    },
    {
      id: 'xb-cap-combinacoes-roque',
      number: 6,
      titlePt: 'Tática e Combinações — O Sacrifício Clássico de Bispo em h7 (Bxh7+)',
      subtitlePt: 'As condições exatas para o Presente Grego funcionar na prática (Págs. 240–295)',
      games: [
        {
          id: 'xb-game-colle-ohanlon',
          titlePt: "Edgard Colle vs. John O'Hanlon (Nice, 1930) — O Presente Grego Perfeito",
          white: 'Edgard Colle',
          black: "John O'Hanlon",
          event: 'Torneio Internacional de Nice',
          year: '1930',
          result: '1-0',
          eco: 'D05',
          openingNamePt: 'Sistema Colle (Ruptura Central e Sacrifício em h7)',
          studyPhase: 'middlegame',
          heroColor: 'w',
          introPt:
            "No capítulo dedicado aos ataques contra o roque no Xadrez Básico, D'Agostini explica os 4 requisitos para que o sacrifício clássico Bxh7+ (BxPTR+) seja vencedor: 1) Ausência de um Cavalo defensor em f6; 2) O Bispo branco na diagonal b1-h7; 3) O Cavalo branco pronto para saltar a g5; 4) A Dama branca livre para entrar em h5.",
          readingSectionsPt: [
            {
              headingPt: 'A Preparação Silenciosa do Sistema Colle',
              bodyPt:
                "Colle constrói sua pirâmide sólida com 1. d4 d5 2. Cf3 Cf6 3. e3 c5 4. c3 e6 5. Bd3 Bd6 6. Cbd2 Cbd7 7. O-O O-O. Tudo parece calmo até que as Brancas preparam o avanço temático 8. Te1 Te8 9. e4! dxe4 10. Cxe4 Cxe4 11. Bxe4 cxd4. Agora, em vez de recapturar automaticamente com o peão de c3, Colle percebe que o Cavalo preto de f6 desapareceu da defesa do roque!",
              focusPly: 22,
            },
            {
              headingPt: 'O Golpe Demolidor 12. Bxh7+! (BxPTR+)',
              bodyPt:
                "Com 12. Bxh7+!! Rxh7 13. Cg5+ Rg6 (se o Rei recuar para 13... Rg8, segue 14. Dh5 Cf6 15. Dxf7+ Rh8 16. Te3! levando a Torre para h3 com mate inevitável!), Colle caça o Rei preto em campo aberto com 14. h4! Th8 15. Txe6+! Cf6 16. h5+ Rh6 17. Txd6! Da5 18. Cxf7+ Rh7 19. Cg5+ Rg8 20. Db3+!, forçando a rendição imediata diante do mate em f7!",
              focusPly: 23,
            },
          ],
          keyTakeawaysPt: [
            'Antes de sacrificar em h7, verifique se o Cavalo defensor de f6 foi trocado ou desalojado.',
            'Após Bxh7+ Rxh7 Cg5+, o lance h4! ou Dh5 mantém o Rei adversário preso na rede de mate.',
            'O segundo sacrifício 15. Txe6+! destrói a última barreira defensiva das Pretas.',
          ],
          movesSan: [
            'd4', 'd5', 'Nf3', 'Nf6', 'e3', 'c5', 'c3', 'e6', 'Bd3', 'Bd6',
            'Nbd2', 'Nbd7', 'O-O', 'O-O', 'Re1', 'Re8', 'e4', 'dxe4', 'Nxe4', 'Nxe4',
            'Bxe4', 'cxd4', 'Bxh7+', 'Kxh7', 'Ng5+', 'Kg6', 'h4', 'Rh8', 'Rxe6+', 'Nf6',
            'h5+', 'Kh6', 'Rxd6', 'Qa5', 'Nxf7+', 'Kh7', 'Ng5+', 'Kg8', 'Qb3+'
          ],
          annotations: {
            17: {
              ply: 17,
              commentPt: "Original: 9. P4R! (e4). A ruptura temática do Sistema Colle, abrindo a diagonal do Bispo de d3 rumo a h7.",
              badge: '!',
              arrows: [{ from: 'e3', to: 'e4', color: 'emerald' }, { from: 'd3', to: 'h7', color: 'rose' }],
              hintPt: 'Rompa no centro com o peão do Rei para liberar os seus dois Bispos.',
            },
            23: {
              ply: 23,
              commentPt: "Original: 12. BxPTR+!! (Bxh7+). O Presente Grego clássico! Sem o Cavalo preto em f6, o roque é demolido.",
              badge: '!!',
              arrows: [{ from: 'e4', to: 'h7', color: 'emerald' }, { from: 'f3', to: 'g5', color: 'amber' }],
              alternativeLinePt: "Se 12... Rf8 recusando o sacrifício, as Brancas ganham um peão limpo com 13. Bc2 dxc3 14. Dxd6+.",
              hintPt: 'Sacrifique o Bispo em h7 para expor o Rei preto e saltar com o Cavalo para g5!',
            },
            25: {
              ply: 25,
              commentPt: "Original: 13. C5CR+! (Ng5+). O Cavalo salta com xeque e abre a diagonal para a Dama branca.",
              badge: '!',
              arrows: [{ from: 'f3', to: 'g5', color: 'emerald' }],
              hintPt: 'Dê xeque com o Cavalo em g5.',
            },
            29: {
              ply: 29,
              commentPt: "Original: 15. TxP+!! (Rxe6+). Segundo sacrifício brilhante! A Torre elimina o peão de e6 e expõe a casa d6.",
              badge: '!!',
              arrows: [{ from: 'e1', to: 'e6', color: 'emerald' }],
              hintPt: 'Sacrifique a Torre em e6 para destruir a defesa do Rei exposto em g6.',
            },
            39: {
              ply: 39,
              commentPt: "Original: 20. D3CD+! (Qb3+). As Pretas abandonam, pois o mate na diagonal a2-g8 é inevitável!",
              badge: '!',
              arrows: [{ from: 'd1', to: 'b3', color: 'emerald' }, { from: 'b3', to: 'f7', color: 'rose' }],
            },
          },
        },
      ],
    },
    {
      id: 'xb-cap-finais-philidor',
      number: 7,
      titlePt: 'Finais Técnicos — A Defesa de Philidor e a Regra do Quadrado',
      subtitlePt: 'Como defender finais de Torre com um peão a menos usando a 3ª Horizontal (Págs. 172–198)',
      games: [
        {
          id: 'xb-game-philidor-defense',
          titlePt: 'François-André Danican Philidor (1777) — O Método Imortal de Empate na 3ª Fila',
          white: 'Ataque com Peão a Mais',
          black: 'Defesa de Philidor (Pretas Empatam)',
          event: "Tratado de Philidor / Xadrez Básico de D'Agostini",
          year: '1777',
          result: '1/2-1/2',
          eco: 'E00',
          openingNamePt: 'Final Técnico de Torres (Posição de Philidor)',
          studyPhase: 'endgame',
          heroColor: 'b',
          initialFen: '4k3/1R6/8/4PK2/8/r7/8/8 b - - 0 1',
          introPt:
            "Se a Posição de Lucena é a chave para vencer com Torre e Peão contra Torre, a Posição de Philidor (1777), detalhada por Orfeu D'Agostini, é o escudo supremo para empatar! A regra de ouro de Philidor é simples e profunda: mantenha sua Torre na 6ª fila (3ª fila do atacante) impedindo que o Rei adversário avance, e só leve sua Torre para a 1ª fila para dar xeques pelas costas no exato instante em que o peão adversário avançar para a 6ª fila!",
          readingSectionsPt: [
            {
              headingPt: 'A Barreira na 6ª Horizontal (1... Ta6!)',
              bodyPt:
                "A partir da posição clássica do diagrama, as Pretas jogam 1... Ta6! (T3TD), estabelecendo uma barreira intransponível na 6ª fila. Enquanto o peão branco permanecer em e5, o Rei branco em f5 jamais poderá cruzar para a 6ª fila sem levar troca de Torres ou perder o peão. As Brancas tentam preparar o avanço com 2. Td1 Rb7? não — as Pretas mantêm o Rei em frente ao peão e jogam 2... Re7! 3. Td6. Mas se as Brancas empurrarem o peão com 2. e6, a estratégia muda instantaneamente!",
              focusPly: 1,
            },
            {
              headingPt: 'Os Xeques pelas Costas quando o Peão Avança (2. e6 Ta1!)',
              bodyPt:
                "Assim que o peão branco avança com 2. e6, privando o próprio Rei branco do abrigo na casa e6, a Torre preta abandona a 6ª fila e desce até o fundo do tabuleiro com 2... Ta1! (T8TD!). Agora, após 3. Rf6 Tf1+! 4. Re5 Te1+! 5. Rd5 Td1+!, o Rei branco não tem onde se esconder dos xeques verticais à distância, garantindo o empate técnico perfeito!",
              focusPly: 3,
            },
          ],
          keyTakeawaysPt: [
            'Mantenha a Torre defensora na 6ª fila (barreira de Philidor) enquanto o peão inimigo estiver na 5ª fila.',
            'Assim que o peão inimigo avançar para a 6ª fila (2. e6), leve imediatamente a Torre para a 1ª fila (2... Ta1!) para dar xeques pelas costas.',
            'O Rei atacante perde a casa de abrigo que antes era ocupada pelo seu próprio peão.',
          ],
          movesSan: ['Ra6', 'e6', 'Ra1', 'Kf6', 'Rf1+', 'Ke5', 'Re1+', 'Kd6', 'Rd1+', 'Kc5', 'Rc1+'],
          annotations: {
            1: {
              ply: 1,
              commentPt: "Original: 1... T3TD! (Ra6!). A Torre preta corta a 6ª horizontal. O Rei branco não pode avançar enquanto o peão estiver em e5.",
              badge: '!',
              arrows: [{ from: 'a6', to: 'h6', color: 'emerald' }],
              hintPt: 'Coloque a Torre na 6ª fila para cortar a passagem do Rei branco!',
            },
            2: {
              ply: 2,
              commentPt: "2. e6 (P6R). Única tentativa das Brancas de progredir, mas agora a casa e6 deixa de servir de escudo para o Rei branco!",
              arrows: [{ from: 'e5', to: 'e6', color: 'amber' }],
            },
            3: {
              ply: 3,
              commentPt: "Original: 2... T8TD!! (Ra1!!). A manobra imortal de Philidor! A Torre vai para o fundo dar xeques intermináveis pelas costas.",
              badge: '!!',
              arrows: [{ from: 'a6', to: 'a1', color: 'emerald' }, { from: 'a1', to: 'f1', color: 'sky' }],
              hintPt: 'Desça com a Torre até a primeira fila (a1) para atacar o Rei branco pelas costas!',
            },
            5: {
              ply: 5,
              commentPt: "3... Tf1+! Começa a chuva de xeques verticais. Como o peão ocupa e6, o Rei branco jamais consegue se esconder!",
              badge: '!',
              arrows: [{ from: 'f1', to: 'f6', color: 'emerald' }],
            },
          },
        },
      ],
    },
  ],

  // ============================================================================
  // LIVRO 2: MEU SISTEMA (MI SISTEMA) — AARON NIMZOWITSCH
  // ============================================================================
  'meu-sistema-nimzowitsch': [
    {
      id: 'ms-cap-colunas-posto',
      number: 4,
      titlePt: 'As Colunas Abertas, a 7ª Fila e o Posto Avançado',
      subtitlePt: 'Como transformar o domínio de uma coluna em um Cavalo inexpugnável no campo inimigo',
      games: [
        {
          id: 'ms-game-nimzo-rubinstein-1926',
          titlePt: 'Aaron Nimzowitsch vs. Akiba Rubinstein (Dresden, 1926) — A Manobra Imortal Ce2-g1-h3-f2!',
          white: 'Aaron Nimzowitsch',
          black: 'Akiba Rubinstein',
          event: 'Torneio Internacional de Dresden (Cap. O Jogo Posicional)',
          year: '1926',
          result: '1-0',
          eco: 'C49',
          openingNamePt: 'Abertura Inglesa / Sistema Hipermoderno de Nimzowitsch',
          studyPhase: 'middlegame',
          heroColor: 'w',
          introPt:
            "Considerada pelo próprio Nimzowitsch como a joia máxima de 'Meu Sistema', esta partida contra o lendário Akiba Rubinstein ilustra a essência da transferência de peças para novas funções estratégicas e a abertura de colunas na ala do Rei.",
          readingSectionsPt: [
            {
              headingPt: 'A Flexibilidade do Centro Hipermoderno',
              bodyPt:
                "Nimzowitsch inicia com 1. c4 c5 2. Cf3 Cf6 3. Cc3 d5 4. cxd5 Cxd5 5. e4 Cb4 6. Bc4 e6 7. O-O C8c6 8. d3 Cd4 9. Cxd4 cxd4 10. Ce2 a6 11. a3 Cc6 12. f4 Bc5 13.Cg3 O-O 14. Df3 Rh8 15. Bd2 f5 16. Tae1 b5 17. Ba2 Db6 18. Te2! Aqui, enquanto qualquer jogador comum trocaria em f5, Nimzowitsch prepara uma das manobras mais profundas da história do xadrez.",
              focusPly: 35,
            },
            {
              headingPt: 'O Recuo Paradoxal 18. Cg1!! rumo à Casa f2',
              bodyPt:
                "Após 17... Db6 18. exf5 exf5 19. Ch1!! (ou a ideia análoga de redeslocamento do Cavalo pela 1ª fila), Nimzowitsch leva o Cavalo por trás das próprias linhas para abrir o caminho da Dama e das Torres na coluna e e na ala do Rei! Veja na sequência principal como 18. Te2 Bd7 19. exf5 exf5 20. Ch1! Tae8 21. Tfe1 Txe2 22. Txe2 Te8 23. Txe8+ Bxe8 24. Cf2! Bf7 25. Bxf7 Dxf7 26. g4! abre decisivamente as linhas contra o Rei preto!",
              focusPly: 40,
            },
          ],
          keyTakeawaysPt: [
            'Uma coluna aberta (coluna e) serve como avenida para dobrar Torres e paralisar o centro inimigo.',
            'Recuar um Cavalo para a primeira fila (20. Ch1! seguido de 24. Cf2!) pode revitalizar toda a coordenação do exército.',
            'Depois de dominar a coluna central, abra uma segunda frente na ala (26. g4!) para explorar a sobrecarga.',
          ],
          movesSan: [
            'c4', 'c5', 'Nf3', 'Nf6', 'Nc3', 'd5', 'cxd5', 'Nxd5', 'e4', 'Nb4',
            'Bc4', 'e6', 'O-O', 'N8c6', 'd3', 'Nd4', 'Nxd4', 'cxd4', 'Ne2', 'a6',
            'a3', 'Nc6', 'f4', 'Bc5', 'Ng3', 'O-O', 'Qf3', 'Kh8', 'Bd2', 'f5',
            'Rae1', 'b5', 'Ba2', 'Qd7', 'Re2', 'Bb7', 'exf5', 'exf5', 'Nh1', 'Rae8',
            'Rfe1', 'Rxe2', 'Rxe2', 'Re8', 'Rxe8+', 'Qxe8', 'Nf2', 'Qd7', 'Qe2', 'Ne7', 'Bb4'
          ],
          annotations: {
            9: {
              ply: 9,
              commentPt: "5. e4! As Brancas ocupam o centro com ganho de tempo sobre o Cavalo de d5.",
              badge: '!',
              arrows: [{ from: 'e2', to: 'e4', color: 'emerald' }],
              hintPt: 'Avance o peão do Rei atacando o Cavalo centralizado.',
            },
            35: {
              ply: 35,
              commentPt: "18. Te2! Nimzowitsch prepara o dobramento das Torres na coluna e antes mesmo de ela se abrir completamente.",
              badge: '!',
              arrows: [{ from: 'e1', to: 'e2', color: 'emerald' }, { from: 'f1', to: 'e1', color: 'sky' }],
              hintPt: 'Eleve a Torre para e2 preparando o domínio absoluto da coluna e.',
            },
            39: {
              ply: 39,
              commentPt: "20. Ch1!! O famoso recuo hipermoderno de Nimzowitsch! O Cavalo sai da frente das peças pesadas para renascer em f2 e g5.",
              badge: '!!',
              arrows: [{ from: 'g3', to: 'h1', color: 'emerald' }, { from: 'h1', to: 'f2', color: 'amber' }],
              hintPt: 'Realize o recuo estratégico do Cavalo para h1 rumo à casa f2!',
            },
            51: {
              ply: 51,
              commentPt: "26. g4! Com o Cavalo em f2 apoiando e4 e g4, Nimzowitsch abre a segunda frente na ala do Rei com vantagem decisiva.",
              badge: '!',
              arrows: [{ from: 'g2', to: 'g4', color: 'emerald' }],
            },
          },
        },
      ],
    },
    {
      id: 'ms-cap-moinho-cravada',
      number: 5,
      titlePt: 'O Xeque a Descoberto e a Engrenagem (Zwickmühle / O Moinho)',
      subtitlePt: 'O mecanismo tático mais devastador da história explicado no Capítulo 8 de Meu Sistema',
      games: [
        {
          id: 'ms-game-torre-lasker-1925',
          titlePt: 'Carlos Torre vs. Emanuel Lasker (Moscou, 1925) — O Moinho Imortal',
          white: 'Carlos Torre Repetto',
          black: 'Emanuel Lasker',
          event: 'Torneio Internacional de Moscou (Cap. 8 de Meu Sistema)',
          year: '1925',
          result: '1-0',
          eco: 'A46',
          openingNamePt: 'Ataque Torre (Sacrifício de Dama Bf6!! e Engrenagem)',
          studyPhase: 'middlegame',
          heroColor: 'w',
          introPt:
            "No Capítulo 8 de 'Meu Sistema', Nimzowitsch batiza de 'Zwickmühle' (O Moinho ou Engrenagem) a combinação alternada de xeques diretos e xeques a descoberto onde uma Torre e um Bispo trituram todo o exército adversário. O exemplo supremo da literatura enxadrística é esta vitória de Carlos Torre sobre o ex-campeão mundial Emanuel Lasker!",
          readingSectionsPt: [
            {
              headingPt: 'A Cravada Mútua das Damas e dos Bispos',
              bodyPt:
                "Após uma abertura tensa com 1. d4 Cf6 2. Cf3 e6 3. Bg5 c5 4. e3 cxd4 5. exd4 Be7 6. Cbd2 d6 7. c3 Cbd7 8. Bd3 b6 9. Cc4 Bb7 10. De2 Dc7 11. O-O O-O 12. Tfe1 Tfe8 13. Tad1 Cf8 14. Bc1 Cd5 15. Cg5 b5 16. Ca3 b4 17. cxb4 Cxb4 18. Dh5 Bxg5 19. Bxg5 Cxd3 20. Txd3 Da5 21. b4! Df5 22. Tg3 h6 23. Bxh6 Dxh5, chegamos ao momento mágico da partida: a Dama branca em h5 e o Bispo em g5 estão atacados, mas a Torre em g3 aponta em raio-X para o Rei de Lasker em g8!",
              focusPly: 45,
            },
            {
              headingPt: 'O Sacrifício de Dama 25. Bf6!! e a Engrenagem na 7ª Fila',
              bodyPt:
                "No lance 24. Bc4 Df5, Carlos Torre desencadeia o trovão: 25. Bf6!! Dxh5 26. Txg7+ Rh8 27. Txf7+! Rg8 28. Tg7+ Rh8 29. Txb7+! Rg8 30. Tg7+ Rh8 31. Tg5+! Rh7 32. Txh5 Rg6 33. Th3 Rxf6 34. Txh6+! A 'Engrenagem' devorou dois peões e um Bispo inteiro com xeques a descoberto sucessivos antes de recuperar a Dama preta em h5, deixando Torre com três peões a mais no final!",
              focusPly: 49,
            },
          ],
          keyTakeawaysPt: [
            'A Engrenagem (Moinho) funciona quando uma Torre na 7ª fila e um Bispo na grande diagonal alternam xeques diretos e xeques a descoberto.',
            'O sacrifício de Dama 25. Bf6!! força a abertura da coluna g para a Torre de g3.',
            'Após 31. Tg5+!, a Torre recupera a Dama preta com juros compostos.',
          ],
          movesSan: [
            'd4', 'Nf6', 'Nf3', 'e6', 'Bg5', 'c5', 'e3', 'cxd4', 'exd4', 'Be7',
            'Nbd2', 'd6', 'c3', 'Nbd7', 'Bd3', 'b6', 'Nc4', 'Bb7', 'Qe2', 'Qc7',
            'O-O', 'O-O', 'Rfe1', 'Rfe8', 'Rad1', 'Nf8', 'Bc1', 'Nd5', 'Ng5', 'b5',
            'Na3', 'b4', 'cxb4', 'Nxb4', 'Qh5', 'Bxg5', 'Bxg5', 'Nxd3', 'Rxd3', 'Qa5',
            'b4', 'Qf5', 'Rg3', 'h6', 'Nc4', 'Qd5', 'Ne3', 'Qb5', 'Bf6', 'Qxh5', 'Rxg7+', 'Kh8',
            'Rxf7+', 'Kg8', 'Rg7+', 'Kh8', 'Rxb7+', 'Kg8', 'Rg7+', 'Kh8', 'Rg5+', 'Kh7',
            'Rxh5', 'Kg6', 'Rh3', 'Kxf6', 'Rxh6+'
          ],
          annotations: {
            43: {
              ply: 43,
              commentPt: "22. Tg3! A Torre assume posição de raio-X diretamente contra g7 e o Rei preto em g8.",
              badge: '!',
              arrows: [{ from: 'd3', to: 'g3', color: 'emerald' }, { from: 'g3', to: 'g7', color: 'rose' }],
              hintPt: 'Transfira a Torre da coluna d para g3 mirando o roque preto!',
            },
            49: {
              ply: 49,
              commentPt: "25. Bf6!! O sacrifício imortal de Dama! Crava o peão de g7 e força as Pretas a capturarem a Dama em h5, abrindo a Engrenagem.",
              badge: '!!',
              arrows: [{ from: 'g5', to: 'f6', color: 'emerald' }, { from: 'g3', to: 'g7', color: 'rose' }],
              highlights: [{ square: 'f6', color: 'emerald' }, { square: 'g7', color: 'rose' }],
              hintPt: 'Sacrifique a Dama levando o Bispo para f6 para destrancar o Moinho em g7!',
            },
            53: {
              ply: 53,
              commentPt: "27. Txf7+! Primeiro giro da Engrenagem: xeque a descoberto do Bispo de f6 enquanto a Torre colhe todo o material na 7ª fila!",
              badge: '!!',
              arrows: [{ from: 'g7', to: 'f7', color: 'emerald' }, { from: 'f6', to: 'g7', color: 'amber' }],
            },
            61: {
              ply: 61,
              commentPt: "31. Tg5+! Depois de limpar a 7ª fila, a Torre dá xeque a descoberto atacando a Dama preta em h5!",
              badge: '!!',
              arrows: [{ from: 'g7', to: 'g5', color: 'emerald' }, { from: 'g5', to: 'h5', color: 'rose' }],
            },
          },
        },
      ],
    },
  ],

  // ============================================================================
  // LIVRO 3: VIDA E PARTIDAS DE MIKHAIL TAL — MIKHAIL TAL
  // ============================================================================
  'mikhail-tal-life-games': [
    {
      id: 'tal-cap-tolush-1957',
      number: 3,
      titlePt: 'O Primeiro Título Soviético aos 20 Anos (Moscou, 1957)',
      subtitlePt: 'A explosão combinativa na rodada final contra Alexander Tolush',
      games: [
        {
          id: 'tal-game-tolush-1957',
          titlePt: 'Mikhail Tal vs. Alexander Tolush (Moscou, 1957) — A Partida da Coroação',
          white: 'Mikhail Tal',
          black: 'Alexander Tolush',
          event: '24º Campeonato da URSS (Última Rodada Decisiva)',
          year: '1957',
          result: '1-0',
          eco: 'E81',
          openingNamePt: 'Defesa Índia do Rei (Variante Sämisch — Ataque na Ala do Rei)',
          studyPhase: 'middlegame',
          heroColor: 'w',
          introPt:
            "Em sua autobiografia 'The Life and Games of Mikhail Tal', o Mago de Riga narra a emoção da última rodada do Campeonato Soviético de 1957. Precisando vencer o temido atacante Alexander Tolush para se sagrar o mais jovem campeão da história da URSS, Tal escolhe a Variante Sämisch da Índia do Rei e lança uma tempestade de peças contra o Rei preto.",
          readingSectionsPt: [
            {
              headingPt: 'Roques em Alas Opostas e a Tempestade de Peões',
              bodyPt:
                "A partida começa com 1. c4 Cf6 2. Cc3 g6 3. e4 d6 4. d4 Bg7 5. f3 e5 6. Cge2 Cc6 7. Be3 a6 8. Dd2 Tb8 9. Td1 b5 10. cxb5 axb5 11. dxe5 Cxe5 12. Cd4 b4 13. Ccb5 Bd7 14. Be2 O-O 15. O-O Bxb5 16. Bxb5 c5 17. Cc6 Cxc6 18. Bxc6 Db6 19. Bd5 Cxd5 20. Dxd5 Bxb2. Tolush ganha o peão de b2, mas entrega a Tal o controle absoluto das casas centrais e da coluna d!",
              focusPly: 40,
            },
            {
              headingPt: 'O Sacrifício de Peças para Abrir o Roque (30. Bxg7! e 31. e5!)',
              bodyPt:
                "Após 21. Tf2 Bg7 22. Bf4 Tbd8 23. Tfd2 Bd4+ 24. Rh1 Td7 25. Bh6 Tfd8 26. Txd4! cxd4 27. Dxd4 Dxd4 28. Txd4, Tal sacrifica a qualidade para eliminar o forte Bispo de casas escuras de Tolush, demonstrando que mesmo com menos material no papel, a atividade das peças e os peões passados centrais decidem a luta!",
              focusPly: 51,
            },
          ],
          keyTakeawaysPt: [
            'O sacrifício posicional de qualidade 26. Txd4! elimina a única peça ativa do defensor.',
            'Bispos de cores opostas no meio-jogo favorecem quase sempre quem tem o ataque contra o Rei.',
            'A centralização da Dama em d5 paralisa todo o contrajogo das Pretas.',
          ],
          movesSan: [
            'c4', 'Nf6', 'Nc3', 'g6', 'e4', 'd6', 'd4', 'Bg7', 'f3', 'e5',
            'Nge2', 'Nc6', 'Be3', 'a6', 'Qd2', 'Rb8', 'Rd1', 'b5', 'cxb5', 'axb5',
            'dxe5', 'Nxe5', 'Nd4', 'b4', 'Ncb5', 'Bd7', 'Be2', 'O-O', 'O-O', 'Bxb5',
            'Bxb5', 'c5', 'Nc6', 'Nxc6', 'Bxc6', 'Qb6', 'Bd5', 'Nxd5', 'Qxd5', 'Bxb2',
            'Rf2', 'Bg7', 'Bf4', 'Rbd8', 'Rfd2', 'Bd4+', 'Kh1', 'Rd7', 'Bh6', 'Rfd8',
            'Rxd4', 'cxd4', 'Qxd4', 'Qxd4', 'Rxd4'
          ],
          annotations: {
            9: {
              ply: 9,
              commentPt: "5. f3! A formação Sämisch consolida o centro e4-d4 e impede saltos incômodos em g4.",
              arrows: [{ from: 'f3', to: 'e4', color: 'emerald' }],
            },
            39: {
              ply: 39,
              commentPt: "20. Dxd5! A Dama de Tal instala-se no coração do tabuleiro em d5, radiografando f7 e a6.",
              badge: '!',
              highlights: [{ square: 'd5', color: 'emerald' }],
            },
            51: {
              ply: 51,
              commentPt: "26. Txd4!! Sacrifício brilhante de qualidade! Tal elimina o Bispo bloqueador de d4 e deixa as Torres pretas completamente passivas.",
              badge: '!!',
              arrows: [{ from: 'd2', to: 'd4', color: 'emerald' }],
              hintPt: 'Elimine o poderoso Bispo preto de d4 sacrificando a qualidade!',
            },
          },
        },
      ],
    },
    {
      id: 'tal-cap-larsen-1965',
      number: 4,
      titlePt: 'O Sacrifício Especulativo em d5 — Tal vs. Larsen (Bled, 1965)',
      subtitlePt: 'A 10ª Partida decisiva do Match de Candidatos com o sacrifício de Cavalo 16. Cd5!!',
      games: [
        {
          id: 'tal-game-larsen-1965',
          titlePt: 'Mikhail Tal vs. Bent Larsen (Bled, 1965) — O Cavalo de Fogo em d5',
          white: 'Mikhail Tal',
          black: 'Bent Larsen',
          event: 'Semifinal de Candidatos (10ª Partida Decisiva)',
          year: '1965',
          result: '1-0',
          eco: 'B82',
          openingNamePt: 'Defesa Siciliana (Variante Scheveningen — Ataque f4-f5)',
          studyPhase: 'middlegame',
          heroColor: 'w',
          introPt:
            "Com o match empatado em 4,5 a 4,5 na última partida regulamentar em Bled (1965), Mikhail Tal precisava de uma criação imortal contra o grande dinamarquês Bent Larsen. Na posição clássica da Siciliana Scheveningen, Tal lança o sacrifício intuitivo 16. Cd5!! que entrou para todos os manuais de combinação.",
          readingSectionsPt: [
            {
              headingPt: 'O Sacrifício Temático 16. Cd5!! na Siciliana',
              bodyPt:
                "Após 1. e4 c5 2. Cf3 Nc6 3. d4 cxd4 4. Cxd4 e6 5. Cc3 d6 6. Be3 Cf6 7. f4 Be7 8. Df3 O-O 9. O-O-O Dc7 10. Cdb5 Db8 11. g4 a6 12. Cd4 Cxd4 13. Bxd4 b5 14. g5 Cd7 15. Bd3 b4, o Cavalo branco de c3 está atacado. Em vez de recuar para e2, Tal joga 16. Cd5!! exd5 17. exd5! Agora a diagonal b1-h7 e a coluna e se abrem simultaneamente contra o Rei preto!",
              focusPly: 31,
            },
          ],
          keyTakeawaysPt: [
            'Na Siciliana, o sacrifício 16. Cd5!! Seguido de exd5 bloqueia o peão d6 e abre a diagonal b1-h7 para o Bispo de d3.',
            'Com o Rei branco em c1, as Torres em d1 e h1 apoiam o assalto direto à ala do Rei.',
          ],
          movesSan: [
            'e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'e6', 'Nc3', 'd6',
            'Be3', 'Nf6', 'f4', 'Be7', 'Qf3', 'O-O', 'O-O-O', 'Qc7', 'Ndb5', 'Qb8',
            'g4', 'a6', 'Nd4', 'Nxd4', 'Bxd4', 'b5', 'g5', 'Nd7', 'Bd3', 'b4',
            'Nd5', 'exd5', 'exd5', 'f5', 'Rde1', 'Rf7', 'h4', 'Bb7', 'Bxf5', 'Rxf5',
            'Rxe7', 'Ne5', 'Qe4', 'Qf8', 'fxe5', 'Rf4', 'Qe3', 'Rf3', 'Qe2', 'Qxe7', 'Qxf3'
          ],
          annotations: {
            31: {
              ply: 31,
              commentPt: "16. Cd5!! O sacrifício imortal de Tal! Entrega uma peça inteira para abrir a diagonal b1-h7 e a coluna e.",
              badge: '!!',
              arrows: [{ from: 'c3', to: 'd5', color: 'emerald' }, { from: 'd3', to: 'h7', color: 'rose' }],
              hintPt: 'Sacrifique o Cavalo no centro (d5) para abrir todas as linhas de ataque contra o roque preto!',
            },
            33: {
              ply: 33,
              commentPt: "17. exd5! Agora o Bispo de d3 aponta sem obstáculos para h7 e a coluna e pertence às Torres brancas.",
              badge: '!',
              arrows: [{ from: 'd3', to: 'h7', color: 'rose' }, { from: 'd1', to: 'e1', color: 'emerald' }],
            },
            39: {
              ply: 39,
              commentPt: "20. Bxf5! Tal demole o escudo f5 e invade a 7ª fila com 21. Txe7!",
              badge: '!!',
              arrows: [{ from: 'd3', to: 'f5', color: 'emerald' }],
            },
          },
        },
      ],
    },
  ],

  // ============================================================================
  // LIVRO 4: MEUS GRANDES PREDECESSORES VOL. 4 (BOBBY FISCHER) — GARRY KASPAROV
  // ============================================================================
  'kasparov-fischer-vol4': [
    {
      id: 'kf-cap-11-em-11',
      number: 3,
      titlePt: 'O Campeonato Perfeito 11/11 — O Sacrifício Invisível (1963)',
      subtitlePt: 'Como Kasparov e os comentaristas na sala de análise não viram o sacrifício 15...Cxf2!! de Fischer',
      games: [
        {
          id: 'kf-game-rbyrne-fischer-1963',
          titlePt: 'Robert Byrne vs. Bobby Fischer (Nova York, 1963) — O Golpe 15...Cxf2!!',
          white: 'Robert Byrne',
          black: 'Bobby Fischer',
          event: 'Campeonato dos EUA 1963/64 (Placar Histórico 11/11)',
          year: '1963',
          result: '0-1',
          eco: 'E60',
          openingNamePt: 'Defesa Neo-Grünfeld (Ataque Relâmpago sobre o Rei Centralizado)',
          studyPhase: 'middlegame',
          heroColor: 'b',
          introPt:
            "No Volume 4 de 'Meus Grandes Predecessores', Garry Kasparov relata um episódio lendário do Campeonato dos EUA de 1963/64 (onde Fischer venceu todas as 11 partidas!). Na sala de imprensa, dois Grandes Mestres diziam que a posição de Robert Byrne era superior. Cinco minutos depois, Byrne abandonou! Fischer havia enxergado a combinação profunda iniciada por 15...Cxf2!!",
          readingSectionsPt: [
            {
              headingPt: 'O Castigo Contra o Rei que Permaneceu em e1',
              bodyPt:
                "A partida desenvolve-se com 1. d4 Cf6 2. c4 g6 3. g3 c6 4. Bg2 d5 5. cxd5 cxd5 6. Cc3 Bg7 7. e3 O-O 8. Cge2 Cc6 9. O-O b6 10. b3 Ba6 11. Ba3 Te8 12. Dd2 e5! 13. dxe5 Cxe5 14. Tfd1?! (um pequeno deslize posicional de Byrne, tirando a Torre de f1 onde protegia f2) 14... Cd3! 15. Dc2. Agora o Cavalo preto em d3 parece cravado ou forçado a recuar, mas Fischer detona a bomba: 15... Cxf2!!",
              focusPly: 30,
            },
            {
              headingPt: 'A Variante que Chocou a Sala de Grandes Mestres (21... Dd7!!)',
              bodyPt:
                "Após 16. Rxf2 Cg4+ 17. Rg1 Cxe3 18. Dd2 Cxg2! 19. Rxg2 d4!! 20. Cxd4 Bb7+ 21. Rf1 Dd7!!, os Grandes Mestres na sala de análise ficaram mudos! A Dama preta amenaza entrar em h3 com efeito letal nas casas brancas enfraquecidas ao redor do Rei de Byrne (se 22. Df2 Dh3+ 23. Rg1 Te1+!! 24. Txe1 Bxd4 com mate!).",
              focusPly: 42,
            },
          ],
          keyTakeawaysPt: [
            'Retirar a Torre de f1 (14. Tfd1?!) deixa o ponto f2 vulnerável a combinações de demolição.',
            'O lance chave da combinação é 19... d4!!, abrindo a grande diagonal a8-h1 para o Bispo de casas claras em a6/b7!',
            '21... Dd7!! explora as casas claras f3, g2 e h3 deixadas órfãs após a eliminação do Bispo de g2.',
          ],
          movesSan: [
            'd4', 'Nf6', 'c4', 'g6', 'g3', 'c6', 'Bg2', 'd5', 'cxd5', 'cxd5',
            'Nc3', 'Bg7', 'e3', 'O-O', 'Nge2', 'Nc6', 'O-O', 'b6', 'b3', 'Ba6',
            'Ba3', 'Re8', 'Qd2', 'e5', 'dxe5', 'Nxe5', 'Rfd1', 'Nd3', 'Qc2', 'Nxf2',
            'Kxf2', 'Ng4+', 'Kg1', 'Nxe3', 'Qd2', 'Nxg2', 'Kxg2', 'd4', 'Nxd4', 'Bb7+',
            'Kf1', 'Qd7'
          ],
          annotations: {
            24: {
              ply: 24,
              commentPt: "12... e5! Fischer liberta seu jogo no centro aceitando um peão isolado em d5 em troca de enorme atividade de peças.",
              badge: '!',
              arrows: [{ from: 'e7', to: 'e5', color: 'emerald' }],
            },
            28: {
              ply: 28,
              commentPt: "14... Cd3! O Cavalo invade o coração da posição branca, mirando f2 e e1.",
              badge: '!',
              arrows: [{ from: 'e5', to: 'd3', color: 'emerald' }, { from: 'd3', to: 'f2', color: 'rose' }],
            },
            30: {
              ply: 30,
              commentPt: "15... Cxf2!! O sacrifício invisível de Fischer! Destrói o escudo do Rei branco e atrai o monarca para as casas claras.",
              badge: '!!',
              arrows: [{ from: 'd3', to: 'f2', color: 'emerald' }, { from: 'f6', to: 'g4', color: 'amber' }],
              hintPt: 'Sacrifique o Cavalo em f2 para expor o Rei branco à fúria do segundo Cavalo e do Bispo de a6!',
            },
            38: {
              ply: 38,
              commentPt: "19... d4!! A ponta profunda da combinação calculada por Fischer no lance 15: abre a grande diagonal para o Bispo de a6 ir a b7 com xeque!",
              badge: '!!',
              arrows: [{ from: 'd5', to: 'd4', color: 'emerald' }, { from: 'a6', to: 'b7', color: 'rose' }],
              hintPt: 'Empurre o peão de d5 para d4 abrindo a grande diagonal a8-h1!',
            },
            42: {
              ply: 42,
              commentPt: "21... Dd7!! Lance silencioso mortal! Byrne abandonou aqui, pois contra 22. Df2 Dh3+ 23. Rg1 segue a brilhante 23... Te1+!! 24. Txe1 Bxd4 cravando a Dama!",
              badge: '!!',
              arrows: [{ from: 'd8', to: 'd7', color: 'emerald' }, { from: 'd7', to: 'h3', color: 'rose' }],
              alternativeLinePt: "Se 22. Df2 Dh3+ 23. Rg1 Te1+!! 24. Txe1 Bxd4 e as Pretas dão mate em poucas jogadas.",
            },
          },
        },
      ],
    },
    {
      id: 'kf-cap-candidatos-1971',
      number: 4,
      titlePt: 'A Marcha Implacável dos Candidatos (1971) — Fischer vs. Petrosian',
      subtitlePt: 'O famoso 22. Nxd7+! trocando um Bispo poderoso por um Cavalo para dominar a coluna c',
      games: [
        {
          id: 'kf-game-fischer-petrosian-1971',
          titlePt: 'Bobby Fischer vs. Tigran Petrosian (Buenos Aires, 1971 — 7ª Partida)',
          white: 'Bobby Fischer',
          black: 'Tigran Petrosian',
          event: 'Final do Torneio de Candidatos (Buenos Aires, 1971)',
          year: '1971',
          result: '1-0',
          eco: 'B42',
          openingNamePt: 'Defesa Siciliana (Variante Kan — O Julgamento Posicional 22. Bxd7+!!)',
          studyPhase: 'endgame',
          heroColor: 'w',
          introPt:
            "Na 7ª partida da final de Candidatos em Buenos Aires (1971), Fischer produziu um dos lances posicionais mais instrutivos de todos os tempos: 22. Bxd7+!! Trocar voluntariamente um Bispo ativo pelo Cavalo adversário parecia violar os dogmas clássicos, mas Fischer compreendeu que naquele final específico a Torre branca na 7ª fila aliada ao Cavalo branco em d4 seria infinitamente superior ao Bispo preto!",
          readingSectionsPt: [
            {
              headingPt: 'A Troca Paradoxal 22. Bxd7+!! que Mudou a Compreensão dos Finais',
              bodyPt:
                "Após 1. e4 c5 2. Cf3 e6 3. d4 cxd4 4. Cxd4 a6 5. Bd3 Cc6 6. Cxc6 bxc6 7. O-O d5 8. c4 Cf6 9. cxd5 cxd5 10. exd5 exd5 11. Cc3 Be7 12. Da4+ Bd7 13. Tfe1 Dxa4 14. Cxa4 Be6 15. Be3 O-O 16. Bc5 Tfe8 17. Bxe7 Txe7 18. b4 Rf8 19. Cc5 Bc8 20. f3 Tea7 21. Te5 Bd7, todo o auditório esperava que Fischer preservasse seu Bispo. Em vez disso, ele jogou 22. Nxd7+!! Txd7 23. Tc1 Td6 24. Tc7 Cd7 25. Te2 g6 26. Rf2 h5 27. f4 h4 28. Rf3 f5 29. Re3 d4+ 30. Rd3 Cb6 31. Tee7 Cd5 32. Tf7+ Re8 33. Tb7 Cxf4+ 34. Rc4, invadindo com as duas Torres na 7ª horizontal!",
              focusPly: 43,
            },
          ],
          keyTakeawaysPt: [
            'Não julgue Bispo vs. Cavalo por dogmas abstratos: avalie quem controla as colunas abertas e as casas de invasão na 7ª fila.',
            'Após 22. Bxd7+!!, as Brancas conquistam a coluna c (23. Tc1 e 24. Tc7!) sem nenhuma oposição.',
            'As duas Torres dobradas na 7ª fila (Tb7 e Tf7) criam redes de mate mesmo no final.',
          ],
          movesSan: [
            'e4', 'c5', 'Nf3', 'e6', 'd4', 'cxd4', 'Nxd4', 'a6', 'Bd3', 'Nc6',
            'Nxc6', 'bxc6', 'O-O', 'd5', 'c4', 'Nf6', 'cxd5', 'cxd5', 'exd5', 'exd5',
            'Nc3', 'Be7', 'Qa4+', 'Qd7', 'Rfe1', 'Qxa4', 'Nxa4', 'Be6', 'Be3', 'O-O',
            'Bc5', 'Rfe8', 'Bxe7', 'Rxe7', 'b4', 'Kf8', 'Nc5', 'Bc8', 'f3', 'Rea7',
            'Re5', 'Bd7', 'Nxd7+', 'Rxd7', 'Rc1', 'Rd6', 'Rc7', 'Nd7', 'Re2', 'g6',
            'Kf2', 'h5', 'f4', 'h4', 'Kf3', 'f5', 'Ke3', 'd4+', 'Kd2', 'Nb6',
            'Ree7', 'Nd5', 'Rf7+', 'Ke8', 'Rb7'
          ],
          annotations: {
            37: {
              ply: 37,
              commentPt: "19. Cc5! O Cavalo instala-se no posto avançado ideal de c5, paralisando a ala da Dama preta.",
              badge: '!',
              highlights: [{ square: 'c5', color: 'emerald' }],
            },
            43: {
              ply: 43,
              commentPt: "22. Cxd7+!! (ou a ideia de simplificação posicional na casa d7): Fischer elimina o defensor das casas claras para invadir imediatamente a coluna c com 23. Tc1 e 24. Tc7!",
              badge: '!!',
              arrows: [{ from: 'c5', to: 'd7', color: 'emerald' }, { from: 'a1', to: 'c1', color: 'sky' }],
              hintPt: 'Simplifique em d7 para conquistar imediatamente a coluna c e a 7ª fila!',
            },
            47: {
              ply: 47,
              commentPt: "24. Tc7! A Torre branca conquista a 7ª horizontal, de onde jamais será expulsa.",
              badge: '!',
              arrows: [{ from: 'c1', to: 'c7', color: 'emerald' }],
            },
            61: {
              ply: 61,
              commentPt: "31. Tee7! Os 'Porcos Cegos' (Torres dobradas na 7ª fila) decidem a partida com ameaças de mate ao Rei preto!",
              badge: '!!',
              arrows: [{ from: 'e2', to: 'e7', color: 'emerald' }, { from: 'c7', to: 'b7', color: 'rose' }],
            },
          },
        },
      ],
    },
  ],
};


function toPtSanSimple(san) {
  if (!san) return '';
  var map = { K: 'R', Q: 'D', R: 'T', B: 'B', N: 'C' };
  return san.replace(/^[KQRBN]/, function(m) { return map[m] || m; });
}

function buildMoveRunText(movesSan, startIdx, endIdx) {
  var parts = [];
  for (var i = startIdx; i < Math.min(endIdx, movesSan.length); i++) {
    var moveNum = Math.floor(i / 2) + 1;
    var sanPt = toPtSanSimple(movesSan[i]);
    if (i % 2 === 0) {
      parts.push(moveNum + '. ' + sanPt);
    } else if (i === startIdx) {
      parts.push(moveNum + '... ' + sanPt);
    } else {
      parts.push(sanPt);
    }
  }
  return parts.join(' ');
}

function ensureReadingSections(game, chapterTitle) {
  if (game.readingSectionsPt && game.readingSectionsPt.length > 0) {
    return game.readingSectionsPt;
  }
  var moves = game.movesSan || [];
  var anns = game.annotations || {};
  var annKeys = Object.keys(anns).map(Number).sort(function(a, b) { return a - b; });
  var midPly = Math.min(20, Math.floor(moves.length / 2));
  var firstRun = buildMoveRunText(moves, 0, Math.max(6, midPly));
  var secondRun = buildMoveRunText(moves, Math.max(6, midPly), moves.length);

  var annCommentsFirst = [];
  var annCommentsSecond = [];
  for (var k = 0; k < annKeys.length; k++) {
    var ply = annKeys[k];
    var c = anns[ply] && anns[ply].commentPt ? anns[ply].commentPt : '';
    if (!c) continue;
    if (ply <= midPly) annCommentsFirst.push(c);
    else annCommentsSecond.push(c);
  }

  var sections = [
    {
      headingPt: '1. Contexto da Partida e Abertura (' + (game.openingNamePt || chapterTitle) + ')',
      bodyPt: (game.introPt ? game.introPt + ' ' : '') +
        'Acompanhe no texto e clique em qualquer lance para ver a posição no tabuleiro: ' + firstRun + '. ' +
        annCommentsFirst.slice(0, 2).join(' '),
      focusPly: Math.min(8, moves.length),
    }
  ];

  if (secondRun) {
    sections.push({
      headingPt: '2. O Momento Crítico, Meio-Jogo e Desfecho Tático',
      bodyPt: 'Na fase decisiva da partida, a sequência segue com ' + secondRun + '. ' +
        annCommentsSecond.slice(0, 3).join(' '),
      focusPly: Math.min(Math.max(10, midPly + 2), moves.length),
    });
  }
  return sections;
}

window.PREINSTALLED_BOOKS = window.PREINSTALLED_BOOKS.map(function(book) {
  var extras = EXTRA_CHAPTERS_BY_BOOK[book.id] || [];
  var rawChapters = book.chapters.concat(extras);
  var flatChapters = [];

  for (var cIdx = 0; cIdx < rawChapters.length; cIdx++) {
    var ch = rawChapters[cIdx];
    var games = ch.games && ch.games.length ? ch.games : [ch];
    for (var gIdx = 0; gIdx < games.length; gIdx++) {
      var g = games[gIdx];
      var num = flatChapters.length + 1;
      var enrichedSections = ensureReadingSections(g, ch.titlePt || g.titlePt);
      var enrichedGame = Object.assign({}, g, {
        startingFen: g.startingFen || g.initialFen || 'start',
        readingSectionsPt: enrichedSections,
      });
      flatChapters.push(Object.assign({}, ch, enrichedGame, {
        id: games.length > 1 ? (ch.id + '-' + (gIdx + 1)) : ch.id,
        number: num,
        titlePt: games.length > 1 ? (ch.titlePt + ' — ' + g.titlePt) : (ch.titlePt || g.titlePt),
        subtitlePt: g.titlePt && g.titlePt !== ch.titlePt ? (g.titlePt + ' · ' + (ch.subtitlePt || '')) : (ch.subtitlePt || ''),
        startingFen: enrichedGame.startingFen,
        readingSectionsPt: enrichedSections,
        games: [enrichedGame],
      }));
    }
  }
  return Object.assign({}, book, { chapters: flatChapters });
});
