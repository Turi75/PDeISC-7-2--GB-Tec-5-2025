//se crean todas las funciones de suma, resta, multiplicacion y division

function sumar(a, b) {
    return a + b;
  }
  
  function restar(a, b) {
    return a - b;
  }
  
  function multiplicar(a, b) {
    return a * b;
  }
  
  function dividir(a, b) {
    return a / b;
  }
  
  // Exportamos las funciones para poder usarlas en otro archivo ejercicio4_import.js
  module.exports = {
    sumar,
    restar,
    multiplicar,
    dividir
  };