# Chess Mastery — Academia Interativa de Mestres

Aplicativo nativo para macOS Apple Silicon (**Cocoa + WKWebView + React 19 + TypeScript + Tailwind CSS v4**) desenvolvido para estudo interativo e imersivo da literatura clássica do xadrez com conversão em tempo real entre **Notação Descritiva Clássica (`P4R`, `C3BR`, `B4B`)** e **Notação Algébrica (`e4`, `Cf3`, `Bc4` / `♘f3`)**, biblioteca com 4 obras mundiais pré-instaladas e traduzidas, menu teórico com 18 aberturas e defesas, **Modo Adivinhe o Lance (Spoiler-Free)** e motor Stockfish local de avaliação tática integrado (< 5 MB RAM).

---

## 📖 Documentação Completa
Consulte o manual exaustivo de arquitetura, funcionalidades, catálogo de livros e estudos de aberturas no arquivo:
👉 **[DOCUMENTACAO.md](./DOCUMENTACAO.md)**

---

## ⬇️ Download e Instalação

Você pode baixar a versão mais recente diretamente do GitHub Releases ou utilizar o instalador local compilado:

- **Download Direto (.dmg)**: [Chess_Mastery_1.0.0_aarch64.dmg](https://github.com/fabiobertaiolli/chessmastery/releases/download/v1.0.0/Chess_Mastery_1.0.0_aarch64.dmg)
- **Página da Release**: [https://github.com/fabiobertaiolli/chessmastery/releases/tag/v1.0.0](https://github.com/fabiobertaiolli/chessmastery/releases/tag/v1.0.0)
- **Instalador Local (Raiz do Projeto)**: `Chess Mastery_1.0.0_aarch64.dmg`

### Como Instalar no Mac:
1. Baixe o arquivo `.dmg` pelo link acima (ou dê dois cliques no arquivo gerado na raiz).
2. Arraste o ícone do **Chess Mastery** para a pasta **Aplicativos** (`Applications`).
3. Abra o Chess Mastery pelo Launchpad ou Spotlight.

---

## 🌟 Principais Funcionalidades

### 1. 📚 Todos os Livros na Aba Lateral com Modo de Capítulo Isolado
- Acesse todos os 4 clássicos na barra lateral esquerda sem poluição no cabeçalho.
- Expanda os livros via acordeão e clique em **"Isolar"** para focar exclusivamente nos desafios e partidas de um único capítulo com resumo pedagógico e páginas de referência.

### 2. ♟️ Repertório Teórico de Aberturas & Defesas
- Menu com 18 aberturas e defesas fundamentais divididas em:
  - **Aberturas Abertas (1.e4 e5):** Italiana, Evans, Ruy López, Quatro Cavalos, Petroff.
  - **Defesas Semi-Abertas (1.e4 outros):** Siciliana Najdorf, Dragão, Francesa do Avanço, Caro-Kann.
  - **Aberturas Fechadas (1.d4 d5):** QGD, QGA, Eslava, Sistema London.
  - **Defesas Semi-Fechadas & Índias (1.d4 Cf6):** KID (Mar del Plata), Nimzoíndia, Grünfeld.
  - **Flanco:** Abertura Inglesa.
- Cada abertura exibe no painel de estudos:
  - ⚪ **Planos Estratégicos das Brancas**
  - ⚫ **Planos & Defesa das Pretas**
  - ♙ **Estrutura de Peões & Casas Críticas**
  - ⚠️ **Armadilhas & Erros Típicos**
  - 🔗 **Link direto para a Partida Modelo no Livro**

### 3. 🔄 Faixa Rosetta de Notações em Tempo Real
- Alterne o tabuleiro e a planilha a qualquer momento entre **Algébrica PT (`Cf3`)**, **Figurino (`♘f3`)**, **Descritiva PT (`C3BR`)**, **Descritiva ES (`C3AR`)** e **SAN Internacional (`Nf3`)**.

### 4. 🎯 Modo Adivinhe o Lance (Spoiler-Free)
- Oculta a planilha e desafia o estudante a calcular e jogar o lance do mestre no tabuleiro, com dicas táticas progressivas e pontuação de acertos e sequência (*streak*).

### 5. ⚡ Motor Stockfish Local Embutido
- Avaliação posicional em tempo real e visualização de barra vertical de vantagem posicional sem precisar de internet ou servidores remotos.

---

## ⌨️ Atalhos de Teclado
- `→` / `←`: Avançar / Retroceder meio-lance
- `Home` / `End`: Ir para o início / final do estudo
- `X` ou `F`: Inverter orientação do tabuleiro (Brancas / Pretas)
- `Botão Direito do Mouse`: Desenhar setas táticas e marcar casas no tabuleiro

---

## 🛠️ Compilação Manual (macOS)
```bash
cd "/Volumes/Backup/antigravity01/Chess Mastery"
./build_and_move.sh
```
Gera automaticamente o instalador `.dmg` pronto para uso na raiz do projeto.
