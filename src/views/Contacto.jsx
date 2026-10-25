import { useState } from 'react';
import { guardarMensaje } from '../data/mensajes';

const Contacto = () => {
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });

  const actualizar = (campo) => (e) => {
    setForm((anterior) => ({ ...anterior, [campo]: e.target.value }));
    setEnviado(false);
  };

  const enviar = (e) => {
    e.preventDefault();
    try {
      guardarMensaje(form);
      setEnviado(true);
      setError('');
      setForm({ nombre: '', email: '', mensaje: '' });
    } catch {
      setEnviado(false);
      setError('No se pudo guardar el mensaje en este navegador. Inténtalo nuevamente.');
    }
  };

  return (
    <main className="container my-5" style={{ maxWidth: 700 }}>
      <h1>Contacto</h1>
      <p>Escríbenos si tienes dudas sobre nuestros productos o pedidos.</p>
      <form className="card card-body text-start" onSubmit={enviar}>
        <div className="mb-3">
          <label className="form-label" htmlFor="contacto-nombre">Nombre</label>
          <input id="contacto-nombre" className="form-control" value={form.nombre} onChange={actualizar('nombre')} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="contacto-email">Correo electrónico</label>
          <input id="contacto-email" className="form-control" type="email" value={form.email} onChange={actualizar('email')} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="contacto-mensaje">Mensaje</label>
          <textarea id="contacto-mensaje" className="form-control" rows="5" value={form.mensaje} onChange={actualizar('mensaje')} required />
        </div>
        {error && <p className="alert alert-danger py-2" role="alert">{error}</p>}
        {enviado && <p className="alert alert-success py-2" role="status">Mensaje recibido en esta demostración.</p>}
        <button className="btn btn-success" type="submit">Enviar mensaje</button>
      </form>
      <p className="form-text mt-2">El mensaje se guarda en este navegador para que lo revise el administrador.</p>
    </main>
  );
};

export default Contacto;
