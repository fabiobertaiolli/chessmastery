# Chess Mastery — Documentação Completa de Produto, UX e Arquitetura (v1.3.0)

> **Chess Mastery — Estúdio Clássico & Treinador Inteligente de Aberturas (`taste-skill` v2.1 — `Framed Sheet`)**  
> Aplicativo nativo macOS (Apple Silicon `arm64`) construído sobre a direção de arte **`Framed Sheet`** do `taste-skill` v2.1: moldura em L suave (`#f4f6f5`) sem linha divisória entre sidebar e topbar, folha de estudo branca (`#ffffff`) recuada `8px` com borda hairline de `1px` e sem sombras pesadas, tipografia `IBM Plex Sans` + `IBM Plex Mono`, 4 obras-primas clássicas da literatura enxadrística, conversor histórico de Notação Descritiva, **Treinador Inteligente de Aberturas** e separação transparente entre **Tutor**, **Livro** e **Stockfish**.

---

## 📑 Sumário
1. [Visão Geral e Direção de Produto](#1-visão-geral-e-direção-de-produto)
2. [Sistema Visual e Paleta de Cores (Redesign Infantil)](#2-sistema-visual-e-paleta-de-cores-redesign-infantil)
3. [Arquitetura de Navegação: 4 Destinos Claros](#3-arquitetura-de-navegação-4-destinos-claros)
4. [Dois Modos de Uso: Modo Aprender vs. Modo Explorador](#4-dois-modos-de-uso-modo-aprender-vs-modo-explorador)
5. [Treinador Inteligente de Aberturas (Fluxo de 6 Etapas)](#5-treinador-inteligente-de-aberturas-fluxo-de-6-etapas)
6. [Três Fontes de Orientação Claramente Separadas](#6-três-fontes-de-orientação-claramente-separadas)
7. [Biblioteca de Livros, Acordeão e Modo Isolado de Capítulos](#7-biblioteca-de-livros-acordeão-e-modo-isolado-de-capítulos)
8. [Pipeline de Livros, Citações e Validação OCR](#8-pipeline-de-livros-citações-e-validação-ocr)
9. [Arquitetura Técnica e Módulos Compartilhados (`shared/`)](#9-arquitetura-técnica-e-módulos-compartilhados-shared)
10. [Atalhos de Teclado e Controles](#10-atalhos-de-teclado-e-controles)

---

## 1. Visão Geral e Direção de Produto

O **Chess Mastery v1.2.0** transforma o estudo de livros clássicos e da teoria de aberturas em uma jornada lúdica, acolhedora e estruturada:
- **Menos cara de software técnico de análise, mais cara de jogo de aprendizagem guiada.**
- **Foco em uma decisão por vez**: tabuleiro grande no centro, orientação clara à direita e controles essenciais na base.
- **Feedback construtivo e não punitivo**: erros de lance são tratados como oportunidades de descoberta (*"Quase lá! Tente outra vez ou veja uma dica"*), alimentando automaticamente uma **Fila de Revisão Inteligente**.

---

## 2. Sistema Visual e Paleta de Cores (Redesign Infantil)

| Token / Papel Visual | Cor Hex | Aplicação na Interface |
| :--- | :--- | :--- |
| **Creme (Fundo Principal)** | `#FFF9ED` | Plano de fundo geral e superfície de leitura confortável |
| **Verde Menta (Positivo)** | `#DDF3E5` | Lances teóricos principais, cartões concluídos e card **Do Livro** |
| **Verde Principal (Ação)** | `#16865E` | Botões primários (`Próximo ▶`, `Treinar Agora`), abas ativas e badges |
| **Azul Céu (Informativo)** | `#DCEBFF` | Lances alternativos plausíveis, Modo Explorador e card **Do Stockfish** |
| **Amarelo Suave (Descoberta)** | `#FFE5A8` | Dicas progressivas (`💡 Ver Dica`), estrelas (`⭐`) e card **Do Tutor** |
| **Coral Suave (Alerta Construtivo)** | `#F9DCD9` | Feedback amigável (*"Tente outra vez"*) sem tom punitivo |
| **Madeira (Tabuleiro)** | `#B58A65` / `#F5E6CE` | Casas escuras e claras do tabuleiro tátil com coordenadas grandes |

---

## 3. Arquitetura de Navegação: 4 Destinos Claros

A barra superior apresenta **4 destinos principais**:
1. **🌟 Aprender**: Trilha guiada do aluno, atalho para a lição recomendada do momento, resumo da jornada e **Fila de Revisão Inteligente** (posições em que o aluno pediu dica ou precisou tentar novamente).
2. **📚 Biblioteca**: Todos os **4 livros clássicos** carregados na aba lateral esquerda em formato de acordeão expansível, com suporte a **Modo Isolado de Capítulos** e botão `🔎 Fontes & OCR`.
3. **♟️ Aberturas**: Catálogo de **18 aberturas e defesas** divididas em 5 famílias teóricas, integrado ao **Treinador Inteligente de Aberturas**.
4. **🏆 Conquistas**: Painel gamificado com contador de estrelas (`⭐`), medalhas pedagógicas desbloqueadas e progresso por livro e abertura.

---

## 4. Dois Modos de Uso: Modo Aprender vs. Modo Explorador

| Recurso | 🌱 Modo Aprender (Padrão) | 🧭 Modo Explorador (Opcional) |
| :--- | :--- | :--- |
| **Objetivo** | Aprendizagem guiada sem sobrecarga visual | Estudo analítico completo e comparação de notações |
| **Tabuleiro** | Dominante no centro | Dominante no centro + Barra Vertical de Avaliação |
| **Orientação** | 1 pergunta/tarefa clara por vez + Dicas em 3 níveis | 3 fontes (`Tutor`, `Livro`, `Stockfish`) + Planilha de Lances |
| **Notação** | Algébrica em Português amigável (`Cf3`, `Bispo em c4`) | Seletor completo (`Algébrica PT`, `Figurino`, `Descritiva C3BR`, `Descritiva ES C3AR`, `SAN`) |
| **Controles Secundários** | Recolhidos no botão `⚙️ Mais` | Visíveis no painel lateral |

---

## 5. Treinador Inteligente de Aberturas (Fluxo de 6 Etapas)

1. **Escolha a Abertura e a Cor**:
   - Selecione entre as 18 aberturas/defesas e escolha treinar de **⚪ Brancas**, **⚫ Pretas** ou **☯️ Ambas**.
2. **Jogue no Tabuleiro**:
   - O aluno executa os lances clicando na peça de origem e na casa de destino. Quando treina apenas uma cor, o aplicativo responde automaticamente o lance teórico do adversário.
3. **Receba Feedback Contextual em 3 Faixas**:
   - 🌿 **Lance Teórico Principal (`#DDF3E5`)**: Confirma o lance principal do repertório e explica sua função estratégica.
   - 🌤️ **Alternativa Plausível (`#DCEBFF`)**: Reconhece que o lance é legal e sólido segundo a avaliação tática, explicando por que o lance principal da abertura ainda é preferido.
   - 🌸 **Alerta Construtivo (`#F9DCD9`)**: Explica de forma amigável por que o lance foge do plano da abertura e convida a tentar novamente ou pedir uma dica.
4. **Use Dicas Progressivas em 3 Níveis (`💡 Ver Dica`)**:
   - **Nível 1 (Pergunta)**: Faz uma pergunta orientadora sobre o centro, desenvolvimento ou segurança do rei.
   - **Nível 2 (Peça e Casa)**: Indica qual peça deseja participar ou qual casa crítica precisa de atenção.
   - **Nível 3 (Solução Explicada)**: Revela o lance completo em notação amigável e explica o motivo estratégico.
5. **Entenda o Plano Estratégico**:
   - Cartões visuais com **Planos das Brancas**, **Planos das Pretas**, **Estrutura de Peões** e **Armadilhas Táticas**.
6. **Revise com Inteligência (`Fila de Revisão`)**:
   - Posições em que o aluno usou dicas ou errou a primeira tentativa vão automaticamente para a **Fila de Revisão** na aba `🌟 Aprender`, permitindo praticar exatamente os pontos críticos com 1 clique.

---

## 6. Três Fontes de Orientação Claramente Separadas

Para garantir total transparência pedagógica e editorial, o painel direito separa as explicações em **3 cartões distintos**:

1. **🦉 DO TUTOR (Card Amarelo Suave `#FFE5A8`)**:
   - Explicação curta, acolhedora e didática pensada para crianças e estudantes em formação.
2. **📗 DO LIVRO (Card Verde Menta `#DDF3E5`)**:
   - Comentário e princípio estratégico fundamentado na obra clássica, acompanhado de **citação explícita de Livro, Autor, Capítulo e Página** (ex.: *Xadrez Básico • Orfeu G. D'Agostini • Cap. 1 • págs. 45–52*).
3. **🤖 DO STOCKFISH (Card Azul Céu `#DCEBFF`)**:
   - Sugestão tática calculada pelo motor local, **claramente identificada como análise do computador** e nunca atribuída ao autor do livro.

---

## 7. Biblioteca de Livros, Acordeão e Modo Isolado de Capítulos

Todos os **4 livros clássicos** pré-instalados estão acessíveis na aba lateral esquerda:
1. **Xadrez Básico** — *Orfeu Gilberto D'Agostini* (4 capítulos, 5 partidas/estudos fundamentais)
2. **Meu Sistema (*Mi Sistema*)** — *Aron Nimzowitsch* (3 capítulos, 3 partidas clássicas hipermodernas)
3. **Vida e Partidas de Mikhail Tal** — *Mikhail Tal* (2 capítulos, 2 partidas de sacrifício e iniciativa)
4. **Meus Grandes Predecessores, Vol. 4: Bobby Fischer** — *Garry Kasparov* (2 capítulos, 2 obras-primas históricas)

- **Acordeão de Livros**: Clique em qualquer livro para expandir ou recolher seus capítulos.
- **Modo Isolado de Capítulos**: Clique sobre um capítulo para isolá-lo na barra lateral com breadcrumb, resumo pedagógico e lista dedicada de partidas.

---

## 8. Pipeline de Livros, Citações e Validação OCR

O modal **🔎 Fontes & Pipeline OCR** documenta e audita como cada obra física foi processada:
1. **Extração PDF / OCR**: Leitura das páginas originais em Português (*D'Agostini*), Espanhol (*Nimzowitsch*) e Inglês (*Tal* / *Kasparov*).
2. **Parser de Notação Descritiva & Algébrica**: Conversão automatizada de lances descritivos (`P4R`, `C3BR`, `B4B`, `O-O`) para SAN canônico via `@shared/ui/chess/descriptiveNotation`.
3. **Validação Legal 100% (`chess.js`)**: Todos os **647 meio-lances** das 12 partidas clássicas e 18 aberturas foram testados lance a lance contra o motor de regras `chess.js`.

---

## 9. Arquitetura Técnica e Módulos Compartilhados (`shared/`)

- [`/Volumes/Backup/antigravity01/shared/ui/chess/openingTrainer.js`](file:///Volumes/Backup/antigravity01/shared/ui/chess/openingTrainer.js): Motor do Treinador Inteligente de Aberturas, dicas em 3 níveis, avaliador em 3 faixas e resolvedor de citações.
- [`/Volumes/Backup/antigravity01/shared/ui/chess/descriptiveNotation.js`](file:///Volumes/Backup/antigravity01/shared/ui/chess/descriptiveNotation.js): Conversor bidirecional entre SAN, Algébrica PT, Figurino, Descritiva PT (`C3BR`) e Descritiva ES (`C3AR`).
- [`/Volumes/Backup/antigravity01/shared/ui/chess/openingsTheory.js`](file:///Volumes/Backup/antigravity01/shared/ui/chess/openingsTheory.js): Catálogo teórico de aberturas e defesas.
- [`/Volumes/Backup/antigravity01/shared/ui/chess/chessAudio.js`](file:///Volumes/Backup/antigravity01/shared/ui/chess/chessAudio.js): Sintetizador sonoro via Web Audio API.

---

## 10. Atalhos de Teclado e Controles

| Tecla | Ação |
| :--- | :--- |
| `→` (Seta Direita) | Avança para o próximo lance (`Próximo ▶`) |
| `←` (Seta Esquerda) | Volta um lance (`◀ Anterior`) |
| `Home` | Retorna ao início da partida ou abertura |
| `End` | Avança até a posição final |
| `H` | Aciona o próximo nível de dica progressiva (`💡 Ver Dica 1/3 → 2/3 → 3/3`) |
| `X` ou `F` | Gira a orientação do tabuleiro (Brancas / Pretas) |
