import { useMemo, useState } from 'react';
import powersData from '../data/powers.json';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDebounce } from '../hooks/useDebounce';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from './SearchBar';
import FilterBar, {
  CATEGORIAS, ANIMES, ELEMENTOS, MIN_DANO, MAX_DANO, MIN_CUSTO, MAX_CUSTO
} from './FilterBar';
import PowerCard from './PowerCard';
import PowerModal from './PowerModal';
import EmptyState from './EmptyState';

export default function PowerCatalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramCategoria = searchParams.get('categoria');
  const paramAnime = searchParams.get('anime');
  const paramElemento = searchParams.get('elemento');

  const [busca, setBusca] = useState(searchParams.get('q') || '');
  const [categoria, setCategoria] = useState(
    CATEGORIAS.includes(paramCategoria) ? paramCategoria : 'Todas'
  );
  const [anime, setAnime] = useState(
    ANIMES.includes(paramAnime) ? paramAnime : 'Todos'
  );
  const [elemento, setElemento] = useState(
    ELEMENTOS.includes(paramElemento) ? paramElemento : 'Todos'
  );
  const [danoRange, setDanoRange] = useState([MIN_DANO, MAX_DANO]);
  const [custoRange, setCustoRange] = useState([MIN_CUSTO, MAX_CUSTO]);
  const [somenteFavs, setSomenteFavs] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState('nome');
  const [favoritos, setFavoritos] = useLocalStorage('pa:favoritos', []);
  const [deck, setDeck] = useLocalStorage('pa:deck', []);
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
      const okAnime = anime === 'Todos' || p.anime === anime;
      const okElemento = elemento === 'Todos' || p.elemento === elemento;
      const okDano = p.dano >= danoRange[0] && p.dano <= danoRange[1];
      const okCusto = p.custo >= custoRange[0] && p.custo <= custoRange[1];
      const okFav = !somenteFavs || favoritos.includes(p.id);
      return okBusca && okCat && okAnime && okElemento && okDano && okCusto && okFav;
    });
    return [...lista].sort((a, b) => {
      if (ordenarPor === 'dano') return b.dano - a.dano;
      if (ordenarPor === 'custo') return a.custo - b.custo;
      if (ordenarPor === 'custoBeneficio') {
        const ratioA = a.dano / (a.custo || 1);
        const ratioB = b.dano / (b.custo || 1);
        return ratioB - ratioA;
      }
      return a.nome.localeCompare(b.nome, 'pt-BR');
    });
  }, [termo, categoria, anime, elemento, danoRange, custoRange, somenteFavs, ordenarPor, favoritos]);

  function toggleFav(id) {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function limpar() {
    setBusca('');
    setCategoria('Todas');
    setAnime('Todos');
    setElemento('Todos');
    setDanoRange([MIN_DANO, MAX_DANO]);
    setCustoRange([MIN_CUSTO, MAX_CUSTO]);
    setSomenteFavs(false);
    setOrdenarPor('nome');
  }

  function handleAddToDeck(powerId) {
    setDeck((prev) => prev.includes(powerId) ? prev : [...prev, powerId]);
  }

  function handleTestInDuel(powerId) {
    navigate('/duelo', { state: { preselectPower: powerId } });
  }

  return (
    <section aria-label="Catálogo de poderes">
      <div className="toolbar">
        <SearchBar value={busca} onChange={setBusca} />
        <FilterBar
          categoria={categoria}
          setCategoria={setCategoria}
          anime={anime}
          setAnime={setAnime}
          elemento={elemento}
          setElemento={setElemento}
          danoRange={danoRange}
          setDanoRange={setDanoRange}
          custoRange={custoRange}
          setCustoRange={setCustoRange}
          ordenarPor={ordenarPor}
          setOrdenarPor={setOrdenarPor}
          somenteFavs={somenteFavs}
          setSomenteFavs={setSomenteFavs}
          favCount={favoritos.length}
          onClear={limpar}
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
          onAddToDeck={handleAddToDeck}
          onTestInDuel={handleTestInDuel}
          inDeck={deck.includes(selecionado.id)}
        />
      )}
    </section>
  );
}
