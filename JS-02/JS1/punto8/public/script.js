document.addEventListener('DOMContentLoaded', () => {
    const divUsuarios = document.getElementById('arrayUsuarios');
    const divColores = document.getElementById('arrayColores');
    const divNumeros = document.getElementById('arrayNumeros');
    const divResultado = document.getElementById('resultado');
  
    const botonBuscarAdmin = document.getElementById('buscarAdmin');
    const botonBuscarVerde = document.getElementById('buscarVerde');
    const botonAgregarNumero = document.getElementById('agregarNumero');
    const entradaNumero = document.getElementById('entradaNumero');
  
    const usuarios = ['juan', 'admin', 'maria', 'lucia'];
    const colores = ['rojo', 'azul', 'amarillo'];
    const numeros = [10, 20, 30, 40];
  
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
  
    botonBuscarAdmin.addEventListener('click', () => {
      if (usuarios.includes('admin')) {
        mostrarResultado('El usuario "admin" está presente en el array.');
      } else {
        mostrarResultado('El usuario "admin" no se encuentra en el array.');
      }
    });
  
    botonBuscarVerde.addEventListener('click', () => {
      if (colores.includes('verde')) {
        mostrarResultado('El color "verde" está en el array.');
      } else {
        mostrarResultado('El color "verde" no está en el array.');
      }
    });
  
    botonAgregarNumero.addEventListener('click', () => {
      const valor = parseInt(entradaNumero.value);
      if (!isNaN(valor)) {
        if (numeros.includes(valor)) {
          mostrarResultado(`El número ${valor} ya está en el array.`);
        } else {
          numeros.push(valor);
          mostrarResultado(`El número ${valor} fue agregado.`);
          mostrarArray(divNumeros, numeros);
        }
        entradaNumero.value = '';
      }
    });
  
    // Mostrar arrays al cargar
    mostrarArray(divUsuarios, usuarios);
    mostrarArray(divColores, colores);
    mostrarArray(divNumeros, numeros);
  });