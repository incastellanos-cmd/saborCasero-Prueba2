import { afterEach, describe, expect, it } from 'vitest';
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductoPorId,
  obtenerProductos,
} from '../../src/data/datos.js';

const productoDePrueba = {
  id: 'TEST-VITEST',
  nombre: 'Producto de prueba',
  categoria: 'Prueba',
  tiempo_prep: 1,
  precio: 1000,
  stock: 1,
  imagen: '/imagenes/prueba.jpg',
};

describe('gestión de productos', () => {
  afterEach(() => {
    eliminarProducto(productoDePrueba.id);
  });

  it('devuelve los productos sin exponer el arreglo interno', () => {
    const productos = obtenerProductos();
    const copia = obtenerProductos();

    expect(productos.length).toBeGreaterThan(0);
    expect(obtenerProductoPorId('PR001').nombre).toBe('Porción de pastel de choclo');
    expect(copia).not.toBe(productos);

    copia.push(productoDePrueba);
    expect(obtenerProductoPorId(productoDePrueba.id)).toBeUndefined();
  });

  it('busca un producto por su identificador', () => {
    expect(obtenerProductoPorId('PR003').nombre).toBe('Completo italiano');
    expect(obtenerProductoPorId('NO-EXISTE')).toBeUndefined();
  });

  it('crea, actualiza y elimina un producto', () => {
    crearProducto(productoDePrueba);
    expect(obtenerProductoPorId(productoDePrueba.id)).toEqual(productoDePrueba);

    actualizarProducto(productoDePrueba.id, { precio: 1500 });
    expect(obtenerProductoPorId(productoDePrueba.id)).toEqual({
      ...productoDePrueba,
      precio: 1500,
    });

    eliminarProducto(productoDePrueba.id);
    expect(obtenerProductoPorId(productoDePrueba.id)).toBeUndefined();
  });
});
