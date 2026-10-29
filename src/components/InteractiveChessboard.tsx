import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  {
    name: string;
    light: string;
    dark: string;
    lastMoveLight: string;
    lastMoveDark: string;
    border: string;
  }
> = {
  stitch_wood: {
    name: 'Estúdio Madeira Artesanal',
    light: '#F5E6CE',
    dark: '#B58A65',
    lastMoveLight: '#CBEFD8',
    lastMoveDark: '#69B084',
    border: '#9E7350',
  },
  chesscom_green: {
    name: 'Chess.com Tournament',
    light: '#EEEED2',
    dark: '#769656',
    lastMoveLight: '#F6F669',
    lastMoveDark: '#BACA2B',
    border: '#4E6538',
  },
  lichess_wood: {
    name: 'Lichess Classic Wood',
    light: '#F0D9B5',
    dark: '#B58863',
    lastMoveLight: '#CDD26A',
    lastMoveDark: '#AAA23A',
    border: '#7A593E',
  },
  walnut_luxury: {
    name: 'Nogueira Real',
    light: '#EAD8C0',
    dark: '#8B5A2B',
    lastMoveLight: '#E4C96B',
    lastMoveDark: '#A68232',
    border: '#5C3A1B',
  },
  slate_ice: {
    name: 'Cristal Azul',
    light: '#DEE3E6',
    dark: '#78909C',
    lastMoveLight: '#9BE0C8',
    lastMoveDark: '#55AB91',
    border: '#475569',
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
      return { bg: '#16865E', text: '#ffffff', label: '!' };
    case '!?':
      return { bg: '#3B82F6', text: '#ffffff', label: '!?' };
    case '?!':
      return { bg: '#F59E0B', text: '#18181b', label: '?!' };
    case '?':
      return { bg: '#F97316', text: '#ffffff', label: '?' };
    case '??':
      return { bg: '#EF4444', text: '#ffffff', label: '??' };
  }
}

function getModifierDrawColor(e: React.MouseEvent): 'emerald' | 'amber' | 'rose' | 'sky' {
  if (e.shiftKey) return 'emerald';
  if (e.altKey) return 'sky';
  if (e.metaKey || e.ctrlKey) return 'rose';
  return 'amber';
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
  const theme = BOARD_THEMES[themeId] || BOARD_THEMES.stitch_wood;
  const boardRef = useRef<HTMLDivElement>(null);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);

  // Seletor visual de promoção de peão estilo Chess.com
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
    color: 'w' | 'b';
  } | null>(null);

  // Animação suave de deslize da peça quando o lance muda (clique no parágrafo ou navegação)
  const [slideOffset, setSlideOffset] = useState<{
    square: string;
    dxPercent: number;
    dyPercent: number;
    active: boolean;
  } | null>(null);

  const prevLastMoveRef = useRef<string>('');

  useEffect(() => {
    const moveKey = lastMove ? `${lastMove.from}-${lastMove.to}-${fen}` : '';
    if (lastMove && moveKey !== prevLastMoveRef.current) {
      prevLastMoveRef.current = moveKey;
      const start = squareToCoords(lastMove.from, flipped);
      const end = squareToCoords(lastMove.to, flipped);
      const dxPercent = (start.col - end.col) * 100;
      const dyPercent = (start.row - end.row) * 100;

      setSlideOffset({
        square: lastMove.to,
        dxPercent,
        dyPercent,
        active: false,
      });

      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSlideOffset((prev) => (prev ? { ...prev, dxPercent: 0, dyPercent: 0, active: true } : null));
        });
      });

      const timer = setTimeout(() => {
        setSlideOffset(null);
      }, 210);

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }
  }, [lastMove, fen, flipped]);

  // Limpa seleção ao trocar de FEN
  useEffect(() => {
    setSelectedSquare(null);
    setPendingPromotion(null);
  }, [fen]);

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

  const attemptMoveWithPromotionCheck = (fromSq: string, toSq: string) => {
    if (!onUserMove) return false;
    const matchingMoves = legalMovesFromSelected.filter((m) => m.from === fromSq && m.to === toSq);
    if (matchingMoves.length === 0) return false;

    const isPromotion = matchingMoves.some((m) => Boolean(m.promotion) || m.flags.includes('p'));
    if (isPromotion) {
      setPendingPromotion({
        from: fromSq,
        to: toSq,
        color: chess.turn(),
      });
      setSelectedSquare(null);
      return true;
    }

    const moved = onUserMove(fromSq, toSq, 'q');
    if (moved) {
      setSelectedSquare(null);
    }
    return moved;
  };

  const handleMouseDownSquare = (e: React.MouseEvent, square: string) => {
    if (e.button === 2) {
      e.preventDefault();
      setRightClickStart(square);
      return;
    }

    if (e.button !== 0) return;

    if (userArrows.length > 0 || userHighlights.length > 0) {
      setUserArrows([]);
      setUserHighlights([]);
    }

    if (pendingPromotion) {
      setPendingPromotion(null);
    }

    if (!interactive) return;

    // Click-to-Move se já houver peça selecionada e o usuário clicar em uma casa de destino legal
    if (selectedSquare && selectedSquare !== square) {
      const isLegal = legalMovesFromSelected.some((m) => m.to === square);
      if (isLegal) {
        attemptMoveWithPromotionCheck(selectedSquare, square);
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
      const drawColor = getModifierDrawColor(e);
      if (targetSq) {
        if (targetSq === rightClickStart) {
          setUserHighlights((prev) =>
            prev.some((h) => h.square === targetSq && h.color === drawColor)
              ? prev.filter((h) => !(h.square === targetSq && h.color === drawColor))
              : [...prev.filter((h) => h.square !== targetSq), { square: targetSq, color: drawColor }]
          );
        } else {
          setUserArrows((prev) =>
            prev.some((a) => a.from === rightClickStart && a.to === targetSq && a.color === drawColor)
              ? prev.filter((a) => !(a.from === rightClickStart && a.to === targetSq))
              : [
                  ...prev.filter((a) => !(a.from === rightClickStart && a.to === targetSq)),
                  { from: rightClickStart, to: targetSq, color: drawColor },
                ]
          );
        }
      }
      setRightClickStart(null);
      return;
    }

    if (draggingFrom) {
      const targetSq = getSquareFromClientXY(e.clientX, e.clientY);
      if (targetSq && targetSq !== draggingFrom) {
        attemptMoveWithPromotionCheck(draggingFrom, targetSq);
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

  const promoCoords = pendingPromotion ? squareToCoords(pendingPromotion.to, flipped) : null;

  return (
    <div
      className="relative p-2.5 sm:p-3.5 rounded-[20px] bg-white shadow-[0_10px_28px_rgba(181,138,101,0.14)] border border-[#E6DEC8] select-none"
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
        className="relative aspect-square w-full overflow-hidden rounded-[14px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.18)]"
        style={{ backgroundColor: theme.border }}
      >
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {displayRows.map((rIdx, visualRow) =>
            displayCols.map((cIdx, visualCol) => {
              const square = `${FILES[cIdx]}${RANKS[rIdx]}`;
              const isLight = (rIdx + cIdx) % 2 === 0;
              const piece = boardMatrix[rIdx][cIdx];

              const isLastMove = lastMove?.from === square || lastMove?.to === square;
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

              const isDestinationBadgeSquare = moveBadge && lastMove?.to === square;
              const isSlidingSquare = slideOffset && slideOffset.square === square;

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
                    <div className="absolute inset-0 bg-[#16865E]/35 ring-2 ring-inset ring-[#16865E] pointer-events-none" />
                  )}

                  {/* Highlight customizado do livro ou do usuário */}
                  {customHighlight && (
                    <div
                      className={`absolute inset-0 pointer-events-none ${
                        customHighlight.color === 'emerald'
                          ? 'bg-emerald-500/45 ring-2 ring-inset ring-emerald-300/70'
                          : customHighlight.color === 'rose'
                          ? 'bg-rose-500/45 ring-2 ring-inset ring-rose-300/70'
                          : customHighlight.color === 'amber'
                          ? 'bg-amber-400/50 ring-2 ring-inset ring-amber-200/75'
                          : 'bg-sky-500/45 ring-2 ring-inset ring-sky-300/70'
                      }`}
                    />
                  )}

                  {/* Rei em Xeque */}
                  {isKingCheck && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(239,68,68,0.9) 0%, rgba(220,38,38,0.58) 55%, transparent 85%)',
                      }}
                    />
                  )}

                  {/* Anel de hover durante arraste */}
                  {isHoveredTarget && (
                    <div className="absolute inset-0 ring-4 ring-inset ring-white/85 pointer-events-none z-10" />
                  )}

                  {/* Coordenada de Fileira (Esquerda superior) */}
                  {showRankLabel && (
                    <span
                      className="absolute top-1 left-1.5 text-[11px] font-extrabold leading-none pointer-events-none opacity-90"
                      style={{ color: coordColor }}
                    >
                      {coords.ranks[visualRow]}
                    </span>
                  )}

                  {/* Coordenada de Coluna (Direita inferior) */}
                  {showFileLabel && (
                    <span
                      className="absolute bottom-1 right-1.5 text-[11px] font-extrabold leading-none pointer-events-none opacity-90"
                      style={{ color: coordColor }}
                    >
                      {coords.files[visualCol]}
                    </span>
                  )}

                  {/* Peça Fantasma na Casa de Origem durante Drag */}
                  {piece && draggingFrom === square && (
                    <div className="w-[84%] h-[84%] z-10 opacity-30 pointer-events-none">
                      <ChessPieceSvg color={piece.color} type={piece.type} />
                    </div>
                  )}

                  {/* Peça com suporte a animação de deslize suave estilo Chess.com */}
                  {piece && draggingFrom !== square && (
                    <div
                      className="w-[85%] h-[85%] z-10 pointer-events-none"
                      style={
                        isSlidingSquare
                          ? {
                              transform: `translate(${slideOffset.dxPercent}%, ${slideOffset.dyPercent}%)`,
                              transition: slideOffset.active
                                ? 'transform 185ms cubic-bezier(0.22, 1, 0.36, 1)'
                                : 'none',
                            }
                          : undefined
                      }
                    >
                      <ChessPieceSvg color={piece.color} type={piece.type} />
                    </div>
                  )}

                  {/* Indicador de Lance Legal estilo Chess.com / Stitch */}
                  {legalTarget && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      {piece || legalTarget.flags.includes('e') ? (
                        <div className="w-[90%] h-[90%] rounded-full border-[5px] border-[#16865E]/55 shadow-sm" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[#16865E]/40 shadow-inner" />
                      )}
                    </div>
                  )}

                  {/* Selo de Avaliação na Casa de Destino (!!, !, !?, ?!, ?, ??) */}
                  {isDestinationBadgeSquare && moveBadge && (
                    <div
                      className="absolute -top-1 -right-1 z-30 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-md ring-2 ring-white animate-bounce"
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

        {/* Seletor Flutuante de Promoção de Peão (Estilo Chess.com) */}
        {pendingPromotion && promoCoords && (
          <div
            className="absolute z-50 bg-white rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.38)] border-2 border-[#16865E] overflow-hidden flex flex-col"
            style={{
              width: '12.5%',
              left: `${promoCoords.col * 12.5}%`,
              top: promoCoords.row === 0 ? '0%' : '50%',
              height: '50%',
            }}
          >
            {(['q', 'n', 'r', 'b'] as const).map((promoPiece) => (
              <button
                key={promoPiece}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUserMove) {
                    onUserMove(pendingPromotion.from, pendingPromotion.to, promoPiece);
                  }
                  setPendingPromotion(null);
                }}
                className="flex-1 flex items-center justify-center p-1 hover:bg-[#E2F6EA] transition-colors cursor-pointer"
                title={
                  promoPiece === 'q'
                    ? 'Promover para Dama'
                    : promoPiece === 'n'
                    ? 'Promover para Cavalo'
                    : promoPiece === 'r'
                    ? 'Promover para Torre'
                    : 'Promover para Bispo'
                }
              >
                <div className="w-[82%] h-[82%]">
                  <ChessPieceSvg color={pendingPromotion.color} type={promoPiece} />
                </div>
              </button>
            ))}
          </div>
        )}

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
                <polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(22, 134, 94, 0.92)" />
              </marker>
              <marker
                id="arrow-rose"
                markerWidth="4.2"
                markerHeight="4.2"
                refX="2.6"
                refY="2.1"
                orient="auto"
              >
                <polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(244, 63, 94, 0.92)" />
              </marker>
              <marker
                id="arrow-amber"
                markerWidth="4.2"
                markerHeight="4.2"
                refX="2.6"
                refY="2.1"
                orient="auto"
              >
                <polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(245, 158, 11, 0.92)" />
              </marker>
              <marker
                id="arrow-sky"
                markerWidth="4.2"
                markerHeight="4.2"
                refX="2.6"
                refY="2.1"
                orient="auto"
              >
                <polygon points="0 0, 4.2 2.1, 0 4.2" fill="rgba(59, 130, 246, 0.92)" />
              </marker>
            </defs>

            {allArrows.map((arrow, idx) => {
              const start = squareToCoords(arrow.from, flipped);
              const end = squareToCoords(arrow.to, flipped);
              const x1 = start.col * 100 + 50;
              const y1 = start.row * 100 + 50;
              const x2 = end.col * 100 + 50;
              const y2 = end.row * 100 + 50;

              const dx = x2 - x1;
              const dy = y2 - y1;
              const len = Math.hypot(dx, dy) || 1;
              const targetX = x2 - (dx / len) * 20;
              const targetY = y2 - (dy / len) * 20;

              const colorKey = arrow.color || 'emerald';
              const strokeMap: Record<string, string> = {
                emerald: 'rgba(22, 134, 94, 0.86)',
                rose: 'rgba(244, 63, 94, 0.86)',
                amber: 'rgba(245, 158, 11, 0.88)',
                sky: 'rgba(59, 130, 246, 0.88)',
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
            className="absolute pointer-events-none z-40 w-[13.5%] h-[13.5%] -translate-x-1/2 -translate-y-1/2 scale-110 drop-shadow-[0_14px_20px_rgba(0,0,0,0.45)]"
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
