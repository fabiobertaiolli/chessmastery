import React, { useState } from 'react';
import { Chess } from 'chess.js';
import {
  parseNotebookLMStudy,
  STUDY_PHASES,
  type StudyPhaseId,
} from '@shared/ui/chess/notebookStudyImporter';
import type { BookLessonGame } from '@/types/chess';

interface NotebookStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStudy: (study: BookLessonGame) => void;
}

const SAMPLE_NOTEBOOKLM_TEMPLATES: Record<
  StudyPhaseId,
  { title: string; fen?: string; text: string }
> = {
  openings: {
    title: 'Abertura Catalã — O Bispo Dragão das Brancas em g2',
    text: `# Abertura Catalã — O Bispo Dragão das Brancas em g2

A Abertura Catalã combina a ocupação clássica do centro com 1. d4 Nf6 2. c4 e6 e o fianqueto hipermoderno 3. g3! d5 4. Bg2 Be7 5. Nf3 O-O 6. O-O dxc4.

Em vez de se apressar, as Brancas jogam 7. Qc2! a6 8. a4 Bd7 9. Qxc4 Bc6 10. Bf4 Bd5 11. Qd3 Nc6 12. Nc3 Bxf3 13. Bxf3 Nxd4 14. Bxb7 Ra7 15. Bg2, mantendo pressão duradoura na grande diagonal h1-a8!

- O Bispo de g2 pressiona toda a ala da Dama das Pretas.
- A recuperação do peão de c4 com 7. Dc2! ativa a Dama sem perder tempo.
- Excelente repertório posicional usado por Kramnik, Carlsen e Kasparov.`,
  },
  middlegame: {
    title: 'O Ataque das Maiorias e o Par de Bispos no Meio-Jogo',
    text: `# O Ataque das Maiorias e o Par de Bispos no Meio-Jogo

No meio-jogo, quando você possui maioria de peões no centro, o objetivo estratégico é preparar o avanço dinâmico e4-e5 ou d4-d5 apoiado pelas Torres. Veja a sequência: 1. e4 e6 2. d4 d5 3. Nc3 Nf6 4. Bg5 Be7 5. e5 Nfd7 6. Bxe7 Qxe7 7. f4 O-O 8. Nf3 c5 9. Bd3 Nc6.

Agora vem o golpe clássico de meio-jogo no roque: 10. Bxh7+! Kxh7 11. Ng5+ Kg6 12. Qd3+ f5 13. exf6+ Kxf6 14. O-O!, deixando o Rei adversário exposto no centro do tabuleiro!

- O avanço 5. e5 ganha espaço na ala do Rei e restringe os defensores pretos.
- O centro fechado permite lançar ataques diretos sobre o roque inimigo.`,
  },
  endgame: {
    title: 'Final Prático: A Regra da Oposição e Casas Críticas',
    fen: '8/8/4k3/8/4P3/4K3/8/8 w - - 0 1',
    text: `# Final Prático: A Regra da Oposição e Casas Críticas

Nos finais de Rei e Peão contra Rei, o segredo para coroar o peão é conquistar a Oposição com o Rei NA FRENTE do peão! Na posição inicial, o lance 1. Kd4! conquista o espaço vital (cuidado: avançar 1. e5? permitiria 1... Kxe5 com empate imediato).

Após 1. Kd4 Kd6, as Brancas usam o lance de espera do peão ou tomam a oposição lateral/direta: 2. e5+ Ke6 3. Ke4! Ke7 4. Kd5 Kd7 5. e6+ Ke7 6. Ke5! Ke8 7. Kd6 Kd8 8. e7+ Ke8 9. Ke6, forçando o Rei preto a abandonar a casa de promoção!

- O Rei deve sempre caminhar na frente do peão nos finais elementares.
- Quando os Reis estão frente a frente com uma casa entre eles, quem NÃO tem a vez domina a Oposição.`,
  },
};

export const NotebookStudyModal: React.FC<NotebookStudyModalProps> = ({
  isOpen,
  onClose,
  onSaveStudy,
}) => {
  const [phase, setPhase] = useState<StudyPhaseId>('openings');
  const [titlePt, setTitlePt] = useState('');
  const [heroColor, setHeroColor] = useState<'w' | 'b'>('w');
  const [initialFen, setInitialFen] = useState('');
  const [rawText, setRawText] = useState(SAMPLE_NOTEBOOKLM_TEMPLATES.openings.text);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoadSample = (targetPhase: StudyPhaseId) => {
    setPhase(targetPhase);
    const tpl = SAMPLE_NOTEBOOKLM_TEMPLATES[targetPhase];
    setTitlePt(tpl.title);
    setInitialFen(tpl.fen || '');
    setRawText(tpl.text);
    setErrorMsg(null);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setErrorMsg('Cole o texto do estudo do Google NotebookLM ou PGN antes de importar.');
      return;
    }

    try {
      const parsed = parseNotebookLMStudy({
        rawText,
        titlePt: titlePt.trim() || undefined,
        phase,
        heroColor,
        initialFen: initialFen.trim() || undefined,
        createChessInstance: (fen?: string) => (fen ? new Chess(fen) : new Chess()),
      });

      onSaveStudy(parsed);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Não foi possível processar o estudo. Verifique o FEN ou os lances.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1c2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFF9ED] border-2 border-[#16865E] rounded-3xl max-w-2xl w-full p-6 shadow-[0_24px_60px_rgba(13,28,46,0.3)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2F6EA] text-[#006b49] text-[11px] font-extrabold uppercase tracking-wider">
              📓 Integração Google NotebookLM & Internet
            </span>
            <h2 className="text-[22px] font-extrabold text-[#0d1c2e] mt-1">
              Importar Estudo Interativo (Aberturas, Meio-Jogo ou Finais)
            </h2>
            <p className="text-[13px] text-[#3e4942]">
              Cole resumos gerados pelo <strong>Google NotebookLM</strong>, notas da internet ou PGNs.
              Todos os lances citados no texto viram botões clicáveis sincronizados com o tabuleiro!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E6DEC8] text-[#3e4942] hover:text-[#0d1c2e] flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Seletor de Fase do Jogo + Templates Rápidos */}
        <div className="mb-4">
          <label className="block text-[12px] font-extrabold uppercase tracking-wider text-[#3e4942] mb-2">
            1. Escolha a Fase do Jogo (ou carregue um modelo de exemplo):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(Object.keys(STUDY_PHASES) as StudyPhaseId[]).map((pKey) => {
              const info = STUDY_PHASES[pKey];
              const isSelected = phase === pKey;
              return (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => handleLoadSample(pKey)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#16865E] text-white border-[#16865E] shadow-sm'
                      : 'bg-white text-[#0d1c2e] border-[#E6DEC8] hover:border-[#16865E]/50'
                  }`}
                >
                  <div className="text-[11px] font-bold opacity-80">{info.badgePt}</div>
                  <div className="text-[14px] font-extrabold mt-0.5">{info.labelPt}</div>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleImport} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-bold text-[#0d1c2e] mb-1">
                Título do Estudo (Opcional — extraído automaticamente se vazio)
              </label>
              <input
                type="text"
                value={titlePt}
                onChange={(e) => setTitlePt(e.target.value)}
                placeholder="Ex: Defesa Índia da Dama — Plano de Controle de e4"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6DEC8] text-[14px] text-[#0d1c2e] focus:outline-none focus:border-[#16865E]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#0d1c2e] mb-1">
                Perspectiva do Tabuleiro
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-xl border border-[#E6DEC8]">
                <button
                  type="button"
                  onClick={() => setHeroColor('w')}
                  className={`py-1.5 rounded-lg text-[12px] font-extrabold cursor-pointer ${
                    heroColor === 'w'
                      ? 'bg-[#16865E] text-white'
                      : 'text-[#3e4942] hover:bg-[#FFF9ED]'
                  }`}
                >
                  ⚪ Brancas
                </button>
                <button
                  type="button"
                  onClick={() => setHeroColor('b')}
                  className={`py-1.5 rounded-lg text-[12px] font-extrabold cursor-pointer ${
                    heroColor === 'b'
                      ? 'bg-[#16865E] text-white'
                      : 'text-[#3e4942] hover:bg-[#FFF9ED]'
                  }`}
                >
                  ⚫ Pretas
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#0d1c2e] mb-1">
              Posição Inicial FEN (Opcional — útil para estudos de Finais ou Meio-Jogo)
            </label>
            <input
              type="text"
              value={initialFen}
              onChange={(e) => setInitialFen(e.target.value)}
              placeholder="Deixe em branco para começar da posição inicial padrão do xadrez"
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E6DEC8] text-[13px] font-mono text-[#0d1c2e] focus:outline-none focus:border-[#16865E]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#0d1c2e] mb-1">
              Texto do Caderno Google NotebookLM / Artigo / PGN Anotado:
            </label>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Cole aqui o texto com parágrafos explicativos e lances (ex: 1. d4 Cf6 2. c4 e6 3. g3...)"
              className="w-full p-3.5 rounded-2xl bg-white border border-[#E6DEC8] text-[14px] leading-relaxed text-[#0d1c2e] focus:outline-none focus:border-[#16865E]"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] text-[#93000a] text-[13px] font-bold">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E6DEC8] text-[#3e4942] font-bold text-[13px] cursor-pointer hover:bg-[#FBF8F1]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#16865E] hover:bg-[#006b49] text-white font-extrabold text-[14px] shadow-[0_6px_16px_rgba(22,134,94,0.25)] cursor-pointer transition-all"
            >
              ✨ Transformar em Estudo Interativo & Abrir no Tabuleiro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
