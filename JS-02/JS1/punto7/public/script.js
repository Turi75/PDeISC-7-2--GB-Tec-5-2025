document.addEventListener('DOMContentLoaded', () => {
    const divPalabras = document.getElementById('arrayPalabras');
    const divNumeros = document.getElementById('arrayNumeros');
    const divCiudades = document.getElementById('arrayCiudades');
    const divResultado = document.getElementById('resultado');
  
    const botonBuscarPerro = document.getElementById('buscarPerro');
    const botonBuscarCincuenta = document.getElementById('buscarCincuenta');
    const botonBuscarMadrid = document.getElementById('buscarMadrid');
  
    const palabras = ['gato', 'perro', 'loro', 'pez'];
    const numeros = [10, 20, 50, 70];
    const ciudades = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'];
  
    const mostrarArray = (elemento, array) => {
      elemento.innerHTML = '';
      array.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item;
        elemento.appendChild(div);
      });
    };
  
    const mostrarResultado = (mensaje) => {
      divResultado.innerHTML = '';
      const div = document.createElement('div');
      div.textContent = mensaje;
      divResultado.appendChild(div);
    };
  
    botonBuscarPerro.addEventListener('click', () => {
      const indice = palabras.indexOf('perro');
      if (indice !== -1) {
        mostrarResultado(`La palabra "perro" está en la posición ${indice}.`);
      } else {
        mostrarResultado('La palabra "perro" no está en el array.');
      }
    });
  
    botonBuscarCincuenta.addEventListener('click', () => {
      const indice = numeros.indexOf(50);
      if (indice !== -1) {
        mostrarResultado(`El número 50 está en la posición ${indice}.`);
      } else {
        mostrarResultado('El número 50 no se encuentra en el array.');
      }
    });
  
    botonBuscarMadrid.addEventListener('click', () => {
      const indice = ciudades.indexOf('Madrid');
      if (indice !== -1) {
        mostrarResultado(`"Madrid" se encuentra en la posición ${indice}.`);
      } else {
        mostrarResultado('La ciudad "Madrid" no está en el array.');
      }
    });
  
    // Mostrar arrays al cargar
    mostrarArray(divPalabras, palabras);
    mostrarArray(divNumeros, numeros);
    mostrarArray(divCiudades, ciudades);
  });