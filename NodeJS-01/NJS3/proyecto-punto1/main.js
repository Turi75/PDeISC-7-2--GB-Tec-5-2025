const expres = require('express');
const app = expres();

// Servir archivos estáticos desde public/
app.use(expres.static('public'));

// Ruta raíz: envía index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Puertos
const PUERTO1 = 3000;
const PUERTO2 = 8081;

// Intentar arrancar en PUERTO1 o, en caso de error, en PUERTO2
function iniciarServidor(port) {
  const server = app.listen(port, () =>
    console.log(`Servidor corriendo en http://localhost:${port}`)
  );
  server.on('error', () => {
    const siguiente = port === PUERTO1 ? PUERTO2 : PUERTO1;
    console.error(`Puerto ${port} ocupado. Intentando ${siguiente}...`);
    iniciarServidor(siguiente);
  });
}

iniciarServidor(PUERTO1);