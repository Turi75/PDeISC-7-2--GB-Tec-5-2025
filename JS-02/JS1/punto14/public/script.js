// script.js
// Ejercicio 14: reverse() con validaciones inline

document.addEventListener('DOMContentLoaded', () => {
    const inLetras      = document.getElementById('inLetras');
    const errLetras     = document.getElementById('err-letras');
    const btnReverseL   = document.getElementById('btnReverseLetras');
    const outLetras     = document.getElementById('outLetras');
  
    const inNumsRev     = document.getElementById('inNumRev');
    const errNumsRev    = document.getElementById('err-numeros-rev');
    const btnReverseN   = document.getElementById('btnReverseNums');
    const outNumsRev    = document.getElementById('outNumsRev');
  
    const inTexto       = document.getElementById('inTexto');
    const errTexto      = document.getElementById('err-texto');
    const btnReverseT   = document.getElementById('btnReverseTexto');
    const outTexto      = document.getElementById('outTexto');
  
    // 1) Letras
    btnReverseL.addEventListener('click', () => {
      errLetras.textContent = '';
      outLetras.textContent = '';
      const arr = inLetras.value
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
      if (arr.length === 0) {
        errLetras.textContent = 'Ingresa letras separadas por comas.';
        return;
      }
      const invertido = arr.reverse();
      outLetras.textContent = `Invertido: ${invertido.join(', ')}`;
    });
  
    // 2) Números
    btnReverseN.addEventListener('click', () => {
      errNumsRev.textContent = '';
      outNumsRev.textContent = '';
      const arr = inNumsRev.value
        .split(',')
        .map(s => s.trim())
        .map(s => Number(s));
      if (arr.some(n => !Number.isInteger(n))) {
        errNumsRev.textContent = 'Ingresa números enteros separados por comas.';
        return;
      }
      const invertido = arr.reverse();
      outNumsRev.textContent = `Invertido: ${invertido.join(', ')}`;
    });
  
    // 3) Texto
    btnReverseT.addEventListener('click', () => {
      errTexto.textContent = '';
      outTexto.textContent = '';
      const txt = inTexto.value;
      if (!txt) {
        errTexto.textContent = 'Escribe un texto.';
        return;
      }
      const invertido = txt.split('').reverse().join('');
      outTexto.textContent = `Invertido: ${invertido}`;
    });
  });