import { useMemo, useState } from 'react';
import powersData from '../data/powers.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

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
      <p className="muted">Monte seu grimório com até {MAX} poderes. Salvo automaticamente no banco local.</p>

      <div className="card deck-summary-card">
        <div className="deck-summary-header">
          <strong>Seu Grimório Ativo ({deck.length}/{MAX})</strong>
          <span className="deck-stats-badges">
            <span className="stat">💥 Dano Total: {totalDano}</span>
            <span className="stat">⚡ Custo Total: {totalCusto}</span>
          </span>
        </div>

        {deckPowers.length === 0 ? (
          <p className="muted" style={{ margin: '1rem 0' }}>Vazio. Adicione poderes da lista abaixo para equipar seu arsenal.</p>
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

        <div className="btn-row" style={{ marginTop: '1rem' }}>
          <button className="ghost" onClick={() => setDeck([])} disabled={deck.length === 0}>Limpar deck</button>
          <button className="ghost" onClick={exportar} disabled={deck.length === 0}>Exportar JSON</button>
        </div>
      </div>

      {msg && <p role="status" style={{ color: '#ffd27c', margin: '0.8rem 0' }}>{msg}</p>}

      <h3 style={{ marginTop: '2rem' }}>Adicionar ao Grimório ({powersData.length} disponíveis)</h3>
      <ul className="grid">
        {powersData.map((p) => (
          <li key={p.id} className="card deck-add-card">
            <div className="deck-card-thumb-wrap">
              <img src={p.imagem} alt={p.nome} className="deck-card-thumb" loading="lazy" />
              <span className="deck-card-element">{p.elemento}</span>
            </div>
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>{p.nome}</strong>
              <small className="muted">{p.categoria} • {p.anime}</small>
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem' }}>
                <span className="stat" style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem' }}>💥 {p.dano}</span>
                <span className="stat" style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem' }}>⚡ {p.custo}</span>
              </div>
            </div>
            <button
              className="ghost"
              onClick={() => add(p.id)}
              disabled={deck.includes(p.id)}
              style={{ marginTop: '0.4rem' }}
            >
              {deck.includes(p.id) ? 'No grimório ✓' : '+ Equipar'}
            </button>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: '2rem' }}>Importar deck</h3>
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
