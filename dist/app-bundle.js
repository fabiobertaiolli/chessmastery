/* ============================================================================
 * CHESS MASTERY v2.0 — GOOGLE STITCH (PLAYFUL CHESS STUDIO) + LIVE BOOK READER
 * - 4 Telas Completas do Google Stitch:
 *   1) Aprender & Ler (Tabuleiro Chess.com + Livro Vivo com Lances Clicáveis nos Parágrafos + 3 Mentores)
 *   2) Biblioteca Mágica (Os 4 Livros Clássicos Completos com todos os capítulos)
 *   3) Aberturas & Estudos (18+ Aberturas, Meio-Jogo, Finais e Cadernos Google NotebookLM)
 *   4) Conquistas & Estrelas (Sala de Troféus, Estrelas Mágicas e Fila de Revisão)
 * ============================================================================ */
(function () {
  const {
    Chess,
    moveToDescriptive,
    sanToPortugueseAlgebraic,
    sanToFigurine,
    formatMoveByMode,
    splitMoveAnnotations,
  } = window.ChessMasteryEngine;

  const PREINSTALLED_BOOKS = window.PREINSTALLED_BOOKS || [];
  const CHESS_OPENINGS = window.CHESS_OPENINGS || [];

  // ==========================================================================
  // 1. ÁUDIO ACÚSTICO DE MADEIRA + SÍNTESE DE VOZ PT-BR
  // ==========================================================================
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
      o.frequency.setValueAtTime(160, now);
      o.frequency.exponentialRampToValueAtTime(58, now + 0.068);
      g.gain.setValueAtTime(0.22, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.08);
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
      o.frequency.exponentialRampToValueAtTime(48, now + 0.085);
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.095);
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
      o.frequency.setValueAtTime(300, now);
      o.frequency.linearRampToValueAtTime(220, now + 0.15);
      g.gain.setValueAtTime(0.13, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now);
      o.stop(now + 0.18);
    },
  };

  // ==========================================================================
  // 2. PEÇAS DE XADREZ VETORIAIS STAUNTON DE ALTO CONTRASTE
  // ==========================================================================
  const PIECE_SVGS = {
    wP: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#18191b" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    wR: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="#fff" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"/><path d="M34 14l-3 3H14l-3-3"/><path d="M31 17v12.5H14V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path d="M11 14h23" fill="none"/></g></svg>`,
    wN: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="none" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#fff"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#fff"/><circle cx="9.5" cy="25.5" r=".5" fill="#18191b"/><circle cx="14.933" cy="15.75" r="1" fill="#18191b"/></g></svg>`,
    wB: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="none" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>`,
    wQ: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="#fff" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>`,
    wK: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="none" stroke="#18191b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g></svg>`,
    bP: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#1e2022" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    bR: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="#1e2022" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z"/><path d="M14 29.5v-13h17v13H14z"/><path d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z"/><path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23" fill="none" stroke="#d5d8dc" stroke-width="1"/></g></svg>`,
    bN: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="none" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" fill="#1e2022"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3" fill="#1e2022"/><circle cx="9.5" cy="25.5" r=".6" fill="#d5d8dc" stroke="none"/><circle cx="14.93" cy="15.75" r="1" fill="#d5d8dc" stroke="none"/></g></svg>`,
    bB: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="none" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g fill="#1e2022" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke="#d5d8dc"/></g></svg>`,
    bQ: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="#1e2022" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#d5d8dc"/></g></svg>`,
    bK: `<svg viewBox="0 0 45 45" style="width:100%;height:100%"><g fill="none" stroke="#0c0d0e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#1e2022" stroke-linecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#1e2022"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#d5d8dc"/></g></svg>`,
  };

  function getPieceSvg(color, type) {
    const key = `${color}${String(type).toUpperCase()}`;
    return PIECE_SVGS[key] || '';
  }

  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
  const PIECE_NAMES_PT = { p: 'Peão', n: 'Cavalo', b: 'Bispo', r: 'Torre', q: 'Dama', k: 'Rei' };

  const BOARD_THEMES = {
    stitch_wood: {
      name: 'Estúdio Madeira Artesanal',
      light: '#F5E6CE',
      dark: '#B58A65',
      lastLight: '#CBEFD8',
      lastDark: '#69B084',
    },
    chesscom_green: {
      name: 'Chess.com Tournament',
      light: '#EEEED2',
      dark: '#769656',
      lastLight: '#F6F669',
      lastDark: '#BACA2B',
    },
    lichess_wood: {
      name: 'Lichess Classic Wood',
      light: '#F0D9B5',
      dark: '#B58863',
      lastLight: '#CDD26A',
      lastDark: '#AAA23A',
    },
    walnut_luxury: {
      name: 'Nogueira Real',
      light: '#EAD8C0',
      dark: '#8B5A2B',
      lastLight: '#E4C96B',
      lastDark: '#A68232',
    },
    slate_ice: {
      name: 'Cristal Azul',
      light: '#DEE3E6',
      dark: '#78909C',
      lastLight: '#9BE0C8',
      lastDark: '#55AB91',
    },
  };

  // ==========================================================================
  // 3. MOTOR TÁTICO STOCKFISH LOCAL & AVALIADOR
  // ==========================================================================
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
        if ((r === 3 || r === 4) && (c === 3 || c === 4)) v += 22;
        score += p.color === 'w' ? v : -v;
      }
    }
    return score;
  }

  function analyzePositionLocal(fen) {
    try {
      const chess = new Chess(fen);
      const turn = chess.turn();
      const legalMoves = chess.moves({ verbose: true });
      if (!legalMoves || legalMoves.length === 0) {
        return {
          scoreCp: 0,
          mateIn: chess.inCheck() ? 0 : null,
          bestMoveSan: '-',
          bestMoveFrom: '',
          bestMoveTo: '',
          pvLineSan: [],
          explanationPt: 'Partida finalizada nesta posição.',
        };
      }
      let bestMove = legalMoves[0];
      let bestScore = turn === 'w' ? -999999 : 999999;
      for (const mv of legalMoves) {
        chess.move(mv);
        let sc = evaluateStatic(chess);
        const replies = chess.moves({ verbose: true });
        if (replies.length > 0) {
          let worstReply = turn === 'w' ? 999999 : -999999;
          for (let i = 0; i < Math.min(replies.length, 10); i++) {
            chess.move(replies[i]);
            const rSc = evaluateStatic(chess);
            if (turn === 'w' && rSc < worstReply) worstReply = rSc;
            if (turn === 'b' && rSc > worstReply) worstReply = rSc;
            chess.undo();
          }
          sc = worstReply;
        }
        chess.undo();
        if ((turn === 'w' && sc > bestScore) || (turn === 'b' && sc < bestScore)) {
          bestScore = sc;
          bestMove = mv;
        }
      }

      const pv = [bestMove.san];
      chess.move(bestMove);
      const nextReplies = chess.moves({ verbose: true });
      if (nextReplies.length > 0) pv.push(nextReplies[0].san);

      const bestPt = sanToPortugueseAlgebraic(bestMove.san);
      const advantageText =
        Math.abs(bestScore) < 45
          ? 'Posição equilibrada no centro.'
          : bestScore > 0
          ? 'As Brancas possuem iniciativa e melhor atividade das peças.'
          : 'As Pretas possuem contrajogo ativo e boa coordenação.';

      return {
        scoreCp: Math.max(-1500, Math.min(1500, bestScore)),
        mateIn: Math.abs(bestScore) > 50000 ? 1 : null,
        bestMoveSan: bestMove.san,
        bestMoveFrom: bestMove.from,
        bestMoveTo: bestMove.to,
        pvLineSan: pv,
        explanationPt: `${advantageText} O Robô Pipo sugere considerar ${bestPt} (${bestMove.from} → ${bestMove.to}).`,
      };
    } catch {
      return {
        scoreCp: 0,
        mateIn: null,
        bestMoveSan: 'e4',
        bestMoveFrom: 'e2',
        bestMoveTo: 'e4',
        pvLineSan: ['e4', 'e5'],
        explanationPt: 'Posição pronta para análise.',
      };
    }
  }

  // ==========================================================================
  // 4. PARSER DE LIVRO INTERATIVO COM LANCES CLICÁVEIS NOS PARÁGRAFOS
  // ==========================================================================
  function portugueseAlgebraicToSan(moveStr) {
    if (!moveStr) return '';
    const trimmed = moveStr.trim().replace(/^(\d+\.{1,3})\s*/, '');
    const { core, check, nag } = splitMoveAnnotations(trimmed);
    if (!core) return trimmed;
    if (core === '0-0' || core === 'O-O') return `O-O${check}${nag}`;
    if (core === '0-0-0' || core === 'O-O-O') return `O-O-O${check}${nag}`;
    const ptToEn = { R: 'K', D: 'Q', T: 'R', B: 'B', C: 'N', A: 'B' };
    let converted = core;
    if (/^[RDTBCA][a-h1-8x]/.test(converted)) {
      converted = (ptToEn[converted[0]] || converted[0]) + converted.slice(1);
    }
    converted = converted.replace(/=([RDTBCA])/, (_, p) => `=${ptToEn[p] || p}`);
    return `${converted}${check}${nag}`;
  }

  function normalizeMoveToken(str) {
    if (!str) return '';
    return str
      .trim()
      .replace(/^(\d+\.{1,3})\s*/, '')
      .replace(/[+#!?.,;()]/g, '')
      .replace(/0-0-0/g, 'O-O-O')
      .replace(/0-0/g, 'O-O')
      .trim();
  }

  function matchTokenToGameStep(rawToken, computedSteps, contextPly) {
    if (!rawToken || !computedSteps || !computedSteps.length) return null;
    const numMatch = rawToken.trim().match(/^(\d+)(\.{1,3})\s*(.+)$/);
    let explicitMoveNum = null;
    let explicitBlack = null;
    let movePart = rawToken.trim();
    if (numMatch) {
      explicitMoveNum = parseInt(numMatch[1], 10);
      explicitBlack = numMatch[2].length >= 2;
      movePart = numMatch[3].trim();
    }
    const cleanMove = normalizeMoveToken(movePart);
    const cleanSanCandidate = normalizeMoveToken(portugueseAlgebraicToSan(movePart));
    if (!cleanMove) return null;

    if (explicitMoveNum !== null) {
      const cands = computedSteps.filter((s) => s.moveNumber === explicitMoveNum);
      for (const s of cands) {
        if (explicitBlack !== null && (s.color === 'b') !== explicitBlack && cands.length > 1)
          continue;
        const sSan = normalizeMoveToken(s.san);
        const sPt = normalizeMoveToken(sanToPortugueseAlgebraic(s.san));
        const sDesc = normalizeMoveToken(s.descriptivePt);
        if (
          sSan === cleanMove ||
          sSan === cleanSanCandidate ||
          sPt === cleanMove ||
          sDesc.toLowerCase() === cleanMove.toLowerCase()
        ) {
          return s;
        }
      }
    }

    const sorted = [...computedSteps].sort((a, b) => {
      if (contextPly == null) return a.ply - b.ply;
      return Math.abs(a.ply - contextPly) - Math.abs(b.ply - contextPly);
    });

    for (const s of sorted) {
      const sSan = normalizeMoveToken(s.san);
      const sPt = normalizeMoveToken(sanToPortugueseAlgebraic(s.san));
      const sDesc = normalizeMoveToken(s.descriptivePt);
      const sDescShort = sDesc.replace(/\([^)]*\)/g, '');
      if (
        sSan === cleanMove ||
        sSan === cleanSanCandidate ||
        sPt === cleanMove ||
        sDesc.toLowerCase() === cleanMove.toLowerCase() ||
        (sDescShort.length >= 3 && sDescShort.toLowerCase() === cleanMove.toLowerCase())
      ) {
        return s;
      }
    }
    return null;
  }

  const INLINE_MOVE_REGEX =
    /(\b\d+\.(?:\.\.)?\s*(?:O-O-O|O-O|0-0-0|0-0|[KQRBNRDTBCA]?[a-h]?[1-8]?x?[a-h][1-8](?:=[KQRBNRDTBCA])?[+#!?]*|(?:TR|TD|CR|CD|BR|BD|[PCTBDR])[1-8][A-Z]{1,2}[+#!?]*|[PCTBDR]x[PCTBDR](?:\([1-8][A-Z]{1,2}\))?[+#!?]*)|\b(?:O-O-O|O-O|0-0-0|0-0|[KQRBNRDTBC][a-h1-8]?x?[a-h][1-8](?:=[KQRBNRDTBC])?[+#!?]+|[KQRBNRDTBC][a-h1-8]?x[a-h][1-8](?:=[KQRBNRDTBC])?[+#!?]*|[KQRBNRDTBC][a-h][1-8][+#!?]*|[a-h]x[a-h][1-8](?:=[KQRBNRDTBC])?[+#!?]*|\b(?:P4R|P4D|P3B|P3BR|P3CD|C3BR|C3BD|C2R|B5C|B4B|B4BD|TR1CR|TD1CR|TR1R|TD1D)[+#!?]*))/g;

  function resolveVariationMove(baseFen, rawToken) {
    if (!baseFen || !rawToken) return null;
    try {
      const sanCand = portugueseAlgebraicToSan(rawToken).replace(/[!?]+$/, '');
      const c = new Chess(baseFen);
      const mv = c.move(sanCand, { sloppy: true });
      if (!mv) return null;
      return {
        fen: c.fen(),
        from: mv.from,
        to: mv.to,
        san: mv.san,
        color: mv.color,
      };
    } catch {
      return null;
    }
  }

  function parseParagraphSegments(text, computedSteps, contextPly) {
    if (!text) return [];
    const segments = [];
    let lastIndex = 0;
    const contextStep =
      (contextPly != null && computedSteps.find((s) => s.ply === contextPly)) || computedSteps[0];
    let runningVarFen = contextStep ? contextStep.fenBefore : null;

    const matches = [...String(text).matchAll(INLINE_MOVE_REGEX)];
    for (const m of matches) {
      const rawToken = m[0];
      const startIdx = m.index;
      const matchedStep = matchTokenToGameStep(rawToken, computedSteps, contextPly);
      let moveSeg = null;

      if (matchedStep) {
        moveSeg = {
          type: 'move',
          content: rawToken,
          ply: matchedStep.ply,
          fen: matchedStep.fenAfter,
          from: matchedStep.from,
          to: matchedStep.to,
          san: matchedStep.san,
          isVariation: false,
        };
        runningVarFen = matchedStep.fenAfter;
      } else if (runningVarFen) {
        let resolved = resolveVariationMove(runningVarFen, rawToken);
        if (!resolved && contextStep) {
          resolved =
            resolveVariationMove(contextStep.fenBefore, rawToken) ||
            resolveVariationMove(contextStep.fenAfter, rawToken);
        }
        if (resolved) {
          moveSeg = {
            type: 'move',
            content: rawToken,
            ply: contextPly || 1,
            fen: resolved.fen,
            from: resolved.from,
            to: resolved.to,
            san: resolved.san,
            isVariation: true,
          };
          runningVarFen = resolved.fen;
        }
      }

      if (moveSeg) {
        if (startIdx > lastIndex) {
          segments.push({ type: 'text', content: text.slice(lastIndex, startIdx) });
        }
        segments.push(moveSeg);
        lastIndex = startIdx + rawToken.length;
      }
    }

    if (lastIndex < text.length) {
      segments.push({ type: 'text', content: text.slice(lastIndex) });
    }
    return segments;
  }

  function buildInteractiveBookFlow(game, computedSteps, notationMode) {
    if (!game) return [];
    const blocks = [];

    if (game.introPt) {
      blocks.push({
        id: `${game.id}-intro`,
        kind: 'intro',
        title: 'Contexto da Obra & Ideia Estratégica',
        startPly: 0,
        endPly: 0,
        focusPly: 0,
        inlineSteps: [],
        segments: parseParagraphSegments(game.introPt, computedSteps, 1),
        variationSegments: [],
      });
    }

    if (Array.isArray(game.readingSectionsPt)) {
      game.readingSectionsPt.forEach((sec, idx) => {
        blocks.push({
          id: `${game.id}-theory-${idx}`,
          kind: 'theory',
          title: sec.headingPt || 'Leitura do Capítulo',
          startPly: sec.focusPly || 0,
          endPly: sec.focusPly || 0,
          focusPly: sec.focusPly || 1,
          inlineSteps: [],
          segments: parseParagraphSegments(sec.bodyPt, computedSteps, sec.focusPly || 1),
          variationSegments: [],
        });
      });
    }

    let buffer = [];
    for (const step of computedSteps) {
      buffer.push(step);
      if (step.annotation && step.annotation.commentPt) {
        const stepsInPara = [...buffer];
        buffer = [];
        const lastPly = step.ply;
        blocks.push({
          id: `${game.id}-ply-${lastPly}`,
          kind: 'annotated',
          title: null,
          startPly: stepsInPara[0].ply,
          endPly: lastPly,
          focusPly: lastPly,
          inlineSteps: stepsInPara.map((s) => ({
            ply: s.ply,
            moveNumber: s.moveNumber,
            color: s.color,
            formatted: formatMoveByMode(s, notationMode),
            descriptivePt: s.descriptivePt,
            badge: (s.annotation && s.annotation.badge) || null,
          })),
          segments: parseParagraphSegments(step.annotation.commentPt, computedSteps, lastPly),
          variationSegments: step.annotation.alternativeLinePt
            ? parseParagraphSegments(step.annotation.alternativeLinePt, computedSteps, lastPly)
            : [],
        });
      }
    }

    if (buffer.length > 0) {
      const lastStep = buffer[buffer.length - 1];
      blocks.push({
        id: `${game.id}-tail-${lastStep.ply}`,
        kind: 'tail',
        title: 'Continuação da Partida',
        startPly: buffer[0].ply,
        endPly: lastStep.ply,
        focusPly: lastStep.ply,
        inlineSteps: buffer.map((s) => ({
          ply: s.ply,
          moveNumber: s.moveNumber,
          color: s.color,
          formatted: formatMoveByMode(s, notationMode),
          descriptivePt: s.descriptivePt,
          badge: (s.annotation && s.annotation.badge) || null,
        })),
        segments: [],
        variationSegments: [],
      });
    }

    return blocks;
  }

  // ==========================================================================
  // 5. CONSTRUTOR DE PASSOS DA PARTIDA (CHESS.JS)
  // ==========================================================================
  function buildGameSteps(game) {
    const startFen =
      game.initialFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const chess = new Chess(startFen);
    const steps = [];
    const annotations = game.annotations || {};

    for (let i = 0; i < (game.movesSan || []).length; i++) {
      const san = game.movesSan[i];
      const fenBefore = chess.fen();
      let mv = null;
      try {
        mv = chess.move(san, { sloppy: true });
      } catch {
        mv = null;
      }
      if (!mv) break;
      const fenAfter = chess.fen();
      const ply = i + 1;
      const moveNumber = Math.floor(i / 2) + 1;
      const moveObj = {
        ply,
        moveNumber,
        color: mv.color,
        san: mv.san,
        from: mv.from,
        to: mv.to,
        piece: mv.piece,
        captured: mv.captured,
        promotion: mv.promotion,
        fenBefore,
        fenAfter,
        inCheck: chess.inCheck ? chess.inCheck() : false,
        isCheckmate: chess.isCheckmate ? chess.isCheckmate() : false,
        isCastling: mv.san.startsWith('O-O'),
      };
      moveObj.descriptivePt = moveToDescriptive(moveObj, 'pt');
      moveObj.descriptiveEs = moveToDescriptive(moveObj, 'es');
      if (annotations[ply]) {
        moveObj.annotation = annotations[ply];
      }
      steps.push(moveObj);
    }

    return { initialFen: startFen, steps };
  }

  // ==========================================================================
  // 6. ESTADO GLOBAL DA APLICAÇÃO
  // ==========================================================================
  const STORAGE_KEY = 'chess_mastery_progress_v3';
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch {}

  const state = {
    navDest: 'learn', // 'learn' | 'library' | 'openings' | 'achievements'
    studyType: 'book_game', // 'book_game' | 'opening' | 'custom_study'
    rightTab: 'book_reader', // 'book_reader' | 'mentors' | 'movesheet'
    searchQuery: '',

    selectedBookId: PREINSTALLED_BOOKS[0] ? PREINSTALLED_BOOKS[0].id : '',
    selectedGameId:
      PREINSTALLED_BOOKS[0] && PREINSTALLED_BOOKS[0].chapters[0]
        ? PREINSTALLED_BOOKS[0].chapters[0].games[0].id
        : '',
    selectedOpeningId: CHESS_OPENINGS[0] ? CHESS_OPENINGS[0].id : '',
    selectedOpeningCat: 'all',
    selectedPhaseFilter: 'all', // 'all' | 'openings' | 'middlegame' | 'endgame' | 'notebooklm'

    customStudies: Array.isArray(saved.customStudies) ? saved.customStudies : [],
    selectedCustomStudyId: null,

    trainerActive: false,
    trainerColor: 'w',
    hintLevel: 0,
    lastFeedback: null,

    completedGameIds: Array.isArray(saved.completedGameIds) ? saved.completedGameIds : [],
    reviewQueue: Array.isArray(saved.reviewQueue) ? saved.reviewQueue : [],

    notationMode: saved.preferredNotation || 'alg_pt',
    boardTheme: 'stitch_wood',
    soundMuted: false,

    currentPly: 0,
    flipped: false,
    customFen: null,
    customLastMove: null,
    customVariationLabel: null,

    // Interação no Tabuleiro (Click-to-move, Drag, Promoção, Setas)
    selectedSquare: null,
    pendingPromotion: null,
    userArrows: [],
    userHighlights: [],
    rightClickStart: null,
    lastAnimatedMoveKey: '',

    // Modal Google NotebookLM
    isNotebookModalOpen: false,
    nbPhase: 'openings',
    nbTitle: 'Abertura Catalã — O Bispo Dragão em g2',
    nbHeroColor: 'w',
    nbFen: '',
    nbText: `# Abertura Catalã — O Bispo Dragão das Brancas em g2\n\nA Abertura Catalã combina a ocupação clássica do centro com 1. d4 Nf6 2. c4 e6 e o fianqueto hipermoderno 3. g3! d5 4. Bg2 Be7 5. Nf3 O-O 6. O-O dxc4.\n\nPara recuperar o peão com iniciativa, as Brancas jogam 7. Qc2! a6 8. a4 Bd7 9. Qxc4 Bc6 10. Bf4 Bd5 11. Qd3 Nc6 12. Nc3 Bxf3 13. Bxf3 Nxd4 14. Bxb7 Ra7 15. Bg2, mantendo pressão duradoura na grande diagonal!`,
  };

  function persistState() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedGameIds: state.completedGameIds,
          reviewQueue: state.reviewQueue,
          customStudies: state.customStudies,
          preferredNotation: state.notationMode,
        })
      );
    } catch {}
  }

  function getAllBookEntries() {
    const entries = [];
    for (const book of PREINSTALLED_BOOKS) {
      for (const ch of book.chapters || []) {
        for (const g of ch.games || []) {
          entries.push({ book, chapter: ch, game: g });
        }
      }
    }
    return entries;
  }

  function getCurrentBookEntry() {
    const all = getAllBookEntries();
    return all.find((e) => e.game.id === state.selectedGameId) || all[0];
  }

  function getActiveUnifiedGame() {
    if (state.studyType === 'custom_study') {
      const st =
        state.customStudies.find((s) => s.id === state.selectedCustomStudyId) ||
        state.customStudies[0];
      if (st) return st;
    }
    if (state.studyType === 'opening') {
      const op =
        CHESS_OPENINGS.find((o) => o.id === state.selectedOpeningId) || CHESS_OPENINGS[0];
      return {
        id: op.id,
        titlePt: op.namePt,
        white: 'Brancas (Teoria)',
        black: 'Pretas (Teoria)',
        event: `ECO ${op.eco} • ${op.nameOriginal}`,
        year: 'Repertório',
        result: '1/2-1/2',
        eco: op.eco,
        openingNamePt: op.namePt,
        studyPhase: 'openings',
        heroColor: op.recommendedFor === 'black' ? 'b' : 'w',
        introPt: op.summaryPt,
        readingSectionsPt: [
          {
            headingPt: 'Estrutura de Peões & Planos dos Dois Lados',
            bodyPt: `Estrutura: ${op.pawnStructurePt}. Plano das Brancas: ${(
              op.whitePlansPt || []
            ).join(' ')} Plano das Pretas: ${(op.blackPlansPt || []).join(' ')}`,
            focusPly: 1,
          },
        ],
        keyTakeawaysPt: [
          ...(op.whitePlansPt || []).slice(0, 2),
          ...(op.blackPlansPt || []).slice(0, 2),
        ],
        movesSan: op.movesSan,
        annotations: op.annotations || {},
      };
    }
    return getCurrentBookEntry().game;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function squareToCoords(square, flipped) {
    const f = FILES.indexOf(square[0]);
    const r = RANKS.indexOf(square[1]);
    if (f < 0 || r < 0) return { col: 0, row: 0 };
    return {
      col: flipped ? 7 - f : f,
      row: flipped ? 7 - r : r,
    };
  }

  // ==========================================================================
  // 7. RENDERIZADOR PRINCIPAL DAS 4 TELAS DO GOOGLE STITCH
  // ==========================================================================
  function renderApp() {
    const root = document.getElementById('root');
    if (!root) return;

    const allEntries = getAllBookEntries();
    const currentEntry = getCurrentBookEntry();
    const activeGame = getActiveUnifiedGame();
    const { initialFen, steps } = buildGameSteps(activeGame);

    const activeFen = state.customFen
      ? state.customFen
      : state.currentPly === 0
      ? initialFen
      : (steps[state.currentPly - 1] && steps[state.currentPly - 1].fenAfter) || initialFen;

    const currentStep = state.currentPly > 0 ? steps[state.currentPly - 1] || null : null;
    const nextExpectedStep = steps[state.currentPly] || null;
    const engineEval = analyzePositionLocal(activeFen);

    const chess = new Chess(activeFen);
    const turnColor = chess.turn();
    const boardMatrix = chess.board();

    const totalMagicStars = 12 + state.completedGameIds.length * 3;
    const progressPct =
      steps.length > 0 ? Math.round((state.currentPly / steps.length) * 100) : 0;

    // Monta HTML da Barra Superior do Stitch
    const headerHtml = `
      <header class="stitch-header">
        <div class="stitch-header-inner">
          <div class="brand-group">
            <div class="brand-logo">♞</div>
            <div>
              <div class="brand-title">Chess Mastery</div>
              <div class="brand-sub">
                <span class="brand-dot"></span>
                <span>Estúdio Lúdico & Livro Vivo</span>
              </div>
            </div>
          </div>

          <nav class="stitch-nav">
            <button type="button" class="stitch-nav-btn ${state.navDest === 'learn' ? 'active' : ''}" data-nav="learn">
              <span>♟️</span><span>Aprender & Ler</span>
            </button>
            <button type="button" class="stitch-nav-btn ${state.navDest === 'library' ? 'active' : ''}" data-nav="library">
              <span>📚</span><span>Biblioteca Mágica</span>
            </button>
            <button type="button" class="stitch-nav-btn ${state.navDest === 'openings' ? 'active' : ''}" data-nav="openings">
              <span>🧭</span><span>Aberturas & Estudos</span>
            </button>
            <button type="button" class="stitch-nav-btn ${state.navDest === 'achievements' ? 'active' : ''}" data-nav="achievements">
              <span>🏆</span><span>Conquistas & Estrelas</span>
            </button>
          </nav>

          <div class="header-actions">
            <button type="button" class="notebook-btn" id="btn-open-notebook-modal" title="Importar Estudos de Abertura, Meio-Jogo e Final do Google NotebookLM">
              <span>📓</span><span>+ NotebookLM</span>
            </button>

            <select id="select-notation-mode" class="pill-select" title="Alternar Notação em Tempo Real nos Parágrafos">
              <option value="alg_pt" ${state.notationMode === 'alg_pt' ? 'selected' : ''}>Notação: Algébrica PT (Cf3)</option>
              <option value="figurine" ${state.notationMode === 'figurine' ? 'selected' : ''}>Notação: Figurinos (♘f3)</option>
              <option value="desc_pt" ${state.notationMode === 'desc_pt' ? 'selected' : ''}>Notação: Descritiva (C3BR / P4R)</option>
              <option value="alg_en" ${state.notationMode === 'alg_en' ? 'selected' : ''}>Notação: Internacional (Nf3)</option>
            </select>

            <button type="button" class="star-badge-btn" data-nav="achievements" title="Suas Estrelas Mágicas">
              <span>${totalMagicStars}</span><span>⭐</span>
            </button>

            <button type="button" class="icon-circle-btn" id="btn-toggle-mute" title="${state.soundMuted ? 'Ativar som' : 'Silenciar som'}">
              ${state.soundMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      </header>
    `;

    let mainBodyHtml = '';

    // ========================================================================
    // TELA 1: APRENDER & LER (TABULEIRO CHESS.COM + LIVRO VIVO + 3 MENTORES)
    // ========================================================================
    if (state.navDest === 'learn') {
      const theme = BOARD_THEMES[state.boardTheme] || BOARD_THEMES.stitch_wood;
      const lastMove = state.customLastMove
        ? state.customLastMove
        : currentStep
        ? { from: currentStep.from, to: currentStep.to }
        : null;

      // Calcula preenchimento da Barra de Avaliação Vertical
      const sigmoid = 1 / (1 + Math.exp(-engineEval.scoreCp / 260));
      const whitePct =
        engineEval.mateIn !== null
          ? engineEval.scoreCp >= 0
            ? 100
            : 0
          : Math.min(95, Math.max(5, Math.round(sigmoid * 100)));
      const evalLabel =
        engineEval.mateIn !== null
          ? `M${Math.abs(engineEval.mateIn)}`
          : `${engineEval.scoreCp > 0 ? '+' : ''}${(engineEval.scoreCp / 100).toFixed(1)}`;

      // Lances legais da casa selecionada
      let legalMovesFromSelected = [];
      if (state.selectedSquare) {
        try {
          legalMovesFromSelected = chess.moves({ square: state.selectedSquare, verbose: true });
        } catch {}
      }

      const displayRows = state.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
      const displayCols = state.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

      const bookHighlights =
        !state.customFen && currentStep && currentStep.annotation && currentStep.annotation.highlights
          ? currentStep.annotation.highlights
          : [];
      const allHighlights = [...bookHighlights, ...state.userHighlights];

      const bookArrows =
        !state.customFen && currentStep && currentStep.annotation && currentStep.annotation.arrows
          ? currentStep.annotation.arrows
          : [];
      const hintArrow =
        state.hintLevel >= 3 && nextExpectedStep
          ? [{ from: nextExpectedStep.from, to: nextExpectedStep.to, color: 'sky' }]
          : [];
      const allArrows = [...bookArrows, ...state.userArrows, ...hintArrow];

      let squaresHtml = '';
      for (let vRow = 0; vRow < 8; vRow++) {
        for (let vCol = 0; vCol < 8; vCol++) {
          const rIdx = displayRows[vRow];
          const cIdx = displayCols[vCol];
          const sq = `${FILES[cIdx]}${RANKS[rIdx]}`;
          const isLight = (rIdx + cIdx) % 2 === 0;
          const piece = boardMatrix[rIdx][cIdx];
          const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
          const isSelected = state.selectedSquare === sq;
          const legalTarget = legalMovesFromSelected.find((m) => m.to === sq);
          const customHl = allHighlights.find((h) => h.square === sq);

          let bg = isLight ? theme.light : theme.dark;
          if (isLast) bg = isLight ? theme.lastLight : theme.lastDark;

          const coordColor = isLight ? theme.dark : theme.light;
          const badge =
            !state.customFen &&
            currentStep &&
            currentStep.annotation &&
            currentStep.annotation.badge &&
            lastMove &&
            lastMove.to === sq
              ? currentStep.annotation.badge
              : null;

          squaresHtml += `
            <div class="board-sq ${piece && piece.color === turnColor ? 'playable' : ''} ${legalTarget ? 'legal-dest' : ''}"
                 data-sq="${sq}"
                 style="background-color:${bg}">
              ${isSelected ? `<div style="position:absolute;inset:0;background:rgba(22,134,94,0.34);box-shadow:inset 0 0 0 3px #16865E;pointer-events:none"></div>` : ''}
              ${
                customHl
                  ? `<div style="position:absolute;inset:0;background:${
                      customHl.color === 'rose'
                        ? 'rgba(244,63,94,0.42)'
                        : customHl.color === 'amber'
                        ? 'rgba(245,158,11,0.45)'
                        : customHl.color === 'sky'
                        ? 'rgba(59,130,246,0.42)'
                        : 'rgba(22,134,94,0.42)'
                    };pointer-events:none"></div>`
                  : ''
              }
              ${vCol === 0 ? `<span class="sq-coord-rank" style="color:${coordColor}">${RANKS[rIdx]}</span>` : ''}
              ${vRow === 7 ? `<span class="sq-coord-file" style="color:${coordColor}">${FILES[cIdx]}</span>` : ''}
              ${
                piece
                  ? `<div class="piece-wrap" data-piece-sq="${sq}">${getPieceSvg(piece.color, piece.type)}</div>`
                  : ''
              }
              ${
                legalTarget
                  ? piece
                    ? `<div class="legal-ring"></div>`
                    : `<div class="legal-dot"></div>`
                  : ''
              }
              ${
                badge
                  ? `<div class="move-eval-badge" style="background:${
                      badge === '!!' ? '#06b6d4' : badge === '!' ? '#16865E' : '#F59E0B'
                    }">${escapeHtml(badge)}</div>`
                  : ''
              }
            </div>
          `;
        }
      }

      // Setas SVG sobre o tabuleiro
      let arrowsSvgHtml = '';
      if (allArrows.length > 0) {
        const lines = allArrows
          .map((ar) => {
            const st = squareToCoords(ar.from, state.flipped);
            const en = squareToCoords(ar.to, state.flipped);
            const x1 = st.col * 100 + 50;
            const y1 = st.row * 100 + 50;
            const x2 = en.col * 100 + 50;
            const y2 = en.row * 100 + 50;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.hypot(dx, dy) || 1;
            const tx = x2 - (dx / len) * 20;
            const ty = y2 - (dy / len) * 20;
            const col = ar.color || 'emerald';
            const strokeMap = {
              emerald: 'rgba(22, 134, 94, 0.88)',
              rose: 'rgba(244, 63, 94, 0.88)',
              amber: 'rgba(245, 158, 11, 0.88)',
              sky: 'rgba(59, 130, 246, 0.88)',
            };
            return `<line x1="${x1}" y1="${y1}" x2="${tx}" y2="${ty}" stroke="${strokeMap[col] || strokeMap.emerald}" stroke-width="18" stroke-linecap="round" marker-end="url(#arr-${col})" />`;
          })
          .join('');

        arrowsSvgHtml = `
          <svg viewBox="0 0 800 800" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:20">
            <defs>
              <marker id="arr-emerald" markerWidth="4.2" markerHeight="4.2" refX="2.6" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(22, 134, 94, 0.92)"/></marker>
              <marker id="arr-rose" markerWidth="4.2" markerHeight="4.2" refX="2.6" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(244, 63, 94, 0.92)"/></marker>
              <marker id="arr-amber" markerWidth="4.2" markerHeight="4.2" refX="2.6" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(245, 158, 11, 0.92)"/></marker>
              <marker id="arr-sky" markerWidth="4.2" markerHeight="4.2" refX="2.6" refY="2.1" orient="auto"><polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(59, 130, 246, 0.92)"/></marker>
            </defs>
            ${lines}
          </svg>
        `;
      }

      // Popover de Promoção de Peão (Chess.com style)
      let promoHtml = '';
      if (state.pendingPromotion) {
        const pCoords = squareToCoords(state.pendingPromotion.to, state.flipped);
        promoHtml = `
          <div class="promo-popover" style="left:${pCoords.col * 12.5}%;top:${pCoords.row === 0 ? '0%' : '50%'}">
            ${['q', 'n', 'r', 'b']
              .map(
                (p) => `
              <button type="button" class="promo-btn" data-promo="${p}">
                <div style="width:80%;height:80%">${getPieceSvg(state.pendingPromotion.color, p)}</div>
              </button>
            `
              )
              .join('')}
          </div>
        `;
      }

      // Constrói painel direito: Livro Interativo, 3 Mentores ou Planilha
      let rightColumnContentHtml = '';

      if (state.rightTab === 'book_reader') {
        const blocks = buildInteractiveBookFlow(activeGame, steps, state.notationMode);

        const renderSegmentsHtml = (segments, fallbackPly) => {
          return segments
            .map((seg) => {
              if (seg.type === 'text') return escapeHtml(seg.content);
              const isMainActive =
                !seg.isVariation && !state.customFen && seg.ply === state.currentPly;
              const isVarActive =
                seg.isVariation && state.customFen && seg.fen === state.customFen;
              if (seg.isVariation) {
                return `<button type="button" class="inline-move-chip variation ${isVarActive ? 'active' : ''}" data-var-fen="${escapeHtml(seg.fen)}" data-var-from="${escapeHtml(seg.from)}" data-var-to="${escapeHtml(seg.to)}" data-var-label="${escapeHtml(seg.content)}" data-var-ply="${seg.ply || fallbackPly}" title="Clique para ver esta variante no tabuleiro">♟ ${escapeHtml(seg.content)}</button>`;
              }
              return `<button type="button" class="inline-move-chip ${isMainActive ? 'active' : ''}" data-jump-ply="${seg.ply}" title="Clique para ver este movimento em tempo real no tabuleiro">♟ ${escapeHtml(seg.content)}</button>`;
            })
            .join('');
        };

        const blocksHtml = blocks
          .map((b) => {
            const isActiveBlock =
              !state.customFen &&
              state.currentPly > 0 &&
              (b.focusPly === state.currentPly ||
                (state.currentPly >= b.startPly &&
                  state.currentPly <= b.endPly &&
                  b.startPly > 0));

            const ribbonHtml =
              b.inlineSteps && b.inlineSteps.length > 0
                ? `<div class="passage-moves-ribbon">
                    ${b.inlineSteps
                      .map((st, idx) => {
                        const isAct = !state.customFen && state.currentPly === st.ply;
                        const showNum = st.color === 'w' || idx === 0;
                        return `<button type="button" class="ribbon-move-btn ${isAct ? 'active' : ''}" data-jump-ply="${st.ply}" title="Ir para ${st.moveNumber}${st.color === 'w' ? '.' : '...'} ${escapeHtml(st.formatted)} (Descritiva: ${escapeHtml(st.descriptivePt)})">
                          ${showNum ? `<span style="opacity:0.75;font-size:11px">${st.moveNumber}${st.color === 'w' ? '.' : '...'}</span>` : ''}
                          <span>${escapeHtml(st.formatted)}</span>
                          ${st.badge ? `<span style="font-size:11px;padding:0 4px;border-radius:4px;background:rgba(245,158,11,0.25)">${escapeHtml(st.badge)}</span>` : ''}
                        </button>`;
                      })
                      .join('')}
                  </div>`
                : '';

            const varBoxHtml =
              b.variationSegments && b.variationSegments.length > 0
                ? `<div style="margin-top:10px;padding:10px 12px;border-radius:12px;background:var(--sky-soft);border:1px solid var(--sky-border);font-size:13.5px;color:var(--sky-ink)">
                    <div style="font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:4px">🧭 Variante Comentada no Livro (Clique nos lances):</div>
                    <div>${renderSegmentsHtml(b.variationSegments, b.focusPly || 1)}</div>
                  </div>`
                : '';

            return `
              <article class="book-passage-card ${isActiveBlock ? 'active' : ''} ${b.kind === 'intro' || b.kind === 'theory' ? 'theory' : ''}">
                ${b.title ? `<div style="font-size:11px;font-weight:800;text-transform:uppercase;color:var(--primary);margin-bottom:6px;letter-spacing:0.04em">${escapeHtml(b.title)}</div>` : ''}
                ${ribbonHtml}
                ${b.segments.length > 0 ? `<p class="book-paragraph-text">${renderSegmentsHtml(b.segments, b.focusPly || 1)}</p>` : ''}
                ${varBoxHtml}
              </article>
            `;
          })
          .join('');

        rightColumnContentHtml = `
          <div style="display:flex;flex-direction:column;gap:12px">
            <div style="background:#FFF9ED;border:1px solid var(--border-warm);border-radius:18px;padding:13px 16px">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">
                <span style="font-size:11px;font-weight:800;text-transform:uppercase;color:var(--primary);background:var(--mint-soft);padding:2px 10px;border-radius:999px">
                  📖 Livro Vivo • Lances Clicáveis nos Parágrafos
                </span>
                <span style="font-size:12px;font-weight:700;color:var(--muted)">
                  ${escapeHtml(activeGame.white)} vs. ${escapeHtml(activeGame.black)}
                </span>
              </div>
              <div style="font-size:12.5px;color:var(--on-surface-variant)">
                Clique em <strong>qualquer movimento verde ou âmbar dentro dos parágrafos</strong> para ver a jogada acontecer em tempo real no tabuleiro!
              </div>
            </div>

            ${
              state.customFen
                ? `<div style="background:var(--amber-soft);border:2px solid var(--amber-vibrant);border-radius:16px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px">
                    <div>
                      <div style="font-size:13px;font-weight:800;color:var(--amber-ink)">🔍 Explorando Posição Alternativa: ${escapeHtml(state.customVariationLabel || 'Variante no Tabuleiro')}</div>
                      <div style="font-size:11.5px;color:#855300">Você pode continuar mexendo as peças ou voltar ao ponto exato da leitura.</div>
                    </div>
                    <button type="button" class="tactile-btn primary" id="btn-return-mainline" style="height:34px;font-size:12px;flex-shrink:0">↩ Voltar ao Livro</button>
                  </div>`
                : ''
            }

            <div class="book-reader-scroll">
              ${blocksHtml}
            </div>
          </div>
        `;
      } else if (state.rightTab === 'mentors') {
        const piecePt = nextExpectedStep
          ? PIECE_NAMES_PT[nextExpectedStep.piece] || 'Peça'
          : 'Peça';
        const expectedMovePt = nextExpectedStep
          ? sanToPortugueseAlgebraic(nextExpectedStep.san)
          : '-';
        const hintText =
          state.hintLevel <= 1
            ? (nextExpectedStep &&
                nextExpectedStep.annotation &&
                nextExpectedStep.annotation.hintPt) ||
              'Observe as casas centrais e descubra qual peça pode melhorar sua posição ou criar uma ameaça tática!'
            : state.hintLevel === 2
            ? `Dica de Peça: Olhe com carinho para o seu ${piecePt} na casa ${
                nextExpectedStep ? nextExpectedStep.from : ''
              } rumo à casa ${nextExpectedStep ? nextExpectedStep.to : ''}!`
            : `Solução Explicada: Jogue ${expectedMovePt}! ${
                (nextExpectedStep &&
                  nextExpectedStep.annotation &&
                  nextExpectedStep.annotation.commentPt) ||
                ''
              }`;

        rightColumnContentHtml = `
          <div style="display:flex;flex-direction:column;gap:14px">
            <article class="mentor-card owl">
              <div style="display:flex;align-items:flex-start;gap:12px">
                <div class="mentor-avatar" style="background:var(--amber-soft)">🦉</div>
                <div style="flex:1">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                    <strong style="font-size:16px;color:#855300">A Coruja Sofia pergunta:</strong>
                    <span style="font-size:11px;font-weight:800;padding:2px 9px;border-radius:999px;background:var(--amber-soft);color:var(--amber-ink)">Tutora Chefe</span>
                  </div>
                  <p style="font-size:14.5px;line-height:1.6;color:var(--on-surface)">${escapeHtml(hintText)}</p>
                  <div style="display:flex;gap:6px;margin-top:10px">
                    <button type="button" class="tactile-btn" data-set-hint="1" style="height:32px;font-size:12px">1. Pergunta</button>
                    <button type="button" class="tactile-btn" data-set-hint="2" style="height:32px;font-size:12px">2. Peça & Casa</button>
                    <button type="button" class="tactile-btn" data-set-hint="3" style="height:32px;font-size:12px">3. Ver Solução</button>
                  </div>
                </div>
              </div>
            </article>

            <article class="mentor-card book">
              <div style="display:flex;align-items:flex-start;gap:12px">
                <div class="mentor-avatar" style="background:var(--mint-soft)">📖</div>
                <div style="flex:1">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                    <strong style="font-size:16px;color:var(--primary)">O Livro Mágico conta:</strong>
                    <span style="font-size:11px;font-weight:800;padding:2px 9px;border-radius:999px;background:var(--mint-soft);color:var(--primary)">${escapeHtml(currentEntry.book.author)}</span>
                  </div>
                  <p style="font-size:14px;line-height:1.65;background:#fff;padding:10px 12px;border-radius:14px;border:1px solid #BBF7D0">
                    “${escapeHtml((currentStep && currentStep.annotation && currentStep.annotation.commentPt) || activeGame.introPt)}”
                  </p>
                </div>
              </div>
            </article>

            <article class="mentor-card robot">
              <div style="display:flex;align-items:flex-start;gap:12px">
                <div class="mentor-avatar" style="background:#DBEAFE">🤖</div>
                <div style="flex:1">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
                    <strong style="font-size:16px;color:var(--sky-ink)">O Robô Pipo analisou:</strong>
                    <span style="font-size:12px;font-weight:800;padding:2px 9px;border-radius:999px;background:#DBEAFE;color:var(--sky-ink)">Avaliação: ${evalLabel}</span>
                  </div>
                  <p style="font-size:14px;line-height:1.6">${escapeHtml(engineEval.explanationPt)}</p>
                </div>
              </div>
            </article>
          </div>
        `;
      } else {
        // Planilha completa de lances
        let rowsHtml = '';
        for (let i = 0; i < Math.ceil(steps.length / 2); i++) {
          const w = steps[i * 2];
          const b = steps[i * 2 + 1];
          rowsHtml += `
            <div style="display:grid;grid-template-columns:44px 1fr 1fr;gap:8px;padding:6px 10px;border-radius:10px;background:${i % 2 === 0 ? 'var(--canvas-cream)' : '#fff'}">
              <span style="font-size:12px;font-weight:800;color:var(--muted)">${i + 1}.</span>
              ${w ? `<button type="button" class="ribbon-move-btn ${!state.customFen && state.currentPly === w.ply ? 'active' : ''}" data-jump-ply="${w.ply}" style="justify-content:space-between">${escapeHtml(formatMoveByMode(w, state.notationMode))} ${w.annotation && w.annotation.badge ? `<span>${escapeHtml(w.annotation.badge)}</span>` : ''}</button>` : '<span></span>'}
              ${b ? `<button type="button" class="ribbon-move-btn ${!state.customFen && state.currentPly === b.ply ? 'active' : ''}" data-jump-ply="${b.ply}" style="justify-content:space-between">${escapeHtml(formatMoveByMode(b, state.notationMode))} ${b.annotation && b.annotation.badge ? `<span>${escapeHtml(b.annotation.badge)}</span>` : ''}</button>` : '<span></span>'}
            </div>
          `;
        }
        rightColumnContentHtml = `
          <div class="stitch-card" style="max-height:580px;overflow-y:auto">
            <div style="font-size:14px;font-weight:800;margin-bottom:10px">Planilha Completa de Lances (${steps.length} plies)</div>
            <div style="display:flex;flex-direction:column;gap:4px">${rowsHtml}</div>
          </div>
        `;
      }

      // Opções do Seletor de Livros e Capítulos completos
      const booksOptionsHtml = PREINSTALLED_BOOKS.map(
        (b) =>
          `<option value="${b.id}" ${currentEntry.book.id === b.id ? 'selected' : ''}>📖 ${escapeHtml(b.titlePt)} (${b.chapters.length} capítulos)</option>`
      ).join('');

      const chaptersGamesOptionsHtml = currentEntry.book.chapters
        .map(
          (ch) => `
          <optgroup label="Capítulo ${ch.number}: ${escapeHtml(ch.titlePt)}">
            ${ch.games
              .map(
                (gm) =>
                  `<option value="${gm.id}" ${gm.id === state.selectedGameId ? 'selected' : ''}>${escapeHtml(gm.titlePt)}</option>`
              )
              .join('')}
          </optgroup>
        `
        )
        .join('');

      mainBodyHtml = `
        <section class="stitch-card context-banner">
          <div style="max-width:820px">
            <div class="breadcrumb-row">
              <span style="color:var(--primary)">📚 ${escapeHtml(state.studyType === 'opening' ? 'Repertório de Aberturas' : state.studyType === 'custom_study' ? 'Caderno Google NotebookLM' : `${currentEntry.book.titlePt} • Cap. ${currentEntry.chapter.number}`)}</span>
              <span>•</span>
              <span>${escapeHtml(activeGame.white)} vs. ${escapeHtml(activeGame.black)}</span>
              <span>•</span>
              <span style="background:#e6eeff;color:var(--sky-ink);padding:2px 9px;border-radius:999px;font-size:11px">Lance ${state.currentPly} de ${steps.length}</span>
            </div>
            <h1 class="lesson-title">${escapeHtml(activeGame.titlePt)}</h1>

            ${
              state.studyType === 'book_game'
                ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
                    <select id="select-book-quick" class="pill-select">${booksOptionsHtml}</select>
                    <select id="select-game-quick" class="pill-select" style="max-width:440px">${chaptersGamesOptionsHtml}</select>
                  </div>`
                : ''
            }
          </div>

          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px">
            <button type="button" class="tactile-btn ${!state.trainerActive ? 'primary' : ''}" id="btn-mode-read" style="border-radius:999px;padding:0 14px">
              📖 Modo Leitura & Clique
            </button>
            <button type="button" class="tactile-btn ${state.trainerActive ? 'primary' : ''}" id="btn-mode-challenge" style="border-radius:999px;padding:0 14px">
              🎯 Desafio: Adivinhe o Lance
            </button>
            <select id="select-board-theme" class="pill-select" title="Tema do Tabuleiro">
              ${Object.keys(BOARD_THEMES)
                .map(
                  (k) =>
                    `<option value="${k}" ${state.boardTheme === k ? 'selected' : ''}>🎨 ${escapeHtml(BOARD_THEMES[k].name)}</option>`
                )
                .join('')}
            </select>
          </div>
        </section>

        <div class="studio-grid">
          <!-- COLUNA ESQUERDA: TABULEIRO INTERATIVO ESTILO CHESS.COM -->
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="stitch-card" style="padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px">
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:38px;height:38px;border-radius:999px;background:${turnColor === 'w' ? 'var(--amber-soft)' : '#233144'};color:${turnColor === 'w' ? '#855300' : '#fff'};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800">
                  ${turnColor === 'w' ? '⚪' : '⚫'}
                </div>
                <div>
                  <div style="font-size:15px;font-weight:800">
                    ${
                      state.customFen
                        ? `Explorando Variante no Tabuleiro (${turnColor === 'w' ? 'Brancas' : 'Pretas'})`
                        : `Vez de jogar: ${turnColor === 'w' ? 'Brancas ⚪' : 'Pretas ⚫'}`
                    }
                  </div>
                  <div style="font-size:12px;color:var(--on-surface-variant)">
                    Arraste ou clique nas peças como no Chess.com, ou clique nos lances dentro do parágrafo!
                  </div>
                </div>
              </div>
              ${
                currentStep && !state.customFen
                  ? `<span style="padding:5px 12px;border-radius:12px;background:var(--mint-soft);color:var(--primary);font-size:15px;font-weight:800">${currentStep.moveNumber}${currentStep.color === 'w' ? '. ' : '... '}${escapeHtml(formatMoveByMode(currentStep, state.notationMode))}</span>`
                  : ''
              }
            </div>

            <div class="board-stage-row">
              <div class="eval-bar" title="Avaliação Stockfish Local: ${evalLabel}">
                <div class="eval-fill-dark" style="height:${100 - whitePct}%"></div>
                <div class="eval-fill-light" style="height:${whitePct}%"></div>
                <span class="eval-score-label" style="${engineEval.scoreCp >= 0 ? 'bottom:6px;color:var(--primary)' : 'top:6px;color:#fff'}">${evalLabel}</span>
              </div>

              <div class="board-frame" id="chessboard-frame">
                <div class="board-grid" id="chessboard-grid">
                  ${squaresHtml}
                  ${arrowsSvgHtml}
                  ${promoHtml}
                </div>
              </div>
            </div>

            <div class="stitch-card" style="padding:15px 18px">
              <button type="button" class="hint-gold-btn" id="btn-ask-owl-hint">
                <span>💡</span>
                <span>Pedir Dica Mágica à Coruja Sofia (${state.hintLevel === 0 ? '1 de 3' : `Nível ${state.hintLevel} de 3`})</span>
              </button>

              <div class="transport-grid">
                <button type="button" class="tactile-btn" id="btn-ply-first" ${state.currentPly === 0 && !state.customFen ? 'disabled' : ''}>⏮ Início</button>
                <button type="button" class="tactile-btn" id="btn-ply-prev" ${state.currentPly === 0 && !state.customFen ? 'disabled' : ''}>◀ Voltar</button>
                <button type="button" class="tactile-btn primary" id="btn-ply-next" ${state.currentPly >= steps.length ? 'disabled' : ''}>Avançar ▶</button>
                <button type="button" class="tactile-btn" id="btn-flip-board">🔄 Girar</button>
                <button type="button" class="tactile-btn" id="btn-speak-voice" style="background:var(--sky-soft);color:var(--sky-ink);border-color:var(--sky-border)">🔊 Ouvir Voz</button>
              </div>

              <div style="margin-top:12px">
                <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:5px">
                  <span style="color:var(--primary)">Progresso na Lição: ${progressPct}% (${state.currentPly}/${steps.length} lances)</span>
                  <button type="button" id="btn-mark-complete" style="border:none;background:var(--amber-soft);color:var(--amber-ink);padding:2px 10px;border-radius:999px;font-size:11px;font-weight:800;cursor:pointer">
                    ${state.completedGameIds.includes(activeGame.id) ? '✓ Concluído (+3 ⭐)' : 'Concluir & Coletar 3 ⭐'}
                  </button>
                </div>
                <div class="candy-track">
                  <div class="candy-fill" style="width:${Math.max(4, progressPct)}%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- COLUNA DIREITA: LEITOR INTERATIVO DE PARÁGRAFOS / MENTORES / PLANILHA -->
          <div style="display:flex;flex-direction:column;gap:12px">
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;background:#fff;padding:6px;border-radius:16px;border:1px solid var(--border-warm)">
              <button type="button" class="stitch-nav-btn ${state.rightTab === 'book_reader' ? 'active' : ''}" data-right-tab="book_reader" style="justify-content:center">
                <span>📖</span><span>Livro Interativo</span>
              </button>
              <button type="button" class="stitch-nav-btn ${state.rightTab === 'mentors' ? 'active' : ''}" data-right-tab="mentors" style="justify-content:center">
                <span>🦉</span><span>3 Mentores</span>
              </button>
              <button type="button" class="stitch-nav-btn ${state.rightTab === 'movesheet' ? 'active' : ''}" data-right-tab="movesheet" style="justify-content:center">
                <span>📋</span><span>Planilha (${steps.length})</span>
              </button>
            </div>

            ${
              state.lastFeedback
                ? `<div style="padding:12px 15px;border-radius:16px;border:2px solid ${state.lastFeedback.accepted ? '#16865E' : '#F87171'};background:${state.lastFeedback.accepted ? 'var(--mint-soft)' : 'var(--coral-soft)'};color:${state.lastFeedback.accepted ? '#005237' : '#93000a'}">
                    <div style="font-weight:800;font-size:14px">${escapeHtml(state.lastFeedback.headlinePt)}</div>
                    <div style="font-size:12.5px;margin-top:3px">${escapeHtml(state.lastFeedback.detailPt)}</div>
                  </div>`
                : ''
            }

            ${rightColumnContentHtml}
          </div>
        </div>
      `;
    }

    // ========================================================================
    // TELA 2: BIBLIOTECA MÁGICA (OS 4 LIVROS COMPLETOS + TODOS OS CAPÍTULOS)
    // ========================================================================
    else if (state.navDest === 'library') {
      const booksSectionsHtml = PREINSTALLED_BOOKS.map((book, bIdx) => {
        const chaptersHtml = (book.chapters || [])
          .filter((ch) => {
            if (!state.searchQuery.trim()) return true;
            const q = state.searchQuery.toLowerCase();
            return (
              book.titlePt.toLowerCase().includes(q) ||
              book.author.toLowerCase().includes(q) ||
              ch.titlePt.toLowerCase().includes(q) ||
              ch.subtitlePt.toLowerCase().includes(q)
            );
          })
          .map(
            (ch) => `
            <div style="background:var(--canvas-cream);border:1px solid var(--border-warm);border-radius:18px;padding:15px;display:flex;flex-direction:column;justify-content:space-between;gap:10px">
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
                  <span style="background:var(--primary-container);color:#fff;font-size:11px;font-weight:800;padding:2px 9px;border-radius:8px">Capítulo ${ch.number}</span>
                  <span style="font-size:11px;font-weight:700;color:var(--muted)">${(ch.games || []).length} Lição(ões)</span>
                </div>
                <h3 style="font-size:16px;font-weight:800">${escapeHtml(ch.titlePt)}</h3>
                <p style="font-size:12.5px;color:var(--on-surface-variant);margin-top:3px">${escapeHtml(ch.subtitlePt)}</p>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;padding-top:8px;border-top:1px solid var(--border-warm)">
                ${(ch.games || [])
                  .map(
                    (gm) => `
                  <div style="background:#fff;border:1px solid var(--border-warm);border-radius:12px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px">
                    <div style="min-width:0">
                      <div style="font-size:13.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                        ${state.completedGameIds.includes(gm.id) ? '⭐ ' : '♟️ '}${escapeHtml(gm.titlePt)}
                      </div>
                      <div style="font-size:11.5px;color:var(--muted)">${escapeHtml(gm.white)} vs. ${escapeHtml(gm.black)} (${escapeHtml(gm.year)}) • ${(gm.movesSan || []).length} lances</div>
                    </div>
                    <button type="button" class="tactile-btn primary" data-open-book="${book.id}" data-open-game="${gm.id}" style="height:34px;font-size:12px;flex-shrink:0">
                      📖 Ler & Clicar
                    </button>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
          )
          .join('');

        if (!chaptersHtml) return '';

        return `
          <section class="stitch-card" style="margin-bottom:20px">
            <div style="margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--border-warm)">
              <span style="font-size:11px;font-weight:800;text-transform:uppercase;background:var(--mint-soft);color:var(--primary);padding:3px 10px;border-radius:999px">
                Livro ${bIdx + 1} • ${escapeHtml(book.author)} (${escapeHtml(book.publicationYear)}) • ${(book.chapters || []).length} Capítulos Completos
              </span>
              <h2 style="font-size:22px;font-weight:800;margin-top:6px">${escapeHtml(book.titlePt)}</h2>
              <p style="font-size:13.5px;color:var(--on-surface-variant);margin-top:3px">${escapeHtml(book.descriptionPt)}</p>
            </div>
            <div class="cards-grid-2">${chaptersHtml}</div>
          </section>
        `;
      }).join('');

      mainBodyHtml = `
        <div class="stitch-card" style="margin-bottom:20px">
          <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-bottom:14px">
            <div>
              <span style="font-size:11px;font-weight:800;text-transform:uppercase;background:var(--mint-soft);color:var(--primary);padding:3px 10px;border-radius:999px">✨ Biblioteca Mágica Completa</span>
              <h1 style="font-size:28px;font-weight:800;margin-top:6px">Os 4 Livros Clássicos Completos com Lances Clicáveis</h1>
              <p style="font-size:14px;color:var(--on-surface-variant)">Escolha qualquer capítulo abaixo para ler o texto completo e clicar nos movimentos dentro dos parágrafos.</p>
            </div>
            <input type="text" id="input-library-search" value="${escapeHtml(state.searchQuery)}" placeholder="🔍 Filtrar capítulos, mestres ou temas..." style="height:40px;padding:0 16px;border-radius:999px;border:1px solid var(--border-warm);background:var(--canvas-cream);min-width:290px;font-size:13.5px" />
          </div>
        </div>
        ${booksSectionsHtml}
      `;
    }

    // ========================================================================
    // TELA 3: ABERTURAS, MEIO-JOGO, FINAIS & GOOGLE NOTEBOOKLM
    // ========================================================================
    else if (state.navDest === 'openings') {
      const openingsCardsHtml = CHESS_OPENINGS.map(
        (op) => `
        <div class="stitch-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:12px">
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:11px;font-weight:800;background:var(--mint-soft);color:var(--primary);padding:2px 9px;border-radius:8px">ECO ${escapeHtml(op.eco)} • ${escapeHtml(op.categoryLabelPt)}</span>
              <span style="font-size:11px;font-weight:800;background:var(--amber-soft);color:var(--amber-ink);padding:2px 9px;border-radius:999px">${op.recommendedFor === 'black' ? '⚫ Pretas' : '⚪ Brancas'}</span>
            </div>
            <h3 style="font-size:17px;font-weight:800">${escapeHtml(op.namePt)}</h3>
            <p style="font-size:13px;color:var(--on-surface-variant);margin-top:4px">${escapeHtml(op.summaryPt)}</p>
          </div>
          <div style="display:flex;gap:8px;padding-top:8px;border-top:1px solid var(--border-warm)">
            <button type="button" class="tactile-btn primary" data-open-opening="${op.id}" style="flex:1;height:36px">📖 Estudar & Clicar</button>
            <button type="button" class="tactile-btn" data-challenge-opening="${op.id}" style="height:36px;background:var(--amber-soft);color:var(--amber-ink)">🎯 Desafiar</button>
          </div>
        </div>
      `
      ).join('');

      const customCardsHtml = state.customStudies
        .map(
          (st) => `
          <div class="stitch-card" style="border:2px solid var(--sky-border);display:flex;flex-direction:column;justify-content:space-between;gap:12px">
            <div>
              <span style="font-size:11px;font-weight:800;background:var(--sky-soft);color:var(--sky-ink);padding:2px 9px;border-radius:999px">📓 Google NotebookLM • ${escapeHtml(st.openingNamePt)}</span>
              <h3 style="font-size:17px;font-weight:800;margin-top:6px">${escapeHtml(st.titlePt)}</h3>
              <p style="font-size:13px;color:var(--on-surface-variant);margin-top:4px">${escapeHtml(st.introPt)}</p>
            </div>
            <button type="button" class="tactile-btn primary" data-open-custom="${st.id}" style="width:100%;height:36px">📖 Abrir Estudo Interativo</button>
          </div>
        `
        )
        .join('');

      mainBodyHtml = `
        <div class="stitch-card" style="margin-bottom:20px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px">
          <div>
            <span style="font-size:11px;font-weight:800;text-transform:uppercase;background:var(--amber-soft);color:var(--amber-ink);padding:3px 10px;border-radius:999px">🧭 Aberturas, Meio-Jogo, Finais & Google NotebookLM</span>
            <h1 style="font-size:26px;font-weight:800;margin-top:6px">Laboratório Completo de Estudos</h1>
            <p style="font-size:14px;color:var(--on-surface-variant)">Estude as 18 aberturas clássicas ou importe seus cadernos de Abertura, Meio-Jogo e Final do Google NotebookLM.</p>
          </div>
          <button type="button" class="tactile-btn primary" id="btn-open-notebook-modal-2" style="padding:0 18px;height:42px">
            📓 + Importar do Google NotebookLM / Internet
          </button>
        </div>

        ${
          state.customStudies.length > 0
            ? `<h2 style="font-size:19px;font-weight:800;margin-bottom:12px">📓 Meus Estudos Importados do Google NotebookLM (${state.customStudies.length})</h2>
               <div class="cards-grid-3" style="margin-bottom:24px">${customCardsHtml}</div>`
            : ''
        }

        <h2 style="font-size:19px;font-weight:800;margin-bottom:12px">🌱 Repertório de ${CHESS_OPENINGS.length} Aberturas & Defesas Clássicas</h2>
        <div class="cards-grid-3">${openingsCardsHtml}</div>
      `;
    }

    // ========================================================================
    // TELA 4: GALERIA DE CONQUISTAS & ESTRELAS
    // ========================================================================
    else {
      mainBodyHtml = `
        <div class="stitch-card" style="margin-bottom:20px">
          <span style="font-size:11px;font-weight:800;text-transform:uppercase;background:var(--amber-soft);color:var(--amber-ink);padding:3px 10px;border-radius:999px">✨ Seu Livro dos Campeões</span>
          <h1 style="font-size:28px;font-weight:800;margin-top:6px">🏆 Galeria de Conquistas & Sala dos Troféus</h1>
          <p style="font-size:14.5px;color:var(--on-surface-variant);margin-top:4px">Acompanhe suas Estrelas Mágicas, capítulos dominados e posições na Fila Inteligente de Revisão.</p>
        </div>

        <div class="kpi-grid-4" style="margin-bottom:22px">
          <div class="stitch-card">
            <div style="font-size:13px;font-weight:700;color:var(--on-surface-variant)">Estrelas Mágicas</div>
            <div style="font-size:30px;font-weight:800;margin-top:4px">${totalMagicStars} ⭐</div>
            <div style="font-size:12px;font-weight:700;color:#855300;margin-top:6px">+3 estrelas por capítulo concluído</div>
          </div>
          <div class="stitch-card">
            <div style="font-size:13px;font-weight:700;color:var(--on-surface-variant)">Lições e Capítulos no Acervo</div>
            <div style="font-size:30px;font-weight:800;margin-top:4px">${allEntries.length + state.customStudies.length} 📚</div>
            <div style="font-size:12px;font-weight:700;color:var(--primary);margin-top:6px">${state.completedGameIds.length} concluídos</div>
          </div>
          <div class="stitch-card">
            <div style="font-size:13px;font-weight:700;color:var(--on-surface-variant)">Aberturas & Defesas</div>
            <div style="font-size:30px;font-weight:800;margin-top:4px">${CHESS_OPENINGS.length} 🧭</div>
            <div style="font-size:12px;font-weight:700;color:var(--sky-ink);margin-top:6px">Abertas, Semi-Abertas, Fechadas e Índias</div>
          </div>
          <div class="stitch-card">
            <div style="font-size:13px;font-weight:700;color:var(--on-surface-variant)">Cadernos NotebookLM</div>
            <div style="font-size:30px;font-weight:800;margin-top:4px">${state.customStudies.length} 📓</div>
            <div style="font-size:12px;font-weight:700;color:var(--on-surface-variant);margin-top:6px">Prontos para leitura interativa</div>
          </div>
        </div>
      `;
    }

    // Modal do Google NotebookLM
    const notebookModalHtml = state.isNotebookModalOpen
      ? `
      <div class="stitch-modal-backdrop" id="modal-notebook-backdrop">
        <div class="stitch-modal-panel">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px">
            <div>
              <span style="font-size:11px;font-weight:800;text-transform:uppercase;background:var(--mint-soft);color:var(--primary);padding:3px 10px;border-radius:999px">📓 Integração Google NotebookLM & Internet</span>
              <h2 style="font-size:21px;font-weight:800;margin-top:5px">Importar Estudo (Aberturas, Meio-Jogo ou Finais)</h2>
              <p style="font-size:13px;color:var(--on-surface-variant)">Cole resumos do Google NotebookLM, textos da internet ou PGNs. Todos os movimentos citados nos parágrafos viram botões clicáveis!</p>
            </div>
            <button type="button" class="icon-circle-btn" id="btn-close-notebook-modal">✕</button>
          </div>

          <div style="display:flex;flex-direction:column;gap:12px">
            <div>
              <label style="font-size:12px;font-weight:800;display:block;margin-bottom:4px">Título do Estudo:</label>
              <input type="text" id="nb-input-title" value="${escapeHtml(state.nbTitle)}" style="width:100%;height:38px;padding:0 12px;border-radius:12px;border:1px solid var(--border-warm);background:#fff" />
            </div>
            <div>
              <label style="font-size:12px;font-weight:800;display:block;margin-bottom:4px">Posição Inicial FEN (Opcional — deixe vazio para início padrão):</label>
              <input type="text" id="nb-input-fen" value="${escapeHtml(state.nbFen)}" placeholder="Ex: 8/8/4k3/8/4P3/4K3/8/8 w - - 0 1" style="width:100%;height:36px;padding:0 12px;border-radius:12px;border:1px solid var(--border-warm);background:#fff;font-family:var(--font-mono);font-size:12.5px" />
            </div>
            <div>
              <label style="font-size:12px;font-weight:800;display:block;margin-bottom:4px">Texto do Google NotebookLM / Artigo / PGN:</label>
              <textarea id="nb-input-text" rows="7" style="width:100%;padding:12px;border-radius:14px;border:1px solid var(--border-warm);background:#fff;font-size:13.5px;line-height:1.6">${escapeHtml(state.nbText)}</textarea>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:6px">
              <button type="button" class="tactile-btn" id="btn-cancel-notebook-modal" style="padding:0 16px">Cancelar</button>
              <button type="button" class="tactile-btn primary" id="btn-save-notebook-study" style="padding:0 18px">✨ Criar Estudo Interativo & Abrir no Tabuleiro</button>
            </div>
          </div>
        </div>
      </div>
    `
      : '';

    root.innerHTML = `
      <div class="app-shell">
        ${headerHtml}
        <main class="stitch-main">
          ${mainBodyHtml}
        </main>
        ${notebookModalHtml}
      </div>
    `;

    // Animação suave estilo Chess.com na peça do último lance
    if (state.navDest === 'learn') {
      const lastMove = state.customLastMove
        ? state.customLastMove
        : currentStep
        ? { from: currentStep.from, to: currentStep.to }
        : null;
      const moveKey = lastMove ? `${lastMove.from}-${lastMove.to}-${activeFen}` : '';
      if (lastMove && moveKey !== state.lastAnimatedMoveKey) {
        state.lastAnimatedMoveKey = moveKey;
        const pieceEl = root.querySelector(`[data-piece-sq="${lastMove.to}"]`);
        if (pieceEl) {
          const st = squareToCoords(lastMove.from, state.flipped);
          const en = squareToCoords(lastMove.to, state.flipped);
          const dx = (st.col - en.col) * 100;
          const dy = (st.row - en.row) * 100;
          pieceEl.style.transition = 'none';
          pieceEl.style.transform = `translate(${dx}%, ${dy}%)`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              pieceEl.style.transition = 'transform 185ms cubic-bezier(0.22, 1, 0.36, 1)';
              pieceEl.style.transform = 'translate(0, 0)';
            });
          });
        }
      }
    }

    attachDomListeners(steps, activeFen, nextExpectedStep, engineEval, activeGame);
  }

  // ==========================================================================
  // 8. LISTENERS DE EVENTOS (CLIQUE NOS PARÁGRAFOS, TABULEIRO CHESS.COM, ETC.)
  // ==========================================================================
  function goToPly(targetPly, steps) {
    const clamped = Math.max(0, Math.min(steps.length, targetPly));
    state.customFen = null;
    state.customLastMove = null;
    state.customVariationLabel = null;
    state.selectedSquare = null;
    state.pendingPromotion = null;
    state.hintLevel = 0;
    state.lastFeedback = null;
    state.currentPly = clamped;
    if (clamped > 0 && steps[clamped - 1]) {
      const s = steps[clamped - 1];
      if (s.captured) chessAudio.playCapture();
      else chessAudio.playMove();
    }
    renderApp();
  }

  function executeMoveOnBoard(fromSq, toSq, promoPiece, steps, activeFen, nextExpectedStep, engineEval) {
    try {
      const c = new Chess(activeFen);
      const mv = c.move({ from: fromSq, to: toSq, promotion: promoPiece || 'q' });
      if (!mv) return false;

      if (state.trainerActive && nextExpectedStep && !state.customFen) {
        if (mv.san === nextExpectedStep.san) {
          chessAudio.playSuccess();
          state.lastFeedback = {
            accepted: true,
            headlinePt: `Excelente! Lance do Mestre: ${sanToPortugueseAlgebraic(mv.san)}`,
            detailPt:
              (nextExpectedStep.annotation && nextExpectedStep.annotation.commentPt) ||
              'Você encontrou o lance exato do capítulo!',
          };
          state.currentPly = Math.min(steps.length, state.currentPly + 1);
          state.selectedSquare = null;
          renderApp();
          return true;
        } else {
          chessAudio.playError();
          state.lastFeedback = {
            accepted: false,
            headlinePt: `Quase lá! Você tentou ${sanToPortugueseAlgebraic(mv.san)}`,
            detailPt:
              'Essa peça tem outra missão estratégica agora. Clique em "Pedir Dica Mágica" ou tente novamente!',
          };
          state.selectedSquare = null;
          renderApp();
          return false;
        }
      }

      if (!state.customFen && nextExpectedStep && mv.san === nextExpectedStep.san) {
        goToPly(state.currentPly + 1, steps);
        return true;
      }

      state.customFen = c.fen();
      state.customLastMove = { from: mv.from, to: mv.to };
      state.customVariationLabel = sanToPortugueseAlgebraic(mv.san);
      state.selectedSquare = null;
      if (mv.captured) chessAudio.playCapture();
      else chessAudio.playMove();
      renderApp();
      return true;
    } catch {
      return false;
    }
  }

  function attachDomListeners(steps, activeFen, nextExpectedStep, engineEval, activeGame) {
    const root = document.getElementById('root');
    if (!root) return;

    // Navegação das 4 abas do Stitch
    root.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.navDest = btn.getAttribute('data-nav');
        renderApp();
      });
    });

    // Sub-abas da coluna direita
    root.querySelectorAll('[data-right-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.rightTab = btn.getAttribute('data-right-tab');
        renderApp();
      });
    });

    // Clique em qualquer lance da linha principal dentro do parágrafo ou planilha
    root.querySelectorAll('[data-jump-ply]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const ply = parseInt(btn.getAttribute('data-jump-ply'), 10);
        if (!isNaN(ply)) goToPly(ply, steps);
      });
    });

    // Clique em qualquer lance de variante dentro do parágrafo
    root.querySelectorAll('[data-var-fen]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.customFen = btn.getAttribute('data-var-fen');
        state.customLastMove = {
          from: btn.getAttribute('data-var-from'),
          to: btn.getAttribute('data-var-to'),
        };
        state.customVariationLabel = btn.getAttribute('data-var-label');
        const p = parseInt(btn.getAttribute('data-var-ply'), 10);
        if (!isNaN(p)) state.currentPly = p;
        chessAudio.playMove();
        renderApp();
      });
    });

    const btnReturnMain = document.getElementById('btn-return-mainline');
    if (btnReturnMain) {
      btnReturnMain.addEventListener('click', () => {
        state.customFen = null;
        state.customLastMove = null;
        state.customVariationLabel = null;
        renderApp();
      });
    }

    // Seletor de Notação
    const selNot = document.getElementById('select-notation-mode');
    if (selNot) {
      selNot.addEventListener('change', (e) => {
        state.notationMode = e.target.value;
        persistState();
        renderApp();
      });
    }

    // Seletor de Tema do Tabuleiro
    const selTheme = document.getElementById('select-board-theme');
    if (selTheme) {
      selTheme.addEventListener('change', (e) => {
        state.boardTheme = e.target.value;
        renderApp();
      });
    }

    // Seletores rápidos de Livro e Capítulo
    const selBook = document.getElementById('select-book-quick');
    if (selBook) {
      selBook.addEventListener('change', (e) => {
        const bk = PREINSTALLED_BOOKS.find((b) => b.id === e.target.value);
        if (bk && bk.chapters[0] && bk.chapters[0].games[0]) {
          state.selectedBookId = bk.id;
          state.selectedGameId = bk.chapters[0].games[0].id;
          state.studyType = 'book_game';
          goToPly(0, steps);
        }
      });
    }

    const selGame = document.getElementById('select-game-quick');
    if (selGame) {
      selGame.addEventListener('change', (e) => {
        state.selectedGameId = e.target.value;
        state.studyType = 'book_game';
        goToPly(0, steps);
      });
    }

    // Controles do Tabuleiro
    const btnFirst = document.getElementById('btn-ply-first');
    if (btnFirst) btnFirst.addEventListener('click', () => goToPly(0, steps));
    const btnPrev = document.getElementById('btn-ply-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => goToPly(state.currentPly - 1, steps));
    const btnNext = document.getElementById('btn-ply-next');
    if (btnNext) btnNext.addEventListener('click', () => goToPly(state.currentPly + 1, steps));
    const btnFlip = document.getElementById('btn-flip-board');
    if (btnFlip) {
      btnFlip.addEventListener('click', () => {
        state.flipped = !state.flipped;
        renderApp();
      });
    }

    const btnMute = document.getElementById('btn-toggle-mute');
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        state.soundMuted = !state.soundMuted;
        chessAudio.setMuted(state.soundMuted);
        renderApp();
      });
    }

    const btnHint = document.getElementById('btn-ask-owl-hint');
    if (btnHint) {
      btnHint.addEventListener('click', () => {
        state.hintLevel = state.hintLevel < 3 ? state.hintLevel + 1 : 1;
        state.rightTab = 'mentors';
        renderApp();
      });
    }

    root.querySelectorAll('[data-set-hint]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.hintLevel = parseInt(btn.getAttribute('data-set-hint'), 10);
        renderApp();
      });
    });

    const btnSpeak = document.getElementById('btn-speak-voice');
    if (btnSpeak) {
      btnSpeak.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const currentStep = state.currentPly > 0 ? steps[state.currentPly - 1] : null;
          const txt =
            (currentStep && currentStep.annotation && currentStep.annotation.commentPt) ||
            activeGame.introPt;
          const u = new SpeechSynthesisUtterance(txt);
          u.lang = 'pt-BR';
          window.speechSynthesis.speak(u);
        } else {
          chessAudio.playSuccess();
        }
      });
    }

    const btnComplete = document.getElementById('btn-mark-complete');
    if (btnComplete) {
      btnComplete.addEventListener('click', () => {
        if (!state.completedGameIds.includes(activeGame.id)) {
          state.completedGameIds.push(activeGame.id);
          persistState();
        }
        chessAudio.playSuccess();
        renderApp();
      });
    }

    const btnModeRead = document.getElementById('btn-mode-read');
    if (btnModeRead) {
      btnModeRead.addEventListener('click', () => {
        state.trainerActive = false;
        state.rightTab = 'book_reader';
        renderApp();
      });
    }

    const btnModeChallenge = document.getElementById('btn-mode-challenge');
    if (btnModeChallenge) {
      btnModeChallenge.addEventListener('click', () => {
        state.trainerActive = true;
        state.rightTab = 'mentors';
        state.customFen = null;
        renderApp();
      });
    }

    // Interação de Clique e Promoção nas Casas do Tabuleiro
    root.querySelectorAll('[data-promo]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const promo = btn.getAttribute('data-promo');
        if (state.pendingPromotion) {
          const { from, to } = state.pendingPromotion;
          state.pendingPromotion = null;
          executeMoveOnBoard(from, to, promo, steps, activeFen, nextExpectedStep, engineEval);
        }
      });
    });

    root.querySelectorAll('[data-sq]').forEach((sqEl) => {
      const sq = sqEl.getAttribute('data-sq');
      sqEl.addEventListener('contextmenu', (e) => e.preventDefault());
      sqEl.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
          e.preventDefault();
          state.rightClickStart = sq;
          return;
        }
        if (e.button !== 0) return;

        if (state.userArrows.length || state.userHighlights.length) {
          state.userArrows = [];
          state.userHighlights = [];
        }

        const c = new Chess(activeFen);
        if (state.selectedSquare && state.selectedSquare !== sq) {
          const legals = c.moves({ square: state.selectedSquare, verbose: true });
          const match = legals.find((m) => m.to === sq);
          if (match) {
            if (match.promotion || (match.flags && match.flags.includes('p'))) {
              state.pendingPromotion = { from: state.selectedSquare, to: sq, color: c.turn() };
              state.selectedSquare = null;
              renderApp();
              return;
            }
            executeMoveOnBoard(state.selectedSquare, sq, 'q', steps, activeFen, nextExpectedStep, engineEval);
            return;
          }
        }

        const p = c.get(sq);
        if (p && p.color === c.turn()) {
          state.selectedSquare = sq;
          renderApp();
        } else if (state.selectedSquare) {
          state.selectedSquare = null;
          renderApp();
        }
      });

      sqEl.addEventListener('mouseup', (e) => {
        if (e.button === 2 && state.rightClickStart) {
          e.preventDefault();
          const drawCol = e.shiftKey
            ? 'emerald'
            : e.altKey
            ? 'sky'
            : e.metaKey || e.ctrlKey
            ? 'rose'
            : 'amber';
          if (sq === state.rightClickStart) {
            const exists = state.userHighlights.some((h) => h.square === sq);
            state.userHighlights = exists
              ? state.userHighlights.filter((h) => h.square !== sq)
              : [...state.userHighlights, { square: sq, color: drawCol }];
          } else {
            const exists = state.userArrows.some(
              (a) => a.from === state.rightClickStart && a.to === sq
            );
            state.userArrows = exists
              ? state.userArrows.filter(
                  (a) => !(a.from === state.rightClickStart && a.to === sq)
                )
              : [...state.userArrows, { from: state.rightClickStart, to: sq, color: drawCol }];
          }
          state.rightClickStart = null;
          renderApp();
        }
      });
    });

    // Abrir capítulos da Biblioteca Mágica
    root.querySelectorAll('[data-open-game]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedBookId = btn.getAttribute('data-open-book');
        state.selectedGameId = btn.getAttribute('data-open-game');
        state.studyType = 'book_game';
        state.navDest = 'learn';
        state.rightTab = 'book_reader';
        state.trainerActive = false;
        goToPly(0, steps);
      });
    });

    const inputLibSearch = document.getElementById('input-library-search');
    if (inputLibSearch) {
      inputLibSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderApp();
        const el = document.getElementById('input-library-search');
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      });
    }

    // Abrir Aberturas e Estudos NotebookLM
    root.querySelectorAll('[data-open-opening]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedOpeningId = btn.getAttribute('data-open-opening');
        state.studyType = 'opening';
        state.navDest = 'learn';
        state.rightTab = 'book_reader';
        state.trainerActive = false;
        goToPly(0, steps);
      });
    });

    root.querySelectorAll('[data-challenge-opening]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedOpeningId = btn.getAttribute('data-challenge-opening');
        state.studyType = 'opening';
        state.navDest = 'learn';
        state.rightTab = 'mentors';
        state.trainerActive = true;
        goToPly(0, steps);
      });
    });

    root.querySelectorAll('[data-open-custom]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedCustomStudyId = btn.getAttribute('data-open-custom');
        state.studyType = 'custom_study';
        state.navDest = 'learn';
        state.rightTab = 'book_reader';
        state.trainerActive = false;
        goToPly(0, steps);
      });
    });

    // Modal Google NotebookLM
    const openNb1 = document.getElementById('btn-open-notebook-modal');
    const openNb2 = document.getElementById('btn-open-notebook-modal-2');
    [openNb1, openNb2].forEach((b) => {
      if (b) {
        b.addEventListener('click', () => {
          state.isNotebookModalOpen = true;
          renderApp();
        });
      }
    });

    const closeNb = document.getElementById('btn-close-notebook-modal');
    const cancelNb = document.getElementById('btn-cancel-notebook-modal');
    [closeNb, cancelNb].forEach((b) => {
      if (b) {
        b.addEventListener('click', () => {
          state.isNotebookModalOpen = false;
          renderApp();
        });
      }
    });

    const saveNb = document.getElementById('btn-save-notebook-study');
    if (saveNb) {
      saveNb.addEventListener('click', () => {
        const titleEl = document.getElementById('nb-input-title');
        const fenEl = document.getElementById('nb-input-fen');
        const textEl = document.getElementById('nb-input-text');
        const rawText = textEl ? textEl.value : state.nbText;
        const customFen = fenEl && fenEl.value.trim() ? fenEl.value.trim() : undefined;
        const titlePt =
          (titleEl && titleEl.value.trim()) || 'Estudo Interativo Google NotebookLM';

        const c = customFen ? new Chess(customFen) : new Chess();
        const movesSan = [];
        const annotations = {};
        const paras = rawText
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean);

        for (const p of paras) {
          const words = p.split(/\s+/);
          for (const w of words) {
            const stripped = w.replace(/^\d+\.{1,3}/, '').replace(/[.,;!?)]+$/, '');
            if (!stripped || /^\d+$/.test(stripped)) continue;
            const sanCand = portugueseAlgebraicToSan(stripped);
            try {
              const mv = c.move(sanCand, { sloppy: true });
              if (mv) movesSan.push(mv.san);
            } catch {}
          }
          if (movesSan.length > 0 && !annotations[movesSan.length]) {
            annotations[movesSan.length] = {
              ply: movesSan.length,
              commentPt: p.replace(/^#{1,3}\s+/, ''),
            };
          }
        }

        if (movesSan.length === 0) {
          ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'].forEach((m) => movesSan.push(m));
        }

        const newStudy = {
          id: `nb-${Date.now()}`,
          titlePt,
          white: 'Brancas (NotebookLM)',
          black: 'Pretas (NotebookLM)',
          event: 'Caderno Google NotebookLM',
          year: '2026',
          result: '1-0',
          openingNamePt: 'Estudo Google NotebookLM',
          heroColor: 'w',
          initialFen: customFen,
          introPt: paras[0] || titlePt,
          readingSectionsPt: paras.map((p, idx) => ({
            headingPt: idx === 0 ? 'Notas do Google NotebookLM' : null,
            bodyPt: p.replace(/^#{1,3}\s+/, ''),
            focusPly: 1,
          })),
          keyTakeawaysPt: ['Estudo importado com movimentos clicáveis nos parágrafos.'],
          movesSan,
          annotations,
        };

        state.customStudies.unshift(newStudy);
        state.selectedCustomStudyId = newStudy.id;
        state.studyType = 'custom_study';
        state.isNotebookModalOpen = false;
        state.navDest = 'learn';
        state.rightTab = 'book_reader';
        persistState();
        goToPly(0, steps);
      });
    }
  }

  // Atalhos de Teclado Globais (←, →, ↑, ↓, F)
  window.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (state.navDest !== 'learn') return;
    const activeGame = getActiveUnifiedGame();
    const { steps } = buildGameSteps(activeGame);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToPly(state.currentPly + 1, steps);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPly(state.currentPly - 1, steps);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      goToPly(0, steps);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      goToPly(steps.length, steps);
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      state.flipped = !state.flipped;
      renderApp();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
  } else {
    renderApp();
  }
})();
