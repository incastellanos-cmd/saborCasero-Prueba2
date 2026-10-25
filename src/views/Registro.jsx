import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VACIO = { usuario: '', clave: '', confirmarClave: '', nombre: '', email: '', telefono: '', direccion: '' };

const Registro = () => {
  const { usuario, agregarUsuario, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');

  if (usuario) return <Navigate to="/" replace />;

  const actualizar = (campo) => (e) => setForm((anterior) => ({ ...anterior, [campo]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    if (form.clave !== form.confirmarClave) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!agregarUsuario({ ...form, rol: 'cliente' })) {
      setError('Ese nombre de usuario ya está registrado o los datos no son válidos.');
      return;
    }
    if (login(form.usuario, form.clave)) {
      navigate('/', { replace: true });
      return;
    }
    navigate('/login', { replace: true, state: { aviso: 'Tu cuenta fue creada. Inicia sesión con el usuario y la contraseña que registraste.' } });
  };

  return (
    <main className="container my-5" style={{ maxWidth: 620 }}>
      <h1 className="mb-4">Crear cuenta</h1>
      <form className="card card-body text-start" onSubmit={enviar}>
        <div className="mb-3">
          <label className="form-label" htmlFor="registro-nombre">Nombre completo</label>
          <input id="registro-nombre" className="form-control" value={form.nombre} onChange={actualizar('nombre')} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="registro-usuario">Nombre de usuario</label>
          <input id="registro-usuario" className="form-control" autoComplete="username" value={form.usuario} onChange={actualizar('usuario')} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="registro-email">Correo electrónico</label>
          <input id="registro-email" className="form-control" type="email" autoComplete="email" value={form.email} onChange={actualizar('email')} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="registro-telefono">Teléfono</label>
          <input id="registro-telefono" className="form-control" type="tel" autoComplete="tel" value={form.telefono} onChange={actualizar('telefono')} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="registro-direccion">Dirección de entrega</label>
          <input id="registro-direccion" className="form-control" autoComplete="street-address" value={form.direccion} onChange={actualizar('direccion')} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="registro-clave">Contraseña</label>
          <input id="registro-clave" className="form-control" type="password" autoComplete="new-password" value={form.clave} onChange={actualizar('clave')} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="registro-confirmar">Confirmar contraseña</label>
          <input id="registro-confirmar" className="form-control" type="password" autoComplete="new-password" value={form.confirmarClave} onChange={actualizar('confirmarClave')} required />
        </div>
        {error && <p className="alert alert-danger py-2">{error}</p>}
        <button className="btn btn-success" type="submit">Crear cuenta</button>
        <p className="mt-3 mb-0">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>.</p>
      </form>
    </main>
  );
};

export default Registro;
