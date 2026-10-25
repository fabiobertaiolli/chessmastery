# ♞ Chess Mastery — Academia Lúdica & Treinador Inteligente de Aberturas (v1.2.0)

Aplicativo nativo macOS (`arm64` Apple Silicon) com **Redesign Infantil em Tons Claros** e **Treinador Inteligente de Aberturas**, projetado para transformar o estudo de clássicos do xadrez e aberturas em uma experiência acolhedora, tátil e guiada.

Consulte a documentação completa em **[DOCUMENTACAO.md](file:///Volumes/Backup/antigravity01/Chess%20Mastery/DOCUMENTACAO.md)**.

---

## ✨ Destaques da Versão 1.2.0

- 🎨 **Paleta Clara e Acolhedora**: Creme (`#FFF9ED`), Verde Menta (`#DDF3E5`), Verde Principal (`#16865E`), Azul Céu (`#DCEBFF`), Amarelo Suave (`#FFE5A8`), Coral Suave (`#F9DCD9`) e Tabuleiro em Madeira (`#B58A65` / `#F5E6CE`).
- 🧭 **4 Destinos de Navegação**: `🌟 Aprender` • `📚 Biblioteca` • `♟️ Aberturas` • `🏆 Conquistas`.
- 🌱 **Dois Modos de Uso**:
  - **Modo Aprender (Padrão)**: Tabuleiro dominante, uma tarefa por vez, dicas progressivas em 3 níveis e controles essenciais (`◀ Anterior`, `💡 Ver Dica`, `Próximo ▶`).
  - **Modo Explorador (Opcional)**: Barra vertical de avaliação Stockfish, seletor de 5 notações (`Algébrica PT`, `Figurino`, `Descritiva C3BR`, `Descritiva ES C3AR`, `SAN`) e planilha completa de lances.
- ♟️ **Treinador Inteligente de Aberturas**:
  - Escolha da abertura e da cor (`⚪ Brancas`, `⚫ Pretas`, `☯️ Ambas`) com resposta automática do oponente.
  - Feedback construtivo em 3 níveis (**Lance Teórico Principal**, **Alternativa Plausível**, **Alerta Construtivo**).
  - **Dicas Progressivas em 3 Níveis** (`1: Pergunta` → `2: Peça/Casa` → `3: Solução Explicada`).
  - **Fila de Revisão Inteligente** automática para posições que precisaram de dica ou nova tentativa.
- 🦉📗🤖 **Três Fontes de Orientação Separadas**:
  - `🦉 Do Tutor`: Explicação pedagógica amigável.
  - `📗 Do Livro`: Princípio clássico com citação explícita de **Livro • Autor • Capítulo • Página** + modal `🔎 Fontes & OCR`.
  - `🤖 Do Stockfish`: Análise independente do computador claramente rotulada.

---

## 🚀 Como Compilar e Gerar o `.dmg`

```bash
./build_and_move.sh
```

O instalador nativo `Chess Mastery_1.0.0_aarch64.dmg` é gerado diretamente na raiz da pasta `/Volumes/Backup/antigravity01/Chess Mastery/`.
