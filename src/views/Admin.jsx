import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { COLORES, ESTADOS, ETIQUETAS } from '../data/roles';
import { actualizarProducto, crearProducto, eliminarProducto, obtenerProductos } from '../data/datos';

const VACIO = { id: '', nombre: '', categoria: '', tiempo_prep: 5, precio: 0, stock: 0, imagen: '' };

const PanelPedidos = () => {
  const { pedidos, eliminarPedido } = useCarrito();
  if (pedidos.length === 0) return <p className="text-muted">No hay pedidos.</p>;
  return pedidos.map((p) => {
    const avance = Math.round((ESTADOS.indexOf(p.estado) / (ESTADOS.length - 1)) * 100);
    return (
      <div key={p.id} className="card mb-3 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span><strong>{p.id}</strong> · {p.cliente}</span>
          <span className={`badge bg-${COLORES[p.estado]}`}>{ETIQUETAS[p.estado]}</span>
        </div>
        <div className="card-body">
          <div className="progress mb-2" role="progressbar" aria-valuenow={avance} aria-valuemin="0" aria-valuemax="100">
            <div className={`progress-bar bg-${COLORES[p.estado]}`} style={{ width: `${avance}%` }}>{avance}%</div>
          </div>
          <ul className="small mb-2">
            {p.items.map((i) => (
              <li key={i.id}>{i.cantidad} x {i.nombre}</li>
            ))}
          </ul>
          <ol className="small text-muted">
            {ESTADOS.filter((e) => p.historial.some((h) => h.estado === e)).map((e) => (
              <li key={e}>{ETIQUETAS[e]} — {new Date(p.historial.find((h) => h.estado === e).fecha).toLocaleString('es-CL')}</li>
            ))}
          </ol>
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold">Total: ${p.total.toLocaleString('es-CL')}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarPedido(p.id)}>Eliminar</button>
          </div>
        </div>
      </div>
    );
  });
};

const PanelProductos = () => {
  const [productos, setProductos] = useState(obtenerProductos);
  const [form, setForm] = useState(VACIO);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const guardar = (e) => {
    e.preventDefault();
    const datos = {
      ...form,
      id: form.id.trim(),
      nombre: form.nombre.trim(),
      tiempo_prep: Number(form.tiempo_prep),
      precio: Number(form.precio),
      stock: Number(form.stock),
    };
    if (editando) {
      setProductos(actualizarProducto(editando, datos));
    } else {
      if (productos.some((p) => p.id === datos.id)) {
        setError('Ya existe un producto con ese código');
        return;
      }
      setProductos(crearProducto(datos));
    }
    setForm(VACIO);
    setEditando(null);
    setError('');
  };

  const editar = (p) => {
    setEditando(p.id);
    setForm(p);
    setError('');
  };

  const cancelar = () => {
    setEditando(null);
    setForm(VACIO);
    setError('');
  };

  return (
    <>
      <form className="row g-2 mb-4" onSubmit={guardar}>
        <div className="col-md-2"><input className="form-control" placeholder="Código" value={form.id} onChange={cambiar('id')} disabled={!!editando} required /></div>
        <div className="col-md-3"><input className="form-control" placeholder="Nombre" value={form.nombre} onChange={cambiar('nombre')} required /></div>
        <div className="col-md-2"><input className="form-control" placeholder="Categoría" value={form.categoria} onChange={cambiar('categoria')} required /></div>
        <div className="col-md-1"><input className="form-control" type="number" min="0" placeholder="Min" title="Tiempo de preparación (min)" value={form.tiempo_prep} onChange={cambiar('tiempo_prep')} required /></div>
        <div className="col-md-2"><input className="form-control" type="number" min="0" placeholder="Precio" value={form.precio} onChange={cambiar('precio')} required /></div>
        <div className="col-md-2"><input className="form-control" type="number" min="0" placeholder="Stock" value={form.stock} onChange={cambiar('stock')} required /></div>
        <div className="col-md-8"><input className="form-control" placeholder="Imagen (ruta, ej. /imagenes/foto.jpg)" value={form.imagen} onChange={cambiar('imagen')} /></div>
        <div className="col-md-4 d-flex gap-2">
          <button className="btn btn-success flex-fill" type="submit">{editando ? 'Guardar cambios' : 'Agregar producto'}</button>
          {editando && <button className="btn btn-outline-secondary" type="button" onClick={cancelar}>Cancelar</button>}
        </div>
        {error && <div className="col-12"><div className="alert alert-danger py-2 mb-0">{error}</div></div>}
      </form>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${Number(p.precio).toLocaleString('es-CL')}</td>
                <td>{p.stock}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-1" onClick={() => editar(p)}>Modificar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setProductos(eliminarProducto(p.id))}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const PanelRoles = () => {
  const { roles, rolesBase, usuarios, usuario, agregarRol, eliminarRol, agregarUsuario, eliminarUsuario } = useAuth();
  const [nombreRol, setNombreRol] = useState('');
  const [nuevo, setNuevo] = useState({ usuario: '', clave: '', nombre: '', rol: 'cliente' });
  const [error, setError] = useState('');

  const crearRol = (e) => {
    e.preventDefault();
    if (agregarRol(nombreRol)) {
      setNombreRol('');
      setError('');
    } else setError('El rol ya existe o es inválido');
  };

  const crearUsuario = (e) => {
    e.preventDefault();
    if (agregarUsuario(nuevo)) {
      setNuevo({ ...nuevo, usuario: '', clave: '', nombre: '' });
      setError('');
    } else setError('Usuario inválido o ya existe');
  };

  return (
    <>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <h5>Roles</h5>
      <form className="d-flex gap-2 mb-3" onSubmit={crearRol}>
        <input className="form-control" placeholder="Nuevo rol" value={nombreRol} onChange={(e) => setNombreRol(e.target.value)} required />
        <button className="btn btn-success" type="submit">Agregar rol</button>
      </form>
      <ul className="list-group mb-4">
        {Object.entries(roles).map(([id, nombre]) => (
          <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
            {nombre}
            {rolesBase.includes(id)
              ? <span className="badge bg-secondary">base</span>
              : <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarRol(id)}>Eliminar</button>}
          </li>
        ))}
      </ul>
      <h5>Usuarios</h5>
      <form className="row g-2 mb-3" onSubmit={crearUsuario}>
        <div className="col-md-3"><input className="form-control" placeholder="Usuario" value={nuevo.usuario} onChange={(e) => setNuevo({ ...nuevo, usuario: e.target.value })} required /></div>
        <div className="col-md-3"><input className="form-control" placeholder="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} /></div>
        <div className="col-md-2"><input className="form-control" type="password" placeholder="Contraseña" value={nuevo.clave} onChange={(e) => setNuevo({ ...nuevo, clave: e.target.value })} required /></div>
        <div className="col-md-2">
          <select className="form-select" value={nuevo.rol} onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}>
            {Object.entries(roles).map(([id, nombre]) => <option key={id} value={id}>{nombre}</option>)}
          </select>
        </div>
        <div className="col-md-2"><button className="btn btn-success w-100" type="submit">Agregar usuario</button></div>
      </form>
      <ul className="list-group">
        {usuarios.map((u) => (
          <li key={u.usuario} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{u.usuario} <span className="text-muted small">· {roles[u.rol] ?? u.rol}</span></span>
            {u.usuario !== usuario.usuario && (
              <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarUsuario(u.usuario)}>Eliminar</button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

const PESTAÑAS = { pedidos: ['Pedidos', PanelPedidos], productos: ['Productos', PanelProductos], roles: ['Roles y usuarios', PanelRoles] };

const Admin = () => {
  const [pestaña, setPestaña] = useState('pedidos');
  const Panel = PESTAÑAS[pestaña][1];
  return (
    <div className="container mt-4 mb-5">
      <h1>Panel de administración</h1>
      <ul className="nav nav-tabs mb-3">
        {Object.entries(PESTAÑAS).map(([id, [titulo]]) => (
          <li key={id} className="nav-item">
            <button className={`nav-link ${pestaña === id ? 'active' : ''}`} onClick={() => setPestaña(id)}>{titulo}</button>
          </li>
        ))}
      </ul>
      <Panel />
    </div>
  );
};

export default Admin;
