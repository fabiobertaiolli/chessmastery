import type { NotationMode } from '@shared/ui/chess/descriptiveNotation';

export type { NotationMode };

export type BoardThemeId =
  | 'stitch_wood'
  | 'lichess_wood'
  | 'chesscom_green'
  | 'walnut_luxury'
  | 'slate_ice';

export type LanguageDisplayMode = 'pt' | 'original' | 'bilingual';

export type AppStudyMode = 'study' | 'guess' | 'explore';

export type MoveEvaluationBadge = '!!' | '!' | '!?' | '?!' | '?' | '??';

export type StudyPhaseId = 'openings' | 'middlegame' | 'endgame';

export interface BoardArrow {
  from: string; // ex: 'f3'
  to: string;   // ex: 'd4'
  color?: 'emerald' | 'amber' | 'rose' | 'sky';
}

export interface SquareHighlight {
  square: string; // ex: 'd5'
  color: 'emerald' | 'amber' | 'rose' | 'sky';
}

export interface MoveAnnotationData {
  ply: number; // 1 = 1. Brancas, 2 = 1... Pretas, etc.
  commentPt: string;
  commentOriginal?: string;
  badge?: MoveEvaluationBadge;
  hintPt?: string; // Dica posicional sem spoiler para o Modo Adivinhe
  arrows?: BoardArrow[];
  highlights?: SquareHighlight[];
  alternativeLinePt?: string; // Explicação de variante secundária do livro (com lances clicáveis)
}

export interface ReadingSectionPt {
  headingPt?: string | null;
  bodyPt: string; // Parágrafo editorial fluido com lances clicáveis em tempo real
  focusPly?: number; // Ply de referência quando o usuário está lendo esta seção
}

export interface BookLessonGame {
  id: string;
  titlePt: string;
  titleOriginal?: string;
  white: string;
  black: string;
  event: string;
  year: string;
  result: '1-0' | '0-1' | '1/2-1/2';
  eco?: string;
  openingNamePt: string;
  studyPhase?: StudyPhaseId;
  heroColor: 'w' | 'b'; // Orientação recomendada e lado que o estudante joga no Modo Adivinhe
  initialFen?: string; // Opcional para estudos de finais ou meio-jogo (ex: Lucena / Philidor)
  introPt: string;
  introOriginal?: string;
  readingSectionsPt?: ReadingSectionPt[]; // Parágrafos adicionais de leitura integral do livro
  keyTakeawaysPt: string[];
  movesSan: string[]; // Lista canônica validada pelo chess.js
  annotations: Record<number, MoveAnnotationData>; // Indexado por ply (1..N)
  isCustomNotebookStudy?: boolean;
}

export interface BookChapter {
  id: string;
  number: number;
  titlePt: string;
  titleOriginal?: string;
  subtitlePt: string;
  games: BookLessonGame[];
}

export interface ChessBook {
  id: string;
  titlePt: string;
  titleOriginal: string;
  author: string;
  originalLanguage: 'pt' | 'es' | 'en';
  originalNotation: 'descriptive_pt' | 'descriptive_es' | 'algebraic_en';
  publicationYear: string;
  coverAccent: string;
  badgeText: string;
  descriptionPt: string;
  sourceFileName: string;
  chapters: BookChapter[];
}

export interface ComputedPlyStep {
  ply: number;
  moveNumber: number;
  color: 'w' | 'b';
  san: string;
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  fenBefore: string;
  fenAfter: string;
  inCheck: boolean;
  isCheckmate: boolean;
  isCastling: boolean;
  descriptivePt: string;
  descriptiveEs: string;
  annotation?: MoveAnnotationData;
}

export interface EngineEvaluationResult {
  scoreCp: number; // Centipawns do ponto de vista das Brancas (+120 = +1.20)
  mateIn: number | null;
  bestMoveSan: string;
  bestMoveFrom: string;
  bestMoveTo: string;
  pvLineSan: string[];
  depth: number;
  explanationPt: string;
}

export type StudySourceType = 'book_game' | 'opening' | 'custom_study';

export type NavDestination = 'learn' | 'library' | 'openings' | 'achievements';

export type AppExperienceMode = 'aprender' | 'explorador';
