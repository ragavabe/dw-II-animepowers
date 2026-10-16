import { useMemo, useState } from 'react';
import powersData from '../data/powers.json';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { elementClass } from '../data/elementMeta';

const MAX = 6;

export default function DeckBuilder() {
  const [deck, setDeck] = useLocalStorage('pa:deck', []);
  const [msg, setMsg] = useState('');
  const [importText, setImportText] = useState('');

  const deckPowers = useMemo(
    () => deck.map((id) => powersData.find((p) => p.id === id)).filter(Boolean),
    [deck]
  );
  const totalDano = deckPowers.reduce((s, p) => s + p.dano, 0);
  const totalCusto = deckPowers.reduce((s, p) => s + p.custo, 0);

  function add(id) {
    setMsg('');
    const nid = Number(id);
    if (deck.includes(nid)) return setMsg('Este poder já está no grimório.');
    if (deck.length >= MAX) return setMsg(`Limite de ${MAX} poderes atingido. Remova um para adicionar.`);
    setDeck([...deck, nid]);
  }

  function remove(id) {
    setDeck(deck.filter((d) => d !== id));
    setMsg('');
  }

  function exportar() {
    const json = JSON.stringify(deck, null, 2);
    navigator.clipboard?.writeText(json).catch(() => {});
    setImportText(json);
    setMsg('Deck copiado/exportado abaixo. Salve esse JSON.');
  }

  function importar() {
    try {
      const arr = JSON.parse(importText);
      if (!Array.isArray(arr)) throw new Error('formato');
      const validos = arr.map(Number).filter((n) => powersData.some((p) => p.id === n));
      const unicos = [...new Set(validos)].slice(0, MAX);
      if (unicos.length === 0) throw new Error('vazio');
      setDeck(unicos);
      setMsg(`Deck importado com ${unicos.length} poder(es).`);
    } catch {
      setMsg('JSON inválido. Cole um array como [1, 5, 9].');
    }
  }

  return (
    <div>
      <div className="deck-summary-card card">
        <div className="deck-summary-header">
          <strong>Seu Grimório Ativo ({deck.length}/{MAX})</strong>
          <span className="deck-stats-badges">
            <span className="stat">💥 Dano Total: {totalDano}</span>
            <span className="stat">⚡ Custo Total: {totalCusto}</span>
          </span>
        </div>

        {deckPowers.length === 0 ? (
          <p className="muted">Vazio. Equipe poderes da lista abaixo para montar seu arsenal.</p>
        ) : (
          <div className="deck-items-grid">
            {deckPowers.map((p) => (
              <div key={p.id} className="deck-power-item">
                <img src={p.imagem} alt={p.nome} className="deck-power-thumb" />
                <div className="deck-power-details">
                  <span className="deck-power-name">{p.nome}</span>
                  <small className="muted">{p.categoria} • 💥 {p.dano} • ⚡ {p.custo}</small>
                </div>
                <button className="ghost deck-remove-btn" onClick={() => remove(p.id)} title="Remover do grimório">
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="btn-row">
          <button className="ghost" onClick={() => setDeck([])} disabled={deck.length === 0}>Limpar deck</button>
          <button className="ghost" onClick={exportar} disabled={deck.length === 0}>Exportar JSON</button>
        </div>
      </div>

      {msg && <p role="status" className="form-status">{msg}</p>}

      <h3 className="section-title">Equipar técnicas ({powersData.length} disponíveis)</h3>
      <ul className="deck-add-grid">
        {powersData.map((p) => (
          <li key={p.id} className="card deck-add-card">
            <div className="deck-card-thumb-wrap">
              <img src={p.imagem} alt={p.nome} className="deck-card-thumb" loading="lazy" />
              <span className={`deck-card-element ${elementClass(p.elemento)}`}>{p.elemento}</span>
            </div>
            <div className="deck-add-info">
              <strong>{p.nome}</strong>
              <small className="muted">{p.personagem} · {p.anime}</small>
              <div className="deck-add-stats">
                <span className="card-stat"><span className="card-stat-label">Dano</span><span className="card-stat-value stat-dano">{p.dano}</span></span>
                <span className="card-stat"><span className="card-stat-label">Custo</span><span className="card-stat-value stat-custo">{p.custo}</span></span>
              </div>
            </div>
            <button className="ghost" onClick={() => add(p.id)} disabled={deck.includes(p.id)}>
              {deck.includes(p.id) ? 'Equipado ✓' : '+ Equipar'}
            </button>
          </li>
        ))}
      </ul>

      <h3 className="section-title">Importar grimório</h3>
      <div className="toolbar">
        <input
          type="text"
          placeholder='Cole JSON ex: [1, 5, 9]'
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          aria-label="JSON do deck para importar"
          style={{ flex: 1 }}
        />
        <button onClick={importar}>Importar</button>
      </div>
    </div>
  );
}
