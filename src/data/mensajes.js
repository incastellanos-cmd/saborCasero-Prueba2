const CLAVE_MENSAJES = 'sc_mensajes';

export const obtenerMensajes = () => {
  const guardado = globalThis.localStorage.getItem(CLAVE_MENSAJES);
  if (!guardado) return [];
  const mensajes = JSON.parse(guardado);
  if (!Array.isArray(mensajes)) throw new Error('El almacenamiento de mensajes no tiene un formato válido.');
  return mensajes;
};

export const guardarMensaje = (datos) => {
  const mensajes = obtenerMensajes();
  const mensaje = {
    id: `MEN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nombre: datos.nombre.trim(),
    email: datos.email.trim(),
    mensaje: datos.mensaje.trim(),
    fecha: new Date().toISOString(),
  };
  globalThis.localStorage.setItem(CLAVE_MENSAJES, JSON.stringify([mensaje, ...mensajes]));
  return mensaje;
};
