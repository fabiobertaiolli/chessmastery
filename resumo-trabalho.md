# Resumo de Trabalho — Chess Mastery

Este documento funciona como a memória de longo prazo do aplicativo **Chess Mastery**, registrando a arquitetura, livros pré-instalados, repertório teórico de aberturas, decisões de design e histórico de versões.

---

## 🛠️ Stack e Infraestrutura
- **Backend Nativo**: Rust + Tauri v2 (`src-tauri/`) + Wrapper Nativo macOS Apple Silicon (`Cocoa` + `WKWebView` em `src-tauri/macos-native/main.m`) configurado com janela nativa na cor `--ground: #f4f6f5` do `framed-sheet` e aparência `NSAppearanceNameAqua`.
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite 7 (`src/`) + Bundle Offline Autossuficiente (`dist/`).
- **Sistema de Design (`taste-skill` v2.1)**: Estilo **`framed-sheet`** + Shell **`framed-sheet`** copiado e integrado em `/Volumes/Backup/antigravity01/.agents/skills/taste-skill`.
- **Regras de Xadrez & Notação**: `chess.js` + Motor Local de Avaliação Tática/Posicional (`src/lib/chess/localStockfishEngine.ts` e `dist/chess-engine.js`) otimizado para Macs Apple M2 com 8 GB de RAM (< 5 MB de consumo em memória).
- **Repositório Git**: `https://github.com/fabiobertaiolli/chessmastery.git` (branch `main`).
- **Instalador Nativo macOS Local**: `Chess Mastery_1.0.0_aarch64.dmg` (v1.3.0) na raiz da pasta `/Volumes/Backup/antigravity01/Chess Mastery/`.
- **Módulos Compartilhados (`shared/`)**:
  - `@shared/ui/chess/descriptiveNotation.js`: Conversor bidirecional de Notação Algébrica em Português (`Cf3`), Figurinos (`♘f3`), Internacional (`Nf3`) e Notação Descritiva Clássica em Português (`C3BR`, `P4R`) e Espanhol (`C3AR`, `P4R`).
  - `@shared/ui/chess/openingsTheory.js`: Base de conhecimento e repertório de 18 aberturas e defesas (Abertas, Semi-Abertas, Fechadas, Índias e Flanco), códigos ECO, estruturas de peões, planos estratégicos e lances anotados.
  - `@shared/ui/chess/openingTrainer.js`: Motor pedagógico compartilhado do **Treinador Inteligente de Aberturas**, incluindo dicas progressivas em 3 níveis (`Pergunta` → `Peça/Casa` → `Solução Explicada`), avaliador construtivo de lances em 3 faixas (`Lance Teórico Principal`, `Alternativa Plausível`, `Alerta Construtivo`), resolvedor de citações históricas (`Livro • Autor • Capítulo • Página`) e fila inteligente de revisão (`ReviewQueueItem`).
  - `@shared/ui/chess/chessAudio.js`: Sintetizador acústico de peças de madeira via Web Audio API pura.

---

## ✨ Novidades da Versão 1.3.0 (Reformulação `taste-skill` v2.1 — `Framed Sheet` Style & Shell)

Implementação da reformulação visual baseada no repositório `https://github.com/leonxlnx/taste-skill` (v2.1):

1. **Instalação do `taste-skill` v2.1 na Pasta de Skills**:
   - Copiado integralmente (incluindo `SKILL.md`, `references/app-screens.md`, `library/app.json`, `library/directions.json`, `assets/app.css`, `scripts/inspect.mjs`, `scripts/lint.mjs` e `scripts/draw.mjs`) para [`/Volumes/Backup/antigravity01/.agents/skills/taste-skill`](file:///Volumes/Backup/antigravity01/.agents/skills/taste-skill) e [`/Volumes/Backup/antigravity01/.agents/skills/design-taste-frontend`](file:///Volumes/Backup/antigravity01/.agents/skills/design-taste-frontend).

2. **Arquitetura de Shell `Framed Sheet` (Moldura em L + Folha Branca Recuada)**:
   - A barra lateral esquerda (`248px`) e a barra superior (`48px`) compartilham um único plano de fundo levemente matizado (`--ground: #f4f6f5`) sem linha divisória entre elas, formando uma moldura em **L** contínua.
   - Toda a área de trabalho reside sobre uma **folha branca (`--surface: #ffffff`)** recuada `8px` (`--sheet-inset: 8px`) das bordas direita e inferior da janela, com `border-radius: 16px`, borda hairline de `1px solid #e6e8ea` e **zero sombra** (`box-shadow: none`).
   - Busca centralizada na barra superior (`480x32px`) com indicador de atalho `/` em `IBM Plex Mono`.

3. **Tokens, Tipografia e House Rules do `Framed Sheet`**:
   - **Tipografia**: `IBM Plex Sans` para interface/leitura e `IBM Plex Mono` (`font-variant-numeric: tabular-nums`) exclusivamente para códigos ECO (`C50`), coordenadas, lances na planilha e contadores tabulares.
   - **Orçamento de Cor (`<= 3%`)**: Acento analítico `--accent: #1b6c80` restrito ao monograma da marca, sublinhado de `2px` da aba ativa e indicadores de progresso/seleção; botão primário em quase-preto tinta (`#131416`).
   - **Zero Emojis (House Rule)**: Todos os emojis foram substituídos por ícones SVG de linha fina (`1.5px stroke`) e pílulas tonais semânticas (`--pill-positive-bg`, `--pill-warning-bg`, `--pill-info-bg`).
   - **Faixa de KPIs Dividida (`.kpis`)**: Indicadores na visão de trilha e progresso apresentados como uma única faixa dividida por linhas de `1px`, com rótulo em `12px` `500` acima do valor em `20px–26px` `400` tabular, sem ícones em círculos coloridos.

4. **Preservação Integral das Funcionalidades Pedagógicas**:
   - Acordeão na barra lateral esquerda com todos os **4 livros clássicos** + **Modo Isolado de Capítulos**.
   - Navegador das **18 Aberturas e Defesas** filtrado por famílias teóricas.
   - **Modos de Uso (`Modo Aprender` vs `Modo Explorador`)** e **Treinador Inteligente de Aberturas** (feedback em 3 faixas, dicas progressivas em 3 níveis e Fila de Revisão).
   - **Três Fontes de Orientação Claramente Separadas** (`Do Tutor`, `Do Livro` com citação e modal de pipeline OCR, e `Do Stockfish`).

---

## 📋 Backlog e Próximos Passos
1. Adicionar modo de treino cronometrado opcional para revisão rápida de aberturas.
2. Expandir o catálogo de aberturas com variantes da Defesa Índia da Dama e Catalã.
3. Permitir exportação de relatórios de estudo em formato PGN anotado.
