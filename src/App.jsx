import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
import Catalogo from './components/Catalogo';
import Categorias from './components/Categorias';
import DetalleProducto from './components/DetalleProducto';

import Carrito from './views/Carrito';
import Pedidos from './views/Pedidos';
import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider } from './context/AuthContext';
import Admin from './views/Admin';
import Login from './views/Login';
import Nosotros from './views/Nosotros';
import { Blog, BlogArticulo } from './views/Blog';
import RutaProtegida from './components/RutaProtegida';


function App() {
  return (
    <AuthProvider>
    <CarritoProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogArticulo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/carrito" element={<RutaProtegida roles={['cliente']}><Carrito /></RutaProtegida>} />
        <Route path="/pedidos" element={<RutaProtegida><Pedidos /></RutaProtegida>} />
        <Route path="/admin" element={<RutaProtegida roles={['admin']}><Admin /></RutaProtegida>} />
      </Routes>
      <Footer />
    </Router>
    </CarritoProvider>
    </AuthProvider>
  );
}

export default App;