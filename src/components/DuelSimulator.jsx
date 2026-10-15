import { useMemo, useState } from 'react';
import powersData from '../data/powers.json';
import { useLocalStorage } from '../hooks/useLocalStorage';

function score(p) {
  return p.dano * 0.7 + (100 - p.custo) * 0.3 + Math.random() * 10;
}

export default function DuelSimulator() {
  const [idA, setIdA] = useState(powersData[4].id);
  const [idB, setIdB] = useState(powersData[0].id);
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useLocalStorage('pa:duelos', []);

  const powerA = useMemo(() => powersData.find((p) => p.id === Number(idA)), [idA]);
  const powerB = useMemo(() => powersData.find((p) => p.id === Number(idB)), [idB]);

  function lutar() {
    if (!powerA || !powerB) return;
    if (powerA.id === powerB.id) {
      setResultado({ erro: 'Escolha dois poderes diferentes para duelar.' });
      return;
    }
    const sA = score(powerA);
    const sB = score(powerB);
    const vencedor = sA >= sB ? powerA : powerB;
    const total = sA + sB;
    const hpA = Math.round((sA / total) * 100);
    const hpB = 100 - hpA;
    const entry = {
      data: new Date().toISOString(),
      a: powerA.nome,
      b: powerB.nome,
      vencedor: vencedor.nome,
      vencedorImg: vencedor.imagem,
      placar: `${sA.toFixed(1)} x ${sB.toFixed(1)}`,
    };
    setResultado({
      sA,
      sB,
      vencedor,
      hpA,
      hpB,
      log: [`${powerA.nome} (${sA.toFixed(1)}) vs ${powerB.nome} (${sB.toFixed(1)})`, `Vencedor: ${vencedor.nome}`]
    });
    setHistorico((h) => [entry, ...h].slice(0, 20));
  }

  return (
    <div>
      <div className="duel-grid">
        <div className="card duel-fighter-card">
          {powerA && (
            <div className="duel-fighter-banner">
              <img src={powerA.imagem} alt={powerA.nome} className="duel-fighter-img" />
              <div className="duel-fighter-overlay" />
              <span className="duel-fighter-tag">Lutador 1</span>
            </div>
          )}
          <label style={{ display: 'block', marginTop: '0.4rem' }}>
            <strong>Escolha a Habilidade</strong>
            <select
              value={idA}
              onChange={(e) => setIdA(e.target.value)}
              style={{ width: '100%', marginTop: 6 }}
            >
              {powersData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.personagem} ({p.anime})
                </option>
              ))}
            </select>
          </label>
          {powerA && (
            <div className="duel-stats-summary">
              <span className="stat">💥 Dano {powerA.dano}</span>
              <span className="stat">⚡ Custo {powerA.custo}</span>
              <span className="stat">{powerA.elemento}</span>
              <p className="char" style={{ marginTop: 6 }}>{powerA.personagem} ({powerA.anime})</p>
            </div>
          )}
        </div>

        <div className="card duel-fighter-card">
          {powerB && (
            <div className="duel-fighter-banner">
              <img src={powerB.imagem} alt={powerB.nome} className="duel-fighter-img" />
              <div className="duel-fighter-overlay" />
              <span className="duel-fighter-tag">Lutador 2</span>
            </div>
          )}
          <label style={{ display: 'block', marginTop: '0.4rem' }}>
            <strong>Escolha a Habilidade</strong>
            <select
              value={idB}
              onChange={(e) => setIdB(e.target.value)}
              style={{ width: '100%', marginTop: 6 }}
            >
              {powersData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.personagem} ({p.anime})
                </option>
              ))}
            </select>
          </label>
          {powerB && (
            <div className="duel-stats-summary">
              <span className="stat">💥 Dano {powerB.dano}</span>
              <span className="stat">⚡ Custo {powerB.custo}</span>
              <span className="stat">{powerB.elemento}</span>
              <p className="char" style={{ marginTop: 6 }}>{powerB.personagem} ({powerB.anime})</p>
            </div>
          )}
        </div>
      </div>

      <div className="btn-row" style={{ marginTop: '1.2rem' }}>
        <button onClick={lutar} style={{ fontSize: '1rem', padding: '0.7rem 1.4rem' }}>
          ⚔️ Iniciar Duelo de Anime
        </button>
        <button className="ghost" onClick={() => setResultado(null)}>
          Limpar
        </button>
      </div>

      {resultado?.erro && <p role="alert" style={{ color: '#ff8296', marginTop: 10 }}>{resultado.erro}</p>}

      {resultado && !resultado.erro && (
        <div className="card duel-result-card" style={{ marginTop: '1.5rem' }}>
          <div className="duel-winner-header">
            {resultado.vencedor.imagem && (
              <img
                src={resultado.vencedor.imagem}
                alt={resultado.vencedor.nome}
                className="duel-winner-thumb"
              />
            )}
            <div>
              <span className="duel-trophy-badge">🏆 VENCEDOR DO CONFRONTO</span>
              <h2 style={{ margin: '0.2rem 0' }}>{resultado.vencedor.nome}</h2>
              <p className="muted" style={{ margin: 0 }}>
                {resultado.vencedor.personagem} • {resultado.vencedor.anime} ({resultado.vencedor.categoria})
              </p>
            </div>
          </div>

          <div className="duel-bars" style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>{powerA.nome}</span>
                <span>{resultado.hpA}%</span>
              </div>
              <div className="hp"><div style={{ width: `${resultado.hpA}%` }} /></div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>{powerB.nome}</span>
                <span>{resultado.hpB}%</span>
              </div>
              <div className="hp"><div style={{ width: `${resultado.hpB}%` }} /></div>
            </div>
          </div>
          <p className="muted" style={{ fontSize: '0.8rem', marginTop: 8 }}>
            Fórmula: Dano × 0.7 + (100 − Custo) × 0.3 + Bônus Aleatório de Combate (0–10)
          </p>
        </div>
      )}

      <h3 style={{ marginTop: '2rem' }}>Histórico de Duelos ({historico.length})</h3>
      {historico.length === 0 ? (
        <p className="muted">Nenhum duelo ainda. O histórico fica salvo no banco local do navegador.</p>
      ) : (
        <div className="log duel-log-list">
          {historico.map((h, i) => (
            <div key={i} className="duel-log-item">
              <span className="duel-log-icon">⚔️</span>
              <span>{h.a} vs {h.b}</span>
              <span className="duel-log-winner">→ 🏆 {h.vencedor}</span>
              <span className="duel-log-score">({h.placar})</span>
            </div>
          ))}
        </div>
      )}
      {historico.length > 0 && (
        <div className="btn-row">
          <button className="ghost" onClick={() => setHistorico([])}>
            Apagar histórico
          </button>
        </div>
      )}
    </div>
  );
}
