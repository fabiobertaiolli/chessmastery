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
  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Web Audio Synthesizer (@shared/ui/chess/chessAudio)
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
      border: '#3d2e22',
    },
    chesscom_green: {
      name: 'Tournament Green',
      light: '#eeeed2',
      dark: '#769656',
      lastLight: '#f6f669',
      lastDark: '#baca2b',
      border: '#26331b',
    },
    walnut_luxury: {
      name: 'Walnut Classic',
      light: '#ead8c0',
      dark: '#8b5a2b',
      lastLight: '#e4c96b',
      lastDark: '#a68232',
      border: '#2c1b0e',
    },
    slate_ice: {
      name: 'Obsidian Slate',
      light: '#dee3e6',
      dark: '#78909c',
      lastLight: '#9be0c8',
      lastDark: '#55ab91',
      border: '#1e293b',
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

  // Local Stockfish Lite Evaluation
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
    for (const m of moves) {
      const c1 = chess.clone();
      c1.move(m);
      const replies = c1.moves({ verbose: true });
      let replyScore = evaluateStatic(c1);
      if (replies.length > 0) {
        replyScore = turn === 'w' ? Infinity : -Infinity;
        for (const r of replies.slice(0, 12)) {
          const c2 = c1.clone();
          c2.move(r);
          const sc = evaluateStatic(c2);
          if (turn === 'w' && sc < replyScore) replyScore = sc;
          if (turn === 'b' && sc > replyScore) replyScore = sc;
        }
      }
      if ((turn === 'w' && replyScore > bestScore) || (turn === 'b' && replyScore < bestScore)) {
        bestScore = replyScore;
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

  // Application State
  const state = {
    bookId: BOOKS[0].id,
    chapterId: BOOKS[0].chapters[0].id,
    gameId: BOOKS[0].chapters[0].games[0].id,
    notationMode: 'alg_pt', // 'alg_pt' | 'figurine' | 'desc_pt' | 'desc_es' | 'alg_en'
    languageMode: 'bilingual', // 'pt' | 'bilingual' | 'original'
    boardTheme: 'lichess_wood',
    studyMode: 'study', // 'study' | 'guess' | 'explore'
    currentPly: 0,
    flipped: false,
    engineEnabled: false,
    showLibraryModal: false,
    selectedSquare: null,
    draggingFrom: null,
    userArrows: [],
    userHighlights: [],
    rightClickStart: null,
    customFen: null,
    customHistory: [],
    customLastMove: null,
    guessSolved: false,
    guessWrongMove: null,
    guessShowHint: false,
    guessStats: { correct: 0, attempts: 0, streak: 0 },
    notesByGame: JSON.parse(localStorage.getItem('cm_notes_v1') || '{}'),
    completedGames: JSON.parse(localStorage.getItem('cm_completed_v1') || '[]'),
  };

  function getActiveBook() {
    return BOOKS.find((b) => b.id === state.bookId) || BOOKS[0];
  }
  function getActiveChapter() {
    const b = getActiveBook();
    return b.chapters.find((c) => c.id === state.chapterId) || b.chapters[0];
  }
  function getActiveGame() {
    const c = getActiveChapter();
    return c.games.find((g) => g.id === state.gameId) || c.games[0];
  }

  let cachedGameId = null;
  let cachedSteps = [];
  let cachedStartFen = '';

  function getGameSteps() {
    const gm = getActiveGame();
    if (cachedGameId === gm.id) return { initialFen: cachedStartFen, steps: cachedSteps };
    const startFen = gm.initialFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const chess = new Chess(startFen);
    const steps = [];
    gm.movesSan.forEach((san, idx) => {
      const ply = idx + 1;
      const fenBefore = chess.fen();
      const res = chess.move(san);
      if (!res) return;
      const fenAfter = chess.fen();
      const ann = gm.annotations[ply];
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
    cachedGameId = gm.id;
    cachedSteps = steps;
    cachedStartFen = startFen;
    return { initialFen: startFen, steps };
  }

  function selectGame(bookId, chapterId, gameId) {
    const b = BOOKS.find((x) => x.id === bookId) || BOOKS[0];
    const c = b.chapters.find((x) => x.id === chapterId) || b.chapters[0];
    const g = c.games.find((x) => x.id === gameId) || c.games[0];
    state.bookId = b.id;
    state.chapterId = c.id;
    state.gameId = g.id;
    state.currentPly = 0;
    state.customFen = null;
    state.customHistory = [];
    state.customLastMove = null;
    state.selectedSquare = null;
    state.userArrows = [];
    state.userHighlights = [];
    state.flipped = g.heroColor === 'b';
    state.guessSolved = false;
    state.guessWrongMove = null;
    state.guessShowHint = false;
    state.showLibraryModal = false;
    render();
  }

  function goToPly(ply) {
    const { steps } = getGameSteps();
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
    const { initialFen, steps } = getGameSteps();
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

  function render() {
    const root = document.getElementById('root');
    if (!root) return;

    const book = getActiveBook();
    const chapter = getActiveChapter();
    const game = getActiveGame();
    const { initialFen, steps } = getGameSteps();
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

    // Build 64 squares HTML
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
            ${badge ? `<div class="move-badge badge-${badge.replace(/\?/g, 'q').replace(/!/g, 'x')}">${badge}</div>` : ''}
          </div>
        `;
      });
    });

    // Build SVG Arrows
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
            emerald: 'rgba(16,185,129,0.86)',
            rose: 'rgba(244,63,94,0.86)',
            amber: 'rgba(245,158,11,0.86)',
            sky: 'rgba(14,165,233,0.9)',
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

    const topP = state.flipped
      ? { name: game.white, color: 'w', isTurn: turn === 'w', cap: mat.capByW, adv: mat.wAdv }
      : { name: game.black, color: 'b', isTurn: turn === 'b', cap: mat.capByB, adv: mat.bAdv };
    const botP = state.flipped
      ? { name: game.black, color: 'b', isTurn: turn === 'b', cap: mat.capByB, adv: mat.bAdv }
      : { name: game.white, color: 'w', isTurn: turn === 'w', cap: mat.capByW, adv: mat.wAdv };

    // Move Pairs Sheet
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
        ${
          w?.annotation
            ? `<div class="inline-comm" data-ply="${w.ply}"><strong>${mNum}. ${formatMoveByMode(w, state.notationMode)}:</strong> ${w.annotation.commentPt}</div>`
            : ''
        }
        ${
          b?.annotation
            ? `<div class="inline-comm amber" data-ply="${b.ply}"><strong>${mNum}... ${formatMoveByMode(b, state.notationMode)}:</strong> ${b.annotation.commentPt}</div>`
            : ''
        }
      `;
    }

    root.innerHTML = `
      <div class="app-shell">
        <!-- HEADER -->
        <header class="top-bar">
          <div class="brand-group">
            <button id="btn-open-library" class="brand-btn">
              <img src="app-icon.png" alt="Chess Mastery" class="brand-icon"/>
              <div>
                <div class="brand-title">Chess Mastery</div>
                <div class="brand-sub">Biblioteca (${BOOKS.length} Clássicos Pré-Instalados)</div>
              </div>
            </button>
            <div class="book-pills">
              ${BOOKS.map(
                (bk) => `
                <button class="book-pill ${bk.id === book.id ? 'active' : ''}" data-book="${bk.id}">
                  ${bk.titlePt.split(' (')[0].split(',')[0]}
                </button>`
              ).join('')}
            </div>
          </div>

          <div class="controls-group">
            <div class="seg-group">
              ${[
                { id: 'alg_pt', label: 'Algébrica PT (Cf3)' },
                { id: 'figurine', label: 'Figurino (♘f3)' },
                { id: 'desc_pt', label: 'Descritiva (C3BR)' },
                { id: 'desc_es', label: 'Descritiva ES (C3AR)' },
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

            ${
              book.originalLanguage !== 'pt'
                ? `<div class="seg-group">
                    ${[
                      { id: 'pt', label: 'PT-BR' },
                      { id: 'bilingual', label: 'Bilíngue' },
                      { id: 'original', label: book.originalLanguage.toUpperCase() },
                    ]
                      .map(
                        (l) => `
                      <button class="seg-btn ${state.languageMode === l.id ? 'active' : ''}" data-lang="${l.id}">
                        ${l.label}
                      </button>`
                      )
                      .join('')}
                   </div>`
                : ''
            }

            <div class="seg-group">
              <button class="seg-btn ${state.studyMode !== 'guess' ? 'active-emerald' : ''}" id="btn-mode-study">
                📖 Leitura
              </button>
              <button class="seg-btn ${state.studyMode === 'guess' ? 'active-amber' : ''}" id="btn-mode-guess">
                🎯 Modo Adivinhe
              </button>
            </div>
          </div>
        </header>

        <!-- MAIN WORKSPACE -->
        <main class="main-grid">
          <!-- LEFT SIDEBAR: Chapters & Games -->
          <aside class="sidebar-panel">
            <div class="book-header-card">
              <div class="book-badge-row">
                <span class="badge-pill">${book.badgeText}</span>
                <span class="year-label">${book.publicationYear}</span>
              </div>
              <h2>${book.titlePt}</h2>
              <p>${book.author}</p>
            </div>

            <div class="chapters-scroll">
              ${book.chapters
                .map(
                  (ch) => `
                <div class="chapter-block">
                  <div class="chap-eyebrow">Capítulo ${ch.number}</div>
                  <div class="chap-title">${ch.titlePt}</div>
                  <div class="chap-games">
                    ${ch.games
                      .map(
                        (gm) => `
                      <button class="game-item ${gm.id === game.id ? 'active' : ''}" data-sel-book="${book.id}" data-sel-chap="${ch.id}" data-sel-game="${gm.id}">
                        <div>
                          <div class="gm-title">${gm.titlePt}</div>
                          <div class="gm-meta">${gm.white} vs. ${gm.black} (${gm.year})</div>
                        </div>
                        ${state.completedGames.includes(gm.id) ? '<span class="done-badge">✓</span>' : ''}
                      </button>`
                      )
                      .join('')}
                  </div>
                </div>`
                )
                .join('')}
            </div>
          </aside>

          <!-- CENTER: Chessboard Arena -->
          <section class="board-arena">
            <div class="player-bar ${topP.isTurn ? 'turn-active' : ''}">
              <div class="p-info">
                <span class="p-color-box ${topP.color}">${topP.color === 'w' ? 'B' : 'P'}</span>
                <div>
                  <div class="p-name">${topP.name} ${topP.isTurn ? '<span class="turn-pill">Vez de jogar</span>' : ''}</div>
                  <div class="p-sub">${game.event} (${game.year})</div>
                </div>
              </div>
              <div class="p-mat">
                ${topP. adv > 0 ? `<span class="mat-adv">+${topP.adv}</span>` : ''}
              </div>
            </div>

            <div class="board-row-wrap">
              ${
                engineEval
                  ? `<div class="eval-bar">
                      <div class="eval-black" style="height:${Math.max(5, Math.min(95, 50 - engineEval.scoreCp / 20))}%"></div>
                      <div class="eval-white" style="height:${Math.max(5, Math.min(95, 50 + engineEval.scoreCp / 20))}%"></div>
                      <span class="eval-score">${engineEval.scoreCp > 0 ? '+' : ''}${(engineEval.scoreCp / 100).toFixed(1)}</span>
                     </div>`
                  : ''
              }
              <div class="board-bezel">
                <div class="board-grid" id="chessboard-grid" style="border-color:${theme.border}">
                  ${squaresHtml}
                  ${arrowsSvg}
                </div>
              </div>
            </div>

            <div class="player-bar ${botP.isTurn ? 'turn-active' : ''}">
              <div class="p-info">
                <span class="p-color-box ${botP.color}">${botP.color === 'w' ? 'B' : 'P'}</span>
                <div>
                  <div class="p-name">${botP.name} ${botP.isTurn ? '<span class="turn-pill">Vez de jogar</span>' : ''}</div>
                  <div class="p-sub">${game.openingNamePt} · Resultado: ${game.result}</div>
                </div>
              </div>
              <div class="p-mat">
                ${botP.adv > 0 ? `<span class="mat-adv">+${botP.adv}</span>` : ''}
              </div>
            </div>

            <div class="board-toolbar">
              <div class="nav-btns">
                <button id="btn-first" ${state.studyMode === 'guess' || state.currentPly === 0 ? 'disabled' : ''} title="Início (Home)">⏮</button>
                <button id="btn-prev" ${state.studyMode === 'guess' || state.currentPly === 0 ? 'disabled' : ''} title="Anterior (←)">◀</button>
                <span class="ply-counter">${state.currentPly}/${steps.length}</span>
                <button id="btn-next" ${state.studyMode === 'guess' || state.currentPly >= steps.length ? 'disabled' : ''} title="Próximo (→)">▶</button>
                <button id="btn-last" ${state.studyMode === 'guess' || state.currentPly >= steps.length ? 'disabled' : ''} title="Fim (End)">⏭</button>
              </div>

              <div class="tool-btns">
                <button id="btn-flip" class="tool-btn" title="Girar Tabuleiro (Tecla X ou F)">
                  🔄 Girar (${state.flipped ? 'Pretas' : 'Brancas'})
                </button>
                <select id="sel-theme" class="theme-select">
                  ${Object.entries(BOARD_THEMES)
                    .map(
                      ([id, t]) =>
                        `<option value="${id}" ${state.boardTheme === id ? 'selected' : ''}>${t.name}</option>`
                    )
                    .join('')}
                </select>
                <button id="btn-engine" class="tool-btn ${state.engineEnabled ? 'active-sky' : ''}" ${state.studyMode === 'guess' ? 'disabled' : ''}>
                  ⚡ Stockfish
                </button>
                <button id="btn-mute" class="tool-btn">
                  ${audio.muted ? '🔇' : '🔊'}
                </button>
              </div>
            </div>
          </section>

          <!-- RIGHT PANEL: Commentary & Move Sheet OR Spoiler-Free Guess Mode -->
          <section class="study-panel">
            ${
              state.studyMode === 'guess'
                ? renderGuessPanelHtml(game, targetGuessStep, steps.length)
                : renderStudyPanelHtml(book, game, activeStep, moveRowsHtml, engineEval)
            }
          </section>
        </main>
      </div>
    `;

    bindEvents();
  }

  function renderGuessPanelHtml(game, targetStep, totalPlies) {
    const acc =
      state.guessStats.attempts > 0
        ? Math.round((state.guessStats.correct / state.guessStats.attempts) * 100)
        : 100;

    if (!targetStep) {
      return `
        <div class="guess-card">
          <h3>🏆 Treino da Partida Concluído!</h3>
          <p>Acertos: <strong>${state.guessStats.correct}</strong> · Precisão: <strong>${acc}%</strong></p>
          <button id="btn-exit-guess" class="primary-btn">Voltar ao Modo Leitura</button>
        </div>
      `;
    }

    const moveLabel = formatMoveByMode(targetStep, state.notationMode);
    const hintText =
      targetStep.annotation?.hintPt ||
      `Observe a peça na casa ${targetStep.from.toUpperCase()} e procure o lance mais ativo.`;

    return `
      <div class="guess-container">
        <div class="guess-header">
          <div>
            <span class="guess-badge">🎯 Modo Adivinhe · Sem Spoilers</span>
            <p class="guess-sub">Explicações do livro ocultas até você acertar o lance no tabuleiro</p>
          </div>
          <button id="btn-exit-guess" class="tool-btn">Sair</button>
        </div>

        <div class="guess-stats-grid">
          <div class="stat-box"><span>Acertos</span><strong>${state.guessStats.correct}</strong></div>
          <div class="stat-box"><span>Precisão</span><strong>${acc}%</strong></div>
          <div class="stat-box"><span>Progresso</span><strong>${state.currentPly + 1}/${totalPlies}</strong></div>
        </div>

        ${
          !state.guessSolved
            ? `<div class="guess-challenge-box">
                <div class="challenge-turn">Lance ${targetStep.moveNumber} das ${targetStep.color === 'w' ? 'Brancas' : 'Pretas'}</div>
                <h4>Qual foi o lance de ${targetStep.color === 'w' ? game.white : game.black} nesta posição?</h4>
                <p>Clique na peça e na casa de destino diretamente no tabuleiro ao lado.</p>
                ${
                  state.guessWrongMove
                    ? `<div class="wrong-alert">❌ Você tentou <strong>${state.guessWrongMove}</strong>. No livro, o mestre escolheu outro caminho!</div>`
                    : ''
                }
                ${
                  state.guessShowHint
                    ? `<div class="hint-alert">💡 <strong>Dica Posicional:</strong> ${hintText}</div>`
                    : ''
                }
                <div class="guess-actions">
                  <button id="btn-guess-hint" class="tool-btn">💡 Pedir Dica Posicional</button>
                  <button id="btn-guess-reveal" class="tool-btn">👁 Revelar Lance</button>
                </div>
               </div>`
            : `<div class="guess-solved-box">
                <div class="solved-title">✅ Lance Desbloqueado: ${targetStep.moveNumber}${targetStep.color === 'w' ? '.' : '...'} ${moveLabel} (Descritiva: ${targetStep.descriptivePt})</div>
                <div class="solved-comment">
                  ${targetStep.annotation ? targetStep.annotation.commentPt : 'Lance natural de desenvolvimento da partida original.'}
                </div>
                <button id="btn-guess-next" class="primary-btn">Próximo Desafio do Livro →</button>
               </div>`
        }
      </div>
    `;
  }

  function renderStudyPanelHtml(book, game, activeStep, moveRowsHtml, engineEval) {
    return `
      <div class="study-container">
        ${
          state.customFen
            ? `<div class="explore-banner">
                <span>🧭 <strong>Exploração Livre:</strong> ${state.customHistory.join(' ')}</span>
                <button id="btn-reset-explore" class="primary-btn-sm">Voltar ao Livro</button>
               </div>`
            : ''
        }

        ${
          engineEval
            ? `<div class="engine-box">
                <div>⚡ <strong>Stockfish Local Lite (M2 8GB):</strong> ${engineEval.scoreCp > 0 ? '+' : ''}${(engineEval.scoreCp / 100).toFixed(2)}</div>
                <div>Melhor lance sugerido: <strong class="emerald-txt">${sanToPortugueseAlgebraic(engineEval.bestMoveSan)}</strong></div>
               </div>`
            : ''
        }

        <div class="commentary-card">
          ${
            activeStep
              ? `<div class="rosetta-strip">
                  <span class="main-move-pill">${activeStep.moveNumber}${activeStep.color === 'w' ? '. ' : '... '}${formatMoveByMode(activeStep, state.notationMode)}</span>
                  <div class="rosetta-tags">
                    <span>PT: <strong>${sanToPortugueseAlgebraic(activeStep.san)}</strong></span>
                    <span>Desc: <strong class="amber-txt">${activeStep.descriptivePt}</strong></span>
                    <span>${sanToFigurine(activeStep.san, activeStep.color)}</span>
                  </div>
                 </div>
                 <div class="comment-body">
                  ${
                    activeStep.annotation
                      ? `<p>${activeStep.annotation.commentPt}</p>
                         ${
                           state.languageMode !== 'pt' && activeStep.annotation.commentOriginal
                             ? `<p class="orig-comment">Original (${book.originalLanguage.toUpperCase()}): “${activeStep.annotation.commentOriginal}”</p>`
                             : ''
                         }`
                      : `<p class="muted-txt">Avance com a seta → do teclado ou clique nos lances comentados abaixo.</p>`
                  }
                 </div>`
              : `<div class="intro-body">
                  <div class="intro-title">✨ Introdução do Capítulo</div>
                  <p>${game.introPt}</p>
                  ${
                    state.languageMode !== 'pt' && game.introOriginal
                      ? `<p class="orig-comment">Original: “${game.introOriginal}”</p>`
                      : ''
                  }
                 </div>`
          }
        </div>

        <div class="movesheet-box">
          <div class="movesheet-header">
            <span>Planilha Sincronizada (${state.notationMode.toUpperCase()})</span>
            <span>Clique em qualquer lance</span>
          </div>
          <div class="movesheet-scroll">
            ${moveRowsHtml}
          </div>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    document.querySelectorAll('[data-book]').forEach((el) => {
      el.onclick = () => {
        const bk = BOOKS.find((b) => b.id === el.getAttribute('data-book'));
        if (bk) selectGame(bk.id, bk.chapters[0].id, bk.chapters[0].games[0].id);
      };
    });

    document.querySelectorAll('[data-sel-game]').forEach((el) => {
      el.onclick = () => {
        selectGame(
          el.getAttribute('data-sel-book'),
          el.getAttribute('data-sel-chap'),
          el.getAttribute('data-sel-game')
        );
      };
    });

    document.querySelectorAll('[data-notation]').forEach((el) => {
      el.onclick = () => {
        state.notationMode = el.getAttribute('data-notation');
        render();
      };
    });

    document.querySelectorAll('[data-lang]').forEach((el) => {
      el.onclick = () => {
        state.languageMode = el.getAttribute('data-lang');
        render();
      };
    });

    document.querySelectorAll('[data-ply]').forEach((el) => {
      el.onclick = () => {
        goToPly(parseInt(el.getAttribute('data-ply'), 10));
      };
    });

    const btnStudy = document.getElementById('btn-mode-study');
    if (btnStudy) {
      btnStudy.onclick = () => {
        state.studyMode = 'study';
        state.customFen = null;
        render();
      };
    }

    const btnGuess = document.getElementById('btn-mode-guess');
    if (btnGuess) {
      btnGuess.onclick = () => {
        const gm = getActiveGame();
        const { steps } = getGameSteps();
        state.studyMode = 'guess';
        state.engineEnabled = false;
        state.customFen = null;
        state.flipped = gm.heroColor === 'b';
        state.guessSolved = false;
        state.guessWrongMove = null;
        state.guessShowHint = false;
        if (gm.heroColor === 'b' && state.currentPly === 0 && steps.length > 0) {
          state.currentPly = 1;
        }
        render();
      };
    }

    const btnExitGuess = document.getElementById('btn-exit-guess');
    if (btnExitGuess) {
      btnExitGuess.onclick = () => {
        state.studyMode = 'study';
        render();
      };
    }

    const btnHint = document.getElementById('btn-guess-hint');
    if (btnHint) {
      btnHint.onclick = () => {
        state.guessShowHint = true;
        render();
      };
    }

    const btnReveal = document.getElementById('btn-guess-reveal');
    if (btnReveal) {
      btnReveal.onclick = () => {
        const { steps } = getGameSteps();
        const target = steps[state.currentPly];
        if (target) {
          state.currentPly = target.ply;
          state.guessSolved = true;
          render();
        }
      };
    }

    const btnGuessNext = document.getElementById('btn-guess-next');
    if (btnGuessNext) {
      btnGuessNext.onclick = () => {
        const gm = getActiveGame();
        const { steps } = getGameSteps();
        state.guessSolved = false;
        state.guessWrongMove = null;
        state.guessShowHint = false;
        if (state.currentPly < steps.length && steps[state.currentPly].color !== gm.heroColor) {
          state.currentPly = Math.min(steps.length, state.currentPly + 1);
          audio.playMove();
        }
        render();
      };
    }

    const btnResetExp = document.getElementById('btn-reset-explore');
    if (btnResetExp) {
      btnResetExp.onclick = () => {
        state.customFen = null;
        state.customHistory = [];
        state.customLastMove = null;
        state.studyMode = 'study';
        render();
      };
    }

    const bFirst = document.getElementById('btn-first');
    if (bFirst) bFirst.onclick = () => goToPly(0);
    const bPrev = document.getElementById('btn-prev');
    if (bPrev) bPrev.onclick = () => goToPly(state.currentPly - 1);
    const bNext = document.getElementById('btn-next');
    if (bNext) bNext.onclick = () => goToPly(state.currentPly + 1);
    const bLast = document.getElementById('btn-last');
    if (bLast) {
      bLast.onclick = () => {
        const { steps } = getGameSteps();
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

    // Board Square Click / Drag Interactions
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
      const { steps } = getGameSteps();
      goToPly(steps.length);
    }
  });

  window.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('DOMContentLoaded', render);
  render();
})();
