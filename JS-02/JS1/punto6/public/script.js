document.addEventListener('DOMContentLoaded', () => {
    const divArrayNumeros = document.getElementById('arrayNumeros');
    const divArrayPeliculas = document.getElementById('arrayPeliculas');
    const divResultado = document.getElementById('resultado');
  
    const botonCopiarNumeros = document.getElementById('copiarNumeros');
    const botonCopiarPeliculas = document.getElementById('copiarPeliculas');
    const botonUltimosNumeros = document.getElementById('ultimosNumeros');
  
    const numeros = [10, 20, 30, 40, 50, 60];
    const peliculas = ['Matrix', 'Gladiador', 'Avatar', 'Titanic', 'Inception'];
  
    const mostrarArray = (elementoHTML, array) => {
      elementoHTML.innerHTML = '';
      array.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item;
        elementoHTML.appendChild(div);
      });
    };
  
    const mostrarResultado = (resultado) => {
      divResultado.innerHTML = '';
      resultado.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item;
        divResultado.appendChild(div);
      });
    };
  
    botonCopiarNumeros.addEventListener('click', () => {
      const copia = numeros.slice(0, 3); // Copia primeros 3
      mostrarResultado(copia);
    });
  
    botonCopiarPeliculas.addEventListener('click', () => {
      const copia = peliculas.slice(2, 5); // De posición 2 a 4 (índice 5 exclusivo)
      mostrarResultado(copia);
    });
  
    botonUltimosNumeros.addEventListener('click', () => {
      const copia = numeros.slice(-3); // Últimos 3 sin modificar original
      mostrarResultado(copia);
    });
  
    // Mostrar originales al iniciar
    mostrarArray(divArrayNumeros, numeros);
    mostrarArray(divArrayPeliculas, peliculas);
  });