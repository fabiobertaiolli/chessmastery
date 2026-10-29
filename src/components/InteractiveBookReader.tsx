import React, { useMemo, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import {
  buildInteractiveBookFlow,
  type InteractiveBookBlock,
  type InlineParagraphSegment,
  type VariationResolverFn,
} from '@shared/ui/chess/interactiveBookParser';
import type { BookLessonGame, ComputedPlyStep, NotationMode } from '@/types/chess';

interface InteractiveBookReaderProps {
  bookTitle?: string;
  chapterTitle?: string;
  game: BookLessonGame;
  computedSteps: ComputedPlyStep[];
  currentPly: number;
  activeVariationFen: string | null;
  activeVariationLabel: string | null;
  notationMode: NotationMode;
  onSelectPly: (ply: number) => void;
  onSelectVariationMove: (payload: {
    fen: string;
    from: string;
    to: string;
    san: string;
    label: string;
    contextPly: number;
  }) => void;
  onReturnToMainline: () => void;
  onNextChapterGame?: () => void;
  hasNextChapterGame?: boolean;
}

export const InteractiveBookReader: React.FC<InteractiveBookReaderProps> = ({
  bookTitle,
  chapterTitle,
  game,
  computedSteps,
  currentPly,
  activeVariationFen,
  activeVariationLabel,
  notationMode,
  onSelectPly,
  onSelectVariationMove,
  onReturnToMainline,
  onNextChapterGame,
  hasNextChapterGame = false,
}) => {
  const activeBlockRef = useRef<HTMLDivElement | null>(null);

  // Resolvedor de variantes usando chess.js para que até lances secundários citados nos parágrafos sejam clicáveis!
  const variationResolver: VariationResolverFn = useMemo(() => {
    return (baseFen: string, moveSanCandidate: string) => {
      try {
        const c = new Chess(baseFen);
        const moveObj = c.move(moveSanCandidate);
        if (!moveObj) return null;
        return {
          fen: c.fen(),
          from: moveObj.from,
          to: moveObj.to,
          san: moveObj.san,
          color: moveObj.color,
        };
      } catch {
        return null;
      }
    };
  }, []);

  const bookBlocks: InteractiveBookBlock[] = useMemo(() => {
    return buildInteractiveBookFlow(game, computedSteps, notationMode, variationResolver);
  }, [game, computedSteps, notationMode, variationResolver]);

  useEffect(() => {
    if (activeBlockRef.current) {
      activeBlockRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentPly]);

  const renderInlineSegments = (segments: InlineParagraphSegment[], fallbackPly: number) => {
    return segments.map((seg, idx) => {
      if (seg.type === 'text') {
        return <React.Fragment key={idx}>{seg.content}</React.Fragment>;
      }

      const isCurrentMainlineMove =
        !seg.isVariation && !activeVariationFen && seg.ply === currentPly;
      const isCurrentVariationMove =
        Boolean(seg.isVariation && activeVariationFen && seg.fen === activeVariationFen);

      return (
        <button
          key={`${seg.content}-${idx}`}
          type="button"
          onClick={() => {
            if (seg.isVariation && seg.fen && seg.from && seg.to) {
              onSelectVariationMove({
                fen: seg.fen,
                from: seg.from,
                to: seg.to,
                san: seg.san || seg.content,
                label: seg.content,
                contextPly: seg.ply || fallbackPly,
              });
            } else if (typeof seg.ply === 'number') {
              onSelectPly(seg.ply);
            }
          }}
          title={
            seg.isVariation
              ? `Clique para ver esta variante no tabuleiro (${seg.content})`
              : `Clique para ir ao lance ${seg.content} no tabuleiro`
          }
          className={`inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded-md font-extrabold text-[14px] leading-snug transition-all cursor-pointer align-baseline shadow-2xs ${
            isCurrentMainlineMove
              ? 'bg-[#16865E] text-white ring-2 ring-[#16865E]/30 scale-105'
              : isCurrentVariationMove
              ? 'bg-[#F59E0B] text-[#2a1700] ring-2 ring-[#F59E0B]/40 scale-105'
              : seg.isVariation
              ? 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#855300] border border-[#F59E0B]/40'
              : 'bg-[#E2F6EA] hover:bg-[#16865E] text-[#005237] hover:text-white border border-[#16865E]/25'
          }`}
        >
          <span>♟</span>
          <span>{seg.content}</span>
        </button>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Cabeçalho Editorial da Página do Livro */}
      <div className="bg-[#FFF9ED] border border-[#E6DEC8] rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E2F6EA] text-[#006b49] text-[11px] font-bold uppercase tracking-wider">
            📖 Leitura Interativa • Clique nos Lances do Texto
          </span>
          <span className="text-[12px] font-bold text-[#6e7a72]">
            {game.white} vs. {game.black} ({game.year})
          </span>
        </div>
        {bookTitle && (
          <div className="text-[12px] font-bold text-[#855300]">
            {bookTitle} {chapterTitle ? `• ${chapterTitle}` : ''}
          </div>
        )}
        <h3 className="text-[18px] font-extrabold text-[#0d1c2e] leading-snug mt-0.5">
          {game.titlePt}
        </h3>
        <p className="text-[12px] text-[#3e4942] mt-1">
          Dica: Clique em <strong>qualquer movimento destacado em verde ou âmbar</strong> dentro dos
          parágrafos abaixo para ver a jogada acontecer em tempo real no tabuleiro ao lado!
        </p>
      </div>

      {/* Banner de Variante ou Exploração Livre Ativa */}
      {activeVariationFen && (
        <div className="bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
              🔍
            </span>
            <div>
              <div className="text-[13px] font-extrabold text-[#684000]">
                Explorando Posição Alternativa: {activeVariationLabel || 'Variante no Tabuleiro'}
              </div>
              <div className="text-[11px] text-[#855300]">
                Você pode continuar movendo peças no tabuleiro ou voltar ao lance do livro.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onReturnToMainline}
            className="px-3.5 py-2 rounded-xl bg-[#16865E] hover:bg-[#006b49] text-white text-[12px] font-bold shrink-0 shadow-xs cursor-pointer transition-all"
          >
            ↩ Voltar ao Livro
          </button>
        </div>
      )}

      {/* Corpo Contínuo dos Parágrafos do Livro */}
      <div className="space-y-4 max-h-[540px] overflow-y-auto pr-1">
        {bookBlocks.map((block) => {
          const isBlockActive =
            !activeVariationFen &&
            currentPly > 0 &&
            ((block.focusPly && block.focusPly === currentPly) ||
              (currentPly >= block.startPly && currentPly <= block.endPly && block.startPly > 0));

          return (
            <article
              key={block.id}
              ref={isBlockActive ? activeBlockRef : undefined}
              className={`rounded-2xl p-4 transition-all border ${
                isBlockActive
                  ? 'bg-[#FFFBEB] border-[#F59E0B] shadow-[0_6px_20px_rgba(245,158,11,0.12)]'
                  : block.kind === 'intro' || block.kind === 'theory'
                  ? 'bg-[#FBF8F1] border-[#E6DEC8]'
                  : 'bg-white border-[#E6DEC8]/80 hover:border-[#16865E]/40'
              }`}
            >
              {/* Título de Seção Teórica ou Introdução */}
              {block.title && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#16865E]/10 text-[#006b49] text-[11px] font-extrabold uppercase tracking-wider">
                    {block.title}
                  </span>
                </div>
              )}

              {/* Faixa de Lances Clicáveis que Precedem / Compõem este Parágrafo */}
              {block.inlineSteps.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-3 pb-2.5 border-b border-[#E6DEC8]/60">
                  {block.inlineSteps.map((step) => {
                    const isActiveStep = !activeVariationFen && currentPly === step.ply;
                    const showMoveNum =
                      step.color === 'w' || step.ply === block.inlineSteps[0].ply;

                    return (
                      <button
                        key={step.ply}
                        type="button"
                        onClick={() => onSelectPly(step.ply)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[13px] font-extrabold transition-all cursor-pointer ${
                          isActiveStep
                            ? 'bg-[#16865E] text-white shadow-sm ring-2 ring-[#16865E]/30 scale-105'
                            : 'bg-[#FFF9ED] hover:bg-[#E2F6EA] text-[#0d1c2e] border border-[#E6DEC8]'
                        }`}
                        title={`Ir para o lance ${step.moveNumber}${
                          step.color === 'w' ? '.' : '...'
                        } ${step.formatted} (Descritiva: ${step.descriptivePt})`}
                      >
                        {showMoveNum && (
                          <span
                            className={`text-[11px] font-bold ${
                              isActiveStep ? 'text-white/85' : 'text-[#6e7a72]'
                            }`}
                          >
                            {step.moveNumber}
                            {step.color === 'w' ? '.' : '...'}
                          </span>
                        )}
                        <span>{step.formatted}</span>
                        {step.badge && (
                          <span
                            className={`text-[11px] px-1 rounded ${
                              isActiveStep
                                ? 'bg-white/25 text-white'
                                : 'bg-[#FEF3C7] text-[#855300]'
                            }`}
                          >
                            {step.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Parágrafo Editorial com Lances Clicáveis Embutidos na Frase */}
              {block.segments.length > 0 && (
                <p className="text-[15px] leading-[1.75] text-[#0d1c2e] font-medium">
                  {renderInlineSegments(block.segments, block.focusPly || block.endPly || 1)}
                </p>
              )}

              {/* Sub-bloco de Variante Comentada pelo Autor (com lances clicáveis!) */}
              {block.variationSegments && block.variationSegments.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[13.5px] leading-relaxed text-[#004395]">
                  <span className="font-extrabold uppercase text-[11px] tracking-wider block text-[#0059c0] mb-1">
                    🧭 Variante Analisada no Livro (Clique nos lances para ver no tabuleiro):
                  </span>
                  {renderInlineSegments(
                    block.variationSegments,
                    block.focusPly || block.endPly || 1
                  )}
                </div>
              )}
            </article>
          );
        })}

        {/* Resumo de Lições-Chave do Capítulo */}
        {game.keyTakeawaysPt && game.keyTakeawaysPt.length > 0 && (
          <div className="bg-[#E2F6EA]/70 border border-[#16865E]/25 rounded-2xl p-4 space-y-2">
            <div className="text-[12px] font-extrabold uppercase tracking-wider text-[#006b49] flex items-center gap-1.5">
              <span>⭐</span>
              <span>Segredos dos Mestres neste Capítulo</span>
            </div>
            <ul className="space-y-1.5">
              {game.keyTakeawaysPt.map((item, i) => (
                <li
                  key={i}
                  className="text-[13.5px] text-[#0d1c2e] font-medium flex items-start gap-2"
                >
                  <span className="text-[#16865E] font-bold">•</span>
                  <span>{renderInlineSegments(
                    [{ type: 'text', content: item }],
                    currentPly || 1
                  )}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botão de Próximo Capítulo / Lição */}
        {hasNextChapterGame && onNextChapterGame && (
          <button
            type="button"
            onClick={onNextChapterGame}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#16865E] hover:bg-[#006b49] text-white font-extrabold text-[14px] shadow-[0_6px_18px_rgba(22,134,94,0.22)] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Avançar para o Próximo Capítulo / Partida do Livro</span>
            <span>▶</span>
          </button>
        )}
      </div>
    </div>
  );
};
