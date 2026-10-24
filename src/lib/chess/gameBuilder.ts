import { Chess } from 'chess.js';
import { moveToDescriptive } from '@shared/ui/chess/descriptiveNotation';
import type { BookLessonGame, ComputedPlyStep } from '@/types/chess';

export const DEFAULT_START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function buildGameSteps(game: BookLessonGame): {
  initialFen: string;
  steps: ComputedPlyStep[];
} {
  const startFen = game.initialFen || DEFAULT_START_FEN;
  const chess = new Chess(startFen);
  const steps: ComputedPlyStep[] = [];

  game.movesSan.forEach((sanMove, index) => {
    const ply = index + 1;
    const fenBefore = chess.fen();
    const moveResult = chess.move(sanMove);
    if (!moveResult) {
      return;
    }

    const fenAfter = chess.fen();
    const annotation = game.annotations[ply];
    const badge = annotation?.badge || '';
    const sanWithBadge = badge && !moveResult.san.endsWith(badge)
      ? `${moveResult.san}${badge}`
      : moveResult.san;

    const movePayload = {
      san: sanWithBadge,
      piece: moveResult.piece,
      from: moveResult.from,
      to: moveResult.to,
      color: moveResult.color,
      captured: moveResult.captured,
      promotion: moveResult.promotion,
    };

    const descriptivePt = moveToDescriptive(movePayload, 'pt');
    const descriptiveEs = moveToDescriptive(movePayload, 'es');

    const moveNumber = Math.floor(index / 2) + 1;
    const isCastling =
      moveResult.san.startsWith('O-O') ||
      moveResult.flags.includes('k') ||
      moveResult.flags.includes('q');

    steps.push({
      ply,
      moveNumber,
      color: moveResult.color,
      san: sanWithBadge,
      from: moveResult.from,
      to: moveResult.to,
      piece: moveResult.piece,
      captured: moveResult.captured,
      promotion: moveResult.promotion,
      fenBefore,
      fenAfter,
      inCheck: chess.inCheck(),
      isCheckmate: chess.isCheckmate(),
      isCastling,
      descriptivePt,
      descriptiveEs,
      annotation,
    });
  });

  return {
    initialFen: startFen,
    steps,
  };
}
