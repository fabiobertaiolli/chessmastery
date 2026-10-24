/**
 * Chess Mastery — Self-Contained Chess Rules, SAN/Descriptive Notation & Local Stockfish Engine
 * 100% Offline · Otimizado para Apple Silicon M2 (8GB RAM)
 */
(function () {
  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const FILES_DESC_PT = { a: 'TD', b: 'CD', c: 'BD', d: 'D', e: 'R', f: 'BR', g: 'CR', h: 'TR' };
  const FILES_DESC_ES = { a: 'TD', b: 'CD', c: 'AD', d: 'D', e: 'R', f: 'AR', g: 'CR', h: 'TR' };
  const PIECE_NAMES_PT = { p: 'P', n: 'C', b: 'B', r: 'T', q: 'D', k: 'R' };
  const PIECE_NAMES_ES = { p: 'P', n: 'C', b: 'A', r: 'T', q: 'D', k: 'R' };
  const FIGURINES_W = { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '' };
  const FIGURINES_B = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '' };

  function sqToRC(sq) {
    return { r: RANKS.indexOf(sq[1]), c: FILES.indexOf(sq[0]) };
  }
  function rcToSq(r, c) {
    if (r < 0 || r > 7 || c < 0 || c > 7) return null;
    return FILES[c] + RANKS[r];
  }

  class ChessEngine {
    constructor(fen) {
      this.load(fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    }

    load(fen) {
      const parts = fen.trim().split(/\s+/);
      const rows = parts[0].split('/');
      this.grid = Array.from({ length: 8 }, () => Array(8).fill(null));
      for (let r = 0; r < 8; r++) {
        let c = 0;
        for (const ch of rows[r]) {
          if (ch >= '1' && ch <= '8') {
            c += parseInt(ch, 10);
          } else {
            const color = ch === ch.toUpperCase() ? 'w' : 'b';
            const type = ch.toLowerCase();
            this.grid[r][c] = { type, color, square: rcToSq(r, c) };
            c++;
          }
        }
      }
      this.turnColor = parts[1] || 'w';
      this.castling = parts[2] || '-';
      this.epSquare = parts[3] && parts[3] !== '-' ? parts[3] : null;
      this.halfMoves = parseInt(parts[4] || '0', 10);
      this.fullMoves = parseInt(parts[5] || '1', 10);
    }

    fen() {
      const rows = [];
      for (let r = 0; r < 8; r++) {
        let s = '';
        let empty = 0;
        for (let c = 0; c < 8; c++) {
          const p = this.grid[r][c];
          if (!p) {
            empty++;
          } else {
            if (empty > 0) {
              s += empty;
              empty = 0;
            }
            s += p.color === 'w' ? p.type.toUpperCase() : p.type;
          }
        }
        if (empty > 0) s += empty;
        rows.push(s);
      }
      return `${rows.join('/')} ${this.turnColor} ${this.castling || '-'} ${this.epSquare || '-'} ${this.halfMoves} ${this.fullMoves}`;
    }

    clone() {
      return new ChessEngine(this.fen());
    }

    turn() {
      return this.turnColor;
    }

    board() {
      return this.grid.map((row, r) =>
        row.map((cell, c) => (cell ? { ...cell, square: rcToSq(r, c) } : null))
      );
    }

    get(sq) {
      const { r, c } = sqToRC(sq);
      if (r < 0 || r > 7 || c < 0 || c > 7) return null;
      return this.grid[r][c];
    }

    findKing(color) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = this.grid[r][c];
          if (p && p.type === 'k' && p.color === color) return { r, c, sq: rcToSq(r, c) };
        }
      }
      return null;
    }

    isSquareAttacked(targetR, targetC, byColor) {
      // Pawns
      const pawnDir = byColor === 'w' ? 1 : -1; // white attacks from targetR + 1 upwards
      for (const dc of [-1, 1]) {
        const pr = targetR + pawnDir;
        const pc = targetC + dc;
        if (pr >= 0 && pr <= 7 && pc >= 0 && pc <= 7) {
          const p = this.grid[pr][pc];
          if (p && p.color === byColor && p.type === 'p') return true;
        }
      }
      // Knights
      const kJumps = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1],
      ];
      for (const [dr, dc] of kJumps) {
        const nr = targetR + dr, nc = targetC + dc;
        if (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
          const p = this.grid[nr][nc];
          if (p && p.color === byColor && p.type === 'n') return true;
        }
      }
      // King
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const kr = targetR + dr, kc = targetC + dc;
          if (kr >= 0 && kr <= 7 && kc >= 0 && kc <= 7) {
            const p = this.grid[kr][kc];
            if (p && p.color === byColor && p.type === 'k') return true;
          }
        }
      }
      // Rook / Queen (orthogonal)
      const ortho = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of ortho) {
        let nr = targetR + dr, nc = targetC + dc;
        while (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
          const p = this.grid[nr][nc];
          if (p) {
            if (p.color === byColor && (p.type === 'r' || p.type === 'q')) return true;
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      // Bishop / Queen (diagonal)
      const diag = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
      for (const [dr, dc] of diag) {
        let nr = targetR + dr, nc = targetC + dc;
        while (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
          const p = this.grid[nr][nc];
          if (p) {
            if (p.color === byColor && (p.type === 'b' || p.type === 'q')) return true;
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
      return false;
    }

    inCheck(color = this.turnColor) {
      const k = this.findKing(color);
      if (!k) return false;
      const enemy = color === 'w' ? 'b' : 'w';
      return this.isSquareAttacked(k.r, k.c, enemy);
    }

    generatePseudoMoves(color = this.turnColor) {
      const list = [];
      const enemy = color === 'w' ? 'b' : 'w';

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = this.grid[r][c];
          if (!p || p.color !== color) continue;
          const from = rcToSq(r, c);

          if (p.type === 'p') {
            const dir = color === 'w' ? -1 : 1;
            const startRank = color === 'w' ? 6 : 1;
            const promoRank = color === 'w' ? 0 : 7;

            // 1 step forward
            const r1 = r + dir;
            if (r1 >= 0 && r1 <= 7 && !this.grid[r1][c]) {
              if (r1 === promoRank) {
                for (const pr of ['q', 'r', 'b', 'n']) {
                  list.push({ from, to: rcToSq(r1, c), piece: 'p', color, promotion: pr, flags: 'np' });
                }
              } else {
                list.push({ from, to: rcToSq(r1, c), piece: 'p', color, flags: 'n' });
                // 2 steps forward
                const r2 = r + dir * 2;
                if (r === startRank && !this.grid[r2][c]) {
                  list.push({ from, to: rcToSq(r2, c), piece: 'p', color, flags: 'b' });
                }
              }
            }
            // Captures
            for (const dc of [-1, 1]) {
              const nc = c + dc;
              if (nc < 0 || nc > 7 || r1 < 0 || r1 > 7) continue;
              const targetSq = rcToSq(r1, nc);
              const occ = this.grid[r1][nc];
              if (occ && occ.color === enemy) {
                if (r1 === promoRank) {
                  for (const pr of ['q', 'r', 'b', 'n']) {
                    list.push({
                      from,
                      to: targetSq,
                      piece: 'p',
                      color,
                      captured: occ.type,
                      promotion: pr,
                      flags: 'cp',
                    });
                  }
                } else {
                  list.push({ from, to: targetSq, piece: 'p', color, captured: occ.type, flags: 'c' });
                }
              } else if (this.epSquare && targetSq === this.epSquare) {
                list.push({ from, to: targetSq, piece: 'p', color, captured: 'p', flags: 'e' });
              }
            }
          } else if (p.type === 'n') {
            const jumps = [
              [-2, -1], [-2, 1], [-1, -2], [-1, 2],
              [1, -2], [1, 2], [2, -1], [2, 1],
            ];
            for (const [dr, dc] of jumps) {
              const nr = r + dr, nc = c + dc;
              if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;
              const occ = this.grid[nr][nc];
              if (!occ) {
                list.push({ from, to: rcToSq(nr, nc), piece: 'n', color, flags: 'n' });
              } else if (occ.color === enemy) {
                list.push({ from, to: rcToSq(nr, nc), piece: 'n', color, captured: occ.type, flags: 'c' });
              }
            }
          } else if (p.type === 'k') {
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr, nc = c + dc;
                if (nr < 0 || nr > 7 || nc < 0 || nc > 7) continue;
                const occ = this.grid[nr][nc];
                if (!occ) {
                  list.push({ from, to: rcToSq(nr, nc), piece: 'k', color, flags: 'n' });
                } else if (occ.color === enemy) {
                  list.push({ from, to: rcToSq(nr, nc), piece: 'k', color, captured: occ.type, flags: 'c' });
                }
              }
            }
            // Castling
            const homeR = color === 'w' ? 7 : 0;
            if (r === homeR && c === 4 && !this.inCheck(color)) {
              const kRight = color === 'w' ? 'K' : 'k';
              const qRight = color === 'w' ? 'Q' : 'q';
              if (
                this.castling.includes(kRight) &&
                !this.grid[homeR][5] &&
                !this.grid[homeR][6] &&
                !this.isSquareAttacked(homeR, 5, enemy) &&
                !this.isSquareAttacked(homeR, 6, enemy)
              ) {
                list.push({ from, to: rcToSq(homeR, 6), piece: 'k', color, flags: 'k' });
              }
              if (
                this.castling.includes(qRight) &&
                !this.grid[homeR][3] &&
                !this.grid[homeR][2] &&
                !this.grid[homeR][1] &&
                !this.isSquareAttacked(homeR, 3, enemy) &&
                !this.isSquareAttacked(homeR, 2, enemy)
              ) {
                list.push({ from, to: rcToSq(homeR, 2), piece: 'k', color, flags: 'q' });
              }
            }
          } else {
            const dirs =
              p.type === 'b'
                ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
                : p.type === 'r'
                ? [[-1, 0], [1, 0], [0, -1], [0, 1]]
                : [
                    [-1, -1], [-1, 1], [1, -1], [1, 1],
                    [-1, 0], [1, 0], [0, -1], [0, 1],
                  ];
            for (const [dr, dc] of dirs) {
              let nr = r + dr, nc = c + dc;
              while (nr >= 0 && nr <= 7 && nc >= 0 && nc <= 7) {
                const occ = this.grid[nr][nc];
                if (!occ) {
                  list.push({ from, to: rcToSq(nr, nc), piece: p.type, color, flags: 'n' });
                } else {
                  if (occ.color === enemy) {
                    list.push({
                      from,
                      to: rcToSq(nr, nc),
                      piece: p.type,
                      color,
                      captured: occ.type,
                      flags: 'c',
                    });
                  }
                  break;
                }
                nr += dr;
                nc += dc;
              }
            }
          }
        }
      }
      return list;
    }

    applyRawMove(m) {
      const fromRC = sqToRC(m.from);
      const toRC = sqToRC(m.to);
      const moving = this.grid[fromRC.r][fromRC.c];

      this.grid[fromRC.r][fromRC.c] = null;

      // En passant capture
      if (m.flags === 'e') {
        const capR = m.color === 'w' ? toRC.r + 1 : toRC.r - 1;
        this.grid[capR][toRC.c] = null;
      }

      // Castling rook move
      if (m.flags === 'k') {
        const rook = this.grid[fromRC.r][7];
        this.grid[fromRC.r][7] = null;
        if (rook) this.grid[fromRC.r][5] = { ...rook, square: rcToSq(fromRC.r, 5) };
      } else if (m.flags === 'q') {
        const rook = this.grid[fromRC.r][0];
        this.grid[fromRC.r][0] = null;
        if (rook) this.grid[fromRC.r][3] = { ...rook, square: rcToSq(fromRC.r, 3) };
      }

      const finalType = m.promotion ? m.promotion : moving.type;
      this.grid[toRC.r][toRC.c] = { type: finalType, color: m.color, square: m.to };

      // Update castling rights
      let cRights = this.castling === '-' ? '' : this.castling;
      if (moving.type === 'k') {
        cRights = m.color === 'w' ? cRights.replace(/[KQ]/g, '') : cRights.replace(/[kq]/g, '');
      }
      if (m.from === 'a1' || m.to === 'a1') cRights = cRights.replace('Q', '');
      if (m.from === 'h1' || m.to === 'h1') cRights = cRights.replace('K', '');
      if (m.from === 'a8' || m.to === 'a8') cRights = cRights.replace('q', '');
      if (m.from === 'h8' || m.to === 'h8') cRights = cRights.replace('k', '');
      this.castling = cRights || '-';

      // En passant target
      if (m.flags === 'b') {
        const epR = (fromRC.r + toRC.r) >> 1;
        this.epSquare = rcToSq(epR, fromRC.c);
      } else {
        this.epSquare = null;
      }

      if (m.color === 'b') this.fullMoves++;
      this.turnColor = m.color === 'w' ? 'b' : 'w';
    }

    moves(opts = {}) {
      const pseudo = this.generatePseudoMoves(this.turnColor);
      const legal = [];

      for (const m of pseudo) {
        if (opts.square && m.from !== opts.square) continue;
        const sim = this.clone();
        sim.applyRawMove(m);
        if (!sim.inCheck(m.color)) {
          legal.push({ ...m, _sim: sim });
        }
      }

      // Compute canonical SAN for each legal move
      for (const m of legal) {
        let baseSan = '';
        if (m.flags === 'k') {
          baseSan = 'O-O';
        } else if (m.flags === 'q') {
          baseSan = 'O-O-O';
        } else if (m.piece === 'p') {
          if (m.captured) {
            baseSan = `${m.from[0]}x${m.to}`;
          } else {
            baseSan = m.to;
          }
          if (m.promotion) {
            baseSan += `=${m.promotion.toUpperCase()}`;
          }
        } else {
          const pUpper = m.piece.toUpperCase();
          // Disambiguation among all legal moves of same piece type going to same square
          const allLegal = opts.square
            ? this.moves({ verbose: true })
            : legal;
          const peers = allLegal.filter(
            (other) => other !== m && other.piece === m.piece && other.to === m.to && other.from !== m.from
          );
          let disambig = '';
          if (peers.length > 0) {
            const sameFile = peers.some((p) => p.from[0] === m.from[0]);
            const sameRank = peers.some((p) => p.from[1] === m.from[1]);
            if (!sameFile) disambig = m.from[0];
            else if (!sameRank) disambig = m.from[1];
            else disambig = m.from;
          }
          baseSan = `${pUpper}${disambig}${m.captured ? 'x' : ''}${m.to}`;
        }

        const sim = m._sim;
        delete m._sim;
        const oppInCheck = sim.inCheck(sim.turnColor);
        let checkSuffix = '';
        if (oppInCheck) {
          const oppResponses = sim.generatePseudoMoves(sim.turnColor).filter((rm) => {
            const s2 = sim.clone();
            s2.applyRawMove(rm);
            return !s2.inCheck(rm.color);
          });
          checkSuffix = oppResponses.length === 0 ? '#' : '+';
        }
        m.san = baseSan + checkSuffix;
      }

      if (opts.verbose) return legal;
      return legal.map((m) => m.san);
    }

    isCheckmate() {
      if (!this.inCheck(this.turnColor)) return false;
      return this.moves().length === 0;
    }

    isDraw() {
      if (this.inCheck(this.turnColor)) return false;
      return this.moves().length === 0;
    }

    isGameOver() {
      return this.moves().length === 0;
    }

    move(input) {
      const legal = this.moves({ verbose: true });
      let chosen = null;

      if (typeof input === 'string') {
        const clean = input.trim().replace(/[!?]+$/g, '').replace(/0-0-0/g, 'O-O-O').replace(/0-0/g, 'O-O');
        const noCheck = clean.replace(/[+#]+$/g, '');
        chosen =
          legal.find((m) => m.san === clean) ||
          legal.find((m) => m.san.replace(/[+#]+$/g, '') === noCheck);
      } else if (input && typeof input === 'object') {
        chosen = legal.find(
          (m) =>
            m.from === input.from &&
            m.to === input.to &&
            (!m.promotion || m.promotion === (input.promotion || 'q'))
        );
      }

      if (!chosen) return null;
      this.applyRawMove(chosen);
      return chosen;
    }
  }

  // Notation helpers (@shared/ui/chess/descriptiveNotation)
  function splitMoveAnnotations(san) {
    if (!san) return { core: '', check: '', nag: '' };
    const match = san.trim().match(/^([O0]-[O0](?:-[O0])?|[A-Za-z0-9=]+)([+#]*)([!?]*)$/);
    if (!match) return { core: san.trim(), check: '', nag: '' };
    return { core: match[1], check: match[2] || '', nag: match[3] || '' };
  }

  function squareToDescriptive(square, color = 'w', lang = 'pt') {
    if (!square || square.length < 2) return square;
    const file = square[0].toLowerCase();
    const algRank = parseInt(square[1], 10);
    if (isNaN(algRank)) return square;
    const descRank = color === 'w' ? algRank : 9 - algRank;
    const fileMap = lang === 'es' ? FILES_DESC_ES : FILES_DESC_PT;
    return `${descRank}${fileMap[file] || file.toUpperCase()}`;
  }

  function moveToDescriptive(moveObj, lang = 'pt') {
    if (!moveObj || !moveObj.san) return '';
    const { core, check, nag } = splitMoveAnnotations(moveObj.san);
    if (core === 'O-O' || core === '0-0') return `0-0${check}${nag}`;
    if (core === 'O-O-O' || core === '0-0-0') return `0-0-0${check}${nag}`;

    const pieceMap = lang === 'es' ? PIECE_NAMES_ES : PIECE_NAMES_PT;
    const color = moveObj.color || 'w';
    const pieceLetter = pieceMap[(moveObj.piece || 'p').toLowerCase()] || 'P';
    const targetDesc = squareToDescriptive(moveObj.to, color, lang);

    let promoSuffix = '';
    if (moveObj.promotion) {
      promoSuffix = `=${pieceMap[moveObj.promotion.toLowerCase()] || 'D'}`;
    }
    if (moveObj.captured) {
      const capLetter = pieceMap[moveObj.captured.toLowerCase()] || 'P';
      return `${pieceLetter}x${capLetter}(${targetDesc})${promoSuffix}${check}${nag}`;
    }
    return `${pieceLetter}${targetDesc}${promoSuffix}${check}${nag}`;
  }

  function sanToPortugueseAlgebraic(san) {
    if (!san) return '';
    const { core, check, nag } = splitMoveAnnotations(san);
    if (core.startsWith('O-O') || core.startsWith('0-0')) {
      return `${core.replace(/0/g, 'O')}${check}${nag}`;
    }
    const ptMap = { K: 'R', Q: 'D', R: 'T', B: 'B', N: 'C' };
    let conv = core.replace(/^[KQRBN]/, (m) => ptMap[m] || m);
    conv = conv.replace(/=([KQRBN])/, (_, p) => `=${ptMap[p] || p}`);
    return `${conv}${check}${nag}`;
  }

  function sanToFigurine(san, color = 'w') {
    if (!san) return '';
    const { core, check, nag } = splitMoveAnnotations(san);
    if (core.startsWith('O-O') || core.startsWith('0-0')) {
      return `${core.replace(/0/g, 'O')}${check}${nag}`;
    }
    const figMap = color === 'b' ? FIGURINES_B : FIGURINES_W;
    let conv = core.replace(/^[KQRBN]/, (m) => figMap[m] || m);
    conv = conv.replace(/=([KQRBN])/, (_, p) => `=${figMap[p] || p}`);
    return `${conv}${check}${nag}`;
  }

  function formatMoveByMode(moveObj, mode = 'alg_pt') {
    if (!moveObj) return '';
    switch (mode) {
      case 'alg_pt':
        return sanToPortugueseAlgebraic(moveObj.san);
      case 'figurine':
        return sanToFigurine(moveObj.san, moveObj.color || 'w');
      case 'desc_pt':
        return moveObj.descriptivePt || moveToDescriptive(moveObj, 'pt');
      case 'desc_es':
        return moveObj.descriptiveEs || moveToDescriptive(moveObj, 'es');
      case 'alg_en':
      default:
        return moveObj.san;
    }
  }

  function getBoardCoordinates(flipped = false, notationMode = 'alg_pt') {
    const isDesc = notationMode === 'desc_pt' || notationMode === 'desc_es';
    const descMap = notationMode === 'desc_es' ? FILES_DESC_ES : FILES_DESC_PT;
    const baseFiles = isDesc ? FILES.map((f) => descMap[f]) : FILES;
    const baseRanks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    return {
      files: flipped ? [...baseFiles].reverse() : baseFiles,
      ranks: flipped ? [...baseRanks].reverse() : baseRanks,
    };
  }

  window.ChessMasteryEngine = {
    Chess: ChessEngine,
    moveToDescriptive,
    sanToPortugueseAlgebraic,
    sanToFigurine,
    formatMoveByMode,
    getBoardCoordinates,
  };
})();
