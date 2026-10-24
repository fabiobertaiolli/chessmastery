import React from 'react';
import { ChessPieceSvg } from './ChessPiecesSvg';

interface EvaluationBarProps {
  scoreCp: number; // Centipawns do ponto de vista das Brancas
  mateIn: number | null;
  flipped: boolean;
  visible: boolean;
}

export const VerticalEvaluationBar: React.FC<EvaluationBarProps> = ({
  scoreCp,
  mateIn,
  flipped,
  visible,
}) => {
  if (!visible) return null;

  // Converte scoreCp (-1000..+1000) em porcentagem de preenchimento para as Brancas (5% a 95%)
  const sigmoid = 1 / (1 + Math.exp(-scoreCp / 260));
  const whitePercent = mateIn !== null
    ? scoreCp > 0
      ? 100
      : 0
    : Math.min(95, Math.max(5, Math.round(sigmoid * 100)));

  const displayScore =
    mateIn !== null
      ? `M${Math.abs(mateIn)}`
      : `${scoreCp > 0 ? '+' : ''}${(scoreCp / 100).toFixed(1)}`;

  const whiteOnBottom = !flipped;

  return (
    <div className="w-7 h-full rounded-full overflow-hidden bg-zinc-900 border border-white/10 flex flex-col relative shadow-inner select-none">
      {whiteOnBottom ? (
        <>
          <div
            className="w-full bg-[#1e2028] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ height: `${100 - whitePercent}%` }}
          />
          <div
            className="w-full bg-[#f1f5f9] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ height: `${whitePercent}%` }}
          />
        </>
      ) : (
        <>
          <div
            className="w-full bg-[#f1f5f9] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ height: `${whitePercent}%` }}
          />
          <div
            className="w-full bg-[#1e2028] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ height: `${100 - whitePercent}%` }}
          />
        </>
      )}

      <span
        className={`absolute left-0 right-0 text-center text-[10px] font-mono font-bold tracking-tighter ${
          scoreCp >= 0
            ? whiteOnBottom
              ? 'bottom-2 text-zinc-900'
              : 'top-2 text-zinc-900'
            : whiteOnBottom
            ? 'top-2 text-zinc-200'
            : 'bottom-2 text-zinc-200'
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
  capturedPieces: string[]; // tipos de peças capturadas por este jogador
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
      className={`flex items-center justify-between px-3.5 py-2 rounded-xl border transition-all duration-200 ${
        isTurn
          ? 'bg-zinc-900/90 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
          : 'bg-zinc-900/50 border-white/[0.06]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center border text-xs font-bold shrink-0 ${
            color === 'w'
              ? 'bg-zinc-100 text-zinc-900 border-white'
              : 'bg-zinc-950 text-zinc-100 border-zinc-700'
          }`}
        >
          {color === 'w' ? 'B' : 'P'}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-100 truncate">{name}</span>
            {isTurn && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Vez de jogar
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-zinc-400 truncate">{subtitle}</p>}
        </div>
      </div>

      {/* Peças capturadas + vantagem material (+1, +3...) */}
      <div className="flex items-center gap-1 shrink-0">
        <div className="flex items-center -space-x-1.5">
          {capturedPieces.slice(0, 12).map((pieceType, idx) => (
            <div key={`${pieceType}-${idx}`} className="w-4 h-4">
              <ChessPieceSvg color={capturedColor} type={pieceType} />
            </div>
          ))}
        </div>
        {materialAdvantage > 0 && (
          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-white/[0.07] text-[11px] font-mono font-semibold text-emerald-300">
            +{materialAdvantage}
          </span>
        )}
      </div>
    </div>
  );
};
