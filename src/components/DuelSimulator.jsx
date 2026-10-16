import { useMemo, useState } from 'react';
import powersData from '../data/powers.json';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getElementalMultiplier, getElementalRelation, getPlayerAffinityBonus } from '../data/elementalAffinities';

function baseScore(p) {
  return p.dano * 0.7 + (100 - p.custo) * 0.3 + Math.random() * 10;
}

function calculateFinalScore(power, opponentElement, playerAffinity) {
  let score = baseScore(power);

  // Aplicar vantagem/desvantagem elemental
  const elementalMultiplier = getElementalMultiplier(power.elemento, opponentElement);
  score *= elementalMultiplier;

  // Aplicar bônus de afinidade do jogador
  const affinityBonus = getPlayerAffinityBonus(playerAffinity, power.elemento);
  score *= affinityBonus.multiplicador;
  score += affinityBonus.extra;

  return { score, elementalMultiplier, affinityBonus };
}

export default function DuelSimulator() {
  const [idA, setIdA] = useState(powersData[4].id);
  const [idB, setIdB] = useState(powersData[0].id);
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useLocalStorage('pa:duelos', []);
  const [playerAffinity] = useLocalStorage('pa:afinidade', null);

  const powerA = useMemo(() => powersData.find((p) => p.id === Number(idA)), [idA]);
  const powerB = useMemo(() => powersData.find((p) => p.id === Number(idB)), [idB]);

  const userAffinity = playerAffinity?.elemento || null;

  function lutar() {
    if (!powerA || !powerB) return;
    if (powerA.id === powerB.id) {
      setResultado({ erro: 'Escolha dois poderes diferentes para duelar.' });
      return;
    }

    // Calcular scores com afinidades elementais
    const resultA = calculateFinalScore(powerA, powerB.elemento, userAffinity);
    const resultB = calculateFinalScore(powerB, powerA.elemento, userAffinity);

    const vencedor = resultA.score >= resultB.score ? powerA : powerB;
    const total = resultA.score + resultB.score;
    const hpA = Math.round((resultA.score / total) * 100);
    const hpB = 100 - hpA;

    const elementalRelationA = getElementalRelation(powerA.elemento, powerB.elemento);
    const elementalRelationB = getElementalRelation(powerB.elemento, powerA.elemento);

    const entry = {
      data: new Date().toISOString(),
      a: powerA.nome,
      b: powerB.nome,
      vencedor: vencedor.nome,
      vencedorImg: vencedor.imagem,
      placar: `${resultA.score.toFixed(1)} x ${resultB.score.toFixed(1)}`,
      elementoA: powerA.elemento,
      elementoB: powerB.elemento,
      vantagemA: elementalRelationA,
      vantagemB: elementalRelationB,
      afinidadeJogador: userAffinity
    };

    setResultado({
      sA: resultA.score,
      sB: resultB.score,
      vencedor,
      hpA,
      hpB,
      elementalRelationA,
      elementalRelationB,
      affinityEffectsA: resultA.affinityBonus.efeitos,
      affinityEffectsB: resultB.affinityBonus.efeitos,
      log: [
        `${powerA.nome} (${powerA.elemento}) ${resultA.score.toFixed(1)} vs ${powerB.nome} (${powerB.elemento}) ${resultB.score.toFixed(1)}`,
        `Vencedor: ${vencedor.nome}`,
        ...(elementalRelationA !== 'neutro' ? [`⚡ ${powerA.nome} tem ${elementalRelationA === 'vantagem' ? 'vantagem' : 'desvantagem'} elemental!`] : []),
        ...(elementalRelationB !== 'neutro' ? [`⚡ ${powerB.nome} tem ${elementalRelationB === 'vantagem' ? 'vantagem' : 'desvantagem'} elemental!`] : []),
        ...(userAffinity ? [`🔮 Sua afinidade (${userAffinity}) ativada!`] : [])
      ]
    });
    setHistorico((h) => [entry, ...h].slice(0, 20));
  }

  function getRelationLabel(relation) {
    switch (relation) {
      case 'vantagem': return '✅ Vantagem (+20%)';
      case 'desvantagem': return '❌ Desvantagem (-20%)';
      default: return '➖ Neutro';
    }
  }

  function getRelationColor(relation) {
    switch (relation) {
      case 'vantagem': return '#3ddc84';
      case 'desvantagem': return '#ff5470';
      default: return '#aab1d6';
    }
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
              <span className={`element-badge element-${powerA.elemento?.toLowerCase()}`}>{powerA.elemento}</span>
            </div>
          )}
          <label style={{ display: 'block', marginTop: '0.4rem', padding: '0 1rem' }}>
            <strong>Escolha a Habilidade</strong>
            <select
              value={idA}
              onChange={(e) => setIdA(e.target.value)}
              style={{ width: '100%', marginTop: 6 }}
            >
              {powersData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.personagem} ({p.anime}) [{p.elemento}]
                </option>
              ))}
            </select>
          </label>
          {powerA && (
            <div className="duel-stats-summary" style={{ padding: '0 1rem 1rem' }}>
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
              <span className={`element-badge element-${powerB.elemento?.toLowerCase()}`}>{powerB.elemento}</span>
            </div>
          )}
          <label style={{ display: 'block', marginTop: '0.4rem', padding: '0 1rem' }}>
            <strong>Escolha a Habilidade</strong>
            <select
              value={idB}
              onChange={(e) => setIdB(e.target.value)}
              style={{ width: '100%', marginTop: 6 }}
            >
              {powersData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.personagem} ({p.anime}) [{p.elemento}]
                </option>
              ))}
            </select>
          </label>
          {powerB && (
            <div className="duel-stats-summary" style={{ padding: '0 1rem 1rem' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                <span>{powerA.nome} <span style={{ color: getRelationColor(resultado.elementalRelationA) }}>{getRelationLabel(resultado.elementalRelationA)}</span></span>
                <span>{resultado.hpA}%</span>
              </div>
              <div className="hp"><div style={{ width: `${resultado.hpA}%` }} /></div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 4 }}>
                <span>{powerB.nome} <span style={{ color: getRelationColor(resultado.elementalRelationB) }}>{getRelationLabel(resultado.elementalRelationB)}</span></span>
                <span>{resultado.hpB}%</span>
              </div>
              <div className="hp"><div style={{ width: `${resultado.hpB}%` }} /></div>
            </div>
          </div>

          {(resultado.affinityEffectsA.length > 0 || resultado.affinityEffectsB.length > 0) && (
            <div className="affinity-effects" style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(124, 92, 255, 0.1)', borderRadius: '8px', border: '1px solid var(--accent2)' }}>
              <strong style={{ color: 'var(--accent2)' }}>🔮 Efeitos de Afinidade do Jogador:</strong>
              <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                {resultado.affinityEffectsA.map((e, i) => (
                  <li key={`a-${i}`}><strong>{powerA.nome}:</strong> {e}</li>
                ))}
                {resultado.affinityEffectsB.map((e, i) => (
                  <li key={`b-${i}`}><strong>{powerB.nome}:</strong> {e}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="muted" style={{ fontSize: '0.8rem', marginTop: 8 }}>
            Fórmula: (Dano × 0.7 + (100 − Custo) × 0.3 + Aleatório 0–10) × Multiplicador Elemental × Bônus de Afinidade
          </p>
        </div>
      )}

      {userAffinity && (
        <div className="card" style={{ marginTop: '1.5rem', borderColor: 'var(--accent2)' }}>
          <strong style={{ color: 'var(--accent2)' }}>🔮 Sua Afinidade Elemental: {userAffinity}</strong>
          <p className="muted" style={{ marginTop: 4 }}>
            Poderes do elemento {userAffinity} recebem bônus especiais em duelos!
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
              <span>{h.a} ({h.elementoA}) vs {h.b} ({h.elementoB})</span>
              <span className="duel-log-winner">→ 🏆 {h.vencedor}</span>
              <span className="duel-log-score">({h.placar})</span>
              {h.vantagemA !== 'neutro' && (
                <span className="duel-log-affinity" style={{ color: h.vantagemA === 'vantagem' ? '#3ddc84' : '#ff5470', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                  {h.vantagemA === 'vantagem' ? '✅' : '❌'} {h.a}
                </span>
              )}
              {h.vantagemB !== 'neutro' && (
                <span className="duel-log-affinity" style={{ color: h.vantagemB === 'vantagem' ? '#3ddc84' : '#ff5470', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                  {h.vantagemB === 'vantagem' ? '✅' : '❌'} {h.b}
                </span>
              )}
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
