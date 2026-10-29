import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
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
import {
  InteractiveChessboard,
  BOARD_THEMES,
} from '@/components/InteractiveChessboard';
import { VerticalEvaluationBar } from '@/components/BoardSideComponents';
import { InteractiveBookReader } from '@/components/InteractiveBookReader';
import { NotebookStudyModal } from '@/components/NotebookStudyModal';
import type {
  BoardThemeId,
  BookLessonGame,
  NotationMode,
  StudySourceType,
  NavDestination,
  StudyPhaseId,
} from '@/types/chess';

const STORAGE_KEY = 'chess_mastery_progress_v3';

export const App: React.FC = () => {
  // 4 Telas Principais do Google Stitch: 'learn' | 'library' | 'openings' | 'achievements'
  const [navDest, setNavDest] = useState<NavDestination>('learn');
  const [currentStudyType, setCurrentStudyType] = useState<StudySourceType>('book_game');

  // Sub-aba da coluna direita no Estúdio Aprender & Ler:
  // 'book_reader' (Leitura Corrida com Lances Clicáveis nos Parágrafos)
  // 'mentors' (Os 3 Mentores do Stitch: Coruja Sofia, Livro Mágico e Robô Pipo)
  // 'movesheet' (Planilha Completa de Lances estilo Chess.com)
  const [rightPanelTab, setRightPanelTab] = useState<'book_reader' | 'mentors' | 'movesheet'>(
    'book_reader'
  );

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState<boolean>(false);

  // Livros e Capítulos Completos
  const [selectedBookId, setSelectedBookId] = useState<string>(PREINSTALLED_BOOKS[0].id);
  const [selectedGameId, setSelectedGameId] = useState<string>(
    PREINSTALLED_BOOKS[0].chapters[0].games[0].id
  );

  // Estudos Importados via Google NotebookLM / Internet
  const [customStudies, setCustomStudies] = useState<BookLessonGame[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.customStudies)) return parsed.customStudies;
      }
    } catch {}
    return [];
  });
  const [selectedCustomStudyId, setSelectedCustomStudyId] = useState<string | null>(null);

  // Aberturas, Meio-Jogo & Finais
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<
    'all' | 'openings' | 'middlegame' | 'endgame' | 'notebooklm'
  >('all');
  const [selectedOpeningCat, setSelectedOpeningCat] = useState<string>('all');
  const [selectedOpeningId, setSelectedOpeningId] = useState<string>(CHESS_OPENINGS[0].id);

  // Treinador Interativo e Dicas da Coruja Sofia (3 níveis)
  const [trainerColor, setTrainerColor] = useState<TrainerColorMode>('w');
  const [trainerActive, setTrainerActive] = useState<boolean>(false);
  const [hintLevel, setHintLevel] = useState<0 | 1 | 2 | 3>(0);
  const [lastFeedback, setLastFeedback] = useState<EvaluatedUserMove | null>(null);

  // Progresso Gamificado (Estrelas Mágicas ⭐ e Fila de Revisão)
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

  // Preferências de Notação, Tema de Tabuleiro e Áudio
  const [notationMode, setNotationMode] = useState<NotationMode>('alg_pt');
  const [boardTheme, setBoardTheme] = useState<BoardThemeId>('stitch_wood');
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  // Estado do Tabuleiro e Variante Clicada no Parágrafo / Exploração Livre
  const [currentPly, setCurrentPly] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [customFen, setCustomFen] = useState<string | null>(null);
  const [customLastMove, setCustomLastMove] = useState<{ from: string; to: string } | null>(null);
  const [customVariationLabel, setCustomVariationLabel] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedGameIds,
          reviewQueue,
          customStudies,
          preferredNotation: notationMode,
        })
      );
    } catch {}
  }, [completedGameIds, reviewQueue, customStudies, notationMode]);

  useEffect(() => {
    chessAudio.setMuted(soundMuted);
  }, [soundMuted]);

  // Lista plana de todos os capítulos e partidas de todos os livros para navegação contínua
  const allBookEntries = useMemo(() => {
    const list: Array<{
      book: (typeof PREINSTALLED_BOOKS)[0];
      chapter: (typeof PREINSTALLED_BOOKS)[0]['chapters'][0];
      game: BookLessonGame;
    }> = [];
    for (const book of PREINSTALLED_BOOKS) {
      for (const ch of book.chapters) {
        for (const g of ch.games) {
          list.push({ book, chapter: ch, game: g });
        }
      }
    }
    return list;
  }, []);

  const currentChapterAndGame = useMemo(() => {
    const found = allBookEntries.find((item) => item.game.id === selectedGameId);
    return found || allBookEntries[0];
  }, [allBookEntries, selectedGameId]);

  const nextBookEntry = useMemo(() => {
    const idx = allBookEntries.findIndex((item) => item.game.id === selectedGameId);
    if (idx >= 0 && idx + 1 < allBookEntries.length) {
      return allBookEntries[idx + 1];
    }
    return null;
  }, [allBookEntries, selectedGameId]);

  const currentOpening = useMemo(
    () => CHESS_OPENINGS.find((o) => o.id === selectedOpeningId) || CHESS_OPENINGS[0],
    [selectedOpeningId]
  );

  const currentCustomStudy = useMemo(
    () => customStudies.find((s) => s.id === selectedCustomStudyId) || customStudies[0] || null,
    [customStudies, selectedCustomStudyId]
  );

  // Jogo ativo convertido para o formato unificado BookLessonGame (para que tanto Livros, Aberturas quanto Estudos NotebookLM funcionem no Leitor Interativo!)
  const activeUnifiedGame: BookLessonGame = useMemo(() => {
    if (currentStudyType === 'custom_study' && currentCustomStudy) {
      return currentCustomStudy;
    }
    if (currentStudyType === 'opening') {
      return {
        id: currentOpening.id,
        titlePt: currentOpening.namePt,
        white: 'Brancas (Teoria)',
        black: 'Pretas (Teoria)',
        event: `${currentOpening.eco} • ${currentOpening.nameOriginal}`,
        year: 'Repertório Clássico',
        result: '1/2-1/2',
        eco: currentOpening.eco,
        openingNamePt: currentOpening.namePt,
        studyPhase: 'openings',
        heroColor: currentOpening.recommendedFor === 'black' ? 'b' : 'w',
        introPt: currentOpening.summaryPt,
        readingSectionsPt: [
          {
            headingPt: 'Planos Estratégicos das Brancas e Pretas',
            bodyPt: `Estrutura de peões característica: ${currentOpening.pawnStructurePt}. Plano das Brancas: ${currentOpening.whitePlansPt.join(
              ' '
            )} Plano das Pretas: ${currentOpening.blackPlansPt.join(' ')}`,
            focusPly: 1,
          },
        ],
        keyTakeawaysPt: [
          ...currentOpening.whitePlansPt.slice(0, 2),
          ...currentOpening.blackPlansPt.slice(0, 2),
        ],
        movesSan: currentOpening.movesSan,
        annotations: currentOpening.annotations as any,
      };
    }
    return currentChapterAndGame.game;
  }, [currentStudyType, currentCustomStudy, currentOpening, currentChapterAndGame]);

  const { initialFen, steps } = useMemo(() => {
    return buildGameSteps(activeUnifiedGame);
  }, [activeUnifiedGame]);

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
      studyType: currentStudyType === 'opening' ? 'opening' : 'book_game',
      book: currentChapterAndGame.book,
      chapter: currentChapterAndGame.chapter,
      game: activeUnifiedGame,
      opening: currentOpening,
      ply: currentPly,
    });
  }, [currentStudyType, currentChapterAndGame, activeUnifiedGame, currentOpening, currentPly]);

  // Toca som acústico de peça ao navegar para um lance
  const playStepAudio = useCallback((step: (typeof steps)[0] | null) => {
    if (!step) return;
    if (step.inCheck || step.isCheckmate) {
      chessAudio.playCheck();
    } else if (step.isCastling) {
      chessAudio.playCastle();
    } else if (step.captured) {
      chessAudio.playCapture();
    } else {
      chessAudio.playMove();
    }
  }, []);

  const goToPly = useCallback(
    (targetPly: number) => {
      const clamped = Math.max(0, Math.min(steps.length, targetPly));
      setCustomFen(null);
      setCustomLastMove(null);
      setCustomVariationLabel(null);
      setHintLevel(0);
      setLastFeedback(null);
      setCurrentPly(clamped);
      if (clamped > 0 && steps[clamped - 1]) {
        playStepAudio(steps[clamped - 1]);
      }
    },
    [steps, playStepAudio]
  );

  // Atalhos de Teclado Padrão Chess.com (←, →, ↑, ↓, F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (navDest !== 'learn') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToPly(currentPly + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPly(currentPly - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPly(0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToPly(steps.length);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setFlipped((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navDest, currentPly, steps.length, goToPly]);

  // Auto-avança o lance do oponente quando o Modo Desafio está ativo
  useEffect(() => {
    if (!trainerActive || customFen || !nextExpectedStep) return;
    if (trainerColor === 'both') return;
    if (nextExpectedStep.color !== trainerColor) {
      const timer = setTimeout(() => {
        goToPly(currentPly + 1);
      }, 360);
      return () => clearTimeout(timer);
    }
  }, [trainerActive, customFen, nextExpectedStep, trainerColor, currentPly, goToPly]);

  const handleSelectBookGame = (
    bookId: string,
    gameId: string,
    mode: 'read' | 'challenge' = 'read'
  ) => {
    setSelectedBookId(bookId);
    setSelectedGameId(gameId);
    setCurrentStudyType('book_game');
    setNavDest('learn');
    setRightPanelTab(mode === 'challenge' ? 'mentors' : 'book_reader');
    setTrainerActive(mode === 'challenge');
    setCurrentPly(0);
    setCustomFen(null);
    setCustomLastMove(null);
    setCustomVariationLabel(null);
    setHintLevel(0);
    setLastFeedback(null);
  };

  const handleSelectOpening = (opening: ChessOpeningStudy, startTrainer = false) => {
    setSelectedOpeningId(opening.id);
    setCurrentStudyType('opening');
    setNavDest('learn');
    setRightPanelTab(startTrainer ? 'mentors' : 'book_reader');
    setTrainerActive(startTrainer);
    setCurrentPly(0);
    setCustomFen(null);
    setCustomLastMove(null);
    setCustomVariationLabel(null);
    setHintLevel(0);
    setLastFeedback(null);
    const recColor = opening.recommendedFor === 'black' ? 'b' : 'w';
    setTrainerColor(recColor);
    setFlipped(recColor === 'b');
  };

  const handleSelectCustomStudy = (study: BookLessonGame) => {
    setSelectedCustomStudyId(study.id);
    setCurrentStudyType('custom_study');
    setNavDest('learn');
    setRightPanelTab('book_reader');
    setTrainerActive(false);
    setCurrentPly(0);
    setCustomFen(null);
    setCustomLastMove(null);
    setCustomVariationLabel(null);
    setHintLevel(0);
    setLastFeedback(null);
    setFlipped(study.heroColor === 'b');
  };

  // Quando o usuário clica em um lance de variante dentro do parágrafo do livro
  const handleSelectVariationFromParagraph = (payload: {
    fen: string;
    from: string;
    to: string;
    san: string;
    label: string;
    contextPly: number;
  }) => {
    setCurrentPly(payload.contextPly);
    setCustomFen(payload.fen);
    setCustomLastMove({ from: payload.from, to: payload.to });
    setCustomVariationLabel(payload.label);
    chessAudio.playMove();
  };

  // Quando o usuário move peças diretamente no tabuleiro estilo Chess.com
  const handleUserMoveOnBoard = (from: string, to: string, promotion = 'q'): boolean => {
    if (trainerActive && nextExpectedStep && !customFen) {
      const result = evaluateUserMove({
        ChessCtor: Chess,
        fen: activeFen,
        from,
        to,
        promotion,
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
          const itemId = `${activeUnifiedGame.id}_ply_${currentPly}`;
          if (prev.some((i) => i.id === itemId)) return prev;
          return [
            ...prev,
            {
              id: itemId,
              studyType: currentStudyType === 'opening' ? 'opening' : 'book_game',
              targetId: activeUnifiedGame.id,
              titlePt: activeUnifiedGame.titlePt,
              ply: currentPly,
              expectedSan: nextExpectedStep.san,
              reasonPt: `Jogou ${result.playedSanPt} em vez do lance do mestre ${result.expectedSanPt}`,
              addedAt: new Date().toISOString(),
            },
          ];
        });
        return false;
      }
    }

    // Modo Leitura / Análise Livre ("E se eu jogar isso aqui no meio da leitura?")
    try {
      const chess = new Chess(activeFen);
      const played = chess.move({ from, to, promotion: promotion || 'q' });
      if (!played) return false;

      // Se o lance jogado no tabuleiro for exatamente o próximo lance do livro, avança o livro!
      if (!customFen && nextExpectedStep && played.san === nextExpectedStep.san) {
        goToPly(currentPly + 1);
        return true;
      }

      // Caso contrário, entra em Exploração Livre em Tempo Real estilo Chess.com
      setCustomFen(chess.fen());
      setCustomLastMove({ from: played.from, to: played.to });
      setCustomVariationLabel(sanToPortugueseAlgebraic(played.san));
      if (chess.inCheck()) {
        chessAudio.playCheck();
      } else if (played.captured) {
        chessAudio.playCapture();
      } else {
        chessAudio.playMove();
      }
      return true;
    } catch {
      return false;
    }
  };

  // Leitura em Voz Alta (Síntese de Voz PT-BR para o botão "Ouvir Voz" do Stitch)
  const handleSpeakCurrentExplanation = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      chessAudio.playSuccess();
      return;
    }
    window.speechSynthesis.cancel();
    const textToRead =
      currentStep?.annotation?.commentPt ||
      activeUnifiedGame.introPt ||
      'Avance os lances ou clique nos movimentos do parágrafo para ouvir a explicação.';
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.02;
    window.speechSynthesis.speak(utterance);
  };

  const handleMarkCompleted = () => {
    const id = activeUnifiedGame.id;
    if (!completedGameIds.includes(id)) {
      setCompletedGameIds((prev) => [...prev, id]);
    }
    chessAudio.playSuccess();
  };

  // Cálculo de Estrelas Mágicas (3 estrelas por capítulo/abertura concluída + base inicial)
  const totalMagicStars = useMemo(() => {
    return 12 + completedGameIds.length * 3;
  }, [completedGameIds]);

  const progressPercentage = useMemo(() => {
    if (steps.length === 0) return 0;
    return Math.round((currentPly / steps.length) * 100);
  }, [currentPly, steps.length]);

  const activeTurnColor = useMemo(() => {
    try {
      return new Chess(activeFen).turn();
    } catch {
      return 'w';
    }
  }, [activeFen]);

  // Estudos de Meio-Jogo e Finais extraídos dos livros para a aba Aberturas & Estudos
  const bookMiddlegameAndEndgameStudies = useMemo(() => {
    return allBookEntries.filter(
      (entry) =>
        entry.game.studyPhase === 'middlegame' ||
        entry.game.studyPhase === 'endgame' ||
        entry.game.initialFen
    );
  }, [allBookEntries]);

  return (
    <div className="min-h-screen w-full bg-[#FFF9ED] text-[#0d1c2e] flex flex-col selection:bg-[#16865E]/20">
      {/* =====================================================================
          CABEÇALHO PRINCIPAL — PLAYFUL CHESS STUDIO (GOOGLE STITCH)
         ===================================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[#FFF9ED]/95 backdrop-blur-md border-b border-[#E6DEC8] shadow-[0_4px_20px_rgba(181,138,101,0.08)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
          {/* Marca & Identidade */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-[#16865E] text-white flex items-center justify-center text-2xl shadow-[0_4px_12px_rgba(22,134,94,0.28)]">
              ♞
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-extrabold text-[#006b49] tracking-tight leading-tight">
                Chess Mastery
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[11px] font-extrabold text-[#3e4942] uppercase tracking-wider">
                  Estúdio Lúdico & Livro Vivo
                </span>
              </div>
            </div>
          </div>

          {/* Navegação das 4 Telas do Google Stitch */}
          <nav className="flex items-center bg-white p-1.5 rounded-2xl border border-[#E6DEC8] shadow-[0_2px_10px_rgba(181,138,101,0.06)] overflow-x-auto">
            {(
              [
                { id: 'learn', label: 'Aprender & Ler', icon: '♟️' },
                { id: 'library', label: 'Biblioteca Mágica', icon: '📚' },
                { id: 'openings', label: 'Aberturas & Estudos', icon: '🧭' },
                { id: 'achievements', label: 'Conquistas & Estrelas', icon: '🏆' },
              ] as const
            ).map((tab) => {
              const isActive = navDest === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setNavDest(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-[13.5px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#16865E] text-white shadow-xs'
                      : 'text-[#3e4942] hover:bg-[#FFF9ED] hover:text-[#0d1c2e]'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Ações Rápidas: Importar NotebookLM, Notação, Estrelas e Som */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsNotebookModalOpen(true)}
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0059c0] border border-[#BFDBFE] text-[12px] font-extrabold cursor-pointer transition-all shadow-2xs"
              title="Importar estudos de Abertura, Meio-Jogo ou Final do Google NotebookLM"
            >
              <span>📓</span>
              <span>+ NotebookLM</span>
            </button>

            {/* Seletor de Notação Sincronizado com os Parágrafos */}
            <select
              aria-label="Modo de Notação"
              value={notationMode}
              onChange={(e) => setNotationMode(e.target.value as NotationMode)}
              className="h-9 px-3 rounded-full bg-white border border-[#E6DEC8] text-[12px] font-extrabold text-[#0d1c2e] cursor-pointer focus:outline-none focus:border-[#16865E]"
            >
              <option value="alg_pt">Notação: Algébrica PT (Cf3)</option>
              <option value="figurine">Notação: Figurinos (♘f3)</option>
              <option value="desc_pt">Notação: Descritiva (C3BR / P4R)</option>
              <option value="alg_en">Notação: Internacional (Nf3)</option>
            </select>

            {/* Contador de Estrelas Mágicas */}
            <button
              type="button"
              onClick={() => setNavDest('achievements')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FEF3C7] border border-[#F59E0B]/40 text-[#684000] rounded-full text-[13px] font-extrabold shadow-2xs cursor-pointer hover:scale-105 transition-transform"
              title="Ver suas Estrelas Mágicas e Sala de Troféus"
            >
              <span>{totalMagicStars}</span>
              <span>⭐</span>
            </button>

            {/* Botão de Som */}
            <button
              type="button"
              onClick={() => setSoundMuted((m) => !m)}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                soundMuted
                  ? 'bg-[#FEE2E2] border-[#F87171] text-[#93000a]'
                  : 'bg-white border-[#E6DEC8] text-[#006b49] hover:bg-[#E2F6EA]'
              }`}
              title={soundMuted ? 'Ativar sons de madeira' : 'Silenciar sons'}
            >
              {soundMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          CONTEÚDO PRINCIPAL (4 TELAS DO STITCH)
         ===================================================================== */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-5">
        {/* ===================================================================
            TELA 1: ESTÚDIO APRENDER & LER (TABULEIRO CHESS.COM + LIVRO VIVO)
           =================================================================== */}
        {navDest === 'learn' && (
          <div className="space-y-5 animate-fadeIn">
            {/* Banner Contextual Superior da Lição / Livro */}
            <section className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-[#E6DEC8] shadow-[0_6px_24px_rgba(181,138,101,0.08)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold text-[#3e4942]">
                  <button
                    type="button"
                    onClick={() =>
                      setNavDest(currentStudyType === 'opening' ? 'openings' : 'library')
                    }
                    className="inline-flex items-center gap-1 text-[#006b49] hover:underline font-extrabold cursor-pointer"
                  >
                    <span>📚</span>
                    <span>
                      {currentStudyType === 'opening'
                        ? `Repertório de Aberturas (${currentOpening.eco})`
                        : currentStudyType === 'custom_study'
                        ? 'Caderno Google NotebookLM'
                        : `${currentChapterAndGame.book.titlePt} • Cap. ${currentChapterAndGame.chapter.number}`}
                    </span>
                  </button>
                  <span>•</span>
                  <span>
                    {activeUnifiedGame.white} vs. {activeUnifiedGame.black}
                  </span>
                  <span>•</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E6EEFF] text-[#004395] font-extrabold text-[11px]">
                    Lance {currentPly} de {steps.length}
                  </span>
                </div>

                <h1 className="text-[20px] sm:text-[24px] font-extrabold text-[#0d1c2e] tracking-tight leading-snug">
                  {activeUnifiedGame.titlePt}
                </h1>

                {/* Seletor Rápido de Capítulo / Partida sem sair do Estúdio */}
                {currentStudyType === 'book_game' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <select
                      aria-label="Selecionar Livro"
                      value={currentChapterAndGame.book.id}
                      onChange={(e) => {
                        const bk = PREINSTALLED_BOOKS.find((b) => b.id === e.target.value);
                        if (bk && bk.chapters[0]?.games[0]) {
                          handleSelectBookGame(bk.id, bk.chapters[0].games[0].id, 'read');
                        }
                      }}
                      className="px-3 py-1 rounded-xl bg-[#FFF9ED] border border-[#E6DEC8] text-[12px] font-extrabold text-[#006b49] cursor-pointer"
                    >
                      {PREINSTALLED_BOOKS.map((b) => (
                        <option key={b.id} value={b.id}>
                          📖 {b.titlePt} ({b.chapters.length} caps)
                        </option>
                      ))}
                    </select>

                    <select
                      aria-label="Selecionar Capítulo e Partida"
                      value={selectedGameId}
                      onChange={(e) =>
                        handleSelectBookGame(currentChapterAndGame.book.id, e.target.value, 'read')
                      }
                      className="px-3 py-1 rounded-xl bg-[#FFF9ED] border border-[#E6DEC8] text-[12px] font-bold text-[#0d1c2e] cursor-pointer max-w-md truncate"
                    >
                      {currentChapterAndGame.book.chapters.map((ch) => (
                        <optgroup
                          key={ch.id}
                          label={`Capítulo ${ch.number}: ${ch.titlePt}`}
                        >
                          {ch.games.map((gm) => (
                            <option key={gm.id} value={gm.id}>
                              {gm.titlePt}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Alternadores de Modo: Leitura Interativa vs. Modo Desafio */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <div className="flex items-center bg-[#FBF8F1] p-1 rounded-full border border-[#E6DEC8]">
                  <button
                    type="button"
                    onClick={() => {
                      setTrainerActive(false);
                      setRightPanelTab('book_reader');
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                      !trainerActive
                        ? 'bg-[#16865E] text-white shadow-xs'
                        : 'text-[#3e4942] hover:text-[#0d1c2e]'
                    }`}
                  >
                    <span>📖</span>
                    <span>Leitura Livre & Análise</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrainerActive(true);
                      setRightPanelTab('mentors');
                      setCustomFen(null);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                      trainerActive
                        ? 'bg-[#F59E0B] text-[#2a1700] shadow-xs'
                        : 'text-[#3e4942] hover:text-[#0d1c2e]'
                    }`}
                  >
                    <span>🎯</span>
                    <span>Desafio: Adivinhe o Lance</span>
                  </button>
                </div>

                {/* Tema Visual do Tabuleiro */}
                <select
                  aria-label="Tema do Tabuleiro"
                  value={boardTheme}
                  onChange={(e) => setBoardTheme(e.target.value as BoardThemeId)}
                  className="px-3 py-2 rounded-full bg-white border border-[#E6DEC8] text-[12px] font-bold text-[#3e4942] cursor-pointer"
                >
                  {(Object.keys(BOARD_THEMES) as BoardThemeId[]).map((tKey) => (
                    <option key={tKey} value={tKey}>
                      🎨 {BOARD_THEMES[tKey].name}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* PALCO PRINCIPAL DE 12 COLUNAS (7 COLUNAS TABULEIRO + 5 COLUNAS LEITOR/MENTORES) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* COLUNA ESQUERDA (7 COLUNAS): TABULEIRO INTERATIVO PADRÃO CHESS.COM */}
              <section className="lg:col-span-7 flex flex-col gap-4">
                {/* Barra de Status do Turno e Último Lance */}
                <div className="w-full bg-white rounded-2xl p-3.5 px-4 border border-[#E6DEC8] shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-extrabold shadow-inner ${
                        activeTurnColor === 'w'
                          ? 'bg-[#FEF3C7] text-[#855300]'
                          : 'bg-[#233144] text-white'
                      }`}
                    >
                      {activeTurnColor === 'w' ? '⚪' : '⚫'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-extrabold text-[#0d1c2e]">
                          {customFen
                            ? `Explorando Variante no Tabuleiro (${
                                activeTurnColor === 'w' ? 'Vez das Brancas' : 'Vez das Pretas'
                              })`
                            : trainerActive
                            ? `Desafio Ativo: Descubra o lance das ${
                                activeTurnColor === 'w' ? 'Brancas ⚪' : 'Pretas ⚫'
                              }!`
                            : `Vez de jogar: ${
                                activeTurnColor === 'w' ? 'Brancas ⚪' : 'Pretas ⚫'
                              }`}
                        </span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#16865E] animate-pulse" />
                      </div>
                      <p className="text-[12px] text-[#3e4942]">
                        {customFen
                          ? 'Mova qualquer peça para testar suas ideias ou clique em Voltar ao Livro.'
                          : 'Arraste as peças como no Chess.com ou clique nos lances dentro do texto ao lado!'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {customFen && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomFen(null);
                          setCustomLastMove(null);
                          setCustomVariationLabel(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#855300] border border-[#F59E0B] text-[12px] font-extrabold cursor-pointer"
                      >
                        ↩ Voltar ao Livro
                      </button>
                    )}
                    {currentStep && !customFen && (
                      <span className="px-3 py-1 rounded-xl bg-[#E2F6EA] text-[#006b49] text-[16px] font-extrabold">
                        {currentStep.moveNumber}
                        {currentStep.color === 'w' ? '. ' : '... '}
                        {formatMoveByMode(currentStep, notationMode)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Container do Tabuleiro + Barra de Avaliação Vertical */}
                <div className="grid grid-cols-[26px_minmax(0,1fr)] gap-3 items-stretch max-w-[640px] w-full mx-auto">
                  <VerticalEvaluationBar
                    evaluation={engineAnalysis}
                    flipped={flipped}
                  />
                  <InteractiveChessboard
                    fen={activeFen}
                    flipped={flipped}
                    themeId={boardTheme}
                    notationMode={notationMode}
                    lastMove={
                      customLastMove
                        ? customLastMove
                        : currentStep
                        ? { from: currentStep.from, to: currentStep.to }
                        : null
                    }
                    moveBadge={!customFen ? currentStep?.annotation?.badge : undefined}
                    bookArrows={!customFen ? currentStep?.annotation?.arrows || [] : []}
                    bookHighlights={!customFen ? currentStep?.annotation?.highlights || [] : []}
                    engineArrow={
                      hintLevel >= 3 && nextExpectedStep
                        ? { from: nextExpectedStep.from, to: nextExpectedStep.to }
                        : null
                    }
                    onUserMove={handleUserMoveOnBoard}
                    interactive={true}
                  />
                </div>

                {/* Dock de Controles Táteis embaixo do Tabuleiro (Design Google Stitch) */}
                <div className="w-full bg-white rounded-3xl p-4 border border-[#E6DEC8] shadow-[0_6px_20px_rgba(181,138,101,0.08)] space-y-3.5">
                  {/* Botão Dourado de Dica Mágica da Coruja Sofia */}
                  <button
                    type="button"
                    onClick={() => {
                      setHintLevel((prev) => (prev < 3 ? ((prev + 1) as 0 | 1 | 2 | 3) : 1));
                      setRightPanelTab('mentors');
                    }}
                    className="w-full h-12 bg-[#FEF3C7] hover:bg-[#FDE68A] border-2 border-[#F59E0B]/50 text-[#684000] rounded-2xl font-extrabold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(245,158,11,0.2)] active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span className="text-lg">💡</span>
                    <span>
                      {hintLevel === 0
                        ? 'Pedir Dica Mágica à Coruja Sofia (1 de 3)'
                        : hintLevel === 1
                        ? 'Dica 1 Ativa (Pergunta) • Clique para Dica 2 (Peça/Casa)'
                        : hintLevel === 2
                        ? 'Dica 2 Ativa (Peça) • Clique para Revelar Solução no Tabuleiro'
                        : 'Solução Revelada no Tabuleiro! (Clique para reiniciar dica)'}
                    </span>
                  </button>

                  {/* Botões Táteis de Navegação de Lances */}
                  <div className="grid grid-cols-5 gap-2">
                    <button
                      type="button"
                      onClick={() => goToPly(0)}
                      disabled={currentPly === 0 && !customFen}
                      className="h-11 px-2 bg-[#FBF8F1] hover:bg-[#E2F6EA] disabled:opacity-40 text-[#0d1c2e] rounded-xl font-extrabold text-[13px] border border-[#E6DEC8] flex items-center justify-center gap-1 cursor-pointer transition-all"
                      title="Voltar ao início da partida (Seta Acima)"
                    >
                      ⏮ Início
                    </button>
                    <button
                      type="button"
                      onClick={() => goToPly(currentPly - 1)}
                      disabled={currentPly === 0 && !customFen}
                      className="h-11 px-3 bg-[#FBF8F1] hover:bg-[#E2F6EA] disabled:opacity-40 text-[#0d1c2e] rounded-xl font-extrabold text-[13px] border border-[#E6DEC8] flex items-center justify-center gap-1 cursor-pointer transition-all"
                      title="Lance anterior (Seta Esquerda)"
                    >
                      ◀ Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => goToPly(currentPly + 1)}
                      disabled={currentPly >= steps.length}
                      className="h-11 px-3 bg-[#16865E] hover:bg-[#006b49] disabled:opacity-40 text-white rounded-xl font-extrabold text-[13px] shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-all"
                      title="Próximo lance (Seta Direita)"
                    >
                      Avançar ▶
                    </button>
                    <button
                      type="button"
                      onClick={() => setFlipped((f) => !f)}
                      className="h-11 px-2 bg-[#FBF8F1] hover:bg-[#E2F6EA] text-[#0d1c2e] rounded-xl font-extrabold text-[13px] border border-[#E6DEC8] flex items-center justify-center gap-1 cursor-pointer transition-all"
                      title="Girar tabuleiro (Tecla F)"
                    >
                      🔄 Girar
                    </button>
                    <button
                      type="button"
                      onClick={handleSpeakCurrentExplanation}
                      className="h-11 px-2 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0059c0] rounded-xl font-extrabold text-[13px] border border-[#BFDBFE] flex items-center justify-center gap-1 cursor-pointer transition-all"
                      title="Ouvir narração em voz alta do parágrafo atual"
                    >
                      🔊 Ouvir Voz
                    </button>
                  </div>

                  {/* Barra de Progresso Candy Track + Concluir Estudo */}
                  <div className="pt-1 space-y-2">
                    <div className="flex items-center justify-between text-[12px] font-extrabold text-[#3e4942]">
                      <span className="text-[#006b49]">
                        Progresso na Lição: {progressPercentage}% ({currentPly}/{steps.length} lances)
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#F59E0B]">
                          {progressPercentage >= 30 ? '⭐' : '☆'}
                          {progressPercentage >= 70 ? '⭐' : '☆'}
                          {progressPercentage >= 100 ||
                          completedGameIds.includes(activeUnifiedGame.id)
                            ? '⭐'
                            : '☆'}
                        </span>
                        <button
                          type="button"
                          onClick={handleMarkCompleted}
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold cursor-pointer transition-all ${
                            completedGameIds.includes(activeUnifiedGame.id)
                              ? 'bg-[#E2F6EA] text-[#006b49]'
                              : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#855300]'
                          }`}
                        >
                          {completedGameIds.includes(activeUnifiedGame.id)
                            ? '✓ Concluído (+3 ⭐)'
                            : 'Concluir & Coletar 3 ⭐'}
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-[#E6EEFF] rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-[#16865E] rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(4, progressPercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* COLUNA DIREITA (5 COLUNAS): LEITOR DE LIVRO VIVO + 3 MENTORES + PLANILHA */}
              <section className="lg:col-span-5 flex flex-col gap-4">
                {/* Abas do Painel Direito */}
                <div className="grid grid-cols-3 gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E6DEC8] shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setRightPanelTab('book_reader')}
                    className={`py-2.5 px-2 rounded-xl text-[12.5px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      rightPanelTab === 'book_reader'
                        ? 'bg-[#16865E] text-white shadow-xs'
                        : 'text-[#3e4942] hover:bg-[#FFF9ED]'
                    }`}
                  >
                    <span>📖</span>
                    <span>Livro Interativo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRightPanelTab('mentors')}
                    className={`py-2.5 px-2 rounded-xl text-[12.5px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      rightPanelTab === 'mentors'
                        ? 'bg-[#F59E0B] text-[#2a1700] shadow-xs'
                        : 'text-[#3e4942] hover:bg-[#FFF9ED]'
                    }`}
                  >
                    <span>🦉</span>
                    <span>3 Mentores</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRightPanelTab('movesheet')}
                    className={`py-2.5 px-2 rounded-xl text-[12.5px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      rightPanelTab === 'movesheet'
                        ? 'bg-[#0059c0] text-white shadow-xs'
                        : 'text-[#3e4942] hover:bg-[#FFF9ED]'
                    }`}
                  >
                    <span>📋</span>
                    <span>Planilha ({steps.length})</span>
                  </button>
                </div>

                {/* Banner de Feedback Instantâneo do Desafio (Acerto / Alerta Construtivo) */}
                {lastFeedback && (
                  <div
                    className={`p-4 rounded-2xl border-2 shadow-sm animate-fadeIn ${
                      lastFeedback.tier === 'main'
                        ? 'bg-[#E2F6EA] border-[#16865E] text-[#005237]'
                        : lastFeedback.tier === 'plausible'
                        ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#684000]'
                        : 'bg-[#FEE2E2] border-[#F87171] text-[#93000a]'
                    }`}
                  >
                    <div className="text-[14px] font-extrabold">{lastFeedback.headlinePt}</div>
                    <p className="text-[13px] mt-1 leading-relaxed">{lastFeedback.detailPt}</p>
                  </div>
                )}

                {/* VISÃO 1: LEITOR DE LIVRO VIVO (PARÁGRAFOS CORRIDOS COM LANCES CLICÁVEIS) */}
                {rightPanelTab === 'book_reader' && (
                  <InteractiveBookReader
                    bookTitle={
                      currentStudyType === 'book_game'
                        ? currentChapterAndGame.book.titlePt
                        : currentStudyType === 'opening'
                        ? 'Enciclopédia de Aberturas'
                        : 'Caderno Google NotebookLM'
                    }
                    chapterTitle={
                      currentStudyType === 'book_game'
                        ? `Cap. ${currentChapterAndGame.chapter.number}: ${currentChapterAndGame.chapter.titlePt}`
                        : activeUnifiedGame.openingNamePt
                    }
                    game={activeUnifiedGame}
                    computedSteps={steps}
                    currentPly={currentPly}
                    activeVariationFen={customFen}
                    activeVariationLabel={customVariationLabel}
                    notationMode={notationMode}
                    onSelectPly={(ply) => goToPly(ply)}
                    onSelectVariationMove={handleSelectVariationFromParagraph}
                    onReturnToMainline={() => {
                      setCustomFen(null);
                      setCustomLastMove(null);
                      setCustomVariationLabel(null);
                    }}
                    hasNextChapterGame={Boolean(
                      currentStudyType === 'book_game' && nextBookEntry
                    )}
                    onNextChapterGame={() => {
                      if (nextBookEntry) {
                        handleSelectBookGame(
                          nextBookEntry.book.id,
                          nextBookEntry.game.id,
                          'read'
                        );
                      }
                    }}
                  />
                )}

                {/* VISÃO 2: OS 3 MENTORES DO GOOGLE STITCH (CORUJA SOFIA, LIVRO MÁGICO E ROBÔ PIPO) */}
                {rightPanelTab === 'mentors' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* MENTOR 1: 🦉 CORUJA SOFIA (TUTOR CHEFE) */}
                    <article className="bg-[#FFFBEB] border-2 border-[#FDE68A] rounded-3xl p-4 shadow-xs">
                      <div className="flex items-start gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-[#FEF3C7] border border-[#F59E0B]/40 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
                          🦉
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[16px] font-extrabold text-[#855300]">
                              A Coruja Sofia pergunta:
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#684000] text-[11px] font-extrabold">
                              Tutora Pedagógica
                            </span>
                          </div>
                          <p className="text-[14.5px] text-[#0d1c2e] leading-relaxed font-medium">
                            {hintLevel === 0 && progressiveHints.level1QuestionPt}
                            {hintLevel === 1 && progressiveHints.level1QuestionPt}
                            {hintLevel === 2 && progressiveHints.level2PiecePt}
                            {hintLevel >= 3 && progressiveHints.level3SolutionPt}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#FDE68A] flex flex-wrap gap-2">
                        {([1, 2, 3] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setHintLevel(lvl)}
                            className={`px-3 py-1.5 rounded-xl text-[12px] font-extrabold cursor-pointer transition-all ${
                              hintLevel === lvl
                                ? 'bg-[#F59E0B] text-white shadow-xs'
                                : 'bg-white text-[#855300] border border-[#FDE68A] hover:bg-[#FEF3C7]'
                            }`}
                          >
                            {lvl === 1
                              ? '1. Pergunta Guia'
                              : lvl === 2
                              ? '2. Peça & Casa'
                              : '3. Solução Explicada'}
                          </button>
                        ))}
                      </div>
                    </article>

                    {/* MENTOR 2: 📖 O LIVRO MÁGICO (CITAÇÃO ORIGINAL DO MESTRE) */}
                    <article className="bg-[#F0FDF4] border-2 border-[#BBF7D0] rounded-3xl p-4 shadow-xs">
                      <div className="flex items-start gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-[#E2F6EA] border border-[#16865E]/30 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
                          📖
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-[16px] font-extrabold text-[#006b49]">
                              O Mestre do Livro explica:
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E2F6EA] text-[#005237] text-[11px] font-extrabold">
                              {bookCitation.authorLabel}
                            </span>
                          </div>
                          <div className="text-[11.5px] font-bold text-[#3e4942]">
                            {bookCitation.sourceTitle} • {bookCitation.chapterLabel} (
                            {bookCitation.pageEstimate})
                          </div>
                          <p className="text-[14.5px] text-[#0d1c2e] leading-relaxed font-medium bg-white/80 p-3 rounded-2xl border border-[#BBF7D0]">
                            “
                            {currentStep?.annotation?.commentPt ||
                              activeUnifiedGame.introPt}
                            ”
                          </p>
                          <button
                            type="button"
                            onClick={() => setRightPanelTab('book_reader')}
                            className="inline-flex items-center gap-1 text-[12px] font-extrabold text-[#006b49] hover:underline cursor-pointer pt-1"
                          >
                            <span>📖 Abrir parágrafos completos com lances clicáveis</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    </article>

                    {/* MENTOR 3: 🤖 O ROBÔ PIPO (STOCKFISH LOCAL AMIGÁVEL) */}
                    <article className="bg-[#EFF6FF] border-2 border-[#BFDBFE] rounded-3xl p-4 shadow-xs">
                      <div className="flex items-start gap-3.5">
                        <div className="w-13 h-13 rounded-2xl bg-[#DBEAFE] border border-[#3B82F6]/30 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
                          🤖
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[16px] font-extrabold text-[#0059c0]">
                              O Robô Pipo calculou:
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#004395] text-[12px] font-extrabold">
                              {engineAnalysis.mateIn !== null
                                ? `Mate em ${Math.abs(engineAnalysis.mateIn)}`
                                : `${engineAnalysis.scoreCp >= 0 ? '+' : ''}${(
                                    engineAnalysis.scoreCp / 100
                                  ).toFixed(2)}`}
                            </span>
                          </div>
                          <p className="text-[14px] text-[#0d1c2e] leading-relaxed">
                            {engineAnalysis.explanationPt}
                          </p>
                          {engineAnalysis.pvLineSan.length > 0 && (
                            <div className="pt-1 flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-extrabold uppercase text-[#0059c0]">
                                Linha Sugerida:
                              </span>
                              {engineAnalysis.pvLineSan.map((san, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-white border border-[#BFDBFE] text-[12px] font-extrabold text-[#004395]"
                                >
                                  {sanToPortugueseAlgebraic(san)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </div>
                )}

                {/* VISÃO 3: PLANILHA COMPLETA DE LANCES ESTILO CHESS.COM */}
                {rightPanelTab === 'movesheet' && (
                  <div className="bg-white rounded-3xl p-4 border border-[#E6DEC8] shadow-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E6DEC8]">
                      <span className="text-[14px] font-extrabold text-[#0d1c2e]">
                        Planilha Oficial da Partida ({notationMode.toUpperCase()})
                      </span>
                      <span className="text-[12px] font-bold text-[#16865E]">
                        Clique em qualquer lance
                      </span>
                    </div>

                    <div className="max-h-[480px] overflow-y-auto space-y-1 pr-1">
                      {Array.from({ length: Math.ceil(steps.length / 2) }).map((_, pairIdx) => {
                        const wStep = steps[pairIdx * 2];
                        const bStep = steps[pairIdx * 2 + 1];
                        return (
                          <div
                            key={pairIdx}
                            className="grid grid-cols-[44px_1fr_1fr] items-center gap-2 py-1.5 px-2.5 rounded-xl odd:bg-[#FFF9ED]"
                          >
                            <span className="text-[12px] font-extrabold text-[#6e7a72]">
                              {pairIdx + 1}.
                            </span>
                            {wStep ? (
                              <button
                                type="button"
                                onClick={() => goToPly(wStep.ply)}
                                className={`text-left px-2.5 py-1 rounded-lg text-[13.5px] font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                                  !customFen && currentPly === wStep.ply
                                    ? 'bg-[#16865E] text-white shadow-2xs'
                                    : 'hover:bg-[#E2F6EA] text-[#0d1c2e]'
                                }`}
                              >
                                <span>{formatMoveByMode(wStep, notationMode)}</span>
                                {wStep.annotation?.badge && (
                                  <span className="text-[11px] px-1.5 rounded bg-[#FEF3C7] text-[#855300]">
                                    {wStep.annotation.badge}
                                  </span>
                                )}
                              </button>
                            ) : (
                              <span />
                            )}
                            {bStep ? (
                              <button
                                type="button"
                                onClick={() => goToPly(bStep.ply)}
                                className={`text-left px-2.5 py-1 rounded-lg text-[13.5px] font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                                  !customFen && currentPly === bStep.ply
                                    ? 'bg-[#16865E] text-white shadow-2xs'
                                    : 'hover:bg-[#E2F6EA] text-[#0d1c2e]'
                                }`}
                              >
                                <span>{formatMoveByMode(bStep, notationMode)}</span>
                                {bStep.annotation?.badge && (
                                  <span className="text-[11px] px-1.5 rounded bg-[#FEF3C7] text-[#855300]">
                                    {bStep.annotation.badge}
                                  </span>
                                )}
                              </button>
                            ) : (
                              <span />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* ===================================================================
            TELA 2: BIBLIOTECA MÁGICA (OS 4 LIVROS COMPLETOS + CAPÍTULOS)
           =================================================================== */}
        {navDest === 'library' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Cabeçalho & Barra de Busca Lúdica */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6DEC8] shadow-[0_8px_30px_rgba(181,138,101,0.08)] space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2F6EA] text-[#006b49] text-[11px] font-extrabold uppercase tracking-wider">
                    ✨ Biblioteca Mágica dos Grandes Mestres
                  </span>
                  <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#0d1c2e] tracking-tight mt-1">
                    Os 4 Livros Clássicos Completos & Interativos
                  </h1>
                  <p className="text-[15px] text-[#3e4942] mt-1 max-w-3xl">
                    Leia cada capítulo como um livro tradicional e <strong>clique em qualquer movimento descrito nos parágrafos</strong> para ver a jogada ganhar vida instantaneamente no tabuleiro!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNotebookModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-[#16865E] hover:bg-[#006b49] text-white font-extrabold text-[14px] shadow-[0_6px_18px_rgba(22,134,94,0.25)] flex items-center gap-2 self-start cursor-pointer transition-all"
                >
                  <span>📓</span>
                  <span>+ Importar Caderno Google NotebookLM</span>
                </button>
              </div>

              {/* Barra de Busca */}
              <div className="flex items-center gap-3 bg-[#FFF9ED] p-2 pl-4 rounded-full border border-[#E6DEC8]">
                <span className="text-lg">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por livro, capítulo, mestre (Capablanca, Tal, Fischer, Nimzowitsch, D'Agostini) ou tema tático..."
                  className="w-full bg-transparent text-[14px] text-[#0d1c2e] placeholder:text-[#6e7a72] focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-1 rounded-full bg-white text-[12px] font-bold text-[#3e4942] cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* HERO CARD: LEITURA EM ANDAMENTO */}
            <div className="rounded-3xl bg-gradient-to-br from-[#E2F6EA] via-white to-[#FEF3C7]/60 p-6 border-2 border-[#16865E]/30 shadow-[0_12px_32px_rgba(22,134,94,0.08)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#16865E] text-white text-[11px] font-extrabold uppercase">
                    Leitura em Andamento
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-[#006b49] text-[11px] font-extrabold border border-[#E6DEC8]">
                    {currentChapterAndGame.book.author}
                  </span>
                </div>
                <h2 className="text-[24px] font-extrabold text-[#0d1c2e]">
                  {currentChapterAndGame.book.titlePt} — Cap. {currentChapterAndGame.chapter.number}:{' '}
                  {currentChapterAndGame.chapter.titlePt}
                </h2>
                <p className="text-[14px] text-[#3e4942]">
                  Partida atual: <strong>{currentChapterAndGame.game.titlePt}</strong>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectBookGame(
                      currentChapterAndGame.book.id,
                      currentChapterAndGame.game.id,
                      'read'
                    )
                  }
                  className="px-5 py-3 rounded-2xl bg-[#16865E] hover:bg-[#006b49] text-white font-extrabold text-[14px] shadow-md cursor-pointer transition-all"
                >
                  📖 Continuar Leitura Interativa ▶
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSelectBookGame(
                      currentChapterAndGame.book.id,
                      currentChapterAndGame.game.id,
                      'challenge'
                    )
                  }
                  className="px-4 py-3 rounded-2xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#684000] border border-[#F59E0B] font-extrabold text-[14px] cursor-pointer transition-all"
                >
                  🎯 Treinar no Tabuleiro
                </button>
              </div>
            </div>

            {/* ESTANTE COMPLETA DOS 4 LIVROS E TODOS OS SEUS CAPÍTULOS */}
            <div className="space-y-6">
              {PREINSTALLED_BOOKS.map((book, bIdx) => {
                const filteredChapters = book.chapters.filter((ch) => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return (
                    book.titlePt.toLowerCase().includes(q) ||
                    book.author.toLowerCase().includes(q) ||
                    ch.titlePt.toLowerCase().includes(q) ||
                    ch.subtitlePt.toLowerCase().includes(q) ||
                    ch.games.some(
                      (g) =>
                        g.titlePt.toLowerCase().includes(q) ||
                        g.white.toLowerCase().includes(q) ||
                        g.black.toLowerCase().includes(q)
                    )
                  );
                });

                if (filteredChapters.length === 0) return null;

                const bookColors = [
                  { bg: 'bg-[#FEF3C7]', text: 'text-[#855300]', border: 'border-[#F59E0B]/40' },
                  { bg: 'bg-[#E2F6EA]', text: 'text-[#006b49]', border: 'border-[#16865E]/40' },
                  { bg: 'bg-[#FEE2E2]', text: 'text-[#93000a]', border: 'border-[#F87171]/40' },
                  { bg: 'bg-[#EFF6FF]', text: 'text-[#0059c0]', border: 'border-[#3B82F6]/40' },
                ][bIdx % 4];

                return (
                  <section
                    key={book.id}
                    className="bg-white rounded-3xl p-6 border border-[#E6DEC8] shadow-[0_6px_24px_rgba(181,138,101,0.07)] space-y-5"
                  >
                    {/* Cabeçalho do Livro */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6DEC8]">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${bookColors.bg} ${bookColors.text}`}
                          >
                            Livro {bIdx + 1} • {book.badgeText}
                          </span>
                          <span className="text-[12px] font-bold text-[#6e7a72]">
                            {book.author} ({book.publicationYear}) • {book.chapters.length} Capítulos
                            Completos
                          </span>
                        </div>
                        <h2 className="text-[22px] font-extrabold text-[#0d1c2e]">
                          {book.titlePt}
                        </h2>
                        <p className="text-[13.5px] text-[#3e4942] max-w-3xl">
                          {book.descriptionPt}
                        </p>
                      </div>
                    </div>

                    {/* Grid de Todos os Capítulos do Livro */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredChapters.map((ch) => (
                        <div
                          key={ch.id}
                          className="rounded-2xl p-4 bg-[#FFF9ED] border border-[#E6DEC8] hover:border-[#16865E] transition-all flex flex-col justify-between gap-3"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2.5 py-0.5 rounded-lg bg-[#16865E] text-white text-[11px] font-extrabold">
                                Capítulo {ch.number}
                              </span>
                              <span className="text-[11px] font-bold text-[#6e7a72]">
                                {ch.games.length}{' '}
                                {ch.games.length === 1 ? 'Lição Completa' : 'Lições Completas'}
                              </span>
                            </div>
                            <h3 className="text-[16px] font-extrabold text-[#0d1c2e]">
                              {ch.titlePt}
                            </h3>
                            <p className="text-[12.5px] text-[#3e4942]">{ch.subtitlePt}</p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-[#E6DEC8]/70">
                            {ch.games.map((gm) => {
                              const isDone = completedGameIds.includes(gm.id);
                              return (
                                <div
                                  key={gm.id}
                                  className="bg-white rounded-xl p-3 border border-[#E6DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                >
                                  <div className="min-w-0">
                                    <div className="text-[13.5px] font-extrabold text-[#0d1c2e] truncate">
                                      {isDone ? '⭐ ' : '♟️ '}
                                      {gm.titlePt}
                                    </div>
                                    <div className="text-[11.5px] text-[#6e7a72]">
                                      {gm.white} vs. {gm.black} ({gm.year}) • {gm.movesSan.length}{' '}
                                      lances interativos
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleSelectBookGame(book.id, gm.id, 'read')}
                                      className="px-3 py-1.5 rounded-lg bg-[#16865E] hover:bg-[#006b49] text-white text-[12px] font-extrabold cursor-pointer transition-all"
                                    >
                                      📖 Ler & Clicar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSelectBookGame(book.id, gm.id, 'challenge')
                                      }
                                      className="px-2.5 py-1.5 rounded-lg bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#855300] text-[12px] font-extrabold cursor-pointer transition-all"
                                      title="Jogar no Modo Adivinhe o Lance"
                                    >
                                      🎯
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================================================================
            TELA 3: ABERTURAS, MEIO-JOGO, FINAIS & CADERNOS NOTEBOOKLM
           =================================================================== */}
        {navDest === 'openings' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Banner Superior */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6DEC8] shadow-[0_8px_30px_rgba(181,138,101,0.08)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#855300] text-[11px] font-extrabold uppercase tracking-wider">
                  🧭 Enciclopédia & Laboratório de Estudos
                </span>
                <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0d1c2e]">
                  Aberturas & Defesas, Meio-Jogo, Finais e Google NotebookLM
                </h1>
                <p className="text-[14.5px] text-[#3e4942]">
                  Explore as 18 aberturas clássicas, estude planos de meio-jogo e finais técnicos, ou importe novos estudos diretamente da internet e do <strong>Google NotebookLM</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNotebookModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-[#16865E] hover:bg-[#006b49] text-white font-extrabold text-[14px] shadow-md flex items-center gap-2 self-start cursor-pointer"
              >
                <span>📓</span>
                <span>+ Adicionar Estudo (NotebookLM / PGN)</span>
              </button>
            </div>

            {/* Filtro de Fases do Jogo */}
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'all', label: '🌟 Todas as Fases' },
                  { id: 'openings', label: '🌱 Aberturas & Defesas (18)' },
                  { id: 'middlegame', label: '⚡ Meio-Jogo & Ataque' },
                  { id: 'endgame', label: '👑 Finais & Técnica' },
                  {
                    id: 'notebooklm',
                    label: `📓 Meus Estudos NotebookLM (${customStudies.length})`,
                  },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedPhaseFilter(f.id)}
                  className={`px-4 py-2.5 rounded-2xl text-[13px] font-extrabold cursor-pointer transition-all border ${
                    selectedPhaseFilter === f.id
                      ? 'bg-[#16865E] text-white border-[#16865E] shadow-xs'
                      : 'bg-white text-[#3e4942] border-[#E6DEC8] hover:bg-[#E2F6EA]/50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* SEÇÃO A: ESTUDOS IMPORTADOS DO GOOGLE NOTEBOOKLM / INTERNET */}
            {(selectedPhaseFilter === 'all' || selectedPhaseFilter === 'notebooklm') && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[19px] font-extrabold text-[#0d1c2e] flex items-center gap-2">
                    <span>📓</span>
                    <span>Meus Cadernos do Google NotebookLM & Internet</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsNotebookModalOpen(true)}
                    className="text-[13px] font-extrabold text-[#006b49] hover:underline cursor-pointer"
                  >
                    + Importar Novo Estudo
                  </button>
                </div>

                {customStudies.length === 0 ? (
                  <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[16px] font-extrabold text-[#0d1c2e]">
                        Pronto para receber seus estudos do Google NotebookLM!
                      </h3>
                      <p className="text-[13.5px] text-[#3e4942] mt-0.5">
                        Clique no botão ao lado para colar qualquer estudo de Abertura, Defesa, Meio-Jogo ou Final obtido na internet ou no NotebookLM.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsNotebookModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#0059c0] border border-[#BFDBFE] font-extrabold text-[13px] shrink-0 cursor-pointer"
                    >
                      ✨ Testar Importador Agora
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customStudies.map((st) => (
                      <div
                        key={st.id}
                        className="bg-white rounded-3xl p-5 border-2 border-[#BFDBFE] shadow-xs flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#0059c0] text-[11px] font-extrabold uppercase">
                              {st.openingNamePt}
                            </span>
                            <span className="text-[11px] font-bold text-[#6e7a72]">
                              {st.movesSan.length} lances
                            </span>
                          </div>
                          <h3 className="text-[17px] font-extrabold text-[#0d1c2e]">
                            {st.titlePt}
                          </h3>
                          <p className="text-[13px] text-[#3e4942] line-clamp-3">{st.introPt}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectCustomStudy(st)}
                          className="w-full py-2.5 rounded-xl bg-[#16865E] hover:bg-[#006b49] text-white font-extrabold text-[13px] cursor-pointer"
                        >
                          📖 Abrir Estudo Interativo no Tabuleiro
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* SEÇÃO B: REPERTÓRIO DE 18 ABERTURAS & DEFESAS TEÓRICAS */}
            {(selectedPhaseFilter === 'all' || selectedPhaseFilter === 'openings') && (
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[19px] font-extrabold text-[#0d1c2e]">
                    🌱 Aberturas & Defesas Clássicas ({CHESS_OPENINGS.length} Sistemas)
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'all', label: 'Todas' },
                      { id: 'open', label: 'Abertas (1.e4 e5)' },
                      { id: 'semi_open', label: 'Semi-Abertas (Siciliana/Francesa/Caro-Kann)' },
                      { id: 'closed', label: 'Fechadas (1.d4 d5)' },
                      { id: 'indian', label: 'Defesas Índias' },
                      { id: 'flank', label: 'Flanco (Inglesa/Réti)' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedOpeningCat(cat.id)}
                        className={`px-3 py-1 rounded-full text-[12px] font-extrabold cursor-pointer ${
                          selectedOpeningCat === cat.id
                            ? 'bg-[#006b49] text-white'
                            : 'bg-white border border-[#E6DEC8] text-[#3e4942]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CHESS_OPENINGS.filter(
                    (o) => selectedOpeningCat === 'all' || o.category === selectedOpeningCat
                  ).map((opening) => (
                    <div
                      key={opening.id}
                      className="bg-white rounded-3xl p-5 border border-[#E6DEC8] hover:border-[#16865E] shadow-[0_4px_16px_rgba(181,138,101,0.06)] flex flex-col justify-between gap-4 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#E2F6EA] text-[#006b49] text-[11px] font-extrabold">
                            ECO {opening.eco} • {opening.categoryLabelPt}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#855300] text-[11px] font-extrabold">
                            {opening.recommendedFor === 'black' ? '⚫ Defesa Preta' : '⚪ Ataque Branco'}
                          </span>
                        </div>
                        <h3 className="text-[18px] font-extrabold text-[#0d1c2e]">
                          {opening.namePt}
                        </h3>
                        <p className="text-[13px] text-[#3e4942] line-clamp-3">
                          {opening.summaryPt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#E6DEC8]/60">
                        <button
                          type="button"
                          onClick={() => handleSelectOpening(opening, false)}
                          className="flex-1 py-2.5 rounded-xl bg-[#16865E] hover:bg-[#006b49] text-white text-[12.5px] font-extrabold cursor-pointer transition-all"
                        >
                          📖 Estudar & Clicar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectOpening(opening, true)}
                          className="px-3.5 py-2.5 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#684000] text-[12.5px] font-extrabold cursor-pointer transition-all"
                        >
                          🎯 Desafiar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SEÇÃO C: ESTUDOS CLÁSSICOS DE MEIO-JOGO E FINAIS */}
            {(selectedPhaseFilter === 'all' ||
              selectedPhaseFilter === 'middlegame' ||
              selectedPhaseFilter === 'endgame') && (
              <section className="space-y-4 pt-2">
                <h2 className="text-[19px] font-extrabold text-[#0d1c2e]">
                  ⚡ Estudos Magistrais de Meio-Jogo & 👑 Finais Técnicos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookMiddlegameAndEndgameStudies
                    .filter((entry) => {
                      if (selectedPhaseFilter === 'middlegame')
                        return entry.game.studyPhase === 'middlegame';
                      if (selectedPhaseFilter === 'endgame')
                        return entry.game.studyPhase === 'endgame' || Boolean(entry.game.initialFen);
                      return true;
                    })
                    .map(({ book, chapter, game }) => (
                      <div
                        key={game.id}
                        className="bg-white rounded-3xl p-5 border border-[#E6DEC8] hover:border-[#F59E0B] shadow-xs flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#855300] text-[11px] font-extrabold">
                            {game.studyPhase === 'endgame' || game.initialFen
                              ? '👑 Final Clássico'
                              : '⚡ Meio-Jogo & Combinação'}{' '}
                            • {book.titlePt}
                          </span>
                          <h3 className="text-[17px] font-extrabold text-[#0d1c2e]">
                            {game.titlePt}
                          </h3>
                          <p className="text-[12.5px] text-[#3e4942] line-clamp-3">
                            {game.introPt}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectBookGame(book.id, game.id, 'read')
                          }
                          className="w-full py-2.5 rounded-xl bg-[#16865E] hover:bg-[#006b49] text-white text-[13px] font-extrabold cursor-pointer"
                        >
                          📖 Abrir Estudo com Lances Clicáveis ({chapter.titlePt})
                        </button>
                      </div>
                    ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ===================================================================
            TELA 4: GALERIA DE CONQUISTAS & SALA DOS TROFÉUS (STITCH)
           =================================================================== */}
        {navDest === 'achievements' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Banner de Conquistas */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6DEC8] shadow-[0_8px_30px_rgba(181,138,101,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#855300] text-[11px] font-extrabold uppercase tracking-wider">
                  ✨ Seu Livro dos Campeões
                </span>
                <h1 className="text-[28px] sm:text-[34px] font-extrabold text-[#0d1c2e] mt-1">
                  🏆 Galeria de Conquistas & Sala dos Troféus
                </h1>
                <p className="text-[15px] text-[#3e4942] mt-1">
                  Comemore cada capítulo lido e cada desafio vencido! Seus mentores Coruja Sofia 🦉, Livro Mágico 📖 e Robô Pipo 🤖 acompanham sua evolução.
                </p>
              </div>
              <div className="flex items-center -space-x-2 bg-[#FFF9ED] p-2.5 rounded-full border border-[#E6DEC8]">
                <span className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center text-xl">
                  🦉
                </span>
                <span className="w-10 h-10 rounded-full bg-[#E2F6EA] flex items-center justify-center text-xl">
                  📖
                </span>
                <span className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-xl">
                  🤖
                </span>
                <span className="pl-4 pr-2 text-[12px] font-extrabold text-[#006b49]">
                  3 Mentores Ativos!
                </span>
              </div>
            </div>

            {/* 4 Cartões de KPIs Táteis do Stitch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#E6DEC8] shadow-xs">
                <span className="text-[13px] font-bold text-[#3e4942]">Estrelas Mágicas</span>
                <div className="text-[28px] font-extrabold text-[#0d1c2e] mt-1">
                  {totalMagicStars} ⭐
                </div>
                <div className="text-[12px] font-bold text-[#855300] mt-2">
                  +3 estrelas a cada lição concluída
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E6DEC8] shadow-xs">
                <span className="text-[13px] font-bold text-[#3e4942]">
                  Capítulos & Partidas no Acervo
                </span>
                <div className="text-[28px] font-extrabold text-[#0d1c2e] mt-1">
                  {allBookEntries.length + customStudies.length} 📚
                </div>
                <div className="text-[12px] font-bold text-[#006b49] mt-2">
                  {completedGameIds.length} concluídos por você
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E6DEC8] shadow-xs">
                <span className="text-[13px] font-bold text-[#3e4942]">
                  Sistemas de Abertura
                </span>
                <div className="text-[28px] font-extrabold text-[#0d1c2e] mt-1">
                  {CHESS_OPENINGS.length} 🧭
                </div>
                <div className="text-[12px] font-bold text-[#0059c0] mt-2">
                  Abertas, Semi-Abertas, Fechadas e Índias
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#E6DEC8] shadow-xs">
                <span className="text-[13px] font-bold text-[#3e4942]">
                  Cadernos NotebookLM
                </span>
                <div className="text-[28px] font-extrabold text-[#0d1c2e] mt-1">
                  {customStudies.length} 📓
                </div>
                <div className="text-[12px] font-bold text-[#3e4942] mt-2">
                  Importados da internet / NotebookLM
                </div>
              </div>
            </div>

            {/* Fila Inteligente de Revisão */}
            <section className="bg-white rounded-3xl p-6 border border-[#E6DEC8] shadow-xs space-y-4">
              <h2 className="text-[20px] font-extrabold text-[#0d1c2e]">
                🎯 Fila Inteligente de Revisão ({reviewQueue.length} posições para praticar)
              </h2>
              {reviewQueue.length === 0 ? (
                <p className="text-[14px] text-[#3e4942]">
                  Nenhuma pendência na sua fila de revisão! Quando você testar seus conhecimentos no{' '}
                  <strong>Modo Desafio: Adivinhe o Lance</strong>, qualquer posição que merecer uma segunda tentativa aparecerá aqui para revisão rápida.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reviewQueue.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#FFF9ED] border border-[#E6DEC8] flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-[14px] font-extrabold text-[#0d1c2e]">
                          {item.titlePt} (Lance {Math.floor(item.ply / 2) + 1})
                        </div>
                        <div className="text-[12px] text-[#855300]">{item.reasonPt}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (item.studyType === 'opening') {
                            const op = CHESS_OPENINGS.find((o) => o.id === item.targetId);
                            if (op) handleSelectOpening(op, true);
                          } else {
                            const found = allBookEntries.find(
                              (e) => e.game.id === item.targetId
                            );
                            if (found)
                              handleSelectBookGame(
                                found.book.id,
                                found.game.id,
                                'challenge'
                              );
                          }
                          setCurrentPly(item.ply);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#16865E] text-white text-[12px] font-extrabold cursor-pointer shrink-0"
                      >
                        Revisar no Tabuleiro ▶
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* MODAL DE IMPORTAÇÃO DE ESTUDOS DO GOOGLE NOTEBOOKLM / INTERNET */}
      <NotebookStudyModal
        isOpen={isNotebookModalOpen}
        onClose={() => setIsNotebookModalOpen(false)}
        onSaveStudy={(newStudy) => {
          setCustomStudies((prev) => [newStudy, ...prev]);
          handleSelectCustomStudy(newStudy);
        }}
      />
    </div>
  );
};
