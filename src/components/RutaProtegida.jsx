import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RutaProtegida = ({ roles, children }) => {
  const { rol } = useAuth();
  const location = useLocation();

  if (!rol) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (roles && !roles.includes(rol)) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">No tienes permiso para ver esta página.</div>
      </div>
    );
  }
  return children;
};

export default RutaProtegida;
