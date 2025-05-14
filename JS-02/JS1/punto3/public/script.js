// script.js
// Ejercicio unshift(): Colores (con mapeo a CSS), Tareas y Usuarios

document.addEventListener('DOMContentLoaded', () => {
    // Arrays
    let colores  = [];
    let tareas   = ['Estudiar', 'Ejercicio', 'Leer'];
    let usuarios = ['Alice', 'Bob', 'Charlie'];
  
    // DOM refs
    const outColores  = document.getElementById('outColores');
    const btnColores  = document.getElementById('btnUnshiftColores');
    const outTareas   = document.getElementById('outTareas');
    const inputTarea  = document.getElementById('nuevaTarea');
    const errTarea    = document.getElementById('err-tarea');
    const btnTarea    = document.getElementById('btnUnshiftTarea');
    const outUsuarios = document.getElementById('outUsuarios');
    const inputUsuario= document.getElementById('nuevoUsuario');
    const errUsuario  = document.getElementById('err-usuario');
    const btnUsuario  = document.getElementById('btnUnshiftUsuario');
  
    // Helper genérico
    function renderArray(arr, container) {
      if (!container) return;
      container.innerHTML = arr.map(x => `<div>${x}</div>`).join('');
    }
    // Helper colores: mapea español→inglés para CSS
    const mapaColores = { Rojo: 'red', Verde: 'green', Azul: 'blue' };
    function renderColores(arr, container) {
      if (!container) return;
      container.innerHTML = arr.map(c => {
        const cssColor = mapaColores[c] || 'gray';
        return `<div style="
          background-color: ${cssColor};
          color: #fff;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: .9rem;
        ">${c}</div>`;
      }).join('');
    }
  
    // Render inicial
    renderColores(colores, outColores);
    renderArray(tareas,   outTareas);
    renderArray(usuarios, outUsuarios);
  
    // 1) Unshift Colores
    btnColores.addEventListener('click', () => {
      // Agrega exactamente estos tres al inicio
      colores.unshift('Rojo', 'Verde', 'Azul');
      renderColores(colores, outColores);
    });
  
    // 2) Unshift Tarea Urgente
    btnTarea.addEventListener('click', () => {
      errTarea.textContent = '';
      const v = inputTarea.value.trim();
      if (!v) {
        errTarea.textContent = 'Escribe la tarea urgente.';
        return;
      }
      tareas.unshift(v);
      renderArray(tareas, outTareas);
      inputTarea.value = '';
    });
  
    // 3) Unshift Usuario Conectado
    btnUsuario.addEventListener('click', () => {
      errUsuario.textContent = '';
      const u = inputUsuario.value.trim();
      if (!u) {
        errUsuario.textContent = 'Ingresa nombre de usuario.';
        return;
      }
      usuarios.unshift(u);
      renderArray(usuarios, outUsuarios);
      inputUsuario.value = '';
    });
  });