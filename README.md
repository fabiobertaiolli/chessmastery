# Chess Mastery — Estúdio Clássico & Treinador de Aberturas (v1.3.0)

Aplicativo nativo macOS (`arm64` Apple Silicon) desenhado com a arquitetura **`Framed Sheet` (`taste-skill` v2.1)** para o estudo guiado de clássicos do xadrez e o treinamento inteligente de aberturas.

Consulte a documentação completa em **[DOCUMENTACAO.md](file:///Volumes/Backup/antigravity01/Chess%20Mastery/DOCUMENTACAO.md)**.

---

## Destaques da Versão 1.3.0 (`taste-skill` Framed Sheet)

- **Shell & Estilo `Framed Sheet` (`taste-skill` v2.1)**:
  - Moldura em **L** contínua (`--ground: #f4f6f5`) unindo a barra lateral esquerda (`248px`) e a barra superior (`48px`) sem linha divisória entre elas.
  - Área de estudo sobre uma **folha branca (`--surface: #ffffff`)** recuada `8px` das bordas direita e inferior, com `border-radius: 16px`, borda hairline de `1px solid #e6e8ea` e zero sombra.
  - Tipografia `IBM Plex Sans` + `IBM Plex Mono` (`tabular-nums`) para códigos ECO, coordenadas e lances, com ícones vetoriais de `1.5px stroke` (sem emojis) e abas com sublinhado de `2px`.
- **4 Destinos Principais na Moldura Lateral**:
  - `Aprender e revisar` (com contador ativo da Fila de Revisão) · `Biblioteca de livros` (`4 livros`) · `Aberturas e defesas` (`18 linhas`) · `Progresso e acervo`.
- **Acordeão de Livros e Modo Isolado de Capítulos**:
  - Todos os 4 livros clássicos (*Xadrez Básico*, *Meu Sistema*, *Mikhail Tal*, *Bobby Fischer*) acessíveis simultaneamente na barra lateral esquerda, com abertura de capítulos em modo isolado.
- **Dois Modos de Uso (`Modo Aprender` vs. `Modo Explorador`)**:
  - **Modo Aprender (Padrão)**: Foco limpo no tabuleiro, uma tarefa por vez e dicas progressivas em 3 níveis.
  - **Modo Explorador (Opcional)**: Ativa barra de avaliação vertical do Stockfish e seletor das 5 notações (`Algébrica PT`, `Figurino`, `Descritiva C3BR`, `Espanhol C3AR`, `SAN`).
- **Treinador Inteligente de Aberturas & 3 Fontes Separadas**:
  - Treino por cor (`Brancas`, `Pretas`, `Ambas`), feedback construtivo em 3 faixas, dicas progressivas em 3 níveis e separação clara entre **Do Tutor**, **Do Livro** (com citação de Livro, Autor, Capítulo e Página + modal de Pipeline OCR) e **Do Stockfish**.

---

## Como Compilar e Gerar o `.dmg`

```bash
./build_and_move.sh
```

O instalador nativo `Chess Mastery_1.0.0_aarch64.dmg` é gerado diretamente na raiz da pasta `/Volumes/Backup/antigravity01/Chess Mastery/`.
