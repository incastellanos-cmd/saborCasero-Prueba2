import { useLocation, useNavigate, useParams } from "react-router-dom";
import { obtenerProductoPorId } from "../data/datos";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

function DetalleProducto() {
  const { id } = useParams();
  const { agregar } = useCarrito();
  const { usuario, rol, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const producto = obtenerProductoPorId(id);

  const agregarAlCarrito = () => {
    if (rol !== "cliente") {
      // Una sesión de otro rol cerraría el paso a /login, así que se cierra primero
      if (usuario) logout();
      navigate("/login", { state: { desde: location.pathname } });
      return;
    }
    agregar(producto);
  };

  if (!producto) {
    return (
      <div className="container mt-4">
        <h2>Producto no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-6">
          <h1>{producto.nombre}</h1>
          <p>Categoría: {producto.categoria}</p>
          <h3>
            Precio: ${producto.precio.toLocaleString("es-CL")}
          </h3>
          <p>
            Tiempo de preparación: {producto.tiempo_prep} minutos
          </p>
          <p>Stock disponible: {producto.stock}</p>

          <button className="btn btn-success" onClick={agregarAlCarrito}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;