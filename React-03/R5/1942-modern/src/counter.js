/**
 * @file counter.js
 * @description Archivo de ejemplo, probablemente un remanente de la plantilla
 * inicial del proyecto. No tiene ninguna función dentro del juego y puede ser eliminado.
 */

export function setupCounter(element) {
  let counter = 0
  const setCounter = (count) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}