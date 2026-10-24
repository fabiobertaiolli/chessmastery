# Resumo de Trabalho — Chess Mastery

Este documento funciona como a memória de longo prazo do aplicativo **Chess Mastery**, registrando a arquitetura, livros pré-instalados, decisões de design e histórico de versões.

---

## 🛠️ Stack e Infraestrutura
- **Backend Nativo**: Rust + Tauri v2 (`src-tauri/`)
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite 7
- **Regras de Xadrez**: `chess.js` + Motor Local de Avaliação Tática/Posicional (`src/lib/chess/localStockfishEngine.ts`) otimizado para Macs Apple M2 com 8 GB de RAM (< 5 MB de consumo em memória).
- **Módulos Compartilhados (`shared/`)**:
  - `@shared/ui/chess/descriptiveNotation.js`: Conversor bidirecional de Notação Algébrica em Português (`Cf3`), Figurinos (`♘f3`), Internacional (`Nf3`) e Notação Descritiva Clássica em Português (`C3BR`, `P4R`) e Espanhol (`C3AR`, `P4R`).
  - `@shared/ui/chess/chessAudio.js`: Sintetizador acústico de peças de madeira via Web Audio API pura.
  - `@shared/ui/css/glassmorphism.css`: Utilitários visuais compartilhados do workspace.

---

## 📚 Biblioteca Pré-Instalada e Pré-Traduzida (Versão 1.0.0)
Os livros físicos/ebooks da pasta `Books/` foram higienizados, validados lance a lance no motor `chess.js` e traduzidos para o Português diretamente na base nativa do app (`src/data/preinstalledBooks.ts`):

1. **Xadrez Básico — Orfeu Gilberto D'Agostini (Português):**
   - Conversão bidirecional da Notação Descritiva original (`1. P4R P4R 2. C3BR C3BD`) para Algébrica moderna.
   - Capítulos: *As Partidas Modelo e as Razões dos Lances (Capablanca vs Steiner, Steinitz vs Von Bardeleben)*, *A Arte do Ataque (Morphy na Ópera de Paris)*, *Estratégia Superior (Botvinnik vs Capablanca AVRO 1938)* e *Finais Clássicos Indispensáveis (A Posição de Lucena — Construindo a Ponte)*.
2. **Meu Sistema (Mi Sistema) — Aron Nimzowitsch (Traduzido ES → PT + Original em Espanhol):**
   - Capítulos: *O Centro, o Desenvolvimento e a Liquidação (Nimzowitsch vs Alapin)*, *A Cadeia de Peões e o Bloqueio (Nimzowitsch vs Salwe, Carlsbad 1911)* e *Profilaxia, Restrição e a Partida Imortal do Zugzwang (Sämisch vs Nimzowitsch, Copenhague 1923)*.
3. **Vida e Partidas de Mikhail Tal — Mikhail Tal (Traduzido EN → PT + Original em Inglês):**
   - Capítulos: *O Torneio de Candidatos de 1959 (Tal vs Smyslov)* e *Campeão do Mundo — O Duelo com Botvinnik 1960 (6ª Partida, 21...Cf4!!)*.
4. **Meus Grandes Predecessores, Vol. 4: Bobby Fischer — Garry Kasparov (Traduzido EN → PT + Original em Inglês):**
   - Capítulos: *O Prodígio Solitário — A Partida do Século (Donald Byrne vs Fischer, 1956)* e *O Match do Século — Reykjavik 1972 (Fischer vs Spassky, 6ª Partida)*.

---

## 🎨 Decisões de Design e UX (Padrão Lichess / Chess.com)
- **Movimentação Dupla**: Suporte simultâneo a *Drag-and-Drop* com elevação da peça e *Click-to-Move* com indicadores de casas livres e anéis de captura.
- **Girar Tabuleiro (`Flip Board`)**: Botão dedicado + atalhos de teclado `X` (Chess.com) e `F` (Lichess), invertendo automaticamente a orientação quando o protagonista da partida joga de Pretas.
- **Modo Adivinhe o Lance (Spoiler-Free)**: Oculta integralmente a planilha de lances e as explicações do livro até que o estudante execute o lance correto no tabuleiro.
- **4 Temas de Tabuleiro**: *Lichess Wood*, *Tournament Green (Chess.com)*, *Walnut Classic* e *Obsidian Slate*.
- **Badges de Avaliação Tática (`!!`, `!`, `!?`)**: Exibidos diretamente no canto superior direito da casa de destino do lance no tabuleiro.

---

## 📋 Backlog e Próximos Passos (Para Futuras Versões)
1. Expansão de novos capítulos e partidas dos arquivos `.epub`/`.pdf` de `Books/` (como a *Partida Imortal de Anderssen*, *Capablanca vs Kostich* e *Tal vs Larsen*).
2. Adição de novos livros à pasta `Books/` para pré-processamento e tradução automática no lançamento da versão 1.1.0.
3. Modo de Treino de Finais interativo contra o motor local a partir de posições temáticas do *Xadrez Básico*.
