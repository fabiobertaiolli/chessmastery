# Resumo de Trabalho — Chess Mastery

Este documento funciona como a memória de longo prazo do aplicativo **Chess Mastery**, registrando a arquitetura, livros pré-instalados, repertório teórico de aberturas, decisões de design e histórico de versões.

---

## 🛠️ Stack e Infraestrutura
- **Backend Nativo**: Rust + Tauri v2 (`src-tauri/`) + Wrapper Nativo macOS Apple Silicon (`Cocoa` + `WKWebView` em `src-tauri/macos-native/main.m`) para empacotamento direto e instantâneo sem dependência externa.
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite 7 (`src/`) + Bundle Offline Autossuficiente (`dist/`).
- **Regras de Xadrez & Notação**: `chess.js` + Motor Local de Avaliação Tática/Posicional (`src/lib/chess/localStockfishEngine.ts` e `dist/chess-engine.js`) otimizado para Macs Apple M2 com 8 GB de RAM (< 5 MB de consumo em memória).
- **Repositório Git**: `https://github.com/fabiobertaiolli/chessmastery.git` (branch `main`).
- **Instalador Nativo macOS Local**: `Chess Mastery_1.0.0_aarch64.dmg` (v1.1.0) na raiz da pasta `/Volumes/Backup/antigravity01/Chess Mastery/`.
- **Módulos Compartilhados (`shared/`)**:
  - `@shared/ui/chess/descriptiveNotation.js`: Conversor bidirecional de Notação Algébrica em Português (`Cf3`), Figurinos (`♘f3`), Internacional (`Nf3`) e Notação Descritiva Clássica em Português (`C3BR`, `P4R`) e Espanhol (`C3AR`, `P4R`).
  - `@shared/ui/chess/openingsTheory.js` (Novo na v1.1.0): Base de conhecimento e repertório de aberturas e defesas (Abertas, Semi-Abertas, Fechadas, Índias e Flanco), códigos ECO, estruturas de peões, planos estratégicos e lances anotados.
  - `@shared/ui/chess/chessAudio.js`: Sintetizador acústico de peças de madeira via Web Audio API pura.
  - `@shared/ui/css/glassmorphism.css`: Utilitários visuais compartilhados do workspace.

---

## 🌟 Novidades da Versão 1.1.0 (Overhaul de UI/UX, Acordeão de Livros e Repertório de Aberturas)

Em resposta direta ao feedback de usabilidade ("O jogo chessmastery está muito confuso..."), foi aplicada a skill de engenharia visual de alto padrão (`frontend-design` / `high-end-visual-design`) redesenhando a experiência completa:

1. **Aba Lateral Esquerda com Todos os Livros Carregados (Acordeão Multi-Livros)**:
   - Os livros foram removidos dos botões aglomerados no topo e integrados na barra lateral esquerda.
   - Todos os 4 livros (*Xadrez Básico*, *Meu Sistema*, *Mikhail Tal*, *Bobby Fischer*) agora são acessíveis simultaneamente via cartões expansíveis em acordeão (`book-card`).
   - Cada livro exibe capa estilizada, autor, ano de publicação, quantidade de capítulos e status.

2. **Modo Isolado de Capítulos ("Acessados de modo isolado")**:
   - Ao clicar sobre um capítulo de qualquer livro, a barra lateral entra no **Modo de Capítulo Isolado**.
   - O usuário ganha uma visão limpa e focada exclusivamente naquele capítulo:
     - Botão `← Voltar aos Capítulos` com breadcrumb do livro.
     - Card Hero do capítulo destacando objetivos pedagógicos e páginas de referência.
     - Lista dedicada das partidas correspondentes com indicação de vitória/empate, ano e abertura.

3. **Novo Menu e Navegador de Aberturas & Defesas**:
   - Menu e seletor dedicado no topo e na barra lateral para explorar a teoria das principais aberturas e defesas:
     - ⚔️ **Aberturas Abertas (1.e4 e5)**: Italiana (Giuoco Piano), Gambito Evans, Ruy López (Defesa Morphy), Ruy López (Variante das Trocas), Quatro Cavalos, Defesa Petroff.
     - 🛡️ **Defesas Semi-Abertas (1.e4 outros)**: Siciliana Najdorf, Siciliana Dragão, Francesa do Avanço, Caro-Kann Clássica.
     - 🏰 **Aberturas Fechadas (1.d4 d5)**: Gambito da Dama Recusado (QGD), Gambito da Dama Aceito (QGA), Defesa Eslava, Sistema London.
     - ⚡ **Defesas Semi-Fechadas & Índias (1.d4 Cf6)**: Defesa Índia do Rei (KID: Mar del Plata), Defesa Nimzoíndia (Rubinstein), Defesa Grünfeld (Trocas).
     - 🌐 **Aberturas de Flanco**: Abertura Inglesa (Quatro Cavalos).
   - Ao clicar em qualquer abertura:
     - A sequência teórica é carregada no tabuleiro com setas e destaques visuais.
     - O painel direito exibe: Código ECO, Visão Geral, **Planos Estratégicos das Brancas**, **Planos & Defesa das Pretas**, **Estrutura de Peões & Casas Chave** e **Armadilhas Táticas Típicas**.
     - Botão com link direto para a Partida Modelo dos livros clássicos que aplicou a linha na prática!

4. **Busca Unificada em Tempo Real**:
   - Campo de pesquisa inteligente no topo da barra lateral para filtrar instantaneamente por livros, autores, capítulos, nomes de aberturas, códigos ECO ou mestres.

5. **Design System "Obsidian Luxury & Grandmaster Atelier"**:
   - Fundo gradiente radial escuro OLED (`#080a0f` / `#151926`).
   - Arquitetura de duplo-bezel (*Doppelrand*) no tabuleiro com sombras profundas e reflexos suaves.
   - Faixa Rosetta de conversão de lances em tempo real (Algébrica PT `Cf3`, Figurino `♘f3`, Descritiva PT `C3BR`, Descritiva ES `C3AR`, SAN `Nf3`).

---

## 📚 Biblioteca Pré-Instalada e Pré-Traduzida (12 Clássicos, 647 Meio-Lances Validados)

1. **Xadrez Básico — Orfeu Gilberto D'Agostini (Português):**
   - Capítulos: *As Partidas Modelo e as Razões dos Lances*, *A Arte do Ataque e o Desenvolvimento Rápido*, *Estratégia Superior*, *Finais Clássicos Indispensáveis*.
   - Partidas: *Capablanca vs. Steiner*, *Steinitz vs. Bardeleben*, *Morphy vs. Duque de Brunswick*, *Botvinnik vs. Capablanca*, *Posição de Lucena*.
2. **Meu Sistema (Mi Sistema) — Aron Nimzowitsch (Traduzido ES → PT):**
   - Capítulos: *Vantagem de Desenvolvimento*, *A Cadeia de Peões*, *A Arte do Bloqueio*.
   - Partidas: *Nimzowitsch vs. Alapin*, *Nimzowitsch vs. Salwe*, *Sämisch vs. Nimzowitsch (Zugzwang)*.
3. **Vida e Partidas de Mikhail Tal — Mikhail Tal (Traduzido EN → PT):**
   - Capítulos: *O Ataque Intuitivo*, *O Cavalo em f4*.
   - Partidas: *Tal vs. Smyslov*, *Botvinnik vs. Tal (6ª Partida)*.
4. **Meus Grandes Predecessores, Vol. 4: Bobby Fischer — Garry Kasparov (Traduzido EN → PT):**
   - Capítulos: *A Partida do Século*, *O Match de Reykjavik*.
   - Partidas: *Byrne vs. Fischer*, *Fischer vs. Spassky (6ª Partida)*.

---

## 📋 Backlog e Próximos Passos
1. Adicionar módulo de Treino de Finais com posições de D'Agostini (*Xadrez Básico*) contra a engine local.
2. Expansão contínua das linhas de aberturas com mais variantes secundárias da Siciliana (Paulsen, Scheveningen, Sveshnikov).
3. Importador interativo de arquivos PGN locais do usuário com geração automática de anotações descritivas.
