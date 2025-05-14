document.addEventListener('DOMContentLoaded', () => {
    const arregloDiv = document.getElementById('arreglo');
    const botonEliminar = document.getElementById('eliminarLetras');
    const formularioInsertar = document.getElementById('formularioInsertar');
    const nuevoNombreInput = document.getElementById('nuevoNombre');
    const errorInsertar = document.getElementById('errorInsertar');
    const formularioReemplazar = document.getElementById('formularioReemplazar');
    const inicioReemplazo = document.getElementById('inicioReemplazo');
    const nuevo1 = document.getElementById('nuevo1');
    const nuevo2 = document.getElementById('nuevo2');
  
    let letras = ['A', 'B', 'C', 'D', 'E'];
  
    const mostrarArreglo = () => {
      arregloDiv.innerHTML = '';
      letras.forEach(letra => {
        const div = document.createElement('div');
        div.textContent = letra;
        arregloDiv.appendChild(div);
      });
    };
  
    botonEliminar.addEventListener('click', () => {
      letras.splice(1, 2); // Elimina 2 desde la posición 1
      mostrarArreglo();
    });
  
    formularioInsertar.addEventListener('submit', (e) => {
      e.preventDefault();
      const nuevoNombre = nuevoNombreInput.value.trim();
      if (nuevoNombre === '') {
        errorInsertar.textContent = 'Ingrese un nombre válido';
        return;
      }
      letras.splice(1, 0, nuevoNombre); // Inserta en la posición 1 sin eliminar
      nuevoNombreInput.value = '';
      errorInsertar.textContent = '';
      mostrarArreglo();
    });
  
    formularioReemplazar.addEventListener('submit', (e) => {
      e.preventDefault();
      const posicion = parseInt(inicioReemplazo.value);
      const reemplazo1 = nuevo1.value.trim();
      const reemplazo2 = nuevo2.value.trim();
  
      if (isNaN(posicion) || posicion < 0 || posicion >= letras.length) {
        alert('Posición no válida');
        return;
      }
  
      letras.splice(posicion, 2, reemplazo1, reemplazo2); // Reemplaza 2 desde posición
      mostrarArreglo();
    });
  
    mostrarArreglo();
  });