import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ELEMENT_FALLBACKS = {
  Fogo: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=800&auto=format&fit=crop&q=80',
  Água: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80',
  Vento: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop&q=80',
  Trovão: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
  Luz: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
  Sombra: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&auto=format&fit=crop&q=80',
  Espaço: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  Tempo: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&auto=format&fit=crop&q=80',
  Físico: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
  Terra: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  Energia: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
};

const MAX_DECK = 6;

export default function PowerModal({ power, isFav, onFav, onClose, onAddToDeck, onTestInDuel, inDeck }) {
  const navigate = useNavigate();
  const [deck, setDeck] = useLocalStorage('pa:deck', []);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!power) return null;

  const fallback = ELEMENT_FALLBACKS[power.elemento] || ELEMENT_FALLBACKS.Energia;

  function handleAddToDeck() {
    if (deck.includes(power.id)) {
      setMsg('Este poder já está no grimório.');
      return;
    }
    if (deck.length >= MAX_DECK) {
      setShowDeckFull(true);
      setMsg(`Limite de ${MAX_DECK} poderes atingido. Remova um para adicionar.`);
      return;
    }
    setDeck([...deck, power.id]);
    setMsg(`"${power.nome}" adicionado ao Grimório!`);
    if (onAddToDeck) onAddToDeck(power.id);
  }

  function handleTestInDuel() {
    onClose();
    if (onTestInDuel) {
      onTestInDuel(power.id);
    } else {
      navigate('/duelo', { state: { preselectPower: power.id } });
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes de ${power.nome}`}
        className="modal modal-power-details"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner com a Imagem do Poder */}
        <div className="modal-hero-cover">
          <img
            src={power.imagem || fallback}
            alt={power.nome}
            className="modal-hero-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallback;
            }}
          />
          <div className="modal-hero-gradient" />
          <span className={`card-element-pill modal-element-badge element-${power.elemento?.toLowerCase() || 'default'}`}>
            {power.elemento}
          </span>
          <button
            className="modal-close-icon-btn"
            onClick={onClose}
            aria-label="Fechar modal"
            title="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="modal-content-body">
          <div className="modal-title-row">
            <div>
              <h2 className="modal-power-title">{power.nome}</h2>
              <p className="modal-power-subtitle">
                <span className="modal-category-tag">{power.categoria}</span> • <span className="modal-anime-tag">{power.anime}</span>
              </p>
            </div>
            <button
              onClick={() => onFav(power.id)}
              className={isFav ? 'fav modal-fav-btn active' : 'fav modal-fav-btn'}
              title={isFav ? 'Remover favorito' : 'Favoritar'}
            >
              {isFav ? '★ Favorito' : '☆ Favoritar'}
            </button>
          </div>

          <div className="modal-stats-grid">
            <div className="modal-stat-box">
              <span className="modal-stat-label">Elemento</span>
              <span className="modal-stat-value">{power.elemento}</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-label">Poder de Dano</span>
              <span className="modal-stat-value modal-val-dano">💥 {power.dano}</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-label">Alcance</span>
              <span className="modal-stat-value">{power.alcance}</span>
            </div>
            <div className="modal-stat-box">
              <span className="modal-stat-label">Custo de Energia</span>
              <span className="modal-stat-value modal-val-custo">⚡ {power.custo}</span>
            </div>
          </div>

          <div className="modal-character-card">
            <div className="modal-char-avatar">👤</div>
            <div className="modal-char-info">
              <span className="modal-char-role">Personagem Portador</span>
              <strong className="modal-char-name">{power.personagem}</strong>
              <span className="modal-char-anime">Origem: {power.anime}</span>
            </div>
          </div>

          <div className="modal-desc-box">
            <h4>Descrição da Técnica</h4>
            <p>{power.descricao}</p>
          </div>

          <div className="modal-actions">
            <button onClick={() => onFav(power.id)}>
              {isFav ? '★ Remover dos Favoritos' : '☆ Adicionar aos Favoritos'}
            </button>
            <button onClick={handleAddToDeck} disabled={inDeck || deck.length >= MAX_DECK} style={{ marginRight: '0.5rem' }}>
              {inDeck ? '✓ No Grimório' : deck.length >= MAX_DECK ? 'Grimório Cheio' : '+ Adicionar ao Grimório'}
            </button>
            <button onClick={handleTestInDuel} style={{ marginRight: '0.5rem' }}>
              ⚔️ Testar no Duelo
            </button>
            <button className="ghost" onClick={onClose}>Fechar (ESC)</button>
          </div>

          {msg && (
            <p role="status" style={{ color: '#ffd27c', marginTop: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
