import { useMemo, useState } from 'react';
import powersData from '../data/powers.json';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import PowerCard from './PowerCard';
import PowerModal from './PowerModal';
import EmptyState from './EmptyState';

export default function PowerCatalog() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [somenteFavs, setSomenteFavs] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState('nome');
  const [favoritos, setFavoritos] = useLocalStorage('pa:favoritos', []);
  const [selecionado, setSelecionado] = useState(null);

  const termo = useDebounce(busca.trim().toLowerCase(), 200);

  const filtrados = useMemo(() => {
    let lista = powersData.filter((p) => {
      const okBusca =
        !termo ||
        p.nome.toLowerCase().includes(termo) ||
        p.personagem.toLowerCase().includes(termo) ||
        p.anime.toLowerCase().includes(termo);
      const okCat = categoria === 'Todas' || p.categoria === categoria;
      const okFav = !somenteFavs || favoritos.includes(p.id);
      return okBusca && okCat && okFav;
    });
    return [...lista].sort((a, b) => {
      if (ordenarPor === 'dano') return b.dano - a.dano;
      if (ordenarPor === 'custo') return a.custo - b.custo;
      return a.nome.localeCompare(b.nome, 'pt-BR');
    });
  }, [termo, categoria, somenteFavs, ordenarPor, favoritos]);

  function toggleFav(id) {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function limpar() {
    setBusca('');
    setCategoria('Todas');
    setSomenteFavs(false);
  }

  return (
    <section aria-label="Catálogo de poderes">
      <div className="toolbar">
        <SearchBar value={busca} onChange={setBusca} />
        <FilterBar
          categoria={categoria}
          setCategoria={setCategoria}
          ordenarPor={ordenarPor}
          setOrdenarPor={setOrdenarPor}
          somenteFavs={somenteFavs}
          setSomenteFavs={setSomenteFavs}
          favCount={favoritos.length}
        />
      </div>

      <p className="muted" role="status">
        {filtrados.length} poder{filtrados.length !== 1 ? 'es' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}.
      </p>

      {filtrados.length === 0 ? (
        <EmptyState busca={busca} categoria={categoria} onClear={limpar} />
      ) : (
        <ul className="grid">
          {filtrados.map((p) => (
            <PowerCard
              key={p.id}
              power={p}
              isFav={favoritos.includes(p.id)}
              onFav={toggleFav}
              onDetails={setSelecionado}
            />
          ))}
        </ul>
      )}

      {selecionado && (
        <PowerModal
          power={selecionado}
          isFav={favoritos.includes(selecionado.id)}
          onFav={toggleFav}
          onClose={() => setSelecionado(null)}
        />
      )}
    </section>
  );
}
