import React from 'react';
import {
  Target,
  Lightbulb,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { formatMoveByMode } from '@shared/ui/chess/descriptiveNotation';
import type {
  BookLessonGame,
  ComputedPlyStep,
  LanguageDisplayMode,
  NotationMode,
} from '@/types/chess';

interface GuessTheMovePanelProps {
  game: BookLessonGame;
  targetStep: ComputedPlyStep | null;
  currentPly: number;
  totalPlies: number;
  notationMode: NotationMode;
  languageMode: LanguageDisplayMode;
  solvedCurrentStep: boolean;
  wrongMoveTried: string | null;
  showHint: boolean;
  stats: { correct: number; attempts: number; streak: number };
  onRequestHint: () => void;
  onRevealAnswer: () => void;
  onNextChallenge: () => void;
  onResetGuessSession: () => void;
  onExitGuessMode: () => void;
}

export const GuessTheMovePanel: React.FC<GuessTheMovePanelProps> = ({
  game,
  targetStep,
  currentPly,
  totalPlies,
  notationMode,
  languageMode,
  solvedCurrentStep,
  wrongMoveTried,
  showHint,
  stats,
  onRequestHint,
  onRevealAnswer,
  onNextChallenge,
  onResetGuessSession,
  onExitGuessMode,
}) => {
  const accuracy =
    stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 100;

  if (!targetStep) {
    return (
      <div className="flex flex-col h-full justify-between p-6 rounded-[1.5rem] bg-zinc-900/80 border border-white/10">
        <div className="space-y-5 text-center my-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
              Partida Concluída
            </span>
            <h3 className="text-2xl font-bold text-zinc-100">
              Você concluiu o treino desta partida!
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              {game.white} vs. {game.black} ({game.year})
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto pt-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <p className="text-[11px] text-zinc-400">Acertos</p>
              <p className="text-xl font-mono font-bold text-emerald-400">{stats.correct}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <p className="text-[11px] text-zinc-400">Precisão</p>
              <p className="text-xl font-mono font-bold text-sky-400">{accuracy}%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <p className="text-[11px] text-zinc-400">Sequência</p>
              <p className="text-xl font-mono font-bold text-amber-400">{stats.streak}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={onResetGuessSession}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-sm font-medium text-zinc-200 border border-white/10 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Treinar Novamente
            </button>
            <button
              onClick={onExitGuessMode}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-semibold text-zinc-950 transition"
            >
              Voltar ao Modo Leitura
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedMove = formatMoveByMode(targetStep, notationMode);
  const movePrefix =
    targetStep.color === 'w'
      ? `${targetStep.moveNumber}.`
      : `${targetStep.moveNumber}...`;

  const hintText =
    targetStep.annotation?.hintPt ||
    `Observe a peça na casa ${targetStep.from.toUpperCase()} (${
      targetStep.descriptivePt.split(/[\d(x]/)[0] || 'Peça'
    }) e procure o lance mais ativo.`;

  return (
    <div className="flex flex-col h-full justify-between p-5 rounded-[1.5rem] bg-zinc-900/80 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Cabeçalho do Modo Adivinhe (Sem spoilers da lista de lances) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Modo Adivinhe o Lance
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-zinc-300">
                  Spoiler-Free
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Explicações do livro ocultas até você acertar a jogada no tabuleiro
              </p>
            </div>
          </div>

          <button
            onClick={onExitGuessMode}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/10 transition"
          >
            Sair do Treino
          </button>
        </div>

        {/* Placar de Desempenho */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-zinc-400">Acertos</span>
            <span className="text-sm font-mono font-bold text-emerald-400">{stats.correct}</span>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-zinc-400">Precisão</span>
            <span className="text-sm font-mono font-bold text-sky-400">{accuracy}%</span>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-zinc-400">Progresso</span>
            <span className="text-sm font-mono font-bold text-zinc-200">
              {currentPly + 1}/{totalPlies}
            </span>
          </div>
        </div>

        {/* Card Principal do Desafio */}
        {!solvedCurrentStep ? (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 border border-amber-500/25 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Lance {targetStep.moveNumber} das {targetStep.color === 'w' ? 'Brancas' : 'Pretas'}
              </span>
              {targetStep.annotation?.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Momento Crítico ({targetStep.annotation.badge})
                </span>
              )}
            </div>

            <div>
              <h4 className="text-lg font-bold text-zinc-100">
                Qual foi o lance de {targetStep.color === 'w' ? game.white : game.black} nesta posição?
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                Arraste a peça ou clique na casa de origem e destino diretamente no tabuleiro ao lado.
              </p>
            </div>

            {/* Feedback de tentativa incorreta */}
            {wrongMoveTried && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-200">
                  <span className="font-semibold">Você tentou {wrongMoveTried}:</span> Não foi o lance escolhido pelo mestre no livro. Tente outro plano ou veja a dica posicional abaixo!
                </div>
              </div>
            )}

            {/* Dica Posicional (sem revelar o lance) */}
            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-100 leading-relaxed">
                  <span className="font-semibold text-amber-300">Dica do Treinador: </span>
                  {hintText}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={onRequestHint}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.11] text-xs font-semibold text-amber-200 border border-white/10 transition"
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                {showHint ? 'Dica Ativa' : 'Pedir Dica Posicional'}
              </button>

              <button
                onClick={onRevealAnswer}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] text-xs font-medium text-zinc-300 border border-white/10 transition"
              >
                <Eye className="w-4 h-4 text-zinc-400" />
                Revelar Lance
              </button>
            </div>
          </div>
        ) : (
          /* Card de Sucesso + Explicação do Livro Liberada! */
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">
                  Lance do Livro Desbloqueado!
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 font-bold border border-emerald-500/30">
                  {movePrefix} {formattedMove}
                </span>
                <span className="px-2 py-1 rounded-lg bg-white/[0.06] text-zinc-300">
                  Descritiva: {targetStep.descriptivePt}
                </span>
              </div>
            </div>

            {targetStep.annotation ? (
              <div className="p-4 rounded-xl bg-black/30 border border-white/[0.08] space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                  Comentário do Livro (Revelado após acerto)
                </p>
                {(languageMode === 'pt' || languageMode === 'bilingual') && (
                  <p className="text-sm text-zinc-100 leading-relaxed">
                    {targetStep.annotation.commentPt}
                  </p>
                )}
                {(languageMode === 'original' || languageMode === 'bilingual') &&
                  targetStep.annotation.commentOriginal && (
                    <p className="text-xs text-zinc-400 italic border-t border-white/[0.06] pt-2 leading-relaxed">
                      Original: “{targetStep.annotation.commentOriginal}”
                    </p>
                  )}
              </div>
            ) : (
              <p className="text-xs text-zinc-300">
                Lance natural de desenvolvimento/consolidação da partida original.
              </p>
            )}

            <button
              onClick={onNextChallenge}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition active:scale-[0.99]"
            >
              Próximo Lance do Livro
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Rodapé informativo */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
        <span>
          Jogando como:{' '}
          <strong className="text-zinc-200">
            {game.heroColor === 'w' ? `Brancas (${game.white})` : `Pretas (${game.black})`}
          </strong>
        </span>
        <span>Atalho Girar Tabuleiro: Tecla X ou F</span>
      </div>
    </div>
  );
};
