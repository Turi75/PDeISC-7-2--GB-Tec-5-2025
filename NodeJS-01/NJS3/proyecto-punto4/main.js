const expres = require('express');
const app = expres();

// Servir archivos estáticos desde la carpeta 'public'
app.use(expres.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PUERTO1 = 3000;
const PUERTO2 = 8081;

/**
  Inicia el servidor en el puerto indicado, y si está ocupado,
  alterna al otro puerto.
  @param {number} port - numero de puerto donde intentar levantar.
 */
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