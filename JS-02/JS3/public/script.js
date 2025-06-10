// script.js
// Proyecto: Ingreso y filtrado de números desde formulario y archivo .txt
// Funciones: Agregar números, guardarlos, leer archivo, filtrar y descargar resultados

document.addEventListener('DOMContentLoaded', () => {
    // === SECCIÓN 1: INGRESO DE NÚMEROS DESDE INPUT ===
  
    // Elementos del DOM relacionados con la carga de números
    const entradaNumero      = document.getElementById('entradaNumero');
    const botonAgregar       = document.getElementById('botonAgregar');
    const errorAgregar       = document.getElementById('errorAgregar');
    const listaNumeros       = document.getElementById('listaNumeros');
    const botonDescOrig      = document.getElementById('botonDescargarOriginal');
  
    // Array que almacenará los números ingresados por el usuario
    let numeros = [];
  
    // Al presionar "Agregar", valida y añade el número al array
    botonAgregar.addEventListener('click', () => {
      errorAgregar.textContent = '';
      const val = parseInt(entradaNumero.value);
  
      // Verifica que sea un número válido
      if (isNaN(val)) {
        errorAgregar.textContent = 'Número inválido.';
        return;
      }
  
      // Límite de 20 números
      if (numeros.length >= 20) {
        errorAgregar.textContent = 'Límite 20 números.';
        return;
      }
  
      // Agrega y limpia input
      numeros.push(val);
      entradaNumero.value = '';
      renderArray(numeros, listaNumeros);
  
      // Muestra botón de descarga si ya hay 10
      if (numeros.length >= 10) {
        botonDescOrig.style.display = 'inline-block';
      }
    });
  
    // Descarga el array original como archivo .txt
    botonDescOrig.addEventListener('click', () => {
      descargaTXT(numeros, 'numeros.txt');
    });
  
    // === SECCIÓN 2: FILTRADO DESDE ARCHIVO TXT ===
  
    // Elementos del DOM relacionados con archivo de entrada
    const entradaArchivo      = document.getElementById('entradaArchivo');
    const errorArchivo        = document.getElementById('errorArchivo');
    const botonFiltrar        = document.getElementById('botonFiltrar');
    const listaFiltrados      = document.getElementById('listaFiltrados');
    const resumen             = document.getElementById('resumen');
    const cantUtiles          = document.getElementById('cantUtiles');
    const cantNoUtiles        = document.getElementById('cantNoUtiles');
    const porcentajeUtiles    = document.getElementById('porcentajeUtiles');
    const botonDescFiltrados  = document.getElementById('botonDescargarFiltrados');
  
    // Array con los números útiles filtrados del archivo
    let filtrados = [];
  
    // Muestra botón "Filtrar" al seleccionar archivo
    entradaArchivo.addEventListener('change', () => {
      errorArchivo.textContent = '';
      if (entradaArchivo.files.length) {
        botonFiltrar.style.display = 'inline-block';
      }
    });
  
    // Al presionar "Filtrar", analiza el contenido del archivo
    botonFiltrar.addEventListener('click', () => {
      errorArchivo.textContent = '';
      filtrados = [];
  
      const archivo = entradaArchivo.files[0];
      if (!archivo) {
        errorArchivo.textContent = 'Selecciona un archivo.';
        return;
      }
  
      // Lee el archivo de texto
      const reader = new FileReader();
      reader.onload = e => {
        const texto = e.target.result;
  
        // Convierte el texto en array de números
        const todos  = texto
          .split(/[\s,]+/)           // Separa por espacios o comas
          .map(s => s.trim())        // Elimina espacios
          .map(Number)               // Convierte a número
          .filter(n => !isNaN(n));   // Filtra inválidos
  
        // Filtra los que empiezan y terminan con el mismo dígito
        const utiles = todos
          .filter(n => {
            const s = n.toString();
            return s[0] === s[s.length - 1];
          })
          .sort((a,b) => a - b); // Orden ascendente
  
        // Guarda y muestra resultados
        filtrados = utiles;
        renderArray(utiles, listaFiltrados);
  
        const total = todos.length;
        const u     = utiles.length;
        const nu    = total - u;
  
        // Muestra resumen de cantidad y porcentaje
        cantUtiles.textContent       = u;
        cantNoUtiles.textContent     = nu;
        porcentajeUtiles.textContent = total ? ((u/total)*100).toFixed(2) : '0';
  
        resumen.style.display        = 'block';
        botonDescFiltrados.style.display = 'inline-block';
      };
  
      // Ejecuta la lectura del archivo
      reader.readAsText(archivo);
    });
  
    // Descarga el resultado del filtrado como nuevo archivo .txt
    botonDescFiltrados.addEventListener('click', () => {
      descargaTXT(filtrados, 'filtrados.txt');
    });
  
    // === FUNCIONES AUXILIARES ===
  
    // Muestra un array en forma de tarjetas dentro de un contenedor
    function renderArray(arr, cont) {
      cont.innerHTML = arr.map(x => `<div>${x}</div>`).join('');
    }
  
    // Descarga un array de números como archivo .txt
    function descargaTXT(arr, nombre) {
      const blob = new Blob([arr.join(',')], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = nombre;
      a.click();
      URL.revokeObjectURL(url);
    }
  });