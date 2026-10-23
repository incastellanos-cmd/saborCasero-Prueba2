// src/components/ProductCard.jsx
import { Link } from 'react-router-dom';

const ProductCard = ({ producto }) => (
  <div className="col-md-4 mb-4">
    <Link to={`/producto/${producto.id}`} className="text-decoration-none">
      <div className="card h-100 shadow-sm">
        <img
          src={producto.imagen}
          className="card-img-top"
          alt={producto.nombre}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="card-body">
          <h5 className="card-title mb-0" style={{ color: 'var(--sc-brown)' }}>{producto.nombre}</h5>
        </div>
      </div>
    </Link>
  </div>
);

export default ProductCard;