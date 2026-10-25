/**
 * Chess Mastery — Academia Interativa de Mestres
 * Core Application Engine & Master UI Controller
 * 100% Offline · Standalone Bundle para macOS WKWebView & Cocoa
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

  // ============================================================================
  // WEB AUDIO ACOUSTIC SYNTHESIZER
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
      o.frequency.setValueAtTime(145, now);
      o.frequency.exponentialRampToValueAtTime(52, now + 0.065);
      g.gain.setValueAtTime(0.26, now);
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
      o.frequency.setValueAtTime(220, now);
      o.frequency.exponentialRampToValueAtTime(65, now + 0.085);
      g.gain.setValueAtTime(0.3, now);
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
      g.gain.setValueAtTime(0.2, now);
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
        g.gain.setValueAtTime(0.16, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(now);
        o.stop(now + 0.25);
      });
    },
    playError() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(160, now);
      o.frequency.linearRampToValueAtTime(115, now + 0.16);
      g.gain.setValueAtTime(0.14, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.19);
    },
  };

  const BOARD_THEMES = {
    lichess_wood: {
      name: 'Lichess Wood',
      light: '#f0d9b5',
      dark: '#b58863',
      lastLight: '#cdd26a',
      lastDark: '#aaa23a',
    },
    chesscom_green: {
      name: 'Tournament Green',
      light: '#eeeed2',
      dark: '#769656',
      lastLight: '#f6f669',
      lastDark: '#baca2b',
    },
    walnut_luxury: {
      name: 'Walnut Classic',
      light: '#ead8c0',
      dark: '#8b5a2b',
      lastLight: '#e4c96b',
      lastDark: '#a68232',
    },
    slate_ice: {
      name: 'Obsidian Slate',
      light: '#dee3e6',
      dark: '#78909c',
      lastLight: '#9be0c8',
      lastDark: '#55ab91',
    },
  };

  function getPieceSvg(color, type) {
    const isW = color === 'w';
    const fill = isW ? '#f8fafc' : '#1e2028';
    const stroke = isW ? '#1e293b' : '#090a0f';
    const inner = isW ? '#334155' : '#cbd5e1';
    const t = type.toLowerCase();
    let innerBody = '';
    if (t === 'p') {
      innerBody = `<path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17.5,21 15.5,24 15.5,28 C 15.5,30 16.5,31.5 16.5,31.5 L 12,35.5 L 12,38.5 L 33,38.5 L 33,35.5 L 28.5,31.5 C 28.5,31.5 29.5,30 29.5,28 C 29.5,24 27.5,21 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z" fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round"/>`;
    } else if (t === 'r') {
      innerBody = `<g fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/><path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"/><path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"/><path d="M 34,14 L 31,17 L 14,17 L 11,14"/><path d="M 31,17 L 31,29.5 L 14,29.5 L 14,17"/><path d="M 31,29.5 L 32.5,32 L 12.5,32 L 14,29.5"/><path d="M 14,16.5 L 31,16.5" stroke="${inner}" stroke-width="1"/></g>`;
    } else if (t === 'n') {
      innerBody = `<g fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="${fill}"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="${fill}"/><circle cx="15.5" cy="14.5" r="1.2" fill="${inner}" stroke="none"/></g>`;
    } else if (t === 'b') {
      innerBody = `<g fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/><circle cx="22.5" cy="8" r="2.2"/><path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke="${inner}" stroke-width="1.3"/></g>`;
    } else if (t === 'q') {
      innerBody = `<g fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"/><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"/><circle cx="6" cy="12" r="1.8"/><circle cx="14" cy="9" r="1.8"/><circle cx="22.5" cy="8" r="1.8"/><circle cx="31" cy="9" r="1.8"/><circle cx="39" cy="12" r="1.8"/><path d="M 11.5,30 C 15,29 30,29 33.5,30" stroke="${inner}" stroke-width="1.2"/><path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5" stroke="${inner}" stroke-width="1.2"/></g>`;
    } else if (t === 'k') {
      innerBody = `<g fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6"/><path d="M 20,8 L 25,8"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"/><path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z"/><path d="M 11.5,30 C 17,27 27,27 32.5,30" stroke="${inner}" stroke-width="1.2"/><path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" stroke="${inner}" stroke-width="1.2"/></g>`;
    }
    return `<svg viewBox="0 0 45 45" class="piece-svg">${innerBody}</svg>`;
  }

  // Stockfish Local Evaluation
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
      return { scoreCp: 0, bestMoveSan: '-', bestMoveFrom: '', bestMoveTo: '', pvLine: [] };
    }
    let bestMove = moves[0];
    let bestScore = turn === 'w' ? -Infinity : Infinity;
    for (const m of moves.slice(0, 15)) {
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
      pvLine: [bestMove.san],
    };
  }

  function computeMaterial(fen) {
    const start = { q: 1, r: 2, b: 2, n: 2, p: 8 };
    const w = { q: 0, r: 0, b: 0, n: 0, p: 0 };
    const b = { q: 0, r: 0, b: 0, n: 0, p: 0 };
    const grid = new Chess(fen).board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = grid[r][c];
        if (!cell || cell.type === 'k') continue;
        if (cell.color === 'w') w[cell.type]++;
        else b[cell.type]++;
      }
    }
    const capByW = [], capByB = [];
    const pts = { q: 9, r: 5, b: 3, n: 3, p: 1 };
    let wPts = 0, bPts = 0;
    for (const t of ['q', 'r', 'b', 'n', 'p']) {
      for (let i = 0; i < Math.max(0, start[t] - b[t]); i++) capByW.push(t);
      for (let i = 0; i < Math.max(0, start[t] - w[t]); i++) capByB.push(t);
      wPts += w[t] * pts[t];
      bPts += b[t] * pts[t];
    }
    return {
      capByW,
      capByB,
      wAdv: Math.max(0, wPts - bPts),
      bAdv: Math.max(0, bPts - wPts),
    };
  }

  // ============================================================================
  // APPLICATION STATE
  // ============================================================================
  const state = {
    // Mode Switcher: 'library' (Livros) ou 'openings' (Aberturas & Defesas)
    activeNavTab: 'library',

    // Livros & Capítulos
    bookId: BOOKS[0]?.id || 'xadrez-basico-agostini',
    expandedBookIds: [BOOKS[0]?.id || 'xadrez-basico-agostini'],
    isolatedChapterId: null, // null = visão geral de livros; string = modo isolado daquele capítulo
    gameId: BOOKS[0]?.chapters[0]?.games[0]?.id || '',

    // Aberturas & Defesas
    selectedOpeningCat: 'open',
    selectedOpeningId: OPENINGS[0]?.id || '',

    // Modo ativo do estudo: 'book_game' ou 'opening'
    currentStudyType: 'book_game',

    // Painel direito: 'study' (Estudo & Comentários) ou 'movesheet' (Planilha) ou 'guess' (Adivinhe)
    rightPanelTab: 'study',

    // Preferências visuais
    notationMode: 'alg_pt', // 'alg_pt' | 'figurine' | 'desc_pt' | 'desc_es' | 'alg_en'
    boardTheme: 'lichess_wood',
    studyMode: 'study', // 'study' | 'guess' | 'explore'
    currentPly: 0,
    flipped: false,
    engineEnabled: false,
    searchQuery: '',

    // Interações no tabuleiro
    selectedSquare: null,
    draggingFrom: null,
    userArrows: [],
    userHighlights: [],
    rightClickStart: null,
    customFen: null,
    customHistory: [],
    customLastMove: null,

    // Modo Adivinhe
    guessSolved: false,
    guessWrongMove: null,
    guessShowHint: false,
    guessStats: { correct: 0, attempts: 0, streak: 0 },

    // Persistência
    completedGames: JSON.parse(localStorage.getItem('cm_completed_v2') || '[]'),
  };

  // ============================================================================
  // HELPERS DE CONSULTA
  // ============================================================================
  function getActiveBook() {
    return BOOKS.find((b) => b.id === state.bookId) || BOOKS[0];
  }

  function getActiveChapter() {
    const b = getActiveBook();
    if (state.isolatedChapterId) {
      const found = b.chapters.find((c) => c.id === state.isolatedChapterId);
      if (found) return found;
    }
    return b.chapters[0];
  }

  function getActiveGame() {
    const c = getActiveChapter();
    return c.games.find((g) => g.id === state.gameId) || c.games[0];
  }

  function getActiveOpening() {
    return OPENINGS.find((o) => o.id === state.selectedOpeningId) || OPENINGS[0];
  }

  let cachedStudyId = null;
  let cachedSteps = [];
  let cachedStartFen = '';

  function getCurrentSteps() {
    const studyKey = state.currentStudyType === 'opening'
      ? `opening_${state.selectedOpeningId}`
      : `game_${state.gameId}`;

    if (cachedStudyId === studyKey) {
      return { initialFen: cachedStartFen, steps: cachedSteps };
    }

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

    cachedStudyId = studyKey;
    cachedSteps = steps;
    cachedStartFen = startFen;
    return { initialFen: startFen, steps };
  }

  // ============================================================================
  // NAVEGAÇÃO E AÇÕES
  // ============================================================================
  function selectGame(bookId, chapterId, gameId) {
    state.currentStudyType = 'book_game';
    state.activeNavTab = 'library';
    state.bookId = bookId;
    state.isolatedChapterId = chapterId;
    state.gameId = gameId;
    state.currentPly = 0;
    state.customFen = null;
    state.customHistory = [];
    state.customLastMove = null;
    state.selectedSquare = null;
    state.userArrows = [];
    state.userHighlights = [];
    const gm = getActiveGame();
    state.flipped = gm.heroColor === 'b';
    state.guessSolved = false;
    state.guessWrongMove = null;
    state.guessShowHint = false;
    render();
  }

  function selectOpening(openingId) {
    state.currentStudyType = 'opening';
    state.activeNavTab = 'openings';
    state.selectedOpeningId = openingId;
    const op = getActiveOpening();
    state.selectedOpeningCat = op.category;
    state.currentPly = 0;
    state.customFen = null;
    state.customHistory = [];
    state.customLastMove = null;
    state.selectedSquare = null;
    state.userArrows = [];
    state.userHighlights = [];
    state.flipped = op.heroColor === 'b';
    state.guessSolved = false;
    state.guessWrongMove = null;
    state.guessShowHint = false;
    render();
  }

  function goToPly(ply) {
    const { steps } = getCurrentSteps();
    const clamped = Math.max(0, Math.min(steps.length, ply));
    state.customFen = null;
    state.customHistory = [];
    state.customLastMove = null;
    state.selectedSquare = null;
    state.currentPly = clamped;
    if (clamped > 0) {
      const st = steps[clamped - 1];
      if (st.inCheck || st.isCheckmate) audio.playCheck();
      else if (st.captured) audio.playCapture();
      else audio.playMove();
    }
    render();
  }

  function handleUserMove(from, to) {
    const { initialFen, steps } = getCurrentSteps();
    const activeStep = state.currentPly > 0 ? steps[state.currentPly - 1] : null;
    const currentFen = state.customFen || (activeStep ? activeStep.fenAfter : initialFen);
    const chess = new Chess(currentFen);
    const moveRes = chess.move({ from, to, promotion: 'q' });
    if (!moveRes) return false;

    if (state.studyMode === 'guess') {
      const targetStep = state.guessSolved ? activeStep : steps[state.currentPly];
      if (!targetStep || state.guessSolved) return false;
      if (targetStep.from === from && targetStep.to === to) {
        audio.playSuccess();
        state.currentPly = targetStep.ply;
        state.guessSolved = true;
        state.guessWrongMove = null;
        state.guessStats.correct++;
        state.guessStats.attempts++;
        state.guessStats.streak++;
        render();
        return true;
      } else {
        audio.playError();
        state.guessWrongMove = formatMoveByMode(
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
        state.guessStats.attempts++;
        state.guessStats.streak = 0;
        render();
        return false;
      }
    }

    if (!state.customFen && state.currentPly < steps.length) {
      const nextStep = steps[state.currentPly];
      if (nextStep.from === from && nextStep.to === to) {
        goToPly(state.currentPly + 1);
        return true;
      }
    }

    state.studyMode = 'explore';
    state.customFen = chess.fen();
    state.customLastMove = { from, to };
    state.customHistory.push(sanToPortugueseAlgebraic(moveRes.san));
    if (chess.inCheck()) audio.playCheck();
    else if (moveRes.captured) audio.playCapture();
    else audio.playMove();
    render();
    return true;
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
  // RENDER MASTER UI
  // ============================================================================
  function render() {
    const root = document.getElementById('root');
    if (!root) return;

    const book = getActiveBook();
    const chapter = getActiveChapter();
    const game = getActiveGame();
    const opening = getActiveOpening();
    const isOpeningMode = state.currentStudyType === 'opening';

    const { initialFen, steps } = getCurrentSteps();
    const activeStep = state.currentPly > 0 ? steps[state.currentPly - 1] : null;
    const displayedFen = state.customFen || (activeStep ? activeStep.fenAfter : initialFen);
    const chess = new Chess(displayedFen);
    const boardMatrix = chess.board();
    const turn = chess.turn();
    const theme = BOARD_THEMES[state.boardTheme] || BOARD_THEMES.lichess_wood;
    const coords = getBoardCoordinates(state.flipped, state.notationMode);
    const mat = computeMaterial(displayedFen);

    const legalFromSelected =
      state.selectedSquare || state.draggingFrom
        ? chess.moves({ square: state.draggingFrom || state.selectedSquare, verbose: true })
        : [];

    const engineEval =
      state.engineEnabled && state.studyMode !== 'guess' ? analyzeLocal(displayedFen) : null;

    const targetGuessStep =
      state.studyMode === 'guess'
        ? state.guessSolved
          ? activeStep
          : steps[state.currentPly] || null
        : null;

    const lastMove = state.customLastMove
      ? state.customLastMove
      : activeStep
      ? { from: activeStep.from, to: activeStep.to }
      : null;

    const kingCheckSq = chess.inCheck() ? chess.findKing(turn)?.sq : null;

    const displayRows = state.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const displayCols = state.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

    const bookHighlights =
      !state.customFen && state.studyMode !== 'guess'
        ? activeStep?.annotation?.highlights || []
        : state.studyMode === 'guess' && state.guessShowHint && targetGuessStep
        ? [{ square: targetGuessStep.from, color: 'amber' }]
        : [];

    const allHighlights = [...bookHighlights, ...state.userHighlights];
    const bookArrows =
      !state.customFen && state.studyMode !== 'guess'
        ? activeStep?.annotation?.arrows || []
        : [];
    const allArrows = [
      ...bookArrows,
      ...state.userArrows,
      ...(engineEval?.bestMoveFrom && engineEval?.bestMoveTo
        ? [{ from: engineEval.bestMoveFrom, to: engineEval.bestMoveTo, color: 'sky' }]
        : []),
    ];

    // ==========================================================================
    // 1. SQUARES DO TABULEIRO (64 CASAS)
    // ==========================================================================
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
          !state.customFen &&
          state.studyMode !== 'guess' &&
          lastMove?.to === sq &&
          activeStep?.annotation?.badge
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

    // ==========================================================================
    // 2. SETAS SVG
    // ==========================================================================
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
            emerald: 'rgba(16,185,129,0.88)',
            rose: 'rgba(244,63,94,0.88)',
            amber: 'rgba(245,158,11,0.88)',
            sky: 'rgba(14,165,233,0.92)',
          };
          return `<line x1="${x1}" y1="${y1}" x2="${tx}" y2="${ty}" stroke="${strokeMap[colKey]}" stroke-width="18" stroke-linecap="round" marker-end="url(#arr-${colKey})"/>`;
        })
        .join('');
      arrowsSvg = `
        <svg viewBox="0 0 800 800" class="arrows-svg">
          <defs>
            <marker id="arr-emerald" markerWidth="4.2" markerHeight="4.2" refX="2.5" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(16,185,129,0.9)"/></marker>
            <marker id="arr-rose" markerWidth="4.2" markerHeight="4.2" refX="2.5" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(244,63,94,0.9)"/></marker>
            <marker id="arr-amber" markerWidth="4.2" markerHeight="4.2" refX="2.5" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(245,158,11,0.9)"/></marker>
            <marker id="arr-sky" markerWidth="4.2" markerHeight="4.2" refX="2.5" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(14,165,233,0.92)"/></marker>
          </defs>
          ${lines}
        </svg>
      `;
    }

    // Players Info Banners
    const topPlayerName = isOpeningMode
      ? (state.flipped ? '⚪ Lado das Brancas' : '⚫ Resposta das Pretas')
      : (state.flipped ? game.white : game.black);
    const botPlayerName = isOpeningMode
      ? (state.flipped ? '⚫ Resposta das Pretas' : '⚪ Lado das Brancas')
      : (state.flipped ? game.black : game.white);

    const topSubtitle = isOpeningMode
      ? `${opening.eco} · ${opening.tag}`
      : `${game.event} (${game.year})`;
    const botSubtitle = isOpeningMode
      ? `${opening.namePt}`
      : `${game.openingNamePt || 'Abertura'} · ${game.result}`;

    const topP = {
      name: topPlayerName,
      color: state.flipped ? 'w' : 'b',
      isTurn: state.flipped ? turn === 'w' : turn === 'b',
      sub: topSubtitle,
      adv: state.flipped ? mat.wAdv : mat.bAdv,
    };
    const botP = {
      name: botPlayerName,
      color: state.flipped ? 'b' : 'w',
      isTurn: state.flipped ? turn === 'b' : turn === 'w',
      sub: botSubtitle,
      adv: state.flipped ? mat.bAdv : mat.wAdv,
    };

    // ==========================================================================
    // 3. PLANILHA DE LANCES (MOVESHEET)
    // ==========================================================================
    let moveRowsHtml = '';
    for (let i = 0; i < steps.length; i += 2) {
      const w = steps[i];
      const b = steps[i + 1];
      const mNum = Math.floor(i / 2) + 1;
      const wAct = w && state.currentPly === w.ply;
      const bAct = b && state.currentPly === b.ply;
      moveRowsHtml += `
        <div class="move-pair-row">
          <span class="move-num">${mNum}.</span>
          <button class="move-btn ${wAct ? 'active' : w?.annotation ? 'annotated' : ''}" data-ply="${w.ply}">
            <span>${formatMoveByMode(w, state.notationMode)}</span>
            ${w.annotation && !wAct ? '<span class="ann-dot"></span>' : ''}
          </button>
          ${
            b
              ? `<button class="move-btn ${bAct ? 'active' : b?.annotation ? 'annotated' : ''}" data-ply="${b.ply}">
                  <span>${formatMoveByMode(b, state.notationMode)}</span>
                  ${b.annotation && !bAct ? '<span class="ann-dot"></span>' : ''}
                 </button>`
              : '<span></span>'
          }
        </div>
      `;
    }

    // ==========================================================================
    // 4. CONSTRUÇÃO DA ABA LATERAL ESQUERDA (SIDEBAR)
    // ==========================================================================
    let sidebarContentHtml = '';

    if (state.activeNavTab === 'library') {
      // MODO BIBLIOTECA DE LIVROS
      if (state.isolatedChapterId) {
        // MODO ISOLADO DE CAPÍTULO (SOLICITAÇÃO EXPLÍCITA DO USUÁRIO)
        const isoChap = getActiveChapter();
        sidebarContentHtml = `
          <div class="isolated-chapter-view">
            <div class="isolated-back-bar">
              <button id="btn-back-to-books" class="back-to-books-btn">
                <span>← Voltar aos Capítulos</span>
              </button>
              <span class="breadcrumb-label">${book.titlePt.split(' (')[0]}</span>
            </div>

            <div class="isolated-chapter-hero">
              <div class="isolated-eyebrow">
                <span class="isolated-badge">Capítulo ${isoChap.number} Isolado</span>
                <span class="isolated-games-count">${isoChap.games.length} Partidas</span>
              </div>
              <h2 class="isolated-title">${isoChap.titlePt}</h2>
              <p class="isolated-sub">${isoChap.subtitlePt}</p>
            </div>

            <div class="isolated-games-list">
              ${isoChap.games
                .map(
                  (gm) => `
                <button class="game-card ${gm.id === game.id ? 'active' : ''}" data-sel-book="${book.id}" data-sel-chap="${isoChap.id}" data-sel-game="${gm.id}">
                  <div class="gm-info">
                    <div class="gm-title">${gm.titlePt}</div>
                    <div class="gm-meta">${gm.white} vs. ${gm.black} (${gm.year})</div>
                    <span class="gm-eco-tag">${gm.eco} · ${gm.openingNamePt || 'Partida Clássica'}</span>
                  </div>
                  ${state.completedGames.includes(gm.id) ? '<span class="done-indicator">✓</span>' : ''}
                </button>`
                )
                .join('')}
            </div>
          </div>
        `;
      } else {
        // VISÃO GERAL COM ACORDEÃO DE LIVROS
        const q = state.searchQuery.toLowerCase().trim();
        const filteredBooks = BOOKS.filter((bk) => {
          if (!q) return true;
          return (
            bk.titlePt.toLowerCase().includes(q) ||
            bk.author.toLowerCase().includes(q) ||
            bk.chapters.some(
              (c) =>
                c.titlePt.toLowerCase().includes(q) ||
                c.games.some(
                  (g) =>
                    g.titlePt.toLowerCase().includes(q) ||
                    g.white.toLowerCase().includes(q) ||
                    g.black.toLowerCase().includes(q)
                )
            )
          );
        });

        sidebarContentHtml = `
          <div class="sidebar-scroll">
            ${filteredBooks
              .map((bk) => {
                const isExpanded = state.expandedBookIds.includes(bk.id);
                const isActive = bk.id === book.id;
                return `
                <div class="book-card ${isActive ? 'is-active-book' : ''}" data-book-id="${bk.id}">
                  <div class="book-card-header" data-toggle-book="${bk.id}">
                    <div class="book-header-info">
                      <div class="book-icon-badge">📖</div>
                      <div class="book-meta-text">
                        <h3 class="book-title-h3">${bk.titlePt.split(' (')[0]}</h3>
                        <p class="book-author-p">${bk.author} · ${bk.publicationYear}</p>
                      </div>
                    </div>
                    <div class="book-header-side">
                      <span class="book-chap-count">${bk.chapters.length} Cap.</span>
                      <span class="chevron-arrow ${isExpanded ? 'open' : ''}">▼</span>
                    </div>
                  </div>

                  ${
                    isExpanded
                      ? `<div class="book-chapters-drawer">
                          ${bk.chapters
                            .map(
                              (ch) => `
                            <button class="chapter-row-btn ${ch.id === chapter.id && isActive ? 'active' : ''}" data-isolate-chap="${ch.id}" data-parent-book="${bk.id}">
                              <div class="chap-row-left">
                                <div class="chap-row-num">Capítulo ${ch.number}</div>
                                <div class="chap-row-title">${ch.titlePt}</div>
                              </div>
                              <span class="isolate-tag">Isolar ➔</span>
                            </button>`
                            )
                            .join('')}
                         </div>`
                      : ''
                  }
                </div>`;
              })
              .join('')}
          </div>
        `;
      }
    } else {
      // MODO ABERTURAS & DEFESAS (REPERTÓRIO E ESTUDOS)
      const q = state.searchQuery.toLowerCase().trim();
      sidebarContentHtml = `
        <div class="sidebar-scroll">
          ${OPENING_CATS.map((cat) => {
            const catOpenings = OPENINGS.filter((o) => {
              if (o.category !== cat.id) return false;
              if (!q) return true;
              return (
                o.namePt.toLowerCase().includes(q) ||
                o.eco.toLowerCase().includes(q) ||
                o.tag.toLowerCase().includes(q)
              );
            });
            if (catOpenings.length === 0) return '';
            const isCatOpen = state.selectedOpeningCat === cat.id;

            return `
              <div class="opening-cat-block">
                <div class="opening-cat-header" data-toggle-cat="${cat.id}">
                  <div class="cat-title-wrap">
                    <span class="cat-icon">${cat.icon}</span>
                    <span class="cat-label">${cat.label}</span>
                  </div>
                  <div class="book-header-side">
                    <span class="cat-count">${catOpenings.length} estudos</span>
                    <span class="chevron-arrow ${isCatOpen ? 'open' : ''}">▼</span>
                  </div>
                </div>

                ${
                  isCatOpen
                    ? `<div class="opening-items-drawer">
                        ${catOpenings
                          .map(
                            (op) => `
                          <button class="opening-item-btn ${op.id === opening.id && isOpeningMode ? 'active' : ''}" data-sel-opening="${op.id}">
                            <div>
                              <div class="op-name">${op.namePt}</div>
                              <div class="op-tag">${op.tag}</div>
                            </div>
                            <span class="op-eco">${op.eco}</span>
                          </button>`
                          )
                          .join('')}
                       </div>`
                    : ''
                }
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // ==========================================================================
    // 5. PAINEL DIREITO (ESTUDO, COMENTÁRIOS E AVALIAÇÃO)
    // ==========================================================================
    let rightPanelContentHtml = '';

    if (state.rightPanelTab === 'movesheet') {
      rightPanelContentHtml = `
        <div class="movesheet-box">
          <div class="movesheet-header">
            <span># & LANCE BRANCAS</span>
            <span>LANCE PRETAS</span>
          </div>
          <div class="movesheet-scroll">
            ${moveRowsHtml}
          </div>
        </div>
      `;
    } else if (state.rightPanelTab === 'guess') {
      rightPanelContentHtml = `
        <div class="guess-container">
          <div class="guess-header">
            <div>
              <div class="guess-badge">🎯 Adivinhe o Lance do Mestre</div>
              <div class="guess-sub">Sem spoilers da planilha</div>
            </div>
          </div>
          <div class="guess-stats-grid">
            <div class="stat-box"><span>Acertos</span><strong>${state.guessStats.correct}</strong></div>
            <div class="stat-box"><span>Tentativas</span><strong>${state.guessStats.attempts}</strong></div>
            <div class="stat-box"><span>Sequência</span><strong>${state.guessStats.streak} 🔥</strong></div>
          </div>
          ${
            state.guessSolved
              ? `<div class="guess-solved-box">
                  <div class="challenge-turn">Lance Correto Encontrado!</div>
                  <p style="font-size:12.5px;color:#d4d4d8;">${activeStep?.annotation?.commentPt || 'Excelente lance!'}</p>
                  <button class="primary-btn" id="btn-guess-next">Próximo Lance ➔</button>
                 </div>`
              : `<div class="guess-challenge-box">
                  <div class="challenge-turn">Vez de: ${turn === 'w' ? 'Brancas' : 'Pretas'}</div>
                  <p style="font-size:12px;color:#a1a1aa;">Mova uma peça no tabuleiro para acertar o lance.</p>
                  ${state.guessWrongMove ? `<div class="wrong-alert">O lance <strong>${state.guessWrongMove}</strong> não foi o jogado. Tente novamente!</div>` : ''}
                  ${state.guessShowHint && targetGuessStep?.annotation?.hintPt ? `<div class="hint-alert">💡 <strong>Dica:</strong> ${targetGuessStep.annotation.hintPt}</div>` : ''}
                  <div class="guess-actions">
                    <button class="primary-btn-sm" id="btn-guess-hint">💡 Dica</button>
                    <button class="primary-btn-sm" id="btn-guess-reveal" style="background:#f43f5e;color:#fff;">Revelar</button>
                  </div>
                 </div>`
          }
        </div>
      `;
    } else {
      // TAB: ESTUDO & COMENTÁRIOS DO LIVRO / TEORIA DA ABERTURA
      if (isOpeningMode) {
        rightPanelContentHtml = `
          <div class="study-scroll-content">
            <div class="opening-study-hero">
              <div class="op-hero-header">
                <span class="isolated-badge">${opening.eco} · ${opening.badgeText}</span>
              </div>
              <h2 class="op-hero-title">${opening.namePt}</h2>
              <p class="op-hero-desc">${opening.introPt}</p>
            </div>

            <!-- ROSETTA STRIP (LANCE ATIVO) -->
            ${
              activeStep
                ? `<div class="commentary-card">
                    <div class="rosetta-strip">
                      <span class="main-move-pill">${activeStep.moveNumber}. ${formatMoveByMode(activeStep, state.notationMode)}</span>
                      <div class="rosetta-tags">
                        <span>Figurino: <strong class="emerald-txt">${sanToFigurine(activeStep.san)}</strong></span>
                        <span>Descritiva: <strong class="amber-txt">${activeStep.descriptivePt}</strong></span>
                      </div>
                    </div>
                    <div class="comment-body">
                      <p>${activeStep.annotation?.commentPt || 'Lance posicional crucial de abertura.'}</p>
                    </div>
                   </div>`
                : ''
            }

            <!-- PLANOS ESTRATÉGICOS CENTRAIS -->
            <div class="strategic-box">
              <div class="strat-title" style="color:#f8fafc;">⚪ Planos Estratégicos das Brancas</div>
              <div class="strat-list">
                ${opening.plansWhite.map((p) => `<div class="strat-item w">${p}</div>`).join('')}
              </div>
            </div>

            <div class="strategic-box">
              <div class="strat-title" style="color:#7dd3fc;">⚫ Planos & Defesas das Pretas</div>
              <div class="strat-list">
                ${opening.plansBlack.map((p) => `<div class="strat-item b">${p}</div>`).join('')}
              </div>
            </div>

            <div class="strategic-box">
              <div class="strat-title" style="color:#fcd34d;">♙ Estrutura de Peões & Casas Críticas</div>
              <p class="strat-item pawn">${opening.pawnStructure}</p>
            </div>

            <div class="strategic-box">
              <div class="strat-title" style="color:#fca5a5;">⚠️ Armadilhas & Erros Típicos</div>
              <p class="strat-item trap">${opening.trapsPt}</p>
            </div>

            ${
              opening.relatedBookGameId
                ? `<div class="related-game-banner">
                    <div>
                      <div class="rel-title">Partida Modelo no Livro</div>
                      <div class="rel-sub">Estude esta abertura aplicada por Mestres Clássicos</div>
                    </div>
                    <button class="rel-btn" data-jump-game="${opening.relatedBookGameId}">Ver Partida</button>
                   </div>`
                : ''
            }
          </div>
        `;
      } else {
        // MODO LIVROS CLÁSSICOS
        rightPanelContentHtml = `
          <div class="study-scroll-content">
            <div class="commentary-card">
              <div class="rosetta-strip">
                <span class="main-move-pill">
                  ${activeStep ? `${activeStep.moveNumber}. ${formatMoveByMode(activeStep, state.notationMode)}` : 'Posição Inicial'}
                </span>
                ${
                  activeStep
                    ? `<div class="rosetta-tags">
                        <span>Figurino: <strong class="emerald-txt">${sanToFigurine(activeStep.san)}</strong></span>
                        <span>Descritiva PT: <strong class="amber-txt">${activeStep.descriptivePt}</strong></span>
                       </div>`
                    : `<span style="font-size:11px;color:#a1a1aa;">${game.openingNamePt || 'Abertura Clássica'}</span>`
                }
              </div>

              <div class="comment-body">
                ${
                  activeStep?.annotation
                    ? `<p>${activeStep.annotation.commentPt}</p>`
                    : `<p>${game.introPt}</p>`
                }
              </div>
            </div>

            <div class="strategic-box">
              <div class="strat-title" style="color:#6ee7b7;">🎯 Razões Pedagógicas & Lições do Mestre</div>
              <div class="strat-list">
                ${(game.keyTakeawaysPt || []).map((t) => `<div class="strat-item w">${t}</div>`).join('')}
              </div>
            </div>
          </div>
        `;
      }
    }

    // ==========================================================================
    // 6. MONTAGEM DO HTML COMPLETO
    // ==========================================================================
    root.innerHTML = `
      <div class="app-shell">
        <!-- TOP BAR -->
        <header class="top-bar">
          <div class="brand-group">
            <div class="brand-btn" id="btn-brand-home">
              <img src="app-icon.png" alt="Chess Mastery" class="brand-icon"/>
              <div>
                <div class="brand-title">Chess Mastery</div>
                <div class="brand-sub">Academia Interativa de Mestres</div>
              </div>
            </div>

            <!-- NAVEGAÇÃO SUPERIOR PRINCIPAL -->
            <nav class="view-switcher">
              <button class="view-tab ${state.activeNavTab === 'library' ? 'active' : ''}" id="top-nav-library">
                <span>📚 Livros Mestres</span>
                <span class="tab-badge">${BOOKS.length}</span>
              </button>
              <button class="view-tab ${state.activeNavTab === 'openings' ? 'active' : ''}" id="top-nav-openings">
                <span>♟️ Aberturas & Defesas</span>
                <span class="tab-badge">${OPENINGS.length}</span>
              </button>
            </nav>
          </div>

          <!-- CONTROLES GLOBAIS DE NOTAÇÃO & MODO -->
          <div class="controls-group">
            <div class="seg-group">
              ${[
                { id: 'alg_pt', label: 'Algébrica PT' },
                { id: 'figurine', label: 'Figurino (♘)' },
                { id: 'desc_pt', label: 'Descritiva (C3BR)' },
                { id: 'desc_es', label: 'Descritiva ES' },
                { id: 'alg_en', label: 'SAN (Nf3)' },
              ]
                .map(
                  (n) => `
                <button class="seg-btn ${state.notationMode === n.id ? 'active' : ''}" data-notation="${n.id}">
                  ${n.label}
                </button>`
                )
                .join('')}
            </div>

            <div class="seg-group">
              <button class="seg-btn ${state.studyMode !== 'guess' ? 'active-emerald' : ''}" id="btn-mode-study">
                📖 Leitura
              </button>
              <button class="seg-btn ${state.studyMode === 'guess' ? 'active-amber' : ''}" id="btn-mode-guess">
                🎯 Adivinhe
              </button>
            </div>
          </div>
        </header>

        <!-- CORPO PRINCIPAL EM 3 COLUNAS -->
        <main class="main-grid">
          <!-- COLUNA ESQUERDA: NAVEGAÇÃO DE LIVROS / ABERTURAS -->
          <aside class="sidebar-panel">
            <div class="sidebar-header">
              <div class="sidebar-mode-nav">
                <button class="sidebar-mode-btn ${state.activeNavTab === 'library' ? 'active' : ''}" id="side-tab-lib">
                  📚 Livros da Biblioteca
                </button>
                <button class="sidebar-mode-btn ${state.activeNavTab === 'openings' ? 'active' : ''}" id="side-tab-ops">
                  ♟️ Aberturas & Defesas
                </button>
              </div>

              <div class="sidebar-search-box">
                <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  class="sidebar-search-input"
                  id="sidebar-search"
                  placeholder="${state.activeNavTab === 'library' ? 'Buscar livros, capítulos ou mestres...' : 'Buscar abertura por nome ou ECO...'}"
                  value="${state.searchQuery}"
                />
              </div>
            </div>

            ${sidebarContentHtml}
          </aside>

          <!-- COLUNA CENTRAL: ARENA DO TABULEIRO -->
          <section class="board-arena">
            <!-- BANNER ADVERSÁRIO / TOPO -->
            <div class="player-bar ${topP.isTurn ? 'turn-active' : ''}">
              <div class="p-info">
                <span class="p-color-box ${topP.color}">${topP.color === 'w' ? 'B' : 'P'}</span>
                <div>
                  <div class="p-name">
                    ${topP.name}
                    ${topP.isTurn ? '<span class="turn-pill">Vez de jogar</span>' : ''}
                  </div>
                  <div class="p-sub">${topP.sub}</div>
                </div>
              </div>
              <div class="p-mat">
                ${topP.adv > 0 ? `<span class="mat-adv">+${topP.adv}</span>` : ''}
              </div>
            </div>

            <!-- TABULEIRO COM BEZEL E BARRA DE AVALIAÇÃO -->
            <div class="board-row-wrap">
              <div class="eval-bar" title="Barra de Avaliação Stockfish">
                <div class="eval-black" style="height:${50 - Math.min(48, Math.max(-48, (engineEval?.scoreCp || 0) / 10))}%"></div>
                <div class="eval-white" style="height:${50 + Math.min(48, Math.max(-48, (engineEval?.scoreCp || 0) / 10))}%"></div>
                <div class="eval-score">${state.engineEnabled ? ((engineEval?.scoreCp || 0) / 100).toFixed(1) : ''}</div>
              </div>

              <div class="board-bezel">
                <div class="board-grid">
                  ${squaresHtml}
                  ${arrowsSvg}
                </div>
              </div>
            </div>

            <!-- BANNER PROTAGONISTA / BAIXO -->
            <div class="player-bar ${botP.isTurn ? 'turn-active' : ''}">
              <div class="p-info">
                <span class="p-color-box ${botP.color}">${botP.color === 'w' ? 'B' : 'P'}</span>
                <div>
                  <div class="p-name">
                    ${botP.name}
                    ${botP.isTurn ? '<span class="turn-pill">Vez de jogar</span>' : ''}
                  </div>
                  <div class="p-sub">${botP.sub}</div>
                </div>
              </div>
              <div class="p-mat">
                ${botP.adv > 0 ? `<span class="mat-adv">+${botP.adv}</span>` : ''}
              </div>
            </div>

            <!-- BARRA DE CONTROLE E NAVEGAÇÃO DO TABULEIRO -->
            <div class="board-toolbar">
              <div class="nav-btns">
                <button id="btn-first" title="Início (Home)" ${state.currentPly === 0 ? 'disabled' : ''}>⏮</button>
                <button id="btn-prev" title="Lance Anterior (←)" ${state.currentPly === 0 ? 'disabled' : ''}>◀</button>
                <span class="ply-counter">${state.currentPly} / ${steps.length}</span>
                <button id="btn-next" title="Próximo Lance (→)" ${state.currentPly >= steps.length ? 'disabled' : ''}>▶</button>
                <button id="btn-last" title="Final (End)" ${state.currentPly >= steps.length ? 'disabled' : ''}>⏭</button>
              </div>

              <div class="tool-btns">
                <button id="btn-flip" title="Girar Tabuleiro (X ou F)">🔄 Inverter</button>
                <select id="sel-theme" class="theme-select" title="Tema do Tabuleiro">
                  ${Object.entries(BOARD_THEMES)
                    .map(
                      ([k, v]) => `
                    <option value="${k}" ${state.boardTheme === k ? 'selected' : ''}>${v.name}</option>`
                    )
                    .join('')}
                </select>
                <button id="btn-engine" class="tool-btn ${state.engineEnabled ? 'active-sky' : ''}" title="Ativar Avaliação Stockfish">
                  ⚡ Stockfish
                </button>
                <button id="btn-mute" class="tool-btn" title="Silenciar Sons">
                  ${audio.muted ? '🔇' : '🔊'}
                </button>
              </div>
            </div>
          </section>

          <!-- COLUNA DIREITA: PAINEL DE ESTUDO & NOTAS -->
          <aside class="study-panel">
            <div class="study-panel-tabs">
              <button class="study-tab-btn ${state.rightPanelTab === 'study' ? 'active' : ''}" id="study-tab-notes">
                📖 Estudo & Teoria
              </button>
              <button class="study-tab-btn ${state.rightPanelTab === 'movesheet' ? 'active' : ''}" id="study-tab-sheet">
                📋 Planilha (${steps.length} lances)
              </button>
            </div>

            <div class="study-container">
              ${rightPanelContentHtml}
            </div>
          </aside>
        </main>
      </div>
    `;

    // ==========================================================================
    // 7. EVENT LISTENERS E BINDINGS
    // ==========================================================================
    // Top Tabs
    const topLib = document.getElementById('top-nav-library');
    if (topLib) {
      topLib.onclick = () => {
        state.activeNavTab = 'library';
        render();
      };
    }
    const topOps = document.getElementById('top-nav-openings');
    if (topOps) {
      topOps.onclick = () => {
        state.activeNavTab = 'openings';
        render();
      };
    }

    // Sidebar Tabs
    const sideLib = document.getElementById('side-tab-lib');
    if (sideLib) {
      sideLib.onclick = () => {
        state.activeNavTab = 'library';
        render();
      };
    }
    const sideOps = document.getElementById('side-tab-ops');
    if (sideOps) {
      sideOps.onclick = () => {
        state.activeNavTab = 'openings';
        render();
      };
    }

    // Search Input
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

    // Toggle Book Accordion
    document.querySelectorAll('[data-toggle-book]').forEach((el) => {
      el.onclick = () => {
        const bkId = el.getAttribute('data-toggle-book');
        state.bookId = bkId;
        if (state.expandedBookIds.includes(bkId)) {
          state.expandedBookIds = state.expandedBookIds.filter((id) => id !== bkId);
        } else {
          state.expandedBookIds = [...state.expandedBookIds, bkId];
        }
        render();
      };
    });

    // Isolate Chapter Click
    document.querySelectorAll('[data-isolate-chap]').forEach((el) => {
      el.onclick = (e) => {
        e.stopPropagation();
        const chId = el.getAttribute('data-isolate-chap');
        const bkId = el.getAttribute('data-parent-book');
        state.bookId = bkId;
        state.isolatedChapterId = chId;
        const targetBk = BOOKS.find((b) => b.id === bkId);
        const targetCh = targetBk?.chapters.find((c) => c.id === chId);
        if (targetCh && targetCh.games.length > 0) {
          selectGame(bkId, chId, targetCh.games[0].id);
        } else {
          render();
        }
      };
    });

    // Back to all Chapters button
    const btnBackBooks = document.getElementById('btn-back-to-books');
    if (btnBackBooks) {
      btnBackBooks.onclick = () => {
        state.isolatedChapterId = null;
        render();
      };
    }

    // Game card click in isolated chapter view
    document.querySelectorAll('.game-card').forEach((el) => {
      el.onclick = () => {
        const bkId = el.getAttribute('data-sel-book');
        const chId = el.getAttribute('data-sel-chap');
        const gmId = el.getAttribute('data-sel-game');
        selectGame(bkId, chId, gmId);
      };
    });

    // Toggle Opening Category
    document.querySelectorAll('[data-toggle-cat]').forEach((el) => {
      el.onclick = () => {
        const catId = el.getAttribute('data-toggle-cat');
        state.selectedOpeningCat = state.selectedOpeningCat === catId ? '' : catId;
        render();
      };
    });

    // Select Opening Study
    document.querySelectorAll('[data-sel-opening]').forEach((el) => {
      el.onclick = () => {
        const opId = el.getAttribute('data-sel-opening');
        selectOpening(opId);
      };
    });

    // Jump from opening to related book game
    document.querySelectorAll('[data-jump-game]').forEach((el) => {
      el.onclick = () => {
        const gmId = el.getAttribute('data-jump-game');
        for (const bk of BOOKS) {
          for (const ch of bk.chapters) {
            const gm = ch.games.find((g) => g.id === gmId);
            if (gm) {
              selectGame(bk.id, ch.id, gm.id);
              return;
            }
          }
        }
      };
    });

    // Study Panel Tabs
    const tabNotes = document.getElementById('study-tab-notes');
    if (tabNotes) {
      tabNotes.onclick = () => {
        state.rightPanelTab = 'study';
        render();
      };
    }
    const tabSheet = document.getElementById('study-tab-sheet');
    if (tabSheet) {
      tabSheet.onclick = () => {
        state.rightPanelTab = 'movesheet';
        render();
      };
    }

    // Notation Buttons
    document.querySelectorAll('[data-notation]').forEach((el) => {
      el.onclick = () => {
        state.notationMode = el.getAttribute('data-notation');
        render();
      };
    });

    // Study Modes (Leitura vs Adivinhe)
    const btnModeStudy = document.getElementById('btn-mode-study');
    if (btnModeStudy) {
      btnModeStudy.onclick = () => {
        state.studyMode = 'study';
        state.rightPanelTab = 'study';
        render();
      };
    }
    const btnModeGuess = document.getElementById('btn-mode-guess');
    if (btnModeGuess) {
      btnModeGuess.onclick = () => {
        state.studyMode = 'guess';
        state.rightPanelTab = 'guess';
        state.guessSolved = false;
        state.guessWrongMove = null;
        state.guessShowHint = false;
        render();
      };
    }

    // Guess mode actions
    const btnGNext = document.getElementById('btn-guess-next');
    if (btnGNext) {
      btnGNext.onclick = () => {
        state.guessSolved = false;
        state.guessWrongMove = null;
        state.guessShowHint = false;
        goToPly(state.currentPly + 1);
      };
    }
    const btnGHint = document.getElementById('btn-guess-hint');
    if (btnGHint) {
      btnGHint.onclick = () => {
        state.guessShowHint = true;
        render();
      };
    }
    const btnGRev = document.getElementById('btn-guess-reveal');
    if (btnGRev) {
      btnGRev.onclick = () => {
        state.guessSolved = true;
        render();
      };
    }

    // Move sheet buttons
    document.querySelectorAll('.move-btn').forEach((btn) => {
      btn.onclick = () => {
        const ply = parseInt(btn.getAttribute('data-ply'), 10);
        if (!isNaN(ply)) goToPly(ply);
      };
    });

    // Navigation Buttons
    const bFirst = document.getElementById('btn-first');
    if (bFirst) bFirst.onclick = () => goToPly(0);
    const bPrev = document.getElementById('btn-prev');
    if (bPrev) bPrev.onclick = () => goToPly(state.currentPly - 1);
    const bNext = document.getElementById('btn-next');
    if (bNext) bNext.onclick = () => goToPly(state.currentPly + 1);
    const bLast = document.getElementById('btn-last');
    if (bLast) {
      bLast.onclick = () => {
        const { steps } = getCurrentSteps();
        goToPly(steps.length);
      };
    }

    const bFlip = document.getElementById('btn-flip');
    if (bFlip) {
      bFlip.onclick = () => {
        state.flipped = !state.flipped;
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

    // Board Square Click / Drag
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
          const moved = handleUserMove(state.selectedSquare, sq);
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
        } else if (
          e.button === 0 &&
          state.selectedSquare &&
          state.selectedSquare !== sq
        ) {
          handleUserMove(state.selectedSquare, sq);
        }
      };
    });
  }

  // Atalhos de teclado
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
    if (e.key === 'x' || e.key === 'X' || e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      state.flipped = !state.flipped;
      render();
      return;
    }
    if (state.studyMode === 'guess') return;
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
