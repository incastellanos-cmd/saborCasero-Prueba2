import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';

const Carrito = () => {
  const { rol } = useAuth();
  const { items, total, cambiarCantidad, quitar, vaciar, crearPedido } = useCarrito();
  const navigate = useNavigate();

  const realizarPedido = () => {
    if (crearPedido()) navigate('/pedidos');
  };

  if (items.length === 0) {
    return (
      <div className="container mt-4">
        <h1>Carrito de Compras</h1>
        <p className="text-muted">Tu carrito está vacío.</p>
        <Link to="/categorias" className="btn btn-success me-2">Ver productos</Link>
        <Link to="/pedidos" className="btn btn-outline-dark">Mis pedidos</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Carrito de Compras</h1>
      <div className="carrito-table-container">
        <table className="table align-middle mb-0">
          <thead>
            <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.nombre}</td>
                <td>${i.precio.toLocaleString('es-CL')}</td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-secondary" onClick={() => cambiarCantidad(i.id, i.cantidad - 1)}>−</button>
                    <span className="btn btn-light disabled">{i.cantidad}</span>
                    <button className="btn btn-outline-secondary" disabled={i.cantidad >= i.stock} onClick={() => cambiarCantidad(i.id, i.cantidad + 1)}>+</button>
                  </div>
                </td>
                <td>${(i.precio * i.cantidad).toLocaleString('es-CL')}</td>
                <td><button className="btn btn-sm btn-outline-danger" onClick={() => quitar(i.id)}>Quitar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 className="text-end">Total: ${total.toLocaleString('es-CL')}</h4>
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary" onClick={vaciar}>Vaciar</button>
        <button className="btn btn-success" disabled={rol !== 'cliente'} title={rol !== 'cliente' ? 'Solo el cliente puede realizar pedidos' : ''} onClick={realizarPedido}>Realizar pedido</button>
      </div>
    </div>
  );
};

export default Carrito;
