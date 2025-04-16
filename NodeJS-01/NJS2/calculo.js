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
  
  function obtenerHora() {
    const fecha = new Date();
    return fecha.toLocaleTimeString();
  }// Devuelve la hora actual del dispositivo

function obtenerFecha() {
    const fecha = new Date();
    return fecha.toLocaleDateString();
  }// Devuelve la fecha actual del dispositivo

  // Exportamos las funciones para poder usarlas en  principal.js
  module.exports = {
    sumar,
    restar,
    multiplicar,
    dividir,
    obtenerHora,
    obtenerFecha
  };