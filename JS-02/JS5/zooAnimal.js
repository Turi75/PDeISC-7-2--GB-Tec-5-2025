// zooAnimal.js
// Define y exporta la clase CZooAnimal

class CZooAnimal {
    constructor(id, nombre, numeroJaula, tipoAnimal, peso) {
      this.id = id;
      this.nombre = nombre;
      this.numeroJaula = numeroJaula;
      this.tipoAnimal = tipoAnimal; // 1=Felino, 2=Ave, 3=Reptil, 4=Otro
      this.peso = peso;
    }
  }
  
  module.exports = CZooAnimal;