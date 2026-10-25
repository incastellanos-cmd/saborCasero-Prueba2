export const obtenerPrecioFinal = (producto) =>
  producto.precioOferta > 0 && producto.precioOferta < producto.precio
    ? producto.precioOferta
    : producto.precio;

export const filtrarProductos = (productos, busqueda = '', categoria = 'Todas') => {
  const termino = busqueda.trim().toLocaleLowerCase('es-CL');
  return productos.filter((producto) => {
    const coincideCategoria = categoria === 'Todas' || producto.categoria === categoria;
    const coincideBusqueda = `${producto.nombre} ${producto.categoria}`
      .toLocaleLowerCase('es-CL')
      .includes(termino);
    return coincideCategoria && coincideBusqueda;
  });
};

export const validarDatosCheckout = (datos) => {
  const errores = {};
  if (!datos.nombre?.trim()) errores.nombre = 'Ingresa tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email?.trim() ?? '')) {
    errores.email = 'Ingresa un correo electrónico válido.';
  }
  if (!datos.telefono?.trim()) errores.telefono = 'Ingresa un teléfono de contacto.';
  if (datos.metodoEntrega === 'delivery' && !datos.direccion?.trim()) {
    errores.direccion = 'Ingresa la dirección de entrega.';
  }
  if (!['delivery', 'retiro'].includes(datos.metodoEntrega)) {
    errores.metodoEntrega = 'Selecciona una opción de entrega.';
  }
  return errores;
};
