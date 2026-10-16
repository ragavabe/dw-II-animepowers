import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import powersData from '../data/powers.json';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { elementClass, elementImageFallback } from '../data/elementMeta';
import PowerCard from '../components/PowerCard';
import PowerModal from '../components/PowerModal';

const RAIL_SIZE = 10;

export default function Home() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useLocalStorage('pa:favoritos', []);
  const [deck, setDeck] = useLocalStorage('pa:deck', []);
  const [selecionado, setSelecionado] = useState(null);

  const { destaque, populares, novidades, porElemento } = useMemo(() => {
    const porDano = [...powersData].sort((a, b) => b.dano - a.dano);
    const porId = [...powersData].sort((a, b) => b.id - a.id);
    const contagem = powersData.reduce((acc, p) => {
      acc[p.elemento] = (acc[p.elemento] || 0) + 1;
      return acc;
    }, {});

    return {
      destaque: porDano[0],
      populares: porDano.slice(1, RAIL_SIZE + 1),
      novidades: porId.slice(0, RAIL_SIZE),
      porElemento: Object.entries(contagem).sort((a, b) => b[1] - a[1])
    };
  }, []);

  const totalAnimes = useMemo(() => new Set(powersData.map((p) => p.anime)).size, []);

  function toggleFav(id) {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function addToDeck(id) {
    setDeck((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  const destaqueFallback = elementImageFallback(destaque.elemento, 900);

  return (
    <>
      <section className="hero">
        <div>
          <p className="hero-kicker">Catálogo de técnicas</p>
          <h1>
            O poder define <em>a batalha</em>
          </h1>
          <p className="hero-lede">
            Cada técnica com origem, elemento e atributos comparáveis. Compare, favorite,
            monte seu grimório e coloque dois poderes frente a frente.
          </p>

          <div className="btn-row">
            <Link className="btn btn-primary" to="/catalogo">Explorar catálogo</Link>
            <Link className="btn ghost" to="/duelo">Simular duelo</Link>
            <Link className="btn ghost" to="/grimorio">Montar grimório</Link>
            <Link className="btn ghost" to="/afinidade">Teste de afinidade</Link>
          </div>

          <dl className="hero-stats">
            <div>
              <dd className="hero-stat-value">{powersData.length}</dd>
              <dt className="hero-stat-label">técnicas catalogadas</dt>
            </div>
            <div>
              <dd className="hero-stat-value">{porElemento.length}</dd>
              <dt className="hero-stat-label">elementos</dt>
            </div>
            <div>
              <dd className="hero-stat-value">{totalAnimes}</dd>
              <dt className="hero-stat-label">animes</dt>
            </div>
          </dl>
        </div>

        <Link className="hero-art" to="/catalogo" aria-label={`Ver ${destaque.nome} no catálogo`}>
          <img
            className="hero-art-img"
            src={destaque.imagem || destaqueFallback}
            alt={destaque.nome}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = destaqueFallback;
            }}
          />
          <div className="hero-art-fade" />
          <div className="hero-art-caption">
            <span className={`card-element-pill ${elementClass(destaque.elemento)}`}>
              {destaque.elemento}
            </span>
            <h2>{destaque.nome}</h2>
            <p>{destaque.personagem} · {destaque.anime} · dano {destaque.dano}</p>
          </div>
        </Link>
      </section>

      <section className="home-section" aria-labelledby="destaques-titulo">
        <div className="home-section-head">
          <div>
            <h2 id="destaques-titulo">Destaques</h2>
            <p>Ranking das técnicas mais destrutivas do catálogo.</p>
          </div>
          <Link className="home-section-link" to="/catalogo">Ver todos →</Link>
        </div>
        <ul className="rail">
          {populares.map((p) => (
            <PowerCard
              key={p.id}
              power={p}
              isFav={favoritos.includes(p.id)}
              onFav={toggleFav}
              onDetails={setSelecionado}
            />
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="elementos-titulo">
        <div className="home-section-head">
          <div>
            <h2 id="elementos-titulo">Por elemento</h2>
            <p>Cada elemento tem pontos fortes e fraquezas no simulador de duelo.</p>
          </div>
        </div>
        <ul className="element-grid">
          {porElemento.map(([elemento, total]) => (
            <li key={elemento}>
              <Link
                className={`element-tile ${elementClass(elemento)}`}
                to={`/catalogo?elemento=${encodeURIComponent(elemento)}`}
              >
                <span className="element-tile-name">{elemento}</span>
                <span className="element-tile-count">{total} técnica{total > 1 ? 's' : ''}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="novidades-titulo">
        <div className="home-section-head">
          <div>
            <h2 id="novidades-titulo">Novidades no catálogo</h2>
            <p>As últimas técnicas adicionadas à coleção.</p>
          </div>
          <Link className="home-section-link" to="/catalogo">Ver todos →</Link>
        </div>
        <ul className="rail">
          {novidades.map((p) => (
            <PowerCard
              key={p.id}
              power={p}
              isFav={favoritos.includes(p.id)}
              onFav={toggleFav}
              onDetails={setSelecionado}
            />
          ))}
        </ul>
      </section>

      <section className="home-cta">
        <div>
          <h2>Leve duas técnicas para a arena</h2>
          <p>O simulador aplica afinidade elemental e afinidade pessoal ao confronto.</p>
        </div>
        <Link className="btn btn-primary" to="/duelo">Iniciar duelo</Link>
      </section>

      {selecionado && (
        <PowerModal
          power={selecionado}
          isFav={favoritos.includes(selecionado.id)}
          onFav={toggleFav}
          onClose={() => setSelecionado(null)}
          onAddToDeck={addToDeck}
          onTestInDuel={(id) => navigate('/duelo', { state: { preselectPower: id } })}
          inDeck={deck.includes(selecionado.id)}
        />
      )}
    </>
  );
}
