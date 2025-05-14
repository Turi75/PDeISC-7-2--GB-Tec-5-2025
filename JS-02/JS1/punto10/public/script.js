document.addEventListener('DOMContentLoaded', () => {
    const botonMultiplicar = document.getElementById('botonMultiplicar');
    const botonMayusculas = document.getElementById('botonMayusculas');
    const botonIVA = document.getElementById('botonIVA');
  
    const contenedorMultiplicados = document.getElementById('listaMultiplicados');
    const contenedorMayusculas = document.getElementById('listaMayusculas');
    const contenedorIVA = document.getElementById('listaIVA');
  
    const numeros = [2, 4, 6, 8, 10];
    const nombres = ['sofia', 'marcos', 'valentina', 'juan'];
    const precios = [100, 250, 75.5, 180];
  
    const mostrarArray = (contenedor, textos) => {
      contenedor.innerHTML = '';
      textos.forEach(texto => {
        const div = document.createElement('div');
        div.textContent = texto;
        contenedor.appendChild(div);
      });
    };
  
    botonMultiplicar.addEventListener('click', () => {
      const resultado = numeros.map(numero => `Resultado: ${numero} x 3 = ${numero * 3}`);
      mostrarArray(contenedorMultiplicados, resultado);
    });
  
    botonMayusculas.addEventListener('click', () => {
      const resultado = nombres.map(nombre => nombre.toUpperCase());
      mostrarArray(contenedorMayusculas, resultado);
    });
  
    botonIVA.addEventListener('click', () => {
      const resultado = precios.map(precio => {
        const precioConIVA = (precio * 1.21).toFixed(2);
        return `Precio original: $${precio} - Con IVA: $${precioConIVA}`;
      });
      mostrarArray(contenedorIVA, resultado);
    });
  });