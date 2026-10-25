
import { useState } from "react";
import { obtenerProductos } from "../data/datos";
import { Link } from "react-router-dom";
import { filtrarProductos, obtenerPrecioFinal } from "../data/tienda";

function Categorias() {

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  const productos = obtenerProductos();

  const categorias = ["Todas", ...new Set(productos.map(producto => producto.categoria))];

  const productosFiltrados = filtrarProductos(productos, busqueda, categoriaSeleccionada);

    
  return (
    <div className="container mt-4">
      <h1>Categorías</h1>
      <p>Selecciona una categoría para ver nuestros productos.</p>

      <div className="mb-4 mx-auto" style={{ maxWidth: 520 }}>
        <label htmlFor="buscar-productos" className="form-label">Buscar productos</label>
        <input
          id="buscar-productos"
          className="form-control"
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Busca por nombre o categoría"
        />
      </div>

      <div className="mb-4">
        {categorias.map(categoria => (
          <button
            key={categoria}
            className={`btn me-2 mb-2 ${
              categoriaSeleccionada === categoria ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="row">
        {productosFiltrados.map(producto => (
          <div className="col-md-4 mb-4" key={producto.id}>
            <div className="card h-100">
              <Link to={`/producto/${producto.id}`}>
              <img
                src={producto.imagen}
                className="card-img-top"
                alt={producto.nombre}
              />
              </Link>

              <div className="card-body">
                <h5>
                  <Link
                  to={`/producto/${producto.id}`}
                  className="text-decoration-none text-dark"
                  >
                    {producto.nombre}
                  </Link>
                </h5>
                <p>
                  Precio:{' '}
                  {producto.precioOferta < producto.precio && (
                    <del className="text-muted me-1">${producto.precio.toLocaleString("es-CL")}</del>
                  )}
                  ${obtenerPrecioFinal(producto).toLocaleString("es-CL")}
                </p>
                <p>Tiempo de preparación: {producto.tiempo_prep} minutos</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {productosFiltrados.length === 0 && <p className="text-muted">No encontramos productos con esa búsqueda.</p>}
    </div>
  );
}

export default Categorias;
