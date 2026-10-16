import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { elementClass, elementImageFallback } from '../data/elementMeta';

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

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  if (!power) return null;

  const fallback = elementImageFallback(power.elemento, 900);
  const deckFull = deck.length >= MAX_DECK;

  function handleAddToDeck() {
    if (deck.includes(power.id)) {
      setMsg('Este poder já está no grimório.');
      return;
    }
    if (deckFull) {
      setMsg(`Limite de ${MAX_DECK} poderes atingido. Remova um para adicionar.`);
      return;
    }
    setDeck([...deck, power.id]);
    setMsg(`"${power.nome}" adicionado ao grimório.`);
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
        aria-labelledby="power-detail-title"
        className="modal modal-power-details"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-icon-btn"
          onClick={onClose}
          aria-label="Fechar detalhes"
          title="Fechar (ESC)"
        >
          ✕
        </button>

        <div className="power-detail">
          <div className="power-detail-art">
            <img
              src={power.imagem || fallback}
              alt={power.nome}
              className="modal-hero-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallback;
              }}
            />
            <div className="power-detail-art-fade" />
            <div className="power-detail-art-caption">
              <span className={`card-element-pill modal-element-badge ${elementClass(power.elemento)}`}>
                {power.elemento}
              </span>
              <h2 id="power-detail-title">{power.nome}</h2>
              <p>{power.personagem} · {power.anime}</p>
            </div>
          </div>

          <div className="power-detail-body">
            <p className="power-detail-kicker">Técnica de {power.categoria}</p>

            <section>
              <h3 className="power-detail-section-title">A técnica</h3>
              <p className="power-detail-desc">{power.descricao}</p>
            </section>

            <section>
              <h3 className="power-detail-section-title">Atributos</h3>
              <div className="modal-stats-grid">
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Elemento</span>
                  <span className="modal-stat-value">{power.elemento}</span>
                </div>
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Dano</span>
                  <span className="modal-stat-value modal-val-dano">{power.dano}</span>
                </div>
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Alcance</span>
                  <span className="modal-stat-value">{power.alcance}</span>
                </div>
                <div className="modal-stat-box">
                  <span className="modal-stat-label">Custo</span>
                  <span className="modal-stat-value modal-val-custo">{power.custo}</span>
                </div>
              </div>
            </section>

            <div className="modal-actions">
              <button onClick={handleAddToDeck} disabled={inDeck || deckFull}>
                {inDeck ? '✓ No grimório' : deckFull ? 'Grimório cheio' : 'Adicionar ao grimório'}
              </button>
              <button className="ghost" onClick={handleTestInDuel}>
                Testar no duelo
              </button>
              <button
                className={isFav ? 'fav modal-fav-btn active' : 'fav modal-fav-btn'}
                onClick={() => onFav(power.id)}
                aria-pressed={isFav}
              >
                {isFav ? '★ Favorito' : '☆ Favoritar'}
              </button>
            </div>

            {msg && <p role="status" className="modal-status">{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
