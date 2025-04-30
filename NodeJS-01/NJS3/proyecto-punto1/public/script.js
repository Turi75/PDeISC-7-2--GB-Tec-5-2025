// script para hacer las funciones de los botones con todos los requerimientos

let titulo = null;
let colorIndex = 0;
const colores = ['black', 'blue', 'red'];

let imageIndex = 0;
const imageUrls = [
  'https://cdn.motor1.com/images/mgl/zxp4P6/s3/2022-ford-gt-lm-edition.jpg',
  'https://vehicle-images.dealerinspire.com/e0a4-110012062/W1KRJ7JBXSF003880/8f9a5edbd59dfd6277242e2eed4e1c51.jpg'
];

/**
 * Agrega o restablece el título H1 con texto "Hola DOM" y color inicial.
 */
function agregarH1() {
  const cont = document.getElementById('contenedor');
  if (!titulo) {
    titulo = document.createElement('h1');
    cont.appendChild(titulo);
  }
  titulo.textContent = 'Hola DOM';
  colorIndex = 0;
  titulo.style.color = colores[colorIndex];
}

/**
 * Cambia el texto del H1 a "Chau DOM".
 */
function cambiarTexto() {
  if (titulo) {
    titulo.textContent = 'Chau DOM';
  }
}

/**
 * Cicla el color del H1 entre negro, azul y rojo.
 */
function cambiarColor() {
  if (titulo) {
    colorIndex = (colorIndex + 1) % colores.length;
    titulo.style.color = colores[colorIndex];
  }
}

/**
 * añade la primera imagen y la dimensiona inicialmente a 150px.
 */
function agregarImagen() {
  const img = document.getElementById('imagen');
  imageIndex = 0;
  img.src = imageUrls[imageIndex];
  img.style.width = '150px';
}

/**
 * cambia entre las dos imágenes definidas en imageUrls.
 */
function cambiarImagen() {
  const img = document.getElementById('imagen');
  if (img.src) {
    imageIndex = (imageIndex + 1) % imageUrls.length;
    img.src = imageUrls[imageIndex];
  }
}

/**
 * Alterna el ancho de la imagen entre 150px y 300px.
 */
function cambiarTamano() {
  const img = document.getElementById('imagen');
  img.style.width = img.style.width === '600px' ? '250px' : '600px';
}