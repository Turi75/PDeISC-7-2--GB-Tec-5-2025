// script.js
// script con lo utilizado hasta el momento en js

// ==== Proyecto 1: Manipulación básica del DOM ====
let titulo1 = null;
let colorIndex1 = 0;
const colores1 = ['black', 'blue', 'red'];
function agregaH1() {
  const cont = document.getElementById('contenedor1');
  if (!titulo1) {
    titulo1 = document.createElement('h1');
    cont.appendChild(titulo1);
  }
  titulo1.textContent = 'Hola DOM';
  colorIndex1 = 0;
  titulo1.style.color = colores1[colorIndex1];
}
function cambiaTexto() {
  if (titulo1) titulo1.textContent = 'Chau DOM';
}
function cambiaColor() {
  if (titulo1) {
    colorIndex1 = (colorIndex1 + 1) % colores1.length;
    titulo1.style.color = colores1[colorIndex1];
  }
}

let img1SrcIndex = 0;
const img1Urls = [
  'https://i0.wp.com/automundo.com.ar/...GT-63-PRO.jpg',
  'https://www.romadridcar.com/...-ford-gt-1600x900.jpg'
];
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
function cambiaImagen1() {
  const img = document.getElementById('imagen1');
  if (img) {
    img1SrcIndex = (img1SrcIndex + 1) % img1Urls.length;
    img.src = img1Urls[img1SrcIndex];
  }
}
function cambiaTamano1() {
  const img = document.getElementById('imagen1');
  if (img) {
    img.style.width = img.style.width === '300px' ? '150px' : '300px';
  }
}

// ==== Proyecto 2: Eventos visuales en botones ====
function aplicaEventoVisual(btnId, evento, estilos, mensaje, resetAfterMs = 0) {
  const btn = document.getElementById(btnId);
  btn.addEventListener(evento, () => {
    Object.assign(btn.style, estilos);
    document.getElementById('salida2').textContent = mensaje;
    if (resetAfterMs) {
      setTimeout(() => {
        for (let prop in estilos) btn.style[prop] = '';
      }, resetAfterMs);
    }
  });
}

// ==== Proyecto 3: Contar hijos de un contenedor ====
function contarHijos(contenedorId, salidaId) {
  const cont = document.getElementById(contenedorId);
  const count = cont.children.length;
  document.getElementById(salidaId).textContent =
    `#${contenedorId} tiene ${count} hijos`;
}

// ==== Proyecto 4: Creación y modificación de nodos <a> ====
function crearEnlace(texto, url, contenedorId, salidaId) {
  const cont = document.getElementById(contenedorId);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.textContent = texto;
  enlace.target = '_blank';
  cont.appendChild(enlace);
  document.getElementById(salidaId).textContent =
    `Creado enlace: texto="${texto}", href="${url}"`;
}
function modificarAtributos(contenedorId, salidaId) {
  const mapa = {
    'google.com':'bing.com','facebook.com':'instagram.com',
    'twitter.com':'linkedin.com','github.com':'gitlab.com',
    'youtube.com':'vimeo.com'
  };
  const cont = document.getElementById(contenedorId);
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
    document.getElementById(salidaId).textContent =
      `Modificado href: "${viejo}" → "${nuevo}"`;
  });
}

// ==== Proyecto 5: innerHTML dinámico ====
function agregaParrafo(contenedorId) {
  document.getElementById(contenedorId).innerHTML +=
    `<p>Nuevo párrafo dinámico.</p>`;
}
function agregaLista(contenedorId) {
  document.getElementById(contenedorId).innerHTML += `
    <ul><li>Ítem 1</li><li>Ítem 2</li><li>Ítem 3</li></ul>`;
}
function agregaImagen2(contenedorId) {
  document.getElementById(contenedorId).innerHTML +=
    `<img src="https://via.placeholder.com/150" alt="Dinámico">`;
}
function agregaTarjeta(contenedorId) {
  document.getElementById(contenedorId).innerHTML += `
    <div style="border:1px solid #ccc;padding:10px;margin:10px 0;">
      <h3>Título</h3><p>Contenido dinámico.</p>
    </div>`;
}
function agregaFormulario2(contenedorId) {
  document.getElementById(contenedorId).innerHTML += `
    <form style="margin:10px 0;">
      <label>Nombre: <input type="text"></label>
      <button type="submit">OK</button>
    </form>`;
}

// ==== Proyecto 6: Gestión genérica de formularios (initForm) ====
function initForm(formId, listaId, endpoint) {
  const form = document.getElementById(formId);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form).entries());
    // validación y captura de checkboxes si las hubiera
    fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(datos)
    }).then(() => form.reset())
      .catch(console.error);
  });
}

// ==== Proyecto actual: Formulario con requerimientos especificos ====
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar ejemplos de proyectos anteriores si existen
  // Proyecto 2
  ['btnClick','btnDblClick','btnHover','btnDown','btnUp'].forEach(id => {
    // Sólo si existe el botón
    if (document.getElementById(id)) {
      let cfg = {
        btnClick:      ['click', {backgroundColor:'blue',color:'white'}, 'Evento: click',0],
        btnDblClick:   ['dblclick', {backgroundColor:'red',color:'white'}, 'Evento: doble click',0],
        btnHover:      ['mouseover', {backgroundColor:'yellow',color:'black'}, 'Evento: hover',3000],
        btnDown:       ['mousedown', {backgroundColor:'green',transform:'scale(0.9)'}, 'Evento: mousedown',0],
        btnUp:         ['mouseup', {backgroundColor:'violet',transform:'rotate(10deg)'}, 'Evento: mouseup',200]
      }[id];
      aplicaEventoVisual(id, cfg[0], cfg[1], cfg[2], cfg[3]);
    }
  });
  // Proyecto 3
  if (document.getElementById('btnContar')) {
    document.getElementById('btnContar')
      .addEventListener('click', ()=> contarHijos('contenedor2','salida3'));
  }
  // Proyecto 4
  ['crearGoogle','crearFacebook','crearTwitter','crearGitHub','crearYouTube']
    .forEach((id,idx) => {
      const info = [
        ['Google','https://www.google.com'],
        ['Facebook','https://www.facebook.com'],
        ['Twitter','https://www.twitter.com'],
        ['GitHub','https://www.github.com'],
        ['YouTube','https://www.youtube.com']
      ][idx];
      if (document.getElementById(id)) {
        document.getElementById(id).onclick = ()=> crearEnlace(info[0],info[1],'links4','salida4');
      }
    });
  if (document.getElementById('modificarEnlaces')) {
    document.getElementById('modificarEnlaces')
      .onclick = ()=> modificarAtributos('links4','salida4');
  }
  // Proyecto 5
  if (document.getElementById('btnParrafo'))
    document.getElementById('btnParrafo').onclick    = ()=> agregaParrafo('contenedor5');
  if (document.getElementById('btnLista'))
    document.getElementById('btnLista').onclick      = ()=> agregaLista('contenedor5');
  if (document.getElementById('btnImagen'))
    document.getElementById('btnImagen').onclick     = ()=> agregaImagen2('contenedor5');
  if (document.getElementById('btnTarjeta'))
    document.getElementById('btnTarjeta').onclick    = ()=> agregaTarjeta('contenedor5');
  if (document.getElementById('btnFormulario'))
    document.getElementById('btnFormulario').onclick = ()=> agregaFormulario2('contenedor5');
  // Proyecto 6 (genérico) - ejemplo
  if (document.getElementById('formRegistro'))
    initForm('formRegistro','listaCampos','/registro');

  // ---- Formulario de Personas 30 / 04 / 25----
  const form = document.getElementById('formPersona');
  const ul   = document.getElementById('listaPersonas');
  const msgE = document.getElementById('msgExito');
  const msgR = document.getElementById('msgError');
  const errs = {
    nombre:        document.getElementById('err-nombre'),
    apellido:      document.getElementById('err-apellido'),
    edad:          document.getElementById('err-edad'),
    nacimiento:    document.getElementById('err-nacimiento'),
    sexo:          document.getElementById('err-sexo'),
    documento:     document.getElementById('err-documento'),
    estadoCivil:   document.getElementById('err-estadoCivil'),
    nacionalidad:  document.getElementById('err-nacionalidad'),
    telefono:      document.getElementById('err-telefono'),
    email:         document.getElementById('err-email'),
    tieneHijos:    document.getElementById('err-tieneHijos'),
    cantidadHijos: document.getElementById('err-cantidadHijos'),
  };
  const inpHijos    = document.getElementById('cantidadHijos');
  const radiosHijos = document.getElementsByName('tieneHijos');
  radiosHijos.forEach(r => {
    r.addEventListener('change', () => {
      if (r.value === 'si' && r.checked) {
        inpHijos.disabled = false;
      } else if (r.value === 'no' && r.checked) {
        inpHijos.disabled = true;
        inpHijos.value = '';
        errs.cantidadHijos.textContent = '';
      }
      errs.tieneHijos.textContent = '';
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    Object.values(errs).forEach(s => s.textContent = '');
    msgE.style.opacity = '0';
    msgR.style.opacity = '0';

    const data = {
      nombre:       form.nombre.value.trim(),
      apellido:     form.apellido.value.trim(),
      edad:         form.edad.value,
      nacimiento:   form.nacimiento.value,
      sexo:         (form.querySelector('input[name="sexo"]:checked')||{}).value || '',
      documento:    form.documento.value.trim(),
      estadoCivil:  form.estadoCivil.value,
      nacionalidad: form.nacionalidad.value.trim(),
      telefono:     form.telefono.value.trim(),
      email:        form.email.value.trim(),
      tieneHijos:   (form.querySelector('input[name="tieneHijos"]:checked')||{}).value || '',
      cantidadHijos: inpHijos.value
    };

    let ok = true;
    ['nombre','apellido','edad','nacimiento','documento',
     'estadoCivil','nacionalidad','telefono','email']
      .forEach(key => {
        if (!data[key]) {
          errs[key].textContent = 'Campo obligatorio';
          ok = false;
        }
      });
    if (!data.sexo) {
      errs.sexo.textContent = 'Selecciona una opción';
      ok = false;
    }
    if (!data.tieneHijos) {
      errs.tieneHijos.textContent = 'Selecciona Sí o No';
      ok = false;
    }
    if (data.tieneHijos === 'si' && (!data.cantidadHijos||data.cantidadHijos<1)) {
      errs.cantidadHijos.textContent = 'Indica cuántos hijos';
      ok = false;
    }
    if (!ok) {
      msgR.style.opacity = '1';
      return;
    }

    try {
      const res = await fetch('/enviar', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error();
      const persona = await res.json();

      const li = document.createElement('li');
      li.textContent = `${persona.nombre} ${persona.apellido}`;
      ul.appendChild(li);

      msgE.style.opacity = '1';
      form.reset();
      inpHijos.disabled = true;
      form.nombre.focus();
    } catch {
      msgR.style.opacity = '1';
    }
  });
});