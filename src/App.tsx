import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import {
  BookOpen,
  RotateCw,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Volume2,
  VolumeX,
  Search,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Compass,
  Lightbulb,
  FileSearch,
  Cpu,
  GraduationCap,
  LayoutGrid,
  BarChart3,
} from 'lucide-react';
import {
  formatMoveByMode,
  sanToPortugueseAlgebraic,
} from '@shared/ui/chess/descriptiveNotation';
import {
  buildProgressiveHints,
  evaluateUserMove,
  resolveBookCitation,
  type TrainerColorMode,
  type EvaluatedUserMove,
  type ReviewQueueItem,
} from '@shared/ui/chess/openingTrainer';
import { chessAudio } from '@shared/ui/chess/chessAudio';
import { PREINSTALLED_BOOKS } from '@/data/preinstalledBooks';
import {
  CHESS_OPENINGS,
  type ChessOpeningStudy,
} from '@/data/openingsData';
import { buildGameSteps } from '@/lib/chess/gameBuilder';
import { analyzePositionLocal } from '@/lib/chess/localStockfishEngine';
import { InteractiveChessboard } from '@/components/InteractiveChessboard';
import { VerticalEvaluationBar } from '@/components/BoardSideComponents';
import type {
  BoardThemeId,
  NotationMode,
  StudySourceType,
  NavDestination,
  AppExperienceMode,
} from '@/types/chess';

const STORAGE_KEY = 'chess_mastery_progress_v2';

export const App: React.FC = () => {
  // Navegação Framed-Sheet Shell (4 Destinos + 2 Modos de Uso)
  const [navDest, setNavDest] = useState<NavDestination>('library');
  const [canvasView, setCanvasView] = useState<'board' | 'overview'>('board');
  const [experienceMode, setExperienceMode] = useState<AppExperienceMode>('aprender');
  const [currentStudyType, setCurrentStudyType] = useState<StudySourceType>('book_game');
  const [rightTab, setRightTab] = useState<'guidance' | 'movesheet' | 'plan'>('guidance');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOcrModal, setShowOcrModal] = useState<boolean>(false);

  // Livros, Acordeão e Modo Isolado de Capítulo
  const [selectedBookId, setSelectedBookId] = useState<string>(PREINSTALLED_BOOKS[0].id);
  const [expandedBookIds, setExpandedBookIds] = useState<string[]>(
    PREINSTALLED_BOOKS.map((b) => b.id)
  );
  const [isolatedChapterId, setIsolatedChapterId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string>(
    PREINSTALLED_BOOKS[0].chapters[0].games[0].id
  );

  // Aberturas & Defesas + Treinador Inteligente
  const [selectedOpeningCat, setSelectedOpeningCat] = useState<string>('all');
  const [selectedOpeningId, setSelectedOpeningId] = useState<string>(CHESS_OPENINGS[0].id);
  const [trainerColor, setTrainerColor] = useState<TrainerColorMode>('w');
  const [trainerActive, setTrainerActive] = useState<boolean>(false);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2 | 3>(0);
  const [lastFeedback, setLastFeedback] = useState<EvaluatedUserMove | null>(null);

  // Progresso e Fila de Revisão Inteligente
  const [completedGameIds, setCompletedGameIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).completedGameIds || [];
    } catch {}
    return [];
  });

  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).reviewQueue || [];
    } catch {}
    return [];
  });

  // Preferências
  const [notationMode, setNotationMode] = useState<NotationMode>('alg_pt');
  const [boardTheme] = useState<BoardThemeId>('lichess_wood');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Tabuleiro e Lances
  const [currentPly, setCurrentPly] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [customFen, setCustomFen] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedGameIds,
          reviewQueue,
          preferredNotation: notationMode,
        })
      );
    } catch {}
  }, [completedGameIds, reviewQueue, notationMode]);

  useEffect(() => {
    chessAudio.setMuted(soundMuted);
  }, [soundMuted]);

  const currentChapterAndGame = useMemo(() => {
    for (const book of PREINSTALLED_BOOKS) {
      for (const ch of book.chapters) {
        const g = ch.games.find((item) => item.id === selectedGameId);
        if (g) return { book, chapter: ch, game: g };
      }
    }
    return {
      book: PREINSTALLED_BOOKS[0],
      chapter: PREINSTALLED_BOOKS[0].chapters[0],
      game: PREINSTALLED_BOOKS[0].chapters[0].games[0],
    };
  }, [selectedGameId]);

  const currentOpening = useMemo(
    () => CHESS_OPENINGS.find((o) => o.id === selectedOpeningId) || CHESS_OPENINGS[0],
    [selectedOpeningId]
  );

  const { initialFen, steps } = useMemo(() => {
    if (currentStudyType === 'opening') {
      return buildGameSteps({
        id: currentOpening.id,
        titlePt: currentOpening.namePt,
        white: 'Brancas (Teoria)',
        black: 'Pretas (Teoria)',
        event: `${currentOpening.eco} · ${currentOpening.nameOriginal}`,
        year: '2026',
        result: '1/2-1/2',
        eco: currentOpening.eco,
        openingNamePt: currentOpening.namePt,
        heroColor: currentOpening.recommendedFor === 'black' ? 'b' : 'w',
        introPt: currentOpening.summaryPt,
        keyTakeawaysPt: [
          ...currentOpening.whitePlansPt.slice(0, 2),
          ...currentOpening.blackPlansPt.slice(0, 2),
        ],
        movesSan: currentOpening.movesSan,
        annotations: currentOpening.annotations as any,
      });
    }
    return buildGameSteps(currentChapterAndGame.game);
  }, [currentStudyType, currentOpening, currentChapterAndGame]);

  const activeFen = useMemo(() => {
    if (customFen) return customFen;
    if (currentPly === 0) return initialFen;
    return steps[currentPly - 1]?.fenAfter || initialFen;
  }, [customFen, currentPly, initialFen, steps]);

  const currentStep = useMemo(() => {
    if (currentPly === 0) return null;
    return steps[currentPly - 1] || null;
  }, [currentPly, steps]);

  const nextExpectedStep = useMemo(() => {
    return steps[currentPly] || null;
  }, [currentPly, steps]);

  const engineAnalysis = useMemo(() => {
    return analyzePositionLocal(activeFen);
  }, [activeFen]);

  const progressiveHints = useMemo(() => {
    return buildProgressiveHints(nextExpectedStep, currentOpening);
  }, [nextExpectedStep, currentOpening]);

  const bookCitation = useMemo(() => {
    return resolveBookCitation({
      studyType: currentStudyType,
      book: currentChapterAndGame.book,
      chapter: currentChapterAndGame.chapter,
      game: currentChapterAndGame.game,
      opening: currentOpening,
      ply: currentPly,
    });
  }, [currentStudyType, currentChapterAndGame, currentOpening, currentPly]);

  // Auto-avança o lance do adversário quando o Treinador está ativo em 1 cor
  useEffect(() => {
    if (!trainerActive || customFen || !nextExpectedStep) return;
    if (trainerColor === 'both') return;
    if (nextExpectedStep.color !== trainerColor) {
      const timer = setTimeout(() => {
        setCurrentPly((prev) => Math.min(steps.length, prev + 1));
      }, 340);
      return () => clearTimeout(timer);
    }
  }, [trainerActive, customFen, nextExpectedStep, trainerColor, steps.length]);

  const goToPly = useCallback(
    (targetPly: number) => {
      const clamped = Math.max(0, Math.min(steps.length, targetPly));
      setCustomFen(null);
      setHintLevel(0);
      setLastFeedback(null);
      setCurrentPly(clamped);
    },
    [steps]
  );

  const handleSelectGame = (bookId: string, gameId: string) => {
    setSelectedBookId(bookId);
    setSelectedGameId(gameId);
    setCurrentStudyType('book_game');
    setCanvasView('board');
    setCurrentPly(0);
    setCustomFen(null);
    setHintLevel(0);
    setLastFeedback(null);
  };

  const handleSelectOpening = (opening: ChessOpeningStudy) => {
    setSelectedOpeningId(opening.id);
    setCurrentStudyType('opening');
    setCanvasView('board');
    setCurrentPly(0);
    setCustomFen(null);
    setHintLevel(0);
    setLastFeedback(null);
    const recColor = opening.recommendedFor === 'black' ? 'b' : 'w';
    setTrainerColor(recColor);
    setFlipped(recColor === 'b');
  };

  const handleBoardMove = (move: { from: string; to: string; promotion?: string }): boolean => {
    if (trainerActive && nextExpectedStep && !customFen) {
      const result = evaluateUserMove({
        ChessCtor: Chess,
        fen: activeFen,
        from: move.from,
        to: move.to,
        promotion: move.promotion,
        expectedStep: nextExpectedStep,
        engineEval: engineAnalysis,
      });
      if (!result) return false;
      setLastFeedback(result);

      if (result.accepted) {
        chessAudio.playSuccess();
        setHintLevel(0);
        setCurrentPly((p) => Math.min(steps.length, p + 1));
        return true;
      } else {
        chessAudio.playError();
        setReviewQueue((prev) => {
          const itemId = `${
            currentStudyType === 'opening' ? currentOpening.id : currentChapterAndGame.game.id
          }_ply_${currentPly}`;
          if (prev.some((i) => i.id === itemId)) return prev;
          return [
            ...prev,
            {
              id: itemId,
              studyType: currentStudyType,
              targetId:
                currentStudyType === 'opening'
                  ? currentOpening.id
                  : currentChapterAndGame.game.id,
              titlePt:
                currentStudyType === 'opening'
                  ? currentOpening.namePt
                  : currentChapterAndGame.game.titlePt,
              ply: currentPly,
              expectedSan: nextExpectedStep.san,
              reasonPt: `Tentou ${result.playedSanPt} em vez de ${result.expectedSanPt}`,
              addedAt: new Date().toISOString(),
            },
          ];
        });
        return false;
      }
    }

    try {
      const chess = new Chess(activeFen);
      const played = chess.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion || 'q',
      });
      if (!played) return false;
      setCustomFen(chess.fen());
      return true;
    } catch {
      return false;
    }
  };

  const activeStudyTitle =
    currentStudyType === 'opening'
      ? currentOpening.namePt
      : currentChapterAndGame.game.titlePt;

  return (
    <div className="h-screen w-screen overflow-hidden grid grid-cols-[248px_minmax(0,1fr)] grid-rows-[48px_minmax(0,1fr)] bg-[#f4f6f5] text-[#131416] select-none font-sans">
      {/* 1. CANTO SUPERIOR ESQUERDO DA MOLDURA EM L: MARCA DO PRODUTO + ESCOPO */}
      <div className="col-start-1 row-start-1 flex items-center justify-between px-3.5 bg-[#f4f6f5]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-[6px] bg-[#1b6c80] text-white flex items-center justify-center text-xs font-semibold">
            CM
          </div>
          <span className="text-[14px] font-semibold tracking-tight text-[#131416]">
            Chess Mastery
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#5a5d60] bg-[#e8ecea] px-1.5 py-0.5 rounded">
          v1.3
        </span>
      </div>

      {/* 2. BARRA SUPERIOR (48px) SOBRE O MESMO --GROUND DA MOLDURA EM L */}
      <header className="col-start-2 row-start-1 h-12 flex items-center justify-between gap-4 pl-2 pr-4 bg-[#f4f6f5]">
        <div className="relative w-full max-w-[480px] h-8 flex items-center">
          <Search className="w-3.5 h-3.5 text-[#5a5d60] absolute left-2.5" strokeWidth={1.5} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar livros, capítulos, mestres ou aberturas (ex.: C50, Siciliana)..."
            className="w-full h-8 bg-white border border-[#e6e8ea] rounded-[6px] pl-8 pr-8 text-[13px] text-[#131416] placeholder:text-[#686b6e] focus:outline-none focus:border-[#1b6c80]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 rounded-[7px] bg-[#f4f6f8] border border-[#e6e8ea]">
            <button
              onClick={() => setExperienceMode('aprender')}
              className={`h-[26px] px-2.5 rounded-[5px] text-xs font-medium ${
                experienceMode === 'aprender'
                  ? 'bg-white text-[#131416] font-semibold'
                  : 'text-[#5a5d60]'
              }`}
            >
              Modo Aprender
            </button>
            <button
              onClick={() => setExperienceMode('explorador')}
              className={`h-[26px] px-2.5 rounded-[5px] text-xs font-medium ${
                experienceMode === 'explorador'
                  ? 'bg-white text-[#131416] font-semibold'
                  : 'text-[#5a5d60]'
              }`}
            >
              Modo Explorador
            </button>
          </div>

          <button
            onClick={() => setShowOcrModal(true)}
            className="h-8 px-3 rounded-[6px] border border-[#cdced1] bg-white text-xs font-medium text-[#131416] flex items-center gap-1.5"
          >
            <FileSearch className="w-3.5 h-3.5" strokeWidth={1.5} /> Fontes e OCR
          </button>

          <button
            onClick={() => setSoundMuted((m) => !m)}
            className="h-8 px-2.5 rounded-[6px] border border-[#cdced1] bg-white text-[#131416] flex items-center justify-center"
          >
            {soundMuted ? (
              <VolumeX className="w-3.5 h-3.5" strokeWidth={1.5} />
            ) : (
              <Volume2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </header>

      {/* 3. SIDEBAR ESQUERDA (248px) SOBRE O MESMO --GROUND DA MOLDURA EM L */}
      <aside className="col-start-1 row-start-2 flex flex-col px-3 pt-2 pb-3.5 bg-[#f4f6f5] overflow-hidden">
        <nav className="flex flex-col gap-0.5 mb-3">
          {(
            [
              { id: 'learn', label: 'Aprender e revisar', icon: Compass, count: `${reviewQueue.length} revisão` },
              { id: 'library', label: 'Biblioteca de livros', icon: BookOpen, count: '4 livros' },
              { id: 'openings', label: 'Aberturas e defesas', icon: LayoutGrid, count: '18 linhas' },
              { id: 'achievements', label: 'Progresso e acervo', icon: BarChart3, count: `${completedGameIds.length}/12` },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const active = navDest === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setNavDest(item.id);
                  setCanvasView(item.id === 'learn' || item.id === 'achievements' ? 'overview' : 'board');
                }}
                className={`h-8 px-2.5 rounded-[8px] flex items-center justify-between text-[14px] transition-colors ${
                  active ? 'bg-[#e8ecea] text-[#131416] font-medium' : 'text-[#5a5d60] hover:bg-[#f4f6f8]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </span>
                <span className="font-mono text-[11px] text-[#5a5d60]">{item.count}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1 overflow-y-auto border-t border-[#e6e8ea] pt-2.5 space-y-1.5">
          {navDest === 'openings' ? (
            CHESS_OPENINGS.map((op) => (
              <button
                key={op.id}
                onClick={() => handleSelectOpening(op)}
                className={`w-full text-left p-2.5 rounded-[8px] border transition-colors ${
                  currentStudyType === 'opening' && selectedOpeningId === op.id
                    ? 'bg-[#e8ecea] border-[#c5d4d8]'
                    : 'bg-white border-[#e6e8ea] hover:bg-[#f4f6f8]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-[#1b6c80]">{op.eco}</span>
                  <span className="text-[11px] text-[#5a5d60]">{op.categoryLabelPt}</span>
                </div>
                <div className="text-[12.5px] font-semibold text-[#131416] mt-0.5">{op.namePt}</div>
              </button>
            ))
          ) : (
            PREINSTALLED_BOOKS.map((book) => {
              const isExpanded = expandedBookIds.includes(book.id);
              return (
                <div key={book.id} className="bg-white border border-[#e6e8ea] rounded-[8px] overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedBookIds((prev) =>
                        prev.includes(book.id) ? prev.filter((id) => id !== book.id) : [...prev, book.id]
                      )
                    }
                    className="w-full p-2.5 text-left flex items-center justify-between hover:bg-[#f4f6f8]"
                  >
                    <div>
                      <div className="text-[13px] font-semibold text-[#131416]">{book.titlePt}</div>
                      <div className="text-[11.5px] text-[#5a5d60]">{book.author}</div>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#5a5d60] transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="p-1.5 border-t border-[#f0f1f2] bg-[#fafbfb] space-y-1.5">
                      {book.chapters.map((ch) => (
                        <div key={ch.id} className="bg-white border border-[#e6e8ea] rounded-[6px] p-1.5">
                          <div className="text-[11.5px] font-medium text-[#131416] px-1 mb-1">
                            Cap. {ch.number} · {ch.titlePt}
                          </div>
                          {ch.games.map((g) => (
                            <button
                              key={g.id}
                              onClick={() => handleSelectGame(book.id, g.id)}
                              className={`w-full text-left px-2 py-1 rounded text-xs ${
                                currentStudyType === 'book_game' && selectedGameId === g.id
                                  ? 'bg-[#e8ecea] text-[#131416] font-medium'
                                  : 'text-[#5a5d60] hover:bg-[#f4f6f8]'
                              }`}
                            >
                              {g.titlePt}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* 4. A FOLHA BRANCA DE TRABALHO (.work-sheet: 8px inset, 16px radius, 1px border, sem sombra) */}
      <main className="col-start-2 row-start-2 mr-2 mb-2 bg-white border border-[#e6e8ea] rounded-[16px] p-6 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <div className="flex items-start justify-between gap-4 pb-3.5 border-b border-[#e6e8ea] shrink-0">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#131416]">{activeStudyTitle}</h1>
            <p className="text-[13px] text-[#5a5d60] mt-0.5">
              Lance <span className="font-mono">{currentPly}</span> de{' '}
              <span className="font-mono">{steps.length}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 rounded-[7px] bg-[#f4f6f8] border border-[#e6e8ea]">
              {(
                [
                  { id: 'w', label: 'Brancas' },
                  { id: 'b', label: 'Pretas' },
                  { id: 'both', label: 'Ambas' },
                ] as const
              ).map((side) => (
                <button
                  key={side.id}
                  onClick={() => {
                    setTrainerColor(side.id);
                    setTrainerActive(true);
                    if (side.id === 'w') setFlipped(false);
                    if (side.id === 'b') setFlipped(true);
                  }}
                  className={`h-[26px] px-2.5 rounded-[5px] text-xs font-medium ${
                    trainerColor === side.id
                      ? 'bg-white text-[#131416] font-semibold'
                      : 'text-[#5a5d60]'
                  }`}
                >
                  {side.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setTrainerActive((t) => !t)}
              className={`h-8 px-3 rounded-[6px] text-xs font-medium border ${
                trainerActive
                  ? 'bg-[#131416] text-white border-transparent'
                  : 'bg-white text-[#131416] border-[#cdced1]'
              }`}
            >
              {trainerActive ? 'Treinador ativo' : 'Treinar lances'}
            </button>
          </div>
        </div>

        {/* WORKSPACE INTERNO DA FOLHA */}
        <div className="flex-1 min-h-0 mt-4 grid grid-cols-[minmax(420px,1.08fr)_minmax(380px,0.92fr)] gap-4 overflow-hidden">
          {/* PALCO DO TABULEIRO */}
          <div className="bg-[#f4f6f8] border border-[#e6e8ea] rounded-[8px] p-4 flex flex-col justify-between min-h-0">
            <div className="flex-1 flex items-center justify-center gap-3">
              {experienceMode === 'explorador' && (
                <div className="h-[420px]">
                  <VerticalEvaluationBar
                    scoreCp={engineAnalysis.scoreCp}
                    mateIn={engineAnalysis.mateIn}
                    flipped={flipped}
                  />
                </div>
              )}
              <div className="w-[420px] h-[420px] p-2 bg-[#27231f] rounded-[8px] border border-[#131416]">
                <InteractiveChessboard
                  fen={activeFen}
                  flipped={flipped}
                  themeId={boardTheme}
                  onMove={handleBoardMove}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#e6e8ea] flex items-center justify-between gap-2">
              <button
                onClick={() => goToPly(currentPly - 1)}
                disabled={currentPly === 0}
                className="h-8 px-3 rounded-[6px] border border-[#cdced1] bg-white text-xs font-medium disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>

              <button
                onClick={() => setHintLevel((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 1))}
                disabled={!nextExpectedStep}
                className="h-8 px-3 rounded-[6px] border border-[#1b6c80] bg-white text-xs font-medium text-[#1b6c80] flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5" /> Ver dica {hintLevel > 0 ? `(${hintLevel}/3)` : ''}
              </button>

              <button
                onClick={() => goToPly(currentPly + 1)}
                disabled={currentPly >= steps.length}
                className="h-8 px-3 rounded-[6px] bg-[#131416] text-white text-xs font-medium disabled:opacity-40 flex items-center gap-1"
              >
                Próximo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* COLUNA DE ORIENTAÇÃO & 3 FONTES SEPARADAS */}
          <div className="overflow-y-auto space-y-3 pr-1">
            {lastFeedback && (
              <div className="p-3 rounded-[8px] border border-[#e6e8ea] bg-[#f4f6f8]">
                <div className="text-xs font-semibold text-[#131416]">{lastFeedback.headlinePt}</div>
                <p className="text-xs text-[#5a5d60] mt-1">{lastFeedback.detailPt}</p>
              </div>
            )}

            {hintLevel > 0 && (
              <div className="p-3.5 rounded-[8px] border border-[#f3d78b] bg-[#fffbeb] text-[#92400e] space-y-1 text-xs">
                <div className="font-semibold">Dica progressiva · Nível {hintLevel} de 3</div>
                {hintLevel >= 1 && <p>1. {progressiveHints.level1Question}</p>}
                {hintLevel >= 2 && <p>2. {progressiveHints.level2PieceAndPlan}</p>}
                {hintLevel >= 3 && <p className="font-semibold">3. {progressiveHints.level3MoveAndWhy}</p>}
              </div>
            )}

            {/* FONTE 1: DO TUTOR */}
            <div className="p-3.5 rounded-[8px] border border-[#e6e8ea] border-l-[3px] border-l-[#b87d14] bg-white">
              <div className="text-xs font-semibold text-[#131416] flex items-center gap-1.5 mb-1">
                <GraduationCap className="w-3.5 h-3.5" /> Do Tutor · Explicação guiada
              </div>
              <p className="text-[13.5px] leading-relaxed text-[#131416]">
                {currentStep?.annotation?.commentPt ||
                  (currentStudyType === 'opening'
                    ? currentOpening.summaryPt
                    : currentChapterAndGame.game.introPt)}
              </p>
            </div>

            {/* FONTE 2: DO LIVRO */}
            <div className="p-3.5 rounded-[8px] border border-[#e6e8ea] border-l-[3px] border-l-[#1e7b4f] bg-white">
              <div className="text-xs font-semibold text-[#131416] flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3.5 h-3.5" /> Do Livro · Fonte histórica verificada
              </div>
              <p className="text-[13.5px] leading-relaxed text-[#131416] mb-2">
                {currentStep?.annotation?.commentOriginal ||
                  'Princípio clássico extraído e validado pelo motor de regras chess.js.'}
              </p>
              <div className="pt-2 border-t border-[#f0f1f2] text-[12px] text-[#5a5d60]">
                {bookCitation.bookTitle} · {bookCitation.author} · {bookCitation.chapterLabel} (
                {bookCitation.pageEstimate})
              </div>
            </div>

            {/* FONTE 3: DO STOCKFISH */}
            <div className="p-3.5 rounded-[8px] border border-[#e6e8ea] border-l-[3px] border-l-[#1b6c80] bg-white">
              <div className="text-xs font-semibold text-[#131416] flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5" /> Do Stockfish · Análise independente do computador
              </div>
              <p className="text-[13.5px] leading-relaxed text-[#131416]">
                Melhor sugestão:{' '}
                <strong className="font-mono">
                  {sanToPortugueseAlgebraic(engineAnalysis.bestMoveSan)}
                </strong>
                . {engineAnalysis.explanationPt}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
