export default function EmptyState({ busca, categoria, onClear }) {
  return (
    <div role="status" className="empty">
      <p>
        Nenhum poder encontrado
        {busca ? ` para “${busca}”` : ''} {categoria !== 'Todas' ? ` em ${categoria}` : ''}.
      </p>
      <button className="ghost" onClick={onClear}>Limpar filtros</button>
    </div>
  );
}
