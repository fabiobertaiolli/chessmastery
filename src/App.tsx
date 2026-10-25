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
  Target,
  Sparkles,
  Download,
  Upload,
  Search,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Swords,
  Castle,
  Zap,
  Globe,
  Compass,
  Trophy,
  Lightbulb,
  SlidersHorizontal,
  FileSearch,
} from 'lucide-react';
import {
  formatMoveByMode,
  sanToPortugueseAlgebraic,
  sanToFigurine,
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
  OPENING_CATEGORIES,
  type ChessOpeningStudy,
} from '@/data/openingsData';
import { buildGameSteps } from '@/lib/chess/gameBuilder';
import {
  analyzePositionLocal,
  computeMaterialBalance,
} from '@/lib/chess/localStockfishEngine';
import { InteractiveChessboard, BOARD_THEMES } from '@/components/InteractiveChessboard';
import { VerticalEvaluationBar } from '@/components/BoardSideComponents';
import type {
  BoardThemeId,
  LanguageDisplayMode,
  NotationMode,
  StudySourceType,
  NavDestination,
  AppExperienceMode,
} from '@/types/chess';

const STORAGE_KEY = 'chess_mastery_progress_v2';

export const App: React.FC = () => {
  // 4 Destinos de Navegação & 2 Modos de Uso (Redesign Infantil)
  const [navDest, setNavDest] = useState<NavDestination>('learn');
  const [experienceMode, setExperienceMode] = useState<AppExperienceMode>('aprender');
  const [currentStudyType, setCurrentStudyType] = useState<StudySourceType>('opening');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
  const [showOcrModal, setShowOcrModal] = useState<boolean>(false);

  // Livros, Acordeão e Modo Isolado de Capítulo
  const [selectedBookId, setSelectedBookId] = useState<string>(PREINSTALLED_BOOKS[0].id);
  const [expandedBookIds, setExpandedBookIds] = useState<string[]>([PREINSTALLED_BOOKS[0].id]);
  const [isolatedChapterId, setIsolatedChapterId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string>(
    PREINSTALLED_BOOKS[0].chapters[0].games[0].id
  );

  // Aberturas & Defesas + Treinador Inteligente
  const [selectedOpeningCat, setSelectedOpeningCat] = useState<string>('all');
  const [selectedOpeningId, setSelectedOpeningId] = useState<string>(CHESS_OPENINGS[0].id);
  const [trainerColor, setTrainerColor] = useState<TrainerColorMode>('w');
  const [trainerActive, setTrainerActive] = useState<boolean>(true);
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

  const [starsEarned, setStarsEarned] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).starsEarned || 12;
    } catch {}
    return 12;
  });

  const [notesByGameId, setNotesByGameId] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).notesByGameId || {};
    } catch {}
    return {};
  });

  // Preferências
  const [notationMode, setNotationMode] = useState<NotationMode>('alg_pt');
  const [boardTheme, setBoardTheme] = useState<BoardThemeId>('lichess_wood');
  const [languageMode, setLanguageMode] = useState<LanguageDisplayMode>('bilingual');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Tabuleiro e Lances
  const [currentPly, setCurrentPly] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);

  // Exploração livre
  const [customFen, setCustomFen] = useState<string | null>(null);

  // Persistência local
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedGameIds,
          reviewQueue,
          starsEarned,
          notesByGameId,
          preferredNotation: notationMode,
          preferredTheme: boardTheme,
          preferredLanguage: languageMode,
        })
      );
    } catch {}
  }, [
    completedGameIds,
    reviewQueue,
    starsEarned,
    notesByGameId,
    notationMode,
    boardTheme,
    languageMode,
  ]);

  useEffect(() => {
    chessAudio.setMuted(soundMuted);
  }, [soundMuted]);

  const currentBook = useMemo(
    () => PREINSTALLED_BOOKS.find((b) => b.id === selectedBookId) || PREINSTALLED_BOOKS[0],
    [selectedBookId]
  );

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
        event: `${currentOpening.eco} • ${currentOpening.nameOriginal}`,
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

  // Auto-avança o lance do adversário quando o Treinador está focado em 1 cor
  useEffect(() => {
    if (!trainerActive || customFen || !nextExpectedStep) return;
    if (trainerColor === 'both') return;
    if (nextExpectedStep.color !== trainerColor) {
      const timer = setTimeout(() => {
        setCurrentPly((prev) => Math.min(steps.length, prev + 1));
      }, 360);
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
    setCurrentPly(0);
    setCustomFen(null);
    setHintLevel(0);
    setLastFeedback(null);
  };

  const handleSelectOpening = (opening: ChessOpeningStudy) => {
    setSelectedOpeningId(opening.id);
    setCurrentStudyType('opening');
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
        setStarsEarned((s) => s + 1);
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
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#FFF9ED] text-[#2B261F] select-none">
      {/* BARRA SUPERIOR AMIGÁVEL: 4 DESTINOS + ALTERNADOR DE MODO */}
      <header className="h-16 shrink-0 bg-[#FFFDF8] border-b-2 border-[#EADBC4] px-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#16865E] text-white flex items-center justify-center font-black text-xl shadow-sm">
            ♞
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-[#2B261F]">
              Chess Mastery
            </h1>
            <p className="text-[11px] font-bold text-[#6E6355]">
              Academia Lúdica & Treinador Inteligente de Aberturas
            </p>
          </div>
        </div>

        {/* 4 Destinos Principais */}
        <nav className="flex items-center gap-1.5 bg-[#F4EBD9] p-1.5 rounded-2xl border border-[#E5D5BC]">
          {(
            [
              { id: 'learn', label: '🌟 Aprender' },
              { id: 'library', label: '📚 Biblioteca' },
              { id: 'openings', label: '♟️ Aberturas' },
              { id: 'achievements', label: '🏆 Conquistas' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setNavDest(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                navDest === tab.id
                  ? 'bg-[#16865E] text-white shadow-sm'
                  : 'text-[#5C5245] hover:bg-[#FFF9ED]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Modos de Uso: Aprender (Padrão) vs Explorador (Opcional) */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-[#F4EBD9] p-1 rounded-xl border border-[#E5D5BC]">
            <button
              onClick={() => setExperienceMode('aprender')}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                experienceMode === 'aprender'
                  ? 'bg-[#DDF3E5] text-[#0E5E40] border border-[#8CD4AE]'
                  : 'text-[#6E6355]'
              }`}
            >
              🌱 Modo Aprender
            </button>
            <button
              onClick={() => setExperienceMode('explorador')}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                experienceMode === 'explorador'
                  ? 'bg-[#DCEBFF] text-[#184E88] border border-[#96C2F7]'
                  : 'text-[#6E6355]'
              }`}
            >
              🧭 Modo Explorador
            </button>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#FFE5A8] border border-[#F2C45A] text-[#664600] text-xs font-extrabold flex items-center gap-1.5">
            ⭐ {starsEarned}
          </div>
        </div>
      </header>

      {/* CORPO PRINCIPAL */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* SIDEBAR ESQUERDA CONTEXTUAL */}
        <aside className="w-80 shrink-0 bg-[#FFFDF8] border-r-2 border-[#EADBC4] flex flex-col h-full">
          <div className="p-3.5 border-b border-[#EADBC4]">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C7D6B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar livro, capítulo ou abertura..."
                className="w-full bg-[#FFF9ED] border border-[#DFCEB4] rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-[#2B261F] placeholder:text-[#9A8B78] focus:outline-none focus:border-[#16865E]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {navDest === 'library' ? (
              PREINSTALLED_BOOKS.map((book) => {
                const isExpanded = expandedBookIds.includes(book.id);
                return (
                  <div
                    key={book.id}
                    className="rounded-2xl border-2 border-[#EADBC4] bg-[#FFF9ED] overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedBookIds((prev) =>
                          prev.includes(book.id)
                            ? prev.filter((id) => id !== book.id)
                            : [...prev, book.id]
                        )
                      }
                      className="w-full p-3 text-left flex items-center justify-between hover:bg-[#F5EBD8]"
                    >
                      <div>
                        <div className="text-[10px] font-extrabold uppercase text-[#16865E]">
                          {book.author}
                        </div>
                        <div className="text-xs font-extrabold text-[#2B261F]">
                          {book.titlePt}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-[#6E6355] transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="p-2.5 pt-0 space-y-2 border-t border-[#EADBC4]">
                        {book.chapters.map((ch) => (
                          <div key={ch.id} className="bg-[#FFFDF8] rounded-xl p-2 border border-[#EADBC4]">
                            <div className="text-[11px] font-extrabold text-[#2B261F] mb-1">
                              Cap. {ch.number} — {ch.titlePt}
                            </div>
                            <div className="space-y-1">
                              {ch.games.map((g) => (
                                <button
                                  key={g.id}
                                  onClick={() => handleSelectGame(book.id, g.id)}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    currentStudyType === 'book_game' && selectedGameId === g.id
                                      ? 'bg-[#DDF3E5] text-[#0E5E40] border border-[#8CD4AE]'
                                      : 'text-[#5C5245] hover:bg-[#F4EBD9]'
                                  }`}
                                >
                                  {g.titlePt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              CHESS_OPENINGS.map((op) => (
                <button
                  key={op.id}
                  onClick={() => handleSelectOpening(op)}
                  className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${
                    currentStudyType === 'opening' && selectedOpeningId === op.id
                      ? 'bg-[#DDF3E5] border-[#16865E]'
                      : 'bg-[#FFF9ED] border-[#EADBC4] hover:border-[#C8B496]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#FFE5A8] text-[#664600] text-[10px] font-extrabold">
                      {op.eco}
                    </span>
                    <span className="text-[10px] font-bold text-[#6E6355]">
                      {op.recommendedFor === 'white'
                        ? '⚪ Brancas'
                        : op.recommendedFor === 'black'
                        ? '⚫ Pretas'
                        : '☯️ Ambas'}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-[#2B261F]">{op.namePt}</div>
                  <div className="text-[11px] text-[#6E6355] line-clamp-2 mt-0.5">
                    {op.summaryPt}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* PALCO CENTRAL: TABULEIRO DOMINANTE + BARRA DE PROGRESSO + CONTROLES ESSENCIAIS */}
        <main className="flex-1 min-w-0 flex flex-col items-center justify-between p-5 bg-[#FFF9ED] overflow-y-auto">
          {/* Cabeçalho da Lição & Seletor de Cor do Treinador */}
          <div className="w-full max-w-[640px] bg-[#FFFDF8] border-2 border-[#EADBC4] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
            <div>
              <span className="text-[11px] font-extrabold text-[#16865E] uppercase">
                {currentStudyType === 'opening' ? 'Treinador de Abertura' : 'Estudo Clássico'}
              </span>
              <h2 className="text-base font-extrabold text-[#2B261F]">{activeStudyTitle}</h2>
            </div>

            <div className="flex items-center gap-1.5 bg-[#F4EBD9] p-1 rounded-xl border border-[#E5D5BC]">
              {(
                [
                  { id: 'w', label: '⚪ Brancas' },
                  { id: 'b', label: '⚫ Pretas' },
                  { id: 'both', label: '☯️ Ambas' },
                ] as const
              ).map((side) => (
                <button
                  key={side.id}
                  onClick={() => {
                    setTrainerColor(side.id);
                    if (side.id === 'w') setFlipped(false);
                    if (side.id === 'b') setFlipped(true);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                    trainerColor === side.id
                      ? 'bg-[#16865E] text-white'
                      : 'text-[#5C5245] hover:bg-[#FFF9ED]'
                  }`}
                >
                  {side.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabuleiro Central */}
          <div className="my-2 flex items-center gap-3">
            {experienceMode === 'explorador' && (
              <div className="h-[460px]">
                <VerticalEvaluationBar
                  scoreCp={engineAnalysis.scoreCp}
                  mateIn={engineAnalysis.mateIn}
                  flipped={flipped}
                />
              </div>
            )}
            <div className="w-[460px] h-[460px] rounded-2xl p-2.5 bg-[#B58A65] shadow-md border-4 border-[#8C623E]">
              <InteractiveChessboard
                fen={activeFen}
                flipped={flipped}
                themeId={boardTheme}
                onMove={handleBoardMove}
              />
            </div>
          </div>

          {/* Controles Essenciais: Anterior • Ver Dica • Próximo */}
          <div className="w-full max-w-[640px] bg-[#FFFDF8] border-2 border-[#EADBC4] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm">
            <button
              onClick={() => goToPly(currentPly - 1)}
              disabled={currentPly === 0}
              className="px-4 py-2 rounded-xl bg-[#F4EBD9] hover:bg-[#EADBC4] disabled:opacity-40 text-xs font-extrabold text-[#2B261F] flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <button
              onClick={() =>
                setHintLevel((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : 1))
              }
              disabled={!nextExpectedStep}
              className="px-5 py-2 rounded-xl bg-[#FFE5A8] hover:bg-[#FBD885] border border-[#F2C45A] text-xs font-extrabold text-[#664600] flex items-center gap-1.5 shadow-sm"
            >
              <Lightbulb className="w-4 h-4" /> 💡 Ver Dica{' '}
              {hintLevel > 0 ? `(${hintLevel}/3)` : ''}
            </button>

            <button
              onClick={() => goToPly(currentPly + 1)}
              disabled={currentPly >= steps.length}
              className="px-5 py-2 rounded-xl bg-[#16865E] hover:bg-[#126E4D] disabled:opacity-40 text-xs font-extrabold text-white flex items-center gap-1.5 shadow-sm"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* PAINEL DIREITO: FEEDBACK CONSTRUTIVO + 3 FONTES CLARAMENTE SEPARADAS */}
        <aside className="w-96 shrink-0 bg-[#FFFDF8] border-l-2 border-[#EADBC4] p-4 overflow-y-auto space-y-3.5">
          {/* Card de Feedback Construtivo */}
          {lastFeedback && (
            <div
              className={`p-3.5 rounded-2xl border-2 ${
                lastFeedback.tier === 'main'
                  ? 'bg-[#DDF3E5] border-[#8CD4AE] text-[#0E5E40]'
                  : lastFeedback.tier === 'plausible'
                  ? 'bg-[#DCEBFF] border-[#96C2F7] text-[#184E88]'
                  : 'bg-[#F9DCD9] border-[#E8A7A1] text-[#7D2923]'
              }`}
            >
              <div className="text-xs font-extrabold mb-1">{lastFeedback.headlinePt}</div>
              <p className="text-xs leading-relaxed">{lastFeedback.detailPt}</p>
            </div>
          )}

          {/* Dicas Progressivas em 3 Níveis */}
          {hintLevel > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#FFE5A8] border-2 border-[#F2C45A] text-[#593D00] space-y-1.5">
              <div className="text-xs font-extrabold">
                💡 Dica Nível {hintLevel} de 3
              </div>
              {hintLevel >= 1 && <p className="text-xs">1️⃣ {progressiveHints.level1Question}</p>}
              {hintLevel >= 2 && <p className="text-xs font-semibold">2️⃣ {progressiveHints.level2PieceAndPlan}</p>}
              {hintLevel >= 3 && <p className="text-xs font-extrabold">3️⃣ {progressiveHints.level3MoveAndWhy}</p>}
            </div>
          )}

          {/* FONTE 1: 🦉 DO TUTOR */}
          <div className="p-4 rounded-2xl bg-[#FFE5A8]/65 border-2 border-[#F2C45A]">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#664600] mb-1">
              🦉 Do Tutor (Explicação Amigável)
            </div>
            <p className="text-xs font-semibold text-[#3B2B08] leading-relaxed">
              {currentStep?.annotation?.commentPt ||
                (currentStudyType === 'opening'
                  ? currentOpening.summaryPt
                  : currentChapterAndGame.game.introPt)}
            </p>
          </div>

          {/* FONTE 2: 📗 DO LIVRO (COM CITAÇÃO VERIFICADA) */}
          <div className="p-4 rounded-2xl bg-[#DDF3E5] border-2 border-[#8CD4AE]">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#0E5E40] mb-1">
              📗 Do Livro (Fonte Histórica Verificada)
            </div>
            <p className="text-xs font-semibold text-[#134632] leading-relaxed mb-2">
              {currentStep?.annotation?.commentOriginal ||
                'Princípio clássico extraído e validado por motor de regras chess.js.'}
            </p>
            <div className="text-[11px] font-bold text-[#0E5E40] bg-white/70 px-2.5 py-1.5 rounded-xl border border-[#8CD4AE]">
              📖 {bookCitation.bookTitle} • {bookCitation.author} • {bookCitation.chapterLabel} •{' '}
              {bookCitation.pageEstimate}
            </div>
          </div>

          {/* FONTE 3: 🤖 DO STOCKFISH */}
          <div className="p-4 rounded-2xl bg-[#DCEBFF] border-2 border-[#96C2F7]">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#184E88] mb-1">
              🤖 Do Stockfish (Análise do Computador)
            </div>
            <p className="text-xs font-semibold text-[#163C66] leading-relaxed">
              Melhor sugestão: <strong>{sanToPortugueseAlgebraic(engineAnalysis.bestMoveSan)}</strong>.{' '}
              {engineAnalysis.explanationPt}
            </p>
            <p className="text-[10px] text-[#356294] mt-1 font-medium">
              *Análise gerada por motor tático, separada da opinião do autor do livro.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default App;
