import { Link, useLocation } from 'react-router-dom';

const ResultadoCompra = ({ tipo }) => {
  const { state } = useLocation();
  const pedido = state?.pedido;
  const exitosa = tipo === 'exitosa';

  if (exitosa && !pedido) {
    return (
      <main className="container py-5">
        <h1>No se encontró el resumen de la compra</h1>
        <Link className="btn btn-success" to="/pedidos">Revisar mis pedidos</Link>
      </main>
    );
  }

  return (
    <main className="container py-5" style={{ maxWidth: 720 }}>
      <div className={`alert ${exitosa ? 'alert-success' : 'alert-danger'}`} role="status">
        <h1 className="h3">{exitosa ? '¡Compra realizada!' : 'No se pudo realizar el pago'}</h1>
        <p className="mb-0">
          {exitosa
            ? `Tu pedido ${pedido.id} fue registrado correctamente.`
            : state?.mensaje ?? 'El pago no se completó y no se generó ningún pedido.'}
        </p>
      </div>
      {exitosa && (
        <section className="card card-body mb-4">
          <h2 className="h5">Resumen del pedido</h2>
          <ul>
            {pedido.items.map((item) => (
              <li key={item.id}>{item.cantidad} × {item.nombre} — ${(item.precio * item.cantidad).toLocaleString('es-CL')}</li>
            ))}
          </ul>
          <p>Entrega: {pedido.metodoEntrega === 'retiro' ? 'Retiro en el local' : pedido.direccion}</p>
          <p className="fw-bold mb-0">Total: ${pedido.total.toLocaleString('es-CL')}</p>
        </section>
      )}
      <div className="d-flex flex-wrap gap-2">
        {exitosa
          ? <Link className="btn btn-success" to="/pedidos">Ver mis pedidos</Link>
          : <Link className="btn btn-success" to="/checkout">Intentar nuevamente</Link>}
        <Link className="btn btn-outline-secondary" to="/">Volver al inicio</Link>
      </div>
    </main>
  );
};

export default ResultadoCompra;
