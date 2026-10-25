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
} from 'lucide-react';
import {
  formatMoveByMode,
  sanToPortugueseAlgebraic,
  sanToFigurine,
} from '@shared/ui/chess/descriptiveNotation';
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
import { VerticalEvaluationBar, PlayerBannerBar } from '@/components/BoardSideComponents';
import { GuessTheMovePanel } from '@/components/GuessTheMovePanel';
import type {
  AppStudyMode,
  BoardThemeId,
  LanguageDisplayMode,
  NotationMode,
  StudySourceType,
  BookLessonGame,
} from '@/types/chess';

const STORAGE_KEY = 'chess_mastery_progress_v2';

interface SavedUserProgress {
  completedGameIds: string[];
  notesByGameId: Record<string, string>;
  preferredNotation: NotationMode;
  preferredTheme: BoardThemeId;
  preferredLanguage: LanguageDisplayMode;
}

export const App: React.FC = () => {
  // Navegação Principal e Modos
  const [activeNavTab, setActiveNavTab] = useState<'library' | 'openings'>('library');
  const [currentStudyType, setCurrentStudyType] = useState<StudySourceType>('book_game');
  const [rightPanelTab, setRightPanelTab] = useState<'study' | 'movesheet' | 'guess'>('study');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Livros, Acordeão e Modo Isolado de Capítulo (Pedido do Usuário)
  const [selectedBookId, setSelectedBookId] = useState<string>(PREINSTALLED_BOOKS[0].id);
  const [expandedBookIds, setExpandedBookIds] = useState<string[]>([PREINSTALLED_BOOKS[0].id]);
  const [isolatedChapterId, setIsolatedChapterId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string>(
    PREINSTALLED_BOOKS[0].chapters[0].games[0].id
  );

  // Aberturas & Defesas
  const [selectedOpeningCat, setSelectedOpeningCat] = useState<string>('open');
  const [selectedOpeningId, setSelectedOpeningId] = useState<string>(CHESS_OPENINGS[0].id);

  // Progresso persistente
  const [completedGameIds, setCompletedGameIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).completedGameIds || [];
    } catch {}
    return [];
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
  const [engineEnabled, setEngineEnabled] = useState<boolean>(false);

  // Tabuleiro e Lances
  const [currentPly, setCurrentPly] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [studyMode, setStudyMode] = useState<AppStudyMode>('study');

  // Exploração livre
  const [customFen, setCustomFen] = useState<string | null>(null);
  const [customHistorySan, setCustomHistorySan] = useState<string[]>([]);
  const [customLastMove, setCustomLastMove] = useState<{ from: string; to: string } | null>(null);

  // Modo Adivinhe o Lance
  const [guessSolvedCurrent, setGuessSolvedCurrent] = useState<boolean>(false);
  const [guessWrongMove, setGuessWrongMove] = useState<string | null>(null);
  const [guessShowHint, setGuessShowHint] = useState<boolean>(false);
  const [guessStats, setGuessStats] = useState<{
    correct: number;
    attempts: number;
    streak: number;
  }>({ correct: 0, attempts: 0, streak: 0 });

  // Livro, Capítulo e Partida Ativos
  const currentBook = useMemo(
    () => PREINSTALLED_BOOKS.find((b) => b.id === selectedBookId) || PREINSTALLED_BOOKS[0],
    [selectedBookId]
  );

  const currentChapter = useMemo(() => {
    if (isolatedChapterId) {
      const found = currentBook.chapters.find((c) => c.id === isolatedChapterId);
      if (found) return found;
    }
    return currentBook.chapters[0];
  }, [currentBook, isolatedChapterId]);

  const currentGame = useMemo(
    () => currentChapter.games.find((g) => g.id === selectedGameId) || currentChapter.games[0],
    [currentChapter, selectedGameId]
  );

  const currentOpening = useMemo(
    () => CHESS_OPENINGS.find((o) => o.id === selectedOpeningId) || CHESS_OPENINGS[0],
    [selectedOpeningId]
  );

  // Converte a Abertura em formato compatível com GameBuilder
  const activeStudyItem = useMemo<BookLessonGame>(() => {
    if (currentStudyType === 'opening') {
      return {
        id: currentOpening.id,
        titlePt: currentOpening.namePt,
        white: currentOpening.heroColor === 'w' ? 'Linha das Brancas' : 'Mestre / Teoria',
        black: currentOpening.heroColor === 'b' ? 'Defesa das Pretas' : 'Mestre / Teoria',
        event: 'Teoria de Aberturas & Defesas',
        year: currentOpening.eco,
        result: '1/2-1/2',
        eco: currentOpening.eco,
        openingNamePt: currentOpening.namePt,
        heroColor: currentOpening.heroColor,
        initialFen: currentOpening.initialFen,
        introPt: currentOpening.introPt,
        keyTakeawaysPt: currentOpening.plansWhite.concat(currentOpening.plansBlack),
        movesSan: currentOpening.movesSan,
        annotations: currentOpening.annotations as any,
      };
    }
    return currentGame;
  }, [currentStudyType, currentOpening, currentGame]);

  const { initialFen, steps } = useMemo(
    () => buildGameSteps(activeStudyItem),
    [activeStudyItem]
  );

  // Persistência
  useEffect(() => {
    const payload: SavedUserProgress = {
      completedGameIds,
      notesByGameId,
      preferredNotation: notationMode,
      preferredTheme: boardTheme,
      preferredLanguage: languageMode,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [completedGameIds, notesByGameId, notationMode, boardTheme, languageMode]);

  // Selecionar Partida da Biblioteca
  const selectLessonGame = useCallback((bookId: string, chapterId: string, gameId: string) => {
    setCurrentStudyType('book_game');
    setActiveNavTab('library');
    setSelectedBookId(bookId);
    setIsolatedChapterId(chapterId);
    setSelectedGameId(gameId);
    setCurrentPly(0);
    setCustomFen(null);
    setCustomHistorySan([]);
    setCustomLastMove(null);
    const bk = PREINSTALLED_BOOKS.find((b) => b.id === bookId);
    const ch = bk?.chapters.find((c) => c.id === chapterId);
    const gm = ch?.games.find((g) => g.id === gameId);
    if (gm) setFlipped(gm.heroColor === 'b');
    setGuessSolvedCurrent(false);
    setGuessWrongMove(null);
    setGuessShowHint(false);
  }, []);

  // Selecionar Abertura / Defesa
  const selectOpeningStudy = useCallback((openingId: string) => {
    setCurrentStudyType('opening');
    setActiveNavTab('openings');
    setSelectedOpeningId(openingId);
    const op = CHESS_OPENINGS.find((o) => o.id === openingId);
    if (op) {
      setSelectedOpeningCat(op.category);
      setFlipped(op.heroColor === 'b');
    }
    setCurrentPly(0);
    setCustomFen(null);
    setCustomHistorySan([]);
    setCustomLastMove(null);
    setGuessSolvedCurrent(false);
    setGuessWrongMove(null);
    setGuessShowHint(false);
  }, []);

  // Passo ativo
  const activeStep = useMemo(
    () => (currentPly > 0 && currentPly <= steps.length ? steps[currentPly - 1] : null),
    [currentPly, steps]
  );

  const displayedFen = useMemo(() => {
    if (customFen) return customFen;
    return activeStep ? activeStep.fenAfter : initialFen;
  }, [customFen, activeStep, initialFen]);

  const playStepAudio = useCallback((step: typeof activeStep) => {
    if (!step) {
      chessAudio.playMove();
      return;
    }
    if (step.inCheck || step.isCheckmate) {
      chessAudio.playCheck();
    } else if (step.captured) {
      chessAudio.playCapture();
    } else if (step.isCastling) {
      chessAudio.playCastle();
    } else {
      chessAudio.playMove();
    }
  }, []);

  const goToPly = useCallback(
    (targetPly: number) => {
      const clamped = Math.max(0, Math.min(steps.length, targetPly));
      setCustomFen(null);
      setCustomHistorySan([]);
      setCustomLastMove(null);
      setCurrentPly(clamped);
      setGuessSolvedCurrent(false);
      setGuessWrongMove(null);
      setGuessShowHint(false);

      if (clamped > 0 && clamped <= steps.length) {
        playStepAudio(steps[clamped - 1]);
      }
    },
    [steps, playStepAudio]
  );

  // Lance do usuário no tabuleiro
  const handleUserBoardMove = useCallback(
    (from: string, to: string, promotionPiece: string = 'q'): boolean => {
      const chess = new Chess(displayedFen);
      const moveResult = chess.move({ from, to, promotion: promotionPiece });
      if (!moveResult) return false;

      if (studyMode === 'guess') {
        const targetStep = guessSolvedCurrent ? activeStep : steps[currentPly];
        if (!targetStep || guessSolvedCurrent) return false;

        if (targetStep.from === from && targetStep.to === to) {
          chessAudio.playSuccess();
          setCurrentPly(targetStep.ply);
          setGuessSolvedCurrent(true);
          setGuessWrongMove(null);
          setGuessStats((prev) => ({
            correct: prev.correct + 1,
            attempts: prev.attempts + 1,
            streak: prev.streak + 1,
          }));
          return true;
        } else {
          chessAudio.playError();
          setGuessWrongMove(
            formatMoveByMode(
              {
                san: moveResult.san,
                piece: moveResult.piece,
                from: moveResult.from,
                to: moveResult.to,
                color: moveResult.color,
                captured: moveResult.captured,
              },
              notationMode
            )
          );
          setGuessStats((prev) => ({
            ...prev,
            attempts: prev.attempts + 1,
            streak: 0,
          }));
          return false;
        }
      }

      if (!customFen && currentPly < steps.length) {
        const nextCanonical = steps[currentPly];
        if (nextCanonical.from === from && nextCanonical.to === to) {
          goToPly(currentPly + 1);
          return true;
        }
      }

      setStudyMode('explore');
      setCustomFen(chess.fen());
      setCustomLastMove({ from, to });
      setCustomHistorySan((prev) => [...prev, sanToPortugueseAlgebraic(moveResult.san)]);

      if (chess.inCheck()) {
        chessAudio.playCheck();
      } else if (moveResult.captured) {
        chessAudio.playCapture();
      } else {
        chessAudio.playMove();
      }
      return true;
    },
    [displayedFen, studyMode, guessSolvedCurrent, activeStep, steps, currentPly, customFen, goToPly, notationMode]
  );

  // Avaliação do Stockfish
  const engineEval = useMemo(() => {
    if (!engineEnabled || studyMode === 'guess') return null;
    return analyzePositionLocal(displayedFen);
  }, [engineEnabled, studyMode, displayedFen]);

  const materialBalance = useMemo(
    () => computeMaterialBalance(displayedFen),
    [displayedFen]
  );

  const lastMoveHighlight = useMemo(() => {
    if (customLastMove) return customLastMove;
    if (activeStep) return { from: activeStep.from, to: activeStep.to };
    return null;
  }, [customLastMove, activeStep]);

  // Jogadores Top / Bottom
  const topPlayer = useMemo(() => {
    const isWhite = flipped;
    const name = currentStudyType === 'opening'
      ? (isWhite ? '⚪ Lado das Brancas' : '⚫ Resposta das Pretas')
      : (isWhite ? currentGame.white : currentGame.black);
    const color: 'w' | 'b' = isWhite ? 'w' : 'b';
    const isTurn = new Chess(displayedFen).turn() === color;
    const captured = isWhite ? materialBalance.capturedByWhite : materialBalance.capturedByBlack;
    const advantage = isWhite ? materialBalance.whiteAdvantage : materialBalance.blackAdvantage;
    return { name, color, isTurn, captured, advantage };
  }, [flipped, currentStudyType, currentGame, displayedFen, materialBalance]);

  const bottomPlayer = useMemo(() => {
    const isWhite = !flipped;
    const name = currentStudyType === 'opening'
      ? (isWhite ? '⚪ Lado das Brancas' : '⚫ Resposta das Pretas')
      : (isWhite ? currentGame.white : currentGame.black);
    const color: 'w' | 'b' = isWhite ? 'w' : 'b';
    const isTurn = new Chess(displayedFen).turn() === color;
    const captured = isWhite ? materialBalance.capturedByWhite : materialBalance.capturedByBlack;
    const advantage = isWhite ? materialBalance.whiteAdvantage : materialBalance.blackAdvantage;
    return { name, color, isTurn, captured, advantage };
  }, [flipped, currentStudyType, currentGame, displayedFen, materialBalance]);

  // Exportar / Importar
  const handleExportProgress = () => {
    const payload = {
      completedGameIds,
      notesByGameId,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chess_mastery_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.completedGameIds)) {
          setCompletedGameIds(parsed.completedGameIds);
        }
        if (parsed.notesByGameId && typeof parsed.notesByGameId === 'object') {
          setNotesByGameId(parsed.notesByGameId);
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#080a0f] text-zinc-100 antialiased select-none">
      {/* HEADER PRINCIPAL */}
      <header className="h-[60px] px-4 flex items-center justify-between border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <img src="/app-icon.png" alt="Chess Mastery" className="w-7 h-7 rounded-lg object-cover" />
            <div>
              <div className="text-xs font-extrabold tracking-tight">Chess Mastery</div>
              <div className="text-[10px] font-semibold text-emerald-400">Academia de Mestres</div>
            </div>
          </div>

          {/* Navegador de Visão Central */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900/80 border border-white/[0.08]">
            <button
              onClick={() => setActiveNavTab('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeNavTab === 'library'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Livros Mestres
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 font-mono">
                {PREINSTALLED_BOOKS.length}
              </span>
            </button>

            <button
              onClick={() => setActiveNavTab('openings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeNavTab === 'openings'
                  ? 'bg-sky-500 text-zinc-950 shadow-md shadow-sky-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Aberturas & Defesas
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 font-mono">
                {CHESS_OPENINGS.length}
              </span>
            </button>
          </div>
        </div>

        {/* Notação & Modos */}
        <div className="flex items-center gap-2">
          {/* Seletor de Notação */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900/80 border border-white/[0.08]">
            {[
              { id: 'alg_pt', label: 'Algébrica PT' },
              { id: 'figurine', label: 'Figurino (♘)' },
              { id: 'desc_pt', label: 'Descritiva (C3BR)' },
              { id: 'desc_es', label: 'Descritiva ES' },
              { id: 'alg_en', label: 'SAN' },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => setNotationMode(n.id as NotationMode)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                  notationMode === n.id
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>

          {/* Modo de Estudo */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900/80 border border-white/[0.08]">
            <button
              onClick={() => {
                setStudyMode('study');
                setRightPanelTab('study');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                studyMode !== 'guess' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Leitura
            </button>
            <button
              onClick={() => {
                setStudyMode('guess');
                setRightPanelTab('guess');
                setGuessSolvedCurrent(false);
                setGuessWrongMove(null);
                setGuessShowHint(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                studyMode === 'guess' ? 'bg-amber-400 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Adivinhe
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE PRINCIPAL (3 COLUNAS) */}
      <main className="flex-1 min-h-0 grid grid-cols-12 gap-4 p-4">
        {/* COLUNA 1 (3.5 cols): ABA LATERAL ESQUERDA REFORMULADA */}
        <aside className="col-span-3.5 flex flex-col min-h-0 rounded-3xl bg-zinc-900/70 border border-white/[0.08] p-3.5 shadow-2xl">
          {/* Alternador da Barra Lateral */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06] mb-3">
            <button
              onClick={() => setActiveNavTab('library')}
              className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeNavTab === 'library'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Livros da Biblioteca
            </button>
            <button
              onClick={() => setActiveNavTab('openings')}
              className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeNavTab === 'openings'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Aberturas & Defesas
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder={
                activeNavTab === 'library'
                  ? 'Buscar livros, capítulos ou mestres...'
                  : 'Buscar abertura por nome ou ECO...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition"
            />
          </div>

          {/* CONTEÚDO DA BARRA LATERAL */}
          {activeNavTab === 'library' ? (
            isolatedChapterId ? (
              // MODO ISOLADO DE CAPÍTULO (SOLICITAÇÃO PRINCIPAL DO USUÁRIO)
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2.5">
                  <button
                    onClick={() => setIsolatedChapterId(null)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-white/10 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Voltar aos Capítulos
                  </button>
                  <span className="text-[11px] text-zinc-500 truncate max-w-[140px]">
                    {currentBook.titlePt.split(' (')[0]}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-950 border border-emerald-500/30 mb-3 shadow-lg">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 mb-1">
                    <span>Capítulo {currentChapter.number} Isolado</span>
                    <span className="text-zinc-400 font-mono">{currentChapter.games.length} Partidas</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white leading-snug">{currentChapter.titlePt}</h3>
                  <p className="text-xs text-zinc-300 mt-1 line-clamp-2">{currentChapter.subtitlePt}</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {currentChapter.games.map((gm) => (
                    <button
                      key={gm.id}
                      onClick={() => selectLessonGame(currentBook.id, currentChapter.id, gm.id)}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2.5 ${
                        gm.id === currentGame.id && currentStudyType === 'book_game'
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-white shadow-md'
                          : 'bg-black/30 border-white/[0.06] text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{gm.titlePt}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                          {gm.white} vs. {gm.black} ({gm.year})
                        </div>
                        <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-emerald-300">
                          {gm.eco} · {gm.openingNamePt || 'Partida Clássica'}
                        </span>
                      </div>
                      {completedGameIds.includes(gm.id) && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // VISÃO GERAL COM ACORDEÃO DE LIVROS
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {PREINSTALLED_BOOKS.filter((bk) => {
                  const q = searchQuery.toLowerCase();
                  if (!q) return true;
                  return (
                    bk.titlePt.toLowerCase().includes(q) ||
                    bk.author.toLowerCase().includes(q) ||
                    bk.chapters.some((c) => c.titlePt.toLowerCase().includes(q))
                  );
                }).map((bk) => {
                  const isExpanded = expandedBookIds.includes(bk.id);
                  const isActive = bk.id === currentBook.id;

                  return (
                    <div
                      key={bk.id}
                      className={`rounded-2xl border transition overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-b from-emerald-500/10 to-zinc-950/80 border-emerald-500/30'
                          : 'bg-black/30 border-white/[0.06] hover:border-white/10'
                      }`}
                    >
                      <div
                        onClick={() => {
                          setSelectedBookId(bk.id);
                          setExpandedBookIds((prev) =>
                            prev.includes(bk.id) ? prev.filter((id) => id !== bk.id) : [...prev, bk.id]
                          );
                        }}
                        className="p-3 cursor-pointer flex items-center justify-between gap-2.5 select-none"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm flex-shrink-0">
                            📖
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-white truncate">{bk.titlePt.split(' (')[0]}</h4>
                            <p className="text-[11px] text-zinc-400 truncate">{bk.author} · {bk.publicationYear}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold">
                            {bk.chapters.length} Cap.
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180 text-emerald-400' : ''}`}
                          />
                        </div>
                      </div>

                      {/* Capítulos expandidos */}
                      {isExpanded && (
                        <div className="p-2 pt-0 space-y-1.5 border-t border-white/[0.04]">
                          {bk.chapters.map((ch) => (
                            <button
                              key={ch.id}
                              onClick={() => {
                                setSelectedBookId(bk.id);
                                setIsolatedChapterId(ch.id);
                                if (ch.games.length > 0) {
                                  selectLessonGame(bk.id, ch.id, ch.games[0].id);
                                }
                              }}
                              className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between gap-2 ${
                                ch.id === currentChapter.id && isActive
                                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-white'
                                  : 'bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">
                                  Capítulo {ch.number}
                                </div>
                                <div className="text-xs font-bold text-white truncate">{ch.titlePt}</div>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/40 text-emerald-300 flex-shrink-0">
                                Isolar ➔
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            // ABA DE ABERTURAS & DEFESAS (REPERTÓRIO E TEORIA)
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {OPENING_CATEGORIES.map((cat) => {
                const catOpenings = CHESS_OPENINGS.filter((o) => {
                  if (o.category !== cat.id) return false;
                  const q = searchQuery.toLowerCase();
                  if (!q) return true;
                  return o.namePt.toLowerCase().includes(q) || o.eco.toLowerCase().includes(q);
                });
                if (catOpenings.length === 0) return null;
                const isCatOpen = selectedOpeningCat === cat.id;

                return (
                  <div key={cat.id} className="rounded-2xl bg-black/30 border border-white/[0.06] overflow-hidden">
                    <div
                      onClick={() => setSelectedOpeningCat((prev) => (prev === cat.id ? '' : cat.id))}
                      className="p-3 cursor-pointer flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.05] transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{cat.icon}</span>
                        <span className="text-xs font-bold text-white">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 font-bold">
                          {catOpenings.length}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isCatOpen ? 'rotate-180 text-sky-400' : ''}`} />
                      </div>
                    </div>

                    {isCatOpen && (
                      <div className="p-2 pt-0 space-y-1.5 border-t border-white/[0.04]">
                        {catOpenings.map((op) => (
                          <button
                            key={op.id}
                            onClick={() => selectOpeningStudy(op.id)}
                            className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between gap-2 ${
                              op.id === currentOpening.id && currentStudyType === 'opening'
                                ? 'bg-sky-500/20 border border-sky-500/50 text-white shadow-md'
                                : 'bg-white/[0.02] hover:bg-white/[0.06] text-zinc-300'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-white truncate">{op.namePt}</div>
                              <div className="text-[10px] text-zinc-400 truncate">{op.tag}</div>
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                              {op.eco}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Rodapé da Barra Lateral */}
          <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
            <button
              onClick={handleExportProgress}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-medium text-zinc-300 border border-white/[0.07] transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Exportar
            </button>
            <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-medium text-zinc-300 border border-white/[0.07] transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              Importar
              <input type="file" accept=".json" onChange={handleImportProgress} className="hidden" />
            </label>
          </div>
        </aside>

        {/* COLUNA 2 (5 cols): ARENA DO TABULEIRO */}
        <section className="col-span-5 flex flex-col justify-between min-h-0">
          {/* Banner do Jogador Superior */}
          <PlayerBannerBar
            name={topPlayer.name}
            color={topPlayer.color}
            isTurn={topPlayer.isTurn}
            capturedPieces={topPlayer.captured}
            materialAdvantage={topPlayer.advantage}
            subtitle={
              currentStudyType === 'opening'
                ? `${currentOpening.eco} · ${currentOpening.tag}`
                : `${currentGame.event} (${currentGame.year})`
            }
          />

          {/* Tabuleiro Central + Avaliação */}
          <div className="my-auto py-2 flex items-center justify-center gap-3">
            {engineEnabled && studyMode !== 'guess' && engineEval && (
              <div className="h-[min(56vh,460px)]">
                <VerticalEvaluationBar
                  scoreCp={engineEval.scoreCp}
                  mateIn={engineEval.mateIn}
                  flipped={flipped}
                  visible={true}
                />
              </div>
            )}

            <div className="w-full max-w-[min(58vh,490px)]">
              <InteractiveChessboard
                fen={displayedFen}
                flipped={flipped}
                themeId={boardTheme}
                notationMode={notationMode}
                lastMove={lastMoveHighlight}
                moveBadge={!customFen && studyMode !== 'guess' ? activeStep?.annotation?.badge : undefined}
                bookArrows={!customFen && studyMode !== 'guess' ? activeStep?.annotation?.arrows : undefined}
                bookHighlights={
                  !customFen && studyMode !== 'guess'
                    ? activeStep?.annotation?.highlights
                    : studyMode === 'guess' && guessShowHint && activeStep
                    ? [{ square: activeStep.from, color: 'amber' }]
                    : undefined
                }
                engineArrow={
                  engineEnabled && studyMode !== 'guess' && engineEval?.bestMoveFrom && engineEval?.bestMoveTo
                    ? { from: engineEval.bestMoveFrom, to: engineEval.bestMoveTo }
                    : null
                }
                onUserMove={handleUserBoardMove}
                interactive={true}
              />
            </div>
          </div>

          {/* Banner do Jogador Inferior + Toolbar */}
          <div className="space-y-2">
            <PlayerBannerBar
              name={bottomPlayer.name}
              color={bottomPlayer.color}
              isTurn={bottomPlayer.isTurn}
              capturedPieces={bottomPlayer.captured}
              materialAdvantage={bottomPlayer.advantage}
              subtitle={
                currentStudyType === 'opening'
                  ? currentOpening.namePt
                  : `${currentGame.openingNamePt} · Resultado: ${currentGame.result}`
              }
            />

            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-zinc-900/80 border border-white/[0.08]">
              {/* Navegação de Lances */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPly(0)}
                  disabled={studyMode === 'guess' || currentPly === 0}
                  className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-30 text-zinc-200 transition"
                  title="Início (Home)"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToPly(currentPly - 1)}
                  disabled={studyMode === 'guess' || currentPly === 0}
                  className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-30 text-zinc-200 transition"
                  title="Anterior (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 text-xs font-mono font-semibold text-zinc-300">
                  {currentPly}/{steps.length}
                </span>
                <button
                  onClick={() => goToPly(currentPly + 1)}
                  disabled={studyMode === 'guess' || currentPly >= steps.length}
                  className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-30 text-zinc-200 transition"
                  title="Próximo (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToPly(steps.length)}
                  disabled={studyMode === 'guess' || currentPly >= steps.length}
                  className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-30 text-zinc-200 transition"
                  title="Final (End)"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Controles do Tabuleiro */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFlipped((f) => !f)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-zinc-200 border border-white/10 transition"
                  title="Inverter Tabuleiro (X ou F)"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Inverter
                </button>

                <select
                  value={boardTheme}
                  onChange={(e) => setBoardTheme(e.target.value as BoardThemeId)}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-800 border border-white/10 text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer"
                >
                  {Object.entries(BOARD_THEMES).map(([id, t]) => (
                    <option key={id} value={id}>
                      {t.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setEngineEnabled((e) => !e)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    engineEnabled
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-white/[0.06] text-zinc-400 border-white/10 hover:text-white'
                  }`}
                  title="Avaliação Stockfish"
                >
                  ⚡ Stockfish
                </button>

                <button
                  onClick={() => {
                    const next = !soundMuted;
                    setSoundMuted(next);
                    chessAudio.setMuted(next);
                  }}
                  className="p-2 rounded-xl hover:bg-white/10 text-zinc-300 border border-white/10 transition"
                  title={soundMuted ? 'Ativar som' : 'Silenciar som'}
                >
                  {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* COLUNA 3 (3.5 cols): PAINEL DIREITO DE ESTUDO & COMENTÁRIOS */}
        <aside className="col-span-3.5 flex flex-col min-h-0 rounded-3xl bg-zinc-900/70 border border-white/[0.08] p-3.5 shadow-2xl">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06] mb-3">
            <button
              onClick={() => setRightPanelTab('study')}
              className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'study'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Estudo & Teoria
            </button>
            <button
              onClick={() => setRightPanelTab('movesheet')}
              className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                rightPanelTab === 'movesheet'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📋 Planilha ({steps.length})
            </button>
          </div>

          {rightPanelTab === 'study' ? (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {currentStudyType === 'opening' ? (
                <>
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-500/20 via-zinc-900 to-zinc-950 border border-sky-500/30">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      {currentOpening.eco} · {currentOpening.badgeText}
                    </span>
                    <h3 className="text-sm font-extrabold text-white mt-2">{currentOpening.namePt}</h3>
                    <p className="text-xs text-zinc-300 mt-1">{currentOpening.introPt}</p>
                  </div>

                  {/* Planos Estratégicos */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                    <div className="text-[11px] font-extrabold uppercase text-white flex items-center gap-1.5">
                      ⚪ Planos das Brancas
                    </div>
                    <ul className="space-y-1 text-xs text-zinc-300">
                      {currentOpening.plansWhite.map((p, i) => (
                        <li key={i} className="pl-2 border-l-2 border-white/20">{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                    <div className="text-[11px] font-extrabold uppercase text-sky-400 flex items-center gap-1.5">
                      ⚫ Planos & Defesa das Pretas
                    </div>
                    <ul className="space-y-1 text-xs text-zinc-300">
                      {currentOpening.plansBlack.map((p, i) => (
                        <li key={i} className="pl-2 border-l-2 border-sky-500/40">{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] space-y-1">
                    <div className="text-[11px] font-extrabold uppercase text-amber-400">
                      ♙ Estrutura de Peões & Casas Chave
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{currentOpening.pawnStructure}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                    <div className="text-[11px] font-extrabold uppercase text-rose-400">
                      ⚠️ Armadilhas & Erros Típicos
                    </div>
                    <p className="text-xs text-rose-200 leading-relaxed">{currentOpening.trapsPt}</p>
                  </div>

                  {currentOpening.relatedBookGameId && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-emerald-300">Partida Modelo no Livro</div>
                        <div className="text-[11px] text-zinc-400">Estude a aplicação prática desta linha</div>
                      </div>
                      <button
                        onClick={() => {
                          for (const bk of PREINSTALLED_BOOKS) {
                            for (const ch of bk.chapters) {
                              const gm = ch.games.find((g) => g.id === currentOpening.relatedBookGameId);
                              if (gm) {
                                selectLessonGame(bk.id, ch.id, gm.id);
                                return;
                              }
                            }
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs"
                      >
                        Ver Partida
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Comentário do Livro da Partida */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                        {activeStep ? `${activeStep.moveNumber}. ${formatMoveByMode(activeStep, notationMode)}` : 'Posição Inicial'}
                      </span>
                      {activeStep && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                          <span>Figurino: <strong className="text-emerald-400">{sanToFigurine(activeStep.san)}</strong></span>
                          <span>Descritiva: <strong className="text-amber-400">{activeStep.descriptivePt}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-zinc-200 leading-relaxed">
                      {activeStep?.annotation ? (
                        <p>{activeStep.annotation.commentPt}</p>
                      ) : (
                        <p>{currentGame.introPt}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                    <div className="text-[11px] font-extrabold uppercase text-emerald-400">
                      🎯 Lições Estratégicas do Capítulo
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {currentGame.keyTakeawaysPt.map((t, i) => (
                        <li key={i} className="pl-2 border-l-2 border-emerald-500/40">{t}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ) : (
            // PLANILHA DE LANCES SINCRONIZADA
            <div className="flex-1 overflow-y-auto space-y-1 bg-black/40 rounded-2xl p-2.5 border border-white/[0.06]">
              {Array.from({ length: Math.ceil(steps.length / 2) }).map((_, idx) => {
                const w = steps[idx * 2];
                const b = steps[idx * 2 + 1];
                const mNum = idx + 1;
                const wAct = w && currentPly === w.ply;
                const bAct = b && currentPly === b.ply;

                return (
                  <div key={idx} className="grid grid-cols-12 items-center text-xs font-mono py-0.5">
                    <span className="col-span-2 text-zinc-500 pl-1">{mNum}.</span>
                    <button
                      onClick={() => goToPly(w.ply)}
                      className={`col-span-5 text-left px-2 py-1 rounded transition flex items-center justify-between ${
                        wAct ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-200 hover:bg-white/5'
                      }`}
                    >
                      <span>{formatMoveByMode(w, notationMode)}</span>
                      {w.annotation && !wAct && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    </button>
                    {b ? (
                      <button
                        onClick={() => goToPly(b.ply)}
                        className={`col-span-5 text-left px-2 py-1 rounded transition flex items-center justify-between ${
                          bAct ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-200 hover:bg-white/5'
                        }`}
                      >
                        <span>{formatMoveByMode(b, notationMode)}</span>
                        {b.annotation && !bAct && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </button>
                    ) : (
                      <span className="col-span-5" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};
