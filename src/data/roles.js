export const ROLES = {
  cliente: 'Cliente',
  admin: 'Administrador',
  recepcion: 'Recepción',
  chef: 'Chef',
  delivery: 'Delivery',
};

export const ESTADOS = ['pedido', 'recibido', 'preparando', 'listo', 'en_camino', 'entregado'];

export const ETIQUETAS = {
  pedido: 'Pedido realizado',
  recibido: 'Recibido por el local',
  preparando: 'En preparación',
  listo: 'Listo (entregado a delivery)',
  en_camino: 'En camino',
  entregado: 'Entregado al cliente',
};

export const COLORES = {
  pedido: 'secondary',
  recibido: 'primary',
  preparando: 'warning',
  listo: 'info',
  en_camino: 'dark',
  entregado: 'success',
};

// Transiciones: estado actual -> qué rol puede avanzarlo y con qué botón
export const TRANSICIONES = {
  pedido: { rol: 'recepcion', accion: 'Recibir pedido' },
  recibido: { rol: 'chef', accion: 'Preparar pedido' },
  preparando: { rol: 'chef', accion: 'Entregar a delivery' },
  listo: { rol: 'delivery', accion: 'Recibir pedido' },
  en_camino: { rol: 'delivery', accion: 'Entregado al cliente' },
};

export const puedeAvanzar = (rol, estado) => TRANSICIONES[estado]?.rol === rol;

// Estados guardados por la versión anterior del flujo
export const MIGRACION = { confirmado: 'recibido', enviado: 'en_camino' };
