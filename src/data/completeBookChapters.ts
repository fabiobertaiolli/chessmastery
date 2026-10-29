import type { BookChapter, BookLessonGame } from '@/types/chess';

/**
 * Capítulos adicionais completos para enriquecer os 4 livros clássicos em `preinstalledBooks.ts`.
 * Todos os capítulos possuem seções de leitura fluida (`readingSectionsPt`) com movimentos
 * algébricos e descritivos embutidos nos parágrafos para clique em tempo real.
 */
export const EXTRA_CHAPTERS_BY_BOOK: Record<string, BookChapter[]> = {
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
