// Proyecto 4 - script.js
// Crea y modifica nodos <a> dinámicamente, mostrando en pantalla cada cambio.

// Referencias a elementos del DOM
const contenedorLinks   = document.getElementById('links');
const salida            = document.getElementById('salida');
const btnGoogle         = document.getElementById('crearGoogle');
const btnFacebook       = document.getElementById('crearFacebook');
const btnTwitter        = document.getElementById('crearTwitter');
const btnGitHub         = document.getElementById('crearGitHub');
const btnYouTube        = document.getElementById('crearYouTube');
const btnModificar      = document.getElementById('modificarEnlaces');

/**
 * Crea un nuevo enlace (<a>), lo añade al contenedor y muestra mensaje.
 * @param {string} texto - Texto a mostrar en el enlace.
 * @param {string} url - URL inicial del atributo href.
 */
function crearEnlace(texto, url) {
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.textContent = texto;
  enlace.target = '_blank';
  contenedorLinks.appendChild(enlace);
  salida.textContent = `Creado <a>: texto="${texto}", href="${url}"`;
}

/**
 * Modifica el atributo href de todos los enlaces existentes,
 * cambiando sus dominios según un mapa de reemplazo, y muestra
 * dinámicamente cada reemplazo en pantalla.
 */
function modificarAtributos() {
  const reemplazos = {
    'google.com':   'bing.com',
    'facebook.com': 'instagram.com',
    'twitter.com':  'linkedin.com',
    'github.com':   'gitlab.com',
    'youtube.com':  'vimeo.com'
  };

  // Recorre cada enlace bajo el contenedor
  const enlaces = contenedorLinks.querySelectorAll('a');
  enlaces.forEach(el => {
    let hrefViejo = el.href;
    let hrefNuevo = hrefViejo;

    // Aplica cada posible reemplazo de dominio
    for (const dominio in reemplazos) {
      if (hrefNuevo.includes(dominio)) {
        hrefNuevo = hrefNuevo.replace(dominio, reemplazos[dominio]);
        break;
      }
    }

    // Si no coincidió con ningún dominio, añade parámetro
    if (hrefNuevo === hrefViejo) {
      hrefNuevo = hrefViejo + '?modificado=true';
    }

    // Actualiza atributo y muestra mensaje
    el.href = hrefNuevo;
    salida.textContent = 
      `Modificado href: "${hrefViejo}" → "${hrefNuevo}"`;
  });
}

// Asociar botones a sus funciones
btnGoogle.addEventListener('click', () => crearEnlace('Google', 'https://www.google.com'));
btnFacebook.addEventListener('click', () => crearEnlace('Facebook', 'https://www.facebook.com'));
btnTwitter.addEventListener('click', () => crearEnlace('Twitter', 'https://www.twitter.com'));
btnGitHub.addEventListener('click', () => crearEnlace('GitHub', 'https://www.github.com'));
btnYouTube.addEventListener('click', () => crearEnlace('YouTube', 'https://www.youtube.com'));
btnModificar.addEventListener('click', modificarAtributos);