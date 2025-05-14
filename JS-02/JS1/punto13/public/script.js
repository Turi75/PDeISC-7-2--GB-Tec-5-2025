// script.js
// Ejercicio 13: sort() con validación inline

document.addEventListener('DOMContentLoaded', () => {
    const inNumbers    = document.getElementById('inNumbers');
    const errNumbers   = document.getElementById('err-numbers');
    const btnSortNums  = document.getElementById('btnSortNumbers');
    const outNumbers   = document.getElementById('outNumbers');
  
    const inWords      = document.getElementById('inWords');
    const errWords     = document.getElementById('err-words');
    const btnSortWords = document.getElementById('btnSortWords');
    const outWords     = document.getElementById('outWords');
  
    const btnSortPeople= document.getElementById('btnSortPeople');
    const outPeople    = document.getElementById('outPeople');
  
    // 1) Números
    btnSortNums.addEventListener('click', () => {
      errNumbers.textContent = '';
      outNumbers.textContent = '';
      const arr = inNumbers.value
        .split(',')
        .map(s => s.trim())
        .map(s => Number(s));
      if (arr.some(n => Number.isNaN(n) || !Number.isInteger(n))) {
        errNumbers.textContent = 'Ingresa enteros separados por comas.';
        return;
      }
      arr.sort((a,b)=>a-b);
      outNumbers.textContent = `Ordenados: ${arr.join(', ')}`;
    });
  
    // 2) Palabras
    btnSortWords.addEventListener('click', () => {
      errWords.textContent = '';
      outWords.textContent = '';
      const arr = inWords.value
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length);
      if (arr.length === 0) {
        errWords.textContent = 'Ingresa palabras separadas por comas.';
        return;
      }
      arr.sort((a,b)=> a.localeCompare(b, 'es', { sensitivity: 'base' }));
      outWords.textContent = `Ordenadas: ${arr.join(', ')}`;
    });
  
    // 3) Personas
    const personas = [
      { nombre:'Ana',  edad:25 },
      { nombre:'Luis', edad:20 },
      { nombre:'María',edad:30 },
      { nombre:'José', edad:22 }
    ];
    btnSortPeople.addEventListener('click', () => {
      const copia = personas.slice();
      copia.sort((a,b)=>a.edad-b.edad);
      outPeople.innerHTML = copia
        .map(p=>`${p.nombre} (${p.edad} años)`)
        .join(', ');
    });
  });
  