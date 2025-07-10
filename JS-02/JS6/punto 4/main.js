// main.js
// Servidor Express con una API simple /api/alumnos

const express = require('express');
const path = require('path');
const app = express();
const PUERTO = 3000;

// Datos de ejemplo para /api/alumnos
const listaAlumnos = [
  { id: 1, nombre: 'Ana García', edad: 21, carrera: 'Ingeniería' },
  { id: 2, nombre: 'Luis Pérez', edad: 22, carrera: 'Medicina' },
  { id: 3, nombre: 'María López', edad: 20, carrera: 'Derecho' },
  { id: 4, nombre: 'Carlos Ruiz', edad: 23, carrera: 'Arquitectura' },
  { id: 5, nombre: 'Sara Fernández', edad: 19, carrera: 'Psicología' }
];

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz: sirve el front-end
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API: devuelve la lista de alumnos como JSON
app.get('/api/alumnos', (req, res) => {
  res.json(listaAlumnos);
});

// Inicia el servidor
app.listen(PUERTO, () => {
  console.log(`Proyecto4 corriendo en http://localhost:${PUERTO}`);
});