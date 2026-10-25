# Resumo de Trabalho — Chess Mastery

Este documento funciona como a memória de longo prazo do aplicativo **Chess Mastery**, registrando a arquitetura, livros pré-instalados, repertório teórico de aberturas, decisões de design e histórico de versões.

---

## 🛠️ Stack e Infraestrutura
- **Backend Nativo**: Rust + Tauri v2 (`src-tauri/`) + Wrapper Nativo macOS Apple Silicon (`Cocoa` + `WKWebView` em `src-tauri/macos-native/main.m`) configurado com janela nativa na cor Creme (`#FFF9ED`) e aparência `NSAppearanceNameAqua`.
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite 7 (`src/`) + Bundle Offline Autossuficiente (`dist/`).
- **Regras de Xadrez & Notação**: `chess.js` + Motor Local de Avaliação Tática/Posicional (`src/lib/chess/localStockfishEngine.ts` e `dist/chess-engine.js`) otimizado para Macs Apple M2 com 8 GB de RAM (< 5 MB de consumo em memória).
- **Repositório Git**: `https://github.com/fabiobertaiolli/chessmastery.git` (branch `main`).
- **Instalador Nativo macOS Local**: `Chess Mastery_1.0.0_aarch64.dmg` (v1.2.0) na raiz da pasta `/Volumes/Backup/antigravity01/Chess Mastery/`.
- **Módulos Compartilhados (`shared/`)**:
  - `@shared/ui/chess/descriptiveNotation.js`: Conversor bidirecional de Notação Algébrica em Português (`Cf3`), Figurinos (`♘f3`), Internacional (`Nf3`) e Notação Descritiva Clássica em Português (`C3BR`, `P4R`) e Espanhol (`C3AR`, `P4R`).
  - `@shared/ui/chess/openingsTheory.js`: Base de conhecimento e repertório de 18 aberturas e defesas (Abertas, Semi-Abertas, Fechadas, Índias e Flanco), códigos ECO, estruturas de peões, planos estratégicos e lances anotados.
  - `@shared/ui/chess/openingTrainer.js` (Novo na v1.2.0): Motor pedagógico compartilhado do **Treinador Inteligente de Aberturas**, incluindo dicas progressivas em 3 níveis (`Pergunta` → `Peça/Casa` → `Solução Explicada`), avaliador construtivo de lances em 3 faixas (`Lance Teórico Principal`, `Alternativa Plausível`, `Alerta Construtivo`), resolvedor de citações históricas (`Livro • Autor • Capítulo • Página`) e fila inteligente de revisão (`ReviewQueueItem`).
  - `@shared/ui/chess/chessAudio.js`: Sintetizador acústico de peças de madeira via Web Audio API pura.
  - `@shared/ui/css/glassmorphism.css`: Utilitários visuais compartilhados do workspace.

---

## 🌟 Novidades da Versão 1.2.0 (Redesign Infantil em Tons Claros & Treinador Inteligente de Aberturas)

Implementação integral da especificação de produto e UX (*"Chess Mastery — Redesign infantil e treinador inteligente de aberturas"*):

1. **Nova Identidade Visual Acolhedora e Tátil (Paleta Clara Infantil)**:
   - **Creme (`#FFF9ED`)**: Fundo principal de estudo e leitura confortável, eliminando o aspecto pesado de terminal escuro.
   - **Verde Menta (`#DDF3E5`)**: Estados positivos, lances teóricos principais, cartões concluídos e card **Do Livro**.
   - **Verde Principal (`#16865E`)**: Botão primário, ações de avanço e confirmação.
   - **Azul Céu (`#DCEBFF`)**: Conteúdo informativo, alternativas plausíveis e card **Do Stockfish**.
   - **Amarelo Suave (`#FFE5A8`)**: Dicas progressivas, descobertas, estrelas (`⭐`) e card **Do Tutor**.
   - **Coral Suave (`#F9DCD9`)**: Alertas construtivos sem tom punitivo (*"Quase lá! Tente outra vez ou veja uma dica"*).
   - **Madeira (`#B58A65` / `#F5E6CE`)**: Tabuleiro acolhedor de alto contraste com coordenadas legíveis.

2. **Navegação Simplificada em 4 Destinos Claros**:
   - `🌟 Aprender`: Trilha guiada passo a passo, missão recomendada do dia e **Fila de Revisão Inteligente**.
   - `📚 Biblioteca`: Todos os 4 livros clássicos acessíveis em acordeão na aba lateral esquerda + **Modo Isolado de Capítulos** + Inspetor de **Fontes & Pipeline OCR**.
   - `♟️ Aberturas`: Catálogo interativo de 18 aberturas e defesas integrado ao **Treinador Inteligente de Aberturas**.
   - `🏆 Conquistas`: Painel lúdico de estrelas (`⭐`), medalhas desbloqueadas e estatísticas de progresso.

3. **Dois Modos de Uso (`🌱 Modo Aprender` vs `🧭 Modo Explorador`)**:
   - **Modo Aprender (Padrão)**: Tabuleiro grande dominante, apenas 1 pergunta/tarefa clara por vez, controles essenciais (`◀ Anterior`, `💡 Ver Dica`, `Próximo ▶`), dicas progressivas em 3 níveis e ferramentas secundárias recolhidas no menu `⚙️ Mais`.
   - **Modo Explorador (Opcional)**: Revela barra vertical de avaliação Stockfish, seletor completo de 5 notações (`Algébrica PT`, `Figurino`, `Descritiva C3BR`, `Descritiva ES C3AR`, `SAN`), trilha completa de lances clicáveis e caderno de anotações pessoais.

4. **Treinador Inteligente de Aberturas (Fluxo de 6 Etapas)**:
   - **Etapa 1**: Escolha da abertura/defesa e da cor para treinar (`⚪ Brancas`, `⚫ Pretas` ou `☯️ Ambas`).
   - **Etapa 2**: Jogue no tabuleiro (quando o aluno treina Brancas ou Pretas, o app responde automaticamente o lance teórico do oponente).
   - **Etapa 3**: Receba feedback contextual em 3 faixas:
     - **Lance Teórico Principal** (Verde Menta `#DDF3E5`): explica por que funciona dentro da abertura.
     - **Alternativa Plausível** (Azul Céu `#DCEBFF`): reconhece que o lance é jogável e mostra a diferença para a linha principal.
     - **Alerta Construtivo** (Coral Suave `#F9DCD9`): convida a tentar novamente sem tom punitivo e registra a posição na **Fila de Revisão**.
   - **Etapa 4**: Dicas progressivas em 3 níveis (`1️⃣ Pergunta orientadora` → `2️⃣ Peça ou casa-chave` → `3️⃣ Lance completo e explicação`).
   - **Etapa 5**: Entenda o plano estratégico (Planos das Brancas, Planos das Pretas, Estrutura de Peões e Armadilhas Táticas).
   - **Etapa 6**: Revise com inteligência através da **Fila de Revisão** automática.

5. **Três Fontes de Orientação Claramente Separadas**:
   - `🦉 DO TUTOR` (Card Amarelo Suave `#FFE5A8`): Explicação pedagógica curta, amigável e adaptada para jovens estudantes.
   - `📗 DO LIVRO` (Card Verde Menta `#DDF3E5`): Princípio clássico ou trecho verificado com citação explícita de **Livro • Autor • Capítulo • Página**, além de modal `🔎 Fontes & OCR` detalhando o pipeline `PDF/OCR → Parser PGN/Descritiva → Validador chess.js`.
   - `🤖 DO STOCKFISH` (Card Azul Céu `#DCEBFF`): Rotulado claramente como análise independente do computador, nunca misturado como fala do autor do livro.

---

## 📚 Histórico Anterior — Versão 1.1.0
- Acordeão lateral esquerdo com todos os 4 livros carregados (*Xadrez Básico*, *Meu Sistema*, *Mikhail Tal*, *Bobby Fischer*).
- Modo Isolado de Capítulos com breadcrumb e filtro exclusivo.
- Catálogo de 18 Aberturas e Defesas com planos estratégicos e partidas modelo.

---

## 📋 Backlog e Próximos Passos
1. Adicionar desafios cronometrados opcionais ("Missão Relâmpago de 3 Minutos") dentro da aba `🌟 Aprender`.
2. Expandir o catálogo de aberturas com linhas da Defesa Índia da Dama e Catalã.
3. Permitir impressão/exportação em PDF infantil colorido dos certificados de conclusão de cada livro na aba `🏆 Conquistas`.
