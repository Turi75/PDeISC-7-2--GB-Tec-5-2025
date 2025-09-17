// src/dbLocal.js
// Módulo para manejar puntajes locales con IndexedDB
const NOMBRE_BD = 'mi_space_invaders_db';
const VERSION_BD = 1;
const NOMBRE_OBJETO = 'highscores';

function abrirBD() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(NOMBRE_BD, VERSION_BD);
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains(NOMBRE_OBJETO)) {
        const store = db.createObjectStore(NOMBRE_OBJETO, { keyPath: 'id', autoIncrement: true });
        store.createIndex('puntaje', 'puntaje', { unique: false });
        store.createIndex('created_at', 'created_at', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function inicializarBD() {
  const db = await abrirBD();
  db.close();
}

export async function guardarPuntaje(registro) {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOMBRE_OBJETO, 'readwrite');
    const store = tx.objectStore(NOMBRE_OBJETO);
    const payload = {
      nombre: registro.nombre,
      puntaje: Number(registro.puntaje) || 0,
      nivel: Number(registro.nivel) || 0,
      created_at: new Date().toISOString()
    };
    const req = store.add(payload);
    req.onsuccess = () => { db.close(); resolve(req.result); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function obtenerTop(limite = 10) {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOMBRE_OBJETO, 'readonly');
    const store = tx.objectStore(NOMBRE_OBJETO);
    const index = store.index('puntaje');
    const req = index.openCursor(null, 'prev');
    const resultados = [];
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor && resultados.length < limite) {
        resultados.push(cursor.value);
        cursor.continue();
      } else {
        db.close();
        resolve(resultados);
      }
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function borrarTodos() {
  const db = await abrirBD();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(NOMBRE_OBJETO, 'readwrite');
    const store = tx.objectStore(NOMBRE_OBJETO);
    const req = store.clear();
    req.onsuccess = () => { db.close(); resolve(true); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}
