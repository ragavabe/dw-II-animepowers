# Anime Powers — Catálogo e Simulador de Batalhas

Tema: **Poderes de Anime** (Ninjutsu, Akuma no Mi, Nen, Ki, Feitiços, Respiração, Stand, Reiatsu).

## 1. Visão Geral
**Objetivo:** catalogar habilidades de animes e permitir simulação lúdica de duelos, montagem de grimório/deck e descoberta de afinidade elemental.

**Problema resolvido:** informações sobre poderes ficam dispersas em wikis/fóruns, sem comparação padronizada (dano, alcance, custo, elemento). O app centraliza 54+ poderes com atributos uniformes e interações práticas.

**Público-alvo:** fãs de anime, estudantes de desenvolvimento web e avaliadores acadêmicos.

## 2. Tech Stack
- Linguagens: JavaScript (ES2022), HTML5, CSS3
- Framework: React 18/19 + Vite 5/8
- Roteamento: `react-router-dom` com `HashRouter` (compatível com GitHub Pages)
- Estilo: CSS3 puro com variáveis (tema anime/cyberpunk/fantasy), Grid + Flex, responsivo
- Persistência: LocalStorage (`pa:favoritos`, `pa:deck`, `pa:duelos`, `pa:afinidade`)
- Dados: Mock JSON em `src/data/powers.json` (54+ poderes)
- Deploy: `gh-pages` + GitHub Actions (build estático em `dist/`)
- Ferramentas: Node 20+, npm, VS Code, Git

## 3. Recursos e Funcionalidades (efetivamente implementado)
- [x] Catálogo com busca em tempo real (nome/personagem/anime) + debounce 200ms
- [x] Filtro por categoria (10 categorias) + ordenação (A–Z, maior dano, menor custo)
- [x] Modal de detalhes: dano, alcance, elemento, custo, descrição, personagem/anime (ESC fecha, `aria-modal`)
- [x] Favoritos com LocalStorage + filtro “somente favoritos” + contador
- [x] Simulador de Duelo: 2 poderes, fórmula `dano×0.7 + (100−custo)×0.3 + rand(0–10)`, barra de HP, histórico persistente (20 últimos)
- [x] Grimório/Deck: até 6 poderes, validação anti-duplicata e limite, export/import JSON, totais de dano/custo
- [x] Teste de Afinidade: quiz de 5 perguntas → Fogo/Água/Vento/Terra/Energia, resultado persistido
- [x] Responsivo mobile/tablet/desktop, estados vazios, feedback visual imediato, contraste AA
- [ ] Não incluído (proposital): backend, login, API externa — tudo é 100% estático para GitHub Pages

## 4. Requisitos Funcionais e Não-Funcionais
**RF1 — Catálogo interativo:** listagem, filtro por categoria, busca em tempo real → `src/components/PowerCatalog.jsx` + `SearchBar.jsx` + `FilterBar.jsx` + `powers.json`.
**RF2 — Detalhes da habilidade:** modal/página com dano, alcance, elemento, descrição, personagem → `src/components/PowerModal.jsx`.
**RF3 — Módulo interativo:** Grimório + Duelo + Afinidade → `DeckBuilder.jsx`, `DuelSimulator.jsx`, `AffinityTest.jsx`.
**RF4 — Persistência local:** favoritos/decks salvos em LocalStorage → `src/hooks/useLocalStorage.js`.

**RNF1 — Responsividade:** Grid `repeat(auto-fill,minmax(250px,1fr))`, breakpoint 720px, header sticky, testado em DevTools mobile.
**RNF2 — Desempenho:** `useMemo` na filtragem, debounce, bundle Vite otimizado, sem dependência pesada (sem Tailwind runtime).
**RNF3 — Usabilidade/Acessibilidade:** labels/`aria-*`, foco visível, navegação por teclado, `role=status/alert` em vazio/erro.
**RNF4 — Segurança/Estabilidade:** validação (quiz incompleto, duelo igual, deck duplicado/limite, JSON inválido), try/catch no LocalStorage, rota `*` → Home.

## 5. Guia de Acesso e Execução
Site (GitHub Pages): `https://SEU-USUARIO.github.io/poderesanime/`
Repositório: `https://github.com/SEU-USUARIO/poderesanime`

Rodar localmente:
```bash
git clone https://github.com/SEU-USUARIO/poderesanime.git
cd poderesanime
npm install
npm run dev     # http://localhost:5173
npm run build   # valida build estático (gera dist/)
npm run deploy  # publica com gh-pages (ou push na main p/ Actions)
```

Deploy via Actions: push na branch `main` → workflow `.github/workflows/deploy.yml` publica `dist/` no Pages. Em Settings → Pages, selecione “GitHub Actions”. Ajuste `vite.config.js → base: '/poderesanime/'` para o nome exato do repo e `homepage` no `package.json`.

## 6. Divisão de Tarefas do Grupo
| Integrante | Contribuição técnica | Arquivos principais |
|---|---|---|
| Nome 1 — Catálogo | Busca, filtro categoria, ordenação, mock JSON | `PowerCatalog.jsx`, `SearchBar.jsx`, `FilterBar.jsx`, `data/powers.json` |
| Nome 2 — Detalhes + Favoritos | Modal acessível, `useLocalStorage`, cards/estados vazios | `PowerModal.jsx`, `PowerCard.jsx`, `EmptyState.jsx`, `hooks/` |
| Nome 3 — Duelo + Afinidade | Fórmula duelo, HP, histórico, quiz 5 perguntas | `DuelSimulator.jsx`, `AffinityTest.jsx`, `pages/Duelo.jsx`, `pages/Afinidade.jsx` |
| Nome 4 — Deck + Deploy | Grimório, Router, base/Actions, README/vídeo | `DeckBuilder.jsx`, `App.jsx`, `vite.config.js`, `deploy.yml`, `README.md` |

> Substitua `SEU-USUARIO` e os nomes antes da entrega. Não liste funcionalidade não implementada.

## 7. Estrutura de pastas
```
src/
├── components/ (Header, PowerCatalog, PowerCard, PowerModal, SearchBar, FilterBar, DuelSimulator, DeckBuilder, AffinityTest, EmptyState)
├── pages/ (Home, Catalogo, Duelo, Grimorio, Afinidade)
├── data/powers.json
├── hooks/ (useLocalStorage, useDebounce)
├── styles/globals.css
├── App.jsx (HashRouter)
└── main.jsx
```

## 8. Licença acadêmica
Uso educacional. Nomes/imagens de animes pertencem aos detentores.
