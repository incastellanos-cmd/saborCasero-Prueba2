import { createContext, useContext, useEffect, useState } from 'react';

import { ESTADOS, MIGRACION, puedeAvanzar } from '../data/roles';
import { obtenerPrecioFinal } from '../data/tienda';
import { useAuth } from './AuthContext';

const CLAVE_CARRITO = 'sc_carrito';
const CLAVE_PEDIDOS = 'sc_pedidos';

const migrar = (pedidos) =>
  pedidos.map((p) => ({
    ...p,
    estado: MIGRACION[p.estado] ?? p.estado,
    historial: (p.historial || []).map((h) => ({ ...h, estado: MIGRACION[h.estado] ?? h.estado })),
  }));

const leer = (clave) => {
  try {
    const valor = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(valor) ? valor : [];
  } catch {
    return [];
  }
};

const CarritoContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [items, setItems] = useState(() => leer(CLAVE_CARRITO));
  const [pedidos, setPedidos] = useState(() => migrar(leer(CLAVE_PEDIDOS)));
  const { rol, usuario } = useAuth();

  // Sincroniza entre pestañas (ej. cliente en una, chef en otra)
  useEffect(() => {
    const alCambiar = (e) => {
      if (e.key === CLAVE_PEDIDOS) setPedidos(migrar(leer(CLAVE_PEDIDOS)));
    };
    window.addEventListener('storage', alCambiar);
    return () => window.removeEventListener('storage', alCambiar);
  }, []);

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos));
  }, [pedidos]);

  const agregar = (producto) => {
    if (rol && rol !== 'cliente') return;
    setItems((prev) => {
      const existente = prev.find((i) => i.id === producto.id);
      if (existente) {
        if (existente.cantidad >= producto.stock) return prev;
        return prev.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
      }
      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: obtenerPrecioFinal(producto),
          precioOriginal: producto.precio,
          imagen: producto.imagen,
          stock: producto.stock,
          cantidad: 1,
        },
      ];
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i))
        .filter((i) => i.cantidad > 0)
    );
  };

  const quitar = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const vaciar = () => setItems([]);

  const total = items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((suma, i) => suma + i.cantidad, 0);

  // Convierte el carrito en un pedido con estado inicial "pedido"
  const crearPedido = (detalles = {}) => {
    if (rol !== 'cliente' || items.length === 0) return null;
    const ahora = new Date().toISOString();
    const costoEntrega = Number(detalles.costoEntrega) || 0;
    const pedido = {
      id: `PED${Date.now()}`,
      cliente: usuario.usuario,
      items,
      total: total + costoEntrega,
      nombreContacto: detalles.nombreContacto ?? usuario.nombre,
      email: detalles.email ?? usuario.email ?? '',
      telefono: detalles.telefono ?? usuario.telefono ?? '',
      direccion: detalles.direccion ?? '',
      metodoEntrega: detalles.metodoEntrega ?? 'delivery',
      costoEntrega,
      estado: ESTADOS[0],
      historial: [{ estado: ESTADOS[0], fecha: ahora }],
    };
    setPedidos((prev) => [pedido, ...prev]);
    setItems([]);
    return pedido;
  };

  const avanzarPedido = (id) => {
    setPedidos((prev) =>
      prev.map((p) => {
        const siguiente = ESTADOS[ESTADOS.indexOf(p.estado) + 1];
        if (p.id !== id || !siguiente || !puedeAvanzar(rol, p.estado)) return p;
        return {
          ...p,
          estado: siguiente,
          historial: [...p.historial, { estado: siguiente, fecha: new Date().toISOString() }],
        };
      })
    );
  };

  // Solo el cliente cancela (antes de que el local lo reciba) o elimina un pedido entregado
  const eliminarPedido = (id) => {
    if (rol === 'admin') {
      setPedidos((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    if (rol !== 'cliente') return;
    setPedidos((prev) =>
      prev.filter(
        (p) => p.id !== id || p.cliente !== usuario.usuario || !(p.estado === 'pedido' || p.estado === 'entregado')
      )
    );
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        pedidos,
        total,
        cantidadTotal,
        agregar,
        cambiarCantidad,
        quitar,
        vaciar,
        crearPedido,
        avanzarPedido,
        eliminarPedido,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
