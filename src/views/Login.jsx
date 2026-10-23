import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { USUARIOS_DEMO, useAuth } from '../context/AuthContext';
import { ROLES } from '../data/roles';

const Login = () => {
  const { usuario: sesion, login } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.desde || (sesion?.rol === 'cliente' ? '/' : sesion?.rol === 'admin' ? '/admin' : '/pedidos');

  if (sesion) return <Navigate to={destino} replace />;

  const enviar = (e) => {
    e.preventDefault();
    if (login(usuario, clave)) navigate(destino, { replace: true });
    else setError('Usuario o contraseña incorrectos');
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h1 className="mb-3">Iniciar sesión</h1>
      <form onSubmit={enviar}>
        <div className="mb-3">
          <label htmlFor="usuario" className="form-label">Usuario</label>
          <input id="usuario" className="form-control" value={usuario} onChange={(e) => setUsuario(e.target.value)} autoFocus required />
        </div>
        <div className="mb-3">
          <label htmlFor="clave" className="form-label">Contraseña</label>
          <input id="clave" type="password" className="form-control" value={clave} onChange={(e) => setClave(e.target.value)} required />
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button className="btn btn-success w-100" type="submit">Entrar</button>
      </form>
      <div className="card mt-4">
        <div className="card-header small">Cuentas de demostración</div>
        <ul className="list-group list-group-flush small">
          {USUARIOS_DEMO.map((u) => (
            <li key={u.usuario} className="list-group-item list-group-item-action" role="button" onClick={() => { setUsuario(u.usuario); setClave(u.clave); setError(''); }}>
              <strong>{ROLES[u.rol]}</strong> — {u.usuario} / {u.clave}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Login;
