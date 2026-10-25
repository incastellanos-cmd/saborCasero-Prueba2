import { createContext, useContext, useEffect, useState } from 'react';
import { ROLES } from '../data/roles';

// Usuarios de demostración. En producción esto debe validarse en un backend.
const USUARIOS = [
  { usuario: 'cliente', clave: 'cliente123', rol: 'cliente', nombre: 'Cliente Demo' },
  { usuario: 'admin', clave: 'admin123', rol: 'admin', nombre: 'Administrador' },
  { usuario: 'recepcion', clave: 'recepcion123', rol: 'recepcion', nombre: 'Recepción' },
  { usuario: 'chef', clave: 'chef123', rol: 'chef', nombre: 'Chef' },
  { usuario: 'delivery', clave: 'delivery123', rol: 'delivery', nombre: 'Delivery' },
];

const CLAVE_SESION = 'sc_sesion';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const USUARIOS_DEMO = USUARIOS.map(({ usuario, clave, rol }) => ({ usuario, clave, rol }));

const CLAVE_USUARIOS = 'sc_usuarios';
const CLAVE_ROLES = 'sc_roles';

const leerLista = (clave, inicial) => {
  try {
    const v = JSON.parse(localStorage.getItem(clave));
    return v && typeof v === 'object' ? v : inicial;
  } catch {
    return inicial;
  }
};

const leerUsuarios = () => {
  const v = leerLista(CLAVE_USUARIOS, USUARIOS);
  const guardados = Array.isArray(v) ? v : [];
  return [...USUARIOS.filter((b) => !guardados.some((u) => u.usuario === b.usuario)), ...guardados];
};

const leerSesion = () => {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE_SESION));
    return leerUsuarios().some((u) => u.usuario === guardada?.usuario && u.rol === guardada?.rol) ? guardada : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [sesion, setSesion] = useState(leerSesion);
  const [usuarios, setUsuarios] = useState(leerUsuarios);
  const [roles, setRoles] = useState(() => ({ ...leerLista(CLAVE_ROLES, {}), ...ROLES }));

  useEffect(() => {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem(CLAVE_ROLES, JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    const sincronizarUsuarios = (e) => {
      if (e.key === CLAVE_USUARIOS) setUsuarios(leerUsuarios());
    };

    window.addEventListener('storage', sincronizarUsuarios);
    return () => window.removeEventListener('storage', sincronizarUsuarios);
  }, []);

  const login = (usuario, clave) => {
    const usuariosActualizados = leerUsuarios();
    setUsuarios(usuariosActualizados);
    const identificador = usuario.trim().toLowerCase();
    const encontrado = usuariosActualizados.find((u) => (
      (u.usuario === identificador || u.email?.trim().toLowerCase() === identificador) && u.clave === clave
    ));
    if (!encontrado) return false;
    const datos = {
      usuario: encontrado.usuario,
      rol: encontrado.rol,
      nombre: encontrado.nombre,
      email: encontrado.email ?? '',
      telefono: encontrado.telefono ?? '',
      direccion: encontrado.direccion ?? '',
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(datos));
    setSesion(datos);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  };

  const rolesBase = Object.keys(ROLES);
  const agregarRol = (nombre) => {
    const limpio = nombre.trim();
    const id = limpio.toLowerCase().replace(/\s+/g, '_');
    if (!id || roles[id]) return false;
    setRoles((prev) => ({ ...prev, [id]: limpio }));
    return true;
  };
  const eliminarRol = (id) => {
    if (rolesBase.includes(id)) return;
    setRoles((prev) => {
      const { [id]: _quitado, ...resto } = prev;
      return resto;
    });
    setUsuarios((prev) => prev.filter((u) => u.rol !== id));
  };
  const agregarUsuario = ({ usuario, clave, rol, nombre, email = '', telefono = '', direccion = '' }) => {
    const id = usuario.trim().toLowerCase();
    const usuariosActualizados = leerUsuarios();
    if (!id || !clave || !roles[rol] || usuariosActualizados.some((u) => u.usuario === id)) return false;
    const nuevoUsuario = {
      usuario: id,
      clave,
      rol,
      nombre: nombre.trim() || id,
      email: email.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
    };
    const listaActualizada = [...usuariosActualizados, nuevoUsuario];
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(listaActualizada));
    setUsuarios(listaActualizada);
    return true;
  };
  const eliminarUsuario = (id) => {
    if (id === sesion?.usuario || USUARIOS.some((b) => b.usuario === id)) return;
    setUsuarios((prev) => prev.filter((u) => u.usuario !== id));
  };

  return (
    <AuthContext.Provider
      value={{
        usuario: sesion,
        rol: sesion?.rol ?? null,
        roles,
        rolesBase,
        usuarios,
        login,
        logout,
        agregarRol,
        eliminarRol,
        agregarUsuario,
        eliminarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};