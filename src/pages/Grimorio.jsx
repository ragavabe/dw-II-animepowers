import DeckBuilder from '../components/DeckBuilder';

export default function Grimorio() {
  return (
    <div className="page-head">
      <h1>Grimório</h1>
      <p className="muted">Sua coleção de até 6 técnicas, salva automaticamente neste navegador.</p>
      <DeckBuilder />
    </div>
  );
}
