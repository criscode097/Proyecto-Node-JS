'use strict';

// ============================================================
// ALMACENAMIENTO DE DATOS
// ============================================================

// Map para almacenar propiedades por ID
const users = new Map();

// Set de ubicaciones únicas registradas (evita duplicados)
const registeredEmails = new Set();

// Map de categorías por propiedad (propertyId -> Set de categorías)
const userRoles = new Map();

// WeakMap para datos privados de cada propiedad (precio por noche)
const privateData = new WeakMap();

// WeakSet para propiedades con reserva activa en este momento
const activeSessions = new WeakSet();

// Set de IDs con reserva activa (para la UI, ya que WeakSet no es iterable)
const activeSessionIds = new Set();

// Categorías disponibles para las propiedades
const AVAILABLE_ROLES = new Set(['villa', 'apartment', 'cabin']);

// ============================================================
// UTILIDADES
// ============================================================

const generateId = () => 'prop_' + Math.random().toString(36).substr(2, 9);

const hashPassword = password => btoa(password);

const logToConsole = (message, type = 'info') => {
  const consoleEl = document.getElementById('console');
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
};

// ============================================================
// GESTIÓN DE PROPIEDADES
// ============================================================

const registerUser = (name, email, password) => {
  // Verifica que la ubicación no esté duplicada
  if (registeredEmails.has(email)) return null;

  const user = {
    id:        generateId(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };

  // Agrega la ubicación al Set de ubicaciones registradas
  registeredEmails.add(email);

  // Guarda la propiedad en el Map principal
  users.set(user.id, user);

  // Guarda el precio en el WeakMap de datos privados
  privateData.set(user, hashPassword(password));

  // Inicializa el Set de categorías vacío para esta propiedad
  userRoles.set(user.id, new Set());

  return user;
};

const getUserById = userId => users.get(userId) ?? null;

const getAllUsers = () => [...users.values()];

const deleteUser = userId => {
  const user = getUserById(userId);
  if (!user) return false;

  // Elimina la ubicación del Set
  registeredEmails.delete(user.email);

  // Elimina las categorías del Map
  userRoles.delete(userId);

  // Cierra la reserva activa si existe
  if (activeSessions.has(user)) {
    activeSessions.delete(user);
    activeSessionIds.delete(userId);
  }

  // Elimina la propiedad del Map principal
  users.delete(userId);
  return true;
};

// ============================================================
// GESTIÓN DE CATEGORÍAS
// ============================================================

const assignRoles = (userId, roles) => {
  const user = getUserById(userId);
  if (!user) return false;

  // Filtra solo las categorías válidas usando AVAILABLE_ROLES
  const validRoles = roles.filter(r => AVAILABLE_ROLES.has(r));
  if (validRoles.length === 0) return false;

  // Obtiene o crea el Set de categorías del usuario
  const currentRoles = userRoles.get(userId) ?? new Set();

  // Agrega cada categoría válida al Set
  validRoles.forEach(r => currentRoles.add(r));
  userRoles.set(userId, currentRoles);

  return true;
};

const getUserRoles = userId => userRoles.get(userId) ?? new Set();

const hasRole = (userId, role) => getUserRoles(userId).has(role);

// ============================================================
// OPERACIONES DE CONJUNTOS
// ============================================================

const getUsersByRole = role =>
  getAllUsers().filter(u => hasRole(u.id, role));

const getUsersWithAllRoles = roles =>
  getAllUsers().filter(u => roles.every(r => hasRole(u.id, r)));

const getUsersWithAnyRole = roles =>
  getAllUsers().filter(u => roles.some(r => hasRole(u.id, r)));

const getUsersWithoutRoles = () =>
  getAllUsers().filter(u => getUserRoles(u.id).size === 0);

// ============================================================
// GESTIÓN DE RESERVAS (SESIONES)
// ============================================================

const login = userId => {
  const user = getUserById(userId);
  if (!user) return false;

  // Verifica que no tenga reserva activa
  if (activeSessions.has(user)) return false;

  // Agrega al WeakSet de reservas activas
  activeSessions.add(user);

  // Agrega al Set de IDs activos (para poder iterar en la UI)
  activeSessionIds.add(userId);

  return true;
};

const logout = userId => {
  const user = getUserById(userId);
  if (!user) return false;

  // Verifica que tenga reserva activa
  if (!activeSessions.has(user)) return false;

  // Elimina del WeakSet y del Set de IDs
  activeSessions.delete(user);
  activeSessionIds.delete(userId);

  return true;
};

const isLoggedIn = userId => {
  const user = getUserById(userId);
  if (!user) return false;
  return activeSessions.has(user);
};

const getActiveSessionCount = () => activeSessionIds.size;

// ============================================================
// RENDERIZADO
// ============================================================

const renderUsersList = () => {
  const container = document.getElementById('usersList');
  const allUsers  = getAllUsers();

  if (allUsers.length === 0) {
    container.innerHTML = '<p class="empty-state">No hay propiedades registradas</p>';
  } else {
    container.innerHTML = allUsers.map(user => {
      const roles  = getUserRoles(user.id);
      const online = isLoggedIn(user.id);
      return `
        <div class="user-item">
          <div class="user-info">
            <div class="user-name">${user.name}</div>
            <div class="user-email">📍 ${user.email}</div>
            <div class="user-id">ID: ${user.id}</div>
            <div class="user-roles">
              ${[...roles].map(r => `<span class="role-badge role-${r}">${r}</span>`).join('')}
            </div>
          </div>
          <div class="user-status ${online ? 'online' : 'offline'}"></div>
        </div>
      `;
    }).join('');
  }

  document.getElementById('totalUsers').textContent  = allUsers.length;
  document.getElementById('activeUsers').textContent = getActiveSessionCount();
};

const renderActiveSessions = () => {
  const list        = document.getElementById('sessionsList');
  const activeUsers = getAllUsers().filter(u => isLoggedIn(u.id));

  list.innerHTML = activeUsers.length === 0
    ? '<li class="empty-state">No hay reservas activas</li>'
    : activeUsers.map(u => `<li>🟢 ${u.name} (${u.id})</li>`).join('');
};

const showMessage = (elementId, message, type) => {
  const el      = document.getElementById(elementId);
  el.textContent = message;
  el.className   = `message ${type}`;
  setTimeout(() => { el.className = 'message'; }, 3000);
};

// ============================================================
// EVENT LISTENERS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // Registro de propiedad
  document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();

    const name     = document.getElementById('userName').value.trim();
    const email    = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value.trim();

    if (!password || isNaN(Number(password)) || Number(password) <= 0) {
      showMessage('registerMessage', 'Ingresa un precio por noche válido', 'error');
      return;
    }

    const user = registerUser(name, email, password);

    if (user) {
      showMessage('registerMessage', `Propiedad "${user.name}" registrada con ID: ${user.id}`, 'success');
      logToConsole(`Propiedad registrada: ${user.name} (${user.id})`, 'success');
      e.target.reset();
      renderUsersList();
    } else {
      showMessage('registerMessage', 'Ya existe una propiedad con esa ubicación', 'error');
      logToConsole(`Error: Ubicación "${email}" ya registrada`, 'error');
    }
  });

  // Asignar categorías
  document.getElementById('assignRolesBtn').addEventListener('click', () => {
    const userId    = document.getElementById('roleUserId').value.trim();
    const checkboxes = document.querySelectorAll('.roles-checkboxes input:checked');
    const roles     = [...checkboxes].map(cb => cb.value);

    if (!userId) {
      showMessage('rolesMessage', 'Ingresa un ID de propiedad', 'error');
      return;
    }
    if (roles.length === 0) {
      showMessage('rolesMessage', 'Selecciona al menos una categoría', 'error');
      return;
    }

    const success = assignRoles(userId, roles);

    if (success) {
      showMessage('rolesMessage', `Categorías asignadas: ${roles.join(', ')}`, 'success');
      logToConsole(`Categorías [${roles.join(', ')}] asignadas a ${userId}`, 'success');
      renderUsersList();
    } else {
      showMessage('rolesMessage', 'Propiedad no encontrada', 'error');
      logToConsole(`Error: Propiedad ${userId} no encontrada`, 'error');
    }
  });

  // Operaciones de conjuntos
  document.querySelectorAll('[data-op]').forEach(btn => {
    btn.addEventListener('click', () => {
      const op = btn.dataset.op;
      let result = [];
      let title  = '';

      switch (op) {
        case 'admins':
          result = getUsersByRole('villa');
          title  = 'Propiedades Villa';
          break;
        case 'editors':
          result = getUsersByRole('apartment');
          title  = 'Propiedades Apartamento';
          break;
        case 'admin-and-editor':
          result = getUsersWithAllRoles(['villa', 'apartment']);
          title  = 'Villa Y Apartamento';
          break;
        case 'admin-or-editor':
          result = getUsersWithAnyRole(['villa', 'apartment']);
          title  = 'Villa O Apartamento';
          break;
        case 'only-viewers':
          result = getUsersByRole('cabin').filter(
            u => !hasRole(u.id, 'villa') && !hasRole(u.id, 'apartment')
          );
          title = 'Solo Cabaña';
          break;
        case 'no-roles':
          result = getUsersWithoutRoles();
          title  = 'Sin Categoría';
          break;
      }

      document.getElementById('operationResult').innerHTML = `
        <h4>${title} (${result.length})</h4>
        ${result.length === 0
          ? '<p class="empty-state">No se encontraron propiedades</p>'
          : `<ul>${result.map(u => `<li>${u.name} — ${u.email} (${u.id})</li>`).join('')}</ul>`
        }
      `;

      logToConsole(`Operación "${title}": ${result.length} propiedad(es)`, 'info');
    });
  });

  // Reservas activas
  document.getElementById('loginBtn').addEventListener('click', () => {
    const userId = document.getElementById('sessionUserId').value.trim();
    if (!userId) { showMessage('sessionMessage', 'Ingresa un ID de propiedad', 'error'); return; }

    const success = login(userId);
    if (success) {
      showMessage('sessionMessage', 'Reserva activada ✅', 'success');
      logToConsole(`Reserva activada: ${userId}`, 'success');
    } else {
      const user = getUserById(userId);
      if (!user) {
        showMessage('sessionMessage', 'Propiedad no encontrada', 'error');
        logToConsole(`Error: Propiedad ${userId} no existe`, 'error');
      } else {
        showMessage('sessionMessage', 'Ya tiene una reserva activa', 'error');
        logToConsole(`Error: ${userId} ya tiene reserva activa`, 'warning');
      }
    }
    renderUsersList();
    renderActiveSessions();
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    const userId = document.getElementById('sessionUserId').value.trim();
    if (!userId) { showMessage('sessionMessage', 'Ingresa un ID de propiedad', 'error'); return; }

    const success = logout(userId);
    if (success) {
      showMessage('sessionMessage', 'Reserva liberada ✅', 'success');
      logToConsole(`Reserva liberada: ${userId}`, 'success');
    } else {
      showMessage('sessionMessage', 'No tiene reserva activa o no existe', 'error');
      logToConsole(`Error: No se pudo liberar reserva de ${userId}`, 'error');
    }
    renderUsersList();
    renderActiveSessions();
  });

  document.getElementById('checkSessionBtn').addEventListener('click', () => {
    const userId = document.getElementById('sessionUserId').value.trim();
    if (!userId) { showMessage('sessionMessage', 'Ingresa un ID de propiedad', 'error'); return; }

    const logged = isLoggedIn(userId);
    const user   = getUserById(userId);

    if (!user) {
      showMessage('sessionMessage', 'Propiedad no encontrada', 'error');
    } else {
      showMessage('sessionMessage', logged ? 'Reserva activa ✅' : 'Sin reserva ❌', 'info');
      logToConsole(`Verificación: ${userId} ${logged ? 'tiene' : 'no tiene'} reserva activa`, 'info');
    }
  });

  // Limpiar consola
  document.getElementById('clearConsole').addEventListener('click', () => {
    document.getElementById('console').innerHTML = '';
  });

  // Render inicial
  renderUsersList();
  renderActiveSessions();
  logToConsole('VacaRent — Sistema de Gestión inicializado', 'info');
});
