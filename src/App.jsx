// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home'; // 👈 Importamos la vista Home real
// En la parte superior de src/App.jsx, agrega esta importación:
import Categorias from './views/Categorias';npm 
// Vistas temporales para el resto de rutas
const Categorias = () => <div className="container mt-4"><h1>Categorías</h1></div>;
const Carrito = () => <div className="container mt-4"><h1>Carrito de Compras</h1></div>;
const Admin = () => <div className="container mt-4"><h1>Panel de Administración</h1></div>;

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;