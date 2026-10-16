import PowerCatalog from '../components/PowerCatalog';

export default function Catalogo() {
  return (
    <div className="page-head">
      <h1>Catálogo de Poderes</h1>
      <p className="muted">
        Busque por nome, personagem ou anime e filtre por categoria, elemento, dano e custo.
        Abra um card para ver a técnica completa.
      </p>
      <PowerCatalog />
    </div>
  );
}
