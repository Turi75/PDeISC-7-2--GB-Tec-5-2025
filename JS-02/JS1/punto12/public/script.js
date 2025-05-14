// script.js
// Ejercicio 12: reduce() con validación inline

document.addEventListener('DOMContentLoaded', () => {
    const inSumar       = document.getElementById('inSumar');
    const errSumar      = document.getElementById('err-sumar');
    const btnSumar      = document.getElementById('btnSumar');
    const outSumar      = document.getElementById('outSumar');
  
    const inMultiplicar = document.getElementById('inMultiplicar');
    const errMultiplicar= document.getElementById('err-multiplicar');
    const btnMultiplicar= document.getElementById('btnMultiplicar');
    const outMultiplicar= document.getElementById('outMultiplicar');
  
    const inPrecios     = document.getElementById('inPrecios');
    const errPrecios    = document.getElementById('err-precios');
    const btnTotalPrecios= document.getElementById('btnTotalPrecios');
    const outTotalPrecios= document.getElementById('outTotalPrecios');
  
    // Helpers
    function parseEnteros(text) {
      return text
        .split(',')
        .map(s => s.trim())
        .map(s => Number(s));
    }
    function parseFloats(text) {
      return text
        .split(',')
        .map(s => s.trim())
        .map(s => Number(s));
    }
  
    // 1) Sumar enteros
    btnSumar.addEventListener('click', () => {
      errSumar.textContent = '';
      outSumar.textContent = '';
      const nums = parseEnteros(inSumar.value);
      if (nums.some(n => !Number.isInteger(n))) {
        errSumar.textContent = 'Ingresa solo números enteros, separados por comas.';
        return;
      }
      const total = nums.reduce((ac, v) => ac + v, 0);
      outSumar.textContent = `Suma: ${total}`;
    });
  
    // 2) Multiplicar enteros
    btnMultiplicar.addEventListener('click', () => {
      errMultiplicar.textContent = '';
      outMultiplicar.textContent = '';
      const nums = parseEnteros(inMultiplicar.value);
      if (nums.some(n => !Number.isInteger(n))) {
        errMultiplicar.textContent = 'Ingresa solo números enteros, separados por comas.';
        return;
      }
      const producto = nums.reduce((ac, v) => ac * v, 1);
      outMultiplicar.textContent = `Producto: ${producto}`;
    });
  
    // 3) Total de precios
    btnTotalPrecios.addEventListener('click', () => {
      errPrecios.textContent = '';
      outTotalPrecios.textContent = '';
      const precios = parseFloats(inPrecios.value);
      if (precios.some(p => isNaN(p))) {
        errPrecios.textContent = 'Ingresa solo números (decimales permitidos) separados por comas.';
        return;
      }
      const total = precios.reduce((ac, v) => ac + v, 0);
      outTotalPrecios.textContent = `Total precios: $${total.toFixed(2)}`;
    });
  });