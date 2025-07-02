// main.js
// Servidor Express que importa CZooAnimal y expone API para el formulario

const express = require('express');
const path = require('path');
const CZooAnimal = require('./zooAnimal');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Almacenamos en memoria los animales
const listaAnimales = [];

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Recibe un nuevo animal y devuelve la lista entera
app.post('/api/animales', (req, res) => {
  const { id, nombre, numeroJaula, tipoAnimal, peso } = req.body;
  const animal = new CZooAnimal(
    parseInt(id),
    nombre,
    parseInt(numeroJaula),
    parseInt(tipoAnimal),
    parseFloat(peso)
  );
  listaAnimales.push(animal);
  res.json(listaAnimales);
});

const PUERTO = 3000;
app.listen(PUERTO, () =>
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`)
);