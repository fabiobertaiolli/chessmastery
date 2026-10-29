# Planejamento de Implementação — Chess Mastery v2.0 (Stitch Complete Experience + Full Interactive Books + Chess.com Board + NotebookLM Importer)

Este documento define o plano técnico completo para transformar o **Chess Mastery** na experiência integral desenhada no **Google Stitch (`Playful Chess Studio`)**, unindo:
1. **As 4 Telas Completas do Stitch** (*Modo Aprender & Leitor Interativo*, *Biblioteca Mágica*, *Aberturas & Desafios*, *Conquistas & Estrelas*).
2. **Os 4 Livros Clássicos Completos (Todos os Capítulos)** com **Leitura Fluida e Lances Clicáveis dentro dos Parágrafos** (sincronizados em tempo real com o tabuleiro, incluindo linhas principais e variantes comentadas).
3. **Tabuleiro Interativo Padrão Chess.com** (animação de deslize de peças, seletor visual de promoção na casa, setas/círculos multicoloridos com botão direito + teclas modificadoras, barra de avaliação vertical suave, pré-visualização de casas legais e atalhos de teclado).
4. **Arquitetura Extensível para Estudos do Google NotebookLM / Internet** (Aberturas, Defesas, Meio-Jogo e Finais).

---

## 🏗️ 1. Arquitetura de Módulos Compartilhados (`/Volumes/Backup/antigravity01/shared/ui/chess/`)

Seguindo a Regra de Ouro do workspace (`AGENTS.md`), toda a inteligência reutilizável de parsing de texto enxadrístico, sincronização de FEN por parágrafo e importação de estudos ficará centralizada em `shared/ui/chess/`:

### 1.1. Novo Módulo: `@shared/ui/chess/interactiveBookParser.js` (+ `.d.ts`)
Motor responsável por transformar parágrafos de texto enxadrístico (em Notação Algébrica ou Descritiva) em blocos de leitura ricos com **Tokens de Movimento Clicáveis (`InlineMoveToken`)**:
- **Resolução de Posição Exata (`fenAtMove`)**: Cada lance citado no meio do parágrafo (ex: `"Após 12. Ce5!, se as Pretas tentarem 12... Bd6?, segue 13. Cxf7 Rxf7 14. Dxe6+ com ataque decisivo"`) carrega:
  - `fen`: A posição exata do tabuleiro após aquele lance.
  - `from` / `to`: Casas de origem e destino para animar o lance e destacar no tabuleiro ao clicar.
  - `san` / `descriptivePt` / `figurine`: Representações sincronizadas para que o leitor possa alternar entre Notação Algébrica (`12. Ce5`), Figurino (`12. ♘e5`) ou Descritiva Clássica (`12. C5R`) dentro do próprio parágrafo!
  - `isVariation`: Identifica se o lance clicado pertence à linha principal da partida ou a uma sub-variante explicativa do parágrafo (exibindo um badge *"Variante do Parágrafo — Clique para voltar à linha principal"*).

### 1.2. Novo Módulo: `@shared/ui/chess/notebookStudyImporter.js` (+ `.d.ts`)
Motor preparado para receber estudos vindos do **Google NotebookLM**, arquivos Markdown, textos da internet ou PGNs anotados, classificando-os automaticamente nas 3 fases do jogo:
- **Categorias Suportadas**:
  1. `opening_defense` (*Aberturas & Defesas*)
  2. `middlegame` (*Meio-Jogo: Planos, Tática e Ataque*)
  3. `endgame` (*Finais Técnicos e Estudos Práticos*)
- **Funcionalidades**:
  - Extrai automaticamente metadados, títulos de seções, parágrafos explicativos, posições iniciais (`[FEN "..."]`) e sequências de lances no meio do texto.
  - Converte o material do NotebookLM exatamente para a mesma estrutura de leitura interativa dos livros nativos, salvando no armazenamento local (`localStorage` / SQLite) e exportando/importando via JSON/Markdown.

---

## 📚 2. Expansão Integral dos 4 Livros Clássicos (`src/data/preinstalledBooks.ts` + Catálogo Modular)

Para que os livros possam ser usados tanto para **leitura normal corrida** quanto para **estudo interativo lance a lance clicando nos parágrafos**, expandiremos os 4 livros para contemplar a **estrutura completa de capítulos de cada obra**:

### 2.1. Livro 1: *Xadrez Básico* — Orfeu Gilberto D'Agostini (Obra Completa Estruturada)
- **Cap. 1**: Noções Fundamentais, O Tabuleiro, Valor Relativo das Peças e Notação Descritiva vs. Algébrica.
- **Cap. 2**: Os Finais Elementares e Básicos (Mates Elementares, Rei e Peão, Oposição, Quadrado do Peão, Finais de Torres — Lucena e Philidor).
- **Cap. 3**: Tática Elementar e Combinações (Cravada, Garfo/Ataque Duplo, Descoberto, Raio-X, Desvio, Atração e Sacrifícios Clássicos no Roque).
- **Cap. 4**: Como Conduzir uma Partida — As Partidas Modelo Analisadas Lance a Lance (Capablanca vs. Steiner, Morphy vs. Duque de Brunswick, Rubinstein vs. Salwe, Alekhine vs. Réti, etc.).
- **Cap. 5**: Teoria Geral do Meio-Jogo (Colunas Abertas, 7ª Fila, Casas Fracas, Peões Dobrados, Isolados e Passados, Ataque na Ala do Rei e na Ala da Dama).
- **Cap. 6**: Tratado Completo das Aberturas (Aberturas do Peão do Rei, Semi-Abertas, Peão da Dama e Sistemas Índios segundo D'Agostini).

### 2.2. Livro 2: *Meu Sistema (My System / Mi Sistema)* — Aaron Nimzowitsch (Todos os 15 Capítulos: Parte I e Parte II)
- **Parte I — Os Elementos (Capítulos 1 a 9)**:
  - Cap. 1: O Centro e o Desenvolvimento (Liquidação e Ganho de Tempo).
  - Cap. 2: As Colunas Abertas (Posto Avançado e Restrição).
  - Cap. 3: A Sétima e a Oitava Filas (Os 5 Casos Especiais).
  - Cap. 4: O Peão Passado (O Bloqueio, Regra de Nimzowitsch e Ataque Frontal).
  - Cap. 5: A Troca (Quando e Como Trocar Peças).
  - Cap. 6: Os Elementos da Estratégia nos Finais (Centralização, Abrigo e Ponte).
  - Cap. 7: A Cravada (Absoluta, Relativa e o Problema da Descravada).
  - Cap. 8: O Xeque a Descoberto e a Engrenagem (*Zwickmühle* — Imortal Torre vs. Lasker).
  - Cap. 9: A Cadeia de Peões (Ataque à Base e Transferência de Ataque).
- **Parte II — O Jogo Posicional (Capítulos 10 a 15)**:
  - Cap. 10: O Jogo Posicional e a Concepção do Centro (Superproteção).
  - Cap. 11: O Peão Dobrado e a Restrição.
  - Cap. 12: O Peão Isolado da Dama e Seus Descendentes.
  - Cap. 13: O Jogo nos Dois Flancos e a Lavagem de Manobras.
  - Cap. 14: AProfilaxia e o Jogo Hipermoderno.
  - Cap. 15: Partidas Ilustrativas Antológicas (Johner vs. Nimzowitsch, Sämisch vs. Nimzowitsch — *A Imortal do Zugzwang*, Nimzowitsch vs. Rubinstein).

### 2.3. Livro 3: *Vida e Partidas de Mikhail Tal (The Life and Games of Mikhail Tal)* — Mikhail Tal
- Todos os períodos históricos da carreira do "Mago de Riga" com a narrativa autobiográfica em primeira pessoa e partidas completas com variantes clicáveis no texto:
  - Cap. 1: Primeiros Passos em Riga e o Título de Mestre (1949–1955).
  - Cap. 2: Campeão Soviético Aos 20 Anos — A Explosão Tática (1956–1957).
  - Cap. 3: O Segundo Título Soviético e o Interzonal de Portorož (1958).
  - Cap. 4: O Torneio de Candidatos da Iugoslávia (1959 — Tal vs. Smyslov, Fischer, Petrosian).
  - Cap. 5: O Match pelo Campeonato Mundial contra Botvinnik (Moscou, 1960).
  - Cap. 6: A Era das Grandes Obras-Primas Combinativas (Bled 1961 a Montreal 1979).

### 2.4. Livro 4: *Meus Grandes Predecessores, Vol. 4 (Bobby Fischer)* — Garry Kasparov
- A jornada completa de Robert James Fischer analisada por Kasparov:
  - Cap. 1: O Prodígio do Brooklyn e a "Partida do Século" (Donald Byrne vs. Fischer, 1956).
  - Cap. 2: Rumo ao Topo Mundial e os Campeonatos dos EUA (1957–1962, incluindo o 11/11 de 1963/64).
  - Cap. 3: O Retorno Triunfal, Palma de Mallorca e os Matches de Candidatos 6–0 (Taimanov, Larsen e Petrosian, 1970–1971).
  - Cap. 4: O Match do Século em Reykjavik contra Boris Spassky (1972 — Partidas 1, 3, 6, 10 e 13 analisadas em profundidade).

---

## ♟️ 3. Tabuleiro Interativo Padrão Chess.com (`src/components/InteractiveChessboard.tsx`)

Aprimoraremos o componente `InteractiveChessboard.tsx` para entregar a mesma fluidez, resposta tátil e recursos analíticos do **Chess.com**:

1. **Movimentação Dupla (Click-to-Move + Drag-and-Drop Fluido)**:
   - Arrastar a peça com tamanho levemente ampliado (`scale-110`), centralizada no ponteiro e peça fantasma translúcida na casa de origem.
   - Indicadores visuais idênticos ao Chess.com: círculos translúcidos (`28%` do tamanho da casa) para casas vazias legais e anéis vazados nas bordas da casa quando o lance é uma captura legal.
2. **Animação Suave de Lances em Tempo Real**:
   - Quando o usuário clica em um movimento no parágrafo do livro ou usa as setas `←` / `→`, a peça desliza suavemente da casa de origem para a casa de destino (`cubic-bezier(0.22, 1, 0.36, 1)`, `180ms`), acompanhada do som acústico de madeira (`chessAudio.js`).
   - Se o usuário clicar em um lance distante no parágrafo (ex: estava no lance 4 e clicou no lance 18 do texto), o tabuleiro atualiza instantaneamente para o lance 18 destacando o último movimento (`from` → `to`) e animando o lance clicado!
3. **Seletor Visual de Promoção de Peão (Estilo Chess.com)**:
   - Quando um peão atinge a 8ª/1ª fila, abre uma coluna flutuante diretamente sobre a casa de promoção com as 4 peças (`Dama`, `Cavalo`, `Torre`, `Bispo`) na cor do jogador.
4. **Setas e Destaques Táticos do Usuário (Botão Direito + Modificadores)**:
   - Botão direito padrão = Seta/Casa **Laranja/Âmbar** (`amber`).
   - `Shift` + Botão direito = **Verde** (`emerald`).
   - `Alt/Option` + Botão direito = **Azul** (`sky`).
   - `Cmd/Ctrl` + Botão direito = **Vermelho/Coral** (`rose`).
   - Clique esquerdo em qualquer lugar limpa os desenhos manuais.
5. **Barra de Avaliação Vertical (`EvalBar`) & Badges de Lance (`!!`, `!`, `!?`, `?!`, `?`, `??`)**:
   - Barra lateral ao lado do tabuleiro com transição suave em tempo real conforme a avaliação do Stockfish local, exibindo vantagem em peões (`+1.8`) ou mate (`M3`).
   - Ícone flutuante no canto superior direito da casa de destino para lances brilhantes (`!!`), excelentes (`!`) ou imprecisões (`?`).

---

## 🎨 4. Implementação das 4 Telas do Google Stitch (`Playful Chess Studio`)

Implementaremos o design system completo de `stitch_kids_chess_design_system` tela por tela:

### Tela 1: **Modo Aprender & Leitor Interativo de Livros (`LearnAndReadStudio`)**
- **Header Tátil**: Logo *Chess Mastery*, navegação das 4 abas principais (`Aprender & Ler`, `Biblioteca Mágica`, `Aberturas & Desafios`, `Conquistas & Estrelas`), contador de estrelas (`⭐`), seletor rápido de notação (`Algébrica PT`, `Figurino ♘`, `Descritiva P4R`) e botão de som/voz.
- **Coluna Esquerda (7 colunas)**:
  - Card de status da vez (*"Sua Vez: Brancas ⚪"* ou *"Explorando Variante do Livro 📖"*).
  - **Tabuleiro Interativo padrão Chess.com** na moldura tátil de madeira (`#F5E6CE` / `#B58A65`) + `EvalBar`.
  - Dock de controles táteis: Botão dourado **"💡 Pedir Dica Mágica (1 de 3)"**, botões `◀ Voltar`, `Avançar ▶`, `🔄 Girar`, `🔊 Ouvir Voz` e barra de progresso da lição com estrelas.
- **Coluna Direita (5 colunas) — Painel Inteligente com 2 Modos Sincronizados**:
  1. **Modo Leitura Interativa do Livro ("Livro Vivo")**:
     - Exibe o texto completo do capítulo em tipografia editorial confortável (`Plus Jakarta Sans`), dividido em parágrafos claros.
     - **Lances Clicáveis Inline**: Todos os lances dentro do texto (ex: `1. e4 e5`, `2. Cf3`, `15. C2R!`, e variantes entre parênteses) são pílulas interativas.
     - O lance correspondente à posição atual do tabuleiro fica automaticamente iluminado em verde esmeralda (`#16865E`) com auto-scroll suave!
     - Clicar em qualquer lance do parágrafo leva o tabuleiro imediatamente para aquele momento da partida ou variante.
  2. **Modo Mentores & Desafio ("Adivinhe o Lance")**:
     - Os 3 cartões de mentores do Stitch:
       - 🦉 **Coruja Sofia (Tutor)**: Pergunta socrática e dicas progressivas sem spoiler.
       - 📖 **Livro Mágico (Autor Original)**: Citação literal do capítulo e página com nota histórica.
       - 🤖 **Robô Pipo (Stockfish Local)**: Avaliação tática amigável e melhor linha calculada.

### Tela 2: **Biblioteca Mágica (`MagicalLibraryView`)**
- Layout idêntico ao `est_dio_de_xadrez_infantil_biblioteca_m_gica/code.html`:
  - Busca por histórias, mestres (Capablanca, Tal, Fischer, Nimzowitsch), conceitos estratégicos ou aberturas.
  - Hero Card de **"Leitura em Andamento"** com barra de progresso *Candy Track* e botão de retomada em 1 clique.
  - Estante dos **4 Livros Completos** + **Seção de Estudos Importados (NotebookLM / Internet)**:
    - Ao selecionar um livro, abre o **Índice Completo de Capítulos e Partidas** para o usuário escolher se quer abrir em **Leitura Corrida Interativa** ou **Modo Desafio**.

### Tela 3: **Aberturas & Desafios + Estudos de Meio-Jogo e Finais (`OpeningsAndStudiesView`)**
- Layout baseado em `est_dio_de_xadrez_infantil_aberturas_desafios/code.html`:
  - Filtros por Fase do Jogo (**Aberturas & Defesas**, **Meio-Jogo**, **Finais**) e por Família Teórica (Abertas, Semi-Abertas, Fechadas, Índias, Flanco).
  - Cards visuais com código ECO, nível (*Fácil 🌱*, *Médio ⚡*, *Mestre 👑*), ideias estratégicas e botão **"Treinar no Tabuleiro"**.
  - **Botão "+ Importar do Google NotebookLM / PGN"**: Abre o modal onde você pode colar resumos/estudos gerados no NotebookLM ou arquivos PGN da internet para criar novos módulos interativos de Abertura, Meio-Jogo ou Final instantaneamente.

### Tela 4: **Conquistas & Estrelas (`AchievementsTrophyRoomView`)**
- Layout fiel a `est_dio_de_xadrez_infantil_conquistas_estrelas/code.html`:
  - 4 KPIs táteis: *Estrelas Mágicas*, *Medalhas Conquistadas*, *Capítulos Lidos* e *Precisão nos Desafios*.
  - Galeria de Medalhas dos Grandes Mestres (Medalha Capablanca de Finais, Medalha Nimzowitsch de Bloqueio, Medalha Tal de Combinação, Medalha Fischer de Precisão).
  - Fila Inteligente de Revisão com os lances que merecem uma segunda tentativa.

---

## 📅 5. Ordem de Execução (Fases de Implementação)

1. **Fase 1 — Motor de Livros Interativos & Importador NotebookLM (`shared/ui/chess/`)**:
   - Criar `interactiveBookParser.js` (tokenizador de parágrafos com cálculo de FEN para cada lance inline e variantes) e `notebookStudyImporter.js`.
2. **Fase 2 — Base de Dados Completa dos 4 Livros (`src/data/`)**:
   - Expandir os 4 livros (*Xadrez Básico*, *Meu Sistema*, *Mikhail Tal* e *Kasparov sobre Fischer*) com todos os seus capítulos estruturados, textos de leitura completos em português e lances sincronizados.
3. **Fase 3 — Tabuleiro Interativo Estilo Chess.com (`src/components/InteractiveChessboard.tsx`)**:
   - Implementar animação de deslize de peças, seletor flutuante de promoção, setas/círculos multicoloridos por tecla modificadora, `EvalBar` e sincronização instantânea com cliques nos parágrafos.
4. **Fase 4 — Construção das 4 Telas do Stitch (`src/components/views/`)**:
   - Implementar o Design System `Playful Chess Studio` (fontes, cores, sombras táteis) e construir:
     - `LearnAndReadStudio.tsx` (Modo Aprender + Leitor Interativo de Parágrafos)
     - `MagicalLibraryView.tsx` (Biblioteca Mágica com todos os capítulos)
     - `OpeningsAndStudiesView.tsx` (Aberturas, Meio-Jogo, Finais + Importador NotebookLM)
     - `AchievementsTrophyRoomView.tsx` (Sala de Troféus e Estrelas)
5. **Fase 5 — Validação, Build macOS (`.dmg`) e Encerramento (`/development-workflow`)**:
   - Testes de TypeScript/Vite, geração do novo instalador `Chess Mastery_1.0.0_aarch64.dmg` na raiz do projeto, atualização do `resumo-trabalho.md` e `git commit` + `git push`.
