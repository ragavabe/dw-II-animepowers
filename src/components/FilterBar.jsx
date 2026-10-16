import powersData from '../data/powers.json';

const CATEGORIAS = [
  'Todas',
  'Ninjutsu',
  'Akuma no Mi',
  'Ki',
  'Nen',
  'Respiração',
  'Stand',
  'Reiatsu',
  'Feitiço',
  'Individualidade',
  'Titã',
  'Sombra',
  'Anti-Magia',
  'Alquimia',
];

const ANIMES = ['Todos', ...new Set(powersData.map(p => p.anime))].sort();
const ELEMENTOS = ['Todos', ...new Set(powersData.map(p => p.elemento))].sort();

const MIN_DANO = Math.min(...powersData.map(p => p.dano));
const MAX_DANO = Math.max(...powersData.map(p => p.dano));
const MIN_CUSTO = Math.min(...powersData.map(p => p.custo));
const MAX_CUSTO = Math.max(...powersData.map(p => p.custo));

export { CATEGORIAS, ANIMES, ELEMENTOS, MIN_DANO, MAX_DANO, MIN_CUSTO, MAX_CUSTO };

export default function FilterBar({
  categoria,
  setCategoria,
  anime,
  setAnime,
  elemento,
  setElemento,
  danoRange,
  setDanoRange,
  custoRange,
  setCustoRange,
  ordenarPor,
  setOrdenarPor,
  somenteFavs,
  setSomenteFavs,
  favCount,
  onClear
}) {
  return (
    <div className="filter-bar">
      <div className="filter-row">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Filtrar por categoria">
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={anime} onChange={(e) => setAnime(e.target.value)} aria-label="Filtrar por anime">
          {ANIMES.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select value={elemento} onChange={(e) => setElemento(e.target.value)} aria-label="Filtrar por elemento">
          {ELEMENTOS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <div className="filter-row filter-range-row">
        <div className="range-filter">
          <label htmlFor="dano-min">
            Dano: {danoRange[0]}–{danoRange[1]}
          </label>
          <div className="range-inputs">
            <input
              id="dano-min"
              type="range"
              min={MIN_DANO}
              max={MAX_DANO}
              value={danoRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDanoRange([Math.min(val, danoRange[1]), danoRange[1]]);
              }}
              aria-label="Dano mínimo"
            />
            <input
              type="range"
              min={MIN_DANO}
              max={MAX_DANO}
              value={danoRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDanoRange([danoRange[0], Math.max(val, danoRange[0])]);
              }}
              aria-label="Dano máximo"
            />
          </div>
        </div>

        <div className="range-filter">
          <label htmlFor="custo-min">
            Custo: {custoRange[0]}–{custoRange[1]}
          </label>
          <div className="range-inputs">
            <input
              id="custo-min"
              type="range"
              min={MIN_CUSTO}
              max={MAX_CUSTO}
              value={custoRange[0]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCustoRange([Math.min(val, custoRange[1]), custoRange[1]]);
              }}
              aria-label="Custo mínimo"
            />
            <input
              type="range"
              min={MIN_CUSTO}
              max={MAX_CUSTO}
              value={custoRange[1]}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCustoRange([custoRange[0], Math.max(val, custoRange[0])]);
              }}
              aria-label="Custo máximo"
            />
          </div>
        </div>
      </div>

      <div className="filter-row filter-actions">
        <select value={ordenarPor} onChange={(e) => setOrdenarPor(e.target.value)} aria-label="Ordenar resultados">
          <option value="nome">A–Z</option>
          <option value="dano">Maior dano</option>
          <option value="custo">Menor custo</option>
          <option value="custoBeneficio">Melhor custo-benefício</option>
        </select>

        <label className="check">
          <input
            type="checkbox"
            checked={somenteFavs}
            onChange={(e) => setSomenteFavs(e.target.checked)}
          />
          Favoritos ({favCount})
        </label>

        <button className="ghost" onClick={onClear} aria-label="Limpar todos os filtros">
          Limpar filtros
        </button>
      </div>
    </div>
  );
}
