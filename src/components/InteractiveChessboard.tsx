import React, { useState, useRef, useMemo } from 'react';
import { Chess } from 'chess.js';
import { getBoardCoordinates } from '@shared/ui/chess/descriptiveNotation';
import { ChessPieceSvg } from './ChessPiecesSvg';
import type {
  BoardArrow,
  BoardThemeId,
  MoveEvaluationBadge,
  NotationMode,
  SquareHighlight,
} from '@/types/chess';

export const BOARD_THEMES: Record<
  BoardThemeId,
  { name: string; light: string; dark: string; lastMoveLight: string; lastMoveDark: string; border: string }
> = {
  lichess_wood: {
    name: 'Lichess Wood',
    light: '#f0d9b5',
    dark: '#b58863',
    lastMoveLight: '#cdd26a',
    lastMoveDark: '#aaa23a',
    border: '#3d2e22',
  },
  chesscom_green: {
    name: 'Tournament Green',
    light: '#eeeed2',
    dark: '#769656',
    lastMoveLight: '#f6f669',
    lastMoveDark: '#baca2b',
    border: '#26331b',
  },
  walnut_luxury: {
    name: 'Walnut Classic',
    light: '#ead8c0',
    dark: '#8b5a2b',
    lastMoveLight: '#e4c96b',
    lastMoveDark: '#a68232',
    border: '#2c1b0e',
  },
  slate_ice: {
    name: 'Obsidian Slate',
    light: '#dee3e6',
    dark: '#78909c',
    lastMoveLight: '#9be0c8',
    lastMoveDark: '#55ab91',
    border: '#1e293b',
  },
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

interface InteractiveChessboardProps {
  fen: string;
  flipped: boolean;
  themeId: BoardThemeId;
  notationMode: NotationMode;
  lastMove?: { from: string; to: string } | null;
  moveBadge?: MoveEvaluationBadge;
  bookArrows?: BoardArrow[];
  bookHighlights?: SquareHighlight[];
  engineArrow?: { from: string; to: string } | null;
  onUserMove?: (from: string, to: string, promotion?: string) => boolean;
  interactive?: boolean;
}

function squareToCoords(square: string, flipped: boolean): { col: number; row: number } {
  const fileIdx = FILES.indexOf(square[0]);
  const rankIdx = RANKS.indexOf(square[1]);
  if (fileIdx === -1 || rankIdx === -1) return { col: 0, row: 0 };
  return {
    col: flipped ? 7 - fileIdx : fileIdx,
    row: flipped ? 7 - rankIdx : rankIdx,
  };
}

function getBadgeStyle(badge: MoveEvaluationBadge): { bg: string; text: string; label: string } {
  switch (badge) {
    case '!!':
      return { bg: '#06b6d4', text: '#ffffff', label: '!!' };
    case '!':
      return { bg: '#3b82f6', text: '#ffffff', label: '!' };
    case '!?':
      return { bg: '#8b5cf6', text: '#ffffff', label: '!?' };
    case '?!':
      return { bg: '#f59e0b', text: '#18181b', label: '?!' };
    case '?':
      return { bg: '#f97316', text: '#ffffff', label: '?' };
    case '??':
      return { bg: '#ef4444', text: '#ffffff', label: '??' };
  }
}

export const InteractiveChessboard: React.FC<InteractiveChessboardProps> = ({
  fen,
  flipped,
  themeId,
  notationMode,
  lastMove,
  moveBadge,
  bookArrows = [],
  bookHighlights = [],
  engineArrow = null,
  onUserMove,
  interactive = true,
}) => {
  const theme = BOARD_THEMES[themeId] || BOARD_THEMES.lichess_wood;
  const boardRef = useRef<HTMLDivElement>(null);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

  // Setas e destaques desenhados pelo próprio usuário com o botão direito
  const [userArrows, setUserArrows] = useState<BoardArrow[]>([]);
  const [userHighlights, setUserHighlights] = useState<SquareHighlight[]>([]);
  const [rightClickStart, setRightClickStart] = useState<string | null>(null);

  const chess = useMemo(() => {
    try {
      return new Chess(fen);
    } catch {
      return new Chess();
    }
  }, [fen]);

  const boardMatrix = useMemo(() => chess.board(), [chess]);

  const legalMovesFromSelected = useMemo(() => {
    const activeSq = draggingFrom || selectedSquare;
    if (!activeSq || !interactive) return [];
    try {
      return chess.moves({ square: activeSq as any, verbose: true });
    } catch {
      return [];
    }
  }, [chess, selectedSquare, draggingFrom, interactive]);

  const coords = useMemo(
    () => getBoardCoordinates(flipped, notationMode),
    [flipped, notationMode]
  );

  // Calcula em qual casa do tabuleiro está uma coordenada (clientX, clientY)
  const getSquareFromClientXY = (clientX: number, clientY: number): string | null => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    if (relX < 0 || relY < 0 || relX > rect.width || relY > rect.height) return null;

    const col = Math.min(7, Math.max(0, Math.floor((relX / rect.width) * 8)));
    const row = Math.min(7, Math.max(0, Math.floor((relY / rect.height) * 8)));

    const fileIdx = flipped ? 7 - col : col;
    const rankIdx = flipped ? 7 - row : row;
    return `${FILES[fileIdx]}${RANKS[rankIdx]}`;
  };

  const handleMouseDownSquare = (e: React.MouseEvent, square: string) => {
    if (e.button === 2) {
      e.preventDefault();
      setRightClickStart(square);
      return;
    }

    if (e.button !== 0) return;

    // Limpa setas manuais ao clicar com botão esquerdo
    if (userArrows.length > 0 || userHighlights.length > 0) {
      setUserArrows([]);
      setUserHighlights([]);
    }

    if (!interactive) return;

    // Se já havia uma casa selecionada e o usuário clicou em um lance legal, executa Click-to-Move
    if (selectedSquare && selectedSquare !== square) {
      const isLegal = legalMovesFromSelected.some((m) => m.to === square);
      if (isLegal && onUserMove) {
        onUserMove(selectedSquare, square, 'q');
        setSelectedSquare(null);
        return;
      }
    }

    const pieceOnSq = chess.get(square as any);
    if (pieceOnSq && pieceOnSq.color === chess.turn()) {
      setSelectedSquare(square);
      setDraggingFrom(square);
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    } else {
      setSelectedSquare(null);
    }
  };

  const handleMouseMoveBoard = (e: React.MouseEvent) => {
    if (!draggingFrom || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    setDragPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const targetSq = getSquareFromClientXY(e.clientX, e.clientY);
    setHoveredSquare(targetSq);
  };

  const handleMouseUpBoard = (e: React.MouseEvent) => {
    if (e.button === 2 && rightClickStart) {
      e.preventDefault();
      const targetSq = getSquareFromClientXY(e.clientX, e.clientY);
      if (targetSq) {
        if (targetSq === rightClickStart) {
          // Alterna highlight na casa
          setUserHighlights((prev) =>
            prev.some((h) => h.square === targetSq)
              ? prev.filter((h) => h.square !== targetSq)
              : [...prev, { square: targetSq, color: 'emerald' }]
          );
        } else {
          // Alterna seta entre as duas casas
          setUserArrows((prev) =>
            prev.some((a) => a.from === rightClickStart && a.to === targetSq)
              ? prev.filter((a) => !(a.from === rightClickStart && a.to === targetSq))
              : [...prev, { from: rightClickStart, to: targetSq, color: 'emerald' }]
          );
        }
      }
      setRightClickStart(null);
      return;
    }

    if (draggingFrom) {
      const targetSq = getSquareFromClientXY(e.clientX, e.clientY);
      if (targetSq && targetSq !== draggingFrom && onUserMove) {
        const moved = onUserMove(draggingFrom, targetSq, 'q');
        if (moved) {
          setSelectedSquare(null);
        }
      }
      setDraggingFrom(null);
      setDragPos(null);
      setHoveredSquare(null);
    }
  };

  const draggedPiece = useMemo(() => {
    if (!draggingFrom) return null;
    return chess.get(draggingFrom as any) || null;
  }, [chess, draggingFrom]);

  // Encontra casa do Rei em xeque para destacar em vermelho
  const kingInCheckSquare = useMemo(() => {
    if (!chess.inCheck()) return null;
    const turnColor = chess.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = boardMatrix[r][c];
        if (p && p.type === 'k' && p.color === turnColor) {
          return p.square;
        }
      }
    }
    return null;
  }, [chess, boardMatrix]);

  const allHighlights = [...bookHighlights, ...userHighlights];
  const allArrows: BoardArrow[] = [
    ...bookArrows,
    ...userArrows,
    ...(engineArrow ? [{ from: engineArrow.from, to: engineArrow.to, color: 'sky' as const }] : []),
  ];

  const displayRows = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const displayCols = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div
      className="relative p-1.5 rounded-[1.35rem] bg-white/[0.04] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.65)] select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        ref={boardRef}
        onMouseMove={handleMouseMoveBoard}
        onMouseUp={handleMouseUpBoard}
        onMouseLeave={() => {
          setDraggingFrom(null);
          setDragPos(null);
          setHoveredSquare(null);
        }}
        className="relative aspect-square w-full overflow-hidden rounded-[1rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
        style={{ backgroundColor: theme.border }}
      >
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {displayRows.map((rIdx, visualRow) =>
            displayCols.map((cIdx, visualCol) => {
              const square = `${FILES[cIdx]}${RANKS[rIdx]}`;
              const isLight = (rIdx + cIdx) % 2 === 0;
              const piece = boardMatrix[rIdx][cIdx];

              const isLastMove =
                lastMove?.from === square || lastMove?.to === square;
              const isSelected = selectedSquare === square;
              const isHoveredTarget = hoveredSquare === square && draggingFrom !== square;
              const isKingCheck = kingInCheckSquare === square;

              const legalTarget = legalMovesFromSelected.find((m) => m.to === square);
              const customHighlight = allHighlights.find((h) => h.square === square);

              let bgColor = isLight ? theme.light : theme.dark;
              if (isLastMove) {
                bgColor = isLight ? theme.lastMoveLight : theme.lastMoveDark;
              }

              const showRankLabel = visualCol === 0;
              const showFileLabel = visualRow === 7;
              const coordColor = isLight ? theme.dark : theme.light;

              const isDestinationBadgeSquare =
                moveBadge && lastMove?.to === square;

              return (
                <div
                  key={square}
                  onMouseDown={(e) => handleMouseDownSquare(e, square)}
                  className={`relative flex items-center justify-center w-full h-full transition-colors duration-75 ${
                    interactive && piece && piece.color === chess.turn()
                      ? 'cursor-grab active:cursor-grabbing'
                      : legalTarget
                      ? 'cursor-pointer'
                      : 'cursor-default'
                  }`}
                  style={{ backgroundColor: bgColor }}
                >
                  {/* Casa selecionada */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-500/40 pointer-events-none" />
                  )}

                  {/* Highlight customizado do livro ou do estudante */}
                  {customHighlight && (
                    <div
                      className={`absolute inset-0 pointer-events-none ${
                        customHighlight.color === 'emerald'
                          ? 'bg-emerald-500/45 ring-2 ring-inset ring-emerald-300/60'
                          : customHighlight.color === 'rose'
                          ? 'bg-rose-500/45 ring-2 ring-inset ring-rose-300/60'
                          : customHighlight.color === 'amber'
                          ? 'bg-amber-400/45 ring-2 ring-inset ring-amber-200/60'
                          : 'bg-sky-500/45 ring-2 ring-inset ring-sky-300/60'
                      }`}
                    />
                  )}

                  {/* Rei em Xeque (Gradiente radial vermelho estilo Lichess) */}
                  {isKingCheck && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(239,68,68,0.88) 0%, rgba(220,38,38,0.55) 55%, transparent 85%)',
                      }}
                    />
                  )}

                  {/* Anel de hover durante arraste */}
                  {isHoveredTarget && (
                    <div className="absolute inset-0 ring-4 ring-inset ring-white/70 pointer-events-none z-10" />
                  )}

                  {/* Coordenada de Fileira (Esquerda superior) */}
                  {showRankLabel && (
                    <span
                      className="absolute top-1 left-1.5 text-[10px] font-bold font-mono leading-none pointer-events-none opacity-85"
                      style={{ color: coordColor }}
                    >
                      {coords.ranks[visualRow]}
                    </span>
                  )}

                  {/* Coordenada de Coluna (Direita inferior) */}
                  {showFileLabel && (
                    <span
                      className="absolute bottom-1 right-1.5 text-[10px] font-bold font-mono leading-none pointer-events-none opacity-85"
                      style={{ color: coordColor }}
                    >
                      {coords.files[visualCol]}
                    </span>
                  )}

                  {/* Peça */}
                  {piece && draggingFrom !== square && (
                    <div className="w-[84%] h-[84%] z-10 transition-transform duration-150">
                      <ChessPieceSvg color={piece.color} type={piece.type} />
                    </div>
                  )}

                  {/* Indicador de Lance Legal (Bolinha Lichess / Anel de Captura) */}
                  {legalTarget && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      {piece || legalTarget.flags.includes('e') ? (
                        <div className="w-full h-full rounded-full border-[5px] border-black/25 dark:border-emerald-950/45" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full bg-black/25" />
                      )}
                    </div>
                  )}

                  {/* Selo de Avaliação na Casa de Destino (!!, !, !?, ?!, ?, ??) */}
                  {isDestinationBadgeSquare && moveBadge && (
                    <div
                      className="absolute -top-1 -right-1 z-30 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-lg ring-2 ring-black/40 animate-bounce"
                      style={{
                        backgroundColor: getBadgeStyle(moveBadge).bg,
                        color: getBadgeStyle(moveBadge).text,
                        animationIterationCount: 2,
                      }}
                    >
                      {getBadgeStyle(moveBadge).label}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Camada Vetorial de Setas (Livro + Usuário + Stockfish) */}
        {allArrows.length > 0 && (
          <svg
            viewBox="0 0 800 800"
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
          >
            <defs>
              <marker
                id="arrow-emerald"
                markerWidth="4.2"
                markerHeight="4.2"
                refX="2.6"
                refY="2.1"
                orient="auto"
              >
                <polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(16, 185, 129, 0.88)" />
              </marker>
              <marker
                id="arrow-rose"
                markerWidth="4.2"
                markerHeight="4.2"
                refX="2.6"
                refY="2.1"
                orient="auto"
              >
                <polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(244, 63, 94, 0.88)" />
              </marker>
              <marker
                id="arrow-amber"
                markerWidth="4.2"
                markerHeight="4.2"
                refX="2.6"
                refY="2.1"
                orient="auto"
              >
                <polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(245, 158, 11, 0.88)" />
              </marker>
              <marker
                id="arrow-sky"
                markerWidth="4.2"
                markerHeight="4.2"
                refX="2.6"
                refY="2.1"
                orient="auto"
              >
                <polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(14, 165, 233, 0.9)" />
              </marker>
            </defs>

            {allArrows.map((arrow, idx) => {
              const start = squareToCoords(arrow.from, flipped);
              const end = squareToCoords(arrow.to, flipped);
              const x1 = start.col * 100 + 50;
              const y1 = start.row * 100 + 50;
              const x2 = end.col * 100 + 50;
              const y2 = end.row * 100 + 50;

              // Encurta ligeiramente a ponta para centralizar na casa
              const dx = x2 - x1;
              const dy = y2 - y1;
              const len = Math.hypot(dx, dy) || 1;
              const targetX = x2 - (dx / len) * 20;
              const targetY = y2 - (dy / len) * 20;

              const colorKey = arrow.color || 'emerald';
              const strokeMap: Record<string, string> = {
                emerald: 'rgba(16, 185, 129, 0.85)',
                rose: 'rgba(244, 63, 94, 0.85)',
                amber: 'rgba(245, 158, 11, 0.85)',
                sky: 'rgba(14, 165, 233, 0.88)',
              };

              return (
                <line
                  key={`${arrow.from}-${arrow.to}-${idx}`}
                  x1={x1}
                  y1={y1}
                  x2={targetX}
                  y2={targetY}
                  stroke={strokeMap[colorKey]}
                  strokeWidth="18"
                  strokeLinecap="round"
                  markerEnd={`url(#arrow-${colorKey})`}
                />
              );
            })}
          </svg>
        )}

        {/* Peça Flutuante durante Drag-and-Drop */}
        {draggingFrom && draggedPiece && dragPos && (
          <div
            className="absolute pointer-events-none z-40 w-[13.5%] h-[13.5%] -translate-x-1/2 -translate-y-1/2 scale-110 drop-shadow-[0_14px_20px_rgba(0,0,0,0.65)]"
            style={{
              left: `${dragPos.x}px`,
              top: `${dragPos.y}px`,
            }}
          >
            <ChessPieceSvg color={draggedPiece.color} type={draggedPiece.type} />
          </div>
        )}
      </div>
    </div>
  );
};
