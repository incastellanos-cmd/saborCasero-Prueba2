import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cantidadTotal } = useCarrito();
  const { usuario, rol, roles, logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">SaborCasero</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categorias">Categorías</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {usuario ? (
              <>
                <span className="me-2 small text-muted">{usuario.nombre} · {roles[rol] ?? rol}</span>
                <Link to={rol === 'admin' ? '/admin' : '/pedidos'} className="btn btn-outline-success me-2">Pedidos</Link>
                {rol === 'cliente' && (
                  <Link to="/carrito" className="btn btn-success me-2">🛒 Carrito ({cantidadTotal})</Link>
                )}
                <button className="btn btn-outline-secondary" onClick={salir}>Salir</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-success">Iniciar sesión</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;