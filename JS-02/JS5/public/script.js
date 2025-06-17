// script.js
// Gestiona la clase CZooAnimal, el formulario de ingreso y la visualización

// 1) Definición de la clase CZooAnimal
class CZooAnimal {
    constructor(id, nombre, numeroJaula, tipoAnimal, peso) {
      this.id = id;
      this.nombre = nombre;
      this.numeroJaula = numeroJaula;
      this.tipoAnimal = tipoAnimal;
      this.peso = peso;
    }
  }
  
  // 2) Variables y referencias al DOM
  const formulario    = document.getElementById('formAnimal');
  const errorAnimal   = document.getElementById('errorAnimal');
  const botonMostrar  = document.getElementById('btnMostrar');
  const vistaContenedor = document.getElementById('vistaAnimales');
  
  let listaAnimales = [];  // Aquí guardamos los 5 animales
  
  // 3) Evento "submit" del formulario: crea y almacena cada CZooAnimal
  formulario.addEventListener('submit', e => {
    e.preventDefault();
    errorAnimal.textContent = '';
  
    // Leemos cada campo del formulario
    const id       = parseInt(document.getElementById('entradaId').value);
    const nombre   = document.getElementById('entradaNombre').value.trim();
    const jaula    = parseInt(document.getElementById('entradaJaula').value);
    const tipo     = parseInt(document.getElementById('entradaTipo').value);
    const peso     = parseFloat(document.getElementById('entradaPeso').value);
  
    // Validaciones básicas
    if (isNaN(id) || !nombre || isNaN(jaula) || isNaN(tipo) || isNaN(peso)) {
      errorAnimal.textContent = 'Todos los campos son obligatorios y con valores válidos.';
      return;
    }
  
    // Agregamos el nuevo animal
    const animal = new CZooAnimal(id, nombre, jaula, tipo, peso);
    listaAnimales.push(animal);
  
    // Limpiamos formulario
    formulario.reset();
  
    // Si ya tenemos 5 animales, habilitamos el botón de mostrar
    if (listaAnimales.length === 5) {
      botonMostrar.disabled = false;
    }
  });
  
  // 4) Al pulsar "Mostrar con document.write()"
  botonMostrar.addEventListener('click', () => {
    // a) document.write reemplaza el documento actual
    document.write('<h1>Listado de Animales</h1>');
  
    // b) Lista simple de IDs y nombres
    document.write('<ul>');
    listaAnimales.forEach(a => {
      document.write(`<li>ID ${a.id}: ${a.nombre}</li>`);
    });
    document.write('</ul>');
  
    // c) Detalle completo
    listaAnimales.forEach(a => {
      document.write(`<p><strong>${a.nombre}</strong> (ID ${a.id})<br>`);
      document.write(`Jaula: ${a.numeroJaula}, Tipo: ${textoTipo(a.tipoAnimal)}, Peso: ${a.peso} kg</p>`);
    });
  
    // d) Tabla final
    document.write('<table>');
    document.write('<thead><tr>'
      + '<th>ID</th><th>Nombre</th><th>Jaula</th><th>Tipo</th><th>Peso</th>'
      + '</tr></thead><tbody>');
    listaAnimales.forEach(a => {
      document.write('<tr>'
        + `<td>${a.id}</td>`
        + `<td>${a.nombre}</td>`
        + `<td>${a.numeroJaula}</td>`
        + `<td>${textoTipo(a.tipoAnimal)}</td>`
        + `<td>${a.peso}</td>`
        + '</tr>');
    });
    document.write('</tbody></table>');
  });
  
  // 5) Función auxiliar para convertir el código de tipo a texto
  function textoTipo(codigo) {
    switch (codigo) {
      case 1: return 'Felino';
      case 2: return 'Ave';
      case 3: return 'Reptil';
      default: return 'Otro';
    }
  }