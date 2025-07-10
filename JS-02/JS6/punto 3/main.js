// server.js

// acá nos traemos express para montar el servidor
const express = require('express');
// creamos la aplicación, que es el aparato principal de express
const app = express();
// el puerto donde va a correr nuestro sitio
const port = 3000;

// acá le decimos que todo lo que está en la carpeta 'public' se puede ver desde el navegador
app.use(express.static('public'));

// ponemos a """escuchar""" el servidor en el puerto que dijimos
app.listen(port, () => {
    // un mensajito para la terminal que avisa que ya arrancó todo
    console.log(`servidor de archivos estáticos corriendo en http://localhost:${port}`);
});