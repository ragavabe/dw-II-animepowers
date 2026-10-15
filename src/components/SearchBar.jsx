export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      placeholder="Buscar poder, personagem ou anime..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Buscar poderes"
    />
  );
}
