// src/views/Categorias.jsx
import { useState } from 'react';
import { obtenerProductos } from '../data/datos';
import ProductCard from '../components/ProductCard';

const Categorias = () => {
  const todosLosProductos = obtenerProductos();
  
  // Extraer categorías únicas usando Set
  const categoriasUnicas = ["Todas", ...new Set(todosLosProductos.map(p => p.categoria))];
  
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Filtrar productos según la categoría seleccionada
  const productosFiltrados = categoriaSeleccionada === "Todas" 
    ? todosLosProductos 
    : todosLosProductos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Explora nuestras Categorías</h2>
      
      {/* Botones de filtro de categorías */}
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        {categoriasUnicas.map(categoria => (
          <button 
            key={categoria}
            className={`btn ${categoriaSeleccionada === categoria ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      {/* Grilla de productos filtrados */}
      <div className="row">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(producto => (
            <ProductCard key={producto.id} producto={producto} />
          ))
        ) : (
          <p className="text-center mt-4">No hay productos en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default Categorias;