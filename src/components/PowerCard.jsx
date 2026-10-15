import React from 'react';

// Imagens padrão de fallback temáticas de acordo com o elemento
const ELEMENT_FALLBACKS = {
  Fogo: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=600&auto=format&fit=crop&q=80',
  Água: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&auto=format&fit=crop&q=80',
  Vento: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&auto=format&fit=crop&q=80',
  Trovão: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
  Luz: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80',
  Sombra: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&auto=format&fit=crop&q=80',
  Espaço: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  Tempo: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=600&auto=format&fit=crop&q=80',
  Físico: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
  Terra: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
  Energia: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80'
};

export default function PowerCard({ power, isFav, onFav, onDetails }) {
  const fallback = ELEMENT_FALLBACKS[power.elemento] || ELEMENT_FALLBACKS.Energia;

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
        <span className={`card-element-pill element-${power.elemento?.toLowerCase() || 'default'}`}>
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
        <header>
          <strong className="card-title" onClick={() => onDetails(power)} title={power.nome}>
            {power.nome}
          </strong>
        </header>

        <div className="card-meta">
          <span className="card-category-tag">{power.categoria}</span>
          <span className="card-anime-tag">{power.anime}</span>
        </div>

        <div className="card-stats-row">
          <span className="stat stat-dano" title="Poder de Dano">💥 {power.dano}</span>
          <span className="stat stat-alcance" title="Alcance">{power.alcance}</span>
          <span className="stat stat-custo" title="Custo de Energia">⚡ {power.custo}</span>
        </div>

        <p className="char" title="Personagem Usuário">
          <span className="char-icon">👤</span> {power.personagem}
        </p>

        <button className="ghost card-details-btn" onClick={() => onDetails(power)}>
          Ver detalhes
        </button>
      </div>
    </li>
  );
}
