const PRODUCTOS_INICIALES = [
    { id: "PR001", nombre: "Porción de pastel de choclo", categoria: "Plato fuerte", tiempo_prep: 15, precio: 8500, precioOferta: 7500, stock: 30, imagen: "/imagenes/pastel-de-choclo.jpg"},
    { id: "PR002", nombre: "Porción de cazuela de vacuno", categoria: "Plato fuerte", tiempo_prep: 20, precio: 9500, precioOferta: 8500, stock: 25, imagen: "/imagenes/cazuela-de-vacuno.jpg" },
    { id: "PR003", nombre: "Completo italiano", categoria: "Sandwich", tiempo_prep: 5, precio: 4500, stock: 50, imagen: "/imagenes/completo-italiano.jpg" },
    { id: "PR004", nombre: "Churrasco con palta", categoria: "Sandwich", tiempo_prep: 5, precio: 6500, stock: 40, imagen: "/imagenes/churrasco-italiano.jpg" },
    { id: "PR005", nombre: "Ensalada chilena", categoria: "Entrada", tiempo_prep: 10, precio: 3500, stock: 20, imagen: "/imagenes/ensalada-chilena.jpg" },
    { id: "PR006", nombre: "Jugo natural de frutilla", categoria: "Bebida", tiempo_prep: 3, precio: 2500, stock: 60, imagen: "/imagenes/jugo-de-frutilla.jpg" }
];

const CLAVE = 'sc_productos';

const cargar = () => {
    try {
        const guardado = JSON.parse(globalThis.localStorage?.getItem(CLAVE));
        if (Array.isArray(guardado)) {
            return guardado.map((producto) => {
                const inicial = PRODUCTOS_INICIALES.find((p) => p.id === producto.id);
                return inicial?.precioOferta && !producto.precioOferta
                    ? { ...producto, precioOferta: inicial.precioOferta }
                    : producto;
            });
        }
    } catch { /* usa los iniciales */ }
    return [...PRODUCTOS_INICIALES];
};

let productos = cargar();

const guardar = () => {
    try { globalThis.localStorage?.setItem(CLAVE, JSON.stringify(productos)); } catch { /* sin persistencia */ }
};

export const obtenerProductos = () => {
    return [...productos]; 
};

export const obtenerProductoPorId = (id) => {
    return productos.find(producto => producto.id === id); // Leer uno
};

export const crearProducto = (nuevoProducto) => {
    productos.push(nuevoProducto);
    guardar();
    return [...productos];
};

export const actualizarProducto = (id, datosActualizados) => {
    productos = productos.map(producto => 
        producto.id === id ? { ...producto, ...datosActualizados } : producto
    ); // Actualizar
    guardar();
    return [...productos];
};

export const eliminarProducto = (id) => {
    productos = productos.filter(producto => producto.id !== id);
    guardar();
    return [...productos];
};