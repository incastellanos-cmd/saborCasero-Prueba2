import { Link } from 'react-router-dom';
import { obtenerProductos } from '../data/datos';
import { obtenerPrecioFinal } from '../data/tienda';

const Ofertas = () => {
  const productos = obtenerProductos().filter(
    (producto) => producto.precioOferta > 0 && producto.precioOferta < producto.precio
  );

  return (
    <main className="container py-4">
      <h1>Ofertas</h1>
      <p className="text-muted">Aprovecha los precios especiales de nuestros productos.</p>
      {productos.length === 0 ? (
        <p className="alert alert-info">Por ahora no hay productos en oferta.</p>
      ) : (
        <div className="row g-4">
          {productos.map((producto) => (
            <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
              <article className="card h-100">
                <img className="card-img-top" src={producto.imagen} alt={producto.nombre} />
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-danger align-self-start mb-2">Oferta</span>
                  <h2 className="h5 card-title">{producto.nombre}</h2>
                  <p className="mb-3">
                    <del className="text-muted me-2">${producto.precio.toLocaleString('es-CL')}</del>
                    <strong>${obtenerPrecioFinal(producto).toLocaleString('es-CL')}</strong>
                  </p>
                  <Link className="btn btn-success mt-auto" to={`/producto/${producto.id}`}>
                    Ver producto
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Ofertas;
