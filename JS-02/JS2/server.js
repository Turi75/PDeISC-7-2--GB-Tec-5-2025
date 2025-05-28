const express = require('express');
const path = require('path');
const fs = require('fs'); // Importar el módulo File System

const app = express();
const PUERTO = process.env.PORT || 3000;

// Directorio donde se encuentra server.js
const directorioBase = __dirname;

// Ruta a la carpeta que contiene tus juegos
const carpetaJuegosPath = path.join(directorioBase, '1');

// Verificar si la carpeta de juegos existe
if (!fs.existsSync(carpetapublicPath)) {
    console.error(`Error: La carpeta de juegos no se encuentra en la ruta esperada: ${carpetapublicPath}`);
    console.error(`Asegúrate de que 'Pagina-juegos' exista en el mismo directorio que server.js.`);
    process.exit(1); // Terminar el proceso si la carpeta no existe
}

// Verificar si index1.html existe dentro de la carpeta de juegos
const indexPath = path.join(carpetapublicPath, 'index1.html');
if (!fs.existsSync(indexPath)) {
    console.error(`Error: El archivo 'index1.html' no se encuentra en: ${indexPath}`);
    console.error(`Asegúrate de que 'index1.html' exista dentro de la carpeta 'Pagina-juegos'.`);
    process.exit(1); // Terminar el proceso si index1.html no existe
}

// Servir archivos estáticos desde la carpeta 'Pagina-juegos'
// express.static buscará automáticamente 'index.html' o 'index1.html' (si se configura)
// como el archivo por defecto para el directorio raíz '/'.
// Por defecto, busca 'index.html'. Para que sirva 'index1.html' para '/', lo manejaremos explícitamente.
app.use(express.static(carpetapublicPath));

// Ruta principal para asegurar que sirva index1.html
app.get('/', (req, res) => {
    res.sendFile(indexPath); // Sirve explícitamente index1.html para la ruta raíz
});

// Iniciar el servidor
app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
    console.log(`Sirviendo archivos desde: ${carpetapublicPath}`);
    console.log('Abre tu navegador y ve a la dirección de arriba para jugar!');
});