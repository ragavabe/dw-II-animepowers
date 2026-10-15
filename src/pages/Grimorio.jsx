import DeckBuilder from '../components/DeckBuilder';

export default function Grimorio() {
  return (
    <div>
      <h1>Grimório / Deck</h1>
      <p className="muted">Crie seu deck personalizado de até 6 técnicas e exporte em JSON.</p>
      <DeckBuilder />
    </div>
  );
}
