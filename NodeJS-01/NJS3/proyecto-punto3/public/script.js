// Proyecto 3 - script.js
// Extiende Proyecto 2 y añade conteo de hijos.

// Referencias
const salida      = document.getElementById('salida');
const btnClick    = document.getElementById('btnClick');
const btnDblClick = document.getElementById('btnDblClick');
const btnHover    = document.getElementById('btnHover');
const btnDown     = document.getElementById('btnDown');
const btnUp       = document.getElementById('btnUp');
const btnContar   = document.getElementById('btnContar');
const contenedor  = document.getElementById('contenedor');

// Función para actualizar mensaje
function mostrar(texto) {
  salida.textContent = texto;
}

// creo el evento de click y le agrego cambios visuales
btnClick.addEventListener('click', () => {
  btnClick.style.backgroundColor = 'blue';
  btnClick.style.color = 'white';
  mostrar('Evento: click');
});

// creo el evento doble click y le agrego cambios visuales
btnDblClick.addEventListener('dblclick', () => {
  btnDblClick.style.backgroundColor = 'red';
  btnDblClick.style.color = 'white';
  mostrar('Evento: doble click');
});

// creo el evento hover y le agrego cambios visuales, luego de 3s vuelve al original
let hoverTimer = null;
btnHover.addEventListener('mouseover', () => {
  clearTimeout(hoverTimer);
  btnHover.style.backgroundColor = 'yellow';
  btnHover.style.color = 'black';
  mostrar('Evento: hover');
  hoverTimer = setTimeout(() => {
    btnHover.style.backgroundColor = '';
    btnHover.style.color = '';
  }, 3000);
});

// creo el evento mouse down y le agrego cambios visuales
btnDown.addEventListener('mousedown', () => {
  btnDown.style.backgroundColor = 'green';
  btnDown.style.transform = 'scale(0.9)';
  mostrar('Evento: mousedown');
});
btnDown.addEventListener('mouseup', () => {
  btnDown.style.transform = '';
  btnDown.style.backgroundColor = 'orange';
});

// creo el evento mouse up y le agrego cambios visuales
btnUp.addEventListener('mouseup', () => {
  btnUp.style.backgroundColor = 'violet';
  btnUp.style.transform = 'rotate(10deg)';
  mostrar('Evento: mouseup');
  setTimeout(() => {
    btnUp.style.transform = '';
  }, 200);
});

// acá muestra cuántos elementos hijo tiene #contenedor al hacer click en el botón
btnContar.addEventListener('click', () => {
  const cantidad = contenedor.children.length;
  mostrar(`#contenedor tiene ${cantidad} hijos`);
});