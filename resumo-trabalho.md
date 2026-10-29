# Resumo de Trabalho — Chess Mastery

Este documento funciona como a memória de longo prazo do aplicativo **Chess Mastery**, registrando a arquitetura, livros pré-instalados completos, leitura viva com lances clicáveis nos parágrafos, repertório teórico de aberturas, importador de estudos Google NotebookLM, decisões de design e histórico de versões.

---

## 🛠️ Stack e Infraestrutura
- **Backend Nativo**: Rust + Tauri v2 (`src-tauri/`) + Wrapper Nativo macOS Apple Silicon (`Cocoa` + `WKWebView` em `src-tauri/macos-native/main.m`) configurado com janela nativa na cor `--canvas-cream: #FFF9ED` do design system **`Playful Chess Studio` (Google Stitch)** e aparência `NSAppearanceNameAqua`.
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite 7 (`src/`) + Bundle Offline Autossuficiente (`dist/`).
- **Sistema de Design (`Playful Chess Studio` — Google Stitch)**:
  - Conceitos de referência em `/Volumes/Backup/antigravity01/Chess Mastery/stitch_kids_chess_design_system/`:
    - `playful_chess_studio/DESIGN.md`
    - `est_dio_de_xadrez_infantil_modo_aprender/code.html`
    - `est_dio_de_xadrez_infantil_biblioteca_m_gica/code.html`
    - `est_dio_de_xadrez_infantil_aberturas_desafios/code.html`
    - `est_dio_de_xadrez_infantil_conquistas_estrelas/code.html`
- **Regras de Xadrez & Notação**: `chess.js` + Motor Local de Avaliação Tática/Posicional (`src/lib/chess/localStockfishEngine.ts` e `dist/chess-engine.js`) otimizado para Macs Apple M2 com 8 GB de RAM (< 5 MB de consumo em memória), incluindo suporte a desambiguação redundante (`Rfe1`) e notação algébrica em português (`Cf3`, `Tfe1`).
- **Repositório Git**: `https://github.com/fabiobertaiolli/chessmastery.git` (branch `main`).
- **Instalador Nativo macOS Local**: `Chess Mastery_1.0.0_aarch64.dmg` (v2.0.0) na raiz da pasta `/Volumes/Backup/antigravity01/Chess Mastery/`.
- **Módulos Compartilhados (`shared/`)**:
  - `@shared/ui/chess/descriptiveNotation.js`: Conversor bidirecional de Notação Algébrica em Português (`Cf3`), Figurinos (`♘f3`), Internacional (`Nf3`) e Notação Descritiva Clássica em Português (`C3BR`, `P4R`) e Espanhol (`C3AR`, `P4R`).
  - `@shared/ui/chess/interactiveBookParser.js`: Motor de **Leitura Viva de Livros de Xadrez (`Live Book Reader`)** que tokeniza lances citados dentro dos parágrafos (linha principal e variantes em Notação Algébrica PT/EN, Figurino ou Descritiva Clássica) e sincroniza o tabuleiro em tempo real ao clicar em qualquer lance no texto.
  - `@shared/ui/chess/notebookStudyImporter.js`: Importador universal de **Estudos da Internet / Google NotebookLM** (Markdown, Texto de Caderno e PGN anotado) para **Aberturas & Defesas**, **Meio-Jogo** e **Finais**, gerando automaticamente capítulos interativos com lances clicáveis.
  - `@shared/ui/chess/openingsTheory.js`: Base de conhecimento e repertório de 18 aberturas e defesas (Abertas, Semi-Abertas, Fechadas, Índias e Flanco), códigos ECO, estruturas de peões, planos estratégicos e lances anotados.
  - `@shared/ui/chess/openingTrainer.js`: Motor pedagógico compartilhado do **Treinador Inteligente de Aberturas**, incluindo dicas progressivas em 3 níveis, avaliador construtivo de lances, resolvedor de citações históricas e fila inteligente de revisão (`ReviewQueueItem`).
  - `@shared/ui/chess/chessAudio.js`: Sintetizador acústico de peças de madeira via Web Audio API pura + narração PT-BR (`speechSynthesis`).

---

## ✨ Novidades da Versão 2.0.0 (Google Stitch `Playful Chess Studio` + Livros Completos com Lances Clicáveis + Tabuleiro Chess.com + Google NotebookLM)

1. **Implementação Integral das 4 Telas do Google Stitch (`Playful Chess Studio`)**:
   - **Paleta e Tipografia**: Fundo creme aconchegante (`#FFF9ED`), superfícies em marfim quente (`#F7EFE1`), madeira de cedro (`#B58A65`), esmeralda real (`#16865E`), ouro solar (`#F29D26`), coral tático (`#E85D4A`) e violeta mágico (`#7E57C2`), combinando `Fredoka`, `Plus Jakarta Sans` e `JetBrains Mono`.
   - **Tela 1 — `Aprender & Ler` (`est_dio_de_xadrez_infantil_modo_aprender`)**: Estúdio de estudo com o Tabuleiro Interativo Chess.com à esquerda e o painel unificado à direita contendo **Leitura Viva do Livro**, **3 Mentores Ilustrados (`Coruja Sábia`, `Mestre Dragão`, `Robô Stockfish`)** com narração em voz PT-BR e **Planilha Viva**.
   - **Tela 2 — `Biblioteca Mágica` (`est_dio_de_xadrez_infantil_biblioteca_m_gica`)**: Estante ilustrada dos 4 livros clássicos completos com filtros por fase do jogo (`Todos`, `Abertura`, `Meio-Jogo`, `Final`), busca instantânea e modal de inspeção das páginas originais escaneadas/OCR.
   - **Tela 3 — `Aberturas & Estudos` (`est_dio_de_xadrez_infantil_aberturas_desafios`)**: Catálogo das 18+ aberturas teóricas + aba dedicada para **Cadernos Importados da Internet / Google NotebookLM** filtráveis por `Aberturas & Defesas`, `Meio-Jogo` e `Finais`.
   - **Tela 4 — `Conquistas & Estrelas` (`est_dio_de_xadrez_infantil_conquistas_estrelas`)**: Sala de Troféus, contador de Estrelas Mágicas, medalhas desbloqueáveis por livro e Fila de Revisão Inteligente.

2. **Os 4 Livros Clássicos Completos com Leitura Viva e Lances Clicáveis nos Parágrafos (`InteractiveBookReader.tsx`)**:
   - Expansão completa dos capítulos dos 4 livros (`src/data/completeBookChapters.ts`, `src/data/preinstalledBooks.ts` e `dist/books-data.js`), totalizando **21 capítulos/estudos completos** validados lance a lance:
     - **Xadrez Básico (Orfeu D'Agostini)**: Capablanca–Steiner (1933), Steinitz–von Bardeleben (1895), Morphy na Ópera (1858), Botvinnik–Capablanca (1938), Posição de Lucena (1497), Ataque de Greco (`Bxh7+`), Colle–O'Hanlon (1930) e Defesa de Philidor (1777).
     - **Meu Sistema (Aaron Nimzowitsch)**: Nimzowitsch–Alapin (1914), Nimzowitsch–Salwe (1911), Partida Imortal do Zugzwang (Sämisch–Nimzowitsch, 1923), Nimzowitsch–Rubinstein (Dresden, 1926 — manobra `Ch1-f2!`) e O Moinho Imortal (Torre–Lasker, Moscou 1925 — `Bf6!!`).
     - **Vida e Partidas de Mikhail Tal**: Tal–Smyslov (1959), Botvinnik–Tal (1960), Tal–Tolush (1957) e Tal–Larsen (1965).
     - **Meus Grandes Predecessores Vol. 4 — Bobby Fischer (Garry Kasparov)**: A Partida do Século (Byrne–Fischer, 1956), Fischer–Spassky 6ª Partida (1972), Robert Byrne–Fischer (1963 — 11 em 11) e Fischer–Petrosian 7ª Partida (Candidatos, 1971).
   - **Lances Clicáveis em Tempo Real nos Parágrafos**: Cada lance mencionado dentro da narrativa (tanto lances da linha principal quanto variantes citadas entre parênteses) é renderizado como um chip interativo que anima o tabuleiro imediatamente ao ser clicado e destaca em verde esmeralda o lance ativo.

3. **Tabuleiro Interativo Nível Chess.com (`InteractiveChessboard.tsx`)**:
   - **Animação Suave de Deslizamento (`Cubic-Bezier Slide`)** das peças a cada lance clicado no parágrafo, na planilha ou jogado no tabuleiro.
   - **Clique-para-Mover + Drag-and-Drop** com anéis esmeralda de casas legais e capturas válidas.
   - **Seletor Flutuante de Promoção de Peão (`♕ ♖ ♗ ♘`)** sobre a casa de promoção.
   - **Setas Táticas e Marcações Multicores com Botão Direito** (`Botão Direito` = Verde Esmeralda, `Shift + Direito` = Coral, `Alt + Direito` = Ouro Solar, `Cmd + Direito` = Azul Céu).
   - **Exploração Livre ("E se eu jogar...?")** diretamente no tabuleiro com botão de 1 clique (`Voltar ao Livro`) para retomar o ponto exato da leitura.

4. **Importador de Estudos da Internet / Google NotebookLM (`NotebookStudyModal.tsx`)**:
   - Permite colar resumos gerados pelo **Google NotebookLM**, artigos da internet em Markdown ou PGNs comentados, classificando-os em **Aberturas & Defesas**, **Meio-Jogo** ou **Finais** com 3 templates prontos em 1 clique e persistência automática em `localStorage`.

---

## 📋 Backlog e Próximos Passos
1. Adicionar exportação em PGN comentado dos estudos importados via Google NotebookLM.
2. Permitir organizar cadernos importados em pastas personalizadas por repertório (Brancas / Pretas).
3. Adicionar modo de revisão espaçada (SRS) integrada aos lances críticos marcados nos livros.
