import { useLocation } from 'react-router-dom';
import DuelSimulator from '../components/DuelSimulator';

export default function Duelo() {
  const { state } = useLocation();
  const preselectPower = state?.preselectPower ?? null;

  return (
    <div className="page-head">
      <h1>Simulador de Duelo</h1>
      <p className="muted">
        Escolha dois poderes e descubra o vencedor pela fórmula de poder + custo + sorte.
      </p>
      <DuelSimulator initialPowerId={preselectPower} />
    </div>
  );
}
