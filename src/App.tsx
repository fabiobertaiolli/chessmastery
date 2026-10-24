import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import {
  BookOpen,
  RotateCw,
  SkipBack,
  ChevronLeft,
  ChevronRight,
  SkipForward,
  Cpu,
  Volume2,
  VolumeX,
  Target,
  Compass,
  Library,
  CheckCircle2,
  Sparkles,
  Languages,
  Palette,
  FileText,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';
import {
  formatMoveByMode,
  sanToPortugueseAlgebraic,
  sanToFigurine,
} from '@shared/ui/chess/descriptiveNotation';
import { chessAudio } from '@shared/ui/chess/chessAudio';
import { PREINSTALLED_BOOKS } from '@/data/preinstalledBooks';
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
} from '@/types/chess';

const STORAGE_KEY = 'chess_mastery_progress_v1';

interface SavedUserProgress {
  completedGameIds: string[];
  notesByGameId: Record<string, string>;
  preferredNotation: NotationMode;
  preferredTheme: BoardThemeId;
  preferredLanguage: LanguageDisplayMode;
}

export const App: React.FC = () => {
  // Estado persistente de preferências e progresso
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

  const [notationMode, setNotationMode] = useState<NotationMode>('alg_pt');
  const [boardTheme, setBoardTheme] = useState<BoardThemeId>('lichess_wood');
  const [languageMode, setLanguageMode] = useState<LanguageDisplayMode>('bilingual');

  // Seleção de Livro -> Capítulo -> Partida
  const [selectedBookId, setSelectedBookId] = useState<string>(PREINSTALLED_BOOKS[0].id);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    PREINSTALLED_BOOKS[0].chapters[0].id
  );
  const [selectedGameId, setSelectedGameId] = useState<string>(
    PREINSTALLED_BOOKS[0].chapters[0].games[0].id
  );

  const [showLibraryModal, setShowLibraryModal] = useState<boolean>(false);

  // Estado do Tabuleiro e Navegação
  const [currentPly, setCurrentPly] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [studyMode, setStudyMode] = useState<AppStudyMode>('study');
  const [engineEnabled, setEngineEnabled] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Estado para Exploração Livre no tabuleiro ("E se eu jogar outro lance?")
  const [customFen, setCustomFen] = useState<string | null>(null);
  const [customHistorySan, setCustomHistorySan] = useState<string[]>([]);
  const [customLastMove, setCustomLastMove] = useState<{ from: string; to: string } | null>(null);

  // Estado para o Modo Adivinhe o Lance (Spoiler-Free)
  const [guessSolvedCurrent, setGuessSolvedCurrent] = useState<boolean>(false);
  const [guessWrongMove, setGuessWrongMove] = useState<string | null>(null);
  const [guessShowHint, setGuessShowHint] = useState<boolean>(false);
  const [guessStats, setGuessStats] = useState<{
    correct: number;
    attempts: number;
    streak: number;
  }>({ correct: 0, attempts: 0, streak: 0 });

  // Livro, Capítulo e Partida ativos
  const currentBook = useMemo(
    () => PREINSTALLED_BOOKS.find((b) => b.id === selectedBookId) || PREINSTALLED_BOOKS[0],
    [selectedBookId]
  );

  const currentChapter = useMemo(
    () =>
      currentBook.chapters.find((c) => c.id === selectedChapterId) || currentBook.chapters[0],
    [currentBook, selectedChapterId]
  );

  const currentGame = useMemo(
    () => currentChapter.games.find((g) => g.id === selectedGameId) || currentChapter.games[0],
    [currentChapter, selectedGameId]
  );

  // Constrói todos os passos validados pelo chess.js
  const { initialFen, steps } = useMemo(() => buildGameSteps(currentGame), [currentGame]);

  // Persiste progresso no localStorage
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

  // Ao trocar de partida, orienta o tabuleiro para o herói do livro e reseta posição
  const selectLessonGame = useCallback(
    (bookId: string, chapterId: string, gameId: string) => {
      const book = PREINSTALLED_BOOKS.find((b) => b.id === bookId) || PREINSTALLED_BOOKS[0];
      const chap = book.chapters.find((c) => c.id === chapterId) || book.chapters[0];
      const gm = chap.games.find((g) => g.id === gameId) || chap.games[0];

      setSelectedBookId(book.id);
      setSelectedChapterId(chap.id);
      setSelectedGameId(gm.id);
      setCurrentPly(0);
      setCustomFen(null);
      setCustomHistorySan([]);
      setCustomLastMove(null);
      setFlipped(gm.heroColor === 'b');
      setGuessSolvedCurrent(false);
      setGuessWrongMove(null);
      setGuessShowHint(false);
      setShowLibraryModal(false);
    },
    []
  );

  // Passo ativo da partida
  const activeStep = useMemo(
    () => (currentPly > 0 && currentPly <= steps.length ? steps[currentPly - 1] : null),
    [currentPly, steps]
  );

  // FEN atualmente exibido no tabuleiro
  const displayedFen = useMemo(() => {
    if (customFen) return customFen;
    return activeStep ? activeStep.fenAfter : initialFen;
  }, [customFen, activeStep, initialFen]);

  // Toca som acústico correspondente a um passo
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

  // Avançar / Voltar lance no Modo Leitura
  const goToPly = useCallback(
    (targetPly: number) => {
      const clamped = Math.max(0, Math.min(steps.length, targetPly));
      setCustomFen(null);
      setCustomHistorySan([]);
      setCustomLastMove(null);
      setCurrentPly(clamped);
      if (clamped > 0) {
        playStepAudio(steps[clamped - 1]);
      }
    },
    [steps, playStepAudio]
  );

  // Iniciar Modo Adivinhe o Lance alinhado com a cor do protagonista da partida
  const startGuessMode = useCallback(() => {
    setStudyMode('guess');
    setEngineEnabled(false); // Desliga engine para não dar spoiler
    setCustomFen(null);
    setCustomHistorySan([]);
    setCustomLastMove(null);
    setFlipped(currentGame.heroColor === 'b');
    setGuessSolvedCurrent(false);
    setGuessWrongMove(null);
    setGuessShowHint(false);

    // Se o protagonista da partida joga de Pretas e estamos no lance 0, o computador faz o 1º lance das Brancas
    if (currentGame.heroColor === 'b' && currentPly === 0 && steps.length > 0) {
      setCurrentPly(1);
      playStepAudio(steps[0]);
    } else if (
      currentPly < steps.length &&
      steps[currentPly].color !== currentGame.heroColor &&
      currentPly + 1 < steps.length
    ) {
      setCurrentPly(currentPly + 1);
    }
  }, [currentGame.heroColor, currentPly, steps, playStepAudio]);

  // Próximo lance alvo no Modo Adivinhe
  const targetGuessStep = useMemo(() => {
    if (studyMode !== 'guess') return null;
    if (guessSolvedCurrent && activeStep) return activeStep;
    return currentPly < steps.length ? steps[currentPly] : null;
  }, [studyMode, guessSolvedCurrent, activeStep, currentPly, steps]);

  // Avança para o próximo desafio do herói no Modo Adivinhe
  const handleNextGuessChallenge = useCallback(() => {
    setGuessSolvedCurrent(false);
    setGuessWrongMove(null);
    setGuessShowHint(false);

    // Se o próximo lance for do adversário, o computador executa automaticamente e para na vez do estudante
    if (currentPly < steps.length) {
      const nextStep = steps[currentPly];
      if (nextStep.color !== currentGame.heroColor) {
        const afterOpponentPly = Math.min(steps.length, currentPly + 1);
        setCurrentPly(afterOpponentPly);
        playStepAudio(nextStep);
      }
    }
  }, [currentPly, steps, currentGame.heroColor, playStepAudio]);

  // Movimentação de peças pelo usuário no tabuleiro (Drag & Drop ou Click-to-Move)
  const handleUserBoardMove = useCallback(
    (from: string, to: string, promotion = 'q'): boolean => {
      const testChess = new Chess(displayedFen);
      let moveRes = null;
      try {
        moveRes = testChess.move({ from, to, promotion });
      } catch {
        return false;
      }
      if (!moveRes) return false;

      // 1. No Modo Adivinhe o Lance
      if (studyMode === 'guess') {
        if (guessSolvedCurrent || !targetGuessStep) return false;

        // Verifica se coincide com o lance do livro
        if (targetGuessStep.from === from && targetGuessStep.to === to) {
          chessAudio.playSuccess();
          setCurrentPly(targetGuessStep.ply);
          setGuessSolvedCurrent(true);
          setGuessWrongMove(null);
          setGuessStats((prev) => ({
            correct: prev.correct + 1,
            attempts: prev.attempts + 1,
            streak: prev.streak + 1,
          }));
          return true;
        } else {
          // Lance legal mas diferente do livro
          chessAudio.playError();
          const triedFormatted = formatMoveByMode(
            {
              san: moveRes.san,
              piece: moveRes.piece,
              from: moveRes.from,
              to: moveRes.to,
              color: moveRes.color,
              captured: moveRes.captured,
            },
            notationMode
          );
          setGuessWrongMove(triedFormatted);
          setGuessStats((prev) => ({
            ...prev,
            attempts: prev.attempts + 1,
            streak: 0,
          }));
          return false;
        }
      }

      // 2. No Modo Leitura: se o usuário fizer exatamente o próximo lance do livro, avança na linha principal!
      if (!customFen && currentPly < steps.length) {
        const nextBookMove = steps[currentPly];
        if (nextBookMove.from === from && nextBookMove.to === to) {
          goToPly(currentPly + 1);
          return true;
        }
      }

      // 3. Caso contrário, entra automaticamente em Exploração Livre no tabuleiro!
      setStudyMode('explore');
      setCustomFen(testChess.fen());
      setCustomLastMove({ from, to });
      setCustomHistorySan((prev) => [...prev, sanToPortugueseAlgebraic(moveRes.san)]);
      if (testChess.inCheck()) chessAudio.playCheck();
      else if (moveRes.captured) chessAudio.playCapture();
      else chessAudio.playMove();
      return true;
    },
    [
      displayedFen,
      studyMode,
      guessSolvedCurrent,
      targetGuessStep,
      notationMode,
      customFen,
      currentPly,
      steps,
      goToPly,
    ]
  );

  // Atalhos de Teclado (←, →, Home, End, X / F para girar o tabuleiro)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'x' || e.key === 'X' || e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }

      if (studyMode === 'guess') return; // No modo Adivinhe, setas ficam bloqueadas para evitar spoiler

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToPly(currentPly + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPly(currentPly - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToPly(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToPly(steps.length);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentPly, steps.length, studyMode, goToPly]);

  // Avaliação Local Stockfish Lite (apenas quando ligada, poupando RAM/CPU no M2)
  const engineEval = useMemo(() => {
    if (!engineEnabled || studyMode === 'guess') return null;
    return analyzePositionLocal(displayedFen, 3);
  }, [engineEnabled, studyMode, displayedFen]);

  // Balanço de material e peças capturadas
  const material = useMemo(() => computeMaterialBalance(displayedFen), [displayedFen]);

  const currentTurn = useMemo(() => {
    try {
      return new Chess(displayedFen).turn();
    } catch {
      return 'w';
    }
  }, [displayedFen]);

  // Pares de lances (1. Brancas / Pretas) para renderizar a planilha no Modo Leitura
  const movePairs = useMemo(() => {
    const pairs: Array<{
      moveNumber: number;
      white?: (typeof steps)[0];
      black?: (typeof steps)[0];
    }> = [];
    for (let i = 0; i < steps.length; i += 2) {
      pairs.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: steps[i],
        black: steps[i + 1],
      });
    }
    return pairs;
  }, [steps]);

  const toggleCompletedGame = (gameId: string) => {
    setCompletedGameIds((prev) =>
      prev.includes(gameId) ? prev.filter((id) => id !== gameId) : [...prev, gameId]
    );
  };

  // Exportar e Importar progresso/notas (.chessmastery.json) para levar a outro Mac
  const handleExportProgress = () => {
    const data = JSON.stringify(
      {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        completedGameIds,
        notesByGameId,
      },
      null,
      2
    );
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chess-mastery-meu-estudo.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
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

  const topPlayer = flipped
    ? {
        name: currentGame.white,
        color: 'w' as const,
        isTurn: currentTurn === 'w',
        captured: material.capturedByWhite,
        advantage: material.whiteAdvantage,
        subtitle: 'Brancas',
      }
    : {
        name: currentGame.black,
        color: 'b' as const,
        isTurn: currentTurn === 'b',
        captured: material.capturedByBlack,
        advantage: material.blackAdvantage,
        subtitle: 'Pretas',
      };

  const bottomPlayer = flipped
    ? {
        name: currentGame.black,
        color: 'b' as const,
        isTurn: currentTurn === 'b',
        captured: material.capturedByBlack,
        advantage: material.blackAdvantage,
        subtitle: 'Pretas',
      }
    : {
        name: currentGame.white,
        color: 'w' as const,
        isTurn: currentTurn === 'w',
        captured: material.capturedByWhite,
        advantage: material.whiteAdvantage,
        subtitle: 'Brancas',
      };

  const lastMoveHighlight = customLastMove
    ? customLastMove
    : activeStep
    ? { from: activeStep.from, to: activeStep.to }
    : null;

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full flex flex-col bg-[#0b0d11] text-zinc-100 overflow-hidden">
      {/* ====================================================================
          BARRA SUPERIOR DE NAVEGAÇÃO E CONTROLES GLOBAIS
         ==================================================================== */}
      <header className="h-14 shrink-0 px-4 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between gap-3 z-30">
        {/* Identidade + Seletor Rápido de Livro */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setShowLibraryModal(true)}
            className="group flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition active:scale-[0.98]"
          >
            <img
              src="/app-icon.png"
              alt="Chess Mastery"
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-400/40 shadow-sm"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-zinc-100 leading-none">Chess Mastery</div>
              <div className="text-[10px] text-emerald-300 font-medium mt-0.5">
                Biblioteca ({PREINSTALLED_BOOKS.length} Livros Clássicos)
              </div>
            </div>
          </button>

          {/* Pílulas dos 4 Livros Pré-Instalados */}
          <div className="hidden xl:flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            {PREINSTALLED_BOOKS.map((book) => {
              const active = book.id === currentBook.id;
              return (
                <button
                  key={book.id}
                  onClick={() =>
                    selectLessonGame(
                      book.id,
                      book.chapters[0].id,
                      book.chapters[0].games[0].id
                    )
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    active
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]'
                  }`}
                >
                  {book.titlePt.split(' (')[0].split(',')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* SELETOR INSTANTÂNEO DE NOTAÇÃO (Descritiva ↔ Algébrica PT ↔ Figurino ↔ SAN) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-white/10">
            {(
              [
                { id: 'alg_pt', label: 'Algébrica PT (Cf3)' },
                { id: 'figurine', label: 'Figurino (♘f3)' },
                { id: 'desc_pt', label: 'Descritiva (C3BR)' },
                { id: 'desc_es', label: 'Descritiva ES (C3AR)' },
                { id: 'alg_en', label: 'SAN (Nf3)' },
              ] as Array<{ id: NotationMode; label: string }>
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setNotationMode(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                  notationMode === opt.id
                    ? 'bg-white/15 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Seletor de Idioma dos Comentários */}
          {currentBook.originalLanguage !== 'pt' && (
            <div className="hidden md:flex items-center bg-zinc-900/90 p-1 rounded-xl border border-white/10">
              <Languages className="w-3.5 h-3.5 text-zinc-400 ml-2 mr-1" />
              {(
                [
                  { id: 'pt', label: 'PT-BR' },
                  { id: 'bilingual', label: 'Bilíngue' },
                  { id: 'original', label: currentBook.originalLanguage.toUpperCase() },
                ] as Array<{ id: LanguageDisplayMode; label: string }>
              ).map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguageMode(lang.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                    languageMode === lang.id
                      ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}

          {/* Modos de Estudo: Leitura vs Modo Adivinhe (Sem Spoilers) */}
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setStudyMode('study');
                setCustomFen(null);
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                studyMode === 'study'
                  ? 'bg-emerald-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Leitura
            </button>

            <button
              onClick={startGuessMode}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                studyMode === 'guess'
                  ? 'bg-amber-400 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-amber-300'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Modo Adivinhe
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          ÁREA PRINCIPAL (SIDEBAR DO LIVRO + TABULEIRO + PAINEL DE ESTUDO)
         ==================================================================== */}
      <main className="flex-1 min-h-0 grid grid-cols-12 gap-4 p-4 max-w-[1680px] w-full mx-auto">
        {/* COLUNA 1 (3 cols): Sumário de Capítulos e Partidas do Livro Ativo */}
        <aside className="col-span-3 flex flex-col min-h-0 rounded-[1.5rem] bg-zinc-900/60 border border-white/[0.08] p-3.5">
          {/* Card do Livro Selecionado */}
          <div
            className={`p-3.5 rounded-2xl bg-gradient-to-br ${currentBook.coverAccent} border border-white/10 mb-3`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-zinc-200">
                {currentBook.badgeText}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {currentBook.publicationYear}
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-100 leading-snug">
              {currentBook.titlePt}
            </h2>
            <p className="text-xs text-zinc-300 mt-0.5">{currentBook.author}</p>
          </div>

          {/* Lista de Capítulos e Partidas Comentadas */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {currentBook.chapters.map((chap) => (
              <div
                key={chap.id}
                className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-2.5 space-y-2"
              >
                <div className="px-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    Capítulo {chap.number}
                  </div>
                  <div className="text-xs font-bold text-zinc-200 leading-snug">
                    {chap.titlePt}
                  </div>
                </div>

                <div className="space-y-1">
                  {chap.games.map((gm) => {
                    const isSelected = gm.id === currentGame.id;
                    const isDone = completedGameIds.includes(gm.id);
                    return (
                      <button
                        key={gm.id}
                        onClick={() => selectLessonGame(currentBook.id, chap.id, gm.id)}
                        className={`w-full text-left p-2.5 rounded-xl border transition flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-zinc-100 shadow-sm'
                            : 'bg-zinc-950/40 border-transparent hover:bg-white/[0.04] text-zinc-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">{gm.titlePt}</div>
                          <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                            {gm.white} vs. {gm.black} ({gm.year})
                          </div>
                        </div>
                        {isDone && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Rodapé de Portabilidade (Exportar/Importar Notas) */}
          <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
            <button
              onClick={handleExportProgress}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-medium text-zinc-300 border border-white/[0.07] transition"
              title="Exportar suas anotações e progresso para usar em outro Mac"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Exportar Estudo
            </button>
            <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-medium text-zinc-300 border border-white/[0.07] transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              Importar
              <input
                type="file"
                accept=".json"
                onChange={handleImportProgress}
                className="hidden"
              />
            </label>
          </div>
        </aside>

        {/* COLUNA 2 (5 cols): Arena do Tabuleiro Lichess / Chess.com */}
        <section className="col-span-5 flex flex-col justify-between min-h-0">
          {/* Banner do Jogador Superior */}
          <PlayerBannerBar
            name={topPlayer.name}
            color={topPlayer.color}
            isTurn={topPlayer.isTurn}
            capturedPieces={topPlayer.captured}
            materialAdvantage={topPlayer.advantage}
            subtitle={`${currentGame.event} (${currentGame.year})`}
          />

          {/* Tabuleiro Central + Barra de Avaliação Vertical */}
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
                moveBadge={
                  !customFen && studyMode !== 'guess'
                    ? activeStep?.annotation?.badge
                    : undefined
                }
                bookArrows={
                  !customFen && studyMode !== 'guess'
                    ? activeStep?.annotation?.arrows
                    : undefined
                }
                bookHighlights={
                  !customFen && studyMode !== 'guess'
                    ? activeStep?.annotation?.highlights
                    : studyMode === 'guess' && guessShowHint && targetGuessStep
                    ? [{ square: targetGuessStep.from, color: 'amber' }]
                    : undefined
                }
                engineArrow={
                  engineEnabled &&
                  studyMode !== 'guess' &&
                  engineEval?.bestMoveFrom &&
                  engineEval?.bestMoveTo
                    ? { from: engineEval.bestMoveFrom, to: engineEval.bestMoveTo }
                    : null
                }
                onUserMove={handleUserBoardMove}
                interactive={true}
              />
            </div>
          </div>

          {/* Banner do Jogador Inferior + Controles estilo Lichess/Chess.com */}
          <div className="space-y-2">
            <PlayerBannerBar
              name={bottomPlayer.name}
              color={bottomPlayer.color}
              isTurn={bottomPlayer.isTurn}
              capturedPieces={bottomPlayer.captured}
              materialAdvantage={bottomPlayer.advantage}
              subtitle={`${currentGame.openingNamePt} · Resultado: ${currentGame.result}`}
            />

            {/* Barra de Controles Táteis do Tabuleiro */}
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-zinc-900/80 border border-white/[0.08]">
              {/* Navegação de Lances */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPly(0)}
                  disabled={studyMode === 'guess' || currentPly === 0}
                  className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-30 text-zinc-200 transition"
                  title="Início da partida (Home)"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToPly(currentPly - 1)}
                  disabled={studyMode === 'guess' || currentPly === 0}
                  className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-30 text-zinc-200 transition"
                  title="Lance anterior (Seta ←)"
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
                  title="Próximo lance (Seta →)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToPly(steps.length)}
                  disabled={studyMode === 'guess' || currentPly >= steps.length}
                  className="p-2 rounded-xl hover:bg-white/10 disabled:opacity-30 text-zinc-200 transition"
                  title="Final da partida (End)"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Girar Tabuleiro (Flip Board - X/F) + Tema + Stockfish + Som */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFlipped((f) => !f)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-zinc-200 border border-white/10 transition active:scale-95"
                  title="Girar o tabuleiro (Atalho: Tecla X ou F)"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                  Girar ({flipped ? 'Pretas' : 'Brancas'})
                </button>

                {/* Seletor de Tema do Tabuleiro */}
                <div className="relative flex items-center">
                  <Palette className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
                  <select
                    value={boardTheme}
                    onChange={(e) => setBoardTheme(e.target.value as BoardThemeId)}
                    className="pl-7 pr-2 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-zinc-200 border border-white/10 focus:outline-none cursor-pointer"
                  >
                    {Object.entries(BOARD_THEMES).map(([id, t]) => (
                      <option key={id} value={id} className="bg-zinc-900 text-zinc-100">
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stockfish Local Toggle */}
                <button
                  onClick={() => setEngineEnabled((v) => !v)}
                  disabled={studyMode === 'guess'}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    engineEnabled && studyMode !== 'guess'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-zinc-200 disabled:opacity-30'
                  }`}
                  title="Ativar/Desativar Motor de Análise Local Stockfish Lite (M2 8GB Friendly)"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  Stockfish
                </button>

                {/* Som Acústico */}
                <button
                  onClick={() => {
                    const next = !soundMuted;
                    setSoundMuted(next);
                    chessAudio.setMuted(next);
                  }}
                  className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-zinc-300 border border-white/10 transition"
                  title={soundMuted ? 'Ativar som de madeira' : 'Silenciar som'}
                >
                  {soundMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* COLUNA 3 (4 cols): Painel de Leitura Comentada OU Modo Adivinhe (Sem Spoilers) */}
        <section className="col-span-4 flex flex-col min-h-0">
          {studyMode === 'guess' ? (
            <GuessTheMovePanel
              game={currentGame}
              targetStep={targetGuessStep}
              currentPly={currentPly}
              totalPlies={steps.length}
              notationMode={notationMode}
              languageMode={languageMode}
              solvedCurrentStep={guessSolvedCurrent}
              wrongMoveTried={guessWrongMove}
              showHint={guessShowHint}
              stats={guessStats}
              onRequestHint={() => setGuessShowHint(true)}
              onRevealAnswer={() => {
                if (targetGuessStep) {
                  setCurrentPly(targetGuessStep.ply);
                  setGuessSolvedCurrent(true);
                }
              }}
              onNextChallenge={handleNextGuessChallenge}
              onResetGuessSession={() => {
                setCurrentPly(0);
                setGuessSolvedCurrent(false);
                setGuessWrongMove(null);
                setGuessShowHint(false);
                setGuessStats({ correct: 0, attempts: 0, streak: 0 });
                if (currentGame.heroColor === 'b' && steps.length > 0) {
                  setCurrentPly(1);
                }
              }}
              onExitGuessMode={() => setStudyMode('study')}
            />
          ) : (
            <div className="flex flex-col h-full min-h-0 rounded-[1.5rem] bg-zinc-900/70 border border-white/[0.08] p-4 space-y-3.5 overflow-hidden">
              {/* Banner de Exploração Livre quando o usuário mexeu peças fora da linha do livro */}
              {customFen && (
                <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-500/35 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                    <div className="text-xs text-sky-100 truncate">
                      <strong>Exploração Livre:</strong> {customHistorySan.join(' ')}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCustomFen(null);
                      setCustomHistorySan([]);
                      setCustomLastMove(null);
                      setStudyMode('study');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500 text-zinc-950 text-xs font-bold shrink-0 hover:bg-sky-400 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Voltar ao Livro
                  </button>
                </div>
              )}

              {/* Painel de Análise Stockfish Local (quando ativado) */}
              {engineEnabled && engineEval && (
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-sky-500/30 space-y-1.5 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-400">
                      <Cpu className="w-3.5 h-3.5" />
                      Stockfish Local Lite (M2 8GB · Depth {engineEval.depth})
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-300">
                      {engineEval.mateIn !== null
                        ? `Mate em ${Math.abs(engineEval.mateIn)}`
                        : `${engineEval.scoreCp > 0 ? '+' : ''}${(
                            engineEval.scoreCp / 100
                          ).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-300 flex items-center gap-2">
                    <span>
                      Melhor lance sugerido:{' '}
                      <strong className="font-mono text-emerald-300">
                        {sanToPortugueseAlgebraic(engineEval.bestMoveSan)}
                      </strong>
                    </span>
                    <span className="text-zinc-500">·</span>
                    <span className="font-mono text-[11px] text-zinc-400 truncate">
                      Linha: {engineEval.pvLineSan.map(sanToPortugueseAlgebraic).join(' ')}
                    </span>
                  </div>
                </div>
              )}

              {/* CARD DE COMENTÁRIO DO LANCE ATUAL + FAIXA ROSETTA DE NOTAÇÕES */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-emerald-950/20 border border-white/10 space-y-3 shrink-0">
                {activeStep ? (
                  <>
                    {/* Faixa Rosetta: mostra o lance atual em todas as notações simultaneamente */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/[0.07]">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 font-mono text-sm font-bold text-emerald-300">
                          {activeStep.moveNumber}
                          {activeStep.color === 'w' ? '. ' : '... '}
                          {formatMoveByMode(activeStep, notationMode)}
                        </span>
                        {activeStep.annotation?.badge && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Lance {activeStep.annotation.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                        <span className="px-2 py-0.5 rounded bg-white/[0.04]" title="Notação Algébrica em Português">
                          PT: <strong className="text-zinc-200">{sanToPortugueseAlgebraic(activeStep.san)}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/[0.04]" title="Notação Descritiva Clássica (Xadrez Básico)">
                          Desc: <strong className="text-amber-300">{activeStep.descriptivePt}</strong>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/[0.04]" title="Figurino">
                          {sanToFigurine(activeStep.san, activeStep.color)}
                        </span>
                      </div>
                    </div>

                    {/* Comentário do Autor (Traduzido em Português e/ou Original) */}
                    {activeStep.annotation ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {(languageMode === 'pt' || languageMode === 'bilingual') && (
                          <p className="text-sm text-zinc-100 leading-relaxed">
                            {activeStep.annotation.commentPt}
                          </p>
                        )}
                        {(languageMode === 'original' || languageMode === 'bilingual') &&
                          activeStep.annotation.commentOriginal && (
                            <p className="text-xs text-zinc-400 italic border-t border-white/[0.06] pt-2 leading-relaxed">
                              Original ({currentBook.originalLanguage.toUpperCase()}): “
                              {activeStep.annotation.commentOriginal}”
                            </p>
                          )}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400">
                        Continue avançando com a seta <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">→</kbd> ou clique nos lances comentados (destacados em verde) na planilha abaixo.
                      </p>
                    )}
                  </>
                ) : (
                  /* Introdução da Partida quando currentPly === 0 */
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        Introdução do Livro
                      </span>
                      <button
                        onClick={() => toggleCompletedGame(currentGame.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                          completedGameIds.includes(currentGame.id)
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-white/[0.04] text-zinc-400 border-white/10 hover:text-zinc-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {completedGameIds.includes(currentGame.id)
                          ? 'Estudada'
                          : 'Marcar Concluída'}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-200 leading-relaxed">
                      {currentGame.introPt}
                    </p>
                    {languageMode !== 'pt' && currentGame.introOriginal && (
                      <p className="text-[11px] text-zinc-400 italic border-t border-white/[0.06] pt-1.5">
                        Original: “{currentGame.introOriginal}”
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* PLANILHA INTERATIVA DE LANCES E COMENTÁRIOS (Estilo Lichess Study) */}
              <div className="flex-1 min-h-0 flex flex-col rounded-2xl bg-zinc-950/60 border border-white/[0.06] overflow-hidden">
                <div className="px-3.5 py-2 border-b border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-300">
                    Planilha Sincronizada ({notationMode === 'desc_pt' ? 'Notação Descritiva PT' : notationMode === 'alg_pt' ? 'Algébrica PT' : notationMode.toUpperCase()})
                  </span>
                  <span>Clique em qualquer lance para ir à posição</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
                  {movePairs.map((pair) => {
                    const w = pair.white;
                    const b = pair.black;
                    const wActive = w && currentPly === w.ply;
                    const bActive = b && currentPly === b.ply;

                    return (
                      <React.Fragment key={pair.moveNumber}>
                        <div className="grid grid-cols-12 items-center text-xs font-mono rounded-lg hover:bg-white/[0.02]">
                          <span className="col-span-2 px-2 py-1 text-zinc-500 select-none">
                            {pair.moveNumber}.
                          </span>

                          {w && (
                            <button
                              onClick={() => goToPly(w.ply)}
                              className={`col-span-5 text-left px-2.5 py-1 rounded-lg transition flex items-center justify-between ${
                                wActive
                                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                                  : w.annotation
                                  ? 'text-emerald-300 font-semibold hover:bg-emerald-500/10'
                                  : 'text-zinc-200 hover:bg-white/[0.06]'
                              }`}
                            >
                              <span>{formatMoveByMode(w, notationMode)}</span>
                              {w.annotation && !wActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              )}
                            </button>
                          )}

                          {b ? (
                            <button
                              onClick={() => goToPly(b.ply)}
                              className={`col-span-5 text-left px-2.5 py-1 rounded-lg transition flex items-center justify-between ${
                                bActive
                                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                                  : b.annotation
                                  ? 'text-emerald-300 font-semibold hover:bg-emerald-500/10'
                                  : 'text-zinc-300 hover:bg-white/[0.06]'
                              }`}
                            >
                              <span>{formatMoveByMode(b, notationMode)}</span>
                              {b.annotation && !bActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              )}
                            </button>
                          ) : (
                            <span className="col-span-5" />
                          )}
                        </div>

                        {/* Resumo inline de comentário do livro na planilha */}
                        {(w?.annotation || b?.annotation) && (
                          <div className="pl-6 pr-2 py-1 space-y-1">
                            {w?.annotation && (
                              <div
                                onClick={() => goToPly(w.ply)}
                                className="text-[11px] text-zinc-400 bg-white/[0.02] hover:bg-white/[0.05] border-l-2 border-emerald-500/50 pl-2.5 py-1 rounded-r cursor-pointer transition line-clamp-2"
                              >
                                <strong className="text-emerald-300 font-mono mr-1">
                                  {pair.moveNumber}. {formatMoveByMode(w, notationMode)}:
                                </strong>
                                {w.annotation.commentPt}
                              </div>
                            )}
                            {b?.annotation && (
                              <div
                                onClick={() => goToPly(b.ply)}
                                className="text-[11px] text-zinc-400 bg-white/[0.02] hover:bg-white/[0.05] border-l-2 border-amber-500/50 pl-2.5 py-1 rounded-r cursor-pointer transition line-clamp-2"
                              >
                                <strong className="text-amber-300 font-mono mr-1">
                                  {pair.moveNumber}... {formatMoveByMode(b, notationMode)}:
                                </strong>
                                {b.annotation.commentPt}
                              </div>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Caderno Pessoal do Estudante para esta Partida */}
              <div className="shrink-0 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-300">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    Suas Anotações de Estudo nesta Partida
                  </span>
                  <span className="text-[10px] text-zinc-500">Salvo automaticamente</span>
                </div>
                <textarea
                  rows={2}
                  value={notesByGameId[currentGame.id] || ''}
                  onChange={(e) =>
                    setNotesByGameId((prev) => ({
                      ...prev,
                      [currentGame.id]: e.target.value,
                    }))
                  }
                  placeholder="Escreva suas conclusões pessoais sobre esta partida..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/90 border border-white/10 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ====================================================================
          MODAL DA BIBLIOTECA COMPLETA DOS 4 LIVROS PRÉ-INSTALADOS
         ==================================================================== */}
      {showLibraryModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setShowLibraryModal(false)}
        >
          <div
            className="max-w-5xl w-full max-h-[86vh] flex flex-col rounded-[2rem] bg-zinc-900 border border-white/15 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400">
                  Biblioteca Integrada · Pré-Instalada e Traduzida
                </span>
                <h2 className="text-xl font-bold text-zinc-100 mt-0.5">
                  Escolha um Livro Clássico para Estudar
                </h2>
              </div>
              <button
                onClick={() => setShowLibraryModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-zinc-200"
              >
                Fechar
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {PREINSTALLED_BOOKS.map((book) => {
                const totalGames = book.chapters.reduce((acc, c) => acc + c.games.length, 0);
                return (
                  <div
                    key={book.id}
                    className={`p-5 rounded-2xl bg-gradient-to-br ${book.coverAccent} border border-white/10 flex flex-col justify-between space-y-4`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-emerald-300">
                          {book.badgeText}
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {book.chapters.length} capítulos · {totalGames} lições
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-zinc-100">{book.titlePt}</h3>
                      <p className="text-xs font-medium text-zinc-300">{book.author}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {book.descriptionPt}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      {book.chapters.map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() =>
                            selectLessonGame(book.id, ch.id, ch.games[0].id)
                          }
                          className="w-full text-left px-3 py-2 rounded-xl bg-black/30 hover:bg-emerald-500/20 border border-white/[0.06] hover:border-emerald-500/40 transition flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-zinc-200 truncate">
                            Cap. {ch.number}: {ch.titlePt}
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 shrink-0 ml-2">
                            Estudar →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
