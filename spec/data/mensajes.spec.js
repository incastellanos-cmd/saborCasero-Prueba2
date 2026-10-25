import { afterEach, describe, expect, it, vi } from 'vitest';
import { guardarMensaje, obtenerMensajes } from '../../src/data/mensajes.js';

const almacenamiento = new Map();

const localStorageDePrueba = {
  getItem: vi.fn((clave) => almacenamiento.get(clave) ?? null),
  setItem: vi.fn((clave, valor) => almacenamiento.set(clave, valor)),
};

describe('persistencia de mensajes de contacto', () => {
  afterEach(() => {
    almacenamiento.clear();
    vi.restoreAllMocks();
  });

  it('guarda mensajes y los devuelve del más reciente al más antiguo', () => {
    vi.stubGlobal('localStorage', localStorageDePrueba);

    const primero = guardarMensaje({
      nombre: ' Ana ',
      email: ' ana@example.com ',
      mensaje: ' Hola ',
    });
    const segundo = guardarMensaje({
      nombre: 'Luis',
      email: 'luis@example.com',
      mensaje: 'Consulta',
    });

    expect(primero.nombre).toBe('Ana');
    expect(primero.email).toBe('ana@example.com');
    expect(primero.mensaje).toBe('Hola');
    expect(primero.fecha).toBeTruthy();
    expect(obtenerMensajes().map((mensaje) => mensaje.id)).toEqual([segundo.id, primero.id]);
  });

  it('rechaza datos persistidos con formato inválido', () => {
    vi.stubGlobal('localStorage', {
      ...localStorageDePrueba,
      getItem: vi.fn(() => '{invalido'),
    });

    expect(() => obtenerMensajes()).toThrow();
  });
});
