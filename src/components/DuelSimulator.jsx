import { useMemo, useState, useCallback } from 'react';
import powersData from '../data/powers.json';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getElementalMultiplier, getElementalRelation, getPlayerAffinityBonus } from '../data/elementalAffinities';
import { elementClass } from '../data/elementMeta';
import { narrarBatalha, analisarDuelo } from '../services/geminiService';

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

export default function DuelSimulator({ initialPowerId = null }) {
  const preselect = powersData.some((p) => p.id === Number(initialPowerId))
    ? Number(initialPowerId)
    : null;

  const [idA, setIdA] = useState(preselect ?? powersData[4].id);
  const [idB, setIdB] = useState(
    preselect === null || preselect !== powersData[0].id ? powersData[0].id : powersData[5].id
  );
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useLocalStorage('pa:duelos', []);
  const [playerAffinity] = useLocalStorage('pa:afinidade', null);
  const [narracao, setNarracao] = useState(null);
  const [analise, setAnalise] = useState(null);
  const [loadingNarracao, setLoadingNarracao] = useState(false);
  const [loadingAnalise, setLoadingAnalise] = useState(false);
  const [erroIA, setErroIA] = useState(null);

  const powerA = useMemo(() => powersData.find((p) => p.id === Number(idA)), [idA]);
  const powerB = useMemo(() => powersData.find((p) => p.id === Number(idB)), [idB]);

  const userAffinity = playerAffinity?.elemento || null;

  async function lutar() {
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

    const novoResultado = {
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
    };

    setResultado(novoResultado);
    setNarracao(null);
    setAnalise(null);
    setErroIA(null);
    setHistorico((h) => [entry, ...h].slice(0, 20));

    // Narrar batalha com Gemini automaticamente
    setLoadingNarracao(true);
    try {
      const texto = await narrarBatalha(powerA, powerB, novoResultado);
      setNarracao(texto);
    } catch (err) {
      console.error('[Gemini narrarBatalha]', err);
      setErroIA(`Erro da IA: ${err?.message || err}`);
    } finally {
      setLoadingNarracao(false);
    }
  }

  const handleAnalisarDuelo = useCallback(async () => {
    if (!powerA || !powerB) return;
    setLoadingAnalise(true);
    setAnalise(null);
    setErroIA(null);
    try {
      const texto = await analisarDuelo(powerA, powerB);
      setAnalise(texto);
    } catch (err) {
      console.error('[Gemini analisarDuelo]', err);
      setErroIA(`Erro da IA: ${err?.message || err}`);
    } finally {
      setLoadingAnalise(false);
    }
  }, [powerA, powerB]);

  function getRelationLabel(relation) {
    switch (relation) {
      case 'vantagem': return '✅ Vantagem (+20%)';
      case 'desvantagem': return '❌ Desvantagem (-20%)';
      default: return '➖ Neutro';
    }
  }

  function getRelationColor(relation) {
    switch (relation) {
      case 'vantagem': return 'var(--ok)';
      case 'desvantagem': return 'var(--danger)';
      default: return 'var(--muted)';
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
              <span className={`element-badge ${elementClass(powerA.elemento)}`}>{powerA.elemento}</span>
            </div>
          )}
          <label className="duel-picker">
            <strong>Escolha a Habilidade</strong>
            <select value={idA} onChange={(e) => setIdA(e.target.value)}>
              {powersData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.personagem} ({p.anime}) [{p.elemento}]
                </option>
              ))}
            </select>
          </label>
          {powerA && (
            <div className="duel-stats-summary">
              <span className="stat">💥 Dano {powerA.dano}</span>
              <span className="stat">⚡ Custo {powerA.custo}</span>
              <span className={`stat ${elementClass(powerA.elemento)}`}>{powerA.elemento}</span>
              <p className="char">{powerA.personagem} ({powerA.anime})</p>
            </div>
          )}
        </div>

        <div className="card duel-fighter-card">
          {powerB && (
            <div className="duel-fighter-banner">
              <img src={powerB.imagem} alt={powerB.nome} className="duel-fighter-img" />
              <div className="duel-fighter-overlay" />
              <span className="duel-fighter-tag">Lutador 2</span>
              <span className={`element-badge ${elementClass(powerB.elemento)}`}>{powerB.elemento}</span>
            </div>
          )}
          <label className="duel-picker">
            <strong>Escolha a Habilidade</strong>
            <select value={idB} onChange={(e) => setIdB(e.target.value)}>
              {powersData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {p.personagem} ({p.anime}) [{p.elemento}]
                </option>
              ))}
            </select>
          </label>
          {powerB && (
            <div className="duel-stats-summary">
              <span className="stat">💥 Dano {powerB.dano}</span>
              <span className="stat">⚡ Custo {powerB.custo}</span>
              <span className={`stat ${elementClass(powerB.elemento)}`}>{powerB.elemento}</span>
              <p className="char">{powerB.personagem} ({powerB.anime})</p>
            </div>
          )}
        </div>
      </div>

      <div className="btn-row">
        <button className="btn-primary" onClick={lutar}>⚔️ Iniciar Duelo de Anime</button>
        <button className="ghost" onClick={handleAnalisarDuelo} disabled={loadingAnalise}>
          {loadingAnalise ? '🤖 Analisando...' : '🤖 Análise da IA (pré-duelo)'}
        </button>
        <button className="ghost" onClick={() => { setResultado(null); setNarracao(null); setAnalise(null); setErroIA(null); }}>
          Limpar
        </button>
      </div>

      {analise && (
        <div className="card ai-panel">
          <strong className="ai-panel-title">🤖 Análise Estratégica da IA (Gemini)</strong>
          <p className="ai-panel-text">{analise}</p>
        </div>
      )}

      {erroIA && (
        <p role="alert" className="alert-text">⚠️ {erroIA}</p>
      )}

      {resultado?.erro && <p role="alert" className="alert-text">{resultado.erro}</p>}

      {resultado && !resultado.erro && (
        <div className="card duel-result-card duel-result">
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
              <h2 className="duel-winner-name">{resultado.vencedor.nome}</h2>
              <p className="muted">
                {resultado.vencedor.personagem} • {resultado.vencedor.anime} ({resultado.vencedor.categoria})
              </p>
            </div>
          </div>

          <div className="duel-bars">
            <div className="duel-bar">
              <div className="duel-bar-head">
                <span>{powerA.nome} <span style={{ color: getRelationColor(resultado.elementalRelationA) }}>{getRelationLabel(resultado.elementalRelationA)}</span></span>
                <span>{resultado.hpA}%</span>
              </div>
              <div className="hp"><div style={{ width: `${resultado.hpA}%` }} /></div>
            </div>

            <div className="duel-bar">
              <div className="duel-bar-head">
                <span>{powerB.nome} <span style={{ color: getRelationColor(resultado.elementalRelationB) }}>{getRelationLabel(resultado.elementalRelationB)}</span></span>
                <span>{resultado.hpB}%</span>
              </div>
              <div className="hp"><div style={{ width: `${resultado.hpB}%` }} /></div>
            </div>
          </div>

          {(resultado.affinityEffectsA.length > 0 || resultado.affinityEffectsB.length > 0) && (
            <div className="affinity-effects affinity-panel">
              <strong className="affinity-panel-title">🔮 Efeitos de Afinidade do Jogador</strong>
              <ul>
                {resultado.affinityEffectsA.map((e, i) => (
                  <li key={`a-${i}`}><strong>{powerA.nome}:</strong> {e}</li>
                ))}
                {resultado.affinityEffectsB.map((e, i) => (
                  <li key={`b-${i}`}><strong>{powerB.nome}:</strong> {e}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="duel-formula">
            Fórmula: (Dano × 0.7 + (100 − Custo) × 0.3 + Aleatório 0–10) × Multiplicador Elemental × Bônus de Afinidade
          </p>

          {/* Narração épica da IA */}
          {loadingNarracao && (
            <div className="narrative-panel">
              <span className="narrative-panel-title">🤖 O Gemini está narrando a batalha…</span>
            </div>
          )}

          {narracao && !loadingNarracao && (
            <div className="narrative-panel">
              <strong className="narrative-panel-title">✨ Narração Épica — Gemini AI</strong>
              <p className="narrative-panel-text">{narracao}</p>
            </div>
          )}
        </div>
      )}

      {userAffinity && (
        <div className="card affinity-card">
          <strong className="affinity-panel-title">🔮 Sua Afinidade Elemental: {userAffinity}</strong>
          <p className="muted">
            Poderes do elemento {userAffinity} recebem bônus especiais em duelos!
          </p>
        </div>
      )}

      <h3 className="section-title">Histórico de Duelos ({historico.length})</h3>
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
                <span className="duel-log-affinity" style={{ color: getRelationColor(h.vantagemA) }}>
                  {h.vantagemA === 'vantagem' ? '✅' : '❌'} {h.a}
                </span>
              )}
              {h.vantagemB !== 'neutro' && (
                <span className="duel-log-affinity" style={{ color: getRelationColor(h.vantagemB) }}>
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
