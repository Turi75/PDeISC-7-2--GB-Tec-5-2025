// script.js
// Consolida todas las funciones DHTML y de manejo de formularios de proyectos anteriores,
// más el ejercicio actual de push(), en un único archivo extensible.

/* =========================================================================
   PROYECTO 1: Manipulación básica del DOM
   ========================================================================= */

// Variables para Proyecto 1
let titulo1 = null;
let colorIndex1 = 0;
const colores1 = ['black', 'blue', 'red'];

/**
 * agregaH1()
 * Crea un <h1 id="titulo1"> con texto "Hola DOM" y lo añade al contenedor1.
 * Reinicia el color a negro.
 */
function agregaH1() {
  const cont = document.getElementById('contenedor1');
  if (!titulo1) {
    titulo1 = document.createElement('h1');
    titulo1.id = 'titulo1';
    cont.appendChild(titulo1);
  }
  titulo1.textContent = 'Hola DOM';
  colorIndex1 = 0;
  titulo1.style.color = colores1[colorIndex1];
}

/**
 * cambiaTexto()
 * Si ya existe el <h1>, cambia su texto a "Chau DOM".
 */
function cambiaTexto() {
  if (titulo1) {
    titulo1.textContent = 'Chau DOM';
  }
}

/**
 * cambiaColor()
 * Cicla el color del <h1> entre negro, azul y rojo.
 */
function cambiaColor() {
  if (titulo1) {
    colorIndex1 = (colorIndex1 + 1) % colores1.length;
    titulo1.style.color = colores1[colorIndex1];
  }
}

// Variables para la imagen de Proyecto 1
let img1SrcIndex = 0;
const img1Urls = [
  'https://i0.wp.com/automundo.com.ar/...GT-63-PRO.jpg',
  'https://www.romadridcar.com/...-ford-gt-1600x900.jpg'
];

/**
 * agregaImagen()
 * Inserta una imagen inicial de la lista img1Urls en contenedor1.
 */
function agregaImagen() {
  let img = document.getElementById('imagen1');
  if (!img) {
    img = document.createElement('img');
    img.id = 'imagen1';
    img.style.width = '150px';
    document.getElementById('contenedor1').appendChild(img);
  }
  img.src = img1Urls[img1SrcIndex];
}

/**
 * cambiaImagen1()
 * Alterna entre las URLs definidas en img1Urls.
 */
function cambiaImagen1() {
  const img = document.getElementById('imagen1');
  if (img) {
    img1SrcIndex = (img1SrcIndex + 1) % img1Urls.length;
    img.src = img1Urls[img1SrcIndex];
  }
}

/**
 * cambiaTamano1()
 * Alterna el ancho de la imagen entre 150px y 300px.
 */
function cambiaTamano1() {
  const img = document.getElementById('imagen1');
  if (img) {
    img.style.width = img.style.width === '300px' ? '150px' : '300px';
  }
}

/* =========================================================================
   PROYECTO 2: Eventos visuales en botones
   ========================================================================= */

/**
 * aplicaEventoVisual(btnId, evento, estilos, mensaje, resetAfterMs)
 * Añade un listener al botón identificado por btnId para aplicar estilos
 * al ocurrir el evento y mostrar un mensaje en salida2. Opcionalmente revierte
 * los estilos tras resetAfterMs milisegundos.
 */
function aplicaEventoVisual(btnId, evento, estilos, mensaje, resetAfterMs = 0) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener(evento, () => {
    Object.assign(btn.style, estilos);
    const salida = document.getElementById('salida2');
    if (salida) salida.textContent = mensaje;
    if (resetAfterMs) {
      setTimeout(() => {
        for (let prop in estilos) {
          btn.style[prop] = '';
        }
      }, resetAfterMs);
    }
  });
}

/* =========================================================================
   PROYECTO 3: Contar hijos de un contenedor
   ========================================================================= */

/**
 * contarHijos(contenedorId, salidaId)
 * Cuenta el número de hijos directos de un elemento y lo muestra en salidaId.
 */
function contarHijos(contenedorId, salidaId) {
  const cont = document.getElementById(contenedorId);
  const salida = document.getElementById(salidaId);
  if (cont && salida) {
    const count = cont.children.length;
    salida.textContent = `#${contenedorId} tiene ${count} hijos`;
  }
}

/* =========================================================================
   PROYECTO 4: Creación y modificación de enlaces
   ========================================================================= */

/**
 * crearEnlace(texto, url, contenedorId, salidaId)
 * Crea un <a> con texto y href dados, lo añade a contenedorId, y muestra
 * en salidaId el detalle del enlace creado.
 */
function crearEnlace(texto, url, contenedorId, salidaId) {
  const cont = document.getElementById(contenedorId);
  const salida = document.getElementById(salidaId);
  if (!cont || !salida) return;
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.textContent = texto;
  enlace.target = '_blank';
  cont.appendChild(enlace);
  salida.textContent = `Creado enlace: texto="${texto}", href="${url}"`;
}

/**
 * modificarAtributos(contenedorId, salidaId)
 * Sustituye el dominio de cada enlace en contenedorId según un mapa
 * y muestra cada modificación en salidaId.
 */
function modificarAtributos(contenedorId, salidaId) {
  const mapa = {
    'google.com': 'bing.com',
    'facebook.com': 'instagram.com',
    'twitter.com': 'linkedin.com',
    'github.com': 'gitlab.com',
    'youtube.com': 'vimeo.com'
  };
  const cont = document.getElementById(contenedorId);
  const salida = document.getElementById(salidaId);
  if (!cont || !salida) return;
  cont.querySelectorAll('a').forEach(el => {
    const viejo = el.href;
    let nuevo = viejo;
    for (let dom in mapa) {
      if (nuevo.includes(dom)) {
        nuevo = nuevo.replace(dom, mapa[dom]);
        break;
      }
    }
    if (nuevo === viejo) nuevo = viejo + '?mod=true';
    el.href = nuevo;
    salida.textContent = `Modificado href: "${viejo}" → "${nuevo}"`;
  });
}

/* =========================================================================
   PROYECTO 5: innerHTML dinámico
   ========================================================================= */

/**
 * agregaParrafo(contenedorId)
 * Añade un párrafo dinámicamente al contenedor.
 */
function agregaParrafo(contenedorId) {
  const cont = document.getElementById(contenedorId);
  if (cont) {
    cont.innerHTML += `<p>Nuevo párrafo dinámico.</p>`;
  }
}

/**
 * agregaLista(contenedorId)
 * Añade una lista <ul> con tres ítems al contenedor.
 */
function agregaLista(contenedorId) {
  const cont = document.getElementById(contenedorId);
  if (cont) {
    cont.innerHTML += `
      <ul>
        <li>Ítem 1</li>
        <li>Ítem 2</li>
        <li>Ítem 3</li>
      </ul>`;
  }
}

/**
 * agregaImagen2(contenedorId)
 * Inserta una imagen dinámica de placeholder al contenedor.
 */
function agregaImagen2(contenedorId) {
  const cont = document.getElementById(contenedorId);
  if (cont) {
    cont.innerHTML += `<img src="https://via.placeholder.com/150" alt="Dinámico">`;
  }
}

/**
 * agregaTarjeta(contenedorId)
 * Agrega una "card" simple con título y párrafo.
 */
function agregaTarjeta(contenedorId) {
  const cont = document.getElementById(contenedorId);
  if (cont) {
    cont.innerHTML += `
      <div style="border:1px solid #ccc;padding:10px;margin:10px 0;">
        <h3>Título</h3>
        <p>Contenido dinámico.</p>
      </div>`;
  }
}

/**
 * agregaFormulario2(contenedorId)
 * Inserta un formulario simple al contenedor.
 */
function agregaFormulario2(contenedorId) {
  const cont = document.getElementById(contenedorId);
  if (cont) {
    cont.innerHTML += `
      <form style="margin:10px 0;">
        <label>Nombre: <input type="text"></label>
        <button type="submit">OK</button>
      </form>`;
  }
}

/* =========================================================================
   PROYECTO 6: Integración genérica de formularios
   ========================================================================= */

/**
 * initForm(formId, listaId, endpoint)
 * Vincula envíos de formulario a una llamada fetch a 'endpoint',
 * muestra datos y resetea.
 */
function initForm(formId, listaId, endpoint) {
  const form = document.getElementById(formId);
  const ul   = document.getElementById(listaId);
  if (!form || !ul) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form).entries());
    // Envío a API (no hay /registro en este ejemplo, pero sirve de plantilla)
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
      .then(() => {
        // Añade un <li> con un campo (ejemplo: nombre)
        if (datos.nombre) {
          const li = document.createElement('li');
          li.textContent = datos.nombre;
          ul.appendChild(li);
        }
        form.reset();
      })
      .catch(console.error);
  });
}

/* =========================================================================
   NUEVO EJERCICIO: push() con mensajes inline de error
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Arrays para el ejercicio de push()
  let frutas = [];
  let amigos = [];
  let numeros = [5, 10, 15];

  // Referencias a elementos del DOM
  const outFrutas  = document.getElementById('outFrutas');
  const outAmigos  = document.getElementById('outAmigos');
  const outNumeros = document.getElementById('outNumeros');
  const errAmigos  = document.getElementById('err-amigos');
  const errNumero  = document.getElementById('err-nuevoNumero');

  // Mostrar lista inicial de números
  if (outNumeros) {
    outNumeros.innerHTML = numeros.map(n => `<div>${n}</div>`).join('');
  }

  // 1) Push Frutas
  const btnPushFrutas = document.getElementById('btnPushFrutas');
  if (btnPushFrutas) {
    btnPushFrutas.addEventListener('click', () => {
      frutas = [];
      frutas.push('Manzana', 'Banana', 'Cereza');
      if (outFrutas) {
        outFrutas.innerHTML = frutas.map(f => `<div>${f}</div>`).join('');
      }
    });
  }

  // 2) Push Amigos sin alert()
  const btnPushAmigos = document.getElementById('btnPushAmigos');
  if (btnPushAmigos) {
    btnPushAmigos.addEventListener('click', () => {
      errAmigos.textContent = '';
      const a1 = document.getElementById('amigo1')?.value.trim() || '';
      const a2 = document.getElementById('amigo2')?.value.trim() || '';
      const a3 = document.getElementById('amigo3')?.value.trim() || '';
      if (!a1 || !a2 || !a3) {
        errAmigos.textContent = 'Por favor rellena los tres campos de amigos.';
        return;
      }
      amigos.push(a1, a2, a3);
      if (outAmigos) {
        outAmigos.innerHTML = amigos.map(a => `<div>${a}</div>`).join('');
      }
      // Limpiar inputs
      document.getElementById('amigo1').value =
      document.getElementById('amigo2').value =
      document.getElementById('amigo3').value = '';
    });
  }

  // 3) Push Número condicional sin alert()
  const btnPushNumero = document.getElementById('btnPushNumero');
  if (btnPushNumero) {
    btnPushNumero.addEventListener('click', () => {
      errNumero.textContent = '';
      const val = parseFloat(document.getElementById('nuevoNumero')?.value);
      if (isNaN(val)) {
        errNumero.textContent = 'Ingresa un número válido.';
        return;
      }
      const ultimo = numeros[numeros.length - 1];
      if (val > ultimo) {
        numeros.push(val);
        if (outNumeros) {
          outNumeros.innerHTML = numeros.map(n => `<div>${n}</div>`).join('');
        }
        document.getElementById('nuevoNumero').value = '';
      } else {
        errNumero.textContent = `El número debe ser > ${ultimo}`;
      }
    });
  }

  /* 
    Aquí podrías inicializar proyectos anteriores, p.ej.:
    aplicaEventoVisual('btnClick', 'click', {...}, 'Evento click');
    contarHijos('contenedor2','salida3');
    initForm('formRegistro','listaCampos','/registro');
    etc.
  */
});
