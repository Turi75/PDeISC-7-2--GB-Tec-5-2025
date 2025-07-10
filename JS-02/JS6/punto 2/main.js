// main.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/usuarios', (req, res) => {
  // simula crear y devuelve un id aleatorio
  const nuevoId = Math.floor(Math.random() * 1000) + 1;
  res.json({ id: nuevoId });
});

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

const PUERTO = 3000;
app.listen(PUERTO, () =>
  console.log(`Proyecto2 corriendo en http://localhost:${PUERTO}`)
);