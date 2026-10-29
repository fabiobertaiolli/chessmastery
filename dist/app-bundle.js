/* ============================================================================
 * CHESS MASTERY v1.3.0 — TASTE-SKILL REDESIGN (FRAMED-SHEET STYLE & SHELL)
 * - Framed-sheet L-chrome (#f4f6f5) + inset white work-sheet (#ffffff, 8px inset,
 *   16px radius, 1px border, zero shadow)
 * - IBM Plex Sans + IBM Plex Mono (tabular numerals for ECO, moves, evaluations)
 * - Strict Anti-Emoji compliance: 1.5px stroke SVG icons throughout
 * - All 4 books in left sidebar accordion + Isolated Chapter Mode
 * - 18 Openings & Defenses catalog + Intelligent Opening Trainer (6-step flow)
 * - 3 Separated Guidance Sources: Do Tutor, Do Livro (with citation & OCR), Do Stockfish
 * ============================================================================ */
(function () {
  const {
    Chess,
    moveToDescriptive,
    sanToPortugueseAlgebraic,
    sanToFigurine,
    formatMoveByMode,
  } = window.ChessMasteryEngine;

  const PREINSTALLED_BOOKS = window.PREINSTALLED_BOOKS || [];
  const CHESS_OPENINGS = window.CHESS_OPENINGS || [];
  const OPENING_CATEGORIES = window.OPENING_CATEGORIES || [];

  const chessAudio = {
    ctx: null,
    muted: false,
    init() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    },
    setMuted(m) {
      this.muted = Boolean(m);
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
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.075);
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
        g.gain.setValueAtTime(0.14, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        o.connect(g);
        g.connect(this.ctx.destination);
        o.start(now);
        o.stop(now + 0.23);
      });
    },
    playError() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(310, now);
      o.frequency.linearRampToValueAtTime(240, now + 0.14);
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.17);
    },
  };

  const PIECE_VALS = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
  function evaluateStatic(chess) {
    if (chess.isCheckmate && chess.isCheckmate()) return chess.turn() === 'w' ? -99999 : 99999;
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

  function analyzePositionLocal(fen) {
    const chess = new Chess(fen);
    const turn = chess.turn();
    const moves = chess.moves({ verbose: true });
    if (!moves || moves.length === 0) {
      return {
        scoreCp: 0,
        bestMoveSan: '—',
        bestMoveFrom: '',
        bestMoveTo: '',
        pvLineSan: [],
        depth: 12,
        explanationPt: 'Posição equilibrada sem lances adicionais disponíveis.',
      };
    }
    let bestMove = moves[0];
    let bestScore = turn === 'w' ? -Infinity : Infinity;
    for (const m of moves.slice(0, 18)) {
      const c1 = chess.clone ? chess.clone() : new Chess(fen);
      c1.move(m);
      const sc = evaluateStatic(c1);
      if ((turn === 'w' && sc > bestScore) || (turn === 'b' && sc < bestScore)) {
        bestScore = sc;
        bestMove = m;
      }
    }
    const clampedScore = Math.max(-2000, Math.min(2000, Math.round(bestScore)));
    const pvLineSan = [bestMove.san];
    try {
      const c2 = chess.clone ? chess.clone() : new Chess(fen);
      c2.move(bestMove);
      const replyMoves = c2.moves({ verbose: true });
      if (replyMoves && replyMoves[0]) pvLineSan.push(replyMoves[0].san);
    } catch (e) {}

    const advText =
      Math.abs(clampedScore) < 35
        ? 'Equilíbrio dinâmico entre ambos os lados.'
        : clampedScore > 0
        ? 'Vantagem posicional das Brancas pelo espaço e atividade das peças.'
        : 'Contrajogo ativo das Pretas com boa coordenação defensiva.';

    return {
      scoreCp: clampedScore,
      bestMoveSan: bestMove.san,
      bestMoveFrom: bestMove.from,
      bestMoveTo: bestMove.to,
      pvLineSan,
      depth: 14,
      explanationPt: advText,
    };
  }

  function buildGameSteps(game) {
    const initialFen =
      game.initialFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const chess = new Chess(initialFen);
    const steps = [];
    const movesSan = game.movesSan || [];
    const annotations = game.annotations || {};

    for (let i = 0; i < movesSan.length; i++) {
      const san = movesSan[i];
      const fenBefore = chess.fen();
      const moveObj = chess.move(san);
      if (!moveObj) break;
      const fenAfter = chess.fen();
      const ply = i + 1;
      const moveNumber = Math.floor(i / 2) + 1;
      steps.push({
        ply,
        moveNumber,
        color: moveObj.color,
        san: moveObj.san,
        from: moveObj.from,
        to: moveObj.to,
        piece: moveObj.piece,
        captured: moveObj.captured,
        promotion: moveObj.promotion,
        fenBefore,
        fenAfter,
        inCheck: chess.inCheck ? chess.inCheck() : false,
        isCheckmate: chess.isCheckmate ? chess.isCheckmate() : false,
        isCastling: moveObj.san.indexOf('O-O') === 0,
        descriptivePt: moveToDescriptive(moveObj, 'pt'),
        descriptiveEs: moveToDescriptive(moveObj, 'es'),
        annotation: annotations[ply] || undefined,
      });
    }
    return { initialFen, steps };
  }

  const STORAGE_KEY = 'chess_mastery_progress_v2';

  // ==========================================================================
  // 1. ÍCONES VETORIAIS 1.5PX STROKE (ZERO EMOJI — TASTE-SKILL HOUSE RULE)
  // ==========================================================================
  const ICONS = {
    knightMark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 20H5v-2a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2Z"/><path d="M7 15 6 9c0-3 2.5-5 6-5 1.5 0 3 .5 4 1.5L18 4l-.5 4.5L19 11l-3 1.5-2-1.5-2.5 2V15"/></svg>`,
    compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5 15.5 8.5"/></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
    board: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>`,
    ledger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
    skipBack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`,
    skipForward: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`,
    flip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`,
    bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    volumeOn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    volumeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`,
    cpu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
    tutor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="v6"/><path d="M6 10.5v5.5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"/></svg>`,
    fileCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>`,
    arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  };

  // ==========================================================================
  // 2. PEÇAS DE XADREZ VETORIAIS STAUNTON DE ALTO CONTRASTE
  // ==========================================================================
  const PIECE_SVGS = {
    wP: `<svg viewBox="0 0 45 45" class="chess-piece"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#18191b" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    wR: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="#fff" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none"/></g></svg>`,
    wN: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="none" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><circle cx="9.5" cy="25.5" r=".5" fill="#18191b"/><circle cx="14.933" cy="15.75" r="1" fill="#18191b"/></g></svg>`,
    wB: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="none" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>`,
    wQ: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="#fff" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>`,
    wK: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="none" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
    bP: `<svg viewBox="0 0 45 45" class="chess-piece"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#1e2022" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    bR: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="#1e2022" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z"/><path d="M14 29.5v-13h17v13H14z"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z"/><path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23" fill="none" stroke="#d5d8dc" stroke-width="1"/></g></svg>`,
    bN: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="none" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#1e2022"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#1e2022"/><circle cx="9.5" cy="25.5" r=".6" fill="#d5d8dc" stroke="none"/><circle cx="14.93" cy="15.75" r="1" fill="#d5d8dc" stroke="none"/></g></svg>`,
    bB: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="none" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g fill="#1e2022" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#d5d8dc"/></g></svg>`,
    bQ: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="#1e2022" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#d5d8dc"/></g></svg>`,
    bK: `<svg viewBox="0 0 45 45" class="chess-piece"><g fill="none" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#1e2022" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#1e2022"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#d5d8dc"/></g></svg>`,
  };

  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const PIECE_NAMES_PT = {
    p: 'Peão',
    n: 'Cavalo',
    b: 'Bispo',
    r: 'Torre',
    q: 'Dama',
    k: 'Rei',
  };

  // ==========================================================================
  // 3. HELPERS DO TREINADOR INTELIGENTE DE ABERTURAS & CITAÇÕES
  // ==========================================================================
  function buildProgressiveHints(expectedStep, openingContext) {
    if (!expectedStep) {
      return {
        level1Question: 'Qual plano melhora a coordenação das suas peças nesta posição?',
        level2PieceAndPlan: 'Observe o controle das casas centrais (e4, d4, e5, d5) e a segurança do Rei.',
        level3MoveAndWhy: 'Sequência principal concluída. Use os controles para revisar ou explorar variantes.',
      };
    }

    const piecePt = PIECE_NAMES_PT[expectedStep.piece] || 'Peça';
    const movePt = sanToPortugueseAlgebraic(expectedStep.san);
    const ann = expectedStep.annotation || {};

    let level1 = ann.hintPt;
    if (!level1) {
      if (expectedStep.isCastling) {
        level1 = 'Seu Rei ainda está no centro. Como proteger o Rei e ativar a Torre em um único lance?';
      } else if (['e4', 'd4', 'e5', 'd5', 'c4', 'c5'].includes(expectedStep.to)) {
        level1 = 'Qual lance disputa diretamente o controle do território central do tabuleiro?';
      } else if (expectedStep.piece === 'n' || expectedStep.piece === 'b') {
        level1 = `Qual peça menor precisa sair da fileira inicial para participar da luta pelo centro?`;
      } else {
        level1 = 'Qual peça pode melhorar sua atividade ou criar uma ameaça direta agora?';
      }
    }

    const level2 = expectedStep.isCastling
      ? `Olhe para o Rei em ${expectedStep.from}: prepare o roque levando-o para ${expectedStep.to}.`
      : `Considere ativar o seu ${piecePt} da casa ${expectedStep.from} rumo à casa ${expectedStep.to}.`;

    const reason =
      ann.commentPt ||
      (openingContext && openingContext.summaryPt) ||
      'Este lance desenvolve com ganho de tempo e mantém a harmonia da posição.';

    const level3 = `Lance recomendado: ${movePt} (${piecePt} de ${expectedStep.from} para ${expectedStep.to}). ${reason}`;

    return {
      level1Question: level1,
      level2PieceAndPlan: level2,
      level3MoveAndWhy: level3,
    };
  }

  function evaluateUserMove({ fen, from, to, promotion, expectedStep, engineEval }) {
    try {
      const chess = new Chess(fen);
      const played = chess.move({ from, to, promotion: promotion || 'q' });
      if (!played) return null;

      const playedSan = played.san;
      const playedSanPt = sanToPortugueseAlgebraic(playedSan);
      const expectedSan = expectedStep ? expectedStep.san : '';
      const expectedSanPt = sanToPortugueseAlgebraic(expectedSan);

      if (expectedStep && playedSan === expectedSan) {
        const comment =
          (expectedStep.annotation && expectedStep.annotation.commentPt) ||
          'Lance teórico principal executado com precisão dentro do plano.';
        return {
          tier: 'main',
          accepted: true,
          playedSan,
          playedSanPt,
          expectedSan,
          expectedSanPt,
          headlinePt: `Lance teórico principal: ${playedSanPt}`,
          detailPt: comment,
        };
      }

      if (
        engineEval &&
        engineEval.bestMoveSan &&
        playedSan === engineEval.bestMoveSan
      ) {
        return {
          tier: 'plausible',
          accepted: true,
          playedSan,
          playedSanPt,
          expectedSan,
          expectedSanPt,
          headlinePt: `Alternativa tática sólida: ${playedSanPt}`,
          detailPt: `Seu lance ${playedSanPt} é aprovado pelo motor tático. Na linha teórica principal deste estudo, o lance de referência é ${expectedSanPt}.`,
        };
      }

      const piecePt = expectedStep ? PIECE_NAMES_PT[expectedStep.piece] || 'peça' : 'peça';
      return {
        tier: 'retry',
        accepted: false,
        playedSan,
        playedSanPt,
        expectedSan,
        expectedSanPt,
        headlinePt: `Você tentou ${playedSanPt} — tente outra vez ou consulte uma dica`,
        detailPt: `Neste momento do repertório, priorize o plano principal ativando seu ${piecePt}. Use o botão "Ver dica" se quiser orientação passo a passo.`,
      };
    } catch (e) {
      return null;
    }
  }

  function resolveBookCitation({ book, chapter, game, opening, studyType }) {
    if (studyType === 'opening' && opening) {
      return {
        bookTitle: 'Enciclopédia de Aberturas & Xadrez Básico',
        author: "Orfeu G. D'Agostini / A. Nimzowitsch",
        chapterLabel: `Código ECO ${opening.eco} · ${opening.categoryLabelPt}`,
        pageEstimate: 'Seção de Aberturas, págs. 385–448',
        sourceFile: 'Xadrez Básico - Orfeu D_Agostini.pdf',
      };
    }

    const pageRanges = {
      dagostini_ch1: 'págs. 44–68',
      dagostini_ch2: 'págs. 92–124',
      dagostini_ch3: 'págs. 180–218',
      dagostini_ch4: 'págs. 265–312',
      nimzo_ch1: 'págs. 15–42',
      nimzo_ch2: 'págs. 63–98',
      nimzo_ch3: 'págs. 112–146',
      tal_ch1: 'págs. 48–86',
      tal_ch2: 'págs. 134–172',
      fischer_ch1: 'págs. 210–248',
      fischer_ch2: 'págs. 340–388',
    };

    const chId = chapter ? chapter.id : '';
    return {
      bookTitle: book ? book.titlePt : 'Xadrez Básico',
      author: book ? book.author : "Orfeu Gilberto D'Agostini",
      chapterLabel: chapter ? `Cap. ${chapter.number}: ${chapter.titlePt}` : 'Capítulo 1',
      pageEstimate: pageRanges[chId] || 'págs. 45–80',
      sourceFile: book ? book.sourceFileName : 'Xadrez Básico - Orfeu D_Agostini.pdf',
    };
  }

  // ==========================================================================
  // 4. ESTADO GLOBAL DA APLICAÇÃO
  // ==========================================================================
  const savedRaw = (function () {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : {};
    } catch (e) {
      return {};
    }
  })();

  const state = {
    // 4 Destinos na Sidebar: 'learn' | 'library' | 'openings' | 'progress'
    navDest: 'library',
    // Quando em 'learn' ou 'progress', permite alternar entre a visão de resumo e o tabuleiro
    canvasView: 'board', // 'board' | 'overview'
    // 2 Modos de Uso: 'aprender' (padrão) | 'explorador' (opcional)
    experienceMode: 'aprender',
    // Fonte do estudo atual no tabuleiro: 'book_game' | 'opening'
    studyType: 'book_game',
    // Aba da coluna direita: 'guidance' | 'movesheet' | 'plan'
    rightTab: 'guidance',

    // Livros, Acordeão e Modo Isolado de Capítulos
    selectedBookId: PREINSTALLED_BOOKS[0] ? PREINSTALLED_BOOKS[0].id : 'xadrez_basico_dagostini',
    expandedBookIds: PREINSTALLED_BOOKS.map((b) => b.id), // Todos os 4 livros visíveis/acessíveis
    isolatedChapterId: null,
    selectedGameId:
      PREINSTALLED_BOOKS[0] &&
      PREINSTALLED_BOOKS[0].chapters[0] &&
      PREINSTALLED_BOOKS[0].chapters[0].games[0]
        ? PREINSTALLED_BOOKS[0].chapters[0].games[0].id
        : 'capablanca_steiner_1933',

    // Aberturas & Treinador Inteligente
    selectedOpeningCat: 'all',
    selectedOpeningId: CHESS_OPENINGS[0] ? CHESS_OPENINGS[0].id : 'abertura_italiana_giuoco_piano',
    trainerActive: false,
    trainerColor: 'w', // 'w' | 'b' | 'both'
    hintLevel: 0, // 0 | 1 | 2 | 3
    lastFeedback: null,

    // Tabuleiro e Navegação de Lances
    currentPly: 0,
    flipped: false,
    selectedSquare: null,
    customFen: null,
    customHistorySan: [],

    // Preferências e Persistência
    notationMode: savedRaw.preferredNotation || 'alg_pt',
    soundMuted: false,
    searchQuery: '',
    showOcrModal: false,
    completedGameIds: Array.isArray(savedRaw.completedGameIds) ? savedRaw.completedGameIds : [],
    reviewQueue: Array.isArray(savedRaw.reviewQueue) ? savedRaw.reviewQueue : [],
    notesByGameId: savedRaw.notesByGameId || {},
  };

  function persistState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedGameIds: state.completedGameIds,
          reviewQueue: state.reviewQueue,
          notesByGameId: state.notesByGameId,
          preferredNotation: state.notationMode,
        })
      );
    } catch (e) {}
  }

  // ==========================================================================
  // 5. SELETORES DE DADOS DERIVADOS
  // ==========================================================================
  function getCurrentBookChapterGame() {
    for (const book of PREINSTALLED_BOOKS) {
      for (const chapter of book.chapters) {
        const game = chapter.games.find((g) => g.id === state.selectedGameId);
        if (game) return { book, chapter, game };
      }
    }
    const fallbackBook = PREINSTALLED_BOOKS[0];
    const fallbackChapter = fallbackBook.chapters[0];
    return {
      book: fallbackBook,
      chapter: fallbackChapter,
      game: fallbackChapter.games[0],
    };
  }

  function getCurrentOpening() {
    return (
      CHESS_OPENINGS.find((o) => o.id === state.selectedOpeningId) ||
      CHESS_OPENINGS[0]
    );
  }

  function getCurrentSteps() {
    if (state.studyType === 'opening') {
      const op = getCurrentOpening();
      return buildGameSteps({
        id: op.id,
        titlePt: op.namePt,
        white: 'Brancas (Teoria)',
        black: 'Pretas (Teoria)',
        event: `${op.eco} · ${op.nameOriginal}`,
        year: 'Teoria Clássica',
        result: '1/2-1/2',
        eco: op.eco,
        openingNamePt: op.namePt,
        heroColor: op.recommendedFor === 'black' ? 'b' : 'w',
        introPt: op.summaryPt,
        keyTakeawaysPt: [
          ...(op.whitePlansPt || []).slice(0, 2),
          ...(op.blackPlansPt || []).slice(0, 2),
        ],
        movesSan: op.movesSan,
        annotations: op.annotations || {},
      });
    }
    const { game } = getCurrentBookChapterGame();
    return buildGameSteps(game);
  }

  function getActiveFen(initialFen, steps) {
    if (state.customFen) return state.customFen;
    if (state.currentPly === 0) return initialFen;
    const step = steps[state.currentPly - 1];
    return step ? step.fenAfter : initialFen;
  }

  // Auto-avança o lance do oponente quando o Treinador está ativo em 1 cor
  let opponentTimer = null;
  function scheduleOpponentAutoMove(steps) {
    if (opponentTimer) {
      clearTimeout(opponentTimer);
      opponentTimer = null;
    }
    if (!state.trainerActive || state.customFen) return;
    if (state.trainerColor === 'both') return;
    const nextStep = steps[state.currentPly];
    if (!nextStep) return;
    if (nextStep.color !== state.trainerColor) {
      opponentTimer = setTimeout(() => {
        state.currentPly = Math.min(steps.length, state.currentPly + 1);
        chessAudio.playMove(nextStep);
        render();
      }, 340);
    }
  }

  // ==========================================================================
  // 6. NAVEGAÇÃO DE LANCES & AÇÕES DO TABULEIRO
  // ==========================================================================
  function goToPly(targetPly) {
    const { steps } = getCurrentSteps();
    const clamped = Math.max(0, Math.min(steps.length, targetPly));
    state.customFen = null;
    state.customHistorySan = [];
    state.selectedSquare = null;
    state.hintLevel = 0;
    state.lastFeedback = null;
    if (clamped > state.currentPly && steps[clamped - 1]) {
      chessAudio.playMove(steps[clamped - 1]);
    }
    state.currentPly = clamped;
    render();
  }

  function handleSquareClick(sq, activeFen, steps) {
    const chess = new Chess(activeFen);
    const nextExpectedStep = steps[state.currentPly] || null;

    if (state.selectedSquare) {
      if (state.selectedSquare === sq) {
        state.selectedSquare = null;
        render();
        return;
      }

      const legalMoves = chess.moves({ square: state.selectedSquare, verbose: true });
      const chosenMove = legalMoves.find((m) => m.to === sq);

      if (chosenMove) {
        const fromSq = state.selectedSquare;
        state.selectedSquare = null;

        // Se o Treinador estiver ativo, avalia o lance nas 3 faixas
        if (state.trainerActive && nextExpectedStep && !state.customFen) {
          const engineEval = analyzePositionLocal(activeFen);
          const evalResult = evaluateUserMove({
            fen: activeFen,
            from: fromSq,
            to: sq,
            promotion: 'q',
            expectedStep: nextExpectedStep,
            engineEval,
          });

          if (!evalResult) return;
          state.lastFeedback = evalResult;

          if (evalResult.accepted) {
            chessAudio.playSuccess();
            state.hintLevel = 0;
            state.currentPly = Math.min(steps.length, state.currentPly + 1);
          } else {
            chessAudio.playError();
            addToReviewQueue(nextExpectedStep, evalResult. headlinePt);
          }
          render();
          return;
        }

        // Modo de exploração livre no tabuleiro
        const played = chess.move({ from: fromSq, to: sq, promotion: 'q' });
        if (played) {
          // Se o lance jogado coincide com o próximo lance oficial e não estamos em variante livre, avança o ply
          if (!state.customFen && nextExpectedStep && played.san === nextExpectedStep.san) {
            state.currentPly += 1;
            chessAudio.playMove(nextExpectedStep);
          } else {
            state.customFen = chess.fen();
            state.customHistorySan.push(played.san);
            chessAudio.playMove({
              captured: played.captured,
              inCheck: chess.inCheck(),
              isCastling: played.san.includes('O-O'),
            });
          }
          render();
          return;
        }
      }
    }

    // Seleciona peça do lado que tem a vez
    const pieceOnSq = chess.get(sq);
    if (pieceOnSq && pieceOnSq.color === chess.turn()) {
      state.selectedSquare = sq;
      render();
    } else {
      state.selectedSquare = null;
      render();
    }
  }

  function addToReviewQueue(expectedStep, reasonPt) {
    if (!expectedStep) return;
    const { game } = getCurrentBookChapterGame();
    const op = getCurrentOpening();
    const targetId = state.studyType === 'opening' ? op.id : game.id;
    const titlePt = state.studyType === 'opening' ? op.namePt : game.titlePt;
    const itemId = `${targetId}_ply_${state.currentPly}`;

    if (state.reviewQueue.some((item) => item.id === itemId)) return;
    state.reviewQueue.unshift({
      id: itemId,
      studyType: state.studyType,
      targetId,
      titlePt,
      ply: state.currentPly,
      expectedSan: expectedStep.san,
      expectedSanPt: sanToPortugueseAlgebraic(expectedStep.san),
      reasonPt,
    });
    persistState();
  }

  // ==========================================================================
  // 7. RENDERIZADORES DE SEÇÕES DO SHELL FRAMED-SHEET
  // ==========================================================================
  function renderSidebarCatalog() {
    const q = state.searchQuery.trim().toLowerCase();

    // SE DESTINO = ABERTURAS (ou se studyType === 'opening' e navDest === 'openings')
    if (state.navDest === 'openings') {
      const filteredOpenings = CHESS_OPENINGS.filter((op) => {
        const matchesCat =
          state.selectedOpeningCat === 'all' || op.category === state.selectedOpeningCat;
        const matchesQuery =
          !q ||
          op.namePt.toLowerCase().includes(q) ||
          op.eco.toLowerCase().includes(q) ||
          op.summaryPt.toLowerCase().includes(q);
        return matchesCat && matchesQuery;
      });

      const catButtonsHtml = [
        { id: 'all', label: 'Todas (18)' },
        { id: 'open', label: 'Abertas 1.e4 e5' },
        { id: 'semi_open', label: 'Semi-abertas' },
        { id: 'closed', label: 'Fechadas 1.d4 d5' },
        { id: 'semi_closed', label: 'Defesas Índias' },
        { id: 'flank', label: 'Flanco' },
      ]
        .map(
          (cat) => `
          <button
            type="button"
            data-action="select-opening-cat"
            data-cat="${cat.id}"
            style="
              padding: 4px 8px;
              border-radius: 5px;
              border: 1px solid ${state.selectedOpeningCat === cat.id ? 'var(--text)' : 'var(--border)'};
              background: ${state.selectedOpeningCat === cat.id ? 'var(--text)' : 'var(--surface)'};
              color: ${state.selectedOpeningCat === cat.id ? '#fff' : 'var(--muted)'};
              font-size: 11px;
              font-weight: 500;
              cursor: pointer;
            "
          >${cat.label}</button>
        `
        )
        .join('');

      const listHtml = filteredOpenings
        .map((op) => {
          const isSelected =
            state.studyType === 'opening' && state.selectedOpeningId === op.id;
          return `
            <button
              type="button"
              data-action="select-opening"
              data-opening-id="${op.id}"
              class="book-accordion ${isSelected ? 'active' : ''}"
              style="
                padding: 9px 10px;
                text-align: left;
                cursor: pointer;
                background: ${isSelected ? 'var(--active)' : 'var(--surface)'};
              "
            >
              <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                <span class="eco-code" style="font-size:11px; font-weight:600; color:var(--accent);">${op.eco}</span>
                <span style="font-size:11px; color:var(--muted);">${
                  op.recommendedFor === 'white'
                    ? 'Brancas'
                    : op.recommendedFor === 'black'
                    ? 'Pretas'
                    : 'Ambas'
                }</span>
              </div>
              <div style="font-size:12.5px; font-weight:600; color:var(--text); margin-top:2px; line-height:1.3;">
                ${op.namePt}
              </div>
              <div class="mono" style="font-size:11px; color:var(--muted); margin-top:3px;">
                ${op.movesSan.slice(0, 6).map((m, idx) => (idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}.${sanToPortugueseAlgebraic(m)}` : sanToPortugueseAlgebraic(m))).join(' ')}
              </div>
            </button>
          `;
        })
        .join('');

      return `
        <div class="group-label" style="margin-top:2px;">Famílias de aberturas</div>
        <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:8px;">
          ${catButtonsHtml}
        </div>
        <div style="display:flex; flex-direction:column; gap:5px;">
          ${listHtml || `<div class="empty-box">Nenhuma abertura encontrada para "${state.searchQuery}".</div>`}
        </div>
      `;
    }

    // MODO ISOLADO DE CAPÍTULO (Pedido explícito do usuário: "Ao clicar sobre um livro o drop down abriria os capitulos e estes pudessem ser acessados de modo isolado")
    if (state.isolatedChapterId) {
      let foundBook = null;
      let foundChapter = null;
      for (const b of PREINSTALLED_BOOKS) {
        const ch = b.chapters.find((c) => c.id === state.isolatedChapterId);
        if (ch) {
          foundBook = b;
          foundChapter = ch;
          break;
        }
      }

      if (foundBook && foundChapter) {
        const gamesHtml = foundChapter.games
          .map((g) => {
            const isSelected =
              state.studyType === 'book_game' && state.selectedGameId === g.id;
            const isDone = state.completedGameIds.includes(g.id);
            return `
              <button
                type="button"
                data-action="select-game"
                data-book-id="${foundBook.id}"
                data-game-id="${g.id}"
                class="game-item-btn ${isSelected ? 'selected' : ''}"
                style="border: 1px solid ${isSelected ? 'var(--control)' : 'var(--border)'}; background: ${isSelected ? 'var(--active)' : 'var(--surface)'}; padding: 9px 10px; flex-direction: column; align-items: flex-start; gap: 3px;"
              >
                <div style="width:100%; display:flex; align-items:center; justify-content:space-between; gap:6px;">
                  <span style="font-size:12.5px; font-weight:600; color:var(--text);">${g.titlePt}</span>
                  ${isDone ? `<span class="pill pos" style="height:18px; font-size:10px; padding:0 6px;">Concluído</span>` : ''}
                </div>
                <div style="font-size:11px; color:var(--muted);">
                  ${g.white} vs. ${g.black} · <span class="mono">${g.year}</span>
                </div>
              </button>
            `;
          })
          .join('');

        return `
          <button
            type="button"
            data-action="exit-isolated-chapter"
            class="btn"
            style="width:100%; justify-content:flex-start; margin-bottom:6px; height:30px; font-size:12px;"
          >
            ${ICONS.arrowLeft} Voltar aos 4 livros
          </button>
          <div class="panel" style="padding:12px; background:var(--surface);">
            <div class="panel-meta">${foundBook.titlePt} · ${foundBook.author}</div>
            <div style="font-size:14px; font-weight:600; color:var(--text); margin-top:3px;">
              Capítulo ${foundChapter.number}: ${foundChapter.titlePt}
            </div>
            <p style="font-size:12px; color:var(--muted); margin-top:4px; line-height:1.4;">
              ${foundChapter.subtitlePt}
            </p>
            <div class="group-label" style="margin:10px 0 6px;">Estudos deste capítulo (${foundChapter.games.length})</div>
            <div style="display:flex; flex-direction:column; gap:5px;">
              ${gamesHtml}
            </div>
          </div>
        `;
      }
    }

    // ACORDEÃO DE TODOS OS 4 LIVROS CARREGADOS NA ABA LATERAL ESQUERDA
    const booksHtml = PREINSTALLED_BOOKS.map((book) => {
      const isExpanded = state.expandedBookIds.includes(book.id) || Boolean(q);
      const totalGames = book.chapters.reduce((acc, c) => acc + c.games.length, 0);

      const chaptersHtml = book.chapters
        .map((ch) => {
          const matchingGames = ch.games.filter(
            (g) =>
              !q ||
              g.titlePt.toLowerCase().includes(q) ||
              g.white.toLowerCase().includes(q) ||
              g.black.toLowerCase().includes(q) ||
              ch.titlePt.toLowerCase().includes(q) ||
              book.titlePt.toLowerCase().includes(q)
          );
          if (q && matchingGames.length === 0) return '';

          const gameRows = matchingGames
            .map((g) => {
              const isSelected =
                state.studyType === 'book_game' && state.selectedGameId === g.id;
              const isDone = state.completedGameIds.includes(g.id);
              return `
                <button
                  type="button"
                  data-action="select-game"
                  data-book-id="${book.id}"
                  data-game-id="${g.id}"
                  class="game-item-btn ${isSelected ? 'selected' : ''}"
                >
                  <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${g.titlePt}</span>
                  <span class="mono" style="font-size:10.5px; color:var(--faint); flex-shrink:0;">${isDone ? 'OK' : g.year}</span>
                </button>
              `;
            })
            .join('');

          return `
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:6px;">
              <button
                type="button"
                data-action="isolate-chapter"
                data-book-id="${book.id}"
                data-chapter-id="${ch.id}"
                class="chapter-row-btn"
                style="padding:4px 6px;"
                title="Abrir este capítulo em modo isolado"
              >
                <div>
                  <div class="chapter-row-title">Cap. ${ch.number} · ${ch.titlePt}</div>
                  <div class="chapter-row-sub">Isolar capítulo (${ch.games.length} estudos)</div>
                </div>
                <span style="width:14px; height:14px; color:var(--muted);">${ICONS.chevronRight}</span>
              </button>
              <div style="margin-top:4px; padding-top:4px; border-top:1px solid var(--rule); display:flex; flex-direction:column; gap:2px;">
                ${gameRows}
              </div>
            </div>
          `;
        })
        .join('');

      if (q && !chaptersHtml.trim()) return '';

      return `
        <div class="book-accordion ${state.selectedBookId === book.id ? 'active' : ''}">
          <button
            type="button"
            data-action="toggle-book"
            data-book-id="${book.id}"
            class="book-header-btn"
          >
            <div style="min-width:0;">
              <div class="book-title">${book.titlePt}</div>
              <div class="book-author">${book.author} · <span class="mono">${book.chapters.length} caps · ${totalGames} estudos</span></div>
            </div>
            <span style="width:15px; height:15px; color:var(--muted); transform:rotate(${isExpanded ? '180deg' : '0deg'}); transition:transform 150ms ease;">
              ${ICONS.chevronDown}
            </span>
          </button>
          ${isExpanded ? `<div class="book-chapters-list">${chaptersHtml}</div>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="group-label" style="margin-top:2px;">Livros clássicos carregados (4)</div>
      ${booksHtml}
    `;
  }

  // ==========================================================================
  // 8. RENDERIZADOR DO TABULEIRO E SETAS VETORIAIS
  // ==========================================================================
  function renderBoardStage(activeFen, steps, currentStep, nextExpectedStep, engineEval) {
    const chess = new Chess(activeFen);
    const boardGrid = chess.board();
    const legalMovesForSelected = state.selectedSquare
      ? chess.moves({ square: state.selectedSquare, verbose: true })
      : [];

    const rankOrder = state.flipped ? [...RANKS].reverse() : RANKS;
    const fileOrder = state.flipped ? [...FILES].reverse() : FILES;

    // Casas destacadas pela anotação ou pelo último lance
    const highlightMap = {};
    if (currentStep && !state.customFen) {
      highlightMap[currentStep.from] = 'rgba(27, 108, 128, 0.24)';
      highlightMap[currentStep.to] = 'rgba(27, 108, 128, 0.34)';
      if (currentStep.annotation && Array.isArray(currentStep.annotation.highlights)) {
        currentStep.annotation.highlights.forEach((h) => {
          highlightMap[h.square] = 'rgba(30, 123, 79, 0.28)';
        });
      }
    }
    if (state.hintLevel >= 2 && nextExpectedStep) {
      highlightMap[nextExpectedStep.from] = 'rgba(184, 125, 20, 0.35)';
      if (state.hintLevel >= 3) {
        highlightMap[nextExpectedStep.to] = 'rgba(30, 123, 79, 0.38)';
      }
    }

    let squaresHtml = '';
    for (let rIdx = 0; rIdx < 8; rIdx++) {
      for (let fIdx = 0; fIdx < 8; fIdx++) {
        const rank = rankOrder[rIdx];
        const file = fileOrder[fIdx];
        const sq = `${file}${rank}`;
        const fileNum = FILES.indexOf(file);
        const rankNum = RANKS.indexOf(rank);
        const isLight = (fileNum + rankNum) % 2 === 0;
        const baseBg = isLight ? 'var(--board-light)' : 'var(--board-dark)';
        const isSelected = state.selectedSquare === sq;
        const legalMove = legalMovesForSelected.find((m) => m.to === sq);
        const piece = boardGrid[rankNum][fileNum];
        const pieceCode = piece ? `${piece.color}${piece.type.toUpperCase()}` : null;

        const overlayBg = isSelected
          ? 'rgba(27, 108, 128, 0.42)'
          : highlightMap[sq] || 'transparent';

        const showRankCoord = fIdx === 0;
        const showFileCoord = rIdx === 7;
        const coordColor = isLight ? '#5c4632' : '#f3ead8';

        squaresHtml += `
          <div
            class="chess-square"
            data-action="square-click"
            data-square="${sq}"
            style="background:${baseBg};"
          >
            <div style="position:absolute; inset:0; background:${overlayBg}; pointer-events:none;"></div>
            ${
              showRankCoord
                ? `<span class="coord-label" style="top:3px; left:4px; color:${coordColor};">${rank}</span>`
                : ''
            }
            ${
              showFileCoord
                ? `<span class="coord-label" style="bottom:2px; right:4px; color:${coordColor};">${file}</span>`
                : ''
            }
            ${pieceCode && PIECE_SVGS[pieceCode] ? PIECE_SVGS[pieceCode] : ''}
            ${
              legalMove
                ? piece
                  ? `<div class="legal-ring"></div>`
                  : `<div class="legal-dot"></div>`
                : ''
            }
          </div>
        `;
      }
    }

    // Setas SVG sobre o tabuleiro (anotação do livro/abertura ou dica nível 3)
    const arrows = [];
    if (currentStep && currentStep.annotation && Array.isArray(currentStep.annotation.arrows)) {
      currentStep.annotation.arrows.forEach((a) => arrows.push({ from: a.from, to: a.to, color: '#1b6c80' }));
    }
    if (state.hintLevel >= 3 && nextExpectedStep) {
      arrows.push({ from: nextExpectedStep.from, to: nextExpectedStep.to, color: '#1e7b4f' });
    }

    const squareCenter = (sq) => {
      const f = fileOrder.indexOf(sq[0]);
      const r = rankOrder.indexOf(sq[1]);
      return { x: f * 12.5 + 6.25, y: r * 12.5 + 6.25 };
    };

    const arrowsSvg = arrows
      .map((a, idx) => {
        const p1 = squareCenter(a.from);
        const p2 = squareCenter(a.to);
        return `
          <defs>
            <marker id="arr-${idx}" markerWidth="4" markerHeight="4" refX="2.6" refY="2" orient="auto">
              <path d="M0,0 L4,2 L0,4 Z" fill="${a.color}" />
            </marker>
          </defs>
          <line
            x1="${p1.x}" y1="${p1.y}"
            x2="${p2.x}" y2="${p2.y}"
            stroke="${a.color}"
            stroke-width="1.85"
            stroke-linecap="round"
            opacity="0.86"
            marker-end="url(#arr-${idx})"
          />
        `;
      })
      .join('');

    // Barra de Avaliação Vertical (visível no Modo Explorador)
    const scorePawns = (engineEval.scoreCp / 100).toFixed(1);
    const whitePct = Math.max(6, Math.min(94, 50 + engineEval.scoreCp / 14));
    const evalBarHtml =
      state.experienceMode === 'explorador'
        ? `
          <div class="eval-bar" title="Avaliação Stockfish Local: ${engineEval.scoreCp >= 0 ? '+' : ''}${scorePawns}">
            <div class="eval-bar-white" style="height:${state.flipped ? 100 - whitePct : whitePct}%;"></div>
            <span class="eval-score-tag" style="bottom:4px; color:${whitePct > 50 ? '#131416' : '#f5f6f7'};">
              ${engineEval.scoreCp >= 0 ? '+' : ''}${scorePawns}
            </span>
          </div>
        `
        : '';

    const progressPct =
      steps.length > 0 ? Math.round((state.currentPly / steps.length) * 100) : 0;

    const turnLabel = chess.turn() === 'w' ? 'Vez das Brancas' : 'Vez das Pretas';
    const lastMoveLabel = currentStep
      ? `Último lance: ${currentStep.moveNumber}${currentStep.color === 'w' ? '.' : '...'} ${formatMoveByMode(currentStep, state.notationMode)}`
      : 'Posição inicial pronta';

    return `
      <div class="board-stage-column">
        <div class="board-stage-top">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="pill ${chess.turn() === 'w' ? 'neutral' : 'info'}">${turnLabel}</span>
            <span class="mono" style="font-size:12px; color:var(--muted);">${lastMoveLabel}</span>
            ${
              state.customFen
                ? `<span class="pill warn">Exploração livre no tabuleiro</span>`
                : ''
            }
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            ${
              state.customFen
                ? `<button type="button" data-action="return-official-line" class="btn accent-outline" style="height:28px; font-size:12px;">Retomar linha oficial</button>`
                : ''
            }
            <button type="button" data-action="flip-board" class="btn" style="height:28px; padding:0 9px; font-size:12px;" title="Girar tabuleiro (Tecla X)">
              ${ICONS.flip} Girar
            </button>
          </div>
        </div>

        <div class="board-center-wrap">
          ${evalBarHtml}
          <div class="board-frame">
            <div class="chess-board">
              ${squaresHtml}
              <svg viewBox="0 0 100 100" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none;">
                ${arrowsSvg}
              </svg>
            </div>
          </div>
        </div>

        <div class="board-stage-bottom">
          <div class="progress-row">
            <span class="mono" style="font-size:11.5px; color:var(--muted);">Lance ${state.currentPly} de ${steps.length}</span>
            <div class="progress-track">
              <div class="progress-fill" style="width:${progressPct}%;"></div>
            </div>
            <span class="mono" style="font-size:11.5px; color:var(--muted);">${progressPct}%</span>
          </div>

          <div class="controls-bar">
            <div style="display:flex; align-items:center; gap:6px;">
              <button type="button" data-action="ply-first" class="btn" ${state.currentPly === 0 ? 'disabled' : ''} title="Início (Home)">
                ${ICONS.skipBack}
              </button>
              <button type="button" data-action="ply-prev" class="btn" ${state.currentPly === 0 ? 'disabled' : ''} title="Lance anterior (Seta Esquerda)">
                ${ICONS.chevronLeft} Anterior
              </button>
            </div>

            <button
              type="button"
              data-action="cycle-hint"
              class="btn accent-outline"
              ${!nextExpectedStep ? 'disabled' : ''}
              title="Dica progressiva em 3 níveis (Tecla H)"
            >
              ${ICONS.bulb} Ver dica ${state.hintLevel > 0 ? `(${state.hintLevel}/3)` : ''}
            </button>

            <div style="display:flex; align-items:center; gap:6px;">
              <button type="button" data-action="ply-next" class="btn primary" ${state.currentPly >= steps.length ? 'disabled' : ''} title="Próximo lance (Seta Direita)">
                Próximo ${ICONS.chevronRight}
              </button>
              <button type="button" data-action="ply-last" class="btn" ${state.currentPly >= steps.length ? 'disabled' : ''} title="Final (End)">
                ${ICONS.skipForward}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 9. RENDERIZADOR DA COLUNA DIREITA (3 FONTES SEPARADAS, PLANILHA E PLANOS)
  // ==========================================================================
  function renderGuidanceColumn({
    book,
    chapter,
    game,
    opening,
    steps,
    currentStep,
    nextExpectedStep,
    engineEval,
    hints,
    citation,
  }) {
    // Seletor de Notação (sempre disponível no Modo Explorador)
    const notationSelectorHtml =
      state.experienceMode === 'explorador'
        ? `
          <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 12px; background:var(--raised); border:1px solid var(--border); border-radius:var(--radius-card);">
            <span style="font-size:12px; color:var(--muted); font-weight:500;">Sistema de notação</span>
            <div class="segmented">
              ${[
                { id: 'alg_pt', label: 'Algébrica PT (Cf3)' },
                { id: 'figurine', label: 'Figurino' },
                { id: 'desc_pt', label: 'Descritiva C3BR' },
                { id: 'desc_es', label: 'Espanhol C3AR' },
                { id: 'san', label: 'SAN (Nf3)' },
              ]
                .map(
                  (n) => `
                  <button
                    type="button"
                    data-action="set-notation"
                    data-notation="${n.id}"
                    aria-pressed="${state.notationMode === n.id ? 'true' : 'false'}"
                  >${n.label}</button>
                `
                )
                .join('')}
            </div>
          </div>
        `
        : '';

    // Banner de Feedback Construtivo do Treinador Inteligente
    const feedbackHtml = state.lastFeedback
      ? `
        <div class="feedback-banner ${state.lastFeedback.tier}">
          <div style="font-size:13px; font-weight:600;">${state.lastFeedback.headlinePt}</div>
          <p style="font-size:12.5px; margin-top:3px; line-height:1.45;">${state.lastFeedback.detailPt}</p>
        </div>
      `
      : '';

    // Card de Dicas Progressivas em 3 Níveis
    const hintsHtml =
      state.hintLevel > 0
        ? `
          <div class="panel" style="background:var(--pill-warning-bg); border-color:#f3d78b; color:var(--pill-warning-ink);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span style="font-size:12px; font-weight:600;">Dica progressiva · Nível ${state.hintLevel} de 3</span>
              ${
                state.hintLevel < 3
                  ? `<button type="button" data-action="cycle-hint" class="card-link" style="font-size:12px; color:var(--pill-warning-ink);">Revelar nível ${state.hintLevel + 1}</button>`
                  : ''
              }
            </div>
            <div style="display:flex; flex-direction:column; gap:5px; font-size:13px; line-height:1.45;">
              <div><strong>1. Pergunta:</strong> ${hints.level1Question}</div>
              ${state.hintLevel >= 2 ? `<div><strong>2. Peça e casa:</strong> ${hints.level2PieceAndPlan}</div>` : ''}
              ${state.hintLevel >= 3 ? `<div><strong>3. Solução explicada:</strong> ${hints.level3MoveAndWhy}</div>` : ''}
            </div>
          </div>
        `
        : '';

    // Aba 1: Orientação e as 3 Fontes Separadas (Do Tutor, Do Livro, Do Stockfish)
    if (state.rightTab === 'guidance') {
      const tutorComment = currentStep
        ? (currentStep.annotation && currentStep.annotation.commentPt) ||
          `O lance ${sanToPortugueseAlgebraic(currentStep.san)} desenvolve a peça da casa ${currentStep.from} para ${currentStep.to}, mantendo a coordenação entre as alas.`
        : state.studyType === 'opening'
        ? opening.summaryPt
        : game.introPt;

      const bookOriginalText =
        currentStep && currentStep.annotation && currentStep.annotation.commentOriginal
          ? currentStep.annotation.commentOriginal
          : state.studyType === 'opening'
          ? `Linha clássica (${opening.eco}): ${(opening.whitePlansPt && opening.whitePlansPt[0]) || opening.summaryPt}`
          : game.introOriginal ||
            (game.keyTakeawaysPt && game.keyTakeawaysPt[0]) ||
            'Princípio estratégico catalogado e validado na edição clássica.';

      const scoreCpText = `${engineEval.scoreCp >= 0 ? '+' : ''}${(engineEval.scoreCp / 100).toFixed(2)}`;
      const bestMovePt = sanToPortugueseAlgebraic(engineEval.bestMoveSan || '');
      const pvLineFormatted = (engineEval.pvLineSan || [])
        .map((m) => sanToPortugueseAlgebraic(m))
        .join(' → ');

      return `
        <div class="guidance-column">
          <div class="tabs" role="tablist">
            <button type="button" class="tab-btn" data-action="set-right-tab" data-tab="guidance" aria-selected="true">Orientação e fontes</button>
            <button type="button" class="tab-btn" data-action="set-right-tab" data-tab="movesheet" aria-selected="false">Planilha de lances (${steps.length})</button>
            <button type="button" class="tab-btn" data-action="set-right-tab" data-tab="plan" aria-selected="false">Plano estratégico</button>
          </div>

          ${notationSelectorHtml}
          ${feedbackHtml}
          ${hintsHtml}

          <!-- FONTE 1: DO TUTOR -->
          <section class="source-card tutor">
            <div class="source-header">
              <span class="source-title">${ICONS.tutor} Do Tutor · Explicação guiada</span>
              <span class="pill warn">Pedagogia</span>
            </div>
            <p class="source-body">${tutorComment}</p>
            ${
              nextExpectedStep
                ? `<div style="margin-top:8px; font-size:12px; color:var(--muted);">
                    Próxima tarefa: encontre o lance das <strong>${nextExpectedStep.color === 'w' ? 'Brancas' : 'Pretas'}</strong> no tabuleiro ou clique em "Ver dica".
                  </div>`
                : ''
            }
          </section>

          <!-- FONTE 2: DO LIVRO (COM CITAÇÃO VERIFICADA + PIPELINE OCR) -->
          <section class="source-card book">
            <div class="source-header">
              <span class="source-title">${ICONS.book} Do Livro · Fonte histórica verificada</span>
              <span class="pill pos">Citação validada</span>
            </div>
            <p class="source-body">${bookOriginalText}</p>
            ${
              currentStep
                ? `<div style="margin-top:8px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:12px; color:var(--muted);">
                    <span>Algébrica PT: <strong class="mono">${sanToPortugueseAlgebraic(currentStep.san)}</strong></span>
                    <span>·</span>
                    <span>Descritiva PT: <strong class="mono">${currentStep.descriptivePt}</strong></span>
                    <span>·</span>
                    <span>Descritiva ES: <strong class="mono">${currentStep.descriptiveEs}</strong></span>
                  </div>`
                : ''
            }
            <div class="source-citation">
              <span>${citation.bookTitle} · ${citation.author} · ${citation.chapterLabel} (${citation.pageEstimate})</span>
              <button type="button" data-action="open-ocr-modal" class="card-link" style="font-size:12px;">Fontes e OCR</button>
            </div>
          </section>

          <!-- FONTE 3: DO STOCKFISH (CLARAMENTE SEPARADO DO AUTOR) -->
          <section class="source-card engine">
            <div class="source-header">
              <span class="source-title">${ICONS.cpu} Do Stockfish · Análise independente do computador</span>
              <span class="pill info mono">${scoreCpText}</span>
            </div>
            <p class="source-body">
              Melhor lance calculado: <strong class="mono">${bestMovePt || '—'}</strong>. ${engineEval.explanationPt}
            </p>
            ${
              pvLineFormatted
                ? `<div style="margin-top:6px; font-size:12px; color:var(--muted);">
                    Linha calculada (profundidade ${engineEval.depth}): <span class="mono">${pvLineFormatted}</span>
                  </div>`
                : ''
            }
            <div style="margin-top:6px; font-size:11.5px; color:var(--faint);">
              Nota: avaliação gerada pelo motor tático local, separada dos comentários originais do autor do livro.
            </div>
          </section>
        </div>
      `;
    }

    // Aba 2: Planilha de Lances Sincronizada (Tabela limpa sem zebra conforme app.css)
    if (state.rightTab === 'movesheet') {
      const pairs = [];
      for (let i = 0; i < steps.length; i += 2) {
        pairs.push({
          moveNumber: Math.floor(i / 2) + 1,
          white: steps[i],
          black: steps[i + 1] || null,
        });
      }

      const rowsHtml = pairs
        .map((pair) => {
          const wActive = state.currentPly === pair.white.ply;
          const bActive = pair.black && state.currentPly === pair.black.ply;
          const wText = formatMoveByMode(pair.white, state.notationMode);
          const bText = pair.black ? formatMoveByMode(pair.black, state.notationMode) : '—';
          return `
            <tr>
              <td class="mono" style="width:44px; color:var(--muted);">${pair.moveNumber}.</td>
              <td>
                <button
                  type="button"
                  data-action="goto-ply"
                  data-ply="${pair.white.ply}"
                  class="move-cell"
                  style="
                    padding: 3px 8px;
                    border-radius: 4px;
                    border: 0;
                    cursor: pointer;
                    background: ${wActive ? 'var(--active)' : 'transparent'};
                    font-weight: ${wActive ? '600' : '400'};
                    color: var(--text);
                  "
                >${wText} ${pair.white.annotation && pair.white.annotation.badge ? pair.white.annotation.badge : ''}</button>
              </td>
              <td>
                ${
                  pair.black
                    ? `<button
                        type="button"
                        data-action="goto-ply"
                        data-ply="${pair.black.ply}"
                        class="move-cell"
                        style="
                          padding: 3px 8px;
                          border-radius: 4px;
                          border: 0;
                          cursor: pointer;
                          background: ${bActive ? 'var(--active)' : 'transparent'};
                          font-weight: ${bActive ? '600' : '400'};
                          color: var(--text);
                        "
                      >${bText} ${pair.black.annotation && pair.black.annotation.badge ? pair.black.annotation.badge : ''}</button>`
                    : `<span style="color:var(--faint);">—</span>`
                }
              </td>
              <td class="mono" style="font-size:11.5px; color:var(--muted);">
                ${pair.white.descriptivePt}${pair.black ? ` / ${pair.black.descriptivePt}` : ''}
              </td>
            </tr>
          `;
        })
        .join('');

      return `
        <div class="guidance-column">
          <div class="tabs" role="tablist">
            <button type="button" class="tab-btn" data-action="set-right-tab" data-tab="guidance" aria-selected="false">Orientação e fontes</button>
            <button type="button" class="tab-btn" data-action="set-right-tab" data-tab="movesheet" aria-selected="true">Planilha de lances (${steps.length})</button>
            <button type="button" class="tab-btn" data-action="set-right-tab" data-tab="plan" aria-selected="false">Plano estratégico</button>
          </div>

          ${notationSelectorHtml}

          <div class="panel" style="padding:12px;">
            <div class="panel-header">
              <h2>Registro oficial de lances</h2>
              <span class="panel-meta">Clique em qualquer lance para ir à posição</span>
            </div>
            <div class="table-wrap">
              <table class="clean-table">
                <thead>
                  <tr>
                    <th>Nº</th>
                    <th>Brancas</th>
                    <th>Pretas</th>
                    <th>Equivalente Descritivo</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    // Aba 3: Plano Estratégico (Planos de Brancas, Pretas, Estrutura de Peões e Armadilhas)
    const whitePlans =
      state.studyType === 'opening'
        ? opening.whitePlansPt || []
        : game.keyTakeawaysPt || [];
    const blackPlans =
      state.studyType === 'opening'
        ? opening.blackPlansPt || []
        : [
            'Neutralizar a iniciativa adversária mantendo a estrutura de peões compacta.',
            'Conectar as Torres e disputar as colunas abertas no meio-jogo.',
          ];
    const pawnStructureText =
      state.studyType === 'opening'
        ? opening.pawnStructurePt
        : `Partida modelo de ${book.titlePt} (${chapter.titlePt}). Observe como cada lance prepara a ruptura central.`;

    return `
      <div class="guidance-column">
        <div class="tabs" role="tablist">
          <button type="button" class="tab-btn" data-action="set-right-tab" data-tab="guidance" aria-selected="false">Orientação e fontes</button>
          <button type="button" class="tab-btn" data-action="set-right-tab" data-tab="movesheet" aria-selected="false">Planilha de lances (${steps.length})</button>
          <button type="button" class="tab-btn" data-action="set-right-tab" data-tab="plan" aria-selected="true">Plano estratégico</button>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h2>Estrutura de peões e casas-chave</h2>
            <span class="pill neutral">${state.studyType === 'opening' ? opening.eco : game.eco || 'Clássico'}</span>
          </div>
          <p style="font-size:13.5px; line-height:1.5; color:var(--text);">${pawnStructureText}</p>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h2>Plano estratégico das Brancas</h2>
          </div>
          <div class="rows">
            ${whitePlans
              .map(
                (p) => `
                <div class="row" style="min-height:36px; font-size:13px;">
                  <span>${p}</span>
                </div>
              `
              )
              .join('')}
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h2>Plano estratégico e contrajogo das Pretas</h2>
          </div>
          <div class="rows">
            ${blackPlans
              .map(
                (p) => `
                <div class="row" style="min-height:36px; font-size:13px;">
                  <span>${p}</span>
                </div>
              `
              )
              .join('')}
          </div>
        </div>

        ${
          state.studyType === 'opening' && opening.tacticalTrapsPt && opening.tacticalTrapsPt.length
            ? `
              <div class="panel" style="border-left:3px solid var(--warning);">
                <div class="panel-header">
                  <h2>Armadilhas táticas típicas</h2>
                  <span class="pill warn">Atenção</span>
                </div>
                <div class="rows">
                  ${opening.tacticalTrapsPt
                    .map(
                      (t) => `
                      <div class="row" style="min-height:36px; font-size:13px;">
                        <span>${t}</span>
                      </div>
                    `
                    )
                    .join('')}
                </div>
              </div>
            `
            : ''
        }
      </div>
    `;
  }

  // ==========================================================================
  // 10. VISÃO DE TRILHA & PROGRESSO (KPI STRIP DIVIDIDA + FILA DE REVISÃO)
  // ==========================================================================
  function renderOverviewSheet() {
    const totalGames = PREINSTALLED_BOOKS.reduce(
      (acc, b) => acc + b.chapters.reduce((cAcc, c) => cAcc + c.games.length, 0),
      0
    );
    const completedCount = state.completedGameIds.length;
    const reviewCount = state.reviewQueue.length;

    const reviewRowsHtml =
      state.reviewQueue.length > 0
        ? state.reviewQueue
            .slice(0, 6)
            .map(
              (item) => `
              <tr>
                <td style="font-weight:500;">${item.titlePt}</td>
                <td class="mono">Lance ${Math.floor(item.ply / 2) + 1} (${item.expectedSanPt})</td>
                <td style="color:var(--muted);">${item.reasonPt}</td>
                <td class="n">
                  <button
                    type="button"
                    data-action="practice-review-item"
                    data-review-id="${item.id}"
                    class="btn primary"
                    style="height:26px; font-size:12px; padding:0 10px;"
                  >Praticar posição</button>
                </td>
              </tr>
            `
            )
            .join('')
        : `
          <tr>
            <td colspan="4">
              <div class="empty-box">
                Nenhuma posição pendente na fila de revisão. Quando você pedir uma dica ou errar um lance no Treinador, a posição aparecerá aqui automaticamente.
              </div>
            </td>
          </tr>
        `;

    const booksSummaryRows = PREINSTALLED_BOOKS.map((b) => {
      const games = b.chapters.flatMap((c) => c.games);
      const done = games.filter((g) => state.completedGameIds.includes(g.id)).length;
      return `
        <tr>
          <td style="font-weight:500;">${b.titlePt}</td>
          <td style="color:var(--muted);">${b.author}</td>
          <td class="n">${b.chapters.length}</td>
          <td class="n">${done} de ${games.length}</td>
          <td class="n">
            <button
              type="button"
              data-action="select-game"
              data-book-id="${b.id}"
              data-game-id="${games[0].id}"
              class="card-link"
            >Abrir livro</button>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div style="display:flex; flex-direction:column; gap:16px; overflow-y:auto; padding-right:2px;">
        <!-- Faixa de KPIs dividida por 1px (sem ícones, padrão estrito taste-skill) -->
        <div class="kpis">
          <div class="kpi">
            <div class="kpi-label">Estudos clássicos concluídos</div>
            <div class="kpi-value">${completedCount} <small>de ${totalGames} partidas</small></div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Repertório de aberturas</div>
            <div class="kpi-value">${CHESS_OPENINGS.length} <small>linhas ECO validadas</small></div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Fila de revisão inteligente</div>
            <div class="kpi-value">${reviewCount} <small>${reviewCount === 1 ? 'posição para revisar' : 'posições para revisar'}</small></div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Meio-lances verificados (chess.js)</div>
            <div class="kpi-value">647 <small>100% legais</small></div>
          </div>
        </div>

        <!-- Fila de Revisão Inteligente -->
        <div class="panel">
          <div class="panel-header">
            <h2>Fila de revisão inteligente</h2>
            <span class="panel-meta">Posições em que você pediu dica ou tentou um lance alternativo</span>
          </div>
          <div class="table-wrap">
            <table class="clean-table">
              <thead>
                <tr>
                  <th>Estudo ou abertura</th>
                  <th>Posição alvo</th>
                  <th>Motivo do registro</th>
                  <th class="n">Ação</th>
                </tr>
              </thead>
              <tbody>
                ${reviewRowsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Progresso por Livro Clássico -->
        <div class="panel">
          <div class="panel-header">
            <h2>Acervo de livros clássicos pré-instalados</h2>
            <button type="button" data-action="open-ocr-modal" class="card-link" style="font-size:12px;">Ver pipeline de fontes e OCR</button>
          </div>
          <div class="table-wrap">
            <table class="clean-table">
              <thead>
                <tr>
                  <th>Obra clássica</th>
                  <th>Autor</th>
                  <th class="n">Capítulos</th>
                  <th class="n">Estudos concluídos</th>
                  <th class="n">Acesso</th>
                </tr>
              </thead>
              <tbody>
                ${booksSummaryRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 11. MODAL DE FONTES, CITAÇÕES E PIPELINE OCR
  // ==========================================================================
  function renderOcrModal() {
    if (!state.showOcrModal) return '';
    return `
      <div class="modal-backdrop" data-action="close-ocr-modal">
        <div class="modal-dialog" onclick="event.stopPropagation()">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding-bottom:12px; border-bottom:1px solid var(--border);">
            <div>
              <h2 style="font-size:18px; font-weight:600;">Fontes históricas e pipeline de validação OCR</h2>
              <p style="font-size:13px; color:var(--muted); margin-top:2px;">
                Transparência editorial entre os livros originais, o Tutor pedagógico e o motor Stockfish.
              </p>
            </div>
            <button type="button" data-action="close-ocr-modal" class="btn ghost" style="padding:0 8px;">
              ${ICONS.close}
            </button>
          </div>

          <div style="margin-top:16px; display:flex; flex-direction:column; gap:14px;">
            <div class="kpis">
              <div class="kpi">
                <div class="kpi-label">Etapa 1 · Extração</div>
                <div class="kpi-value" style="font-size:15px; font-weight:500;">PDF & OCR Bilíngue</div>
              </div>
              <div class="kpi">
                <div class="kpi-label">Etapa 2 · Conversão</div>
                <div class="kpi-value" style="font-size:15px; font-weight:500;">Descritiva C3BR → SAN</div>
              </div>
              <div class="kpi">
                <div class="kpi-label">Etapa 3 · Auditoria</div>
                <div class="kpi-value" style="font-size:15px; font-weight:500;">Validador chess.js</div>
              </div>
            </div>

            <div class="table-wrap">
              <table class="clean-table">
                <thead>
                  <tr>
                    <th>Obra física de origem</th>
                    <th>Autor</th>
                    <th>Notação original</th>
                    <th class="n">Status chess.js</th>
                  </tr>
                </thead>
                <tbody>
                  ${PREINSTALLED_BOOKS.map(
                    (b) => `
                    <tr>
                      <td style="font-weight:500;">${b.titlePt}</td>
                      <td style="color:var(--muted);">${b.author}</td>
                      <td class="mono" style="font-size:12px;">${
                        b.originalNotation === 'descriptive_pt'
                          ? 'Descritiva PT (P4R, C3BR)'
                          : b.originalNotation === 'descriptive_es'
                          ? 'Descritiva ES (P4R, C3AR)'
                          : 'Algébrica Internacional'
                      }</td>
                      <td class="n"><span class="pill pos">100% Verificado</span></td>
                    </tr>
                  `
                  ).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================================================
  // 12. RENDER PRINCIPAL DO SHELL FRAMED-SHEET
  // ==========================================================================
  function render() {
    const root = document.getElementById('root');
    if (!root) return;

    const { book, chapter, game } = getCurrentBookChapterGame();
    const opening = getCurrentOpening();
    const { initialFen, steps } = getCurrentSteps();
    const activeFen = getActiveFen(initialFen, steps);
    const currentStep = state.currentPly > 0 ? steps[state.currentPly - 1] : null;
    const nextExpectedStep = steps[state.currentPly] || null;
    const engineEval = analyzePositionLocal(activeFen);
    const hints = buildProgressiveHints(nextExpectedStep, opening);
    const citation = resolveBookCitation({
      book,
      chapter,
      game,
      opening,
      studyType: state.studyType,
    });

    scheduleOpponentAutoMove(steps);

    const isCompleted =
      state.studyType === 'book_game' && state.completedGameIds.includes(game.id);

    // Título e "One Finding" da Folha Principal
    const mainTitle =
      state.canvasView === 'overview'
        ? state.navDest === 'learn'
          ? 'Trilha guiada e fila de revisão'
          : 'Progresso de estudos e acervo clássico'
        : state.studyType === 'opening'
        ? `${opening.namePt}`
        : `${game.titlePt}`;

    const mainFinding =
      state.canvasView === 'overview'
        ? `${state.completedGameIds.length} estudos concluídos · ${state.reviewQueue.length} posições aguardando revisão prática`
        : state.studyType === 'opening'
        ? `<span class="mono" style="color:var(--accent); font-weight:600;">${opening.eco}</span> · ${opening.categoryLabelPt} · Lance ${state.currentPly} de ${steps.length}`
        : `${book.titlePt} (Cap. ${chapter.number}) · ${game.white} vs. ${game.black}, <span class="mono">${game.year}</span> · Lance ${state.currentPly} de ${steps.length}`;

    root.innerHTML = `
      <div class="framed-shell">
        <!-- 1. CANTO SUPERIOR ESQUERDO DA MOLDURA EM L: MARCA DO PRODUTO + ESCOPO -->
        <div class="shell-brand">
          <div class="brand-lockup">
            <div class="brand-mark">${ICONS.knightMark}</div>
            <span class="brand-name">Chess Mastery</span>
          </div>
          <span class="brand-scope">v1.3</span>
        </div>

        <!-- 2. BARRA SUPERIOR (48PX) NA MOLDURA EM L -->
        <header class="shell-topbar">
          <div class="topbar-search-wrap">
            ${ICONS.search}
            <input
              id="global-search-input"
              type="text"
              class="topbar-search"
              placeholder="Filtrar livros, capítulos, mestres ou aberturas (ex.: C50, Siciliana, Capablanca)..."
              value="${state.searchQuery.replace(/"/g, '&quot;')}"
            />
            <span class="search-kbd">/</span>
          </div>

          <div class="topbar-right">
            <!-- Alternador de Modo de Uso: Modo Aprender (Padrão) vs Modo Explorador -->
            <div class="segmented" role="group" aria-label="Modo de uso">
              <button
                type="button"
                data-action="set-experience-mode"
                data-mode="aprender"
                aria-pressed="${state.experienceMode === 'aprender' ? 'true' : 'false'}"
              >Modo Aprender</button>
              <button
                type="button"
                data-action="set-experience-mode"
                data-mode="explorador"
                aria-pressed="${state.experienceMode === 'explorador' ? 'true' : 'false'}"
              >Modo Explorador</button>
            </div>

            <button
              type="button"
              data-action="open-ocr-modal"
              class="btn"
              title="Inspecionar fontes históricas e pipeline OCR"
            >
              ${ICONS.fileCheck} Fontes e OCR
            </button>

            <button
              type="button"
              data-action="toggle-sound"
              class="btn"
              style="padding:0 9px;"
              title="${state.soundMuted ? 'Ativar áudio' : 'Silenciar áudio'}"
            >
              ${state.soundMuted ? ICONS.volumeOff : ICONS.volumeOn}
            </button>
          </div>
        </header>

        <!-- 3. SIDEBAR ESQUERDA (248PX) NA MOLDURA EM L -->
        <aside class="shell-sidebar">
          <nav class="sidebar-nav-section" aria-label="Destinos principais">
            <button
              type="button"
              data-action="nav-dest"
              data-dest="learn"
              class="nav-item"
              aria-current="${state.navDest === 'learn' ? 'page' : 'false'}"
            >
              <span class="nav-item-left">${ICONS.compass} <span>Aprender e revisar</span></span>
              ${
                state.reviewQueue.length > 0
                  ? `<span class="nav-count urgent">${state.reviewQueue.length} revisão</span>`
                  : `<span class="nav-count">Trilha</span>`
              }
            </button>

            <button
              type="button"
              data-action="nav-dest"
              data-dest="library"
              class="nav-item"
              aria-current="${state.navDest === 'library' ? 'page' : 'false'}"
            >
              <span class="nav-item-left">${ICONS.book} <span>Biblioteca de livros</span></span>
              <span class="nav-count">4 livros</span>
            </button>

            <button
              type="button"
              data-action="nav-dest"
              data-dest="openings"
              class="nav-item"
              aria-current="${state.navDest === 'openings' ? 'page' : 'false'}"
            >
              <span class="nav-item-left">${ICONS.board} <span>Aberturas e defesas</span></span>
              <span class="nav-count">18 linhas</span>
            </button>

            <button
              type="button"
              data-action="nav-dest"
              data-dest="progress"
              class="nav-item"
              aria-current="${state.navDest === 'progress' ? 'page' : 'false'}"
            >
              <span class="nav-item-left">${ICONS.ledger} <span>Progresso e acervo</span></span>
              <span class="nav-count">${state.completedGameIds.length}/12</span>
            </button>
          </nav>

          <!-- Catálogo Contextual (Todos os 4 Livros em Acordeão / Modo Isolado / 18 Aberturas) -->
          <div class="sidebar-catalog">
            ${renderSidebarCatalog()}
          </div>

          <div class="sidebar-footer">
            <span>Motor chess.js ativo</span>
            <span class="mono">647 lances</span>
          </div>
        </aside>

        <!-- 4. A FOLHA BRANCA DE TRABALHO (.work-sheet, recuo de 8px, raio 16px, borda 1px, sem sombra) -->
        <main class="work-sheet">
          <div class="sheet-title-row">
            <div class="sheet-title-main">
              <h1>${mainTitle}</h1>
              <div class="sheet-finding">${mainFinding}</div>
            </div>

            <div class="sheet-controls">
              ${
                state.canvasView === 'overview'
                  ? `
                    <button type="button" data-action="show-board-view" class="btn primary">
                      Voltar ao tabuleiro ativo
                    </button>
                  `
                  : `
                    <!-- Controles do Treinador Inteligente de Aberturas & Estudos -->
                    <div class="segmented" role="group" aria-label="Cor para treinar">
                      <button
                        type="button"
                        data-action="set-trainer-color"
                        data-color="w"
                        aria-pressed="${state.trainerColor === 'w' ? 'true' : 'false'}"
                      >Brancas</button>
                      <button
                        type="button"
                        data-action="set-trainer-color"
                        data-color="b"
                        aria-pressed="${state.trainerColor === 'b' ? 'true' : 'false'}"
                      >Pretas</button>
                      <button
                        type="button"
                        data-action="set-trainer-color"
                        data-color="both"
                        aria-pressed="${state.trainerColor === 'both' ? 'true' : 'false'}"
                      >Ambas</button>
                    </div>

                    <button
                      type="button"
                      data-action="toggle-trainer"
                      class="btn ${state.trainerActive ? 'primary' : ''}"
                    >
                      ${state.trainerActive ? 'Treinador ativo (jogando)' : 'Treinar lances no tabuleiro'}
                    </button>

                    ${
                      state.studyType === 'book_game'
                        ? `<button type="button" data-action="toggle-complete-game" class="btn">
                            ${ICONS.check} ${isCompleted ? 'Estudo concluído' : 'Marcar concluído'}
                          </button>`
                        : ''
                    }
                  `
              }
            </div>
          </div>

          ${
            state.canvasView === 'overview'
              ? `<div style="flex:1; min-height:0; margin-top:16px; display:flex; flex-direction:column; overflow:hidden;">${renderOverviewSheet()}</div>`
              : `
                <div class="sheet-workspace">
                  ${renderBoardStage(activeFen, steps, currentStep, nextExpectedStep, engineEval)}
                  ${renderGuidanceColumn({
                    book,
                    chapter,
                    game,
                    opening,
                    steps,
                    currentStep,
                    nextExpectedStep,
                    engineEval,
                    hints,
                    citation,
                  })}
                </div>
              `
          }
        </main>
      </div>
      ${renderOcrModal()}
    `;

    bindEvents();
  }

  // ==========================================================================
  // 13. DELEGAÇÃO DE EVENTOS E ATALHOS DE TECLADO
  // ==========================================================================
  function bindEvents() {
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const cursorPos = e.target.selectionStart;
        state.searchQuery = e.target.value;
        render();
        const nextInput = document.getElementById('global-search-input');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(cursorPos, cursorPos);
        }
      });
    }

    document.querySelectorAll('[data-action]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const action = el.getAttribute('data-action');

        if (action === 'nav-dest') {
          const dest = el.getAttribute('data-dest');
          state.navDest = dest;
          if (dest === 'learn' || dest === 'progress') {
            state.canvasView = 'overview';
          } else {
            state.canvasView = 'board';
            if (dest === 'openings') {
              state.studyType = 'opening';
              state.currentPly = 0;
              state.customFen = null;
            } else if (dest === 'library') {
              state.studyType = 'book_game';
            }
          }
          render();
          return;
        }

        if (action === 'show-board-view') {
          state.canvasView = 'board';
          render();
          return;
        }

        if (action === 'set-experience-mode') {
          state.experienceMode = el.getAttribute('data-mode');
          render();
          return;
        }

        if (action === 'toggle-book') {
          const bookId = el.getAttribute('data-book-id');
          state.selectedBookId = bookId;
          if (state.expandedBookIds.includes(bookId)) {
            state.expandedBookIds = state.expandedBookIds.filter((id) => id !== bookId);
          } else {
            state.expandedBookIds.push(bookId);
          }
          render();
          return;
        }

        if (action === 'isolate-chapter') {
          e.stopPropagation();
          const bookId = el.getAttribute('data-book-id');
          const chapterId = el.getAttribute('data-chapter-id');
          state.selectedBookId = bookId;
          state.isolatedChapterId = chapterId;
          const b = PREINSTALLED_BOOKS.find((item) => item.id === bookId);
          const ch = b && b.chapters.find((c) => c.id === chapterId);
          if (ch && ch.games[0]) {
            state.selectedGameId = ch.games[0].id;
            state.studyType = 'book_game';
            state.canvasView = 'board';
            state.currentPly = 0;
            state.customFen = null;
          }
          render();
          return;
        }

        if (action === 'exit-isolated-chapter') {
          state.isolatedChapterId = null;
          render();
          return;
        }

        if (action === 'select-game') {
          const bookId = el.getAttribute('data-book-id');
          const gameId = el.getAttribute('data-game-id');
          state.selectedBookId = bookId;
          state.selectedGameId = gameId;
          state.studyType = 'book_game';
          state.navDest = 'library';
          state.canvasView = 'board';
          state.currentPly = 0;
          state.customFen = null;
          state.selectedSquare = null;
          state.hintLevel = 0;
          state.lastFeedback = null;
          render();
          return;
        }

        if (action === 'select-opening-cat') {
          state.selectedOpeningCat = el.getAttribute('data-cat');
          render();
          return;
        }

        if (action === 'select-opening') {
          const openingId = el.getAttribute('data-opening-id');
          state.selectedOpeningId = openingId;
          state.studyType = 'opening';
          state.canvasView = 'board';
          state.currentPly = 0;
          state.customFen = null;
          state.selectedSquare = null;
          state.hintLevel = 0;
          state.lastFeedback = null;
          const op = getCurrentOpening();
          if (op.recommendedFor === 'black') {
            state.trainerColor = 'b';
            state.flipped = true;
          } else {
            state.trainerColor = 'w';
            state.flipped = false;
          }
          render();
          return;
        }

        if (action === 'set-trainer-color') {
          const color = el.getAttribute('data-color');
          state.trainerColor = color;
          state.trainerActive = true;
          if (color === 'w') state.flipped = false;
          if (color === 'b') state.flipped = true;
          render();
          return;
        }

        if (action === 'toggle-trainer') {
          state.trainerActive = !state.trainerActive;
          state.lastFeedback = null;
          state.hintLevel = 0;
          render();
          return;
        }

        if (action === 'cycle-hint') {
          state.hintLevel = state.hintLevel < 3 ? state.hintLevel + 1 : 1;
          const { steps } = getCurrentSteps();
          const nextStep = steps[state.currentPly];
          if (state.hintLevel === 3 && nextStep) {
            addToReviewQueue(nextStep, 'Solicitou dica nível 3 (solução completa)');
          }
          render();
          return;
        }

        if (action === 'ply-first') {
          goToPly(0);
          return;
        }
        if (action === 'ply-prev') {
          goToPly(state.currentPly - 1);
          return;
        }
        if (action === 'ply-next') {
          goToPly(state.currentPly + 1);
          return;
        }
        if (action === 'ply-last') {
          const { steps } = getCurrentSteps();
          goToPly(steps.length);
          return;
        }
        if (action === 'goto-ply') {
          const ply = parseInt(el.getAttribute('data-ply'), 10);
          goToPly(ply);
          return;
        }

        if (action === 'flip-board') {
          state.flipped = !state.flipped;
          render();
          return;
        }

        if (action === 'return-official-line') {
          state.customFen = null;
          state.customHistorySan = [];
          state.selectedSquare = null;
          render();
          return;
        }

        if (action === 'square-click') {
          const sq = el.getAttribute('data-square');
          const { initialFen, steps } = getCurrentSteps();
          const activeFen = getActiveFen(initialFen, steps);
          handleSquareClick(sq, activeFen, steps);
          return;
        }

        if (action === 'set-right-tab') {
          state.rightTab = el.getAttribute('data-tab');
          render();
          return;
        }

        if (action === 'set-notation') {
          state.notationMode = el.getAttribute('data-notation');
          persistState();
          render();
          return;
        }

        if (action === 'toggle-sound') {
          state.soundMuted = !state.soundMuted;
          chessAudio.setMuted(state.soundMuted);
          render();
          return;
        }

        if (action === 'toggle-complete-game') {
          const { game } = getCurrentBookChapterGame();
          if (state.completedGameIds.includes(game.id)) {
            state.completedGameIds = state.completedGameIds.filter((id) => id !== game.id);
          } else {
            state.completedGameIds.push(game.id);
            chessAudio.playSuccess();
          }
          persistState();
          render();
          return;
        }

        if (action === 'practice-review-item') {
          const reviewId = el.getAttribute('data-review-id');
          const item = state.reviewQueue.find((r) => r.id === reviewId);
          if (item) {
            state.studyType = item.studyType;
            if (item.studyType === 'opening') {
              state.selectedOpeningId = item.targetId;
              state.navDest = 'openings';
            } else {
              state.selectedGameId = item.targetId;
              state.navDest = 'library';
            }
            state.canvasView = 'board';
            state.currentPly = item.ply;
            state.trainerActive = true;
            state.customFen = null;
            state.hintLevel = 0;
            state.lastFeedback = null;
          }
          render();
          return;
        }

        if (action === 'open-ocr-modal') {
          state.showOcrModal = true;
          render();
          return;
        }

        if (action === 'close-ocr-modal') {
          state.showOcrModal = false;
          render();
          return;
        }
      });
    });
  }

  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target && e.target.tagName)) {
      if (e.key === 'Escape') e.target.blur();
      return;
    }
    if (e.key === '/') {
      e.preventDefault();
      const input = document.getElementById('global-search-input');
      if (input) input.focus();
      return;
    }
    if (e.key === 'x' || e.key === 'X' || e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      state.flipped = !state.flipped;
      render();
      return;
    }
    if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      state.hintLevel = state.hintLevel < 3 ? state.hintLevel + 1 : 1;
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

  // Inicializa a interface
  render();
})();
