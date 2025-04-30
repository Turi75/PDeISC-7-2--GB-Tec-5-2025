// Proyecto 5 - script.js
// uso de innerHTML para añadir distintos objetos HTML al contenedor.

// referencia al contenedor
const contenedor = document.getElementById('contenedor');

// botones
const btnParrafo    = document.getElementById('btnParrafo');
const btnLista      = document.getElementById('btnLista');
const btnImagen     = document.getElementById('btnImagen');
const btnTarjeta    = document.getElementById('btnTarjeta');
const btnFormulario = document.getElementById('btnFormulario');

/*
  agrega un párrafo simple al contenedor.
 */
function agregarParrafo() {
  contenedor.innerHTML +=
    `<p>Este es un nuevo párrafo generado dinámicamente.</p>`;
}

/*
  agrega una lista desordenada con tres elementos al contenedor.
 */
function agregarLista() {
  contenedor.innerHTML += `
    <ul>
      <li>Elemento 1</li>
      <li>Elemento 2</li>
      <li>Elemento 3</li>
    </ul>`;
}

/*
  agrega una imagen que se escala para no salir del contenedor.
 */
function agregarImagen() {
  contenedor.innerHTML +=
    `<img src="https://rsrbooking.com/storage/cars/kQ5QMHvm1s6OKHKy7c7vyTTS4QkenqNmAQHvmXB3.jpg"
           alt="Imagen dinámica">`;
}

/*
  agrega una "tarjeta" (div con título y texto) al contenedor.
 */
function agregarTarjeta() {
  contenedor.innerHTML += `
    <div style="
      border:1px solid #ccc;
      border-radius:4px;
      padding:10px;
      margin:10px 0;
      background:#fafafa;">
      <h3>Título de Tarjeta</h3>
      <p>Contenido de la tarjeta generado dinámicamente.</p>
    </div>`;
}

/*
  agrega un pequeño formulario con campo de texto y botón.
 */
function agregarFormulario() {
  contenedor.innerHTML += `
    <form style="margin:10px 0;">
      <label>Nombre:
        <input type="text" placeholder="Ingresa tu nombre">
      </label>
      <button type="submit">Enviar</button>
    </form>`;
}

// asignación de eventos
btnParrafo.addEventListener('click',    agregarParrafo);
btnLista.addEventListener('click',      agregarLista);
btnImagen.addEventListener('click',     agregarImagen);
btnTarjeta.addEventListener('click',    agregarTarjeta);
btnFormulario.addEventListener('click', agregarFormulario);