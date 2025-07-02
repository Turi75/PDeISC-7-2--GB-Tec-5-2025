// script.js
// Gestiona CZooAnimal en servidor, muestra tabla y condiciones b, c, d (todas las coincidencias en d)

// 1) Referencias DOM
const formulario      = document.getElementById('formAnimal');
const errorAnimal     = document.getElementById('errorAnimal');
const contenedorTabla = document.getElementById('vistaAnimales');
const contenedorCond  = document.getElementById('condiciones');
const botonDocWrite   = document.getElementById('btnDocumentWrite');

// 2) Al enviar el formulario, hacemos POST a /api/animales
formulario.addEventListener('submit', async e => {
  e.preventDefault();
  errorAnimal.textContent = '';

  const id       = document.getElementById('entradaId').value;
  const nombre   = document.getElementById('entradaNombre').value.trim();
  const jaula    = document.getElementById('entradaJaula').value;
  const tipo     = document.getElementById('entradaTipo').value;
  const peso     = document.getElementById('entradaPeso').value;

  if (!id || !nombre || !jaula || !tipo || !peso) {
    errorAnimal.textContent = 'Todos los campos son obligatorios.';
    return;
  }

  try {
    const resp = await fetch('/api/animales', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ id, nombre, numeroJaula: jaula, tipoAnimal: tipo, peso })
    });
    const lista = await resp.json();
    mostrarTabla(lista);
    mostrarCondiciones(lista);
  } catch {
    errorAnimal.textContent = 'Error al conectar con el servidor.';
  }
});

// 3) Dibuja la tabla HTML con todos los animales
function mostrarTabla(animales) {
  if (!animales.length) {
    contenedorTabla.innerHTML = '<p>No hay animales.</p>';
    return;
  }
  let html = '<table><thead><tr>'
           + '<th>ID</th><th>Nombre</th><th>Jaula</th>'
           + '<th>Tipo</th><th>Peso (kg)</th>'
           + '</tr></thead><tbody>';
  animales.forEach(a => {
    html += `<tr>
      <td>${a.id}</td>
      <td>${a.nombre}</td>
      <td>${a.numeroJaula}</td>
      <td>${textoTipo(a.tipoAnimal)}</td>
      <td>${a.peso}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  contenedorTabla.innerHTML = html;
}

// 4) Muestra las condiciones b, c y d (ahora d listado completo)
function mostrarCondiciones(animales) {
  // b) Jaula 5 y peso < 3kg
  const condB = animales.filter(a => a.numeroJaula === 5 && a.peso < 3).length;
  // c) Felinos (tipo=1) en jaulas 2 a 5
  const condC = animales.filter(a => a.tipoAnimal === 1 && a.numeroJaula >= 2 && a.numeroJaula <= 5).length;
  // d) **Todos** los nombres en jaula 4 con peso <120
  const listaD = animales
    .filter(a => a.numeroJaula === 4 && a.peso < 120)
    .map(a => a.nombre);
  const textoD = listaD.length ? listaD.join(', ') : 'Ninguno';

  contenedorCond.innerHTML = `
    <p>b) Cantidad en Jaula 5 con peso &lt; 3kg: <strong>${condB}</strong></p>
    <p>c) Felinos en Jaulas 2–5: <strong>${condC}</strong></p>
    <p>d) Nombre(s) en Jaula 4 con peso &lt;120kg: <strong>${textoD}</strong></p>
  `;
}

// 5) Convierte código de tipo a texto
function textoTipo(c) {
  return { '1':'Felino','2':'Ave','3':'Reptil','4':'Otro' }[c] || 'Desconocido';
}

// 6) Botón para volcar todo con document.write()
botonDocWrite.addEventListener('click', () => {
  document.write('<h1>Animales (document.write)</h1>');
  document.write(contenedorTabla.innerHTML);
  document.write('<div>' + contenedorCond.innerHTML + '</div>');
});
