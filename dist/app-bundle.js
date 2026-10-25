/**
 * Chess Mastery — Redesign Infantil/Didático & Treinador Inteligente de Aberturas
 * Core Application Engine & UI Controller
 * Implementa integralmente o Conceito de Produto, UX e Design Visual:
 * - Paleta Creme (#FFF9ED), Verde Menta (#DDF3E5), Verde Principal (#16865E), Azul Céu (#DCEBFF), Amarelo Suave (#FFE5A8), Coral (#F9DCD9) e Madeira (#B58A65)
 * - Dois Modos de Uso: Modo Aprender (Padrão, claro e focado) e Modo Explorador (Avançado sob demanda)
 * - Navegação Principal: Aprender • Biblioteca • Aberturas • Conquistas
 * - Treinador Inteligente de Aberturas (Escolher, Jogar, Feedback de 3 níveis, Dicas Progressivas 1-2-3, Entender o Plano, Revisar)
 * - Três Fontes de Orientação Separadas: Do Livro (com Autor, Capítulo e Página), Do Tutor e Do Stockfish
 */
(function () {
  const {
    Chess,
    moveToDescriptive,
    sanToPortugueseAlgebraic,
    sanToFigurine,
    formatMoveByMode,
    getBoardCoordinates,
  } = window.ChessMasteryEngine;

  const BOOKS = window.PREINSTALLED_BOOKS || [];
  const OPENINGS = window.CHESS_OPENINGS || [];
  const OPENING_CATS = window.OPENING_CATEGORIES || [];

  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const PIECE_NAMES_FRIENDLY = {
    p: 'Peão',
    n: 'Cavalo',
    b: 'Bispo',
    r: 'Torre',
    q: 'Dama',
    k: 'Rei',
  };

  // ============================================================================
  // SINTETIZADOR ACÚSTICO DE MADEIRA (WEB AUDIO API)
  // ============================================================================
  const audio = {
    ctx: null,
    muted: false,
    init() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    },
    playMove() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(150, now);
      o.frequency.exponentialRampToValueAtTime(55, now + 0.065);
      g.gain.setValueAtTime(0.24, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.075);
    },
    playCapture() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(210, now);
      o.frequency.exponentialRampToValueAtTime(68, now + 0.085);
      g.gain.setValueAtTime(0.28, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.095);
    },
    playCheck() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(587.33, now);
      o.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      g.gain.setValueAtTime(0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.19);
    },
    playSuccess() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const now = this.ctx.currentTime + i * 0.06;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(0.15, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(now);
        o.stop(now + 0.25);
      });
    },
    playSoftAlert() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(320, now);
      o.frequency.linearRampToValueAtTime(250, now + 0.14);
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.17);
    },
  };

  // Temas de Tabuleiro com Madeira Clara como Padrão Oficial (#B58A65)
  const BOARD_THEMES = {
    lichess_wood: {
      name: 'Madeira Clara (Padrão)',
      light: '#F5E6CE',
      dark: '#B58A65',
      lastLight: '#E5DF88',
      lastDark: '#BBA84B',
    },
    chesscom_green: {
      name: 'Verde Menta & Creme',
      light: '#FFF9ED',
      dark: '#69A282',
      lastLight: '#DDF3E5',
      lastDark: '#4D8B68',
    },
    walnut_luxury: {
      name: 'Nogueira Clássica',
      light: '#EAD8C0',
      dark: '#8B5A2B',
      lastLight: '#E4C96B',
      lastDark: '#A68232',
    },
    slate_ice: {
      name: 'Azul Céu Suave',
      light: '#F0F6FF',
      dark: '#7A9EC2',
      lastLight: '#DCEBFF',
      lastDark: '#5B84AE',
    },
  };

  function getPieceSvg(color, type) {
    const isW = color === 'w';
    const fill = isW ? '#FFFDF9' : '#262B33';
    const stroke = isW ? '#2C3531' : '#121519';
    const inner = isW ? '#475569' : '#CBD5E1';
    const t = type.toLowerCase();
    let innerBody = '';
    if (t === 'p') {
      innerBody = `<path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17.5,21 15.5,24 15.5,28 C 15.5,30 16.5,31.5 16.5,31.5 L 12,35.5 L 12,38.5 L 33,38.5 L 33,35.5 L 28.5,31.5 C 28.5,31.5 29.5,30 29.5,28 C 29.5,24 27.5,21 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z" fill="${fill}" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round"/>`;
    } else if (t === 'r') {
      innerBody = `<g fill="${fill}" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/><path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"/><path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"/><path d="M 34,14 L 31,17 L 14,17 L 11,14"/><path d="M 31,17 L 31,29.5 L 14,29.5 L 14,17"/><path d="M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5"/><path d="M 14,16.5 L 31,16.5" stroke="${inner}" stroke-width="1"/></g>`;
    } else if (t === 'n') {
      innerBody = `<g fill="none" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="${fill}"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="${fill}"/><circle cx="15.5" cy="14.5" r="1.3" fill="${inner}" stroke="none"/></g>`;
    } else if (t === 'b') {
      innerBody = `<g fill="${fill}" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/><circle cx="22.5" cy="8" r="2.2"/><path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke="${inner}" stroke-width="1.3"/></g>`;
    } else if (t === 'q') {
      innerBody = `<g fill="${fill}" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"/><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"/><circle cx="6" cy="12" r="1.8"/><circle cx="14" cy="9" r="1.8"/><circle cx="22.5" cy="8" r="1.8"/><circle cx="31" cy="9" r="1.8"/><circle cx="39" cy="12" r="1.8"/><path d="M 11.5,30 C 15,29 30,29 33.5,30" stroke="${inner}" stroke-width="1.2"/><path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5" stroke="${inner}" stroke-width="1.2"/></g>`;
    } else if (t === 'k') {
      innerBody = `<g fill="${fill}" stroke="${stroke}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6"/><path d="M 20,8 L 25,8"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"/><path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z"/><path d="M 11.5,30 C 17,27 27,27 32.5,30" stroke="${inner}" stroke-width="1.2"/><path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" stroke="${inner}" stroke-width="1.2"/></g>`;
    }
    return `<svg viewBox="0 0 45 45" class="piece-svg">${innerBody}</svg>`;
  }

  // ============================================================================
  // AVALIAÇÃO LOCAL STOCKFISH LITE
  // ============================================================================
  const PIECE_VALS = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
  function evaluateStatic(chess) {
    if (chess.isCheckmate()) return chess.turn() === 'w' ? -99999 : 99999;
    const b = chess.board();
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (!p) continue;
        let v = PIECE_VALS[p.type] || 0;
        const centerBonus = (3.5 - Math.abs(3.5 - r)) * 6 + (3.5 - Math.abs(3.5 - c)) * 6;
        if (p.type !== 'k') v += centerBonus;
        score += p.color === 'w' ? v : -v;
      }
    }
    return score;
  }

  function analyzeLocal(fen) {
    const chess = new Chess(fen);
    const turn = chess.turn();
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) {
      return { scoreCp: 0, bestMoveSan: '-', bestMoveFrom: '', bestMoveTo: '' };
    }
    let bestMove = moves[0];
    let bestScore = turn === 'w' ? -Infinity : Infinity;
    for (const m of moves.slice(0, 16)) {
      const c1 = chess.clone();
      c1.move(m);
      const sc = evaluateStatic(c1);
      if ((turn === 'w' && sc > bestScore) || (turn === 'b' && sc < bestScore)) {
        bestScore = sc;
        bestMove = m;
      }
    }
    return {
      scoreCp: Math.max(-2000, Math.min(2000, Math.round(bestScore))),
      bestMoveSan: bestMove.san,
      bestMoveFrom: bestMove.from,
      bestMoveTo: bestMove.to,
    };
  }

  // ============================================================================
  // FUNÇÕES PEDAGÓGICAS DO TREINADOR INTELIGENTE DE ABERTURAS E FONTES
  // ============================================================================
  function generateProgressiveHint(step, level, formattedMove) {
    if (!step) {
      return {
        level: 0,
        badge: 'Missão Concluída!',
        text: '🎉 Parabéns! Você completou todos os lances desta sequência!',
        highlightSquare: null,
        solutionArrow: null,
      };
    }

    const pieceName = PIECE_NAMES_FRIENDLY[step.piece?.toLowerCase()] || 'Peça';
    const isCenterPawn =
      step.piece?.toLowerCase() === 'p' && ['d4', 'e4', 'd5', 'e5', 'c4', 'c5'].includes(step.to);
    const isMinorDev =
      ['n', 'b'].includes(step.piece?.toLowerCase()) && ['1', '8'].includes(step.from?.[1]);
    const isCastle = step.san?.startsWith('O-O');

    if (level === 1) {
      let question = 'O que esta peça está ameaçando ou qual peça pode melhorar de posição agora?';
      if (isCastle) {
        question = 'Como podemos proteger o nosso Rei no canto e ativar a Torre ao mesmo tempo?';
      } else if (step.captured) {
        question = 'Observe as peças adversárias: qual captura importante podemos fazer agora?';
      } else if (isCenterPawn) {
        question = 'Qual peão pode avançar para conquistar espaço no centro do tabuleiro?';
      } else if (isMinorDev) {
        question = 'Qual peça menor (Cavalo ou Bispo) ainda está dormindo na fileira inicial e quer entrar no jogo?';
      }
      return {
        level: 1,
        badge: 'Dica 1 de 3 • Pergunta',
        text: `🤔 ${question}`,
        highlightSquare: null,
        solutionArrow: null,
      };
    }

    if (level === 2) {
      return {
        level: 2,
        badge: 'Dica 2 de 3 • Peça e Casa',
        text: `💡 Olhe para o seu ${pieceName} na casa ${step.from.toUpperCase()} (destacada no tabuleiro)! Para onde ele pode ir?`,
        highlightSquare: step.from,
        solutionArrow: null,
      };
    }

    return {
      level: 3,
      badge: 'Dica 3 de 3 • Solução Explicada',
      text: `🌟 Descobriu um plano! Jogue ${formattedMove} (${pieceName} de ${step.from} para ${step.to}). ${
        step.annotation?.commentPt || 'Esse lance coloca sua peça em ótima atividade!'
      }`,
      highlightSquare: step.from,
      solutionArrow: { from: step.from, to: step.to, color: 'emerald' },
    };
  }

  function evaluateStudentMove({ userMove, targetStep, evalBeforeCp, evalAfterCp, formattedUserMove, formattedTargetMove }) {
    if (!targetStep) return null;
    if (userMove.from === targetStep.from && userMove.to === targetStep.to) {
      const pieceName = PIECE_NAMES_FRIENDLY[targetStep.piece?.toLowerCase()] || 'Peça';
      return {
        status: 'canonical',
        title: '🎉 Boa ideia! Descobriu um plano!',
        message:
          targetStep.annotation?.commentPt ||
          `Excelente! ${formattedTargetMove} leva o ${pieceName} para uma casa estratégica e segue o plano principal.`,
        tone: 'mint',
      };
    }

    const turn = targetStep.color;
    const diffCp =
      turn === 'w'
        ? (evalAfterCp ?? evalBeforeCp) - (evalBeforeCp ?? 0)
        : (evalBeforeCp ?? 0) - (evalAfterCp ?? evalBeforeCp);

    const developsOrCenter =
      ['n', 'b'].includes(userMove.piece?.toLowerCase()) ||
      (userMove.piece?.toLowerCase() === 'p' &&
        ['d4', 'e4', 'c4', 'd5', 'e5', 'c5', 'c6', 'e6', 'd6', 'g6'].includes(userMove.to)) ||
      userMove.san?.startsWith('O-O');

    if (diffCp >= -85 && developsOrCenter) {
      return {
        status: 'plausible',
        title: `👏 Boa ideia! ${formattedUserMove} é uma alternativa aceitável!`,
        message: `Esse lance é jogável e seguro! Porém, nesta missão estamos treinando a variante principal (${formattedTargetMove}). Tente fazer o lance da variante no tabuleiro!`,
        tone: 'sky',
      };
    }

    return {
      status: 'constructive_retry',
      title: '🌱 Tente outra vez! Veja uma dica se precisar',
      message: `O lance ${formattedUserMove} se afasta do plano desta posição ou deixa peças desprotegidas. Tente outro lance ou clique no botão "Ver Dica"!`,
      tone: 'coral',
    };
  }

  function extractBookCitation(book, chapter, game, activeStep) {
    if (!book) return null;
    const comm = activeStep?.annotation?.commentPt || game?.introPt || '';
    const sub = chapter?.subtitlePt || '';
    const m =
      comm.match(/p[áa]g(?:ina)?s?\.?\s*(\d+(?:\s*[–-]\s*\d+|\s*e\s*\d+)?)/i) ||
      sub.match(/p[áa]g(?:ina)?s?\.?\s*(\d+(?:\s*[–-]\s*\d+|\s*e\s*\d+)?)/i);
    return {
      bookTitle: book.titlePt.split(' (')[0],
      author: book.author,
      chapterLabel: `Cap. ${chapter?.number || 1}`,
      pageRef: m ? `Pág. ${m[1]}` : 'Posição Verificada da Obra',
    };
  }

  // ============================================================================
  // ESTADO DA APLICAÇÃO
  // ============================================================================
  const state = {
    // 4 Destinos Principais: 'learn' | 'library' | 'openings' | 'achievements'
    mainDestination: 'learn',

    // 2 Modos de Uso: 'learn' (Modo Aprender • Padrão) | 'explorer' (Modo Explorador • Opcional)
    experienceMode: 'learn',

    // Livros & Capítulos Isolados (Aba Lateral Esquerda)
    bookId: BOOKS[0]?.id || 'xadrez-basico-agostini',
    expandedBookIds: [BOOKS[0]?.id || 'xadrez-basico-agostini'],
    isolatedChapterId: null,
    gameId: BOOKS[0]?.chapters[0]?.games[0]?.id || '',
    showBookExtractorInfo: false,

    // Aberturas & Treinador Inteligente de Aberturas
    selectedOpeningCat: 'semi_open',
    selectedOpeningId: 'op-siciliana-najdorf',
    trainerModeActive: true, // true = Treinar Jogando; false = Estudar Passo a Passo
    trainerColorChoice: 'both', // 'w' | 'b' | 'both'

    // Tipo de estudo ativo no tabuleiro: 'book_game' | 'opening'
    currentStudyType: 'book_game',

    // Dicas Progressivas (0 = nenhuma, 1 = Pergunta, 2 = Peça/Casa, 3 = Solução)
    hintLevel: 0,
    lastFeedback: null, // { status, title, message, tone }

    // Controles do Tabuleiro e Mais Opções
    currentPly: 0,
    flipped: false,
    showMoreTools: false,
    notationMode: 'alg_pt', // 'alg_pt' | 'figurine' | 'desc_pt' | 'desc_es' | 'alg_en'
    boardTheme: 'lichess_wood',
    engineEnabled: false,
    searchQuery: '',

    // Interação no Tabuleiro
    selectedSquare: null,
    userArrows: [],
    userHighlights: [],
    rightClickStart: null,

    // Progresso, Estrelas e Fila de Revisão Inteligente
    starsCount: parseInt(localStorage.getItem('cm_stars_v3') || '12', 10),
    completedIds: JSON.parse(localStorage.getItem('cm_completed_v3') || '[]'),
    reviewQueue: JSON.parse(localStorage.getItem('cm_review_queue_v3') || '[]'),
  };

  function saveProgress() {
    try {
      localStorage.setItem('cm_stars_v3', String(state.starsCount));
      localStorage.setItem('cm_completed_v3', JSON.stringify(state.completedIds));
      localStorage.setItem('cm_review_queue_v3', JSON.stringify(state.reviewQueue));
    } catch {}
  }

  function addPositionToReviewQueue(studyType, studyId, ply, title, moveSan) {
    const key = `${studyType}_${studyId}_${ply}`;
    if (!state.reviewQueue.some((r) => r.key === key)) {
      state.reviewQueue.unshift({
        key,
        studyType,
        studyId,
        ply,
        title,
        moveSan,
      });
      if (state.reviewQueue.length > 20) state.reviewQueue.pop();
      saveProgress();
    }
  }

  function getActiveBook() {
    return BOOKS.find((b) => b.id === state.bookId) || BOOKS[0];
  }
  function getActiveChapter() {
    const b = getActiveBook();
    if (state.isolatedChapterId) {
      const found = b.chapters.find((c) => c.id === state.isolatedChapterId);
      if (found) return found;
    }
    for (const ch of b.chapters) {
      if (ch.games.some((g) => g.id === state.gameId)) return ch;
    }
    return b.chapters[0];
  }
  function getActiveGame() {
    const b = getActiveBook();
    for (const ch of b.chapters) {
      const gm = ch.games.find((g) => g.id === state.gameId);
      if (gm) return gm;
    }
    return b.chapters[0].games[0];
  }
  function getActiveOpening() {
    return OPENINGS.find((o) => o.id === state.selectedOpeningId) || OPENINGS[0];
  }

  let cachedKey = null;
  let cachedSteps = [];
  let cachedStartFen = '';

  function getCurrentSteps() {
    const key =
      state.currentStudyType === 'opening'
        ? `op_${state.selectedOpeningId}`
        : `gm_${state.gameId}`;
    if (cachedKey === key) return { initialFen: cachedStartFen, steps: cachedSteps };

    let rawMoves = [];
    let annotations = {};
    let startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    if (state.currentStudyType === 'opening') {
      const op = getActiveOpening();
      rawMoves = op.movesSan || [];
      annotations = op.annotations || {};
      startFen = op.initialFen || startFen;
    } else {
      const gm = getActiveGame();
      rawMoves = gm.movesSan || [];
      annotations = gm.annotations || {};
      startFen = gm.initialFen || startFen;
    }

    const chess = new Chess(startFen);
    const steps = [];
    rawMoves.forEach((san, idx) => {
      const ply = idx + 1;
      const fenBefore = chess.fen();
      const res = chess.move(san);
      if (!res) return;
      const fenAfter = chess.fen();
      const ann = annotations[ply];
      const badge = ann?.badge || '';
      const sanWithBadge = badge && !res.san.endsWith(badge) ? `${res.san}${badge}` : res.san;
      const payload = {
        san: sanWithBadge,
        piece: res.piece,
        from: res.from,
        to: res.to,
        color: res.color,
        captured: res.captured,
        promotion: res.promotion,
      };
      steps.push({
        ply,
        moveNumber: Math.floor(idx / 2) + 1,
        color: res.color,
        san: sanWithBadge,
        from: res.from,
        to: res.to,
        piece: res.piece,
        captured: res.captured,
        promotion: res.promotion,
        fenBefore,
        fenAfter,
        inCheck: chess.inCheck(),
        isCheckmate: chess.isCheckmate(),
        descriptivePt: moveToDescriptive(payload, 'pt'),
        descriptiveEs: moveToDescriptive(payload, 'es'),
        annotation: ann,
      });
    });

    cachedKey = key;
    cachedSteps = steps;
    cachedStartFen = startFen;
    return { initialFen: startFen, steps };
  }

  // Quando o Treinador de Aberturas está configurado para treinar apenas Brancas ou apenas Pretas,
  // avança automaticamente o lance do oponente se for a vez dele!
  function maybeAutoPlayOpponentInTrainer() {
    if (!state.trainerModeActive) return;
    const { steps } = getCurrentSteps();
    if (state.currentPly >= steps.length) return;
    const nextStep = steps[state.currentPly];
    if (!nextStep) return;

    const tc = state.trainerColorChoice;
    if (tc === 'both') return;
    if (nextStep.color !== tc) {
      setTimeout(() => {
        if (state.currentPly < steps.length && steps[state.currentPly]?.color !== state.trainerColorChoice) {
          state.currentPly++;
          audio.playMove();
          render();
        }
      }, 380);
    }
  }

  function selectBookGame(bookId, chapterId, gameId, startPly = 0) {
    state.currentStudyType = 'book_game';
    state.bookId = bookId;
    if (chapterId) state.isolatedChapterId = chapterId;
    state.gameId = gameId;
    state.currentPly = startPly;
    state.hintLevel = 0;
    state.lastFeedback = null;
    state.selectedSquare = null;
    state.userArrows = [];
    state.userHighlights = [];
    const gm = getActiveGame();
    state.flipped = gm.heroColor === 'b';
    render();
  }

  function selectOpeningStudy(openingId, startPly = 0) {
    state.currentStudyType = 'opening';
    state.selectedOpeningId = openingId;
    const op = getActiveOpening();
    state.selectedOpeningCat = op.category;
    state.currentPly = startPly;
    state.hintLevel = 0;
    state.lastFeedback = null;
    state.selectedSquare = null;
    state.userArrows = [];
    state.userHighlights = [];
    state.trainerColorChoice = op.heroColor || 'both';
    state.flipped = op.heroColor === 'b';
    render();
    maybeAutoPlayOpponentInTrainer();
  }

  function goToPly(ply) {
    const { steps } = getCurrentSteps();
    const clamped = Math.max(0, Math.min(steps.length, ply));
    state.currentPly = clamped;
    state.hintLevel = 0;
    state.lastFeedback = null;
    state.selectedSquare = null;
    if (clamped > 0) {
      const st = steps[clamped - 1];
      if (st.inCheck || st.isCheckmate) audio.playCheck();
      else if (st.captured) audio.playCapture();
      else audio.playMove();
    }
    if (clamped === steps.length && steps.length > 0) {
      const currentId = state.currentStudyType === 'opening' ? state.selectedOpeningId : state.gameId;
      if (!state.completedIds.includes(currentId)) {
        state.completedIds.push(currentId);
        state.starsCount += 3;
        audio.playSuccess();
        saveProgress();
      }
    }
    render();
  }

  // Trata o lance executado pelo aluno no tabuleiro
  function handleUserBoardMove(from, to) {
    const { initialFen, steps } = getCurrentSteps();
    if (state.currentPly >= steps.length) return false;

    const activeStep = state.currentPly > 0 ? steps[state.currentPly - 1] : null;
    const currentFen = activeStep ? activeStep.fenAfter : initialFen;
    const targetStep = steps[state.currentPly];

    const chess = new Chess(currentFen);
    const evalBefore = evaluateStatic(chess);
    const moveRes = chess.move({ from, to, promotion: 'q' });
    if (!moveRes) return false;
    const evalAfter = evaluateStatic(chess);

    const formattedUserMove = formatMoveByMode(
      {
        san: moveRes.san,
        piece: moveRes.piece,
        from: moveRes.from,
        to: moveRes.to,
        color: moveRes.color,
        captured: moveRes.captured,
      },
      state.notationMode
    );
    const formattedTargetMove = formatMoveByMode(targetStep, state.notationMode);

    const evaluation = evaluateStudentMove({
      userMove: moveRes,
      targetStep,
      evalBeforeCp: evalBefore,
      evalAfterCp: evalAfter,
      formattedUserMove,
      formattedTargetMove,
    });

    state.lastFeedback = evaluation;

    if (evaluation.status === 'canonical') {
      audio.playSuccess();
      state.currentPly = targetStep.ply;
      state.hintLevel = 0;
      state.starsCount += 1;
      // Remove da fila de revisão se estava lá
      const revKey = `${state.currentStudyType}_${state.currentStudyType === 'opening' ? state.selectedOpeningId : state.gameId}_${targetStep.ply - 1}`;
      state.reviewQueue = state.reviewQueue.filter((r) => r.key !== revKey);

      if (state.currentPly >= steps.length) {
        const currentId = state.currentStudyType === 'opening' ? state.selectedOpeningId : state.gameId;
        if (!state.completedIds.includes(currentId)) {
          state.completedIds.push(currentId);
          state.starsCount += 3;
        }
      }
      saveProgress();
      render();
      maybeAutoPlayOpponentInTrainer();
      return true;
    } else {
      audio.playSoftAlert();
      const title =
        state.currentStudyType === 'opening'
          ? getActiveOpening().namePt
          : getActiveGame().titlePt;
      const studyId =
        state.currentStudyType === 'opening' ? state.selectedOpeningId : state.gameId;
      addPositionToReviewQueue(
        state.currentStudyType,
        studyId,
        state.currentPly,
        title,
        formattedTargetMove
      );
      render();
      return false;
    }
  }

  function sqToCoords(sq, flipped) {
    const fIdx = FILES.indexOf(sq[0]);
    const rIdx = RANKS.indexOf(sq[1]);
    return {
      col: flipped ? 7 - fIdx : fIdx,
      row: flipped ? 7 - rIdx : rIdx,
    };
  }

  // ============================================================================
  // RENDERIZAÇÃO PRINCIPAL DA INTERFACE
  // ============================================================================
  function render() {
    const root = document.getElementById('root');
    if (!root) return;

    const book = getActiveBook();
    const chapter = getActiveChapter();
    const game = getActiveGame();
    const opening = getActiveOpening();
    const isOpening = state.currentStudyType === 'opening';
    const isExplorer = state.experienceMode === 'explorer';

    const { initialFen, steps } = getCurrentSteps();
    const activeStep = state.currentPly > 0 ? steps[state.currentPly - 1] : null;
    const nextStep = state.currentPly < steps.length ? steps[state.currentPly] : null;
    const displayedFen = activeStep ? activeStep.fenAfter : initialFen;

    const chess = new Chess(displayedFen);
    const boardMatrix = chess.board();
    const turn = chess.turn();
    const theme = BOARD_THEMES[state.boardTheme] || BOARD_THEMES.lichess_wood;
    const coords = getBoardCoordinates(state.flipped, state.notationMode);

    const legalFromSelected = state.selectedSquare
      ? chess.moves({ square: state.selectedSquare, verbose: true })
      : [];

    const engineEval =
      state.engineEnabled || isExplorer ? analyzeLocal(displayedFen) : null;

    // Dica Progressiva Ativa
    const progressiveHint =
      state.hintLevel > 0 && nextStep
        ? generateProgressiveHint(
            nextStep,
            state.hintLevel,
            formatMoveByMode(nextStep, state.notationMode)
          )
        : null;

    const lastMove = activeStep ? { from: activeStep.from, to: activeStep.to } : null;
    const kingCheckSq = chess.inCheck() ? chess.findKing(turn)?.sq : null;

    const displayRows = state.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const displayCols = state.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

    const bookHighlights = activeStep?.annotation?.highlights || [];
    const hintHighlights = progressiveHint?.highlightSquare
      ? [{ square: progressiveHint.highlightSquare, color: 'amber' }]
      : [];
    const allHighlights = [...bookHighlights, ...hintHighlights, ...state.userHighlights];

    const bookArrows = activeStep?.annotation?.arrows || [];
    const hintArrows = progressiveHint?.solutionArrow ? [progressiveHint.solutionArrow] : [];
    const engineArrows =
      (state.engineEnabled || isExplorer) && engineEval?.bestMoveFrom && engineEval?.bestMoveTo
        ? [{ from: engineEval.bestMoveFrom, to: engineEval.bestMoveTo, color: 'sky' }]
        : [];
    const allArrows = [...bookArrows, ...hintArrows, ...engineArrows, ...state.userArrows];

    // 1. Montagem das 64 casas do Tabuleiro
    let squaresHtml = '';
    displayRows.forEach((rIdx, vRow) => {
      displayCols.forEach((cIdx, vCol) => {
        const sq = FILES[cIdx] + RANKS[rIdx];
        const isLight = (rIdx + cIdx) % 2 === 0;
        const piece = boardMatrix[rIdx][cIdx];
        const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
        const isSel = state.selectedSquare === sq;
        const legalT = legalFromSelected.find((m) => m.to === sq);
        const hl = allHighlights.find((h) => h.square === sq);
        const bg = isLast
          ? isLight
            ? theme.lastLight
            : theme.lastDark
          : isLight
          ? theme.light
          : theme.dark;
        const coordColor = isLight ? theme.dark : theme.light;
        const badge =
          lastMove?.to === sq && activeStep?.annotation?.badge
            ? activeStep.annotation.badge
            : null;

        squaresHtml += `
          <div class="board-sq ${piece && piece.color === turn ? 'clickable-piece' : ''}" data-sq="${sq}" style="background:${bg}">
            ${isSel ? '<div class="sq-selected"></div>' : ''}
            ${hl ? `<div class="sq-hl sq-hl-${hl.color}"></div>` : ''}
            ${kingCheckSq === sq ? '<div class="sq-check"></div>' : ''}
            ${vCol === 0 ? `<span class="coord-rank" style="color:${coordColor}">${coords.ranks[vRow]}</span>` : ''}
            ${vRow === 7 ? `<span class="coord-file" style="color:${coordColor}">${coords.files[vCol]}</span>` : ''}
            ${piece ? `<div class="piece-wrap">${getPieceSvg(piece.color, piece.type)}</div>` : ''}
            ${
              legalT
                ? piece || legalT.flags === 'e'
                  ? '<div class="legal-ring"></div>'
                  : '<div class="legal-dot"></div>'
                : ''
            }
            ${badge ? `<div class="move-badge">${badge}</div>` : ''}
          </div>
        `;
      });
    });

    // 2. Setas Explicativas SVG
    let arrowsSvg = '';
    if (allArrows.length > 0) {
      const lines = allArrows
        .map((a) => {
          const s = sqToCoords(a.from, state.flipped);
          const e = sqToCoords(a.to, state.flipped);
          const x1 = s.col * 100 + 50,
            y1 = s.row * 100 + 50;
          const x2 = e.col * 100 + 50,
            y2 = e.row * 100 + 50;
          const dx = x2 - x1,
            dy = y2 - y1,
            len = Math.hypot(dx, dy) || 1;
          const tx = x2 - (dx / len) * 22,
            ty = y2 - (dy / len) * 22;
          const colKey = a.color || 'emerald';
          const strokeMap = {
            emerald: 'rgba(22, 134, 94, 0.88)',
            amber: 'rgba(245, 158, 11, 0.9)',
            sky: 'rgba(21, 69, 125, 0.85)',
            rose: 'rgba(225, 29, 72, 0.85)',
          };
          return `<line x1="${x1}" y1="${y1}" x2="${tx}" y2="${ty}" stroke="${strokeMap[colKey]}" stroke-width="18" stroke-linecap="round" marker-end="url(#arr-${colKey})"/>`;
        })
        .join('');
      arrowsSvg = `
        <svg viewBox="0 0 800 800" class="arrows-svg">
          <defs>
            <marker id="arr-emerald" markerWidth="4.2" markerHeight="4.2" refX="2.5" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(22, 134, 94, 0.95)"/></marker>
            <marker id="arr-amber" markerWidth="4.2" markerHeight="4.2" refX="2.5" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(245, 158, 11, 0.95)"/></marker>
            <marker id="arr-sky" markerWidth="4.2" markerHeight="4.2" refX="2.5" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(21, 69, 125, 0.95)"/></marker>
            <marker id="arr-rose" markerWidth="4.2" markerHeight="4.2" refX="2.5" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(225, 29, 72, 0.95)"/></marker>
          </defs>
          ${lines}
        </svg>
      `;
    }

    // ==========================================================================
    // 3. CONTEÚDO DA BARRA LATERAL ESQUERDA (DE ACORDO COM O DESTINO ATIVO)
    // ==========================================================================
    let leftSidebarHtml = '';

    if (state.mainDestination === 'learn') {
      // DESTINO 1: APRENDER (AVENTURA DE APRENDIZAGEM & MISSÕES PASSO A PASSO)
      const allMissions = [];
      BOOKS.forEach((bk) => {
        bk.chapters.forEach((ch) => {
          ch.games.forEach((gm) => {
            allMissions.push({
              type: 'book_game',
              bookId: bk.id,
              chapterId: ch.id,
              id: gm.id,
              title: gm.titlePt,
              subtitle: `${bk.titlePt.split(' (')[0]} • ${gm.white} vs ${gm.black}`,
              tag: gm.openingNamePt || 'Lição Clássica',
            });
          });
        });
      });

      const q = state.searchQuery.toLowerCase().trim();
      const filteredMissions = allMissions.filter(
        (m) =>
          !q ||
          m.title.toLowerCase().includes(q) ||
          m.subtitle.toLowerCase().includes(q) ||
          m.tag.toLowerCase().includes(q)
      );

      leftSidebarHtml = `
        <div class="guide-header">
          <div class="guide-title">🌟 Missões de Aprendizagem</div>
          <span class="chap-pill-count">${state.completedIds.length} concluídas</span>
        </div>

        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="sidebar-search" class="search-input" placeholder="Buscar missão, mestre ou tema..." value="${state.searchQuery}" />
        </div>

        <div class="side-scroll">
          ${
            state.reviewQueue.length > 0
              ? `<div class="tone-card tone-yellow" style="margin-bottom:4px;">
                  <div class="source-eyebrow">
                    <span>🔄 Revisão Inteligente (${state.reviewQueue.length})</span>
                  </div>
                  <p style="font-size:11.5px;font-weight:700;">Você tem ${state.reviewQueue.length} lance(s) que pediram dica para revisar e ganhar estrelas!</p>
                  <button class="btn-action btn-primary-green" id="btn-practice-review" style="padding:6px 10px;font-size:11.5px;justify-content:center;margin-top:4px;">
                    Praticar Posição de Revisão ➔
                  </button>
                 </div>`
              : ''
          }

          ${filteredMissions
            .map((m, idx) => {
              const isDone = state.completedIds.includes(m.id);
              const isCurrent = state.currentStudyType === 'book_game' && state.gameId === m.id;
              return `
                <button class="mission-card ${isCurrent ? 'active' : ''} ${isDone ? 'completed' : ''}" data-mission-book="${m.bookId}" data-mission-chap="${m.chapterId}" data-mission-game="${m.id}">
                  <div style="min-width:0;flex:1;">
                    <div class="chap-eyebrow">Missão ${idx + 1}</div>
                    <div class="mc-title">${m.title}</div>
                    <div class="mc-sub">${m.subtitle}</div>
                    <span class="mc-tag">${m.tag}</span>
                  </div>
                  ${isDone ? '<span class="done-star" title="Missão Concluída!">★</span>' : '<span style="font-size:16px;color:#16865E;font-weight:900;">➔</span>'}
                </button>
              `;
            })
            .join('')}
        </div>
      `;
    } else if (state.mainDestination === 'library') {
      // DESTINO 2: BIBLIOTECA (TODOS OS LIVROS NO ACORDEÃO ESQUERDO + CAPÍTULOS ISOLADOS + CONEXÃO LIVRO-POSIÇÃO)
      if (state.isolatedChapterId) {
        const isoChap = getActiveChapter();
        leftSidebarHtml = `
          <div class="isolated-box">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <button class="back-btn" id="btn-back-chapters">← Todos os Livros e Capítulos</button>
            </div>

            <div class="isolated-hero">
              <div class="chap-eyebrow">${book.titlePt.split(' (')[0]} • Capítulo ${isoChap.number} Isolado</div>
              <h3>${isoChap.titlePt}</h3>
              <p>${isoChap.subtitlePt}</p>
            </div>

            <div class="side-scroll">
              ${isoChap.games
                .map((gm) => {
                  const isDone = state.completedIds.includes(gm.id);
                  const isAct = state.currentStudyType === 'book_game' && gm.id === game.id;
                  return `
                    <button class="mission-card ${isAct ? 'active' : ''} ${isDone ? 'completed' : ''}" data-sel-book="${book.id}" data-sel-chap="${isoChap.id}" data-sel-game="${gm.id}">
                      <div style="min-width:0;flex:1;">
                        <div class="mc-title">${gm.titlePt}</div>
                        <div class="mc-sub">${gm.white} vs. ${gm.black} (${gm.year})</div>
                        <span class="mc-tag">${gm.eco || 'Clássico'} • ${gm.openingNamePt}</span>
                      </div>
                      ${isDone ? '<span class="done-star">✓</span>' : ''}
                    </button>
                  `;
                })
                .join('')}
            </div>
          </div>
        `;
      } else {
        const q = state.searchQuery.toLowerCase().trim();
        const filteredBooks = BOOKS.filter(
          (bk) =>
            !q ||
            bk.titlePt.toLowerCase().includes(q) ||
            bk.author.toLowerCase().includes(q) ||
            bk.chapters.some(
              (c) =>
                c.titlePt.toLowerCase().includes(q) ||
                c.games.some((g) => g.titlePt.toLowerCase().includes(q))
            )
        );

        leftSidebarHtml = `
          <div class="guide-header">
            <div class="guide-title">📚 Biblioteca de Livros</div>
            <button class="mini-tool-btn ${state.showBookExtractorInfo ? 'active' : ''}" id="btn-toggle-extractor" title="Ver como os livros EPUB/PDF viram estudos validados">
              ${state.showBookExtractorInfo ? 'Ver Livros' : '🔎 Fontes & OCR'}
            </button>
          </div>

          ${
            state.showBookExtractorInfo
              ? `<div class="side-scroll">
                  <div class="tone-card tone-mint">
                    <div class="source-eyebrow"><span>✓ Pipeline de Validação de Livros</span></div>
                    <p style="font-size:12px;line-height:1.45;">
                      Os livros da pasta <strong>Books/</strong> passam por 6 etapas: <strong>1. Importar</strong> (EPUB/PDF) → <strong>2. Identificar</strong> → <strong>3. Validar legalidade</strong> → <strong>4. Relacionar abertura</strong> → <strong>5. Ensinar</strong> → <strong>6. Citar fonte</strong> (Livro, Capítulo e Página).
                    </p>
                  </div>
                  ${BOOKS.map(
                    (b) => `
                    <div class="tone-card tone-cream">
                      <div class="source-eyebrow"><span>📗 ${b.titlePt.split(' (')[0]}</span><span>✓ Verificado</span></div>
                      <div class="source-meta">${b.author} (${b.publicationYear})</div>
                      <p style="font-size:11.5px;color:var(--text-secondary);">Arquivo fonte: <code>${b.sourceFileName}</code>. Todas as ${b.chapters.reduce((acc, c) => acc + c.games.length, 0)} partidas e posições foram conferidas lance a lance.</p>
                    </div>`
                  ).join('')}
                 </div>`
              : `
                <div class="search-wrap">
                  <span class="search-icon">🔍</span>
                  <input type="text" id="sidebar-search" class="search-input" placeholder="Buscar livro, capítulo ou autor..." value="${state.searchQuery}" />
                </div>

                <div class="side-scroll">
                  ${filteredBooks
                    .map((bk) => {
                      const isExp = state.expandedBookIds.includes(bk.id);
                      const isAct = bk.id === book.id;
                      return `
                        <div class="book-accordion ${isAct ? 'active' : ''}">
                          <div class="book-acc-header" data-toggle-book="${bk.id}">
                            <div class="book-acc-left">
                              <div class="book-badge-icon">📖</div>
                              <div style="min-width:0;flex:1;">
                                <div class="book-acc-title">${bk.titlePt.split(' (')[0]}</div>
                                <div class="book-acc-sub">${bk.author} • ${bk.publicationYear}</div>
                              </div>
                            </div>
                            <span class="chap-pill-count">${bk.chapters.length} Cap. ${isExp ? '▲' : '▼'}</span>
                          </div>

                          ${
                            isExp
                              ? `<div class="chapters-drawer">
                                  ${bk.chapters
                                    .map(
                                      (ch) => `
                                    <button class="chapter-btn ${ch.id === chapter.id && isAct ? 'active' : ''}" data-isolate-chap="${ch.id}" data-parent-book="${bk.id}">
                                      <div style="min-width:0;flex:1;">
                                        <div class="chap-eyebrow">Capítulo ${ch.number} (${ch.games.length} lições)</div>
                                        <div class="chap-name">${ch.titlePt}</div>
                                      </div>
                                      <span class="isolate-pill">Abrir ➔</span>
                                    </button>`
                                    )
                                    .join('')}
                                 </div>`
                              : ''
                          }
                        </div>
                      `;
                    })
                    .join('')}
                </div>
              `
          }
        `;
      }
    } else if (state.mainDestination === 'openings') {
      // DESTINO 3: TREINADOR INTELIGENTE DE ABERTURAS (MENU DE ABERTURAS E DEFESAS)
      const q = state.searchQuery.toLowerCase().trim();
      leftSidebarHtml = `
        <div class="guide-header">
          <div class="guide-title">♟️ Escolha uma Abertura ou Defesa</div>
          <span class="chap-pill-count">${OPENINGS.length} estudos</span>
        </div>

        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="sidebar-search" class="search-input" placeholder="Ex: Siciliana, Italiana, Caro-Kann, Índia..." value="${state.searchQuery}" />
        </div>

        <div class="side-scroll">
          ${OPENING_CATS.map((cat) => {
            const catOps = OPENINGS.filter(
              (o) =>
                o.category === cat.id &&
                (!q ||
                  o.namePt.toLowerCase().includes(q) ||
                  o.eco.toLowerCase().includes(q) ||
                  o.tag.toLowerCase().includes(q))
            );
            if (catOps.length === 0) return '';
            const isOpen = state.selectedOpeningCat === cat.id || q.length > 0;
            return `
              <div class="book-accordion ${isOpen ? 'active' : ''}">
                <div class="book-acc-header" data-toggle-cat="${cat.id}">
                  <div class="book-acc-left">
                    <div class="book-badge-icon">${cat.icon}</div>
                    <div style="min-width:0;flex:1;">
                      <div class="book-acc-title">${cat.label}</div>
                      <div class="book-acc-sub">${cat.subtitle}</div>
                    </div>
                  </div>
                  <span class="chap-pill-count">${catOps.length} ${isOpen ? '▲' : '▼'}</span>
                </div>

                ${
                  isOpen
                    ? `<div class="chapters-drawer">
                        ${catOps
                          .map((op) => {
                            const isAct = isOpening && op.id === opening.id;
                            const isDone = state.completedIds.includes(op.id);
                            return `
                              <button class="chapter-btn ${isAct ? 'active' : ''}" data-sel-opening="${op.id}">
                                <div style="min-width:0;flex:1;">
                                  <div class="chap-eyebrow">${op.eco} • ${op.heroColor === 'w' ? 'Brancas' : 'Defesa das Pretas'}</div>
                                  <div class="chap-name">${op.namePt}</div>
                                </div>
                                ${isDone ? '<span class="done-star">★</span>' : '<span class="isolate-pill">Treinar</span>'}
                              </button>
                            `;
                          })
                          .join('')}
                       </div>`
                    : ''
                }
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      // DESTINO 4: CONQUISTAS & REVISÃO DE ERROS
      leftSidebarHtml = `
        <div class="guide-header">
          <div class="guide-title">🏆 Suas Conquistas & Jornada</div>
        </div>

        <div class="side-scroll">
          <div class="tone-card tone-yellow">
            <div class="source-eyebrow"><span>⭐ Estrelas de Sabedoria</span></div>
            <div style="font-size:26px;font-weight:900;">${state.starsCount} Estrelas</div>
            <p style="font-size:12px;">Você ganha estrelas a cada lance descoberto e a cada missão ou abertura concluída!</p>
          </div>

          <div class="tone-card tone-mint">
            <div class="source-eyebrow"><span>✓ Missões & Aberturas Concluídas</span></div>
            <div style="font-size:20px;font-weight:900;">${state.completedIds.length} Estudos Dominados</div>
            <p style="font-size:12px;">Continue explorando os livros clássicos e treinando aberturas com as duas cores.</p>
          </div>

          <div class="tone-card tone-cream">
            <div class="source-eyebrow"><span>🔄 Fila de Revisão (${state.reviewQueue.length})</span></div>
            ${
              state.reviewQueue.length === 0
                ? `<p style="font-size:12px;color:var(--text-secondary);">Nenhuma posição pendente! Quando você pedir uma dica ou errar um lance, ele aparecerá aqui para você revisar depois.</p>`
                : state.reviewQueue
                    .map(
                      (item, idx) => `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#FFFFFF;border-radius:12px;border:1px solid var(--border-soft);margin-top:4px;">
                      <div style="min-width:0;flex:1;">
                        <div style="font-size:12px;font-weight:800;">${item.title}</div>
                        <div style="font-size:11px;color:var(--text-secondary);">Lance ${Math.floor(item.ply / 2) + 1} • Alvo: ${item.moveSan}</div>
                      </div>
                      <button class="isolate-pill" style="border:none;cursor:pointer;" data-review-idx="${idx}">Revisar ➔</button>
                    </div>`
                    )
                    .join('')
            }
          </div>

          <div style="display:flex;gap:8px;margin-top:auto;padding-top:8px;">
            <button class="btn-action" id="btn-export-json" style="flex:1;justify-content:center;font-size:11.5px;">⬇ Exportar Progresso</button>
          </div>
        </div>
      `;
    }

    // ==========================================================================
    // 4. PAINEL DIREITO: GUIA DA LIÇÃO, TREINADOR DE ABERTURAS E 3 FONTES
    // ==========================================================================
    const formattedActiveMove = activeStep
      ? `${activeStep.moveNumber}${activeStep.color === 'w' ? '.' : '...'} ${formatMoveByMode(
          activeStep,
          state.notationMode
        )}`
      : 'Posição Inicial';

    const citation = !isOpening ? extractBookCitation(book, chapter, game, activeStep) : null;

    // Monta a explicação "DO TUTOR" (Linguagem simples, acolhedora e curta)
    let tutorExplanation = '';
    if (nextStep && state.trainerModeActive) {
      const nextPiece = PIECE_NAMES_FRIENDLY[nextStep.piece?.toLowerCase()] || 'peça';
      tutorExplanation = `É a vez das ${
        nextStep.color === 'w' ? 'Brancas' : 'Pretas'
      }! Pergunte-se: qual ${nextPiece.toLowerCase()} pode ajudar a controlar o centro ou melhorar a segurança do time? Faça o lance no tabuleiro ou clique em "Ver Dica"!`;
    } else if (activeStep) {
      const movedPiece = PIECE_NAMES_FRIENDLY[activeStep.piece?.toLowerCase()] || 'Peça';
      tutorExplanation = `Com o lance ${formattedActiveMove}, o ${movedPiece} trabalha em equipe! Observe como as casas destacadas e as setas mostram o plano da posição.`;
    } else {
      tutorExplanation = isOpening
        ? `Bem-vindo ao Treinador da ${opening.namePt}! Escolha sua cor abaixo e descubra os melhores lances jogando no tabuleiro.`
        : `Vamos começar esta aventura! Clique em "Próximo" ou jogue diretamente no tabuleiro para descobrir os planos do grande mestre.`;
    }

    // Planilha para o Modo Explorador
    let movesheetHtml = '';
    if (isExplorer) {
      let rows = '';
      for (let i = 0; i < steps.length; i += 2) {
        const w = steps[i];
        const b = steps[i + 1];
        const mNum = Math.floor(i / 2) + 1;
        rows += `
          <div class="move-row">
            <span class="move-num">${mNum}.</span>
            <button class="ply-btn ${state.currentPly === w.ply ? 'active' : ''}" data-ply="${w.ply}">
              <span>${formatMoveByMode(w, state.notationMode)}</span>
              ${w.annotation ? '<span>●</span>' : ''}
            </button>
            ${
              b
                ? `<button class="ply-btn ${state.currentPly === b.ply ? 'active' : ''}" data-ply="${b.ply}">
                    <span>${formatMoveByMode(b, state.notationMode)}</span>
                    ${b.annotation ? '<span>●</span>' : ''}
                   </button>`
                : '<span></span>'
            }
          </div>
        `;
      }
      movesheetHtml = `
        <div style="display:flex;flex-direction:column;gap:6px;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:11.5px;font-weight:800;color:var(--text-secondary);">📋 PLANILHA COMPLETA (${state.notationMode.toUpperCase()})</span>
            ${
              activeStep
                ? `<span style="font-size:11px;font-weight:700;color:var(--green-primary);">Figurino: ${sanToFigurine(activeStep.san)} | Descritiva: ${activeStep.descriptivePt}</span>`
                : ''
            }
          </div>
          <div class="movesheet-table">${rows}</div>
        </div>
      `;
    }

    let rightGuideHtml = `
      <div class="guide-header">
        <div class="guide-title">
          ${isOpening ? '🎯 Treinador Inteligente de Aberturas' : '🧭 Guia da Lição Passo a Passo'}
        </div>
        <span class="chap-pill-count">Etapa ${state.currentPly}/${steps.length}</span>
      </div>

      <div class="side-scroll">
        <!-- CONFIGURAÇÃO DO TREINADOR DE ABERTURAS (ESCOLHER COR E MODO) -->
        ${
          isOpening
            ? `<div class="trainer-setup-bar">
                <button class="color-choice-btn ${state.trainerColorChoice === 'w' ? 'active' : ''}" data-train-color="w">⚪ Brancas</button>
                <button class="color-choice-btn ${state.trainerColorChoice === 'b' ? 'active' : ''}" data-train-color="b">⚫ Pretas</button>
                <button class="color-choice-btn ${state.trainerColorChoice === 'both' ? 'active' : ''}" data-train-color="both">☯️ Ambas</button>
               </div>`
            : ''
        }

        <!-- FEEDBACK CONSTRUTIVO IMEDIATO APÓS LANCE DO ALUNO -->
        ${
          state.lastFeedback
            ? `<div class="tone-card tone-${state.lastFeedback.tone}">
                <div class="source-eyebrow">
                  <span>${state.lastFeedback.title}</span>
                </div>
                <div class="source-body">${state.lastFeedback.message}</div>
               </div>`
            : ''
        }

        <!-- DICA PROGRESSIVA (1: PERGUNTA -> 2: PEÇA/CASA -> 3: SOLUÇÃO) -->
        ${
          progressiveHint
            ? `<div class="tone-card tone-yellow">
                <div class="source-eyebrow">
                  <span>💡 ${progressiveHint.badge}</span>
                </div>
                <div class="source-body">${progressiveHint.text}</div>
               </div>`
            : ''
        }

        <!-- FONTE 1: DO TUTOR (EXPLICAÇÃO PEDAGÓGICA ACOLHEDORA) -->
        <div class="tone-card tone-yellow">
          <div class="source-eyebrow">
            <span>🦉 DO TUTOR • Explicação Pedagógica</span>
            <span>Nível Amigável</span>
          </div>
          <div class="source-body">${tutorExplanation}</div>
        </div>

        <!-- FONTE 2: DO LIVRO / TEORIA (COM RASTREABILIDADE DE AUTOR, CAPÍTULO E PÁGINA) -->
        <div class="tone-card tone-mint">
          <div class="source-eyebrow">
            <span>📗 ${isOpening ? `DA TEORIA & LIVRO (${opening.eco})` : `DO LIVRO • ${citation.bookTitle}`}</span>
            <span>✓ Verificado</span>
          </div>
          <div class="source-meta">
            ${
              isOpening
                ? `${opening.namePt} • ${opening.badgeText}`
                : `${citation.author} • ${citation.chapterLabel} (${citation.pageRef})`
            }
          </div>
          <div class="source-body">
            ${
              activeStep?.annotation?.commentPt
                ? activeStep.annotation.commentPt
                : isOpening
                ? opening.introPt
                : game.introPt
            }
          </div>
          ${
            isOpening && opening.relatedBookGameId
              ? `<button class="btn-action" style="margin-top:6px;padding:6px 10px;font-size:11.5px;justify-content:center;" data-jump-game="${opening.relatedBookGameId}">
                  📖 Ver Partida Clássica deste Plano no Livro ➔
                 </button>`
              : ''
          }
        </div>

        <!-- ENTENDER O PLANO (QUANDO EM ABERTURAS OU RESUMO DA LIÇÃO) -->
        ${
          isOpening
            ? `<div class="tone-card tone-cream">
                <div class="source-eyebrow"><span>🗺️ Entender o Plano da Abertura</span></div>
                <div style="font-size:12px;line-height:1.45;">
                  <p><strong>⚪ Plano das Brancas:</strong> ${opening.plansWhite[0]}</p>
                  <p style="margin-top:4px;"><strong>⚫ Plano das Pretas:</strong> ${opening.plansBlack[0]}</p>
                  <p style="margin-top:4px;"><strong>♙ Estrutura de Peões:</strong> ${opening.pawnStructure}</p>
                  <p style="margin-top:4px;color:var(--coral-text);"><strong>⚠️ Atenção:</strong> ${opening.trapsPt}</p>
                </div>
               </div>`
            : `<div class="tone-card tone-cream">
                <div class="source-eyebrow"><span>🌟 O que você aprende nesta lição</span></div>
                <div style="font-size:12px;line-height:1.45;">
                  ${(game.keyTakeawaysPt || []).map((t) => `<p style="margin-top:3px;">• ${t}</p>`).join('')}
                </div>
               </div>`
        }

        <!-- FONTE 3: DO STOCKFISH (SEPARADO CLARAMENTE COMO ANÁLISE DO MOTOR) -->
        ${
          state.engineEnabled || isExplorer
            ? `<div class="tone-card tone-sky">
                <div class="source-eyebrow">
                  <span>🤖 DO STOCKFISH • Análise do Motor</span>
                  <span>Avaliação: ${((engineEval?.scoreCp || 0) / 100).toFixed(1)}</span>
                </div>
                <div class="source-meta">Cálculo computacional independente (não é citação do autor)</div>
                <div class="source-body">
                  Melhor candidato calculado pelo motor nesta posição: <strong>${engineEval?.bestMoveSan || '-'}</strong>.
                </div>
               </div>`
            : ''
        }

        <!-- PLANILHA COMPLETA (VISÍVEL NO MODO EXPLORADOR) -->
        ${movesheetHtml}
      </div>
    `;

    // ==========================================================================
    // 5. MONTAGEM DO SHELL COMPLETO
    // ==========================================================================
    const currentMissionTitle = isOpening ? opening.namePt : game.titlePt;
    const currentMissionSub = isOpening
      ? `${opening.eco} • Treinador Inteligente de Aberturas • Vez das ${turn === 'w' ? 'Brancas ⚪' : 'Pretas ⚫'}`
      : `${book.titlePt.split(' (')[0]} • ${game.white} vs. ${game.black} (${game.year})`;

    root.innerHTML = `
      <div class="app-shell">
        <!-- CABEÇALHO SUPERIOR PREVISÍVEL -->
        <header class="top-bar">
          <div class="brand-group">
            <button class="brand-btn" id="btn-home-brand">
              <img src="app-icon.png" alt="Chess Mastery" class="brand-icon" />
              <div>
                <div class="brand-title">Chess Mastery</div>
                <div class="brand-sub">Aprender • Treinar • Descobrir</div>
              </div>
            </button>

            <!-- NAVEGAÇÃO PRINCIPAL: APRENDER • BIBLIOTECA • ABERTURAS • CONQUISTAS -->
            <nav class="main-nav">
              <button class="nav-pill ${state.mainDestination === 'learn' ? 'active' : ''}" data-dest="learn">
                <span>🌟 Aprender</span>
              </button>
              <button class="nav-pill ${state.mainDestination === 'library' ? 'active' : ''}" data-dest="library">
                <span>📚 Biblioteca</span>
                <span class="nav-badge">${BOOKS.length}</span>
              </button>
              <button class="nav-pill ${state.mainDestination === 'openings' ? 'active' : ''}" data-dest="openings">
                <span>♟️ Aberturas</span>
                <span class="nav-badge">${OPENINGS.length}</span>
              </button>
              <button class="nav-pill ${state.mainDestination === 'achievements' ? 'active' : ''}" data-dest="achievements">
                <span>🏆 Conquistas</span>
                ${state.reviewQueue.length > 0 ? `<span class="nav-badge">${state.reviewQueue.length}</span>` : ''}
              </button>
            </nav>
          </div>

          <!-- PROGRESSO DE ESTRELAS + DOIS MODOS DE USO (APRENDER vs EXPLORADOR) -->
          <div class="header-right">
            <div class="stars-pill" title="Estrelas conquistadas resolvendo lances e missões">
              <span>⭐ ${state.starsCount}</span>
            </div>

            <div class="mode-switch-group">
              <button class="mode-switch-btn ${state.experienceMode === 'learn' ? 'active-learn' : ''}" id="btn-exp-learn" title="Modo Aprender: interface limpa, dicas progressivas e foco no tabuleiro">
                🌱 Modo Aprender
              </button>
              <button class="mode-switch-btn ${state.experienceMode === 'explorer' ? 'active-explorer' : ''}" id="btn-exp-explorer" title="Modo Explorador: planilha completa, notação descritiva e Stockfish">
                🧭 Modo Explorador
              </button>
            </div>
          </div>
        </header>

        <!-- CORPO DE ESTUDO: LATERAL ESQUERDA + TABULEIRO DOMINANTE + GUIA DIREITO -->
        <main class="workspace-grid">
          <!-- LATERAL ESQUERDA -->
          <aside class="side-card">
            ${leftSidebarHtml}
          </aside>

          <!-- ARENA CENTRAL: MISSÃO + TABULEIRO AMPLO + CONTROLES ESSENCIAIS -->
          <section class="center-arena">
            <!-- FAIXA DE MISSÃO ATUAL -->
            <div class="mission-banner">
              <div class="mb-left">
                <span class="mb-step-pill">${formattedActiveMove}</span>
                <div style="min-width:0;">
                  <div class="mb-title">${currentMissionTitle}</div>
                  <div class="mb-sub">${currentMissionSub}</div>
                </div>
              </div>
              <button class="mini-tool-btn" id="btn-flip" title="Girar Tabuleiro (Tecla X ou F)">
                🔄 Girar
              </button>
            </div>

            <!-- TABULEIRO DE MADEIRA CLARA (ELEMENTO DOMINANTE) -->
            <div class="board-stage">
              ${
                state.engineEnabled || isExplorer
                  ? `<div class="eval-bar" title="Avaliação Stockfish">
                      <div class="eval-black" style="height:${50 - Math.min(48, Math.max(-48, (engineEval?.scoreCp || 0) / 10))}%"></div>
                      <div class="eval-white" style="height:${50 + Math.min(48, Math.max(-48, (engineEval?.scoreCp || 0) / 10))}%"></div>
                      <div class="eval-score">${((engineEval?.scoreCp || 0) / 100).toFixed(1)}</div>
                     </div>`
                  : ''
              }

              <div class="board-frame">
                <div class="board-grid">
                  ${squaresHtml}
                  ${arrowsSvg}
                </div>
              </div>
            </div>

            <!-- CONTROLES ESSENCIAIS: ANTERIOR • VER DICA • PRÓXIMO + MAIS -->
            <div class="controls-bar">
              <div class="primary-controls">
                <button class="btn-action" id="btn-prev" ${state.currentPly === 0 ? 'disabled' : ''}>
                  ◀ Anterior
                </button>
                <button class="btn-action btn-hint-yellow" id="btn-hint" ${!nextStep ? 'disabled' : ''}>
                  💡 ${
                    state.hintLevel === 0
                      ? 'Ver Dica'
                      : state.hintLevel === 1
                      ? 'Dica 2 (Peça)'
                      : 'Ver Solução'
                  }
                </button>
                <button class="btn-action btn-primary-green" id="btn-next" ${state.currentPly >= steps.length ? 'disabled' : ''}>
                  Próximo ▶
                </button>
              </div>

              <button class="btn-action" id="btn-toggle-more">
                ⚙️ ${state.showMoreTools || isExplorer ? 'Ocultar' : 'Mais'}
              </button>
            </div>

            <!-- GAVETA "MAIS" SOB DEMANDA (OU SEMPRE VISÍVEL NO MODO EXPLORADOR) -->
            ${
              state.showMoreTools || isExplorer
                ? `<div class="more-tools-drawer">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      <button class="mini-tool-btn" id="btn-first">⏮ Início</button>
                      <button class="mini-tool-btn" id="btn-last">⏭ Final</button>
                      <button class="mini-tool-btn ${state.engineEnabled ? 'active' : ''}" id="btn-engine">
                        🤖 Stockfish ${state.engineEnabled ? 'ON' : 'OFF'}
                      </button>
                      <button class="mini-tool-btn" id="btn-mute">
                        ${audio.muted ? '🔇 Som Off' : '🔊 Som On'}
                      </button>
                    </div>

                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      <select id="sel-notation" class="mini-select" title="Formato de Notação">
                        <option value="alg_pt" ${state.notationMode === 'alg_pt' ? 'selected' : ''}>Notação: Algébrica PT (Cf3)</option>
                        <option value="figurine" ${state.notationMode === 'figurine' ? 'selected' : ''}>Notação: Figurino (♘f3)</option>
                        <option value="desc_pt" ${state.notationMode === 'desc_pt' ? 'selected' : ''}>Notação: Descritiva (C3BR)</option>
                        <option value="desc_es" ${state.notationMode === 'desc_es' ? 'selected' : ''}>Notação: Descritiva ES (C3AR)</option>
                        <option value="alg_en" ${state.notationMode === 'alg_en' ? 'selected' : ''}>Notação: SAN (Nf3)</option>
                      </select>

                      <select id="sel-theme" class="mini-select" title="Cores do Tabuleiro">
                        ${Object.entries(BOARD_THEMES)
                          .map(
                            ([k, v]) =>
                              `<option value="${k}" ${state.boardTheme === k ? 'selected' : ''}>${v.name}</option>`
                          )
                          .join('')}
                      </select>
                    </div>
                   </div>`
                : ''
            }
          </section>

          <!-- LATERAL DIREITA: GUIA DA LIÇÃO & TRÊS FONTES DE ORIENTAÇÃO -->
          <aside class="side-card">
            ${rightGuideHtml}
          </aside>
        </main>
      </div>
    `;

    // ==========================================================================
    // 6. EVENTOS E INTERATIVIDADE
    // ==========================================================================
    // Navegação Principal (Aprender • Biblioteca • Aberturas • Conquistas)
    document.querySelectorAll('[data-dest]').forEach((btn) => {
      btn.onclick = () => {
        const dest = btn.getAttribute('data-dest');
        state.mainDestination = dest;
        if (dest === 'openings' && state.currentStudyType !== 'opening') {
          selectOpeningStudy(state.selectedOpeningId);
          return;
        }
        if ((dest === 'library' || dest === 'learn') && state.currentStudyType !== 'book_game') {
          selectBookGame(state.bookId, state.isolatedChapterId, state.gameId);
          return;
        }
        render();
      };
    });

    const btnBrand = document.getElementById('btn-home-brand');
    if (btnBrand) {
      btnBrand.onclick = () => {
        state.mainDestination = 'learn';
        render();
      };
    }

    // Alternador Modo Aprender vs Modo Explorador
    const bExpLearn = document.getElementById('btn-exp-learn');
    if (bExpLearn) {
      bExpLearn.onclick = () => {
        state.experienceMode = 'learn';
        state.showMoreTools = false;
        render();
      };
    }
    const bExpExplorer = document.getElementById('btn-exp-explorer');
    if (bExpExplorer) {
      bExpExplorer.onclick = () => {
        state.experienceMode = 'explorer';
        render();
      };
    }

    // Campo de Busca
    const searchInput = document.getElementById('sidebar-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        state.searchQuery = e.target.value;
        render();
        const el = document.getElementById('sidebar-search');
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      };
    }

    // Selecionar Missão na aba Aprender
    document.querySelectorAll('[data-mission-game]').forEach((el) => {
      el.onclick = () => {
        selectBookGame(
          el.getAttribute('data-mission-book'),
          el.getAttribute('data-mission-chap'),
          el.getAttribute('data-mission-game')
        );
      };
    });

    // Botão Praticar Revisão
    const btnPracRev = document.getElementById('btn-practice-review');
    if (btnPracRev && state.reviewQueue.length > 0) {
      btnPracRev.onclick = () => {
        const item = state.reviewQueue[0];
        if (item.studyType === 'opening') {
          state.mainDestination = 'openings';
          selectOpeningStudy(item.studyId, item.ply);
        } else {
          state.mainDestination = 'learn';
          selectBookGame(state.bookId, null, item.studyId, item.ply);
        }
      };
    }

    document.querySelectorAll('[data-review-idx]').forEach((el) => {
      el.onclick = () => {
        const idx = parseInt(el.getAttribute('data-review-idx'), 10);
        const item = state.reviewQueue[idx];
        if (!item) return;
        if (item.studyType === 'opening') {
          state.mainDestination = 'openings';
          selectOpeningStudy(item.studyId, item.ply);
        } else {
          state.mainDestination = 'learn';
          selectBookGame(state.bookId, null, item.studyId, item.ply);
        }
      };
    });

    // Acordeão de Livros na Biblioteca
    document.querySelectorAll('[data-toggle-book]').forEach((el) => {
      el.onclick = () => {
        const bkId = el.getAttribute('data-toggle-book');
        state.bookId = bkId;
        if (state.expandedBookIds.includes(bkId)) {
          state.expandedBookIds = state.expandedBookIds.filter((x) => x !== bkId);
        } else {
          state.expandedBookIds = [...state.expandedBookIds, bkId];
        }
        render();
      };
    });

    // Isolar Capítulo
    document.querySelectorAll('[data-isolate-chap]').forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const chId = el.getAttribute('data-isolate-chap');
        const bkId = el.getAttribute('data-parent-book');
        const targetBk = BOOKS.find((b) => b.id === bkId);
        const targetCh = targetBk?.chapters.find((c) => c.id === chId);
        if (targetCh && targetCh.games.length > 0) {
          selectBookGame(bkId, chId, targetCh.games[0].id);
        } else {
          state.bookId = bkId;
          state.isolatedChapterId = chId;
          render();
        }
      };
    });

    const btnBackChaps = document.getElementById('btn-back-chapters');
    if (btnBackChaps) {
      btnBackChaps.onclick = () => {
        state.isolatedChapterId = null;
        render();
      };
    }

    const btnToggleExt = document.getElementById('btn-toggle-extractor');
    if (btnToggleExt) {
      btnToggleExt.onclick = () => {
        state.showBookExtractorInfo = !state.showBookExtractorInfo;
        render();
      };
    }

    // Selecionar Partida dentro do Capítulo Isolado
    document.querySelectorAll('[data-sel-game]').forEach((el) => {
      el.onclick = () => {
        selectBookGame(
          el.getAttribute('data-sel-book'),
          el.getAttribute('data-sel-chap'),
          el.getAttribute('data-sel-game')
        );
      };
    });

    // Categorias e Estudos de Aberturas
    document.querySelectorAll('[data-toggle-cat]').forEach((el) => {
      el.onclick = () => {
        const catId = el.getAttribute('data-toggle-cat');
        state.selectedOpeningCat = state.selectedOpeningCat === catId ? '' : catId;
        render();
      };
    });

    document.querySelectorAll('[data-sel-opening]').forEach((el) => {
      el.onclick = () => {
        selectOpeningStudy(el.getAttribute('data-sel-opening'));
      };
    });

    // Escolha de Cor no Treinador de Aberturas
    document.querySelectorAll('[data-train-color]').forEach((el) => {
      el.onclick = () => {
        const col = el.getAttribute('data-train-color');
        state.trainerColorChoice = col;
        if (col === 'b') state.flipped = true;
        if (col === 'w') state.flipped = false;
        render();
        maybeAutoPlayOpponentInTrainer();
      };
    });

    // Link de Abertura -> Partida do Livro
    document.querySelectorAll('[data-jump-game]').forEach((el) => {
      el.onclick = () => {
        const gmId = el.getAttribute('data-jump-game');
        for (const bk of BOOKS) {
          for (const ch of bk.chapters) {
            const gm = ch.games.find((g) => g.id === gmId);
            if (gm) {
              state.mainDestination = 'library';
              selectBookGame(bk.id, ch.id, gm.id);
              return;
            }
          }
        }
      };
    });

    // Controles Principais: Anterior • Ver Dica Progressiva • Próximo
    const bPrev = document.getElementById('btn-prev');
    if (bPrev) bPrev.onclick = () => goToPly(state.currentPly - 1);

    const bNext = document.getElementById('btn-next');
    if (bNext) bNext.onclick = () => goToPly(state.currentPly + 1);

    const bHint = document.getElementById('btn-hint');
    if (bHint) {
      bHint.onclick = () => {
        state.hintLevel = state.hintLevel >= 3 ? 1 : state.hintLevel + 1;
        if (nextStep) {
          const title = isOpening ? opening.namePt : game.titlePt;
          const studyId = isOpening ? state.selectedOpeningId : state.gameId;
          addPositionToReviewQueue(
            state.currentStudyType,
            studyId,
            state.currentPly,
            title,
            formatMoveByMode(nextStep, state.notationMode)
          );
        }
        render();
      };
    }

    const bMore = document.getElementById('btn-toggle-more');
    if (bMore) {
      bMore.onclick = () => {
        state.showMoreTools = !state.showMoreTools;
        render();
      };
    }

    // Controles Secundários em "Mais"
    const bFirst = document.getElementById('btn-first');
    if (bFirst) bFirst.onclick = () => goToPly(0);

    const bLast = document.getElementById('btn-last');
    if (bLast) bLast.onclick = () => goToPly(steps.length);

    const bFlip = document.getElementById('btn-flip');
    if (bFlip) {
      bFlip.onclick = () => {
        state.flipped = !state.flipped;
        render();
      };
    }

    const bEng = document.getElementById('btn-engine');
    if (bEng) {
      bEng.onclick = () => {
        state.engineEnabled = !state.engineEnabled;
        render();
      };
    }

    const bMute = document.getElementById('btn-mute');
    if (bMute) {
      bMute.onclick = () => {
        audio.muted = !audio.muted;
        render();
      };
    }

    const selNot = document.getElementById('sel-notation');
    if (selNot) {
      selNot.onchange = (e) => {
        state.notationMode = e.target.value;
        render();
      };
    }

    const selTheme = document.getElementById('sel-theme');
    if (selTheme) {
      selTheme.onchange = (e) => {
        state.boardTheme = e.target.value;
        render();
      };
    }

    // Planilha no Modo Explorador
    document.querySelectorAll('.ply-btn').forEach((btn) => {
      btn.onclick = () => {
        const ply = parseInt(btn.getAttribute('data-ply'), 10);
        if (!isNaN(ply)) goToPly(ply);
      };
    });

    // Exportar Progresso
    const bExpJson = document.getElementById('btn-export-json');
    if (bExpJson) {
      bExpJson.onclick = () => {
        const blob = new Blob(
          [
            JSON.stringify(
              {
                starsCount: state.starsCount,
                completedIds: state.completedIds,
                reviewQueue: state.reviewQueue,
              },
              null,
              2
            ),
          ],
          { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chess_mastery_aventura.json';
        a.click();
        URL.revokeObjectURL(url);
      };
    }

    // Cliques e Movimentos nas Casas do Tabuleiro
    document.querySelectorAll('.board-sq').forEach((sqEl) => {
      const sq = sqEl.getAttribute('data-sq');
      sqEl.onmousedown = (e) => {
        if (e.button === 2) {
          e.preventDefault();
          state.rightClickStart = sq;
          return;
        }
        if (state.userArrows.length || state.userHighlights.length) {
          state.userArrows = [];
          state.userHighlights = [];
        }
        if (state.selectedSquare && state.selectedSquare !== sq) {
          const moved = handleUserBoardMove(state.selectedSquare, sq);
          if (moved) {
            state.selectedSquare = null;
            return;
          }
        }
        state.selectedSquare = sq;
        render();
      };

      sqEl.onmouseup = (e) => {
        if (e.button === 2 && state.rightClickStart) {
          e.preventDefault();
          if (state.rightClickStart === sq) {
            const exists = state.userHighlights.some((h) => h.square === sq);
            state.userHighlights = exists
              ? state.userHighlights.filter((h) => h.square !== sq)
              : [...state.userHighlights, { square: sq, color: 'emerald' }];
          } else {
            const exists = state.userArrows.some(
              (a) => a.from === state.rightClickStart && a.to === sq
            );
            state.userArrows = exists
              ? state.userArrows.filter(
                  (a) => !(a.from === state.rightClickStart && a.to === sq)
                )
              : [...state.userArrows, { from: state.rightClickStart, to: sq, color: 'emerald' }];
          }
          state.rightClickStart = null;
          render();
        } else if (e.button === 0 && state.selectedSquare && state.selectedSquare !== sq) {
          handleUserBoardMove(state.selectedSquare, sq);
        }
      };
    });
  }

  // Atalhos de Teclado
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
    if (e.key === 'x' || e.key === 'X' || e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      state.flipped = !state.flipped;
      render();
      return;
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToPly(state.currentPly + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPly(state.currentPly - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToPly(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      const { steps } = getCurrentSteps();
      goToPly(steps.length);
    }
  });

  window.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('DOMContentLoaded', render);
  render();
})();
