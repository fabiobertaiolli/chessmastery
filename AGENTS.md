# Diretrizes Locais — Chess Mastery

Consulte sempre `/Volumes/Backup/antigravity01/AGENTS.md` e `./resumo-trabalho.md` antes de iniciar modificações neste projeto.

- **Módulos Compartilhados (`shared/`)**: As conversões de notação descritiva/algébrica e o sintetizador de áudio residem em `/Volumes/Backup/antigravity01/shared/ui/chess/`.
- **Arquitetura de Livros**: Os livros brutos em `.pdf` e `.epub` ficam armazenados na pasta `./Books/` (ignorados no Git pelo tamanho) e são pré-processados, validados e traduzidos dentro de `src/data/preinstalledBooks.ts` a cada nova versão lançada.
- **Build macOS**: Utilize `./build_and_move.sh` para gerar o instalador `.dmg` na raiz de `/Volumes/Backup/antigravity01/Chess Mastery/`.
