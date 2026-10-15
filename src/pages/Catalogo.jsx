import PowerCatalog from '../components/PowerCatalog';

export default function Catalogo() {
  return (
    <div>
      <h1>Catálogo de Poderes</h1>
      <p className="muted">Busque em tempo real, filtre por categoria e favorite. Clique em “Ver detalhes” para atributos completos.</p>
      <PowerCatalog />
    </div>
  );
}
