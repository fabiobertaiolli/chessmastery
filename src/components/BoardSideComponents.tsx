import React from 'react';
import { ChessPieceSvg } from './ChessPiecesSvg';
import type { EngineEvaluationResult } from '@/types/chess';

interface EvaluationBarProps {
  evaluation?: EngineEvaluationResult;
  scoreCp?: number;
  mateIn?: number | null;
  flipped: boolean;
  visible?: boolean;
}

export const VerticalEvaluationBar: React.FC<EvaluationBarProps> = ({
  evaluation,
  scoreCp: propScoreCp,
  mateIn: propMateIn,
  flipped,
  visible = true,
}) => {
  if (!visible) return null;

  const scoreCp = evaluation ? evaluation.scoreCp : propScoreCp ?? 0;
  const mateIn = evaluation ? evaluation.mateIn : propMateIn ?? null;

  // Converte scoreCp (-1000..+1000) em porcentagem de preenchimento para as Brancas (5% a 95%)
  const sigmoid = 1 / (1 + Math.exp(-scoreCp / 260));
  const whitePercent =
    mateIn !== null
      ? scoreCp >= 0
        ? 100
        : 0
      : Math.min(95, Math.max(5, Math.round(sigmoid * 100)));

  const displayScore =
    mateIn !== null
      ? `M${Math.abs(mateIn)}`
      : `${scoreCp > 0 ? '+' : ''}${(scoreCp / 100).toFixed(1)}`;

  const whiteOnBottom = !flipped;

  return (
    <div
      className="w-6.5 h-full rounded-2xl overflow-hidden bg-[#233144] border-2 border-[#E6DEC8] flex flex-col relative shadow-[0_6px_18px_rgba(181,138,101,0.12)] select-none"
      title={`Avaliação Stockfish Local: ${displayScore}`}
    >
      {whiteOnBottom ? (
        <>
          <div
            className="w-full bg-[#233144] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ height: `${100 - whitePercent}%` }}
          />
          <div
            className="w-full bg-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ height: `${whitePercent}%` }}
          />
        </>
      ) : (
        <>
          <div
            className="w-full bg-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ height: `${whitePercent}%` }}
          />
          <div
            className="w-full bg-[#233144] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ height: `${100 - whitePercent}%` }}
          />
        </>
      )}

      <span
        className={`absolute left-0 right-0 text-center text-[10px] font-extrabold tracking-tighter ${
          scoreCp >= 0
            ? whiteOnBottom
              ? 'bottom-2 text-[#006b49]'
              : 'top-2 text-[#006b49]'
            : whiteOnBottom
            ? 'top-2 text-white'
            : 'bottom-2 text-white'
        }`}
      >
        {displayScore}
      </span>
    </div>
  );
};

interface PlayerBarProps {
  name: string;
  color: 'w' | 'b';
  isTurn: boolean;
  capturedPieces: string[];
  materialAdvantage: number;
  subtitle?: string;
}

export const PlayerBannerBar: React.FC<PlayerBarProps> = ({
  name,
  color,
  isTurn,
  capturedPieces,
  materialAdvantage,
  subtitle,
}) => {
  const capturedColor = color === 'w' ? 'b' : 'w';

  return (
    <div
      className={`flex items-center justify-between px-3.5 py-2 rounded-2xl border transition-all duration-200 ${
        isTurn
          ? 'bg-white border-[#16865E] shadow-xs'
          : 'bg-[#FBF8F1] border-[#E6DEC8]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center border text-xs font-extrabold shrink-0 ${
            color === 'w'
              ? 'bg-[#FEF3C7] text-[#855300] border-[#F59E0B]/40'
              : 'bg-[#233144] text-white border-[#0d1c2e]'
          }`}
        >
          {color === 'w' ? 'B' : 'P'}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#0d1c2e] truncate">{name}</span>
            {isTurn && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E2F6EA] text-[#006b49]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16865E] animate-pulse" />
                Vez de jogar
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-[#3e4942] truncate">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <div className="flex items-center -space-x-1.5">
          {capturedPieces.slice(0, 12).map((pieceType, idx) => (
            <div key={`${pieceType}-${idx}`} className="w-4 h-4">
              <ChessPieceSvg color={capturedColor} type={pieceType} />
            </div>
          ))}
        </div>
        {materialAdvantage > 0 && (
          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-[#E2F6EA] text-[11px] font-extrabold text-[#006b49]">
            +{materialAdvantage}
          </span>
        )}
      </div>
    </div>
  );
};
