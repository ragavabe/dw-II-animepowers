import { Link } from 'react-router-dom';
import powersData from '../data/powers.json';

export default function Home() {
  const totalPowers = powersData.length;

  return (
    <div className="hero">
      <div className="badges">
        <span className="badge">React + Vite</span>
        <span className="badge">100% front-end estático</span>
        <span className="badge">LocalStorage</span>
        <span className="badge">GitHub Pages ready</span>
      </div>
      <h1>Anime Powers — Catálogo e Simulador</h1>
      <p>
        Explore {totalPowers} poderes de anime com atributos padronizados (dano, alcance, elemento, custo),
        favorite os melhores, monte seu grimório de 6 técnicas, simule duelos e descubra sua
        afinidade elemental. Tudo roda no navegador, sem backend.
      </p>
      <div className="btn-row">
        <Link className="btn" to="/catalogo">Ver catálogo</Link>
        <Link className="btn ghost" to="/duelo">Simular duelo</Link>
        <Link className="btn ghost" to="/grimorio">Montar grimório</Link>
        <Link className="btn ghost" to="/afinidade">Teste de afinidade</Link>
      </div>
    </div>
  );
}
