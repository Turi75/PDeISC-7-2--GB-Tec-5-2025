/**
 * main.js
 * Servidor Express para almacenar personas en memoria
 */
const express = require('express');
const path = require('path');
const app = express();

// Lista en memoria
let personas = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sirve el HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Recibe un registro y lo devuelve como JSON
app.post('/enviar', (req, res) => {
  const data = req.body;
  personas.push(data);
  res.json(data);
});

// Opcional: devuelve todos los registros
app.get('/personas', (req, res) => {
  res.json(personas);
});

const PUERTO = 3000;
app.listen(PUERTO, () => console.log(`Servidor en http://localhost:${PUERTO}`));