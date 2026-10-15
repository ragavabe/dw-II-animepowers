import DuelSimulator from '../components/DuelSimulator';

export default function Duelo() {
  return (
    <div>
      <h1>Simulador de Duelo</h1>
      <p className="muted">Escolha dois poderes e descubra o vencedor pela fórmula de poder + custo + sorte.</p>
      <DuelSimulator />
    </div>
  );
}
