// src/dbLocal.js
// IndexedDB local para historial y mejores puntajes (por jugador)

const NOMBRE_BD = 'mi_space_invaders_db';
const VERSION_BD = 2;
const STORE_HISTORIAL = 'highscores';
const STORE_MEJORES = 'mejores';

function abrirBD() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(NOMBRE_BD, VERSION_BD);
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains(STORE_HISTORIAL)) {
        const s = db.createObjectStore(STORE_HISTORIAL, { keyPath: 'id', autoIncrement: true });
        s.createIndex('puntaje', 'puntaje', { unique: false });
        s.createIndex('created_at', 'created_at', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_MEJORES)) {
        const m = db.createObjectStore(STORE_MEJORES, { keyPath: 'nombre' });
        m.createIndex('puntaje', 'puntaje', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// inicializar BD
export async function inicializarBD() {
  const db = await abrirBD();
  db.close();
}

// guardar en historial (cada partida)
export async function guardarHistorial(reg) {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HISTORIAL, 'readwrite');
    const store = tx.objectStore(STORE_HISTORIAL);
    const payload = {
      nombre: reg.nombre,
      puntaje: Number(reg.puntaje) || 0,
      nivel: Number(reg.nivel) || 0,
      created_at: new Date().toISOString()
    };
    const req = store.add(payload);
    req.onsuccess = () => { db.close(); resolve(req.result); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

// guardar o actualizar mejor puntaje por nombre (keyPath = nombre)
export async function guardarMejor(nombre, puntaje, nivel) {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEJORES, 'readwrite');
    const store = tx.objectStore(STORE_MEJORES);
    const reqGet = store.get(nombre);
    reqGet.onsuccess = () => {
      const existente = reqGet.result;
      if (!existente || puntaje > existente.puntaje) {
        const nuevo = {
          nombre,
          puntaje,
          nivel,
          updated_at: new Date().toISOString()
        };
        const reqPut = store.put(nuevo);
        reqPut.onsuccess = () => { db.close(); resolve(true); };
        reqPut.onerror = () => { db.close(); reject(reqPut.error); };
      } else {
        db.close();
        resolve(false); // no superó el mejor
      }
    };
    reqGet.onerror = () => { db.close(); reject(reqGet.error); };
  });
}

// obtener mejores (descendente por puntaje)
export async function obtenerMejores(limite = 50) {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEJORES, 'readonly');
    const store = tx.objectStore(STORE_MEJORES);
    const index = store.index('puntaje');
    const req = index.openCursor(null, 'prev');
    const res = [];
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor && res.length < limite) {
        res.push(cursor.value);
        cursor.continue();
      } else {
        db.close();
        resolve(res);
      }
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

// obtener historial (opcional)
export async function obtenerHistorial(limite = 100) {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_HISTORIAL, 'readonly');
    const store = tx.objectStore(STORE_HISTORIAL);
    const index = store.index('created_at');
    const req = index.openCursor(null, 'prev');
    const res = [];
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor && res.length < limite) {
        res.push(cursor.value);
        cursor.continue();
      } else {
        db.close();
        resolve(res);
      }
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

// borrar todos los mejores
export async function borrarTodosMejores() {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_MEJORES, 'readwrite');
    const store = tx.objectStore(STORE_MEJORES);
    const req = store.clear();
    req.onsuccess = () => { db.close(); resolve(true); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}