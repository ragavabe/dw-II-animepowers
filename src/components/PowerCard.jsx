import { elementClass, elementImageFallback } from '../data/elementMeta';

export default function PowerCard({ power, isFav, onFav, onDetails }) {
  const fallback = elementImageFallback(power.elemento);

  return (
    <li className="card power-card-item">
      <div className="card-media-wrapper" onClick={() => onDetails(power)}>
        <img
          src={power.imagem || fallback}
          alt={power.nome}
          className="card-media-img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallback;
          }}
        />
        <div className="card-media-overlay" />
        <span className="card-media-cta" aria-hidden="true">Ver detalhes</span>
        <span className={`card-element-pill ${elementClass(power.elemento)}`}>
          {power.elemento}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFav(power.id);
          }}
          aria-pressed={isFav}
          aria-label={isFav ? `Remover ${power.nome} dos favoritos` : `Favoritar ${power.nome}`}
          className={isFav ? 'fav card-fav-btn active' : 'fav card-fav-btn'}
          title={isFav ? 'Remover favorito' : 'Favoritar'}
        >
          {isFav ? '★' : '☆'}
        </button>
      </div>

      <div className="card-body">
        <button className="card-title-btn" onClick={() => onDetails(power)}>
          <span className="card-title">{power.nome}</span>
        </button>

        <div className="card-meta">
          <span className="card-char">{power.personagem}</span>
          <span className="card-anime-tag">{power.anime} · {power.categoria}</span>
        </div>

        <div className="card-stats-row">
          <span className="card-stat" title="Poder de dano">
            <span className="card-stat-label">Dano</span>
            <span className="card-stat-value stat-dano">{power.dano}</span>
          </span>
          <span className="card-stat" title="Alcance">
            <span className="card-stat-label">Alc.</span>
            <span className="card-stat-value">{power.alcance}</span>
          </span>
          <span className="card-stat" title="Custo de energia">
            <span className="card-stat-label">Custo</span>
            <span className="card-stat-value stat-custo">{power.custo}</span>
          </span>
        </div>
      </div>
    </li>
  );
}
