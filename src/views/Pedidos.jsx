import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { COLORES, ESTADOS, ETIQUETAS, TRANSICIONES, puedeAvanzar } from '../data/roles';

const Pedidos = () => {
  const { pedidos, avanzarPedido, eliminarPedido } = useCarrito();
  const { rol, roles, usuario } = useAuth();
  const [soloMios, setSoloMios] = useState(true);

  const esCliente = rol === 'cliente';
  const visibles = esCliente
    ? pedidos.filter((p) => p.cliente === usuario.usuario)
    : soloMios
      ? pedidos.filter((p) => puedeAvanzar(rol, p.estado))
      : pedidos;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>{esCliente ? 'Mis pedidos' : `Pedidos — ${roles[rol] ?? rol}`}</h1>
        {!esCliente && (
          <div className="form-check form-switch">
            <input id="soloMios" className="form-check-input" type="checkbox" checked={soloMios} onChange={(e) => setSoloMios(e.target.checked)} />
            <label htmlFor="soloMios" className="form-check-label">Solo los que debo atender</label>
          </div>
        )}
      </div>
      {visibles.length === 0 && (
        <p className="text-muted">
          {esCliente ? <>Aún no tienes pedidos. <Link to="/categorias">Ver productos</Link></> : 'No hay pedidos pendientes para tu rol.'}
        </p>
      )}
      {visibles.map((p) => (
        <div key={p.id} className="card mb-3 shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>{p.id}</strong>
            <span className={`badge bg-${COLORES[p.estado]}`}>{ETIQUETAS[p.estado]}</span>
          </div>
          <div className="card-body">
            <ul className="mb-2">
              {p.items.map((i) => (
                <li key={i.id}>{i.cantidad} x {i.nombre} — ${(i.precio * i.cantidad).toLocaleString('es-CL')}</li>
              ))}
            </ul>
            <p className="fw-bold">Total: ${p.total.toLocaleString('es-CL')}</p>
            <ol className="small text-muted">
              {ESTADOS.filter((e) => p.historial.some((h) => h.estado === e)).map((e) => {
                const registro = p.historial.find((h) => h.estado === e);
                return (
                  <li key={e} className="text-dark">
                    {ETIQUETAS[e]} — {new Date(registro.fecha).toLocaleString('es-CL')}
                  </li>
                );
              })}
            </ol>
            {puedeAvanzar(rol, p.estado) && (
              <button className="btn btn-success me-2" onClick={() => avanzarPedido(p.id)}>{TRANSICIONES[p.estado].accion}</button>
            )}
            {esCliente && (p.estado === 'pedido' || p.estado === 'entregado') && (
              <button className="btn btn-outline-danger" onClick={() => eliminarPedido(p.id)}>
                {p.estado === 'pedido' ? 'Cancelar' : 'Eliminar'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Pedidos;
