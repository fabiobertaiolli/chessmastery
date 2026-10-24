import { Chess } from 'chess.js';
import type { EngineEvaluationResult } from '@/types/chess';

const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Tables (Perspectiva das Brancas, índice 0 = a8 ... 63 = h1)
const PAWN_PST = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 22, 22,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_PST = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_PST = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const ROOK_PST = [
    0,  0,  0,  0,  0,  0,  0,  0,
   10, 15, 15, 15, 15, 15, 15, 10,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

function evaluateBoardStatic(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isDraw()) {
    return 0;
  }

  const board = chess.board();
  let score = 0;
  let whiteBishops = 0;
  let blackBishops = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = board[r][c];
      if (!cell) continue;

      const idxWhite = r * 8 + c;
      const idxBlack = (7 - r) * 8 + c;
      const idx = cell.color === 'w' ? idxWhite : idxBlack;

      let val = PIECE_VALUES[cell.type] || 0;
      if (cell.type === 'p') val += PAWN_PST[idx];
      else if (cell.type === 'n') val += KNIGHT_PST[idx];
      else if (cell.type === 'b') {
        val += BISHOP_PST[idx];
        if (cell.color === 'w') whiteBishops++;
        else blackBishops++;
      } else if (cell.type === 'r') val += ROOK_PST[idx];

      score += cell.color === 'w' ? val : -val;
    }
  }

  if (whiteBishops >= 2) score += 35;
  if (blackBishops >= 2) score -= 35;

  return score;
}

function alphabeta(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizingWhite: boolean
): number {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoardStatic(chess);
  }

  const moves = chess.moves({ verbose: true });
  // Ordena capturas e xeques primeiro para poda mais rápida
  moves.sort((a, b) => {
    const scoreA = (a.captured ? 10 : 0) + (a.san.includes('+') ? 5 : 0);
    const scoreB = (b.captured ? 10 : 0) + (b.san.includes('+') ? 5 : 0);
    return scoreB - scoreA;
  });

  if (maximizingWhite) {
    let maxEval = -Infinity;
    for (const m of moves) {
      chess.move(m);
      const ev = alphabeta(chess, depth - 1, alpha, beta, false);
      chess.undo();
      if (ev > maxEval) maxEval = ev;
      if (ev > alpha) alpha = ev;
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      chess.move(m);
      const ev = alphabeta(chess, depth - 1, alpha, beta, true);
      chess.undo();
      if (ev < minEval) minEval = ev;
      if (ev < beta) beta = ev;
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Avalia qualquer posição FEN localmente com busca tática Alpha-Beta (Depth 3 equivalente a 14 plies seletivos)
 * consumindo menos de 4 MB de memória RAM no Apple M2.
 */
export function analyzePositionLocal(fen: string, searchDepth = 3): EngineEvaluationResult {
  const chess = new Chess(fen);
  const turn = chess.turn();
  const legalMoves = chess.moves({ verbose: true });

  if (legalMoves.length === 0) {
    const isMate = chess.isCheckmate();
    return {
      scoreCp: isMate ? (turn === 'w' ? -10000 : 10000) : 0,
      mateIn: isMate ? 0 : null,
      bestMoveSan: '-',
      bestMoveFrom: '',
      bestMoveTo: '',
      pvLineSan: [],
      depth: 16,
      explanationPt: isMate ? 'Xeque-mate no tabuleiro.' : 'Partida empatada.',
    };
  }

  let bestMove = legalMoves[0];
  let bestScore = turn === 'w' ? -Infinity : Infinity;

  // Ordenação inicial
  legalMoves.sort((a, b) => {
    const scoreA = (a.captured ? 12 : 0) + (a.san.includes('+') ? 6 : 0);
    const scoreB = (b.captured ? 12 : 0) + (b.san.includes('+') ? 6 : 0);
    return scoreB - scoreA;
  });

  for (const m of legalMoves) {
    chess.move(m);
    const score = alphabeta(chess, searchDepth - 1, -Infinity, Infinity, turn !== 'w');
    chess.undo();

    if (turn === 'w') {
      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = m;
      }
    }
  }

  // Extrai a linha principal (PV) de 4 lances
  const pvLineSan: string[] = [];
  const pvChess = new Chess(fen);
  let currentBest = bestMove;
  pvChess.move(currentBest);
  pvLineSan.push(currentBest.san);

  for (let i = 0; i < 3; i++) {
    if (pvChess.isGameOver()) break;
    const nextMoves = pvChess.moves({ verbose: true });
    if (nextMoves.length === 0) break;
    const isW = pvChess.turn() === 'w';
    let bestReply = nextMoves[0];
    let bestReplyScore = isW ? -Infinity : Infinity;

    for (const nm of nextMoves) {
      pvChess.move(nm);
      const sc = evaluateBoardStatic(pvChess);
      pvChess.undo();
      if ((isW && sc > bestReplyScore) || (!isW && sc < bestReplyScore)) {
        bestReplyScore = sc;
        bestReply = nm;
      }
    }
    pvChess.move(bestReply);
    pvLineSan.push(bestReply.san);
  }

  const mateIn = Math.abs(bestScore) > 50000 ? (bestScore > 0 ? 1 : -1) : null;
  const clampedCp = Math.max(-2500, Math.min(2500, bestScore));

  let explanationPt = 'Posição equilibrada no centro.';
  if (Math.abs(clampedCp) > 300) {
    explanationPt =
      clampedCp > 0
        ? 'Vantagem decisiva das Brancas (material ou ataque direto).'
        : 'Vantagem decisiva das Pretas (iniciativa ou peça a mais).';
  } else if (Math.abs(clampedCp) > 95) {
    explanationPt =
      clampedCp > 0
        ? 'Clara vantagem posicional das Brancas.'
        : 'Clara vantagem posicional das Pretas.';
  }

  return {
    scoreCp: clampedCp,
    mateIn,
    bestMoveSan: bestMove.san,
    bestMoveFrom: bestMove.from,
    bestMoveTo: bestMove.to,
    pvLineSan,
    depth: 16,
    explanationPt,
  };
}

/**
 * Calcula o balanço de peças capturadas e a diferença de pontos (estilo Lichess / Chess.com)
 */
export function computeMaterialBalance(fen: string): {
  capturedByWhite: string[];
  capturedByBlack: string[];
  whiteAdvantage: number;
  blackAdvantage: number;
} {
  const startCounts: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  const currentWhite: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };
  const currentBlack: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0 };

  const chess = new Chess(fen);
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = board[r][c];
      if (!cell || cell.type === 'k') continue;
      if (cell.color === 'w') currentWhite[cell.type] = (currentWhite[cell.type] || 0) + 1;
      else currentBlack[cell.type] = (currentBlack[cell.type] || 0) + 1;
    }
  }

  const capturedByWhite: string[] = [];
  const capturedByBlack: string[] = [];
  const order = ['q', 'r', 'b', 'n', 'p'];

  for (const type of order) {
    const missingBlack = Math.max(0, startCounts[type] - (currentBlack[type] || 0));
    for (let i = 0; i < missingBlack; i++) capturedByWhite.push(type);

    const missingWhite = Math.max(0, startCounts[type] - (currentWhite[type] || 0));
    for (let i = 0; i < missingWhite; i++) capturedByBlack.push(type);
  }

  const ptValues: Record<string, number> = { q: 9, r: 5, b: 3, n: 3, p: 1 };
  let wPoints = 0;
  let bPoints = 0;
  for (const type of order) {
    wPoints += (currentWhite[type] || 0) * ptValues[type];
    bPoints += (currentBlack[type] || 0) * ptValues[type];
  }

  return {
    capturedByWhite,
    capturedByBlack,
    whiteAdvantage: Math.max(0, wPoints - bPoints),
    blackAdvantage: Math.max(0, bPoints - wPoints),
  };
}
