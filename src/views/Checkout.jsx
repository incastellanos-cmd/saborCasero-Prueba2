import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { validarDatosCheckout } from '../data/tienda';

const COSTO_DELIVERY = 1500;

const Checkout = () => {
  const { usuario } = useAuth();
  const { items, total, crearPedido } = useCarrito();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: usuario?.nombre ?? '',
    email: usuario?.email ?? '',
    telefono: usuario?.telefono ?? '',
    direccion: usuario?.direccion ?? '',
    metodoEntrega: 'delivery',
    resultadoPago: 'aprobado',
  });
  const [errores, setErrores] = useState({});
  const [errorPago, setErrorPago] = useState('');

  const costoEntrega = form.metodoEntrega === 'delivery' ? COSTO_DELIVERY : 0;
  const actualizar = (campo) => (e) => {
    setForm((anterior) => ({ ...anterior, [campo]: e.target.value }));
    setErrores((anteriores) => ({ ...anteriores, [campo]: '' }));
    setErrorPago('');
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevosErrores = validarDatosCheckout(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    if (form.resultadoPago === 'rechazado') {
      navigate('/compra/error', {
        state: { mensaje: 'El pago de demostración fue rechazado. No se generó ningún pedido.' },
      });
      return;
    }

    const pedido = crearPedido({
      nombreContacto: form.nombre.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      direccion: form.metodoEntrega === 'delivery' ? form.direccion.trim() : '',
      metodoEntrega: form.metodoEntrega,
      costoEntrega,
    });
    if (!pedido) {
      setErrorPago('No fue posible crear el pedido. Revisa tu carrito e inténtalo nuevamente.');
      return;
    }
    navigate('/compra/exitosa', { state: { pedido } });
  };

  if (items.length === 0) {
    return (
      <main className="container mt-4">
        <h1>Finalizar compra</h1>
        <p className="alert alert-info">Tu carrito está vacío.</p>
        <Link className="btn btn-success" to="/categorias">Ver productos</Link>
      </main>
    );
  }

  return (
    <main className="container my-4" style={{ maxWidth: 900 }}>
      <h1 className="mb-4">Finalizar compra</h1>
      <div className="row g-4">
        <section className="col-12 col-lg-7">
          <form onSubmit={enviar} noValidate>
            <fieldset className="card card-body mb-4">
              <legend className="h5">Datos de contacto</legend>
              <div className="mb-3">
                <label className="form-label" htmlFor="checkout-nombre">Nombre completo</label>
                <input id="checkout-nombre" className={`form-control${errores.nombre ? ' is-invalid' : ''}`} value={form.nombre} onChange={actualizar('nombre')} required />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="checkout-email">Correo electrónico</label>
                <input id="checkout-email" className={`form-control${errores.email ? ' is-invalid' : ''}`} type="email" value={form.email} onChange={actualizar('email')} required />
                {errores.email && <div className="invalid-feedback">{errores.email}</div>}
              </div>
              <div>
                <label className="form-label" htmlFor="checkout-telefono">Teléfono</label>
                <input id="checkout-telefono" className={`form-control${errores.telefono ? ' is-invalid' : ''}`} type="tel" value={form.telefono} onChange={actualizar('telefono')} required />
                {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
              </div>
            </fieldset>

            <fieldset className="card card-body mb-4">
              <legend className="h5">Entrega</legend>
              <div className="form-check mb-2">
                <input id="entrega-delivery" className="form-check-input" type="radio" name="metodoEntrega" value="delivery" checked={form.metodoEntrega === 'delivery'} onChange={actualizar('metodoEntrega')} />
                <label className="form-check-label" htmlFor="entrega-delivery">Delivery — ${COSTO_DELIVERY.toLocaleString('es-CL')}</label>
              </div>
              <div className="form-check mb-3">
                <input id="entrega-retiro" className="form-check-input" type="radio" name="metodoEntrega" value="retiro" checked={form.metodoEntrega === 'retiro'} onChange={actualizar('metodoEntrega')} />
                <label className="form-check-label" htmlFor="entrega-retiro">Retiro en el local — gratis</label>
              </div>
              {form.metodoEntrega === 'delivery' && (
                <div>
                  <label className="form-label" htmlFor="checkout-direccion">Dirección de entrega</label>
                  <input id="checkout-direccion" className={`form-control${errores.direccion ? ' is-invalid' : ''}`} value={form.direccion} onChange={actualizar('direccion')} required />
                  {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
                </div>
              )}
              {errores.metodoEntrega && <div className="text-danger small mt-2">{errores.metodoEntrega}</div>}
            </fieldset>

            <fieldset className="card card-body mb-3">
              <legend className="h5">Pago de demostración</legend>
              <label className="form-label" htmlFor="checkout-pago">Resultado simulado</label>
              <select id="checkout-pago" className="form-select" value={form.resultadoPago} onChange={actualizar('resultadoPago')}>
                <option value="aprobado">Pago aprobado</option>
                <option value="rechazado">Pago rechazado</option>
              </select>
              <small className="form-text">No se procesan pagos reales.</small>
            </fieldset>

            {errorPago && <p className="alert alert-danger">{errorPago}</p>}
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-success" type="submit">Confirmar compra</button>
              <Link className="btn btn-outline-secondary" to="/carrito">Volver al carrito</Link>
            </div>
          </form>
        </section>

        <aside className="col-12 col-lg-5">
          <div className="card card-body">
            <h2 className="h5">Resumen de compra</h2>
            <ul className="list-group list-group-flush mb-3">
              {items.map((item) => (
                <li className="list-group-item d-flex justify-content-between gap-3 px-0" key={item.id}>
                  <span>{item.cantidad} × {item.nombre}</span>
                  <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                </li>
              ))}
            </ul>
            <p className="d-flex justify-content-between mb-2"><span>Productos</span><span>${total.toLocaleString('es-CL')}</span></p>
            <p className="d-flex justify-content-between mb-2"><span>Entrega</span><span>${costoEntrega.toLocaleString('es-CL')}</span></p>
            <p className="d-flex justify-content-between fw-bold mb-0"><span>Total</span><span>${(total + costoEntrega).toLocaleString('es-CL')}</span></p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
