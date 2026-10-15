export const CATEGORIAS = [
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

export default function FilterBar({ categoria, setCategoria, ordenarPor, setOrdenarPor, somenteFavs, setSomenteFavs, favCount }) {
  return (
    <>
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Filtrar por categoria">
        {CATEGORIAS.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select value={ordenarPor} onChange={(e) => setOrdenarPor(e.target.value)} aria-label="Ordenar resultados">
        <option value="nome">A–Z</option>
        <option value="dano">Maior dano</option>
        <option value="custo">Menor custo</option>
      </select>
      <label className="check">
        <input
          type="checkbox"
          checked={somenteFavs}
          onChange={(e) => setSomenteFavs(e.target.checked)}
        />
        Favoritos ({favCount})
      </label>
    </>
  );
}
