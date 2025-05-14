document.addEventListener('DOMContentLoaded', () => {
    const botonSaludos = document.getElementById('botonSaludos');
    const botonDobles = document.getElementById('botonDobles');
    const botonPersonas = document.getElementById('botonPersonas');
  
    const contenedorSaludos = document.getElementById('listaSaludos');
    const contenedorDobles = document.getElementById('listaDobles');
    const contenedorPersonas = document.getElementById('listaPersonas');
  
    const nombres = ['Ana', 'Luis', 'Sofía', 'Carlos'];
    const numeros = [5, 10, 20, 40];
    const personas = [
      { nombre: 'Pedro', edad: 30 },
      { nombre: 'María', edad: 25 },
      { nombre: 'Lucía', edad: 35 }
    ];
  
    const mostrarArray = (contenedor, mensajes) => {
      contenedor.innerHTML = '';
      mensajes.forEach(texto => {
        const div = document.createElement('div');
        div.textContent = texto;
        contenedor.appendChild(div);
      });
    };
  
    botonSaludos.addEventListener('click', () => {
      const saludos = [];
      nombres.forEach(nombre => {
        saludos.push(`¡Hola, ${nombre}!`);
      });
      mostrarArray(contenedorSaludos, saludos);
    });
  
    botonDobles.addEventListener('click', () => {
      const dobles = [];
      numeros.forEach(numero => {
        dobles.push(`El doble de ${numero} es ${numero * 2}`);
      });
      mostrarArray(contenedorDobles, dobles);
    });
  
    botonPersonas.addEventListener('click', () => {
      const descripciones = [];
      personas.forEach(persona => {
        descripciones.push(`${persona.nombre} tiene ${persona.edad} años.`);
      });
      mostrarArray(contenedorPersonas, descripciones);
    });
  });