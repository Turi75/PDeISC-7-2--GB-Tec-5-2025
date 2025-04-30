// Proyecto 2 - script.js
// Eventos con cambios visuales sobre cada botón:

// Referencias
const salida      = document.getElementById('salida');
const btnClick    = document.getElementById('btnClick');
const btnDblClick = document.getElementById('btnDblClick');
const btnHover    = document.getElementById('btnHover');
const btnDown     = document.getElementById('btnDown');
const btnUp       = document.getElementById('btnUp');

// Función para actualizar mensaje
function mostrar(texto) {
  salida.textContent = texto;
}

// creo el evento click y le agrego cambios visuales
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

// creo el evento y le agrego cambios visuales,
//    y tras 3 segundos sin volver a entrar se restablece.
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

// creo el evento mouse up, le doy un color
btnDown.addEventListener('mouseup', () => {
  btnDown.style.transform = '';
  btnDown.style.backgroundColor = 'orange';
});

// mouse up rota 10°, fondo violeta, y regresa luego de 200 ms
btnUp.addEventListener('mouseup', () => {
  btnUp.style.backgroundColor = 'violet';
  btnUp.style.transform = 'rotate(10deg)';
  mostrar('Evento: mouseup');
  setTimeout(() => {
    btnUp.style.transform = '';
  }, 200);
});