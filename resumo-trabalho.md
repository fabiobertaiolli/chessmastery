# Resumo de Trabalho — Chess Mastery

Este documento funciona como a memória de longo prazo do aplicativo **Chess Mastery**, registrando a arquitetura, livros pré-instalados, decisões de design e histórico de versões.

---

## 🛠️ Stack e Infraestrutura
- **Backend Nativo**: Rust + Tauri v2 (`src-tauri/`) + Wrapper Nativo macOS Apple Silicon (`Cocoa` + `WKWebView` em `src-tauri/macos-native/main.m`) para empacotamento direto sem dependência externa.
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite 7 (`src/`) + Bundle Offline Autossuficiente (`dist/`).
- **Regras de Xadrez**: `chess.js` + Motor Local de Avaliação Tática/Posicional (`src/lib/chess/localStockfishEngine.ts` e `dist/chess-engine.js`) otimizado para Macs Apple M2 com 8 GB de RAM (< 5 MB de consumo em memória).
- **Ícone Oficial Personalizado**: Gerado em RGBA multi-resolução (`32x32`, `64x64`, `128x128`, `128x128@2x`, `icon.png`, `icon.icns`) em `src-tauri/icons/` e `public/app-icon.png`.
- **Repositório Git**: `https://github.com/fabiobertaiolli/chessmastery.git` (branch `main`).
- **Download Público na Nuvem (GitHub Releases v1.0.0)**:
  - Link da Release: `https://github.com/fabiobertaiolli/chessmastery/releases/tag/v1.0.0`
  - Download Direto do DMG: `https://github.com/fabiobertaiolli/chessmastery/releases/download/v1.0.0/Chess_Mastery_1.0.0_aarch64.dmg`
- **Instalador Nativo macOS Local**: `Chess Mastery_1.0.0_aarch64.dmg` na raiz da pasta `/Volumes/Backup/antigravity01/Chess Mastery/`.
- **Módulos Compartilhados (`shared/`)**:
  - `@shared/ui/chess/descriptiveNotation.js`: Conversor bidirecional de Notação Algébrica em Português (`Cf3`), Figurinos (`♘f3`), Internacional (`Nf3`) e Notação Descritiva Clássica em Português (`C3BR`, `P4R`) e Espanhol (`C3AR`, `P4R`).
  - `@shared/ui/chess/chessAudio.js`: Sintetizador acústico de peças de madeira via Web Audio API pura.
  - `@shared/ui/css/glassmorphism.css`: Utilitários visuais compartilhados do workspace.

---

## 📚 Biblioteca Pré-Instalada e Pré-Traduzida (Versão 1.0.0 — 12 Clássicos, 647 Meio-Lances Validados)
Os livros físicos/ebooks da pasta `Books/` foram higienizados, validados lance a lance via JavaScriptCore (`jsc`) e traduzidos para o Português diretamente na base nativa do app (`src/data/preinstalledBooks.ts` e `dist/books-data.js`):

1. **Xadrez Básico — Orfeu Gilberto D'Agostini (Português):**
   - Conversão bidirecional da Notação Descritiva original (`1. P4R P4R 2. C3BR C3BD`) para Algébrica moderna (`1. e4 e5 2. Cf3 Cc6`).
   - Capítulos e Partidas:
     - *Capablanca vs. Herman Steiner (Nova York, 1931)* — Domínio das Colunas e Sacrifício no Roque
     - *Wilhelm Steinitz vs. Curt von Bardeleben (Hastings, 1895)* — O Rei no Centro e o Sacrifício Imortal `17. d5!`, `22. Txe7+!!`
     - *Paul Morphy vs. Duque de Brunswick & Conde Isouard (Ópera de Paris, 1858)* — Desenvolvimento Rápido e `16. Db8+!!`
     - *Mikhail Botvinnik vs. José Raúl Capablanca (Torneio AVRO, 1938)* — Estratégia Superior e `30. Ba3!!`
     - *A Posição de Lucena (1497)* — Finais Clássicos: Construindo a Ponte (`4. Td4!`)
2. **Meu Sistema (Mi Sistema) — Aron Nimzowitsch (Traduzido ES → PT + Original em Espanhol):**
   - Capítulos e Partidas:
     - *Aron Nimzowitsch vs. Simon Alapin (Vilna, 1912)* — Vantagem de Desenvolvimento e Ataque Direto ao Rei no Centro
     - *Aron Nimzowitsch vs. Georg Salwe (Carlsbad, 1911)* — A Cadeia de Peões, a Casa Forte `e5` e o Bloqueio (`12. Bf4!`)
     - *Friedrich Sämisch vs. Aron Nimzowitsch (Copenhague, 1923)* — A Partida Imortal do Zugzwang (`25...h6!!`)
3. **Vida e Partidas de Mikhail Tal — Mikhail Tal (Traduzido EN → PT + Original em Inglês):**
   - Capítulos e Partidas:
     - *Mikhail Tal vs. Vasily Smyslov (Torneio de Candidatos de Bled, 1959)* — Sacrifício Intuitivo e Caos Tático (`14. Cd5!`, `19. Dxf7+!!`)
     - *Mikhail Botvinnik vs. Mikhail Tal ( Campeonato Mundial, Moscou 1960, 6ª Partida)* — O Cavalo Fantasma em `f4` (`21...Cf4!!`)
4. **Meus Grandes Predecessores, Vol. 4: Bobby Fischer — Garry Kasparov (Traduzido EN → PT + Original em Inglês):**
   - Capítulos e Partidas:
     - *Donald Byrne vs. Bobby Fischer (Nova York, 1956)* — A Partida do Século (`11...Ca4!!`, `17...Be6!!`)
     - *Bobby Fischer vs. Boris Spassky (Campeonato Mundial, Reykjavik 1972, 6ª Partida)* — Harmonia Clássica no Gambito da Dama (`20. e4!`, `38. Txf6!`)

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
