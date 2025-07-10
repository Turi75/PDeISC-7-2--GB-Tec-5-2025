// main.js
// Servidor Express que sirve los archivos estáticos de proyecto1

const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const axios = require('axios');

const app = express();
const PUERTO = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// /api/fetch
app.get('/api/fetch', async (req, res) => {
  try {
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');
    const datos = await respuesta.json();
    fs.writeFileSync('usuarios.json', JSON.stringify(datos, null, 2), 'utf8');
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: 'Error en Fetch' });
  }
});

// /api/axios
app.get('/api/axios', async (req, res) => {
  try {
    const respuesta = await axios.get('https://jsonplaceholder.typicode.com/users');
    const datos = respuesta.data;
    fs.writeFileSync('usuarios.json', JSON.stringify(datos, null, 2), 'utf8');
    res.json(datos);
  } catch (err) {
    res.status(500).json({ error: 'Error en Axios' });
  }
});

app.listen(PUERTO, () =>
  console.log(`Proyecto1 corriendo en http://localhost:${PUERTO}`)
);