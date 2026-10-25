import { describe, expect, it } from 'vitest';
import {
  filtrarProductos,
  obtenerPrecioFinal,
  validarDatosCheckout,
} from '../../src/data/tienda.js';

const productos = [
  { id: 'A', nombre: 'Pastel de choclo', categoria: 'Plato fuerte', precio: 8500, precioOferta: 7500 },
  { id: 'B', nombre: 'Jugo de frutilla', categoria: 'Bebida', precio: 2500 },
];

describe('funciones de tienda', () => {
  it('filtra productos por texto y categoría', () => {
    expect(filtrarProductos(productos, '  CHOCLO ')[0].id).toBe('A');
    expect(filtrarProductos(productos, '', 'Bebida').map((producto) => producto.id)).toEqual(['B']);
    expect(filtrarProductos(productos, 'no existe')).toEqual([]);
  });

  it('aplica el precio promocional solo cuando es menor al precio normal', () => {
    expect(obtenerPrecioFinal(productos[0])).toBe(7500);
    expect(obtenerPrecioFinal({ precio: 1000, precioOferta: 1200 })).toBe(1000);
    expect(obtenerPrecioFinal(productos[1])).toBe(2500);
  });

  it('valida datos de contacto y dirección de envío', () => {
    expect(validarDatosCheckout({
      nombre: 'Cliente',
      email: 'cliente@example.com',
      telefono: '+56912345678',
      direccion: 'Calle 123',
      metodoEntrega: 'delivery',
    })).toEqual({});

    expect(validarDatosCheckout({
      nombre: '',
      email: 'correo-invalido',
      telefono: '',
      direccion: '',
      metodoEntrega: 'delivery',
    })).toEqual({
      nombre: 'Ingresa tu nombre.',
      email: 'Ingresa un correo electrónico válido.',
      telefono: 'Ingresa un teléfono de contacto.',
      direccion: 'Ingresa la dirección de entrega.',
    });
  });

  it('no exige dirección al elegir retiro en el local', () => {
    expect(validarDatosCheckout({
      nombre: 'Cliente',
      email: 'cliente@example.com',
      telefono: '12345678',
      direccion: '',
      metodoEntrega: 'retiro',
    })).toEqual({});
  });
});
