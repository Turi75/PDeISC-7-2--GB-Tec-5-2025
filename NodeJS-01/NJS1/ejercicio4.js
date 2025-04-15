//llama a las funciones guardadas en el archivo ejercicio4_export.js y las usa para hacer los reséctivos calculos ;)

const calculos = require('./calculos');

//realiza dichos calculos 

console.log("Suma (5 + 3):", calculos.sumar(5, 3));
console.log("Resta (8 - 6):", calculos.restar(8, 6));
console.log("Multiplicación (3 * 11):", calculos.multiplicar(3, 11));
console.log("División (30 / 5):", calculos.dividir(30, 5));